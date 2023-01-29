---
layout: post
title: "[Java] Tic-Tac-Toe 구현부터 개선까지"
date: 2023-01-23 16:16 +0900
description: 
category: [자바, Implement]
tags: [TicTacToe, Refactoring, Java]
---


이번에 Java공부를 다시 시작하게 되면서 Java에 익숙해지기위해 Tic-Tac-Toe 게임을 구현해보기로 하였다.


## 요구사항
---
    * 게임 인원 : 2명 (사용자 2명 또는 사용자 1명 컴퓨터 1명) 
    * 승리 조건 : 가로, 세로, 대각선 연속 3개 이어질 시 승리
    * 게임 방식 : 한턴에 한번씩 표시하여 먼저 3개를 표시하는 사람이 이기는 방식.
    * 주의 사항 : 상대가 표시한 곳에는 다시 표시할 수 없음.
    * +@(추가 사항) : 랜덤으로 매판에 임의의 위치에 폭탄이 설치되어 그곳에 표시하면 패배. 폭탄이 없는 판이 있을 수도 있음.



## 개발 순서
---

1. TicTacToe게임에 필요한 최소기능 정의 및 구현
2. 리팩토링
3. 기능 추가

## 1. TicTacToe게임에 필요한 최소기능 정의 및 구현
---
TicTacToe는 크게는 사용자의 동작을 나타내는 기능과 게임의 승패를 결정하는 기능만 있으면 된다. 

- 사용자의 동작을 나타내는 기능
    + 사용자의 입력 또는 생성된 좌표에 따라 TicTacToe판에 표시
        * 사용자 입력은 1~9로 숫자로 입력받아 해당 숫자와 매칭되는 좌표에 표시
    + 컴퓨터가 표시할 시, 랜덤으로 좌표생성
        * 판의 크기가 3x3이므로 랜덤값도 그에 맞게 생성

- 게임의 승패를 결정하는 기능
    + 승리조건에 부합하면 게임을 종료

#### 실제 구현
```java
import java.util.Random;
import java.util.Scanner;

public class TicTacToe {
    private char[][] board;
    private char USER = 'U';
    private char COMPUTER = 'C';
    private Scanner scanner = new Scanner(System.in);
    private char winner;

    public TicTacToe() {
        generateBoard();
    }

    public void generateBoard() {
        board = new char[][] {% raw %}{{'*', '*', '*'}, {'*', '*', '*'}, {'*', '*', '*'}}{% endraw %};
    }

    public void showBoard() {
        // [x] TODO: 판 보여주기
        System.out.println("---");
        for (int i=0; i<3; i++) {
            for (int j=0; j<3; j++) {
                System.out.print(board[i][j]);
            }
            System.out.println();    
        }
        System.out.println("---");
    }

    public void start() {
        showWelcome();
    }

    public void showWelcome() {
        System.out.println("게임을 시작하시겠습니까? y/n");
        String answer = scanner.nextLine();
        if (answer.equals("y")) {
            play();
        }
    }

    public void play() {
        // [x] TODO: 끝날 때까지 계속 돌 놓을 자리 물어보기.
        showBoard();
        while (!isEnd()) {
            user();
            computer();
        }
        System.out.printf("%s Win\n", winner == 'U' ? "User" : "Computer");
        System.out.println("Game over!");
        scanner.close();
    }

    private boolean isEnd() {
        // [x] TODO: 9칸이 다 찼거나 누가 이기면 끝.
        return (win() || isFull());
    }

    private boolean win() {
        // [x] TODO: 가로, 세로, 대각선 연속 3개시 승리.
        for (int i=0; i<3; i++) {
            if (board[i][0] == board[i][1] &&  board[i][1] == board[i][2] && board[i][0] != '*'){
                // '-' 방향
                winner = (board[i][0] == 'O' ? 'U' : 'C');
                return true;
            }
            if (board[0][i] == board[1][i] &&  board[1][i] == board[2][i] && board[0][i] != '*') {
                // '|' 방향
                winner = (board[0][i] == 'O' ? 'U' : 'C');
                return true;
            }
        }
        if (board[0][0] == board[1][1] &&  board[1][1] == board[2][2] && board[0][0] != '*') {
            // '\' 대각선
            winner = (board[0][0] == 'O' ? 'U' : 'C');
            return true;
        }
        if (board[0][2] == board[1][1] &&  board[1][1] == board[2][0] && board[0][2] != '*') {
            // '/' 대각선
            winner = (board[0][2] == 'O' ? 'U' : 'C');
            return true;
        }
        return false;
    }

    private boolean isFull() {
        // [x] TODO: 판이 'O'나 'X'로 다 찼는지 확인. -> 무승부
        for (char[] row: board) {
            for (char col: row) {
                if (col != 'O' && col != 'X') {
                    return false;
                }
            }
        }
        System.out.println("Draw");
        return true;
    }

    private void user() {
        // [x] TODO: 매회당 1번 돌놓기(O)
        System.out.println("User turn");
        int[] position;
        do {
            position = getUserInput();
        } while (!canMark(position[0], position[1]));
        mark(position[0], position[1], USER);
        showBoard();
    }

    private int[] getUserInput() {
        // [x] TODO: 1~9번으로 입력받아 돌 놓을 곳 정하기
        try {
            System.out.println("돌을 놓을 곳을 입력해주세요 (1~9)");
            int inputNum = scanner.nextInt();
            if (inputNum < 1 || inputNum > 9) {
                throw new IllegalArgumentException("범위에 벗어난 입력");
            }

            switch (inputNum) {
                case 1:
                    return new int[] {0, 0};
                case 2:
                    return new int[] {0, 1};
                case 3:
                    return new int[] {0, 2};
                case 4:
                    return new int[] {1, 0};
                case 5:
                    return new int[] {1, 1};        
                case 6:
                    return new int[] {1, 2};
                case 7:
                    return new int[] {2, 0};
                case 8:
                    return new int[] {2, 1};
                case 9:
                    return new int[] {2, 2};
                default:
                    return new int[] {};
            }
        } catch (IllegalArgumentException e) {
            // TODO: handle exception
            System.out.println("** 지정된 범위의 위치를 입력해주세요. **");
            e.printStackTrace();
        }
        return new int[] {};
    }

    private void computer() {
        // [x] TODO: 9칸 중 랜덤으로 돌 놓기(X)
        // -> 랜덤으로 좌표생성 (x, y) 각각 랜덤으로 생성
        //      -> 만약 상대방 돌이 있으면 다시 랜덤 좌표 생성
        if (isEnd()) return;
        System.out.println("Computer turn");
        Random random = new Random();
        int row, col;
        do {
            row = random.nextInt(3);
            col = random.nextInt(3);
        } while (!canMark(row, col));
    
        mark(row, col, COMPUTER);
        showBoard();
    }

    private void mark(int row, int col, char player) {
        char marking = (player == USER) ? 'O' : 'X';
        board[row][col] = marking;
    }

    private boolean canMark(int row, int col) {
        return (board[row][col] != 'O' && board[row][col] != 'X');
    }

    public static void main(String[] args) {
        TicTacToe ticTacToe = new TicTacToe();
        ticTacToe.start();
    }
}
```

### 한계
- 유저 vs 컴퓨터밖에 지원하지 않는다.
- 하드코딩된 조건식들이 많아 변경이 어렵다.
- TicTacToe 클래스가 게임생명주기관리, 사용자동작 등 너무 많은 책임을 맡고 있다.

## 2. 리팩토링
---

TicTacToe 클래스에서 기능들을 분리해 하나의 클래스들로 구성한다.

User
: 입력을 받아 표시를 하는 유저들의 동작들을 나타내는 클래스

Computer
: 랜덤으로 좌표를 생성하여 표시하는 기능을 가지는 클래스 

Player
: User와 Computer가 공통적으로 갖는 기능을 정의한 클래스 

Markable
: 표시해야한다면 가져야 할 동작들 

Playable
: 게임을 시작할 때 일어나는 동작들


```java
abstract class Player implements Markable, Playable {   
    String name;
    char marking;
}

interface Markable {
    void markAt(int row, int col);
    boolean canMarkAt(int row, int col);
}

interface Playable {
    void play();
}

class User extends Player {
    static int userIdx = 0;
    
    public Board b;
    private char[] markings = new char[] {'O', '@'};
    private Scanner scanner = new Scanner(System.in);

    User(Board game) {
        this.marking = markings[userIdx];
        name = "user" + (userIdx++) % 2; // user는 2인으로 제한.
        b = game;
    }

    @Override
    public void markAt(int row, int col) {
        // TODO Auto-generated method stub
        b.board[row][col] = marking;
    }

    @Override
    public boolean canMarkAt(int row, int col) {
        // TODO Auto-generated method stub
        return (b.board[row][col] == b.EMPTYVALUE);
    }

    @Override
    public void play() {
        // TODO Auto-generated method stub
        System.out.println("========== " + name + " turn ==========");
        mark();
    }

    private void mark() {
        int[] markPosition;
        do {
            markPosition = getUserInput();
        } while (!canMarkAt(markPosition[0], markPosition[1]));
        markAt(markPosition[0], markPosition[1]);
    }

    private int[] getUserInput() {
        // [x] TODO: 1~9번으로 입력받아 표시할 곳 정하기
        try {
            System.out.println("표시할 곳을 입력해주세요 (1~9)");
            int inputNum = scanner.nextInt();
            if (inputNum < 1 || inputNum > 9) {
                throw new IllegalArgumentException("범위에 벗어난 입력");
            }
            switch (inputNum) {
                case 1:
                    return new int[] {0, 0};
                case 2:
                    return new int[] {0, 1};
                case 3:
                    return new int[] {0, 2};
                case 4:
                    return new int[] {1, 0};
                case 5:
                    return new int[] {1, 1};        
                case 6:
                    return new int[] {1, 2};
                case 7:
                    return new int[] {2, 0};
                case 8:
                    return new int[] {2, 1};
                case 9:
                    return new int[] {2, 2};
                default:
                    return new int[] {};
            }
        } catch (IllegalArgumentException e) {
            // TODO: handle exception
            System.out.println("** 지정된 범위의 위치를 입력해주세요. **");
            e.printStackTrace();
        } catch (InputMismatchException e2) {
            System.out.println("** 숫자(1~9)를 입력해주세요. **");
            e2.printStackTrace();
        }
        return new int[] {};
    }

}

class Computer extends Player {
    Board b;

    Computer() {}
    Computer(Board game) {
        name = "Siri";
        b = game;
        this.marking = 'X';
    }
    
    @Override
    public void markAt(int row, int col) {
        // TODO Auto-generated method stub
        b.board[row][col] = marking;
    }

    @Override
    public boolean canMarkAt(int row, int col) {
        // TODO Auto-generated method stub
        return (b.board[row][col] == b.EMPTYVALUE);
    }

    @Override
    public void play() {
        // TODO Auto-generated method stub
        System.out.println("Computer turn");
        mark();        
    }

    public void mark() {
        int[] pos;
        do {
            pos = generatePosition();
        } while (!canMarkAt(pos[0], pos[1]));
        markAt(pos[0], pos[1]);
    }

    public int[] generatePosition() {
        int row, col;
        row = generateRandomValue(3);
        col = generateRandomValue(3);

        return new int[] {row, col};
    }

    public int generateRandomValue(int bound) {
        Random random = new Random();
        return random.nextInt(bound);
    }
}

class Board {
    char EMPTYVALUE;
    char[][] board;

    Board(char initialValue) {
        EMPTYVALUE = initialValue;
        board = new char[][] {
                              {initialValue, initialValue, initialValue},
                              {initialValue, initialValue, initialValue},
                              {initialValue, initialValue, initialValue} 
                            } ;
    }
}
```

### **변경결과**
1. User 클래스를 정의하는 것을 통해 유저 2인이 게임할 수 있게 되었다.
2. Computer 클래스의 랜덤 좌표생성기능을 generatePosition, generateRandomValue으로 쪼개어 재사용성을 높였다. 
3. Player 클래스에서 mark메서드를 쪼개고 추상화함으로써 mark메서드는 표시하는 것을 보장할 수 있게 됐다.
4. Board 클래스를 통해 기본값을 변경하여 사용할 수 있게 하였고 하드코딩된 값들을 제거할 수 있었다.

#### 추상화된 클래스들이 TicTacToe 클래스에 적용된 코드

```java
import java.util.InputMismatchException;
import java.util.Random;
import java.util.Scanner;

public class TicTacToe {
    private Board b;
    private Scanner scanner = new Scanner(System.in);
    private Player winner;
    private Player[] players;

    public TicTacToe() {
        generateBoard();
    }

    public void generateBoard() {
        b = new Board('*') ;
    }

    public void showBoard() {
        // [x] TODO: 판 보여주기
        System.out.println("---");
        for (int i=0; i<3; i++) {
            for (int j=0; j<3; j++) {
                System.out.print(b.board[i][j]);
            }
            System.out.println();    
        }
        System.out.println("---");
    }

    public void showWelcome() {
        System.out.println("게임을 시작하시겠습니까? y/n");
        String answer = scanner.nextLine();
        if (answer.equals("y")) {
            selectMode();
            play();
        } else {
            scanner.close();
        }
    }
    
    public void showEndComment() {
        System.out.printf("%s Win\n", winner.name);
        System.out.println("Game over!");
        scanner.close();
    }
    
    public void start() {
        showWelcome();
    }
    
    public void play() {
        // [x] TODO: 끝날 때까지 계속 돌 놓을 자리 물어보기.
        // 두명의 턴이 다 끝나야 게임종료 조건 검사 --> 표시할 때마다 종료조건 검사, 플레이어가 2명이 안되면 종료.

        showBoard();
        game:
        while (true) {
            if (players.length < 2) { break game;}

            for (Player p: players) {
                p.play();
                showBoard();    
                if (isEnd()) break game;
            }
        }
        showEndComment();
    }

    private boolean isEnd() {
        // [x] TODO: 9칸이 다 찼거나 누가 이기면 끝.
        return (hasWon() || isDraw());
    }

    private boolean hasWon() {
        // [x] TODO: 가로, 세로, 대각선 연속 3개시 승리.
        for (int i=0; i<3; i++) {
            if (b.board[i][0] == b.board[i][1] &&  b.board[i][1] == b.board[i][2] && b.board[i][0] != b.EMPTYVALUE){
                // '-' 방향
                winner = (b.board[i][0] == players[0].marking ? players[0] : players[1]);
                return true;
            }
            if (b.board[0][i] == b.board[1][i] &&  b.board[1][i] == b.board[2][i] && b.board[0][i] != b.EMPTYVALUE) {
                // '|' 방향
                winner = (b.board[0][i] == players[0].marking ? players[0] : players[1]);
                return true;
            }
        }
        if (b.board[0][0] == b.board[1][1] &&  b.board[1][1] == b.board[2][2] && b.board[0][0] != b.EMPTYVALUE) {
            // '\' 대각선
            winner = (b.board[0][0] == players[0].marking ? players[0] : players[1]);
            return true;
        }
        if (b.board[0][2] == b.board[1][1] &&  b.board[1][1] == b.board[2][0] && b.board[0][2] != b.EMPTYVALUE) {
            // '/' 대각선
            winner = (b.board[0][2] == players[0].marking ? players[0] : players[1]);
            return true;
        }
        return false;
    }

    private boolean isDraw() {
        for (char[] row: b.board) {
            for (char col: row) {
                if (col == b.EMPTYVALUE) {
                    return false;
                }
            }
        }
        System.out.println("Draw");
        return true;
    }

    public static void main(String[] args) {
        TicTacToe ticTacToe = new TicTacToe();
        ticTacToe.start();
    }
}
```

## 3. 기능 추가
---

#### 추가사항
1. User vs User 와 User vs Computer를 선택할 수 있게하는 기능
2. 임의에 위치에 폭탄을 생성하여 그곳에 표시한 사람이 지는 기능


```java
public class TicTacToe {
    ...
    private int[] bombPos;
    private int bombPossibility = 100; // 0 ~ 100으로 설정

    ...

    public void selectMode() {
        System.out.println("유저/컴퓨터 누구와 할지 고르세요. u/c");
        String answer = scanner.nextLine();
        players = answer.equals("u") ? new Player[] {new User(b), new User(b)} : new Player[] {new User(b), new Computer(b)}; 
    }

    public void play() {
        // [x] TODO: 끝날 때까지 계속 돌 놓을 자리 물어보기.
        // 두명의 턴이 다 끝나야 게임종료 조건 검사 --> 표시할 때마다 종료조건 검사, 플레이어가 2명이 안되면 종료.
        if (hasBomb()) setBomb(); // --> play 메서드에 추가!

        showBoard();
        game:
        while (true) {
            if (players.length < 2) { break game;}

            for (Player p: players) {
                p.play();
                showBoard();    
                if (isEnd()) break game;
            }
        }
        showEndComment();
    }

    private boolean isEnd() {
        // [x] TODO: 9칸이 다 찼거나 누가 이기면 끝.
        return (hasWon() || isDraw() || hasLost());
    }

    private boolean hasLost() {
        // TODO: 폭탄을 표시했을 때 lose에서 true를 리턴.
        for (int i = 0; i < players.length; i++) {
            if (b.board[bombPos[0]][bombPos[1]] == players[i].marking) {
                System.out.println(players[i].name + " got 💣 Boom~~~!");
                winner = players[(++i % 2)];
                return true;
            }
        }
        return false;
    }

    ...

    private boolean hasBomb() {
        Computer c = new Computer();
        return c.generateRandomValue(100) < bombPossibility;
    }

    private void setBomb() {
        Computer c = new Computer();
        bombPos = c.generatePosition();
    }
}
```

### **변경결과**
: 랜덤좌표값 생성메서드를 추상화해놓은 덕에 쉽게 재사용이 가능했고 그에 따른 기능추가가 쉬웠다.