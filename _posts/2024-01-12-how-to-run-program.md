---
layout: post
title: 프로그램 실행:데이터와 인스트럭션으로 하는 핑퐁
date: 2024-01-12 10:49 +0900
description: CSAPP 1장
category: [컴퓨터과학, Computer System]
tags: [CSAPP, C언어, Python]
---

프로그램을 실행하면, 내가 의도한 동작을 진행할 것이다. GUI가 구성되어있다면, 의도한대로 화면이 출력되는 것을 확인하여 제대로 동작하는 것을 알 수 있다.
그러나 내부에서는 무슨 일이 일어나고 있는 지는 알 수가 없다. 도대체 내부는 어떻게 동작하고 있는 지, 하드웨어들이 무슨 일을 하고 있는 지 알아보자.


# 프로그램 실행
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
이 과정에서 **CPU**는 "hello"라는 명령을 레지스터 파일에 등록하고, **메인 메모리**에 저장한다.

![키보드 입력 과정](https://koesnam.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F6e29bccb-b5af-45f7-9726-6b92c3af467e%2Fbca5c8b1-5099-46ed-b4ae-6567705f38c1%2FUntitled.png?table=block&id=7c8e134e-a278-4a2a-b656-e784bd2f9d66&spaceId=6e29bccb-b5af-45f7-9726-6b92c3af467e&width=2000&userId=&cache=v2)

쉘 입력이 끝나면(사용자가 enter 입력시),
**직접 메모리 접근(DMA)**을 통해 프로세서 접근없이, **Disk**에서 실행 파일을 조회하고
I/O Bus를 통해 I/O Bridge를 거쳐서 **Memory Bus**를 타고 파일 내용을 메인 메모리에 복사하게 된다.
이 때 코드과 데이터("Hello World")를 메인 메모리에 저장하게 되는 것이다.

![파일 조회](https://koesnam.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F6e29bccb-b5af-45f7-9726-6b92c3af467e%2Fce4c0dc2-51b9-4d65-b677-173ba759c7aa%2FUntitled.png?table=block&id=52dae94d-cbbd-4ff6-8b3e-fe4536baae43&spaceId=6e29bccb-b5af-45f7-9726-6b92c3af467e&width=2000&userId=&cache=v2)

CPU가 메인 메모리에서 조회하여 인스트럭션을 실행하는데, 이 때 Cpu 내부에 있는 **PC**(Program Counter)가 실행시킬 인스트럭션을 알려준다.
CPU는 PC만 바라보고 있어, PC가 전달해주는 인스트럭션만 실행하게 된다.

CPU가 PC에게 인스트럭션을 전달받아 실행하면, **Display Adapter**에 출력할 데이터를 전달하게 되어 모니터에 출력된다.
![데이터 출력](https://koesnam.notion.site/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F6e29bccb-b5af-45f7-9726-6b92c3af467e%2Fca78cc5c-e72c-4ae6-ab23-6f6d1fe9db13%2FUntitled.png?table=block&id=326e9796-6751-4980-9de8-918fc945d2b8&spaceId=6e29bccb-b5af-45f7-9726-6b92c3af467e&width=2000&userId=&cache=v2)

# 하드웨어
## CPU
---
CPU는 중앙 처리 장치이며, `프로세서`라고도 부른다.
프로세서는 산술 논리 장치와 레지스터 파일 등을 가지며, 버스 인터페이스를 통해 외부로 값을 전달한다.
산술 논리 장치(ALU)를 통해 인스트럭션을 해석하고 그에 맞게 동작한다.
프로세서가 현재 해야할 또는 다음 인스트럭션에 대한 정보는 **PC(Program Counter)**로 불리는 레지스터에 담겨있다. 이 정보는 메모리에 저장된 명령어에 대한 주소이다.
따라서 프로세서는 PC로부터 실행할 명령어들을 알게 된다. 

>프로세서 동작에 대한 내용은 ALU 내부에 ROM에 저장되어 사용된다.

기본적으로 CPU는 **Fetch-Decode-Execute** 이 세가지 연산을 통해 동작한다. 
CPU는 가장 먼저 다음 실행할 명령어를 가져오고(Fetch), 가져온 명령어를 해독하여(Decode) 어떤 작업을 수행할 지 결정한 다음, 명령어를 실행하고(Execute) 다음 명령어를 가져오며 처리를 반복한다. 

## Memory
---
메모리는 기본적으로 **RAM**(Random Access Memory)을 말한다. CPU와 DISK의 중간 계층 역할을 하는 캐시라고도 볼 수 있으며, 프로그램 실행시 사용되는 데이터는 모두 이 메모리에 담기게 된다. RAM은 컴퓨터가 켜져있을 때만 데이터를 저장하고 있어 전원이 꺼지면 모든 데이터는 휘발되게 되어있다. RAM은 데이터를 접근할 때 임의 접근 방식을 취하며, 이는 상수 시간만에 데이터를 조회할 수 있게 한다.

메모리에는 두가지 종류가 있는데, 하나는 **정적 램(SRAM)**이고 다른 하나는 **동적 램(DRAM)**이다. SRAM은 DRAM보다 빠르고 비싸다. SRAM은 이러한 특성으로 캐시 메모리에 사용되며, DRAM은 메인 메모리 또는 그래픽 시스템의 프레임 버퍼로도 이용된다.

>메모리 계층구조를 보면 대개 비쌀수록 빠르다! 이 때에 비용은 저장공간당 가격을 말하며, 성능과 저장공간의 트레이드-오프를 고려하여 저장장치를 선택할 수 있다.

## I/O Controller
---
입출력 장치는 **외부 시스템과 연결하는 장치**를 말한다. 우리가 아는 키보드, 마우스는 입력 장치이며 모니터는 출력 장치이다. 데이터를 저장하는 디스크 또한 입출력 장치에 속한다.
이러한 입출력 장치와 시스템은 입출력 버스를 통해 데이터를 교환하며, 컨트롤러나 어댑터를 통해 연결된다. 

>컨트롤러와 어댑터는 유사한데, 이 둘의 차이는 패키징에 있다. 메인보드에 온보드 형식으로 부착되어 있으면 컨트롤러, 슬롯으로 장착되어 있으면 어댑터로 구분된다.

입출력 장치는 외부 시스템이기에 프로세서나 메모리와 같은 내부 장치들과 성능이 크게 차이나게 된다. 이로 인해 CPU가 I/O 작업을 처리하는데 있어 병목 현상이 발생하게 되는데, 이를 해결하기 위해 앞서 언급한 **직접 메모리 접근(Direct Memory Access)** 기술이 도입되었다.

DMA 기술은 프로세서를 거치지 않고 데이터를 메모리와 다른 장치 사이에서 직접 전송하는 기능이다. CPU는 I/O 작업시 필요한 정보를 DMA 컨트롤러에게 전송하고, DMA 컨트롤러가 I/O 작업을 대신하여 진행한 뒤, 완료되면 CPU에게 알린다(=인터럽트 발생).  

이 시간에 CPU는 다른 작업을 하고 있다가, 인터럽트가 발생한 시점에 I/O 작업이 끝난 결과를 메모리에서 가져다 쓰면 되기 때문에 I/O 작업에서 병목을 크게 줄일 수 있게 되었다.

### 참고자료
- 컴퓨터 시스템 제3판(CS:APP) (Randal E Bryant, David R O'Hallaron)
- [개인 노션 DMA 정리](https://koesnam.notion.site/DMA-861814ce3a4243409fb3a2aac1848112)