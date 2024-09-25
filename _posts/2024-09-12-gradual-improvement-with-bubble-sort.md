---
layout: post
title: "[WRITING] 버블 정렬로 해보는 점진적 개선: 버블 정렬에서 칵테일 정렬까지"
date: 2024-09-12 23:43 +0900
description: 버블 소트로 해보는 점진적 개선
category: [컴퓨터과학, Algorithm]
tags: [버블 소트, 버블 정렬, 점진적 개선, python]
---

버블 정렬은 가장 간단한 정렬 알고리즘으로 꼽을 수 있다. 구현이 매우 간단하여 급하게 정렬 알고리즘이 필요할 때 요긴하게 쓰인다. 하지만, 시간 복잡도에서 최악의 경우 O(n^2)이 나오기 때문에 대용량 데이터에서 빠른 성능을 기대하기는 어렵다. 그럼에도 불구하고, 버블 정렬도 몇가지를 개선하면 나름의 성능을 끌어올릴 수가 있다.  

이것을 주제로 발표를 한적도 있었는데, 이 때 무슨 자신감이였는지 화이트보드 코딩에 도전했었다. 중간에 머리가 새까매져 단체 일시정지가 있었지만, 어찌저찌 잘 마무리하여 겸손이 주입될 수 있었던 좋은 경험이였다. 재밌는 내용이라고 생각해서 이번에는 글로써 정리해보고자 한다.

## 정렬
---
정렬의 핵심 연산에는 **교환, 선택, 삽입**이 있다. 대부분의 정렬 알고리즘은 이 세가지를 응용해서 만들어졌다. **교환**은 두 원소의 위치를 서로 변경하는 것, **선택**은 특정 기준의 원소 하나를 골라내는 것, **삽입**은 특정 위치에 원소를 집어넣고 나머지를 밀어내는 것을 말한다. 정렬 알고리즘에는 버블 정렬, 셸 정렬, 퀵 정렬, 병합 정렬 등 많은 알고리즘이 존재하며 각 정렬 알고리즘마다 주로 사용하는 연산이 있다. 그 중 버블 정렬에서는 교환 연산이 주로 쓰인다.

> **정렬은 왜 하는가?**  
정렬은 효율적인 조회를 위해 필요한 동작이다. 정렬을 통해 최소, 최대값을 찾거나 특정 값을 빠르게 조회할 수 있다. 특히나, 이분 탐색에서는 특정 값을 조회하기 위해서 정렬된 것이 전제 조건이다.

단순한 정렬 알고리즘에는 버블, 삽입, 선택 정렬이 있는데, 이들은 시간 복잡도는 같으나 삽입과 교환 연산에서 차이가 있다. 인접한 두 요소만 가지고 비교하여 교환하면 버블, 가장 작은 요소를 찾아서 앞에서부터 교환하면 선택, 요소를 적절한 위치에 끼워넣으면 삽입 정렬이다.

이번에 다룰 정렬은 이 중 교환 연산을 주로하는 버블 정렬이다. 이제 버블 정렬에 대해서 자세히 알아보자.

## 버블 정렬
---
### 기본 동작  
버블 정렬의 기본 동작(오름차순 기준)은 다음과 같다.
1. 리스트의 처음부터 끝까지 이동하면서 **인접한 두 요소를 비교**한다.
2. 만약 앞의 요소가 뒤의 요소보다 크다면, **두 요소를 교환**한다.
3. 이 과정을 리스트의 끝까지 반복하면 가장 큰 요소가 리스트의 끝으로 이동하게 된다.
4. 이제 리스트의 끝에 있는 **가장 큰 요소를 제외하고, 나머지 요소들에 대해 같은 과정을 반복**한다.
5. 이 과정을 리스트의 **모든 요소가 정렬될 때(n-1번)까지 반복**한다.

조금 더 이해하기 쉽게 그림으로 보면,
![버블정렬 애니메이션](https://github.com/user-attachments/assets/cacb4b13-48da-4a59-a3bb-e52c7d332b42)
*[https://visualgo.net/en/sorting](https://visualgo.net/en/sorting)*

이를 코드로 구현하면 아래와 같다.
```python
def bubble_sort(unsorted_list):
    n = len(unsorted_list)
    for i in range(n - 1): # n - 1번 정렬
        for j in range(n-1 - i): # 이미 정렬된 요소를 제외하고 나머지 요소들만 비교
            if unsorted_list[j] > unsorted_list[j + 1]:
                unsorted_list[j], unsorted_list[j + 1] = unsorted_list[j + 1], unsorted_list[j]
```
{: file='bubble_sort.py'}

이어서 정상 동작을 확인하는 테스트 코드를 만들어서 검증해보자. main문에 그대로 테스트 해볼 수도 있지만, 추후 개선 작업에서도 쓰고 본 코드와 분리하기 위해 새로 테스트 코드를 작성하자.

```python
import unittest
import time
from bubble_sort import bubble_sort

class TestBubbleSort(unittest.TestCase):
    def test_bubble_sort(self):
        test_data = [29, 10, 14, 37, 15, 20, 38]
        start_time = time.time()
        bubble_sort(test_data)
        end_time = time.time()
        execution_time = (end_time - start_time) * 1000  # ms로 변환
        self.assertEqual(test_data, [10, 14, 15, 20, 29, 37, 38])
        print(f"실행 시간: {execution_time:.3f} ms")
```
{: file='test_bubble_sort.py'}

이를 실행시켜보면 아래와 같은 결과가 나오면서 제대로 동작하는 것을 확인할 수 있다.
```shell
test_bubble_sort (__main__.TestBubbleSort.test_bubble_sort) ... 실행 시간: 0.005 ms
ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```

### 성능 측정
개선에 앞서 현재 성능을 측정해볼 필요가 있다. 주로 사용하고 있는 연산이 비교와 교환이므로 이들의 횟수를 측정해보면 될 것이다.
```python
def bubble_sort(unsorted_list):
    n = len(unsorted_list)
    compare_count = 0
    exchange_count = 0
    for i in range(n - 1): # n - 1번 정렬
        for j in range(n-1 - i): # 이미 정렬된 요소를 제외하고 나머지 요소들만 비교
            compare_count += 1
            if unsorted_list[j] > unsorted_list[j + 1]:
                unsorted_list[j], unsorted_list[j + 1] = unsorted_list[j + 1], unsorted_list[j]
                exchange_count += 1
    print(f"\n비교 횟수 : {compare_count}회 | 교환 횟수 : {exchange_count}")
```

`[29, 10, 14, 37, 15, 20, 38]` 데이터 기준으로 첫번째 정렬에서 6번 비교, 두번째 정렬에서 5번, 세번째 정렬에서 4번, ... (6+5+4+3+2+1)해서 총 21번의 비교가 일어날 것이다. 교환 횟수는 교환해보면서 구해보자.

1. `[*29*, 10, 14, *37*, 15, 20, 38]` => `[10, 14, *29*, 15, 20, *37*, 38]` : 4번 (29 2번, 37 2번)
2. `[10, 14, *29*, 15, 20, 37, 38]` => `[10, 14, 15, 20, *29*, 37, 38]` : 2번 (29 2번)  

총 6번의 교환이 일어날 것을 예상할 수 있다.

```shell
test_bubble_sort (__main__.TestBubbleSort.test_bubble_sort) ... 
비교 횟수 : 21회 | 교환 횟수 : 6
실행 시간: 0.012 ms
ok

----------------------------------------------------------------------
Ran 1 test in 0.000s

OK
```
실제 테스트 코드 실행시에도 예상 횟수와 같다.

## 1차 개선
---
눈치 빠른 사람은 교환 횟수를 구하는 과정에서 벌써 느낌이 왔을 수도 있다. 만약 데이터가 `[10, 14, 15, 29, 20, 37, 38]` 이러한 형태를 띄면, 하나의 원소만 교환해줘도 정렬이 끝나게 된다. 하지만 현재 로직은 정렬이 끝나도 계속 비교를 이어나가게 되는데 이러면 데이터가 클수록 훨씬 비효율적이게 되는 문제가 발생한다.

정렬이 되지 않은 경우에는 반드시 한번 이상의 교환이 일어난다. 반대로, 만약 정렬이 이미 끝난 상태라면 더이상의 교환이 일어나지 않을 것이다. 그렇다면, 교환 발생 여부를 확인하여 추가적인 정렬을 멈출 수 있다.
```python
def bubble_sort_check_exchange(unsorted_list):
    n = len(unsorted_list)
    compare_count = 0
    exchange_count = 0
    for i in range(n - 1): # n - 1번 정렬
        exchanged = False
        for j in range(n-1 - i): # 이미 정렬된 요소를 제외하고 나머지 요소들만 비교
            compare_count += 1
            if unsorted_list[j] > unsorted_list[j + 1]:
                unsorted_list[j], unsorted_list[j + 1] = unsorted_list[j + 1], unsorted_list[j]
                exchange_count += 1
                exchanged = True
        if not exchanged: # 이미 정렬이 된 상태라면 정렬을 멈춘다.
            break
    print(f"\n비교 횟수 : {compare_count}회 | 교환 횟수 : {exchange_count}")
```

이미 정렬됐을 때 멈춰준 결과는 다음과 같다.
```shell
비교 횟수 : 11회 | 교환 횟수 : 1
실행 시간: 0.005 ms
```
비교 횟수가 10회나 줄어든 것을 확인할 수 있다. 하지만 실행 시간은 똑같게 나오는데 이는 데이터의 크기가 작기 때문이다. 따라서 데이터의 크기를 10,000개로 늘려서 테스트 해봤다. 10,000개의 정렬된 정수에서 하나만 정렬이 되지 않는 경우를 가정했다.

```python
...

class TestBubbleSort(unittest.TestCase):
    ...
    large_data = list(range(1, 10001))
	large_data[-1], large_data[-2] = large_data[-2], large_data[-1] # 한번 교환

    def test_bubble_sort_many(self):
		test_data = self.large_data.copy()
		start_time = time.time()
		bubble_sort(test_data)
		end_time = time.time()
		execution_time = (end_time - start_time) * 1000  # ms로 변환
		self.assertEqual(test_data, list(range(1, 10001)))
		print(f"실행 시간: {execution_time:.3f} ms")
  
	def test_bubble_sort_check_exchange_many(self):
		test_data = self.large_data.copy()
		start_time = time.time()
		bubble_sort_check_exchange(test_data)
		end_time = time.time()
		execution_time = (end_time - start_time) * 1000  # ms로 변환
		self.assertEqual(test_data, list(range(1, 10001)))
		print(f"실행 시간: {execution_time:.3f} ms")
```
{: file='test_bubble_sort.py'}

개선된 버블 정렬에 경우에 첫번째 정렬에서 모든 수가 정렬되면서 두번째 정렬 때 교환이 일어나지 않아 루프가 종료되게 된다. 이로써 일찍이 정렬이 끝날 경우 훨씬 좋은 성능을 나타나는 것을 확인했다.
```shell
test_bubble_sort_check_exchange_many (__main__.TestBubbleSort.test_bubble_sort_check_exchange_many) ... 
비교 횟수 : 19997회 | 교환 횟수 : 1
실행 시간: 1.053 ms
ok
test_bubble_sort_many (__main__.TestBubbleSort.test_bubble_sort_many) ... 
비교 횟수 : 49995000회 | 교환 횟수 : 1
실행 시간: 1999.569 ms
ok
```

데이터가 무작위로 섞인 경우에는 오히려 개선된 버블 정렬이 조금 더 느린 성능이 나왔다. 이는 교환 발생 여부를 확인하는 로직으로 인해 추가적인 작업을 하기 때문이였다.

```shell
test_bubble_sort_check_exchange_many (__main__.TestBubbleSort.test_bubble_sort_check_exchange_many) ... 
비교 횟수 : 49984847회 | 교환 횟수 : 25024270
실행 시간: 3335.016 ms
ok
test_bubble_sort_many (__main__.TestBubbleSort.test_bubble_sort_many) ... 
비교 횟수 : 49995000회 | 교환 횟수 : 25024270
실행 시간: 3271.251 ms
ok
```


## 2차 개선
---

## (3차 개선) 칵테일 정렬
---

## 마무리
---

