/**
 * AI 의약품 정보 쉬운 설명 서비스 - 딥러닝 생성형 AI 및 RAG 파이프라인 엔진
 * 
 * 기능:
 * 1. Google Gemini API (사전 학습 딥러닝 모델) 실시간 통신
 * 2. RAG (검색증강생성): 식약처 e약은요 공식 DB 검색 후 컨텍스트 주입
 * 3. 의료 안전성 가이드라인 주입 (복용량 변경 금지, 원문 기반 사실성 엄수)
 * 4. API 키 미등록 또는 오류 시 정밀 로컬 RAG Fallback 모드 전환 및 투명한 고지
 */

class AIService {
  constructor() {
    this.storageKey = "easypharm_gemini_api_key";
    this.apiKey = localStorage.getItem(this.storageKey) || "";
    this.modelName = "gemini-3.8-flash"; // 속도와 정확성이 검증된 사전학습 모델
  }

  /**
   * API 키 저장 및 갱신
   */
  setApiKey(key) {
    this.apiKey = (key || "").trim();
    if (this.apiKey) {
      localStorage.setItem(this.storageKey, this.apiKey);
    } else {
      localStorage.removeItem(this.storageKey);
    }
  }

  getApiKey() {
    return this.apiKey;
  }

  hasApiKey() {
    return Boolean(this.apiKey && this.apiKey.length > 10);
  }

  /**
   * 의약품 정보 분석 및 쉬운 설명 생성 (RAG 파이프라인)
   * @param {Object} input - { medicineName, queryText, medicineObj }
   * @returns {Promise<Object>} 구조화된 분석 결과
   */
  async analyzeAndSimplify(input) {
    const { medicineName, queryText, medicineObj } = input;

    // 1단계: RAG 검색 (식약처 공식 데이터베이스 조회)
    let contextMedicine = medicineObj || null;
    if (!contextMedicine && medicineName) {
      const results = searchMedicineDatabase(medicineName);
      if (results.length > 0) {
        contextMedicine = results[0];
      }
    }

    // 2단계: 실제 Gemini API 키가 있는 경우 딥러닝 생성 수행
    if (this.hasApiKey()) {
      try {
        const aiResult = await this.callGeminiAPI(medicineName, queryText, contextMedicine);
        return {
          sourceType: "GEMINI_LIVE_AI",
          isLiveModel: true,
          modelLabel: `Google 딥러닝 모델 (${this.modelName}) 실시간 생성`,
          medicine: contextMedicine,
          ...aiResult
        };
      } catch (err) {
        console.warn("Gemini API 호출 실패, 로컬 RAG 모드로 전환합니다:", err);
        // 오류 발생 시 사용자에게 명확히 알리고 로컬 RAG로 안전하게 Fallback
        const fallback = this.generateLocalRAG(medicineName, queryText, contextMedicine);
        return {
          sourceType: "LOCAL_FALLBACK_ON_ERROR",
          isLiveModel: false,
          modelLabel: "로컬 RAG 지식 기반 엔진 (API 통신 장애로 자동 전환됨)",
          apiError: err.message,
          medicine: contextMedicine,
          ...fallback
        };
      }
    }

    // 3단계: API 키가 없는 경우 - 정밀 로컬 RAG 및 규칙 엔진 활용 (가장하지 않고 명확히 표시)
    const localResult = this.generateLocalRAG(medicineName, queryText, contextMedicine);
    return {
      sourceType: "LOCAL_RAG_FREE",
      isLiveModel: false,
      modelLabel: "로컬 RAG 공식 지식베이스 기반 설명 (Gemini API 키 미등록)",
      medicine: contextMedicine,
      ...localResult
    };
  }

  /**
   * Google Gemini API 실시간 호출
   */
  async callGeminiAPI(medicineName, queryText, contextMedicine) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.modelName}:generateContent?key=${this.apiKey}`;

    // RAG 컨텍스트 준비
    let ragContext = "";
    if (contextMedicine) {
      ragContext = `
[식품의약품안전처 e약은요 공식 정보]
- 의약품명: ${contextMedicine.itemName}
- 주성분: ${contextMedicine.ingredients}
- 효능·효과 원문: ${contextMedicine.officialDoc.efficacy}
- 용법·용량 원문: ${contextMedicine.officialDoc.dosage}
- 사용상 주의사항: ${contextMedicine.officialDoc.precautions}
- 약물 상호작용: ${contextMedicine.officialDoc.interactions}
- 공식 출처: ${contextMedicine.sources.eYak}
`;
    }

    const systemPrompt = `
당신은 대한민국 식품의약품안전처 공식 자료에 기반하여 의약품 정보를 일반인, 어르신이 이해하기 쉬운 우리말로 해설해 주는 전문 AI 메디컬 커뮤니케이터입니다.

[엄격한 의료 안전 및 윤리 원칙 - 반드시 준수]
1. 원문에 없는 효능이나 효과를 임의로 지어내거나 추측하지 마십시오 (환각 엄격 금지).
2. '복용량(용법용량)'과 '복용 시간'은 절대 임의로 줄이거나 늘려서 제안하지 말고 공식 원문의 수치를 있는 그대로 명확히 전달하십시오.
3. 개인의 질병 상태나 체질을 진단하거나 특정 약물 사용을 추천하지 마십시오.
4. "이 설명은 참고용이며, 실제 복용 및 처방은 반드시 의사 또는 약사와 상담하십시오"라는 취지를 분명히 하십시오.
5. 전문 의학 용어(예: 비스테로이드성 소염진통제, 상기도감염, 소양증 등)는 일상적인 쉬운 표현(예: 붓기와 통증을 빼는 약, 코와 목감기, 가려움증 등)으로 쉽게 풀어서 설명하십시오.

[출력 형식]
반드시 다음 JSON 형식으로만 응답하십시오 (마크다운 백틱 없이 순수 JSON):
{
  "summary": "1~2문장의 가장 쉽고 명쾌한 약의 핵심 요약",
  "keyEffects": ["쉬운 효능 설명 1", "쉬운 효능 설명 2", "쉬운 효능 설명 3"],
  "safeDosage": "원문에 기반한 왜곡 없는 쉬운 복용법 안내 (공식 원문 용량 그대로 인용)",
  "warnings": ["핵심 주의사항 1 (예: 술 금지)", "핵심 주의사항 2 (예: 졸음 주의)"],
  "termsExplained": [
    {"term": "원문 전문용어", "meaning": "쉬운 일상어 풀이"}
  ]
}
`;

    const userPrompt = `
[사용자 입력 및 요청]
- 의약품명: ${medicineName || (contextMedicine ? contextMedicine.itemName : "사용자 입력 내용")}
- 원문 또는 증상 질문: ${queryText || (contextMedicine ? contextMedicine.officialDoc.efficacy : "정보 없음")}
${ragContext}

위의 공식 자료와 사용자 입력을 분석하여 지정된 JSON 형식으로 알기 쉽게 변환해 주세요.
`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt + "\n\n" + userPrompt }]
        }
      ],
      generationConfig: {
        temperature: 0.2, // 사실성 유지를 위해 낮은 온도 설정
        topP: 0.8,
        maxOutputTokens: 1200
      }
    };

  const controller = new AbortController();

const timeoutId = setTimeout(() => {
  controller.abort();
}, 30000);

let response;

try {
  response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
    signal: controller.signal
  });
} catch (error) {
  if (error.name === "AbortError") {
    throw new Error("AI 응답 시간 초과: 30초 후 요청을 종료했습니다.");
  }
  throw error;
} finally {
  clearTimeout(timeoutId);
}
    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      throw new Error(`Gemini API 통신 오류 (${response.status}): ${errJson.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // JSON 파싱 (코드 블록이나 앞뒤 공백 제거)
    const cleanedText = candidateText.replace(/```json/gi, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(cleanedText);

    return {
      summary: parsed.summary,
      keyEffects: parsed.keyEffects || [],
      safeDosage: parsed.safeDosage || (contextMedicine ? contextMedicine.officialDoc.dosage : "처방전 및 약사의 지시에 따르십시오."),
      warnings: parsed.warnings || [],
      termsExplained: parsed.termsExplained || []
    };
  }

  /**
   * 로컬 RAG 및 규칙 기반 쉬운 설명 생성 (API 키가 없거나 통신 실패 시)
   * 원문 보존 + 실제 식약처 e약은요 데이터와 전문용어 사전 결합
   */
  generateLocalRAG(medicineName, queryText, contextMedicine) {
    if (contextMedicine) {
      // DB에 일치하는 약품이 있는 경우: 공식 e약은요 정제 데이터 + 텍스트 분석
      const easy = contextMedicine.easyExplanation;
      const official = contextMedicine.officialDoc;

      // 텍스트 내 포함된 전문 용어 자동 발굴
      const combinedText = `${official.efficacy} ${official.dosage} ${official.precautions}`;
      const foundTerms = [];
      Object.keys(MEDICAL_TERMS_DICTIONARY).forEach(term => {
        if (combinedText.includes(term)) {
          foundTerms.push({
            term: term,
            meaning: MEDICAL_TERMS_DICTIONARY[term].simple,
            detail: MEDICAL_TERMS_DICTIONARY[term].detail
          });
        }
      });

      return {
        summary: easy.summary,
        keyEffects: easy.keyPoints,
        safeDosage: `${easy.usageSummary} (공식 허가 원문: ${official.dosage})`,
        warnings: [
          easy.crucialWarning,
          "원문 주의사항: " + simplifySentenceRuleBased(official.precautions.split(".")[0] + ".")
        ],
        termsExplained: foundTerms.slice(0, 8)
      };
    }

    // DB에 없는 자유 텍스트의 경우: 규칙 기반 단순화 및 용어 추출
    const textToProcess = queryText || medicineName || "";
    const simplifiedText = simplifySentenceRuleBased(textToProcess);
    
    const foundTerms = [];
    Object.keys(MEDICAL_TERMS_DICTIONARY).forEach(term => {
      if (textToProcess.includes(term)) {
        foundTerms.push({
          term: term,
          meaning: MEDICAL_TERMS_DICTIONARY[term].simple,
          detail: MEDICAL_TERMS_DICTIONARY[term].detail
        });
      }
    });

    return {
      summary: "입력하신 의약품 설명 문장을 이해하기 쉬운 문장으로 정리했습니다.",
      keyEffects: [
        simplifiedText.length > 50 ? simplifiedText.substring(0, 100) + "..." : simplifiedText
      ],
      safeDosage: "입력된 원문에 명시된 용법·용량을 반드시 지키시고, 절대 임의로 양을 늘리거나 줄이지 마세요.",
      warnings: [
        "🚨 안내: 입력하신 내용에 대한 분석입니다. 확실하지 않은 복용법은 반드시 의사 또는 약사와 상담하십시오."
      ],
      termsExplained: foundTerms
    };
  }
}

// 브라우저 전역 노출
if (typeof window !== "undefined") {
  window.AIService = new AIService();
}
