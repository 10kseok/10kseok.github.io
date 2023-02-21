---
layout: post
title: "[Java] class의 Inheritance는 상속이 아니다"
date: 2023-01-29 16:33 +0900
description: 
category: [자바, Java]
tags: [java, 상속, 인터페이스, 추상클래스]
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
클래스는 데이터와 기능을 포함하는 데이터 구조이다.  
클래스는 객체의 상태를 나타내는 필드와 행위를 나타내는 메소드로 구성된다.   
클래스로부터 `객체(instance)`를 만들어내며   
클래스를 통해 `객체(Object)`들을 분류한다.   
이 때 객체(instance)를 만들어내는 과정을 **인스턴스화**라고 한다.  

```java
public class Computer { 
    Cpu cpu;
    ...
    
    public void compute() { ... }
}

public class Cpu {
    ALU alu;
    Memory register;
    Memory cache;
}

...

```

## 상속(Inheritance)
---
상속은 클래스 수준에서 지정되는 관계이다.   
기존 클래스에서 새로운 클래스를 생성할 때 기존 클래스의 데이터와 기능을 이어 받게 된다.  
이 때 기존 클래스를 _Super class_ 라고 하고, 새로운 클래스를 _Sub class_ 라고 한다.   

기존 클래스를 Parent class, 새로운 클래스를 Child class라고도 하기는 하지만  
이러한 이름은 오해를 불러 일으킬 수 있기에 Super와 Sub로 불리는 것이 맞다.

Super class에서 Sub class로 파생되는 것을 **전문화**시킨다라고 하고  
역으로는 **일반화**시킨다고 한다.

Java에서는 클래스의 다중 상속을 제한하며 interface만이 다중 상속(구현)이 가능하다. 

```java
public class Computer { ... }
public class Laptop extends Computer { ... }
public class Desktop extends Computer { ... }
```

## 추상 클래스(Abstract class)
---
추상 클래스는 실제 객체로 생성되지 않으나 Super class로 이용되기위해 존재한다.  
추상 클래스는 타입의 행위를 위해 사용된다.  
추상 클래스에서는 실제 구현을 정의할 수 있다.
추상 클래스 또는 클래스를 상속받는 것을 Subclassing이라 한다.

```java
abstract class Computer { 
    Cpu cpu;
    Ram ram;
    Disk disk;
    
    public void compute();
}
```

## 인터페이스(Interface)
---
인터페이스는 **구현이 없는 동작들만을 정의**하기 위해 사용된다.  
인터페이스는 추상 클래스와는 다르게 상속을 하게되면 구현을 강제한다.   
하지만 구현을 인터페이스에서 정의하지는 않는다.  
인터페이스는 동작들만이 존재하므로 클래스가 인터페이스에 선언된 동작들만을 사용하면   
프로그램은 파생된 클래스에 대해 종속성을 가지지 않는다. 
(= 파생된 클래스의 변경이 프로그램에 영향을 미치지 않음.)
인터페이스를 구현하게 하는 것을 Subtyping이라 한다.

```java
interface Computable {
    void compute();
}

abstract class Computer implements Computable { 
    Cpu cpu;
    Ram ram;
    Disk disk;
}

```

## 추상화
---

```java
interface Computable {
    void compute();
}

abstract class HardWare { 
    Cpu cpu;
    Ram ram;
    Disk disk;
}

abstract class SoftWare { 
    Os os;
}

abstract class Computer implements Computable { 
    HardWare hardWare;
    SoftWare softWare;
}

```

# 정리
---
클래스와 인터페이스는 타입을 정의하기 위한 표현법이며, 이러한 타입들은 동작과 데이터를 가지게 된다.
클래스는 인스턴스화가 가능하나 인터페이스는 불가능하다. 인터페이스는 동작을 정의하기 위해 사용되며 외부 객체에
노출되기 위해 정의된다.


그렇다면 ~~~

상속이라고 할 수 없다. 우리가 아는 상속은 물려주게 되면 나 자신은 그러한 특성을 잃게 된다. 정확히 말하면 내가 없어져서 이뤄진다.

하지만 객체지향에서의 상속은 그러한 의미가 아니다.

상속은 ~~한 의미를 가지는 것으로 봐야하며 Parent와 child로 부르는 것보단 Super와 Sub로 부르는게 혼동이 적다.
자바는 inheritance 라는 단어가 불러일으키는 오해를 피하기 위해 extends 라는 키워드를 사용한다
상속은 재사용&확장 꼭 이 두 키워드가 같이 있어야만한다 


