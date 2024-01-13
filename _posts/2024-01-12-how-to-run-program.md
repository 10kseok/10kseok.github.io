---
layout: post
title: 하드웨어 관점에서 프로그램은 어떻게 실행되는가
date: 2024-01-12 10:49 +0900
description: CSAPP 1장
category: [컴퓨터과학, Computer System]
tags: [CSAPP, C언어, Python]
---

프로그램을 실행하면, 내가 의도한 동작을 진행할 것이다. GUI가 구성되어있다면, 의도한대로 화면이 출력되는 것을 확인하여 제대로 동작하는 것을 알 수 있다.
그러나 내부에서는 무슨 일이 일어나고 있는 지는 알 수가 없다. 도대체 내부는 어떻게 동작하고 있는 지, 하드웨어들이 무슨 일을 하고 있는 지 알아보자.


## 프로그램 실행
---
먼저 다음과 같은 아주 간단한 c 파일이 있다고 가정하자.

```c
#include <stdio.h>

int main() {
    printf("Hello World");
    return 0;
}
```
{: file='hello.c'}

이 파일은 컴파일 시스템(전처리기, 컴파일러, 어셈블러, 링커)을 거쳐 `hello`라는 실행가능한 목적 파일로 변환될 것이다.

쉘 파일을 통해 이 파일을 실행해보면 다음과 같이 보여질 것이다.
![실행화면](https://koesnam.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F6e29bccb-b5af-45f7-9726-6b92c3af467e%2F35ddf74b-9f3c-4dc0-bf8e-91f6697d7b68%2FUntitled.png?table=block&id=55cd9588-8777-4355-8571-b2dd30d9ca24&spaceId=6e29bccb-b5af-45f7-9726-6b92c3af467e&width=2000&userId=&cache=v2)

그러면, 실행파일이 어떻게 위와 같이 화면에 출력될 수 있었을까?  
해당 파일을 실행시키기 위해 쉘을 사용했다.  
무엇을 실행시키는지 알기 위해 `./hello`를 사용자의 키보드 입력으로부터 가져와야하며,
어딘가 존재하는 실행파일을 읽어들여 해석할 수 있어야 한다.
그리고 해석이 끝나면 해석된 결과(`Hello World!`)를 화면에 보여줘야한다.

## 실행 과정
---
키보드 입력은 **USB Controller**에 전달되고, 전달된 내용은 **I/O Bus**를 타고 **I/O Bridge**에서 환승하여 **System Bus**을 통해 CPU에 전달된다.
이 과정에서 **Cpu**는 "hello"라는 명령을 레지스터 파일에 등록하고, **메인 메모리**에 저장한다.

![키보드 입력 과정](https://koesnam.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F6e29bccb-b5af-45f7-9726-6b92c3af467e%2Fbca5c8b1-5099-46ed-b4ae-6567705f38c1%2FUntitled.png?table=block&id=7c8e134e-a278-4a2a-b656-e784bd2f9d66&spaceId=6e29bccb-b5af-45f7-9726-6b92c3af467e&width=2000&userId=&cache=v2)

쉘 입력이 끝나면(사용자가 enter 입력시),
**직접 메모리 접근**을 통해 프로세서 접근없이, **Disk**에서 실행 파일을 조회하고
I/O Bus를 통해 I/O Bridge를 거쳐서 **Memory Bus**를 타고 파일 내용을 메인 메모리에 복사하게 된다.
이 때 코드과 데이터("Hello World")를 메인 메모리에 저장하게 되는 것이다.

![파일 조회](https://koesnam.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F6e29bccb-b5af-45f7-9726-6b92c3af467e%2Fce4c0dc2-51b9-4d65-b677-173ba759c7aa%2FUntitled.png?table=block&id=52dae94d-cbbd-4ff6-8b3e-fe4536baae43&spaceId=6e29bccb-b5af-45f7-9726-6b92c3af467e&width=2000&userId=&cache=v2)

Cpu가 메인 메모리에서 조회하여 인스트럭션을 실행하는데, 이 때 Cpu 내부에 있는 **PC**(Program Counter)가 실행시킬 인스트럭션을 알려준다.
Cpu는 PC만 바라보고 있어, PC가 전달해주는 인스트럭션만 실행하게 된다.

Cpu가 PC에게 인스트럭션을 전달받아 실행하면, **Display Adapter**에 출력할 데이터를 전달하게 되어 모니터에 출력된다.
![데이터 출력](https://koesnam.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F6e29bccb-b5af-45f7-9726-6b92c3af467e%2Fca78cc5c-e72c-4ae6-ab23-6f6d1fe9db13%2FUntitled.png?table=block&id=326e9796-6751-4980-9de8-918fc945d2b8&spaceId=6e29bccb-b5af-45f7-9726-6b92c3af467e&width=2000&userId=&cache=v2)


### 참고자료
-  컴퓨터 시스템 제3판(CS:APP) (Randal E Bryant, David R O'Hallaron)