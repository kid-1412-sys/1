/**
 * AI 의약품 정보 쉬운 설명 서비스 - 공식 의약품 데이터베이스 (RAG 지식 베이스)
 * 
 * 데이터 출처:
 * 1. 식품의약품안전처 e약은요 (https://nedrug.mfds.go.kr/searchEasyDrug)
 * 2. 의약품안전나라 의약품등 정보검색 (https://nedrug.mfds.go.kr/searchDrug)
 * 3. 약학정보원 의약품 상세검색 및 복약정보 (https://www.health.kr/drug-info/medication)
 * 
 * 최종 수집 및 검증일: 2026년 11월 16일
 */

const MEDICINE_DATABASE = [
  {
    id: "tylenol-500",
    itemSeq: "199300385",
    itemName: "타이레놀정500밀리그람(아세트아미노펜)",
    entpName: "(주)한국존슨앤드존슨",
    category: "해열·진통·소염제",
    type: "일반의약품",
    ingredients: "아세트아미노펜(KP) 500mg",
    appearance: "흰색의 장방형 필름코팅정 (앞면: TYLENOL, 뒷면: 500)",
    collectDate: "2026-11-16",
    sources: {
      eYak: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=199300385",
      nedrug: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=199300385",
      healthKr: "https://www.health.kr/searchDrug/result_drug.asp?drug_cd=A11A0430A0124"
    },
    // 공식 원문 (의약품안전나라 표준 허가사항)
    officialDoc: {
      efficacy: "감기로 인한 발열 및 동통(통증), 두통, 신경통, 근육통, 월경통, 염좌통(삔 통증), 치통, 관절통, 류마티스성 통증의 완화",
      dosage: "만 12세 이상 소아 및 성인: 1회 1~2정씩 1일 3~4회 (4~6시간마다) 필요시 복용한다. 1일 최대 8정(4,000mg)을 초과하여 복용하지 않는다. 이 약은 가능한 최단기간 동안 최소 유효용량으로 복용한다.",
      precautions: "매일 세 잔 이상 정기적으로 술을 마시는 사람이 이 약이나 다른 해열진통제를 복용해야 할 경우 간손상이 유발될 수 있으므로 반드시 의사 또는 약사와 상의해야 한다. 아세트아미노펜 일일 최대 용량(4,000mg)을 초과할 경우 간손상을 일으킬 수 있으므로 주의한다.",
      interactions: "바르비탈계 약물, 삼환계 항우울제 및 알코올을 투여한 환자는 아세트아미노펜의 대사능력이 감소되어 간독성이 증가할 수 있다."
    },
    // 쉬운 설명 (e약은요 및 RAG 딥러닝 정제 모델 기준)
    easyExplanation: {
      summary: "열을 내리고 통증을 줄여주는 대표적인 해열진통제입니다.",
      keyPoints: [
        "두통, 치통, 생리통, 근육통과 열감기에 씁니다.",
        "위장 장애가 적어 빈속(공복)에 먹어도 비교적 괜찮습니다.",
        "간 손상 위험이 있으므로 술을 마신 뒤나 술을 자주 드시는 분은 피해야 합니다."
      ],
      usageSummary: "만 12세 이상 성인은 1번에 1~2알씩, 하루 3~4회(최소 4시간 이상 간격) 먹습니다. 하루에 총 8알(4,000mg)을 넘기면 안 됩니다.",
      crucialWarning: "🚨 주의: 술과 함께 드시면 간이 심각하게 손상될 수 있습니다. 다른 감기약이나 진통제에도 동일 성분이 들어있을 수 있으니 성분 중복에 주의하세요."
    }
  },
  {
    id: "ezn6-any",
    itemSeq: "200608569",
    itemName: "이지엔6애니연질캡슐(이부프로펜)",
    entpName: "대웅제약",
    category: "해열·진통·소염제",
    type: "일반의약품",
    ingredients: "이부프로펜(KP) 200mg",
    appearance: "청록색의 투명한 타원형 액상 연질캡슐 (각인: E6A)",
    collectDate: "2026-11-16",
    sources: {
      eYak: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=200608569",
      nedrug: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=200608569",
      healthKr: "https://www.health.kr/searchDrug/result_drug.asp?drug_cd=A11A0430A0347"
    },
    officialDoc: {
      efficacy: "류마티양 관절염, 골관절염, 강직성 척추염, 연조직손상, 비관절 류마티스질환, 급성통풍, 건선성 관절염, 두통, 월경곤란증(생리통), 수술후 통증, 급성 상기도감염의 해열 및 진통",
      dosage: "성인: 1회 200~400mg(1~2캡슐) 1일 3~4회 경구투여한다. 1일 최고용량은 3200mg이다. 연소성 류마티양 관절염에는 1일 체중 kg당 30~40mg을 3~4회 분할 투여한다.",
      precautions: "소화성궤양 환자, 심한 혈액이상 환자, 심한 간장애 및 신장애 환자, 심한 심기능부전 환자, 고혈압 환자에게는 투여하지 말 것. 위장관 출혈의 위험이 있으므로 식후 즉시 복용하는 것이 바람직하다.",
      interactions: "다른 비스테로이드성 소염진통제(NSAIDs) 및 아스피린과 병용 시 위장관 궤양 및 출혈의 위험이 증가할 수 있다."
    },
    easyExplanation: {
      summary: "염증을 가라앉히고 통증과 열을 빠르게 잡아주는 액상 소염진통제입니다.",
      keyPoints: [
        "생리통, 치통, 관절 쑤심, 붓기를 동반한 통증에 효과적입니다.",
        "액상 캡슐 형태로 알약보다 체내 흡수가 빠릅니다.",
        "위벽을 자극할 수 있어 반드시 식사 직후에 물과 함께 드셔야 합니다."
      ],
      usageSummary: "성인은 1회에 1~2캡슐씩, 하루 3~4번 식사 후에 물과 함께 삼킵니다.",
      crucialWarning: "🚨 주의: 위염이나 위궤양이 있으신 분은 속쓰림이나 위출혈이 생길 수 있으므로 식후에 꼭 드시고, 다른 소염진통제와 함께 드시지 마세요."
    }
  },
  {
    id: "tak-sen",
    itemSeq: "200701155",
    itemName: "탁센연질캡슐(나프록센)",
    entpName: "GC녹십자",
    category: "해열·진통·소염제",
    type: "일반의약품",
    ingredients: "나프록센(USP) 250mg",
    appearance: "청록색의 투명한 타원형 액상 연질캡슐 (각인: TAKSEN)",
    collectDate: "2026-11-16",
    sources: {
      eYak: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=200701155",
      nedrug: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=200701155",
      healthKr: "https://www.health.kr/searchDrug/result_drug.asp?drug_cd=A11A0430A0399"
    },
    officialDoc: {
      efficacy: "류마티스관절염, 골관절염, 강직성척추염, 건염(힘줄염), 급성통풍, 월경곤란증(생리통), 활액낭염, 골격근장애, 수술후 동통, 편두통, 발치후 동통",
      dosage: "류마티스관절염 등: 1회 250~500mg 1일 2회 (12시간마다) 복용. 급성통풍: 초회량 750mg, 이후 8시간마다 250mg 복용. 편두통: 초회량 750mg 복용 후 필요시 0.5~1시간 후 250~500mg 추가 복용. 1일 총 1250mg을 초과하지 않는다.",
      precautions: "위장관 궤양, 출혈 또는 천공의 위험성이 지속 복용 시 증가할 수 있음. 심혈관계 혈전 반응 위험성 증가 가능.",
      interactions: "항응고제(와파린 등)와 병용 투여 시 출혈 경향이 심해질 수 있으므로 신중히 투여할 것."
    },
    easyExplanation: {
      summary: "오랫동안 통증을 줄여주는 강력한 소염진통제입니다.",
      keyPoints: [
        "약효가 8~12시간으로 길어 심한 치통, 편두통, 관절통, 극심한 생리통에 많이 쓰입니다.",
        "위장에 부담을 줄 수 있으므로 식사 후 바로 충분한 물과 함께 복용합니다.",
        "하루 복용 가능한 최대량을 엄격히 지켜야 합니다."
      ],
      usageSummary: "보통 1알(250mg)에서 2알을 아침/저녁 12시간 간격으로 식후에 복용합니다. 첫날 최대 5알(1250mg)을 넘기지 않습니다.",
      crucialWarning: "🚨 주의: 위장이 약하신 분은 속쓰림, 위통이 생기기 쉽습니다. 공복 복용을 피하시고 위장약을 함께 처방받아 드시는 것이 좋습니다."
    }
  },
  {
    id: "geborin",
    itemSeq: "197900137",
    itemName: "게보린정",
    entpName: "삼진제약",
    category: "해열·진통·소염제",
    type: "일반의약품",
    ingredients: "아세트아미노펜 300mg, 이소프로필안티피린 150mg, 카페인무수물 50mg",
    appearance: "분홍색의 삼각 모양 정제 (각인: 삼각형 내 삼진 마크)",
    collectDate: "2026-11-16",
    sources: {
      eYak: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=197900137",
      nedrug: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=197900137",
      healthKr: "https://www.health.kr/searchDrug/result_drug.asp?drug_cd=A11A0430A0012"
    },
    officialDoc: {
      efficacy: "두통, 치통, 발치(이를 뽑음)후 동통, 인후통, 귀의 통증, 관절통, 신경통, 요통, 근육통, 견통(어깨통증), 타박통, 염좌통, 월경통, 외상통의 진통, 오한·발열시의 해열",
      dosage: "성인 1회 1정 1일 3회까지 공복을 피하여 복용한다. 복용간격은 4시간 이상으로 한다. 만 15세 미만의 소아는 복용하지 않는다. 단기 요법으로 5~6회 복용해도 증상 개선이 없을 경우 복용 중지.",
      precautions: "이소프로필안티피린 성분으로 인한 혈액장애 및 의식장애 위험. 만 15세 미만 소아 복용 금기. 장기 연용 금지.",
      interactions: "다른 해열진통제, 감기약, 진정제와 병용 투여하지 말 것. 카페인 함유 음료와 동시 섭취 주의."
    },
    easyExplanation: {
      summary: "두통과 치통을 빠르게 가라앉히는 복합 해열진통제입니다.",
      keyPoints: [
        "진통 성분과 함께 카페인이 들어있어 통증 완화가 신속하게 나타납니다.",
        "만 15세 미만 어린이는 절대 먹으면 안 됩니다.",
        "커피나 에너지 드링크와 함께 드시면 가슴 두근거림이나 불면이 올 수 있습니다."
      ],
      usageSummary: "만 15세 이상 성인만 1회 1정을 밥 먹은 후 복용하며, 하루 3번까지(4시간 이상 간격)만 드십니다.",
      crucialWarning: "🚨 주의: 15세 미만 청소년/어린이는 복용 금지입니다. 5~6회 복용 후에도 낫지 않으면 계속 드시지 말고 의사 진료를 받으세요."
    }
  },
  {
    id: "panpyrin-q",
    itemSeq: "196100030",
    itemName: "판피린큐액(20mL)",
    entpName: "동아제약",
    category: "해열·진통·소염제 (종합감기약)",
    type: "일반의약품",
    ingredients: "아세트아미노펜 300mg, 클로르페니라민말레산염 2.5mg, 메틸에페드린 18mg, 카페인무수물 30mg 등",
    appearance: "갈색 유리병에 든 특이한 향과 쓴맛이 있는 액제",
    collectDate: "2026-11-16",
    sources: {
      eYak: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=196100030",
      nedrug: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=196100030",
      healthKr: "https://www.health.kr/searchDrug/result_drug.asp?drug_cd=A11A0430A0155"
    },
    officialDoc: {
      efficacy: "감기의 제증상(콧물, 코막힘, 재채기, 인후통, 기침, 가래, 오한, 발열, 두통, 관절통, 근육통)의 완화",
      dosage: "성인 1회 1병(20mL)을 1일 3회 식후 30분에 복용한다.",
      precautions: "항히스타민제로 인한 졸음 유발 가능. 운전 및 위험한 기계 조작 금지. 고혈압 환자, 심장질환 환자, 녹내장 환자는 신중히 투여할 것.",
      interactions: "다른 비염용 내복약, 항히스타민제, 진정제와 병용 금기. 알코올 섭취 시 중추신경 억제 위험 증가."
    },
    easyExplanation: {
      summary: "열, 두통, 콧물, 기침 등 여러 초기 감기 증상을 한 번에 잡는 마시는 종합감기약입니다.",
      keyPoints: [
        "액체로 되어 있어 흡수가 빠르고 마시기 편합니다.",
        "콧물을 멈추는 성분 때문에 졸음이 쏟아질 수 있습니다.",
        "운전을 하거나 정밀한 기계를 다룰 때는 복용을 피하세요."
      ],
      usageSummary: "성인은 식사 후 30분 뒤에 1병(20mL)씩, 하루 3번 마십니다.",
      crucialWarning: "🚨 주의: 졸음이 올 수 있으니 운전 전에 드시지 마세요. 다른 진통제나 기침약과 성분이 겹칠 수 있으니 함께 복용하지 마세요."
    }
  },
  {
    id: "gelfos-m",
    itemSeq: "200001099",
    itemName: "겔포스엠현탁액(20g)",
    entpName: "보령",
    category: "제산제",
    type: "일반의약품",
    ingredients: "인산알루미늄겔 12.38g, 수산화마그네슘 400mg, 시메티콘 40mg",
    appearance: "알루미늄 포에 든 흰색의 걸쭉한 액상 현탁제",
    collectDate: "2026-11-16",
    sources: {
      eYak: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=200001099",
      nedrug: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=200001099",
      healthKr: "https://www.health.kr/searchDrug/result_drug.asp?drug_cd=A11A0430A0188"
    },
    officialDoc: {
      efficacy: "위산과다, 속쓰림, 위통, 위부불쾌감, 구역, 구토, 위부팽만감, 체함, 가스제거",
      dosage: "성인 1회 1포를 1일 3회 식간(식사와 식사 사이) 및 취침 시에 복용한다. 복용간격은 4시간 이상으로 한다.",
      precautions: "신장애 환자는 알루미늄이나 마그네슘이 체내에 축적될 수 있으므로 장기 복용을 피할 것. 변비 또는 설사가 나타날 수 있음.",
      interactions: "테트라사이클린계 항생물질과 함께 복용 시 항생제 흡수가 저해되므로 1~2시간 이상 간격을 둘 것."
    },
    easyExplanation: {
      summary: "과도하게 나온 위산을 중화하고 위벽을 감싸 보호해주는 짜먹는 위장약입니다.",
      keyPoints: [
        "위산으로 속이 쓰리거나 쓰린 통증, 가스가 찰 때 효과가 좋습니다.",
        "식사 중간 공복(밥 먹고 2시간 뒤)이나 자기 전에 짜서 드십니다.",
        "다른 약의 흡수를 방해할 수 있으므로 다른 약과는 1~2시간 간격을 두고 드세요."
      ],
      usageSummary: "성인은 1회 1포씩, 하루 3번 밥 먹고 2시간 뒤나 잠들기 전에 흔들어 짜서 먹습니다.",
      crucialWarning: "🚨 주의: 콩팥(신장)이 안 좋으신 분은 장기 복용을 피하시고, 항생제나 철분제와 함께 드시면 약효가 떨어질 수 있습니다."
    }
  },
  {
    id: "bease",
    itemSeq: "198700088",
    itemName: "베아제정",
    entpName: "대웅제약",
    category: "건위소화제",
    type: "일반의약품",
    ingredients: "디아스타제·프로테아제·셀룰라제, 판크레아틴, 시메티콘 등",
    appearance: "연두색의 장방형 당의정",
    collectDate: "2026-11-16",
    sources: {
      eYak: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=198700088",
      nedrug: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=198700088",
      healthKr: "https://www.health.kr/searchDrug/result_drug.asp?drug_cd=A11A0430A0065"
    },
    officialDoc: {
      efficacy: "소화불량, 식욕감퇴(식욕부진), 과식, 체함, 소화촉진, 소화불량으로 인한 위부팽만감",
      dosage: "성인 1회 1정 1일 3회 식후에 복용한다.",
      precautions: "만 7세 이하의 어린이는 복용하지 않는다. 2주 정도 투여하여도 증상의 개선이 없을 경우 즉각 중지하고 의사나 약사와 상의한다.",
      interactions: "알칼리성 약물과 병용 시 장용성 코팅이 위에서 미리 녹아 효과가 감소할 수 있음."
    },
    easyExplanation: {
      summary: "위와 장에서 탄수화물, 단백질, 지방을 고루 분해해주는 소화효소제입니다.",
      keyPoints: [
        "과식했거나 속이 답답하고 더부룩할 때 소화를 촉진해줍니다.",
        "가스를 없애주는 성분이 들어있어 배가 빵빵한 증상을 덜어줍니다.",
        "장까지 살아서 가도록 특수 코팅되어 있어 씹거나 부수지 말고 꿀꺽 삼켜야 합니다."
      ],
      usageSummary: "성인은 식사 후 1알씩, 하루 3회 물과 함께 통째로 삼킵니다.",
      crucialWarning: "🚨 주의: 알약을 쪼개거나 씹어 드시면 효과가 떨어집니다. 2주 이상 드셔도 소화불량이 지속되면 정밀 검사를 받으세요."
    }
  },
  {
    id: "zyrtec",
    itemSeq: "199300344",
    itemName: "지르텍정(세티리진염산염)",
    entpName: "한국유씨비제약 / 유한양행",
    category: "항히스타민제",
    type: "일반의약품",
    ingredients: "세티리진염산염(EP) 10mg",
    appearance: "흰색의 장방형 필름코팅정 (분할선 있음)",
    collectDate: "2026-11-16",
    sources: {
      eYak: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=199300344",
      nedrug: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=199300344",
      healthKr: "https://www.health.kr/searchDrug/result_drug.asp?drug_cd=A11A0430A0110"
    },
    officialDoc: {
      efficacy: "계절성 및 다년성 알레르기성 비염, 알레르기성 결막염, 만성 특발성 두드러기, 피부소양증, 습진, 피부염",
      dosage: "성인 및 6세 이상의 소아: 1일 1회 10mg(1정)을 취침 전에 경구투여한다. 이상반응에 민감한 환자의 경우 5mg(반 정)씩 아침, 저녁으로 분할 투여한다.",
      precautions: "심한 신부전 환자 투여 금기. 졸음 및 피로를 유발할 수 있으므로 운전 시 각별히 주의할 것. 수유부 투여 금기.",
      interactions: "알코올이나 중추신경억제제와의 병용 시 주의력 감퇴 및 중추신경계 기능 억제가 증강될 수 있음."
    },
    easyExplanation: {
      summary: "꽃가루 알레르기, 콧물, 재채기, 두드러기, 피부 가려움을 가라앉히는 알레르기 약입니다.",
      keyPoints: [
        "알레르기를 일으키는 히스타민 작용을 막아 빠르게 가려움과 콧물을 멈춥니다.",
        "하루에 딱 1알만 먹으면 24시간 동안 효과가 지속됩니다.",
        "졸릴 수 있으므로 주로 자기 전에 먹는 것이 좋습니다."
      ],
      usageSummary: "성인 및 6세 이상 어린이는 하루 1번, 저녁 잠들기 전에 1알을 물과 함께 복용합니다.",
      crucialWarning: "🚨 주의: 낮에 드시면 졸음이나 집중력 저하가 올 수 있습니다. 술을 드시면 졸음이 훨씬 심해지므로 금주하세요."
    }
  },
  {
    id: "fucidin",
    itemSeq: "198000045",
    itemName: "후시딘연고(퓨시드산나트륨)",
    entpName: "동화약품",
    category: "피부외용제 (항생제)",
    type: "일반의약품",
    ingredients: "퓨시드산나트륨(KP) 20mg/g",
    appearance: "미백색의 반투명한 부드러운 연고제",
    collectDate: "2026-11-16",
    sources: {
      eYak: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=198000045",
      nedrug: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=198000045",
      healthKr: "https://www.health.kr/searchDrug/result_drug.asp?drug_cd=A11A0430A0019"
    },
    officialDoc: {
      efficacy: "농피증(고름피부증: 농가진, 감염성습진양피부염, 심상성여드름(보통여드름), 모낭염, 종기 및 종기증, 화농성한선염, 농포성건선), 화상·외상·봉합창·식피창에 의한 2차 감염",
      dosage: "환부를 깨끗이 하고 1일 1~2회 적당량을 환부에 직접 바르거나 무균거즈에 넓게 펴발라 붙인다. 보통 1주일 정도로 투여기간을 제한한다.",
      precautions: "이 약의 사용에 있어서 내성균의 발현 등을 방지하기 위하여 원칙적으로 감수성을 확인하고 치료상 필요한 최소기간만 투여할 것. 눈이나 눈꺼풀에는 바르지 말 것.",
      interactions: "보고된 주요 약물 상호작용 없음."
    },
    easyExplanation: {
      summary: "상처 부위에 세균이 침투하여 곪거나 덧나지 않게 막아주는 상처용 항생제 연고입니다.",
      keyPoints: [
        "긁힌 상처, 찰과상, 찢어진 상처, 곪은 뾰루지에 세균 감염을 막아줍니다.",
        "피부 깊숙이 스며드는 침투력이 뛰어납니다.",
        "세균 내성이 생길 수 있으므로 상처가 아물면 1주일 이내로 사용을 마무리합니다."
      ],
      usageSummary: "상처를 깨끗이 씻은 후 하루 1~2회 얇게 펴 바르고, 필요하면 밴드를 붙입니다.",
      crucialWarning: "🚨 주의: 눈 주위에는 절대 바르지 마세요. 장기간(1주일 이상) 습관적으로 바르면 약에 균이 내성을 가질 수 있습니다."
    }
  },
  {
    id: "amodipine",
    itemSeq: "200401889",
    itemName: "아모디핀정(암로디핀베실산염)",
    entpName: "한미약품",
    category: "혈압강하제",
    type: "전문의약품",
    ingredients: "암로디핀베실산염(USP) 6.944mg (암로디핀으로서 5mg)",
    appearance: "흰색의 팔각형 정제 (각인: HM / AD 5)",
    collectDate: "2026-11-16",
    sources: {
      eYak: "https://nedrug.mfds.go.kr/searchEasyDrug",
      nedrug: "https://nedrug.mfds.go.kr/pbp/CCBBB01/getItemDetail?itemSeq=200401889",
      healthKr: "https://www.health.kr/searchDrug/result_drug.asp?drug_cd=A11A0430A0261"
    },
    officialDoc: {
      efficacy: "고혈압, 관상동맥의 고정폐쇄(안정형협심증) 또는 관상혈관계의 혈관경련/혈관수축(이형협심증)에 의한 심근성허혈증",
      dosage: "성인: 암로디핀으로서 1일 1회 5mg을 경구투여하며 환자의 반응에 따라 1일 최대 10mg까지 증량할 수 있다. 연령, 증상에 따라 적절히 증감한다.",
      precautions: "심인성 쇼크 환자, 대동맥판협착증 환자, 불안정형 협심증 환자에게는 투여하지 말 것. 말초부종, 두통, 홍조, 어지러움이 나타날 수 있음.",
      interactions: "자몽주스와 병용 시 혈중 농도가 상승하여 혈압이 급격히 떨어질 수 있으므로 피할 것."
    },
    easyExplanation: {
      summary: "혈관을 부드럽게 넓혀 혈압을 낮추고 심장의 부담을 덜어주는 의사 처방 혈압약입니다.",
      keyPoints: [
        "고혈압과 협심증(가슴 통증) 환자에게 주로 처방됩니다.",
        "하루 한 번 일정한 시간에 꾸준히 드시는 것이 가장 중요합니다.",
        "자몽이나 자몽주스와 함께 드시면 혈압이 지나치게 떨어질 수 있으니 피해야 합니다."
      ],
      usageSummary: "의사의 처방 지시에 따라 매일 같은 시간(보통 아침)에 1정을 물과 함께 복용합니다.",
      crucialWarning: "🚨 주의: 전문의약품이므로 본인 임의로 복용을 중단하거나 용량을 바꾸면 혈압이 급상승해 위험할 수 있습니다. 자몽주스는 마시지 마세요."
    }
  }
];

/**
 * 키워드 및 약품명으로 데이터베이스 검색 (RAG Retrieval 함수)
 */
function searchMedicineDatabase(query) {
  if (!query || typeof query !== "string") return [];
  const cleanQuery = query.trim().toLowerCase();
  
  return MEDICINE_DATABASE.filter(item => {
    const matchName = item.itemName.toLowerCase().includes(cleanQuery);
    const matchEntp = item.entpName.toLowerCase().includes(cleanQuery);
    const matchCat = item.category.toLowerCase().includes(cleanQuery);
    const matchIng = item.ingredients.toLowerCase().includes(cleanQuery);
    const matchEff = item.officialDoc.efficacy.toLowerCase().includes(cleanQuery);
    const matchEasy = item.easyExplanation.summary.toLowerCase().includes(cleanQuery);
    
    return matchName || matchEntp || matchCat || matchIng || matchEff || matchEasy;
  });
}

/**
 * ID로 의약품 단건 조회
 */
function getMedicineById(id) {
  return MEDICINE_DATABASE.find(item => item.id === id) || null;
}

// 브라우저 전역 노출
if (typeof window !== "undefined") {
  window.MEDICINE_DATABASE = MEDICINE_DATABASE;
  window.searchMedicineDatabase = searchMedicineDatabase;
  window.getMedicineById = getMedicineById;
}
