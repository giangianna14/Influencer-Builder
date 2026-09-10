// Anti-Slop Writing Engine v3.0 (Bahasa Indonesia & English)
// Based on Wikipedia "Signs of AI Writing", 2026 Detection Research, and anti-slop-writing guidelines

export interface AntiSlopAuditResult {
  score: number; // 0 to 100 (100 = 100% human-like / zero AI slop)
  passed: boolean;
  dashCount: number; // must be 0
  colonCount: number;
  bannedWordsFound: string[];
  parallelismsFound: string[];
  cadenceUniformityDetected: boolean;
  averageSentenceWords: number;
  burstinessGrade: "Tinggi (Manusiawi)" | "Sedang" | "Kaku (Pola AI)";
  recommendations: string[];
}

// Banned vocabulary list based on anti-slop-writing v3.0
export const BANNED_WORDS_ID = [
  // Penggelembung kepentingan
  "sangat krusial",
  "sangat penting",
  "sangat signifikan",
  "sangat relevan",
  "fundamental",
  "luar biasa",

  // Kata kerja analitis berlebihan & kalke
  "menyelami",
  "menyoroti",
  "menggarisbawahi",
  "memfasilitasi",
  "mengoptimalkan",
  "mengedepankan",
  "mewujudkan",
  "merealisasikan",
  "berperan penting",
  "berperan krusial",
  "berperan dalam membentuk",

  // Padding & AI tell era 2026
  "memastikan bahwa",
  "memastikan",
  "tapestry",
  "permadani",
  "ekosistem",
  "paradigma",
  "transformasi digital",
  "sinergi",
  "lanskap",
  "holistik",
  "komprehensif",

  // Pembuka klise AI
  "di era modern ini",
  "seiring perkembangan zaman",
  "dalam konteks ini",
  "perlu diketahui bahwa",
  "penting untuk diingat",
  "sebagai kesimpulan",
  "dapat disimpulkan bahwa",
  "pada akhirnya,",
  "tidak dapat dipungkiri",
];

export const FORMULAIC_PARALLELISMS = [
  "tidak hanya",
  "bukan hanya",
  "tantangan dan peluang",
  "kelebihan dan kekurangan",
  "di satu sisi",
];

// Audit text against Anti-Slop rules
export function auditAntiSlop(text: string): AntiSlopAuditResult {
  if (!text || text.trim().length === 0) {
    return {
      score: 100,
      passed: true,
      dashCount: 0,
      colonCount: 0,
      bannedWordsFound: [],
      parallelismsFound: [],
      cadenceUniformityDetected: false,
      averageSentenceWords: 0,
      burstinessGrade: "Tinggi (Manusiawi)",
      recommendations: [],
    };
  }

  const lowerText = text.toLowerCase();
  const recommendations: string[] = [];

  // 1. Dash policy: Em Dash (—) and En Dash (–) are strictly forbidden
  const emDashMatches = text.match(/—/g) || [];
  const enDashMatches = text.match(/–/g) || [];
  const dashCount = emDashMatches.length + enDashMatches.length;
  if (dashCount > 0) {
    recommendations.push(
      `Ditemukan ${dashCount} em-dash/en-dash. Sesuai aturan Anti-Slop, dash dilarang total; ganti dengan titik atau koma.`
    );
  }

  // Count colons (Claude / AI tell when overused)
  const colonMatches = text.match(/:/g) || [];
  const colonCount = colonMatches.length;
  if (colonCount > 3 && text.length < 300) {
    recommendations.push(
      "Kepadatan titik dua (colon) terlalu tinggi. Pecah menjadi kalimat terpisah."
    );
  }

  // 2. Banned vocabulary search
  const bannedWordsFound: string[] = [];
  for (const phrase of BANNED_WORDS_ID) {
    if (lowerText.includes(phrase)) {
      bannedWordsFound.push(phrase);
    }
  }
  if (bannedWordsFound.length > 0) {
    recommendations.push(
      `Hapus kosakata klise AI: "${bannedWordsFound.slice(0, 3).join('", "')}". Nyatakan fakta atau tindakan secara langsung.`
    );
  }

  // 3. Formulaic Parallelisms ("tidak hanya... tetapi juga")
  const parallelismsFound: string[] = [];
  for (const pattern of FORMULAIC_PARALLELISMS) {
    if (lowerText.includes(pattern)) {
      parallelismsFound.push(pattern);
    }
  }
  if (parallelismsFound.length > 0) {
    recommendations.push(
      `Hindari kontras retoris "${parallelismsFound.join('", "')}". Nyatakan apa adanya secara langsung.`
    );
  }

  // 4. Burstiness & Cadence uniformity check
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const wordCounts = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);
  const totalWords = wordCounts.reduce((acc, c) => acc + c, 0);
  const avgWords = sentences.length > 0 ? Math.round(totalWords / sentences.length) : 0;

  // Check 30-second cadence test: 3 or more consecutive sentences in 17-23 words range
  let consecutiveMidLength = 0;
  let cadenceUniformityDetected = false;
  for (const count of wordCounts) {
    if (count >= 16 && count <= 24) {
      consecutiveMidLength++;
      if (consecutiveMidLength >= 3) {
        cadenceUniformityDetected = true;
        break;
      }
    } else {
      consecutiveMidLength = 0;
    }
  }

  let burstinessGrade: "Tinggi (Manusiawi)" | "Sedang" | "Kaku (Pola AI)" = "Tinggi (Manusiawi)";
  if (cadenceUniformityDetected) {
    burstinessGrade = "Kaku (Pola AI)";
    recommendations.push(
      "Ditemukan keseragaman ritme (cadence uniformity: 3+ kalimat berturut-turut dengan panjang mirip 17-23 kata). Campurkan kalimat pendek 3-5 kata dengan kalimat panjang."
    );
  } else if (sentences.length > 2) {
    const minWords = Math.min(...wordCounts);
    const maxWords = Math.max(...wordCounts);
    if (maxWords - minWords < 6) {
      burstinessGrade = "Sedang";
      recommendations.push("Tingkatkan variasi panjang kalimat untuk membuat alur lebih alami.");
    }
  }

  // Calculate score (100 is cleanest)
  let penalty = 0;
  penalty += dashCount * 25; // heavy penalty for dash
  penalty += bannedWordsFound.length * 15;
  penalty += parallelismsFound.length * 15;
  if (cadenceUniformityDetected) penalty += 20;

  const score = Math.max(10, Math.min(100, 100 - penalty));
  const passed = score >= 85 && dashCount === 0 && bannedWordsFound.length === 0;

  return {
    score,
    passed,
    dashCount,
    colonCount,
    bannedWordsFound,
    parallelismsFound,
    cadenceUniformityDetected,
    averageSentenceWords: avgWords,
    burstinessGrade,
    recommendations,
  };
}

// Sanitize & Polish text to strictly conform to Anti-Slop rules
export function sanitizeAntiSlop(
  text: string,
  tier: "tier1" | "tier2" | "tier3" = "tier2"
): string {
  if (!text) return "";

  let cleaned = text;

  // 1. DILARANG TOTAL: Em-dash & En-dash -> Ganti dengan koma atau titik
  cleaned = cleaned.replace(/\s*—\s*/g, ", ");
  cleaned = cleaned.replace(/\s*–\s*/g, ", ");

  // 2. Bersihkan pembuka klise AI
  cleaned = cleaned.replace(/Di era modern ini,?\s*/gi, "");
  cleaned = cleaned.replace(/Seiring perkembangan zaman,?\s*/gi, "");
  cleaned = cleaned.replace(/Perlu diketahui bahwa\s*/gi, "");
  cleaned = cleaned.replace(/Penting untuk diingat bahwa\s*/gi, "Ingat: ");
  cleaned = cleaned.replace(/Sebagai kesimpulan,?\s*/gi, "Kesimpulannya, ");
  cleaned = cleaned.replace(/Dengan demikian, dapat disimpulkan bahwa\s*/gi, "Jadi, ");
  cleaned = cleaned.replace(/Dapat disimpulkan bahwa\s*/gi, "Intinya, ");
  cleaned = cleaned.replace(/Tidak dapat dipungkiri bahwa\s*/gi, "Jelas bahwa ");

  // 3. Matikan parallelisme formulaik
  cleaned = cleaned.replace(/tidak hanya (.*?),? tetapi juga/gi, "$1, serta");
  cleaned = cleaned.replace(/bukan hanya (.*?),? melainkan juga/gi, "$1, ditambah");
  cleaned = cleaned.replace(/bukan hanya (.*?),? tapi juga/gi, "$1, dan");
  cleaned = cleaned.replace(/tantangan dan peluang/gi, "masalah serta potensi");

  // 4. Hilangkan kata penggelembung & klise AI
  cleaned = cleaned.replace(/sangat krusial/gi, "penting");
  cleaned = cleaned.replace(/sangat signifikan/gi, "berarti");
  cleaned = cleaned.replace(/menyelami/gi, "mempelajari");
  cleaned = cleaned.replace(/memfasilitasi/gi, "membantu");
  cleaned = cleaned.replace(/mengoptimalkan/gi, "memaksimalkan");
  cleaned = cleaned.replace(/berperan penting dalam/gi, "membantu");
  cleaned = cleaned.replace(/berperan krusial dalam/gi, "mendukung");
  cleaned = cleaned.replace(/memastikan bahwa/gi, "menjaga agar");
  cleaned = cleaned.replace(/memastikan/gi, "menjaga");
  cleaned = cleaned.replace(/transformasi digital/gi, "kemajuan digital");
  cleaned = cleaned.replace(/paradigma baru/gi, "sudut pandang baru");

  // 5. Sesuaikan register tone tier
  if (tier === "tier3") {
    // Informal: pakai kontraksi natural anak muda
    cleaned = cleaned.replace(/\btidak\b/gi, "nggak");
    cleaned = cleaned.replace(/\bsudah\b/gi, "udah");
    cleaned = cleaned.replace(/\bmembuat\b/gi, "bikin");
    cleaned = cleaned.replace(/\bsaja\b/gi, "aja");
    cleaned = cleaned.replace(/\bbagaimana\b/gi, "gimana");
    cleaned = cleaned.replace(/\bmemang\b/gi, "emang");
  } else if (tier === "tier1") {
    // Formal: pastikan kata baku tertib
    cleaned = cleaned.replace(/\bnggak\b/gi, "tidak");
    cleaned = cleaned.replace(/\budah\b/gi, "sudah");
    cleaned = cleaned.replace(/\bbikin\b/gi, "membuat");
    cleaned = cleaned.replace(/\baja\b/gi, "saja");
  }

  // Bersihkan spasi berlebih
  cleaned = cleaned.replace(/[ \t]{2,}/g, " ").trim();

  return cleaned;
}
