---
layout: post
title: 일어나야해! 넌 조선의 자존심이야! (1/2)
date: 2024-07-08 23:33 +0900
description: 로아 회고글
category: [프로젝트, reflection]
tags: [Krafton Jungle, LOA, Chrome Extension, Nest, Vanila js, 크래프톤 정글 회고]
---

크래프톤 정글의 마지막 프로젝트로 [로아(LOA, Learn On Air)](https://github.com/makeMyOwnWeapon)를 개발했다. 로아는 **온라인 학습 도우미**를 목표로 온라인 학습에 집중하기 어려운 수강생들을 위해 집중도를 유지할 수 있게 도와주는 서비스이다. 이를 위해 비전 AI와 자연어 처리 AI가 사용됐다. 원래는 백엔드를 책임지는 역할이었으나 필요한 곳에 유동적으로 투입되어 개발하다 보니 다양한 부분에서의 트러블 슈팅을 경험할 수 있었다.

## 기술 스택 선정
---
### Chrome Extension  
우리는 "나 같아도 쓸 것 같다"하는 서비스를 만들고자 했다. 그렇다면 기존 사용자들의 흐름에서 자연스럽게 녹아들 수 있게끔 서비스를 설계해야했다.
사람들이 많이 사용하는 강의 플랫폼을 선정하려했고, 우리같은 사람들이 가장 많이 이용하는 플랫폼으로 인프런이 적합했다.  

이 인프런에 자연스럽게 우리의 서비스를 붙이려면 데스크탑 애플리케이션과 같은 별도의 애플리케이션을 고려해야했다. 하지만 데스크탑 애플리케이션으로 개발한다면 ActiveX 같은 느낌이 들어 거부감이 들거라 판단했고, 사람들이 설치하기에 거부감이 좀 더 적다고 판단한 크롬 익스텐션을 고안하게 됐다.

>실제로 동료 한 분이 슬랙으로 백준 깃헙 크롬 익스텐션을 공유한 적이 있는데, 이 당시 같은 반에 있는 모든 교육생분들이 설치했다.

이 때 팀원들이랑 마음이 잘 맞았던 게, 아무도 사실 크롬 익스텐션은 개발해본 적이 없지만, 다들 그저 이번에 배우면서 개발하면 된다라는 마인드로 의기투합이 됐었다.  
*~~덕분에 크롬 익스텐션이 안겨줄 재앙은 아무도 모를 수 있었다. 쿠쿸쿡~~*  

### Spring vs Nest
우리 팀은 리더 한 명과 백엔드와 프론트에 각 팀장을 한 명씩 두고 팀원이 한 명있는 구조였다. _(무한도전에서 노홍철의 반장 선거 공약이 떠오른다)_ 그 중 백엔드 팀장으로 뽑혀 서버 프레임워크부터 얼른 선정하여 팀원을 지목해야했다. 우리가 선택해볼만한 런타임 환경은 JVM 또는 Node였다. 스프링을 경험해본 사람은 본인 포함 3명 정도가 됐고, Node는 짧게 나마 경험해본 사람이 본인 포함 2명 정도였다. 인원수와 숙련도만 보면 당연히 스프링으로 선택하겠지만 서비스 특성을 고려하여 Nest 프레임워크를 선택했다.  

로아의 핵심 기능 중에 졸음을 깨워주고 자리이탈을 감지하는 기능이 있다. 이 기능에 대한 PoC를 진행했을 때 백엔드에서 영상 처리를 해야되는 것으로 판명이 났었다. 따라서 백엔드 서버에는 영상 I/O 작업이 굉장히 빈번할 것으로 예상했고, 이러한 작업에는 비동기 프레임워크인 Nest가 더 적합했다. 스프링에서 Webflux를 이용해서 비동기 처리를 할 수도 있었겠지만 이는 학습비용이 매우 클 것으로 판단했다.

>결국엔 팀원 모두가 영역을 가리지않고 개발할 수 있었던 것도, javascript(typescript)로 언어를 통일한 것이 스위칭 비용을 줄여 가능했던 것이 않을까싶다. 그치만 java 21에서 나온 가상 스레드 관련 글을 읽고 JVM 쪽으로 갔어도 괜찮았겠는데?하는 찜찜함은 남아있다.

### SQL(MySQL) vs NoSQL(MongoDB)
그 다음에는 DBMS를 선정해야했다. 현재 팀원의 기술은 정글 입학시험 때 MongoDB를 짧게 경험했었고, 나는 MySQL를 쭉 사용해왔다. NoSQL은 스키마에 대한 제약이 자유로웠고 추후 컬럼을 확장하기에도 용이했다. SQL은 데이터 정합성에 초점이 좀 더 맞춰있고 관리할 데이터 구조가 명확할 때에 이점을 가진다. DB에서 핵심적으로 관리할 데이터는 문제 풀이 결과와 수업 집중도 분석 결과와 같은 데이터였다. 이 데이터를 보고서 형식으로 사용자에게 보여지기에 일관적인 구조를 가지므로 SQL을 선택했다.

## 클라이언트
---
(앞에서 한 말과는 다르게) 졸음 감지(사용자 상태 분석)를 클라이언트에서 맡기로 됐다. 리더분이 백엔드에서 처리하다 부하로 인해 클라이언트로 옮긴 사례를 전해주어 클라이언트에서 하게 됐다. 처음에는 tensorflow.js를 사용하여 시도했으나 안구 인식이 제대로 되지 않았다. 기획 단계에서, 코치님의 피드백 중 동양인 안구 인식은 잘 안될 수가 있다고 했는데 실제로도 그러했다.

그러던 와중에 구글이 만든 mediapipe.js를 알게 됐다. mediapipe는 브라우저에서 굉장히 좋은 성능을 보였고 상태 값도 제어하기 쉬웠다. 상태 값으로 눈 깜빡임 정도와 탐지 여부를 확인할 수 있어 졸음 감지 로직과 자리 이탈 로직만 구현하면 핵심 기능이 완성되는 것이였다.

_시작부터 우리의 도전 과제가 해결되어 프로젝트가 끝난 것만 같았다._

우리의 클라이언트 애플리케이션은 문제집을 등록하거나 회원가입을 진행하는 리액트 웹 애플리케이션과 인프런 위에서 돌아갈 크롬 익스텐션 두 개가 존재한다. 웹사이트에서는 성공적으로 됐으니 같은 브라우저내 크롬 익스텐션도 그러할 줄 알았다. 그래서 크롬 익스텐션으로 졸음 감지 코드를 그대로 옮겼으나 하나둘씩 삐걱대기 시작했다.

### 크롬 익스텐션 정책 이슈
처음에는 외부 자바스크립트를 마음대로 불러올 수 없는 크롬 익스텐션 정책이 있었다. 이 문제는 magnifest.json에 불러올 도메인을 content_security_policy에 추가해주는 것으로 해결할 수 있다. 크롬 익스텐션이 2023년부터 v3 버전으로 올라가면서 여러가지 제약사항이 바뀌었다. mediapipe.js에서 사용하는 연산이 v3 버전에서는 제약이 생겼다 ([자세한 내용](https://github.com/google-ai-edge/mediapipe/issues/4028)). 따라서, 우리가 content_security_policy에 도메인을 추가하더라도 cdn으로 mediapipe.js를 불러오는 것은 불가능했다.

cdn이 아닌 npm을 통해 다운받아 프로젝트에 포함시키는 것을 시도했다. **성공이다! 빌드까지만...** 실제로 익스텐션으로 구동되는 순간 wasm 파일을 로드할 수 없는 오류가 발생했다. wasm 파일이 뭔고하니 웹어셈블리 파일이였다. 여기까지만 같이 시도를 하고 나는 백엔드 개발로 돌아갔었다. 결국 익스텐션 보안 정책으로 크롬 익스텐션에서 mediapipe 구동은 불가능하다는 결론이 나왔다. **so 절망적이다.**

### 웹사이트로 이전
mediapipe의 성능으로 인해 프레임워크 자체를 버릴 순 없었고 많은 회의를 거쳐 우리 웹사이트(리액트 웹앱)에서 구동시키는 것으로 결정했다. 사용자가 우리 웹사이트에서 캠을 킨 뒤, 인프런으로 다시 돌아가서 강의를 듣게끔 UX도 변경됐다 (_너무나 불편한 마음이 들었지만 어쩔 수 없었다 핵심 기능은 돼야할 것 아닌가!_ ). 웹사이트에서 상태 분석을 하게 되면서 인프런 강의를 듣는 탭에 졸음이나 자리이탈시 알림 줘야했다.

하지만 인프런 탭과 웹사이트 탭은 같은 브라우저내에 있지만 엄연히 다른 탭과 도메인이라 클라이언트에서 상태를 저장하는 쿠키 또는 로컬 스토리지 등을 사용할 수도 없었다. 크롬 익스텐션에는 익스텐션만을 위한 저장공간이 제공된다. 이 익스텐션 스토리지는 브라우저내에서 공유하기에 어떤 탭에서도 접근할 수 있다. 따라서 웹사이트에서 실시간 졸음 분석 결과를 스토리지에 저장하고 익스텐션은 인프런 탭에서 주기적으로 스토리지를 확인하여 알림을 띄우면 되는 것이다.

다른 방법으로는 웹소켓을 이용하는 것이다. 웹소켓을 사용하면 클라이언트-서버 모델에서도 서버가 클라이언트에게 요청을 보낼 수 있다. 익스텐션이 백엔드 서버 소켓과 연결되어 웹사이트에서 졸음을 감지하면, 백엔드 서버가 익스텐션과 연결된 소켓에 알림 이벤트를 전달하여 잠을 깨우게 한다. 소켓을 이용하면 익스텐션에서는 별도의 ajax 호출없이 서버로의 모든 요청을 소켓을 통해 할 수 있다는 이점도 있었다.
> 크롬 익스텐션에서 네트워크 요청은 일반적인 요청과 다르다. 실제 익스텐션 환경도 메인 작업을 하는 환경(content.js)과 백그라운드 작업을 하는 환경(serviceWorker.js)이 나눠져 있었다. 그리하여 네트워크 요청은 content.js에서 serviceWorker.js로 이벤트를 전달하여 실제로 serviceWorker.js에서 네트워크 요청이 이뤄진 뒤 결과 값을 다시 content.js로 전달해주는 구조다.

추가 기능으로 실시간으로 같은 강의를 듣고 있는 수강생의 강의 현황을 보여주는 기능도 기획했었는데, 이를 구현하는데 있어서 웹소켓이 필요했고 팀원의 선호도가 더 높아 웹소켓 방식으로 분석 상태를 전달하고 알림을 주는 것으로 개발을 진행했다.

그러나, 백그라운드 탭에서는 졸음 감지가 제대로 작동하지 않았다. 유튜브로 음악을 틀고 다른 작업이 되는 것으로 보아 탭이 분명 백그라운드에서 동작할 수 있는 것이 확실한데... 제대로 작동하게 하려면 탭을 분리해내서 같은 화면에 동시에 존재해야만 가능했다. 한마디로, 인프런 강의 화면이 있고 그 옆에 작게나마 우리 웹사이트가 가려져서도 안되고 조그만하게 떠있어야 하는 것이다.

어떻게든 백그라운드에서 졸음 감지를 하려고 브라우저에서 백그라운드 작업을 하게 하는 웹 워커 도입을 고려했으나, 이도 마찬가지였다. 브라우저 정책상, 백그라운드 탭의 리소스를 제한하게 되는데 이로 인해, 인프런 탭으로 넘어가거나 화면에서 우리 웹사이트 탭이 사라지면 졸음 감지 기능이 멈추게 됐다.

더군다나, 중간 발표에서의 코치님의 피드백이 우리의 기능이 너무 geek하다는 것이였다. 우리야 직접 개발하는 사람이니 이게 불편하거나 이상함을 못 느낄 수도 있는데(실제로 불편함을 많이 느끼긴 했지만) 사용자 입장에서는 이게 너무 이상하고 불편한 로직이라는 것이다. 사실 크게 동감했다. 너무나도 기능이 되는 것에만 치중했던 것이였다. 그렇게 선택의 기로에 놓기에 되었는데, 어떻게든 이대로 타사 사이트(인프런) 위에서 익스텐션으로 보조할 것이냐와 우리의 웹사이트에서 타사의 영상(유튜브)을 가져와서 보여주는 것으로 변경할 것이냐였다. 

### 백엔드로 이전
이 때 초기 서비스 기획 의도를 다시 떠올렸다. 사용자의 흐름에서 우리의 서비스가 자연스럽게 녹아드는 것이 목표였다. 타사의 영상을 가져와서 보여주는 것은 기획 의도와 다른 길이였고 마치 서비스가 동영상 플레이어가 되는 것만 같았다. 여러번의 코치님의 회유에도 이것만큼은 지켜야겠다고 생각을 했고 팀원들의 의견도 모두 일치했다. 졸음 감지를 백엔드로 이전하기로 결론이 났고 백엔드로 이전하면 원래 기획했던 UX로 돌아올거란 기대감에 부풀었다. 이에 대한 기술적인 내용은 2편에서 더 자세히 다루겠다.

## 커뮤니케이션
---
### 코드 정리
백엔드에서 웹 소켓 기능이 들어오면서, 다른 서비스 객체간의 기능이 필요할 때 이벤트를 발생시켜 처리하고 처리한 결과값을 다시 전달했다. 아마 서비스 간의 의존성 문제를 해결하기 위해 그랬다는 것으로 알고 있다. 하지만, 이젠 백엔드로의 이전이 결정되면서 기존의 웹소켓 코드는 쓸모가 없어지면서 걷어내야했다. 여기서도 의견이 갈렸던 것이 추가 개발 사항 중에 웹소켓이 필요하기도 하고 그대로 놔둬도 문제 없지 않겠냐는 의견이 나왔었다.

문득, 그런 생각이 스쳐 지나갔다. 소켓 관련 코드가 남아있음으로써, 누군가가 거기게 덧붙여 기능 개발을 할 수도 있겠다는 생각. 이로 인해 프로젝트 막바지에 백엔드 서버가 제대로 동작하지 않을 것만 같았다. 사용하지 않는 코드는 없애야 한다는 것과 괜한 오류 가능성을 남겨놓지 말자는 것, 필요한 때가 오면 그 때 깃 이력으로 복구가 가능하다는 점을 내세워 팀원들을 설득했다. 여러번의 설득 끝에 받아들여졌고, 크롬 익스텐션과 백엔드에서 웹 소켓 관련 코드를 무사히 걷어낼 수 있었다.

>이제와서 생각해보면 그 당시 급한 일은 아니였던 것 같기도 하다. 아직 문제가 발생한 건 아니였으니, 차라리 그 시간에 추가 기능을 개발했어야했나싶다...

### 조선의 자존심
초창기 우리가 받은 피드백으로는 발표에 흥미를 끌 요소가 부족하다(재미없다)였고 이 부분이 계속 왠지 모르게 자존심이 상했다. 졸음 감지시 졸음을 깨우기 위해 알림음을 재생하는데 매우 평범한 알람용 소리였다. 처음에는 개발한 팀원이 임의로 했겠거니 싶었으나, 개발이 어느 정도 진행했음에도 팀 분위기가 그닥 바꾸려는 의지가 없어 이대로 확정되는 것만 같아 불안했다. 

이대로는 안되겠다싶었고, 졸음 알림음에서 자극적인 요소를 넣어야한다고 강하게 주장했다. 그 때는 떠올렸던게 전두길(전한길 강사를 따라한 개그맨)의 "x발 졸리니?" 또는 아이유의 "일어나야지. 지금 안 일어나면 문제 있어~" 같은 알림음이였다. 전자는 발표에 쓰긴 너무 강하긴 했으나 이것보다 약한 것일지라도 우선은 알림음을 바꿔야한다는 인식을 주고 싶었다.

사실 이 과정에서 커뮤니케이션이 제일 힘들었다. 기술적인 요소라면, 문제점과 기술적 근거를 제시해서 설득할 수 있겠지만 이 "재미"라는 요소를 가지고 설득하기에는 너무 주관적으로 보이기 때문이다. 알림음이 "발표날 싸한 분위기를 연출할 것 같다"는 의견과 "우리가 의도한 재미를 모를 수도 있다"라는 의견이 있었다. 솔직히 맞는 말이라 생각했고, 발표날 상황은 어떻게 될 지 모르며 중요한 프로젝트가 이것으로 인해 우습게 보일까봐 거의 포기했다.

최종 발표 전 2주 전, 코치님이 와서 거의 2시간동안 같은 얘기로 피드백을 주셨다. 여전히 흥미를 끌 요소가 부족하다는 것이였고, 알림음을 왜 아직도 안 바꾸고 있냐는 것이였다. ~~속으로 쾌재를 부른다는 게 이런 것인가!!~~ 코치님의 피드백은 여러 기수를 경험하면서 나온 근거이기에 설득이 효과적이였다. 코치님 덕분에 받은 피드백을 기반으로 알림음과 반응성들을 빠르게 개선해나갔다. 리더분이 제안한 야인시대 영상으로 알림음을 변경했고 너무나 마음에 들었다.

>우리 반의 수강생들 반응도 좋았고 최종 발표때도 이 부분에서 현장 반응이 굉장히 좋았다. 나는 시연 영상 제작과 기능 구현 중 여러번 봤지만 볼 때마다 여전히 웃기다

---

*글이 너무 길어져 다음 편에서 백엔드 이전에 대한 내용을 자세하게 다루겠다!*   
[일어나야해! 넌 조선의 자존심이야! 2편](https://10kseok.github.io/posts/wake-up-wake-about-backend/)