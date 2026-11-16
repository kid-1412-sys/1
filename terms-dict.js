/**
 * AI 의약품 정보 쉬운 설명 서비스 - 의학 전문 용어 사전 및 변환 규칙
 * 출처: 식품의약품안전처 e약은요, 국립국어원 의학용어 순화어, 약학정보원
 * 최종 갱신일: 2026-11-16
 */

const MEDICAL_TERMS_DICTIONARY = {
  // 1. 질환 및 증상 관련 용어
  "해열": { simple: "열을 내림", category: "효능", detail: "높아진 체온을 정상 체온으로 낮추는 작용" },
  "진통": { simple: "통증을 가라앉힘", category: "효능", detail: "아픈 느낌이나 쑤시는 통증을 덜어주는 작용" },
  "소염": { simple: "염증을 가라앉힘", category: "효능", detail: "붓고 붉어지며 열이 나는 염증 반응을 억제하는 작용" },
  "항염": { simple: "염증에 대항함", category: "효능", detail: "몸에 생긴 염증을 줄이고 가라앉히는 효과" },
  "진경": { simple: "경련을 멈춤", category: "효능", detail: "위장이나 근육의 경련성 통증을 가라앉히는 작용" },
  "거담": { simple: "가래를 삭임", category: "효능", detail: "목에 낀 가래를 묽게 만들어 쉽게 뱉어내도록 돕는 작용" },
  "진해": { simple: "기침을 멎게 함", category: "효능", detail: "기침 중추를 진정시켜 기침을 줄여주는 작용" },
  "소양증": { simple: "가려움증", category: "증상", detail: "피부를 긁고 싶어지는 불쾌한 감각" },
  "소양감": { simple: "가려운 느낌", category: "증상", detail: "피부가 가렵고 긁고 싶은 느낌" },
  "상기도감염": { simple: "감기(코, 목의 감염)", category: "질환", detail: "코, 인두, 후두 등 숨쉬는 위쪽 길에 생긴 바이러스나 세균 감염" },
  "비염": { simple: "코염증(콧물, 코막힘)", category: "질환", detail: "코 안쪽 점막에 염증이 생겨 콧물, 재채기가 나는 질환" },
  "인후통": { simple: "목 통증", category: "증상", detail: "침이나 음식을 삼킬 때 목구멍이 따갑고 아픈 증상" },
  "인후염": { simple: "목 안쪽 염증", category: "질환", detail: "목 안쪽 점막에 염증이 생겨 따갑고 아픈 질환" },
  "비충혈": { simple: "코막힘", category: "증상", detail: "코 안쪽 혈관이 부풀어올라 숨길이 막히는 증상" },
  "발적": { simple: "피부가 붉어짐", category: "증상", detail: "혈액이 몰려 피부나 점막이 빨갛게 변하는 현상" },
  "홍반": { simple: "붉은 반점", category: "증상", detail: "피부에 생기는 붉은 색깔의 반점" },
  "부종": { simple: "몸이 붓는 현상", category: "증상", detail: "체내 수분이 한곳에 고여 부풀어 오르는 증상" },
  "소화불량": { simple: "소화가 잘 안 됨", category: "증상", detail: "음식물이 잘 내려가지 않고 더부룩하거나 답답한 상태" },
  "고창": { simple: "배에 가스가 참", category: "증상", detail: "위장관에 가스가 가득 차 배가 팽팽해지는 느낌" },
  "복부팽만감": { simple: "배가 빵빵하게 부푼 느낌", category: "증상", detail: "위나 장에 가스가 차서 더부룩한 느낌" },
  "오심": { simple: "메스꺼움(구역질 날 것 같은 느낌)", category: "증상", detail: "토할 것 같이 속이 울렁거리는 불쾌한 느낌" },
  "구토": { simple: "토함", category: "증상", detail: "위의 내용물이 입 밖으로 튀어나오는 현상" },
  "현기증": { simple: "어지럼증", category: "증상", detail: "주위가 빙빙 돌거나 중심을 잡기 힘든 어지러운 느낌" },
  "권태감": { simple: "온몸이 나른하고 피곤함", category: "증상", detail: "몸에 기운이 없고 축 처지며 피로한 상태" },
  "무기력": { simple: "기운이 없음", category: "증상", detail: "스스로 움직이거나 활동할 힘과 의욕이 없는 상태" },
  "졸음": { simple: "잠이 옴", category: "부작용", detail: "머리가 멍해지고 잠이 쏟아지는 현상" },
  "불면": { simple: "잠을 잘 못 이룸", category: "부작용", detail: "밤에 잠들기 어렵거나 자주 깨는 수면 장애" },
  "빈맥": { simple: "심장이 빠르게 뜀", category: "증상", detail: "심장 박동 수가 정상(분당 60~100회)보다 비정상적으로 빠른 상태" },
  "서맥": { simple: "심장이 느리게 뜀", category: "증상", detail: "심장 박동 수가 분당 60회 미만으로 너무 느린 상태" },
  "저혈압": { simple: "혈압이 정상보다 낮음", category: "질환", detail: "수축기 혈압이 90mmHg 미만으로 떨어져 어지러울 수 있는 상태" },
  "고혈압": { simple: "혈압이 정상보다 높음", category: "질환", detail: "혈관 벽에 가해지는 압력이 지속적으로 높은 상태" },
  "관절통": { simple: "관절이 쑤시고 아픔", category: "증상", detail: "무릎, 손가락 등 뼈마디 연결 부위의 통증" },
  "근육통": { simple: "근육이 뻐근하고 아픔", category: "증상", detail: "몸의 근육 부위가 당기거나 쑤시는 통증" },
  "신경통": { simple: "신경을 따라 찌릿하게 아픔", category: "증상", detail: "특정 신경 부위를 따라 찌르거나 찌릿하게 오는 통증" },
  "치통": { simple: "이(치아) 아픔", category: "증상", detail: "충치나 잇몸 염증 등으로 이가 쑤시는 통증" },
  "월경통": { simple: "생리통", category: "증상", detail: "생리 기간 전후로 아랫배나 허리가 아픈 증상" },
  "요통": { simple: "허리 통증", category: "증상", detail: "허리 부위가 결리거나 아픈 통증" },
  
  // 2. 약효군 및 성분 용어
  "비스테로이드성 소염진통제": { simple: "염증과 통증을 잡는 약(NSAIDs)", category: "약효군", detail: "스테로이드 성분 없이 염증을 줄이고 열과 통증을 완화하는 약" },
  "아세트아미노펜": { simple: "해열진통 성분(타이레놀 주성분)", category: "성분", detail: "위장에 부담이 적으나 간에 무리가 갈 수 있는 해열진통 성분" },
  "항히스타민제": { simple: "알레르기·콧물 완화제", category: "약효군", detail: "알레르기를 일으키는 히스타민 작용을 막아 콧물, 가려움, 재채기를 가라앉히는 약" },
  "진정작용": { simple: "마음을 차분하게 하거나 졸리게 함", category: "작용", detail: "신경을 가라앉혀 긴장을 풀거나 졸음을 유발하는 작용" },
  "제산제": { simple: "위산을 중화하는 약", category: "약효군", detail: "위산이 과다할 때 산도를 낮추어 속쓰림을 줄여주는 약" },
  "항생제": { simple: "세균을 죽이거나 억제하는 약", category: "약효군", detail: "박테리아(세균) 감염을 치료하는 약 (바이러스 감염인 보통 감기에는 효과 없음)" },
  "항진균제": { simple: "곰팡이균을 죽이는 약", category: "약효군", detail: "무좀이나 칸디다 등 진균(곰팡이) 감염을 치료하는 약" },
  "이뇨제": { simple: "소변을 잘 나오게 하는 약", category: "약효군", detail: "몸속 나트륨과 수분을 소변으로 배출시켜 부종을 빼고 혈압을 낮추는 약" },
  "정장제": { simple: "장 건강을 돕는 유익균 약", category: "약효군", detail: "장내 유익균을 보충해 설사나 변비를 개선하는 약" },
  "점막보호제": { simple: "위벽을 감싸 보호하는 약", category: "약효군", detail: "위산이나 자극성 물질로부터 위 점막을 보호해주는 약" },
  "소화효소제": { simple: "음식물 분해를 돕는 약", category: "약효군", detail: "탄수화물, 단백질, 지방을 분해하여 소화를 촉진하는 소화액 보충제" },
  "기관지확장제": { simple: "숨길을 넓혀주는 약", category: "약효군", detail: "좁아진 기관지 근육을 이완시켜 숨쉬기 편하게 해주는 약" },

  // 3. 복용 및 주의사항 관련 용어
  "금기": { simple: "절대 복용하거나 사용해서는 안 됨", category: "주의사항", detail: "특정 환자나 상황에서 치명적인 위험이 있어 절대 써서는 안 되는 조건" },
  "투여": { simple: "약을 먹거나 주사함", category: "복용법", detail: "약을 몸 안으로 들어가게 하는 모든 행위" },
  "경구 투여": { simple: "입으로 먹음", category: "복용법", detail: "알약이나 시럽을 입으로 삼켜 복용하는 방법" },
  "외용제": { simple: "피부나 겉에 바르는 약", category: "제형", detail: "먹지 않고 피부, 눈, 귀 등 겉면에 바르거나 뿌리는 약" },
  "점안": { simple: "눈에 약을 넣음", category: "복용법", detail: "안약을 눈에 한두 방울 떨어뜨려 넣는 것" },
  "식후 즉시": { simple: "밥 먹고 바로", category: "복용시간", detail: "식사 후 5분 이내에 복용 (위장 장애를 줄이기 위함)" },
  "식간 복용": { simple: "식사와 식사 사이(공복)에 먹음", category: "복용시간", detail: "식후 2시간 정도 지나 위가 비어있을 때 복용" },
  "취침 전": { simple: "자기 전", category: "복용시간", detail: "잠자리에 들기 30분~1시간 전에 복용" },
  "과민반응": { simple: "알레르기 반응", category: "부작용", detail: "몸의 면역계가 약물에 과도하게 반응하여 두드러기, 가려움, 호흡곤란 등이 생기는 현상" },
  "아나필락시스": { simple: "생명을 위협하는 급성 중증 알레르기", category: "부작용", detail: "호흡곤란, 혈압저하, 얼굴 부종 등이 급격히 오는 응급 상황" },
  "간독성": { simple: "간에 손상을 주는 부작용", category: "부작용", detail: "약물이나 그 대사물질이 간세포를 손상시키는 증상 (술과 함께 복용 시 위험 증가)" },
  "신독성": { simple: "콩팥(신장)에 손상을 주는 부작용", category: "부작용", detail: "콩팥 기능이 떨어져 노폐물 배출이 잘 안 되게 하는 부작용" },
  "위장장애": { simple: "속쓰림, 복통, 소화불량", category: "부작용", detail: "위 점막이 자극되어 속이 쓰리거나 아픈 불쾌한 증상" },
  "반동성": { simple: "약을 끊으면 증상이 더 심해짐", category: "주의사항", detail: "약을 장기간 쓰다가 중단했을 때 오히려 원래 증상이 더 악화되는 현상" },
  "내성": { simple: "약효가 점점 떨어짐", category: "주의사항", detail: "같은 약을 계속 먹다 보면 몸이 익숙해져 더 많은 양을 먹어야 효과가 나타나는 현상" },
  "병용금기": { simple: "함께 먹으면 안 되는 약", category: "주의사항", detail: "두 가지 이상의 약을 같이 먹었을 때 위험한 부작용이 생길 수 있어 금지된 조합" },
  "상호작용": { simple: "다른 약이나 음식과의 영향", category: "주의사항", detail: "다른 약이나 음식물과 함께 복용했을 때 약효가 변하거나 부작용이 증가하는 현상" },
  "소아": { simple: "만 15세 미만 어린이", category: "대상", detail: "성인과 신체 기능이 달라 약 복용량에 특별한 주의가 필요한 어린이" },
  "고령자": { simple: "만 65세 이상 어르신", category: "대상", detail: "간이나 콩팥 기능이 저하되어 있을 수 있어 복용량 조절이 필요한 어르신" },
  "임부": { simple: "임신 중인 여성(임산부)", category: "대상", detail: "태아에게 약물이 전달될 수 있어 의사 상담이 필수적인 여성" },
  "수유부": { simple: "모유를 먹이는 엄마", category: "대상", detail: "약물이 모유를 통해 아기에게 넘어갈 수 있어 주의가 필요한 산모" }
};

/**
 * 텍스트 내의 전문 용어를 찾아 쉬운 툴팁 스팬으로 감싸주는 헬퍼 함수
 */
function highlightMedicalTerms(text) {
  if (!text) return "";
  let result = text;
  
  // 긴 단어부터 먼저 매칭되도록 정렬 (예: 비스테로이드성 소염진통제 -> 소염진통제 -> 소염)
  const sortedKeys = Object.keys(MEDICAL_TERMS_DICTIONARY).sort((a, b) => b.length - a.length);

  sortedKeys.forEach(term => {
    const info = MEDICAL_TERMS_DICTIONARY[term];
    const regex = new RegExp(`(${term})(?![^<]*>|[^<>]*<\/span>)`, "g");
    result = result.replace(regex, `<span class="medical-term cursor-pointer font-semibold text-primary underline decoration-dotted underline-offset-4 hover:bg-sky-100 hover:text-sky-900 px-1 py-0.5 rounded transition" data-term="$1" data-simple="${info.simple}" data-desc="${info.detail}" data-category="${info.category}" title="${info.simple}">$1</span>`);
  });

  return result;
}

/**
 * 복잡한 약학 문장을 쉬운 문장으로 변환하는 로컬 규칙 기반 Fallback 엔진
 */
function simplifySentenceRuleBased(text) {
  if (!text) return "";
  let simplified = text;

  // 문장 구조 간소화 규칙
  const simplifications = [
    { from: /단, /g, to: "하지만 " },
    { from: /경구 투여한다/g, to: "입으로 삼켜 복용합니다" },
    { from: /투여하지 말 것/g, to: "절대로 복용하지 마세요" },
    { from: /투여할 것/g, to: "복용하세요" },
    { from: /복용을 중지하고/g, to: "약을 바로 끊고" },
    { from: /의사, 약사와 상의할 것/g, to: "의사나 약사에게 진료를 받으세요" },
    { from: /신중히 투여할 것/g, to: "조심해서 복용해야 합니다" },
    { from: /다음과 같은 이상반응이 나타날 경우/g, to: "이런 부작용이 생기면" },
    { from: /발현될 수 있으므로/g, to: "나타날 수 있으니" },
    { from: /과량 투여 시/g, to: "기준치보다 너무 많이 드실 경우" },
    { from: /직사일광을 피하고/g, to: "햇빛이 바로 들지 않고" },
    { from: /습기가 적은 서늘한 곳에/g, to: "건조하고 시원한 장소에" },
    { from: /밀폐용기에 담아 보관한다/g, to: "뚜껑을 꼭 닫아 보관하세요" }
  ];

  simplifications.forEach(rule => {
    simplified = simplified.replace(rule.from, rule.to);
  });

  return simplified;
}

// 브라우저 및 모듈 호환성
if (typeof window !== "undefined") {
  window.MEDICAL_TERMS_DICTIONARY = MEDICAL_TERMS_DICTIONARY;
  window.highlightMedicalTerms = highlightMedicalTerms;
  window.simplifySentenceRuleBased = simplifySentenceRuleBased;
}
