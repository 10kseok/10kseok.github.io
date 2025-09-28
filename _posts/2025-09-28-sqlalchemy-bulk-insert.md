---
layout: post
title: SQLAlchemy Bulk Insert
date: 2025-09-28 14:55 +0900
description: SQLAlchemy에서 대량 데이터 삽입 시 성능 최적화 방법과 각 방법의 한계점 분석
category: [프로그래밍, Python]
tags: [FastAPI, SQLAlchemy, ORM]
---

얼마 전 회사 동료분이 우리가 다수의 데이터 생성시 사용하는 메서드에서 n번의 insert문이 발생한다고 했다.
확인해보니 정말 그랬고 원인을 알아보고자 했다.  
다수 데이터 생성시 SQLAlchemy에서 제공하는 add_all 메서드를 사용했는데 이 메서드의 동작 방식이 그러했다.  
SQLAlchemy 개발자도 이것을 인지하고 있을텐데 왜 이런 방식을 채택했는지 궁금해졌다.  
그래서 n번의 insert문 실행 원인에 대해 알아보고, 대량 데이터 처리 시 효율적인 방법을 알아보고자 한다.


## bulk insert시 문제점

SQLAlchemy에서 여러 엔터티(영속성 객체)를 한번에 추가할 때 일반적으로 `session.add_all()` 메서드를 사용한다.

```python
users = [User(name=f"user{i}") for i in range(1000)]
session.add_all(users)
session.commit()
```

add_all() 메서드는 내부적으로 루프를 돌며 add() 메서드를 여러 번 호출하게 구현되어 있다.

```python
def add_all(self, instances: Iterable[object]) -> None:
    ...
    for instance in instances:
        self.add(instance, _warn=False)
```

그리하여, add_all() 메서드를 사용하여 1000개의 객체를 추가하고 `flush()` 또는 `commit()`으로 저장하면,
실제로는 1000개의 개별 INSERT 문이 실행된다.

```sql
INSERT INTO users (name) VALUES ('user1');
INSERT INTO users (name) VALUES ('user2');
INSERT INTO users (name) VALUES ('user3');
-- ... 1000개의 개별 INSERT 문
```

n이 적을 때는 문제가 없겠지만, n이 커질수록 쿼리당 라운드트립 시간 * n 만큼 실행 시간이 늘어나게 된다.

## add_all() 메서드의 대안

대부분의 데이터베이스는 다중 행 삽입(bulk insert)을 지원하는데 이를 활용하면 성능을 크게 향상시킬 수 있다.
bulk insert는 단일 INSERT 문으로 여러 레코드를 한 번에 삽입하는 방식이다. SQLAlchemy는 총 3가지 방법을 제공한다.

### 1. bulk_save_objects
```python
from sqlalchemy.orm import Session
users = [User(name=f"user{i}") for i in range(1000)]
session.bulk_save_objects(users)
session.commit()
```

### 2. bulk_insert_mappings
```python
from sqlalchemy.orm import Session
user_data = [{"name": f"user{i}"} for i in range(1000)]
session.bulk_insert_mappings(User, user_data)
session.commit()
```

### 3. core의 execute() 메서드 사용
```python
from sqlalchemy import insert
user_data = [{"name": f"user{i}"} for i in range(1000)]
stmt = insert(User).values(user_data)
session.execute(stmt)
session.commit()
```

이 메서드들은 단일 INSERT 문으로 여러 레코드를 한 번에 삽입하여 성능을 크게 향상시킨다.
bulk_save_objects은 엔터티 기반으로 데이터 삽입을 지원하며, bulk_insert_mappings은 딕셔너리 기반으로 삽입을 지원한다.
bulk_insert_mappings은 엔터티 객체를 생성하지 않으므로 메모리 사용량이 더 적다. 

두 메서드에 공통적으로 return_defaults 파라미터가 존재하는데, returing 구문을 지원해주는 데이터베이스인 경우에 이것을 True로 설정하면 생성된 레코드를 객체로 반환받을 수 있다.

## Bulk 메서드의 한계

생성된 객체를 반환받는다는 것은 곧 다시 세션(JPA의 영속성 컨텍스트)에 추가된다는 의미이다. 다시 세션에 추가되면 변경사항들을 추적할 수 있게 되고 별다른 조회 없이도 추가적인 작업이 가능해 유용하다.

하지만 MySQL은 다른 데이터베이스(PostgreSQL, MariaDB, SQLite 등)와 달리 `RETURNING` 구문을 지원하지 않는다.
따라서, MySQL에서는 bulk 메서드를 사용하여 생성된 엔터티를 반환받을 수 없다.  

엄밀히 말하자면 return_defaults 인자를 True로 전달하면 반환 받을 수 있으나, 이 경우에는 개별 INSERT 문이 실행되어 bulk 메서드의 성능 이점이 사라진다. SQLAAlchemy 공식 문서에서도 MySQL과 같은 경우에는 이 인자를 권장하지 않고 차라리 add_all() 사용을 권장한다.[^footnote]

MySQL에서 bulk 메서드를 사용할 때 생성된 엔터티를 반환받아야 한다면 결국 다시 조회해야하는데 다음과 같은 방법을 고려할 수 있다.

1. bulk 메서드로 데이터를 삽입한 후, 가장 마지막으로 삽입된 ID를 기준으로 생성된 갯수만큼 다시 조회하는 방법
2. bulk_id와 같은 필드를 추가하여 삽입 시점에 고유한 값을 부여하고, 삽입 후 이 값을 기준으로 다시 조회하는 방법

1번 같은 경우에는 innodb_autoinc_lock_mode 설정에 따라 유효하지 않을 수 있다.   
innodb_autoinc_lock_mode가 0(traditional) 또는 1(consecutive)인 경우에는 Bulk Insert 과정 중 락을 잡고 있기에 생성된 레코드들의 id가 연속적이지만, interleaved 모드인 경우에는 중간에 다른 세션에서 삽입이 발생할 수 있어 유효하지 않다.

2번은 삽입 시점에 고유한 값을 부여하는 작업이 추가로 필요하여 번거롭다. 이 필드는 삽입 시점에만 의미가 있으므로 계속 남겨두기엔 꺼려질 수 있다.

## SQLAlchemy 동작 방식 이해

앞에서 말한 session 설명.... ING

### Identity Map
SQLAlchemy는 세션 내에서 객체의 고유성을 보장하기 위해 Identity Map 패턴을 사용한다. 각 객체는 메모리에서 단 하나의 인스턴스만 존재한다.

### Unit of Work
변경사항을 추적하고 commit 시점에 한 번에 데이터베이스에 반영하는 패턴이다. 이로 인해 `add_all()`은 각 객체의 상태를 추적해야 하므로 개별 INSERT가 발생한다.

## 결론

- `add_all()` 사용 시 개별 INSERT 문이 여러 번 실행됨을 인지해야 한다
- 대량 데이터 삽입 시에는 `bulk_save_objects()` 또는 `bulk_insert_mappings()` 사용을 권장한다
- Bulk 메서드는 성능상 이점이 있지만, 생성된 엔터티를 반환하지 않으므로 필요시 추가 처리가 필요하다
- 상황에 따라 적절한 방법을 선택하여 성능과 기능 요구사항의 균형을 맞춰야 한다


## 참고문서
[^footnote]: [SQLAlchemy 공식 문서 - Bulk Operations](https://docs.sqlalchemy.org/en/20/orm/session_api.html#sqlalchemy.orm.Session.bulk_save_objects)