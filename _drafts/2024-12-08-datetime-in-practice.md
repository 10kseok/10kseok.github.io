---
layout: post
title: "[Python] timezone을 대응하는 datetime 사용법"
date: 2024-12-08 23:55 +0900
description: 알고리즘 풀이
category: [프로그래밍, Python]
tags: [python, datetime]
---

datetime 모듈은 파이썬에서 날짜와 시간을 다룰 때 기본적으로 사용되지만, 시간대(Timezone)를 다루는 데 약간의 주의가 필요하다. 특히 시간대가 없는 객체를 다루거나, 시간대 변환을 할 때 적절한 방법을 사용하는 것이 중요하다. 이 글에서는 시간대 변환과 관련된 다양한 방법들을 정리해 본다.

## 1. 타임존을 단순히 추가하기
타임존만 추가
때로는 시간은 그대로 두고, 타임존 정보만 추가해야 할 때가 있다. 이런 경우에는 datetime.replace()를 사용하면 된다.

```python
from datetime import datetime, timezone, timedelta

# 기존 UTC 시간
utc_time = datetime(2024, 12, 7, 15, 30)

# 타임존 추가 (UTC)
utc_time_with_tz = utc_time.replace(tzinfo=timezone.utc)
print(f"UTC Time: {utc_time_with_tz}")
```
이 방식은 시간 값은 그대로 두고 단순히 타임존 정보를 추가한다. 만약 올바른 시간 변환까지 필요하다면 다른 방법을 사용해야 한다.

## 2. 시간과 타임존을 모두 변환
### pytz 사용
pytz 라이브러리를 사용하면 다양한 타임존을 관리할 수 있다.

```python
from datetime import datetime
import pytz

# 기존 UTC 시간
utc = pytz.utc
utc_time = utc.localize(datetime(2024, 12, 7, 15, 30))

# KST로 변환
kst = pytz.timezone("Asia/Seoul")
kst_time = utc_time.astimezone(kst)

print(f"KST Time (converted): {kst_time}")
```

## 3. 타임존이 누락된 객체 처리
때로는 타임존 정보가 없는 datetime 객체(naive datetime)를 처리해야 할 때가 있다. 이 경우, 타임존 정보를 명시적으로 추가한 후 변환 작업을 진행해야 한다.

### 타임존 추가 방법
#### pytz.localize() 사용
pytz.localize()는 서머타임(DST)을 고려하므로 안전하다.

```python
import pytz
from datetime import datetime

naive_time = datetime(2024, 12, 7, 15, 30)
utc_time = pytz.utc.localize(naive_time)
print(f"UTC Time: {utc_time}")
```

#### datetime.replace() 사용
단순히 타임존 정보를 추가하는 경우 replace()를 사용할 수 있다. 하지만 이 방식은 서머타임을 고려하지 않는다.

```python
from datetime import datetime, timezone

naive_time = datetime(2024, 12, 7, 15, 30)
utc_time = naive_time.replace(tzinfo=timezone.utc)
print(f"UTC Time: {utc_time}")
```

## 4. 요약
타임존만 추가 (시간은 변경 없음) :	datetime.replace(tzinfo=...) 사용    
시간과 타임존 모두 변환 :	astimezone(target_timezone) 사용	  
타임존 누락된 객체 처리 후 변환	pytz.localize(naive_time) 또는 replace()로 추가 후 astimezone 사용	

## 마무리
타임존을 다루는 것은 시간 데이터를 정확히 처리하기 위해 매우 중요하다. 위에서 정리한 방법들을 활용하면 datetime 객체를 올바르게 변환하거나, 타임존 정보를 추가할 수 있다. 특히, 타임존 정보가 없는 경우에는 반드시 명시적으로 타임존을 추가한 뒤 변환 작업을 해야 한다는 점을 기억하자.