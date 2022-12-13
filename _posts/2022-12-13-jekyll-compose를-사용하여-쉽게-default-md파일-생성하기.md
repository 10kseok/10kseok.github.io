---
layout: post
title: jekyll-compose를 사용하여 쉽게 default md파일 생성하기
date: 2022-12-13 01:33 +0900
description: 초안 작성을 위한 jekyll-compose
category: [블로깅, jekyll]
tags: [jekyll-compose]
---

## 포스트파일(md파일)을 쉽게 작성하기위해서 jekyll에서는 jekyll-compose을 plugin으로 추가하길 추천한다.
## jekyll-compose는 포스트파일(md파일)을 쉽게 작성하기위해 사용하는 jekyll plugin이다.
### jekyll-compose의 깃헙주소(https://github.com/jekyll/jekyll-compose)를 보고 설치해보았다.

<br> 

**개략적인 순서**

### Gemfile에 jekyll-compose 추가 -> jekyll-compose 설치 -> 명령어를 통해 파일생성



Gemfile에 아래 내용을 추가한다.
~~~Gemfile
gem 'jekyll-compose', group: [:jekyll_plugins]
~~~

jekyll-compose 설치
~~~Console
$ bundle
~~~

아래의 명령어를 입력하면 _post폴더에 작성시간이 찍힌 파일이 생성된다.
~~~Console
$ bundle exec jekyll post "글 제목!"
~~~




