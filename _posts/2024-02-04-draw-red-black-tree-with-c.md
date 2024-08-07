---
layout: post
title: C(repas)로 그린 빨강-검정나무
date: 2024-02-04 17:03 +0900
description: RB 트리 구현기
category: [컴퓨터과학, Data Structure]
tags: [그래프, 트리, 이진 탐색 트리, RB 트리]
---

자료구조에서의 연산은 크게 조회, 삭제, 삽입 등이 있다. 어떤 연산이 자주 일어나는 지에 따라 그에 맞는 자료구조들이 존재한다. 같은 특성을 보이는 자료구조일지라도 특화된 연산이 다르며, 알맞은 자료구조를 선택한다면 최적의 성능을 기대해볼 수 있다.

이번에 얘기할 주제는 Red-Black 트리이다. (줄여서) RB 트리는 이분 탐색을 자료구조화 시킨 이진 탐색 트리 중 하나이다. RB 트리는 똑똑하게 작동해야하는 운영체제의 스케쥴링에서도 사용된다. RB 트리가 어떠한 특성을 가지며 어떻게 구현되었는지 살펴보고, C 언어로 구현까지 진행해보겠다.

# 균형 이진 트리
---
우선 RB 트리의 탄생을 이해하려면 `이진 탐색 트리`의 특성을 알아야한다.
이진 탐색 트리에서는 데이터 삽입시 노드 기준으로 작으면 왼쪽, 크면 오른쪽으로 나눠서 데이터를 저장한다.
그렇다보니, 데이터들은 항상 정렬되어 있으며, 탐색시 이분 탐색이 가능해지면서 시간복잡도가 __O(logN)__ 으로 가능했다.
하지만 데이터가 우리가 생각하는 이진 트리에 맞게끔 들어올 경우에만 그러하다.
혹여나, 데이터가 정렬되어 순차적으로 들어오게 된다면, 트리가 한쪽으로 쏠려 결국 연결리스트와 다를 바가 없어진다.
> *연결리스트가 된다는 것은 탐색시 시간복잡도가 __O(N)__ 이 되는 것을 의미한다.*

![이진 탐색 트리가 연결리스트가 된 그림](https://koesnam.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F6e29bccb-b5af-45f7-9726-6b92c3af467e%2Ffd7502d4-88ec-48ba-9292-7cf60a68b3c9%2FIMG_ADE34BEDA4F9-1.jpeg?table=block&id=8ee7732d-807a-432a-915c-7f3677564a09&spaceId=6e29bccb-b5af-45f7-9726-6b92c3af467e&width=2000&userId=&cache=v2)
_1~6의 값이 순차적으로 삽입되었을 때의 이진 탐색 트리_

그렇다보니 트리에 데이터가 어떻게 들어오든, 우리가 생각하는 이진 트리의 구조를 맞춰줄 방법이 필요하다. 이러한 행위를 균형을 맞춘다라고 하며, 데이터 변경시 스스로 균형을 맞추는 트리를 `자가 균형 이진 트리`라고 한다. 이 균형 이진 트리에는 **AVL 트리, RB 트리** 등이 있다.
> *균형 트리로 보면 훨씬 더 많은 트리가 존재한다.* ex) B-Tree, 위상 정렬 트리, 최소 스패닝 트리 ...

**AVL(Adelson-Velsky and Landis) 트리**는 각 자식 노드가 만드는 서브 트리의 높이 차를 계산하여 균형을 맞추는 트리이다.
이러한 높이 차를 `균형 계수`(Balance Factor)라고 부르며, 이 값은 **-1, 0, 1** 셋 중 하나의 값을 가져야한다. 이러한 균형은 트리의 `회전`(Rotate)을 통해서 맞춰지며, 회전이 일어나는 시점은 균형 계수가 앞서 말한 -1, 0, 1의 범위에서 벗어난 경우이다.

AVL 트리는 균형을 엄격하게 잡기에 탐색에는 유리하나, 삽입/삭제시에 이러한 BF 값을 제대로 만족하는지 삽입/삭제되는 노드부터 루트 노드까지 계산(retracing)하므로, 삽입/삭제시 많은 연산이 발생한다. 따라서 삽입/삭제가 잦은 데이터는 균형을 엄격하게 잡는 AVL 트리에 저장하기에는 무리가 있어, 수정보단 **탐색이 용이한**, 예를 들자면 사전같은 **데이터를 저장하기에 적합**하다.

> *retracing : 각 노드의 BF 값이 일관성있게 만족하는지 확인하는 것*

# Red-Black 트리
---
RB 트리는 빠른 조회를 원하고, **삽입과 삭제가 잦은 데이터를 저장**하기에 더 적합한 자료구조이다. 그 이유는 RB 트리가 균형을 맞추는 방법에 있다. RB 트리는 노드에 색상을 나타내는 정보를 더해서 이를 이용하여 균형을 맞추는 **자가 균형 이진 트리**이다.  

노드의 색상이 특정 규칙을 만족시키지 않을 때 `재색칠`(Recoloring) 또는 `회전`(Rotate)을 하게 되며, 이를 통해 트리의 균형을 맞춰 나간다. 이러한 작업은 삽입되는 위치 근처에서 일어나게 되며, 특정 상황에는 균형이 안 맞기도 한다. 이로 인해 AVL 트리에 비해 균형은 조금 덜 잡혀있게 되지만, 삽입과 삭제시에 오버헤드가 적어 유리하다.

![1~7 까지 삽입시 이미지](https://github.com/10kseok/10kseok.github.io/assets/76582376/a83169b7-363e-4795-98a6-2fb66a90c54c)
_[Red-Black Tree 시각화 사이트](https://www.cs.usfca.edu/~galles/visualization/RedBlack.html)_

## 특성
RB 트리는 스스로 균형을 맞추기 위해 아래와 같은 5가지의 특성을 가지게 된다.
1. **모든 노드의 색은 Red 나 Black이다.**
2. **루트 노드는 Black이여야 한다.**
3. **리프 노드는 Black이다.  (_*리프 노드는 nil 값을 가진 노드를 말한다._)**
4. **Red 노드의 자식 노드는 Black이다.(= Red 노드는 연속일 수 없다.)** 
5. **임의의 노드에서 리프 노드까지의 경로에 있는 Black 노드의 갯수는 동일하다.**   

위 특성들을 하나라도 빠짐없이 모두 만족해야 RB 트리라고 부를 수 있다.  
하지만 삽입/삭제로 데이터 변경을 일으키면(삽입시 노드는 항상 Red), 위와 같은 특성을 만족하지 못하게 된다.
이 시점에서 위 5가지 규칙을 만족시키기 위해 삽입되는 지점의 부모 노드의 색을 바꿔주거나, 삼촌 노드 또는 자식 노드의 색을 바꾼 뒤 회전시키는 등의 작업을 하게 되는 것이다.

## 구현
RB 트리를 구현하는데 있어 기본적인 것은 이진 트리와 유사하다. 그 위에 RB 트리에 규칙을 맞춰주는 연산을 더하면 RB 트리가 되는 것이다.

트리의 끝을 나타내기 위해 nil 노드가 존재하는데, 이 nil 노드는 각자 개별적으로 가져도 되지만, 사용되는 메모리를 고려해서 하나의 nil 노드만을 가질 수도 있다.
> 공통된 nil값을 가지는 하나의 노드를 *Sentinel Node라고 부른다*

이 글에서는 자세한 구현 사항은 구현 결과가 담긴 레포지토리를 남기는 것으로 하고, 핵심적인 연산의 의사코드(pseudo code)만을 살펴보겠다.

우선은, 트리의 특성을 복구시키는데 필요한 회전이다. 회전은 왼쪽 회전과 오른쪽 회전으로 나눠서 볼 수 있는데, 왼쪽 회전의 코드에서 변수의 위치값만 바뀌면 오른쪽 회전 코드가 된다.
```c
left_rotate(tree, cur_node)
    right_node = cur_node.right
    cur_node.right = right_node.left
    if right_node.left != tree.nil // tree.nil은 Sentinel Node를 말한다
        right_node.left.parent = cur_node
    right_node.parent = cur_node.parent

    if cur_node.parent == tree.nil // 현재 노드가 부모 노드가 없다는 뜻은 현재 노드가 루트임을 뜻한다
        tree.root = right_node
    else if cur_node == cur_node.parent.left // 현재 노드가 부모 노드의 왼쪽 자식이면
        cur_node.parent.left = right_node // 부모 노드의 왼쪽 자식을 바뀐 노드로 변경해준다
    else 
        cur_node.parent.right = right_node

    right_node.left = cur_node
    cur_node.parent = right_node
```

위 코드는 사실 그림으로 보는 것이 이해가 빠르다. 따라서 코드를 그림으로 나타내면 아래와 같다.  
![left-rotate](https://koesnam.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F6e29bccb-b5af-45f7-9726-6b92c3af467e%2F54a07725-6b84-4e22-9042-73b15497348c%2FIMG_E4F83942A738-1.jpeg?table=block&id=2fd1499a-6348-4a33-a8f9-71f052480411&spaceId=6e29bccb-b5af-45f7-9726-6b92c3af467e&width=2000&userId=&cache=v2)

RB 트리의 연산에서 삭제 후 복구하는 로직이 가장 어렵기도 하며 중요하다. 삭제될 때 발생하는 경우가 4가지 정도가 있다. 이 때 처리되는 방식은 다 다르며, 이를 간단하게 하기 위해서 공통되는 로직으로 변환하여 처리할 수 있다.

1. **삭제되는 노드(흑색 노드)의 형제 노드가 적색인 경우**
2. **삭제되는 노드(흑색 노드)의 형제 노드가 흑색이고, 두 자식이 모두 흑색인 경우**
3. **삭제되는 노드(흑색 노드)의 형제 노드가 흑색이고, 형제 노드의 왼쪽 자식은 적색, 오른쪽 자식이 흑색인 경우**
4. **삭제되는 노드(흑색 노드)의 형제 노드가 흑색이고, 형제 노드의 오른쪽 자식이 적색인 경우**

경우 1번은 경우 2번 형태로 변환하여 처리할 수 있으며, 경우 3번은 4번 형태로 변환하여 처리할 수 있다. 이를 코드로 나타내보자.

```c
delete_fixup(tree, delete_node)
    while delete_node != tree.root and delete_node.color == BLACK
        // 삭제되는 노드가 부모 노드 기준으로 왼쪽 자식일 때
        if delete_node == delete_node.parent.left
            brother_node = delete_node.parent.right
            // 경우 1
            if brother_node.color == RED
                brother_node.color == BLACK
                delete_node.parent.color = RED
                left_rotate(tree, delete_node.parent)
                brother_node = delete_node.parent.right
            // ---
            // 경우 2
            if brother_node.left.color == BLACK and brother_node.right.color == BLACK
                brother_node.color = RED
                delete_node = delete_node.parent
            // ---
            else 
                // 경우 3
                if brother_node.right.color == BLACK
                    brother_node.left.color == BLACK
                    brother_node.color = RED
                    left_rotate(tree, brother_node)
                    brother_node = delete_node.parent.right
                // ---
                // 경우 4
                brother_node.color = delete_node.parent.color
                delete_node.parent.color = BLACK
                brother_node.right.color = BLACK
                left_rotate(tree, delete_node.parent)
                delete_node = tree.root
        // 삭제되는 노드가 부모 노드 기준으로 오른쪽 자식일 때, 위 코드에서 left <-> right를 대칭적으로 바꿔주면 된다
    delete_node.color = BLACK
```
복구하는 연산은 삭제 연산 코드에서 제일 마지막에서 실행되며, 이를 통해 매 삭제시에도 트리가 RB 트리의 특성을 만족시키게 된다.

# 마무리
---
RB 트리는 특정 규칙을 만족시키기 위해 트리를 변형해가며 균형을 맞춘다는 것을 알게 되었다. 이를 통해 조회 성능은 일관적이며, 삽입/삭제에도 유리한 이유를 알 수 있었다. 하지만 그렇다고 모든 곳에서 RB 트리를 쓰진 않았다. 많은 데이터들을 다루는 DBMS 같은 경우에 RB 트리를 사용하지 않는다. RB 트리 같은 이진 트리는 데이터가 많아질수록 트리의 높이가 매우 커지며, 특정한 하나의 값을 찾는데에만 특화되어 있기 때문이다.

따라서, DBMS 같은 경우에는 B-Tree 같은 자료구조를 채택하며, 이는 노드당 갖는 데이터 양을 늘려 트리를 압축시켰으며, DBMS에서 자주 쓰이는 **범위 연산**에도 우수한 성능을 보이게 된다. 이처럼 하나의 자료구조가 만능인 경우는 잘 없고, 각각 필요한 연산에 특화된 자료구조만이 있음을 알게 되었다.

## 구현 결과
- [RB-Tree 레포지토리](https://github.com/10kseok/rbtree-lab)

## 참고자료
- [Red-Black Tree, Wikipedia](https://en.wikipedia.org/wiki/Red%E2%80%93black_tree)
- Introduction to Algorithms(CLRS), third edition