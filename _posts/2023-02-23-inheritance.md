---
layout: post
title: "[Java] class의 Inheritance는 상속이 아니다"
date: 2023-02-23 01:16 +0900
description: 
category:
- 자바
- Java
tags:
- java
- 상속
- 인터페이스
- 추상클래스
---
> 개념 하나에 대한 여러 정보를 짧게 나열해보고 뒤에서 정리한다.
{: .prompt-tip }
# 개념

## 객체(Object)
---
객체는 세가지 요소를 가진다.

Identity(고유값)
: 한 객체는 다른 객체와 구별하는 특성을 가진다. 

Behavior(행위) 
: 객체는 저마다 가지는 행위들이 있다.

State(상태) 
: 정의된 행위를 제공하도록 하는 객체 내부의 정보들을 나타낸다. **(행위가 상태를 결정한다.)**

이러한 요소들로 인해 객체는 `유일무이`한 존재가 된다.

## 클래스(Class)
---
클래스는 객체(Object)를 정의하는 방법이다.  
클래스는 **객체의 상태를 나타내는 필드**와 **행위를 나타내는 메소드**로 구성된다.   
클래스로부터 `객체(instance)`를 만들어내며   
클래스를 통해 `객체(Object)`들을 분류한다.   
이 때 객체(instance)를 만들어내는 과정을 **인스턴스화**라고 한다.  

```java
class Computer { 
    Cpu cpu;
    ...
    
    public void compute() { ... }
}

class Cpu {
    ALU alu;
    Memory register;
    Memory cache;
}
```

## 상속(Inheritance)
---
상속은 클래스 수준에서 지정되는 관계이다.   
기존 클래스에서 새로운 클래스를 생성할 때 기존 클래스의 데이터와 기능을 이어 받게 된다.  
이 때 기존 클래스를 _Super class_ 라고 하고, 새로운 클래스를 _Sub class_ 라고 한다.   

상속은 상위 개념에서 하위 개념으로 내려가면서 확장하여야만 한다.  
하위 개념은 상위개념과 치환했을 때 아무런 문제가 없어야 한다.(is a kind of 관계)  
상속에서는 재사용과 확장이 핵심 키워드이다.
그에 맞게 Java에서 상속 예약어로 extends를 사용한다.

Super class에서 Sub class로 파생되는 것을 **전문화**시킨다라고 하고  
역으로는 **일반화**시킨다고 한다.

Java에서는 클래스의 다중 상속을 제한하며 interface만이 다중 상속(구현)이 가능하다. 

```java
class Computer { ... }
class Laptop extends Computer { ... } // 노트북은 컴퓨터의 한 종류이다 (O)
class Desktop extends Computer { ... } // 데스크탑은 컴퓨터의 한 종류이다 (O)

class Samsung { ... }
class Laptop extends Samsung { ... } // 노트북은 삼성의 한 종류이다 (X)
class Desktop extends Samsung { ... } // 데스크탑은 삼성의 한 종류이다 (X)
```

## 추상 클래스(Abstract class)
---
추상 클래스는 실제 객체로 쓰이지는 못하나 상위 개념(Super class)으로 이용되기위해 존재한다.  
추상 클래스는 타입의 공통되는 행위를 위해 사용될 수 있다.   
추상 클래스에서는 실제 구현을 정의할 수 있다.(=body를 가진다.)  

추상 클래스 또는 클래스를 상속받는 것을 _Subclassing_ 이라 한다.

```java
abstract class Computer { 
    // Computer는 데스크탑, 노트북, 미니PC, 서버PC 등으로 정의되지 않았기에 객체로 사용하지 못한다.
    // Computer 클래스는 모든 하위 개념들이 가지는 공통되는 데이터와 행위를 가지기에
    // Desktop, Laptop, MiniPC, Server 등의 Super class로는 존재 가능.
    Cpu cpu;
    Ram ram;
    Disk disk;
    
    public void compute() {}
    // abstract void compute(); // abstract 키워드를 통해 body없이 하위 클래스에 구현을 강제할 수 있다.
}
```

## 인터페이스(Interface)
---
인터페이스는 **_구현이 없는_ 행위(동작)들만을 정의(명시)**하기 위해 사용된다.  
인터페이스는 추상 클래스와는 다르게 상속을 하게되면 구현을 강제한다.     
인터페이스는 동작들만이 존재하므로 클래스가 인터페이스에 선언된 동작들만을 사용하면   
프로그램은 파생된 클래스에 대해 종속성을 가지지 않는다.   
(=파생된 클래스의 변경이 전체 프로그램에 영향을 미치지 않음.) 

인터페이스를 구현하게 하는 것을 _Subtyping_ 이라 한다.

```java
interface Computable {
    void compute();
}

abstract class Computer implements Computable { 
    Cpu cpu;
    Ram ram;
    Disk disk;
}

class Laptop extends Computer {
    @Override
    void compute() {
        ...
    }
}
```

# 정리
---
**`객체(Object)`** 는 세가지 특징을 가지며 유일무이하며 이를 나타내기 위한 방법으로 **`클래스(class)`** 가 있다.  
클래스, **`추상 클래스`**는 객체(Object)를 정의하기 위한 표현법이며, 이러한 객체들은 동작과 상태를 가지게 된다.  
추상 클래스는 상위 개념의 상태와 동작을 정의하기위해,  
**`인터페이스`** 는 동작을 정의하기 위해 사용되며 동작이 객체 외부로 노출되기 위해 정의된다.  

클래스는 인스턴스화가 가능하나 추상 클래스와 인터페이스는 불가능하다.

클래스는 재사용과 확장을 위해 **`상속`**받을 수 있었는데 이 때 개념적인 분류로써의 확장이 요구된다.  
상위 개념과 하위 개념은 **is a kind of 관계**로써  
`하위 클래스는 상위 클래스의 한 종류이다`라는 문장이 자연스러운 경우에 상속을 해야한다.
