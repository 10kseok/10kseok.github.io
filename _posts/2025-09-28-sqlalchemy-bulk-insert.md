---
layout: post
title: SQLAlchemy Bulk Insert
date: 2026-02-01 14:55 +0900
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

add() 메서드는 객체를 세션에 추가하고 변경사항을 추적할수 있도록 한다.  
(여기서 세션은 메모리에서 관리하는 영속성 셋(set)을 의미한다. JPA의 영속성 컨텍스트와 유사하다.)    
flush() 또는 commit()이 호출되면 SQLAlchemy는 세션에 추가된 객체에 대해 개별 INSERT 문을 생성하고 실행한다.  

INSERT문 실행 후 세션에 담겨있는 객체 상태를 업데이트 작업도 추가적으로 수행하게 된다.
이 말은 곧 auto increment와 같은 필드가 존재하는 경우, 각 객체에 대해 INSERT 문이 실행된 후에 해당 필드의 값이 자동으로 할당된다는 의미이다.

그리하여, add_all() 메서드를 사용하여 1000개의 객체를 추가하고 `flush()` 또는 `commit()`으로 저장하면,
각 객체별로 상태를 업데이트하기에 실제로는 1000개의 개별 INSERT 문이 실행된다.

```sql
INSERT INTO users (name) VALUES ('user1');
INSERT INTO users (name) VALUES ('user2');
INSERT INTO users (name) VALUES ('user3');
-- ... 1000개의 개별 INSERT 문
```

n이 적을 때는 문제가 없겠지만, n이 커질수록 쿼리당 라운드트립 시간 * n 만큼 실행 시간이 늘어나게 된다.

## add_all() 메서드의 설계 의도

설계 의도를 명확히 설명하는 자료는 없었지만 0.4 버전부터 도입된 기능으로 단순하게 add 동작에 다중 원소를 대응해주기 위한 메서드로 해석할 수 있다.


## add_all() 메서드의 대안

add_all() 메서드명을 보면 기대하듯이 알아서 깔끔하게 한번에 추가해주면 좋을련만 그렇지 않으니 아쉬운 부분이다.  
성능이 중요한 경우에는 대부분의 데이터베이스는 다중 행 삽입(bulk insert)을 지원하니 이를 활용해서 성능을 크게 향상시킬 수 있다.
bulk insert는 단일 INSERT 문으로 여러 레코드를 한 번에 삽입하는 방식이다. SQLAlchemy는 이에 총 3가지 방법을 제공한다.

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
bulk_save_objects는 엔터티 기반으로 데이터 삽입을 지원하며, bulk_insert_mappings는 딕셔너리 기반으로 삽입을 지원한다.
bulk_insert_mappings는 엔터티 객체를 생성하지 않으므로 save_objects에 비하면 메모리 사용량이 더 적다. 

SQLAlchemy의 Core API를 사용하면 SQL 표현식을 직접 작성할 수 있고 add_all에 비해 30배 이상 빠르게 실행된다.[^footnote]

>bulk_* 메서드는 동기 환경에서만 지원하며 비동기 환경에서는 run_sync() 메서드를 통해서 호출해야 한다.

## MySQL에서 Bulk 메서드 한계

Bulk 메서드 사용시 return_defaults 인자(core api에서는 returing 메서드)를 True로 전달하면 생성된 엔터티를 반환받을 수 있다. 엔터티를 반환받게 되면 세션에서 다시 추가되어 변경 사항 추적이 가능하다.

대부분의 DB에서는 이렇듯 생성된 엔터티를 반환받을 수 있으나, MySQL은 불가능하다.
이 return_defaults 인자는 RETURNING 구문을 사용하여 삽입된 레코드의 기본값을 반환받는 방식으로 동작한다.

```python
session.bulk_insert_mappings(User, user_data, return_defaults=True)
# or
insert(User).values(user_data).returning(User)
```

하지만 MySQL은 다른 데이터베이스(PostgreSQL, MariaDB, SQLite 등)와 달리 `RETURNING` 구문을 지원하지 않는다.
따라서, MySQL에서는 bulk 메서드를 사용하여 생성된 엔터티를 반환받을 수 없다.  

엄밀히 말하자면 MySQL을 쓰더라도 bulk 메서드에서 return_defaults 인자를 True로 전달하면 반환 받을 수 있으나, 이 경우에는 개별 INSERT 문이 실행되어 bulk 메서드의 성능 이점이 사라진다. SQLAlchemy 공식 문서에서도 MySQL과 같은 경우에는 이 인자를 권장하지 않고 차라리 add_all() 사용을 권장한다.[^fn-nth-2]

MySQL에서 bulk 메서드를 사용할 때 생성된 엔터티를 반환받아야 한다면 결국 다시 조회해야하는데 다음과 같은 방법을 고려할 수 있다.

1. bulk 메서드로 데이터를 삽입한 후, 가장 마지막으로 삽입된 ID를 기준으로 생성된 갯수만큼 다시 조회하는 방법
2. bulk_id와 같은 필드를 추가하여 삽입 시점에 고유한 값을 부여하고, 삽입 후 이 값을 기준으로 다시 조회하는 방법

1번 같은 경우에는 innodb_autoinc_lock_mode 설정에 따라 유효하지 않을 수 있다.   
innodb_autoinc_lock_mode가 0(traditional) 또는 1(consecutive)인 경우에는 Bulk Insert 과정 중 락을 잡고 있기에 생성된 레코드들의 id가 연속적이지만, interleaved 모드인 경우에는 중간에 다른 세션에서 삽입이 발생할 수 있어 유효하지 않다.

2번은 삽입 시점에 고유한 값을 부여하는 작업이 추가로 필요하여 번거롭다. 이 필드는 삽입 시점에만 의미가 있으므로 계속 남겨두기엔 꺼려질 수 있다.

## SQLAlchemy 2.0에서는?

사실상 SQLAlchemy 2.0 버전부터는 다중 행 INSERT를 한 번에 묶어 실행하는 insertmanyvalues 최적화 기능이 들어가 대부분의 DB에서는 add_all을 사용해도 성능 차이가 거의 없다.[^fn-nth-3]
MySQL만 RETURNING 구문을 지원하지 않아 대안으로 제시됐던 메서드를 사용해야만 한다.
그러니 MySQL이 아니라면 SQLAlchemy 2.0 버전부터는 add_all을 그대로 사용하자.


## 참고문서
[^footnote]: [stackoverflow - Bulk 연산 성능 비교](https://stackoverflow.com/questions/3659142/bulk-insert-with-sqlalchemy-orm)  
[^fn-nth-2]: [SQLAlchemy 공식 문서 - Bulk Operations](https://docs.sqlalchemy.org/en/20/orm/session_api.html#sqlalchemy.orm.Session.bulk_save_objects)
[^fn-nth-3]: [SQLAlchemy 공식 문서 - 2.0 릴리즈 노트](https://www.sqlalchemy.org/blog/2023/01/26/sqlalchemy-2.0.0-released/)