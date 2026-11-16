
/**
 * AI 의약품 정보 쉬운 설명 서비스 - 메인 애플리케이션 컨트롤러
 * 
 * GitHub Pages 완벽 호환 클라이언트 사이드 단일 페이지 웹앱 (SPA)
 */

// 전역 상태
const AppState = {
  currentTab: "home",
  selectedMedicine: null,
  analysisResult: null,
  ocrRawText: "",
  isSpeaking: false,
  speechUtterance: null
};

// DOM 로드 완료 후 초기화
document.addEventListener("DOMContentLoaded", () => {
  // 아이콘 렌더링
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // 초기 탭 설정 (URL 해시 확인)
  const initialHash = window.location.hash.replace("#", "") || "home";
  navigateTo(initialHash);

  // 다빈도 의약품 그리드 렌더링
  renderQuickMedicines();

  // API 연동 상태 배지 초기화
  updateApiStatusBadge();

  // 전문 용어 클릭 이벤트 위임
  setupMedicalTermClickDelegation();

  // 드래그 앤 드롭 이벤트 설정
  setupDragAndDrop();

  // 기본적으로 첫 번째 의약품(타이레놀)으로 초기 분석 결과 로드
  if (typeof MEDICINE_DATABASE !== "undefined" && MEDICINE_DATABASE.length > 0) {
    selectMedicine(MEDICINE_DATABASE[0], false);
  }
});

/**
 * ============================================================
 * 1. 내비게이션 및 뷰 라우팅
 * ============================================================
 */
function navigateTo(tabId) {
  const validTabs = ["home", "search", "ocr", "result", "compare", "sources"];
  const targetTab = validTabs.includes(tabId) ? tabId : "home";
  AppState.currentTab = targetTab;

  document.querySelectorAll(".view-panel").forEach(panel => {
    panel.classList.add("hidden");
  });

  const activePanel = document.getElementById(`view-${targetTab}`);
  if (activePanel) {
    activePanel.classList.remove("hidden");
  }

  document.querySelectorAll(".nav-tab").forEach(tab => {
    if (tab.dataset.target === targetTab) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  window.location.hash = targetTab;
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

/**
 * ============================================================
 * 2. 접근성 기능 (글자 크기, 고대비, 음성 TTS)
 * ============================================================
 */
function changeFontSize(size) {
  const root = document.documentElement;
  const btnSm = document.getElementById("btn-font-sm");
  const btnMd = document.getElementById("btn-font-md");
  const btnLg = document.getElementById("btn-font-lg");

  root.classList.remove("font-large", "font-xlarge");
  [btnSm, btnMd, btnLg].forEach(b => {
    b.className = "px-2 py-1 rounded hover:bg-white transition text-xs";
  });

  if (size === "small") {
    btnSm.className = "px-2 py-1 rounded bg-white shadow-sm font-bold text-sky-700 text-xs";
  } else if (size === "large") {
    root.classList.add("font-xlarge");
    btnLg.className = "px-2 py-1 rounded bg-white shadow-sm font-bold text-sky-700 text-xs";
  } else {
    btnMd.className = "px-2 py-1 rounded bg-white shadow-sm font-bold text-sky-700 text-xs";
  }
}

function toggleHighContrast() {
  const root = document.documentElement;
  root.classList.toggle("high-contrast");
  const isHigh = root.classList.contains("high-contrast");
  const btn = document.getElementById("btn-high-contrast");
  if (isHigh) {
    btn.classList.add("bg-amber-400", "text-black", "font-black");
  } else {
    btn.classList.remove("bg-amber-400", "text-black", "font-black");
  }
}

/**
 * 음성 읽어주기 (TTS) 토글
 */
function toggleTTS() {
  if (!("speechSynthesis" in window)) {
    alert("현재 브라우저는 음성 합성(TTS) 기능을 지원하지 않습니다.");
    return;
  }

  const synth = window.speechSynthesis;
  const btn = document.getElementById("btn-tts");
  const label = document.getElementById("tts-label");

  if (AppState.isSpeaking) {
    synth.cancel();
    AppState.isSpeaking = false;
    label.innerText = "소리내어 읽기";
    btn.classList.remove("speaking-active");
    return;
  }

  let textToSpeak = "";
  if (AppState.analysisResult) {
    const medTitle = AppState.selectedMedicine ? AppState.selectedMedicine.itemName : "의약품 쉬운 설명";
    textToSpeak = `${medTitle}에 대한 설명입니다. ${AppState.analysisResult.summary}. 주요 효과로는 ${AppState.analysisResult.keyEffects.join(", ")} 등이 있습니다. 주의사항입니다. ${AppState.analysisResult.warnings.join(". ")}`;
  } else {
    textToSpeak = "분석된 의약품 정보가 없습니다. 의약품을 먼저 선택해 주세요.";
  }

  const utterance = new SpeechSynthesisUtterance(textToSpeak);
  utterance.lang = "ko-KR";
  utterance.rate = 0.9;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    AppState.isSpeaking = true;
    label.innerText = "낭독 일시중지";
    btn.classList.add("speaking-active");
  };

  utterance.onend = () => {
    AppState.isSpeaking = false;
    label.innerText = "소리내어 읽기";
    btn.classList.remove("speaking-active");
  };

  utterance.onerror = () => {
    AppState.isSpeaking = false;
    label.innerText = "소리내어 읽기";
    btn.classList.remove("speaking-active");
  };

  AppState.speechUtterance = utterance;
  synth.speak(utterance);
}

/**
 * ============================================================
 * 3. 다빈도 의약품 퀵 검색 및 렌더링
 * ============================================================
 */
function renderQuickMedicines() {
  const container = document.getElementById("quick-medicines-grid");
  if (!container || typeof MEDICINE_DATABASE === "undefined") return;

  container.innerHTML = MEDICINE_DATABASE.map(med => {
    const shortName = med.itemName.split("(")[0];
    const subName = med.itemName.includes("(") ? med.itemName.substring(med.itemName.indexOf("(")) : "";
    return `
      <div onclick="handleQuickSelect('${med.id}')" 
        class="card-soft p-3.5 cursor-pointer hover:border-sky-400 group transition flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-1">
            <span class="text-[11px] font-bold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700">${med.category.split("·")[0]}</span>
            <span class="text-[10px] text-slate-400">${med.entpName}</span>
          </div>
          <h4 class="font-bold text-sm text-slate-800 group-hover:text-sky-700 transition line-clamp-1">${shortName}</h4>
          <p class="text-[11px] text-slate-500 line-clamp-1">${subName}</p>
        </div>
        <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-sky-600 font-semibold">
          <span>쉬운 설명 보기</span>
          <i data-lucide="arrow-right" class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition"></i>
        </div>
      </div>
    `;
  }).join("");

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

function handleQuickSelect(medId) {
  const med = getMedicineById(medId);
  if (med) {
    selectMedicine(med, true);
  }
}

/**
 * ============================================================
 * 4. 의약품 검색 및 텍스트 직접 입력 처리
 * ============================================================
 */
function switchSearchTab(type) {
  const tabName = document.getElementById("btn-tab-search-name");
  const tabText = document.getElementById("btn-tab-search-text");
  const secName = document.getElementById("section-search-name");
  const secText = document.getElementById("section-search-text");

  if (type === "name") {
    tabName.className = "flex-1 py-3 text-center font-bold border-b-2 border-sky-600 text-sky-700";
    tabText.className = "flex-1 py-3 text-center font-medium text-slate-500 hover:text-slate-800";
    secName.classList.remove("hidden");
    secText.classList.add("hidden");
  } else {
    tabText.className = "flex-1 py-3 text-center font-bold border-b-2 border-teal-600 text-teal-700";
    tabName.className = "flex-1 py-3 text-center font-medium text-slate-500 hover:text-slate-800";
    secText.classList.remove("hidden");
    secName.classList.add("hidden");
  }
}

function handleNameSearchInput(value) {
  const list = document.getElementById("autocomplete-list");
  if (!value || value.trim().length === 0) {
    list.classList.add("hidden");
    list.innerHTML = "";
    return;
  }

  const results = searchMedicineDatabase(value);
  if (results.length === 0) {
    list.classList.remove("hidden");
    list.innerHTML = `
      <div class="p-3 text-xs text-slate-500 text-center">
        일치하는 의약품이 없습니다. 아래 <strong>'설명서 문장 직접 입력'</strong> 탭에서 문장을 분석해 보세요.
      </div>
    `;
    return;
  }

  list.classList.remove("hidden");
  list.innerHTML = results.slice(0, 5).map(item => `
    <div onclick="selectMedicineFromSearch('${item.id}')" class="p-3 hover:bg-sky-50 cursor-pointer transition flex items-center justify-between">
      <div>
        <div class="font-bold text-sm text-slate-800">${item.itemName}</div>
        <div class="text-xs text-slate-500">${item.entpName} | ${item.category}</div>
      </div>
      <span class="text-xs text-sky-600 font-semibold">선택</span>
    </div>
  `).join("");
}

function selectMedicineFromSearch(medId) {
  const med = getMedicineById(medId);
  if (med) {
    document.getElementById("autocomplete-list").classList.add("hidden");
    selectMedicine(med, true);
  }
}

function selectQuickSearch(term) {
  const input = document.getElementById("input-medicine-name");
  input.value = term;
  handleNameSearchInput(term);
  executeSearch();
}

function executeSearch() {
  const input = document.getElementById("input-medicine-name");
  const query = (input.value || "").trim();
  if (!query) {
    alert("검색할 의약품 이름을 입력해 주세요.");
    return;
  }

  const results = searchMedicineDatabase(query);
  if (results.length > 0) {
    document.getElementById("autocomplete-list").classList.add("hidden");
    selectMedicine(results[0], true);
  } else {
    if (confirm(`'${query}'에 대한 사전 정보가 식약처 기본 데이터셋에 없습니다.\n이 키워드로 AI 분석을 수행할까요?`)) {
      analyzeCustomQuery(query);
    }
  }
}

function fillSampleSentence() {
  const sample = "류마티양 관절염, 골관절염, 강직성 척추염 등의 소염 및 진통에 경구 투여한다. 소화성궤양 환자는 금기이며, 간장애 및 신장애 환자는 신중히 투여할 것. 다른 비스테로이드성 소염진통제(NSAIDs)와 병용을 피한다.";
  document.getElementById("input-custom-text").value = sample;
}

async function executeCustomTextAnalysis() {
  const text = (document.getElementById("input-custom-text").value || "").trim();
  if (!text) {
    alert("분석할 설명서 문장을 입력해 주세요.");
    return;
  }

  await analyzeCustomQuery(text);
}

async function analyzeCustomQuery(text) {
  navigateTo("result");
  showLoadingResult("입력하신 문맥과 전문 용어를 분석 중입니다...");

  try {
    const result = await window.AIService.analyzeAndSimplify({
      medicineName: text.substring(0, 20),
      queryText: text,
      medicineObj: null
    });

    AppState.selectedMedicine = null;
    AppState.analysisResult = result;
    renderResult(result, null);
    renderCompareView(result, null, text);
  } catch (err) {
    alert("분석 중 오류가 발생했습니다: " + err.message);
  }
}

/**
 * ============================================================
 * 5. 선택된 의약품에 대한 AI 분석 및 렌더링
 * ============================================================
 */
async function selectMedicine(med, shouldNavigate = true) {
  AppState.selectedMedicine = med;
  if (shouldNavigate) {
    navigateTo("result");
    showLoadingResult(`'${med.itemName}'의 공식 자료를 조회하고 쉬운 설명을 생성하는 중입니다...`);
  }

  try {
    const result = await window.AIService.analyzeAndSimplify({
      medicineName: med.itemName,
      queryText: `${med.officialDoc.efficacy} ${med.officialDoc.dosage}`,
      medicineObj: med
    });

    AppState.analysisResult = result;
    renderResult(result, med);
    renderCompareView(result, med);
  } catch (err) {
    console.error("의약품 분석 실패:", err);
  }
}

function showLoadingResult(message) {
  document.getElementById("result-medicine-title").innerText = "AI 분석 진행 중...";
  document.getElementById("result-summary").innerHTML = `
    <div class="flex items-center gap-3 text-sky-700 py-4 text-base">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600"></div>
      <span>${message}</span>
    </div>
  `;
  document.getElementById("result-key-effects").innerHTML = "<li class='text-slate-400'>자료를 불러오는 중...</li>";
  document.getElementById("result-warnings").innerHTML = "<div class='text-slate-400'>주의사항 추출 중...</div>";
  document.getElementById("result-terms-grid").innerHTML = "";
}

function renderResult(result, med) {
  const badge = document.getElementById("result-model-badge");
  badge.innerText = result.modelLabel || "AI 쉬운 설명";
  if (result.isLiveModel) {
    badge.className = "px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300";
  } else {
    badge.className = "px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200";
  }

  document.getElementById("result-medicine-title").innerText = med ? med.itemName : (result.summary ? "의약품 쉬운 설명" : "분석 완료");
  document.getElementById("result-item-category").innerText = med ? `${med.entpName} | ${med.category} (${med.type})` : "사용자 입력 텍스트 분석";
  document.getElementById("result-summary").innerText = result.summary;

  const effectsContainer = document.getElementById("result-key-effects");
  effectsContainer.innerHTML = (result.keyEffects || []).map(eff => `
    <li class="flex items-start gap-2.5">
      <i data-lucide="check" class="w-4 h-4 text-teal-600 shrink-0 mt-1"></i>
      <span>${eff}</span>
    </li>
  `).join("");

  document.getElementById("result-dosage-text").innerText = result.safeDosage;

  const warningsContainer = document.getElementById("result-warnings");
  warningsContainer.innerHTML = (result.warnings || []).map(w => `
    <div class="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-950 font-medium text-xs sm:text-sm flex items-start gap-2">
      <i data-lucide="alert-circle" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5"></i>
      <span>${w}</span>
    </div>
  `).join("");

  const termsContainer = document.getElementById("result-terms-grid");
  if (result.termsExplained && result.termsExplained.length > 0) {
    termsContainer.innerHTML = result.termsExplained.map(t => `
      <button onclick="showTermDetail('${t.term}', '${t.meaning}', '${t.detail || ''}')" 
        class="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5 transition">
        <i data-lucide="info" class="w-3.5 h-3.5 text-indigo-600"></i>
        <span><strong>${t.term}</strong>: ${t.meaning}</span>
      </button>
    `).join("");
  } else {
    termsContainer.innerHTML = "<p class='text-xs text-slate-500'>발견된 특수 전문 용어가 없습니다.</p>";
  }

  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }
}

/**
 * ============================================================
 * 6. 원문 vs 쉬운 설명 비교 뷰 렌더링
 * ============================================================
 */
function renderCompareView(result, med, rawUserText = "") {
  const effOfficial = document.getElementById("compare-official-efficacy");
  const dosOfficial = document.getElementById("compare-official-dosage");
  const preOfficial = document.getElementById("compare-official-precautions");

  const effEasy = document.getElementById("compare-easy-efficacy");
  const dosEasy = document.getElementById("compare-easy-dosage");
  const preEasy = document.getElementById("compare-easy-precautions");

  if (med) {
    effOfficial.innerHTML = highlightMedicalTerms(med.officialDoc.efficacy);
    dosOfficial.innerHTML = highlightMedicalTerms(med.officialDoc.dosage);
    preOfficial.innerHTML = highlightMedicalTerms(med.officialDoc.precautions);

    effEasy.innerHTML = `
      <p class="font-bold text-sky-900 mb-2">${result.summary}</p>
      <ul class="space-y-1 list-disc list-inside text-xs sm:text-sm text-slate-700">
        ${(result.keyEffects || []).map(e => `<li>${e}</li>`).join("")}
      </ul>
    `;
    dosEasy.innerHTML = `<p class="text-xs sm:text-sm text-slate-800">${result.safeDosage}</p>`;
    preEasy.innerHTML = `
      <div class="space-y-1.5 text-xs sm:text-sm">
        ${(result.warnings || []).map(w => `<div class="font-medium text-amber-900">${w}</div>`).join("")}
      </div>
    `;
  } else {
    effOfficial.innerHTML = highlightMedicalTerms(rawUserText || "입력된 원문");
    dosOfficial.innerHTML = "원문 미제공 (사용자 자유 입력)";
    preOfficial.innerHTML = "원문 미제공 (사용자 자유 입력)";

    effEasy.innerHTML = `
      <p class="font-bold text-sky-900 mb-2">${result.summary}</p>
      <ul class="space-y-1 list-disc list-inside text-xs sm:text-sm text-slate-700">
        ${(result.keyEffects || []).map(e => `<li>${e}</li>`).join("")}
      </ul>
    `;
    dosEasy.innerHTML = `<p class="text-xs sm:text-sm text-slate-800">${result.safeDosage}</p>`;
    preEasy.innerHTML = `
      <div class="space-y-1.5 text-xs sm:text-sm">
        ${(result.warnings || []).map(w => `<div class="font-medium text-amber-900">${w}</div>`).join("")}
      </div>
    `;
  }
}

/**
 * ============================================================
 * 7. 브라우저 OCR 엔진 제어 및 가상 샘플
 * ============================================================
 */
function setupDragAndDrop() {
  const dropzone = document.getElementById("ocr-dropzone");
  if (!dropzone) return;

  ["dragenter", "dragover"].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    });
  });

  ["dragleave", "drop"].forEach(eventName => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    });
  });

  dropzone.addEventListener("drop", (e) => {
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImageFile(files[0]);
    }
  });
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) {
    processImageFile(file);
  }
}

function processImageFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    runOCR(e.target.result);
  };
  reader.readAsDataURL(file);
}

/**
 * 처방전 가상 샘플 로드
 */
function loadSampleImage(type) {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 340;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 2;
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

  ctx.fillStyle = "#0284c7";
  ctx.fillRect(10, 10, canvas.width - 20, 45);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 18px sans-serif";
  ctx.fillText("처 방 전 (환자 보관용)", 210, 38);

  ctx.fillStyle = "#1e293b";
  ctx.font = "14px sans-serif";
  ctx.fillText("발행일자: 2026년 11월 16일", 30, 80);
  ctx.fillText("교부번호: 2026-MED-0982", 360, 80);

  ctx.strokeStyle = "#e2e8f0";
  ctx.beginPath();
  ctx.moveTo(30, 95);
  ctx.lineTo(570, 95);
  ctx.stroke();

  if (type === "tylenol") {
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.fillText("[처방 의약품 명칭]", 30, 130);
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#0284c7";
    ctx.fillText("1. 타이레놀정 500mg (아세트아미노펜)", 30, 165);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("   용법: 1회 1정, 1일 3회 식후 30분 복용 (발열 및 두통 시)", 30, 195);
    ctx.fillText("   주의사항: 음주 금지, 1일 최대 4000mg 초과 금지", 30, 225);
  } else if (type === "ezn6") {
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.fillText("[처방 의약품 명칭]", 30, 130);
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#0d9488";
    ctx.fillText("1. 이지엔6애니연질캡슐 (이부프로펜 200mg)", 30, 165);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("   용법: 1회 1캡슐, 1일 3회 식사 직후 복용 (소염진통)", 30, 195);
    ctx.fillText("   주의사항: 위장장애 유발 가능, 공복 복용 금지", 30, 225);
  } else {
    ctx.font = "bold 16px sans-serif";
    ctx.fillStyle = "#0f172a";
    ctx.fillText("[처방 의약품 명칭]", 30, 130);
    ctx.font = "bold 18px sans-serif";
    ctx.fillStyle = "#2563eb";
    ctx.fillText("1. 탁센연질캡슐 (나프록센 250mg)", 30, 165);
    ctx.font = "14px sans-serif";
    ctx.fillStyle = "#334155";
    ctx.fillText("   용법: 1회 1캡슐, 1일 2회 (12시간 간격) 식후 복용", 30, 195);
    ctx.fillText("   주의사항: 위궤양 환자 주의, 지속 복용 시 상담 요망", 30, 225);
  }

  const dataUrl = canvas.toDataURL("image/png");
  runOCR(dataUrl);
}

async function runOCR(imageSource) {
  const previewBox = document.getElementById("ocr-preview-container");
  const previewImg = document.getElementById("ocr-preview-img");
  const progressBox = document.getElementById("ocr-progress-box");
  const progressBar = document.getElementById("ocr-progress-bar");
  const statusText = document.getElementById("ocr-status-text");
  const percentText = document.getElementById("ocr-percent");
  const resultBox = document.getElementById("ocr-result-box");
  const textOutput = document.getElementById("ocr-extracted-text");
  const matchedBox = document.getElementById("ocr-matched-medicines");

  previewBox.classList.remove("hidden");
  previewImg.src = imageSource;
  progressBox.classList.remove("hidden");
  resultBox.classList.add("hidden");
  progressBar.style.width = "5%";
  statusText.innerText = "Tesseract 딥러닝 한국어 모델을 초기화하는 중...";
  percentText.innerText = "5%";

  try {
    const ocrResult = await OCREngine.recognize(imageSource, (m) => {
      if (m.status === "recognizing text") {
        const pct = Math.round((m.progress || 0) * 100);
        progressBar.style.width = `${pct}%`;
        percentText.innerText = `${pct}%`;
        statusText.innerText = `문서 내 글자를 읽는 중... (${pct}%)`;
      } else {
        statusText.innerText = m.status || "인식 진행 중...";
      }
    });

    progressBar.style.width = "100%";
    percentText.innerText = "100%";
    statusText.innerText = "글자 인식이 성공적으로 완료되었습니다!";

    resultBox.classList.remove("hidden");
    textOutput.value = ocrResult.rawText;
    AppState.ocrRawText = ocrResult.rawText;

    if (ocrResult.parsedMedicines.length > 0) {
      const matched = ocrResult.parsedMedicines[0];
      AppState.selectedMedicine = matched;
      matchedBox.innerHTML = `
        <div class="font-bold flex items-center gap-1.5">
          <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i>
          추출된 텍스트에서 알려진 의약품을 찾았습니다:
        </div>
        <p class="font-extrabold text-sm text-emerald-800">${matched.itemName} (${matched.entpName})</p>
      `;
    } else {
      matchedBox.innerHTML = `
        <p>인식된 텍스트에서 표준 등록 의약품명을 자동으로 특정하지 못했습니다. 아래 버튼을 눌러 AI가 텍스트 전체를 직접 분석하도록 요청하세요.</p>
      `;
    }

    if (typeof lucide !== "undefined") {
      lucide.createIcons();
    }
  } catch (err) {
    statusText.innerText = "OCR 인식 중 오류 발생: " + err.message;
    alert("이미지에서 글자를 읽는 중 오류가 발생했습니다. 선명한 사진을 올려주세요.");
  }
}

function resetOcr() {
  document.getElementById("ocr-preview-container").classList.add("hidden");
  document.getElementById("file-input").value = "";
  AppState.ocrRawText = "";
}

function analyzeFromOcr() {
  const text = document.getElementById("ocr-extracted-text").value || AppState.ocrRawText;
  if (!text.trim()) {
    alert("인식된 텍스트가 없습니다.");
    return;
  }

  if (AppState.selectedMedicine) {
    selectMedicine(AppState.selectedMedicine, true);
  } else {
    analyzeCustomQuery(text);
  }
}

/**
 * ============================================================
 * 8. 전문 용어 모달 및 인터랙션
 * ============================================================
 */
function setupMedicalTermClickDelegation() {
  document.addEventListener("click", (e) => {
    const termSpan = e.target.closest(".medical-term");
    if (termSpan) {
      const term = termSpan.dataset.term;
      const simple = termSpan.dataset.simple;
      const desc = termSpan.dataset.desc;
      const cat = termSpan.dataset.category || "의약 전문용어";
      showTermDetail(term, simple, desc, cat);
    }
  });
}

function showTermDetail(term, simple, desc, category = "의약 전문용어") {
  document.getElementById("modal-term-name").innerText = term;
  document.getElementById("modal-term-simple").innerText = `쉬운 의미: ${simple}`;
  document.getElementById("modal-term-desc").innerText = desc || MEDICAL_TERMS_DICTIONARY[term]?.detail || "식품의약품안전처 및 국립국어원 의학용어 순화 기준 자료입니다.";
  document.getElementById("modal-term-category").innerText = category;
  document.getElementById("term-modal").classList.remove("hidden");
}

function closeTermModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.closest("button")) return;
  document.getElementById("term-modal").classList.add("hidden");
}

/**
 * ============================================================
 * 9. Gemini API 키 모달 설정
 * ============================================================
 */
function openApiModal() {
  const modal = document.getElementById("api-modal");
  const input = document.getElementById("input-api-key");
  input.value = window.AIService.getApiKey();
  modal.classList.remove("hidden");
}

function closeApiModal(e) {
  if (e && e.target !== e.currentTarget && !e.target.closest("button")) return;
  document.getElementById("api-modal").classList.add("hidden");
}

function saveApiKey() {
  const input = document.getElementById("input-api-key");
  const key = input.value.trim();
  window.AIService.setApiKey(key);
  updateApiStatusBadge();
  closeApiModal();
  alert(key ? "Gemini API 키가 저장되었습니다. 앞으로 실시간 AI 생성이 우선 작동합니다." : "API 키가 삭제되었습니다. 무료 로컬 RAG 모드로 전환됩니다.");
}

function clearApiKey() {
  window.AIService.setApiKey("");
  document.getElementById("input-api-key").value = "";
  updateApiStatusBadge();
  closeApiModal();
  alert("API 키가 삭제되었습니다. 무료 로컬 RAG 모드로 전환됩니다.");
}

function updateApiStatusBadge() {
  const badge = document.getElementById("api-status-badge");
  if (!badge) return;
  if (window.AIService.hasApiKey()) {
    badge.innerText = "Gemini AI 연동됨";
    badge.parentElement.className = "px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-700 text-xs font-semibold flex items-center gap-1.5 transition";
  } else {
    badge.innerText = "무료 로컬 RAG 모드";
    badge.parentElement.className = "px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 border border-sky-300 text-sky-700 text-xs font-semibold flex items-center gap-1.5 transition";
  }
}
