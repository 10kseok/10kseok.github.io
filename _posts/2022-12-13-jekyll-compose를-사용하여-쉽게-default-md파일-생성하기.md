---
layout: post
title: jekyll-compose를 사용하여 쉽게 게시글 생성하기
date: 2022-12-13 01:33 +0900
description: 초안 작성을 위한 jekyll-compose
category: [블로깅, jekyll]
tags: [jekyll-compose, github page, m1 mac]
---


| 기기정보 |  |
|--|--|
| 사용기기 | M1 MAC    |
| bundler version  | 2.1.4 |
| jekyll version  | 4.3.1 | 


## 개략적인 순서
1. jekyll-compose 설치
2. 게시글 기본설정 
3. 명령어를 통해 파일생성    

---

# 1. jekyll-compose 설치
---
루트디렉토리에 있는 Gemfile에 맨 아래 아래내용을 추가한다.
```
gem 'jekyll-compose', group: [:jekyll_plugins]
```
{: file='Gemfile'}

jekyll-compose 플러그인을 설치한다.
```console
$ bundle
```


# 2. 게시글 기본 설정
---
이제 jekyll-compose 플러그인을 통해 게시글을 생성할 수 있는데, 그 전에 게시글에 기본 정보를 설정한다. 
<br>  

**_config.yml** 파일을 열어 아래내용을 맨아래에 추가해준다. 
```
jekyll_compose:
  auto_open: true # 게시글 생성시 자동열림
  default_front_matter:
    posts:
      description: #기본적으로 넣고 싶은 내용이 있으면 넣어준다.
      category:
      tags:
```
{: file='_config.yml'}

게시글을 작성시킬 에디터를 설정해줘야 auto_open이 제대로 동작하므로 
자신이 게시글 작성에 사용할 에디터(markdown editor)를 쉘 설정에서 설정해주어야한다.  

나같은 경우에는 **vscode**를 사용할 예정이므로

쉘 설정을 열고
```console
$ vi ~/.zshrc
```

vscode로 에디터를 설정해주고
```shell
export JEKYLL_EDITOR=code
```

바뀐 내용을 적용시킨다.
```console
$ source ~/.zshrc
```

>mac에서는 vscode를 터미널에서 인식하려면 별도의 과정이 필요하다.  
vscode 진입 - View - Command Palette - "shell" 입력 - Shell Command: Install 'code' command in path 클릭
{: .prompt-info }

# 3. 명령어를 통해 파일생성    
---
이제 명령어를 통해서 게시글이나 초안 등을 생성할 수 있다.

아래의 명령어를 입력하면 _post폴더에 작성시간이 찍힌 파일이 생성된다.
```console
$ bundle exec jekyll post "글 제목!"
```

다른 명령어
: **draft**      -> 입력받은 제목으로 초안 생성 (작성시간이 안 찍힘)  
  **post**       -> 입력받은 제목으로 게시글 생성 (작성시간이 찍힘)  
  **publish**    -> 입력받은 초안을 _post로 옮기고 작성시간 찍어줌    
  **unpublish**  -> 입력받은 게시글을 다시 _draft로 옭김  
  **page**       -> 입력받은 이름으로 페이지 생성  
  **rename**     -> 입력받은 초안의 이름 변경  
  **compose**    -> 입력받은 이름으로 파일 생성  

## 약어 설정
**지금의 명령어는 너무 기므로 alias를 설정해 간편하게 이용해보자.**

다시 쉘 설정을 열고
```console
$ vi ~/.zshrc
```
맨 아래에 아래 내용을 추가시켜준다.  

```shell
# ~/myapp/gitBlog/10kseok.github.io에는 자신의 github page경로를 넣어준다.
alias post='cd ~/myapp/gitBlog/10kseok.github.io && bundle exec jekyll post'
```

다시 또 바뀐 내용을 적용시켜준다.
```console
$ source ~/.zshrc
```

이제 터미널에서 아래 명령어로 간단하게 게시글 생성이 가능해졌다.
```console
$ post "게시글 제목"
```

## 참고
- Jekyll-Compose 깃헙주소 <https://github.com/jekyll/jekyll-compose>
- 연속적으로 명령 실행시키기 (;과 &와 &&의 차이) <https://opentutorials.org/module/2538/15818>

