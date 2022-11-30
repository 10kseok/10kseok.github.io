---
title: jekyll-theme-Chirpy 적용(github page)
date: 2022-12-01 01:03:00 +0900
categories: [개발환경, Github]
tags: [jekyll-theme]
---

|  |   |
|--|--|
| 사용환경 | Mac OS  |
| Ruby version  | 2.7.7 |
| theme 설치방법  | zip 다운로드 |

>보통의 다른 글들이 gh-page 브랜치를 언급하는데 현재 제작자의 Readme에도 관련 내용이 없고 해당 방법은 최근에는 쓰이지 않는 방법으로 보인다.
{: .prompt-info }

### chirpy theme을 fork 또는 zip파일 다운로드를 통해 자신의 git 프로젝트 폴더에 옮기고 bundle을 통해 gemfile에 기록된 dependency를 설치한 후의 과정

chirpy theme 적용에 있어 **Point**는 두 개다.
1. **ruby버전**을 본인 로컬 루비버전과 맞춰줘야하며
2. branch를 통한 github page deploy가 아니라 **github action**을 이용해줘야한다는 것이다.

	>2 . github action을 사용하는 것으로 설정하면 바로 밑에 jekyll action이 뜨면서 Configure을 눌러 사용하도록 한다.
그러면 이제 jekyll이 배포되는 github action이 설정되는 것인데 이 때 ruby version을 로컬과 같게 맞춰준다.

github action을 끝마치면 자동으로 jekyll action이 실행될 것이고 실행이 끝나면 배포가 완료된다.


etc.
----
**zip방식에서 겪었던 실수** - 숨겨진 파일(hidden file)을 놓치고 프로젝트 폴더로 옮기는 바람에 제대로 적용되지 않았다.

**github action이 아닌 branch를 통한 배포에서 일어난 문제점** - 빌드와 배포과정에서 jekyll-theme-chirpy를 찾을 수 없다는 오류를 띄움.  **Error: The jekyll-theme-chirpy theme could not be found.**
 



