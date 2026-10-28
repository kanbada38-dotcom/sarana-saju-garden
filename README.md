# 사라나의 운명정원 · 月下命園

달빛 한옥과 사라나 캐릭터를 중심으로 만든 반응형 사주 홈페이지.

## 실행
`python3 -m http.server 8080` 실행 후 `http://localhost:8080` 열기. 빌드나 API 키 불필요.

## 기능
- 양력 생일 / 한국 표준시 입력 → 절기 기반 년·월·일·시주 계산
- 시간 모름 선택 시 시주 숨김
- 일간 오행 기반 창작 캐릭터와 자기성찰 문구
- 두 사람 일간을 이용한 대화 질문 (궁합 예측/점수 아님)
- 한국 날짜 기준 창작 오늘의 편지
- 사주 배움터, 용어 사전, 갤러리
- 동의한 경우 캐릭터 이름·오행·저장일만 localStorage 저장/삭제

## 계산 범위
lunar-javascript 1.7.7 (MIT). 양력 1901년~오늘. 일주는 자정 교체(sect 2), 절기 연월주. 한국 표준시 입력을 그대로 사용. 출생지 진태양시 및 과거 서머타임 미보정. 음력 직접 입력, 대운·용신 분석 미지원. 절입 경계의 정밀 감정에는 별도 검증 필요.

캐릭터·운세·궁합 문장은 창작 자기성찰 콘텐츠이며 전문 종합 감정이 아님.
회원가입·결제·메일 발송·서버 저장은 구현 범위에 포함되지 않음.

## GitHub Pages 자동 배포
1. 새 GitHub 저장소에 이 폴더 내용을 업로드 (index.html이 루트에 위치).
2. Settings → Pages → Source를 GitHub Actions로 설정.
3. Actions → Deploy Garden to GitHub Pages 워크플로 실행.
4. 성공한 deployment의 page_url로 접속. 이후 main 수정 시 자동 재배포.

라이브러리 저작권은 assets/lunar-LICENSE.txt 참조. 이미지 생성 자산은 assets/sarana-moonlight.webp.

## 검증
node --check app.js
node verify.cjs
