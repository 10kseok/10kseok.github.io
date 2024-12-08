---
layout: post
title: "BOJ 1800: 인터넷 설치의 최소 비용 문제 - 다익스트라와 매개변수 탐색으로 해결하기"
date: 2024-09-27 18:01 +0900
description: 알고리즘 풀이
category: [컴퓨터과학, Algorithm]
tags: [BOJ, PS, 다익스트라, 매개변수 탐색, python]
---

알고리즘 문제를 풀다보면 하나의 개념만 사용해서 풀리는 문제도 많으나 난도가 높아질수록 여러 개념을 사용해야 풀 수 있다. 특정 개념이 익숙해질 때쯤 이런 문제를 풀어보면 더 탄탄하게 개념을 다질 수 있을 것이다.

## 문제 소개
세미나실에 여러 대의 컴퓨터가 있다. 이들을 연결하기 위해 필요한 케이블은 서로 다른 비용을 가지며, 특정 개수의 케이블은 무료로 제공된다. 문제의 목표는 마지막 컴퓨터(N번)를 최소 비용으로 인터넷에 연결하는 것이다. 자세한 내용은 [여기](https://www.acmicpc.net/problem/1800)서 확인할 수 있다.

## 풀이
### DFS 접근: 모든 경로 탐색
초기 접근 방법으로 깊이 우선 탐색(DFS)을 선택했다. DFS를 통해 1번 컴퓨터에서 N번 컴퓨터까지 가능한 모든 경로를 탐색하고, 초과한 케이블 수가 K 이하인 경우에 대한 경로를 찾으려 했다. 아래는 이 과정의 코드이다.

```python
# DFS 접근
def connect(node, path, visited):
    if node == n:
        routes.append(path)
        return
    visited[node] = True
    for next_n, cost in cables[node]:
        if not visited[next_n]:
            connect(next_n, path + [cost], visited[:])

routes = []
connect(1, [], [False] * (n + 1))
min_cost = 1_000_001
for r in routes:
    if len(r) <= k:
        print(0)
        return
    min_cost = min(min_cost, sorted(r, reverse=True)[k])
print(-1 if min_cost == 1_000_001 else min_cost)
```

### DFS 방식의 문제점 
그러나 이 접근 방식에는 몇 가지 문제점이 있다. DFS로 모든 경로를 탐색하다 보면, 특히 컴퓨터의 수가 많을수록 경로의 조합이 기하급수적으로 증가하여 **시간 초과**를 발생시킬 위험이 높다.

예를 들어, N이 1,000인 경우 DFS는 모든 가능한 경로를 탐색해야 하므로 시간 복잡도가 급격히 증가한다. 각 컴퓨터와 케이블 간의 연결 상태가 복잡해질수록 경로 탐색에 필요한 시간이 비효율적으로 늘어날 것이다. 따라서, DFS 방식은 현실적으로 실행하기 어렵다는 결론에 이르렀다.

이를 확실하게 하기 위해서 N이 1000이고 P가 10000, K가 0인 케이스를 만들어 실험해보았다. 관련 테스트 케이스를 구하기 힘들어 직접 테스트 케이스를 만들어내는 코드를 별도로 작성했다. 만 줄이 되는 테스트 케이스는 명령어 창에 입력이 힘들어 따로 텍스트 파일로 분리해서 테스트를 진행했다.

```python
import random

def generate_input(n, p, k, filename="input.txt"):
    with open(filename, "w") as f:
        f.write(f"{n} {p} {k}\n")
        
        edges = set()
        
        for i in range(2, n + 1):
            edges.add((1, i, 1000000))
        
        while len(edges) < p:
            u = random.randint(1, n)
            v = random.randint(1, n)
            if u != v:
                edges.add((u, v, 1000000))
        
        for u, v, cost in edges:
            f.write(f"{u} {v} {cost}\n")

# 파라미터 설정 (N=1000, P=10000, K=0)
n = 1000  # 컴퓨터의 수
p = 10000  # 케이블의 수
k = 0  # 무료로 제공되는 케이블 수

# input.txt에 입력 데이터를 저장
generate_input(n, p, k, "input.txt")
```

체감상 30분이 지나도 끝나지 않을 것 같았다. 확실히 개선이 필요하다.

## 개선: 다익스트라와 매개변수 탐색

문제를 해결하기 위해 **다익스트라 알고리즘**과 **매개변수 탐색**을 활용하는 방법으로 개선할 수 있었다. 

다익스트라 알고리즘은 그래프에서 최단 경로를 찾는 알고리즘으로, 주어진 그래프의 한 정점에서 다른 모든 정점으로의 최단 거리를 계산하는 데 효과적이다. 이 알고리즘은 우선순위 큐를 사용하여 현재까지의 최단 거리를 기준으로 다음 노드를 선택하며 진행된다. 우리 문제에서는 케이블간의 누적 비용으로 적용할 수 있다.

매개변수 탐색은 주어진 문제에서 특정한 조건을 만족하는 값을 찾기 위해 파라미터를 조정하며 탐색하는 기법이다. 이 문제에서는 **최대 비용**을 매개변수로 설정하고, 이 비용 이하로 연결이 가능한지를 체크하는 방식으로 진행할 수 있다. 즉, 주어진 케이블의 비용이 최대 비용보다 큰 경우의 초과 횟수를 세는 방식으로 연결 가능성을 평가하는 것이다.

### 1차 개선
첫 번째 개선으로 매개변수 탐색을 통해 각 경로의 초과 비용 개수를 관리하는 방식을 도입했다. 아래는 이 방식의 코드이다.
```python
def can_connect_by(max_cost):
    exceed_count = [k + 1] * (n + 1)
    exceed_count[1] = 0
    queue = [(0, 1)]  # (초과 비용의 개수, 컴퓨터 번호)
    
    while queue:
        c, computer = heappop(queue)
        for next_com, next_cost in cables[computer]:
            cur_exceed_count = exceed_count[computer]
            if next_cost > max_cost:
                cur_exceed_count += 1
            if cur_exceed_count < exceed_count[next_com]:
                exceed_count[next_com] = cur_exceed_count
                heappush(queue, (c + next_cost, next_com))
    return exceed_count[n] <= k
```

이 코드는 최대 비용 이하의 케이블로 N번 컴퓨터에 도달할 수 있는지를 판단하여 유효한 경로를 찾는다. 다익스트라 알고리즘의 변형을 통해 최단 경로를 찾는 대신 초과 비용의 개수를 세면서 진행하게 된다.

### 2차 개선
첫 번째 개선안에서도 비용을 별도로 계산해야 한다는 점은 여전히 비효율적이다. 이를 개선하기 위해 초과 횟수만 관리하는 방식으로 수정할 수 있었다. 아래는 두 번째 개선안의 코드이다.

```python
def can_connect_by_v2(max_cost):
    exceed_count = [k + 1] * (n + 1)
    exceed_count[1] = 0
    queue = [(0, 1)]  # (초과 비용의 개수, 컴퓨터 번호)

    while queue:
        count, computer = heappop(queue)
        if exceed_count[computer] < count:
            continue
        
        for next_com, next_cost in cables[computer]:
            cur_exceed_count = exceed_count[computer]
            if next_cost > max_cost:
                cur_exceed_count += 1
            if cur_exceed_count < exceed_count[next_com]:
                exceed_count[next_com] = cur_exceed_count
                heappush(queue, (cur_exceed_count, next_com))
    return exceed_count[n] <= k
```

이 방식은 비용을 따로 계산할 필요 없이 초과 횟수만 카운트하여 최종적으로 N번 컴퓨터에 도달할 수 있는지를 판단한다. 이렇게 하면 성능이 크게 개선될 수 있다.

## 결과
![풀이 결과 사진](https://github.com/user-attachments/assets/eb606e33-12cc-4f9e-b6c6-6d2f35cafb79)

## 마무리
이 과정을 통해 인터넷 연결 문제를 해결하기 위한 최적화된 알고리즘을 도출할 수 있었다. 초기 DFS 접근 방식에서 발생했던 시간 초과 문제를 해결하기 위해 다익스트라 알고리즘과 매개변수 탐색을 결합한 두 가지 개선안을 제시했다. 이러한 방식으로 주어진 문제의 복잡성을 효율적으로 관리할 수 있었다.