/**
 * AI 의약품 정보 쉬운 설명 서비스 - 클라이언트 브라우저 OCR 엔진
 * Tesseract.js 기반 한국어(kor) + 영어(eng) 광학 문자 인식
 */

class OCREngine {
  constructor() {
    this.worker = null;
    this.isReady = false;
    this.isLoading = false;
  }

  /**
   * Tesseract Worker 초기화
   */
  async initWorker(onProgress) {
    if (this.worker && this.isReady) return;
    if (this.isLoading) return;

    this.isLoading = true;
    try {
      if (typeof Tesseract === "undefined") {
        throw new Error("Tesseract.js 라이브러리가 로드되지 않았습니다.");
      }

      this.worker = await Tesseract.createWorker("kor+eng", 1, {
        logger: (m) => {
          if (onProgress && typeof onProgress === "function") {
            onProgress(m);
          }
        }
      });
      this.isReady = true;
    } catch (err) {
      console.error("OCR Worker 초기화 실패:", err);
      throw err;
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * 이미지 전처리 (흑백화 및 대비 강화로 한국어 텍스트 인식률 향상)
   */
  preprocessImage(imageElement) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = imageElement.naturalWidth || imageElement.width;
    canvas.height = imageElement.naturalHeight || imageElement.height;

    ctx.drawImage(imageElement, 0, 0);
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    // 그레이스케일 및 대비(Contrast) 증폭
    for (let i = 0; i < data.length; i += 4) {
      const avg = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      // 임계값 처리 (Adaptive Binarization 느낌)
      const contrast = avg > 140 ? 255 : (avg < 90 ? 0 : avg);
      data[i] = contrast;
      data[i + 1] = contrast;
      data[i + 2] = contrast;
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL("image/png");
  }

  /**
   * 이미지 파일 또는 Base64 문자열로부터 텍스트 추출
   */
  async recognize(imageSource, onProgress) {
    try {
      await this.initWorker(onProgress);
      const ret = await this.worker.recognize(imageSource);
      const text = ret.data.text || "";
      
      return {
        rawText: text,
        confidence: ret.data.confidence,
        lines: ret.data.lines ? ret.data.lines.map(l => l.text.trim()).filter(Boolean) : [],
        parsedMedicines: this.extractMedicineCandidates(text)
      };
    } catch (err) {
      console.error("OCR 텍스트 인식 실패:", err);
      throw err;
    }
  }

  /**
   * 추출된 텍스트에서 알려진 의약품명 후보 탐색
   */
  extractMedicineCandidates(text) {
    if (!text) return [];
    const candidates = [];
    
    // DB에 있는 모든 의약품명과 대표 키워드
    if (typeof MEDICINE_DATABASE !== "undefined") {
      MEDICINE_DATABASE.forEach(med => {
        // 타이레놀, 이지엔, 탁센, 게보린, 판피린, 겔포스 등 주요 키워드 매칭
        const coreName = med.itemName.split("(")[0].replace(/[0-9]|정|캡슐|밀리그람|액|연고/g, "").trim();
        if (coreName.length >= 2 && text.includes(coreName)) {
          candidates.push(med);
        } else if (text.includes(med.itemName)) {
          candidates.push(med);
        }
      });
    }

    return Array.from(new Set(candidates));
  }

  /**
   * 자원 해제
   */
  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.isReady = false;
    }
  }
}

// 브라우저 전역 노출
if (typeof window !== "undefined") {
  window.OCREngine = new OCREngine();
}
