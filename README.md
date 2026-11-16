# 모두의 약설명 (EasyPharm AI) 💊
### AI 기반 의약품 정보 쉬운 설명 웹 서비스 (GitHub Pages 배포용)

> **"어려운 의약품 설명서, 딥러닝 AI와 식약처 공식 자료로 누구나 알기 쉽게!"**  
> 일반 국민, 고령자, 시각 보조가 필요한 사용자를 위해 전문 의학 용어와 복잡한 약 설명서를 쉬운 일상어로 풀어주는 웹 애플리케이션입니다.

---

## 🌐 서비스 바로가기 (배포 링크)
GitHub 저장소에 푸시 후 GitHub Pages를 활성화하면 아래 주소로 즉시 서비스됩니다:
- **GitHub Pages 공식 링크**: `https://<당신의_GitHub_아이디>.github.io/<저장소_이름>/`
- **로컬 실행 링크**: `http://localhost:8000` (Python 내장 서버)

---

## 📌 1. 프로젝트 개요

- **프로젝트명**: AI 의약품 정보 쉬운 설명 서비스 (`EasyPharm AI`)
- **개발 목적**: 
  - 의약품 안전사용서비스(DUR) 및 공식 허가사항에 포함된 한자어 전문 용어(예: *해열진통*, *상기도감염*, *소양증*, *금기* 등)를 일상어로 순화.
  - 검색증강생성(RAG)과 Tesseract.js OCR을 결합하여 복잡한 약 설명서를 읽기 쉬운 글머리 기호 요약문으로 변환.
  - 복용량·복용법 왜곡 없는 안전한 의료 정보 접근성 강화.
- **주요 사용자**:
  - 의약학 지식이 부족한 일반인 및 청소년
  - 눈이 침침하거나 긴 문장을 이해하기 어려운 어르신(고령자)
  - 처방전이나 약봉투를 사진으로 빠르게 확인하고 싶은 모바일 사용자

---

## 🏛️ 2. 공식 데이터 출처 및 이용 조건

본 서비스는 대한민국 보건복지 당국의 3대 공식 의약품 정보 포털의 공공데이터를 기반으로 구축되었습니다:

1. **식품의약품안전처 - e약은요** ([https://nedrug.mfds.go.kr/searchEasyDrug](https://nedrug.mfds.go.kr/searchEasyDrug))
   - *역할*: 일반 국민 눈높이에 맞춘 공식 감수 설명 자료 참조
2. **의약품안전나라 - 의약품등 정보검색** ([https://nedrug.mfds.go.kr/searchDrug](https://nedrug.mfds.go.kr/searchDrug))
   - *역할*: 공식 의약품 허가사항 및 전문 원문 자료(효능군, 기준코드, 이상반응 등) 대조
3. **약학정보원 - 복약정보** ([https://www.health.kr/drug-info/medication](https://www.health.kr/drug-info/medication))
   - *역할*: 복약 시 식이 상호작용 및 환자 주의사항 체계 참조

- **데이터 수집 기준일**: 2026년 11월 16일
- **투명성 원칙**: 공식 원문과 AI 생성 요약문을 명확한 배지로 구분하며, 원문 링크와 품목기준코드를 투명하게 제공합니다.

---

## 🧠 3. 핵심 AI 및 딥러닝 기술

1. **Google Gemini Generative AI (사전학습 딥러닝 LLM)**
   - 최신 `gemini-1.5-flash` 모델을 클라이언트에서 실시간 연동.
   - 복잡한 문장의 문맥을 파악하여 초등학생/어르신 수준의 쉬운 한국어로 재구성.
2. **검색증강생성 (RAG, Retrieval-Augmented Generation)**
   - 임의의 환각(Hallucination) 방지를 위해 사용자 질문에 맞는 식약처 공식 원문(`MEDICINE_DATABASE`)을 우선 검색하여 LLM 프롬프트에 컨텍스트로 엄격 주입.
3. **브라우저 기반 클라이언트 OCR (Tesseract.js)**
   - 서버 전송 없이 사용자의 브라우저 내에서 캔버스 전처리(그레이스케일/대비 증폭) 후 한국어(`kor`)+영어(`eng`) 문자를 고속 인식.
   - 처방전·약봉투 이미지에서 의약품명을 자동으로 파싱.
4. **로컬 지능형 Fallback 엔진 (No-Key Mode)**
   - API 키가 없거나 네트워크가 오프라인이어도 400여 개 전문 용어 사전(`terms-dict.js`)과 자연어 문장 간소화 규칙을 통해 100% 무료 로컬 RAG로 완전 작동.

---

## 🛡️ 4. 안전성과 정확성 (Medical Disclaimer)

> **[경고] 본 서비스는 의료진의 판단 및 복약지도를 대신할 수 없습니다.**

- ❌ 개인별 복용 방법이나 의약품 사용을 새로 추천하거나 처방하지 않습니다.
- ❌ **복용량, 복용 시간, 투여 방법(행동 지침)은 AI가 임의로 수정하거나 변경하지 않으며, 식약처 공식 원문을 그대로 보존(Lock)합니다.**
- ❌ 공식 원문에 없는 효능을 지어내지 않으며, 부작용 위험을 축소하지 않습니다.
- ⚠️ 질병 치료에 대한 최종 판단은 반드시 의사, 치과의사, 약사 등 보건의료 전문가와 상담하십시오.

---

## 💻 5. 화면 구성 및 사용자 인터페이스

1. **메인 홈 화면 (`#view-home`)**: 서비스 소개, 다빈도 의약품(타이레놀, 이지엔6, 탁센, 게보린, 겔포스 등) 퀵 스타트
2. **의약품 검색·입력 (`#view-search`)**: 약품명 실시간 자동완성 검색 및 복잡한 설명서 문장 직접 입력
3. **처방전 OCR 분석 (`#view-ocr`)**: 드래그 앤 드롭 사진 업로드, 가상 샘플 원클릭 테스트, 텍스트 자동 추출
4. **AI 분석 결과 (`#view-result`)**: 한눈 요약, 쉬운 주요 효능, 보존된 복용법, 필수 주의사항, 🔊 음성 읽기(TTS)
5. **원문 vs 쉬운 설명 비교 (`#view-compare`)**: 좌우 2열 Side-by-Side 대조, 전문 용어 인터랙티브 툴팁
6. **공식 출처 및 신뢰도 (`#view-sources`)**: 식약처/약학정보원 정식 출처 URL 및 데이터 규격 투명 공개

---

## ♿ 6. 접근성 (Accessibility & Barrier-Free)

- **글자 크기 조절기**: `A-` (16px), `보통` (18px), `A+` (21px) 3단계 원클릭 폰트 스케일링
- **고대비 모드**: 흑백 반전 및 고대비 색상 지원으로 시각 약자 편의 증진
- **음성 안내 (TTS)**: Web Speech API를 활용해 쉬운 설명과 주의사항을 어르신 친화적인 속도로 낭독

---

## 📁 7. 프로젝트 파일 구성

```
📁 AI-easy-medicine/
├── index.html            # 메인 싱글 페이지 웹 애플리케이션 (SPA)
├── .nojekyll             # GitHub Pages Jekyll 빌드 우회 설정
├── README.md             # 프로젝트 안내 및 배포 가이드
├── css/
│   └── style.css         # 메디컬 테마, 반응형, 고대비, 배리어프리 스타일
├── js/
│   ├── app.js            # 전체 앱 라이프사이클 및 화면 라우팅, UI 이벤트
│   ├── terms-dict.js     # 400여 개 의약 전문용어 일상어 순화 사전 및 규칙
│   ├── medicine-db.js    # 식약처 e약은요 표준 포맷 다빈도 의약품 DB (RAG)
│   ├── ocr.js            # Tesseract.js 기반 클라이언트 사이드 OCR 엔진
│   └── ai-service.js     # Gemini API 실시간 통신 및 RAG 파이프라인 엔진
└── assets/               # 이미지 및 정적 아이콘 리소스
```

---

## 🚀 8. GitHub Pages 배포 방법 (Step-by-Step)

1. **GitHub 저장소(Repository) 생성**
   - GitHub에 로그인한 후 `AI-easy-medicine` 또는 원하는 이름의 새 Public 저장소를 만듭니다.

2. **로컬 파일 커밋 & 푸시**
   ```bash
   git init
   git add .
   git commit -m "feat: AI 의약품 정보 쉬운 설명 서비스 초기 배포"
   git branch -M main
   git remote add origin https://github.com/<당신의_아이디>/<저장소_이름>.git
   git push -u origin main
   ```

3. **GitHub Pages 활성화**
   - 저장소 상단 탭에서 **`Settings`** 클릭
   - 좌측 메뉴에서 **`Pages`** 선택
   - **`Build and deployment`** 섹션의 Source를 **`Deploy from a branch`**로 지정
   - Branch를 **`main`** / **`/(root)`** 로 설정하고 **`Save`** 클릭

4. **배포 확인**
   - 1~2분 후 페이지 상단에 녹색 체크 표시와 함께 웹페이지 링크가 생성됩니다:
   - `https://<당신의_아이디>.github.io/<저장소_이름>/`
