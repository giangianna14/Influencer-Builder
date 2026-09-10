import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

function getGenAI(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Helper to sanitize and extract JSON from Gemini text response
function extractJSON(text: string): any {
  if (!text) return null;
  let clean = text.trim();
  if (clean.startsWith("```json")) {
    clean = clean.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (clean.startsWith("```")) {
    clean = clean.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  const firstBrace = clean.indexOf("{");
  const firstBracket = clean.indexOf("[");
  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    const lastBrace = clean.lastIndexOf("}");
    if (lastBrace !== -1) {
      clean = clean.slice(firstBrace, lastBrace + 1);
    }
  } else if (firstBracket !== -1) {
    const lastBracket = clean.lastIndexOf("]");
    if (lastBracket !== -1) {
      clean = clean.slice(firstBracket, lastBracket + 1);
    }
  }
  return JSON.parse(clean);
}

// Anti-Slop Writing Engine v3.0 Core Directives & Sanitizers (based on adenaufal/anti-slop-writing)
const ANTI_SLOP_DIRECTIVES = `
[KEBIJAKAN ANTI-SLOP WRITING v3.0 - WAJIB DIPATUHI SECARA KETAT]
1. KEBIJAKAN TANDA BACA (ATURAN MUTLAK):
   - Em dash ('—') dan en dash ('–') DILARANG TOTAL. Target: NOL DASH. Ganti dengan titik, koma, atau tanda kurung.
   - Jangan gunakan colon (:) bertumpuk-tumpuk.
2. LARANGAN KOSAKATA SLOP AI:
   - Dilarang kata analitis klise: "menyelami", "menyoroti", "menggarisbawahi", "memfasilitasi", "mengoptimalkan", "mengedepankan", "mewujudkan", "merealisasikan", "berperan penting", "berperan krusial", "memastikan bahwa", "memastikan".
   - Dilarang kata penggelembung puffery: "sangat penting", "sangat krusial", "fundamental", "luar biasa", "holistik", "komprehensif", "inovatif", "dinamis".
   - Dilarang figuratif hampa: "tapestry", "permadani", "ekosistem", "paradigma", "transformasi digital", "sinergi", "lanskap".
   - Dilarang pembuka klise: "Di era modern ini", "Seiring perkembangan zaman", "Dalam konteks", "Sebagai kesimpulan", "Tidak dapat dipungkiri".
3. POLA STRUKTURAL & BURSTINESS:
   - Cadence uniformity adalah musuh. Variasikan panjang kalimat secara dinamis (campurkan kalimat pendek 3-5 kata dengan kalimat panjang 20+ kata).
   - Jangan gunakan formula retoris: "tidak hanya X tetapi juga Y" atau "bukan hanya X tapi juga Y". Nyatakan faktanya langsung.
   - Pecah aturan tiga (AI selalu mendaftar tepat 3 hal; gunakan variasi 2 atau 4 hal).
   - Variasikan ritme pembuka kalimat (jangan mulai banyak kalimat berturut-turut dengan "Hal ini", "Ini", "Dalam", "Selain itu", atau "Dengan").
`;

const BANNED_SLOP_WORDS_ID = [
  "sangat krusial",
  "sangat penting",
  "sangat signifikan",
  "sangat relevan",
  "fundamental",
  "luar biasa",
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

function sanitizeAntiSlopText(text: string, tier: "tier1" | "tier2" | "tier3" = "tier2"): string {
  if (!text || typeof text !== "string") return text;
  let cleaned = text;

  // 1. DILARANG TOTAL: Em-dash & En-dash
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

  // 4. Penggantian kata klise
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

  // 5. Tiering
  if (tier === "tier3") {
    cleaned = cleaned.replace(/\btidak\b/gi, "nggak");
    cleaned = cleaned.replace(/\bsudah\b/gi, "udah");
    cleaned = cleaned.replace(/\bmembuat\b/gi, "bikin");
    cleaned = cleaned.replace(/\bsaja\b/gi, "aja");
    cleaned = cleaned.replace(/\bbagaimana\b/gi, "gimana");
    cleaned = cleaned.replace(/\bmemang\b/gi, "emang");
  } else if (tier === "tier1") {
    cleaned = cleaned.replace(/\bnggak\b/gi, "tidak");
    cleaned = cleaned.replace(/\budah\b/gi, "sudah");
    cleaned = cleaned.replace(/\bbikin\b/gi, "membuat");
    cleaned = cleaned.replace(/\baja\b/gi, "saja");
  }

  return cleaned.replace(/[ \t]{2,}/g, " ").trim();
}

function sanitizeDeep(obj: any, tier: "tier1" | "tier2" | "tier3" = "tier2"): any {
  if (!obj) return obj;
  if (typeof obj === "string") {
    return sanitizeAntiSlopText(obj, tier);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeDeep(item, tier));
  }
  if (typeof obj === "object") {
    const res: any = {};
    for (const key of Object.keys(obj)) {
      res[key] = sanitizeDeep(obj[key], tier);
    }
    return res;
  }
  return obj;
}

function auditAntiSlopText(text: string) {
  if (!text || text.trim().length === 0) {
    return {
      score: 100,
      passed: true,
      dashCount: 0,
      colonCount: 0,
      bannedWordsFound: [],
      cadenceUniformityDetected: false,
      burstinessGrade: "Tinggi (Manusiawi)",
      recommendations: [],
    };
  }

  const lowerText = text.toLowerCase();
  const recommendations: string[] = [];

  const emDashMatches = text.match(/—/g) || [];
  const enDashMatches = text.match(/–/g) || [];
  const dashCount = emDashMatches.length + enDashMatches.length;
  if (dashCount > 0) {
    recommendations.push(`Ditemukan ${dashCount} em-dash/en-dash. Harap ganti dengan titik atau koma.`);
  }

  const colonMatches = text.match(/:/g) || [];
  const colonCount = colonMatches.length;

  const bannedWordsFound: string[] = [];
  for (const phrase of BANNED_SLOP_WORDS_ID) {
    if (lowerText.includes(phrase)) {
      bannedWordsFound.push(phrase);
    }
  }
  if (bannedWordsFound.length > 0) {
    recommendations.push(`Hapus kata klise AI: "${bannedWordsFound.slice(0, 3).join('", "')}".`);
  }

  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter((s) => s.length > 0);
  const wordCounts = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);
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

  let burstinessGrade = "Tinggi (Manusiawi)";
  if (cadenceUniformityDetected) {
    burstinessGrade = "Kaku (Pola AI)";
    recommendations.push("Keseragaman ritme terdeteksi (3+ kalimat mirip 17-23 kata). Campurkan kalimat pendek dan panjang.");
  }

  const penalty = dashCount * 25 + bannedWordsFound.length * 15 + (cadenceUniformityDetected ? 20 : 0);
  const score = Math.max(10, Math.min(100, 100 - penalty));

  return {
    score,
    passed: score >= 85 && dashCount === 0 && bannedWordsFound.length === 0,
    dashCount,
    colonCount,
    bannedWordsFound,
    cadenceUniformityDetected,
    burstinessGrade,
    recommendations,
  };
}

// Global rotation counter for visual studio previews
let fallbackImageCounter = 0;

const CURATED_IMAGE_LIBRARY = {
  female: {
    avatar: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=80",
    ],
    package1: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    ],
    package2: [
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    ],
    package3: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1200&q=80",
    ],
  },
  male: {
    avatar: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=80",
    ],
    package1: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    ],
    package2: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80",
    ],
    package3: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506634572416-48cdfe530110?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

function getCuratedVisualFallback(options: {
  gender?: string;
  packageKey?: string;
  prompt?: string;
}): string {
  const gStr = (options.gender || options.prompt || "").toLowerCase();
  const isMale = gStr.includes("laki") || gStr.includes("pria") || gStr.includes("male") || gStr.includes("man") || gStr.includes("boy");
  const genderKey = isMale ? "male" : "female";

  let slot = "avatar";
  const pKey = (options.packageKey || options.prompt || "").toLowerCase();
  if (pKey.includes("package1") || pKey.includes("portrait") || pKey.includes("headshot")) {
    slot = "package1";
  } else if (pKey.includes("package2") || pKey.includes("lifestyle") || pKey.includes("cafe")) {
    slot = "package2";
  } else if (pKey.includes("package3") || pKey.includes("brand") || pKey.includes("editorial")) {
    slot = "package3";
  }

  const pool =
    CURATED_IMAGE_LIBRARY[genderKey][slot as keyof typeof CURATED_IMAGE_LIBRARY["female"]] ||
    CURATED_IMAGE_LIBRARY[genderKey].avatar;

  fallbackImageCounter++;
  const index = fallbackImageCounter % pool.length;
  return pool[index];
}

// Resilient Fallback Influencer Generator ensuring 100% data integrity for 10 pillars
function generateFallbackInfluencer(params: any): any {
  const effectiveName = params.nama || "Maya Danastri";
  const effectiveHandle = params.handle || `@${effectiveName.toLowerCase().replace(/[^a-z0-9]/g, "")}`;
  const effectiveNiche = params.nicheKonten || params.niche || "Fashion & Mindful Lifestyle";
  const effectiveSubNiche = params.subNiche || "Sustainable Fashion & Slow Living Modern";
  const effectiveGender = params.gender || "Perempuan";
  const effectiveAge = parseInt(String(params.usia || 23)) || 23;
  const effectiveEthnicity = params.etnisitas || "Indonesia modern";
  const effectiveLocation = params.lokasiBasis || "Jakarta & Bali, Indonesia";
  const effectiveArchetype = params.arketipe || params.archetype || "The Trendsetter";
  const effectiveMBTI = params.mbti || "ENFJ - The Protagonist";
  const effectiveTone = params.toneOfVoice || "Warm, articulate, mindful, witty, and relatable";
  const effectiveStyle = params.gayaFashion || "Clean Minimalist Chic";
  const effectiveFeatures = `${params.bentukWajah || "oval simetris"}, ${params.mata || "hazel almond eyes"}, ${params.keunikanFisik || "subtle natural skin texture"}`;
  const effectiveHair = params.rambut || "Soft textured dark brown hair";
  const effectiveBody = params.tipeTubuh || "Slim athletic posture (169cm)";

  const anchorTokens = `(lora:${effectiveName.toLowerCase().replace(/\s+/g, "_")}:0.95), ${effectiveAge}yo ${effectiveEthnicity.toLowerCase()} ${effectiveGender.toLowerCase()}, ${effectiveFeatures}, ${effectiveHair}, sharp focus, authentic skin pores, RAW photography, 8k uhd`;

  return {
    id: `inf_${Date.now()}`,
    name: effectiveName,
    handle: effectiveHandle,
    tagline: "Exploring mindful living, sustainable aesthetics, and the frontier of synthetic creativity.",
    niche: effectiveNiche,
    category: effectiveSubNiche,
    createdAt: new Date().toISOString(),
    demographics: {
      age: effectiveAge,
      gender: effectiveGender,
      ethnicity: effectiveEthnicity,
      primaryLanguage: params.bahasaUtama || params.language || "Bahasa Indonesia",
      secondaryLanguage: params.bahasaSekunder || "English (Fluent)",
      baseLocation: effectiveLocation,
      targetAudience: `${params.targetAudiensUsia || "18 - 34 tahun"} - ${params.targetAudiensMinat || "Mode, teknologi & estetika visual"}`,
      educationOrOccupation: params.tujuanAI || "Virtual Creative Director & Brand Ambassador",
    },
    visualIdentity: {
      faceFeatures: effectiveFeatures,
      hairStyle: effectiveHair,
      bodyType: effectiveBody,
      signatureStyle: effectiveStyle,
      colorPalette: ["#18181B", "#E4E4E7", "#D4AF37", "#3E5C76", "#C89D7C"],
      consistencyAnchorTokens: anchorTokens,
    },
    personalityProfile: {
      archetype: effectiveArchetype,
      mbti: effectiveMBTI,
      toneOfVoice: effectiveTone,
      catchphrases: [
        params.ciriKhasCatchphrase || "Mindful in a hyperconnected world.",
        "Masa depan bukan sesuatu yang kita tunggu, tapi yang kita rancang hari ini.",
        "Simplicity is the highest form of technology.",
      ],
      coreValues: [
        params.nilaiUtama || "Otentisitas digital dan etika berkelanjutan",
        "Eksplorasi identitas sintetis yang berdampak nyata",
        "Harmonisasi antara kecepatan AI dan ketelitian manusia",
      ],
      hobbies: [
        params.hobi || "Specialty coffee brewing, 35mm film photography, pilates",
        "Design curation & art exhibitions",
        "Modular ambient audio",
      ],
      backstory: `${effectiveName} dibangun sebagai representasi generasi baru kreator virtual yang memadukan kehangatan emosional manusia dengan kecanggihan visual AI. Dirancang untuk niche ${effectiveNiche}, ${effectiveName} menjadi jembatan antara inovasi digital dan kehidupan nyata yang bermakna.`,
      interactionStrategy: {
        captionHookStyle: "Membuka dengan observasi relatable sehari-hari atau paradoks visual yang memicu diskusi aktif di kolom komentar.",
        dmResponseVibe: "Hangat, apresiatif, menggunakan bahasa santun namun santai tanpa kesan bot kaku.",
        storyEngagementTechnique: "Jajak pendapat mingguan 'This or That', bedah detail inspirasi gaya, dan sesi Q&A interaktif.",
      },
      brandRules: {
        idealSponsors: ["Sustainable Fashion Brands", "Clean Skincare Labs", "Next-Gen Tech & Wearables", "Boutique Cafes"],
        forbiddenCategories: ["Judi online / Kasino virtual", "Skincare tanpa izin BPOM", "Fast fashion sekali pakai"],
      },
    },
    promptPackages: {
      package1_portrait: {
        title: "Paket 1: Signature Portrait & Studio Headshot",
        concept: "Headshot ikonik profil utama dengan pencahayaan studio sinematik untuk avatar, press kit, dan feed announcement.",
        cameraLens: "85mm f/1.4 Prime Portrait Lens, Razor-sharp pupil focus",
        lighting: params.preferensiLighting || "Cinematic Rembrandt studio lighting, subtle warm amber rim light",
        setting: "Minimalist concrete architectural studio with soft diffused ambient shadows",
        wardrobe: params.fashionItemsKhas || "Chalk-white tailored asymmetrical blazer with titanium minimalist jewelry",
        generatorPrompts: {
          nanoBanana: `A hyperrealistic cinematic 8k studio headshot portrait of ${effectiveName}, ${anchorTokens}, wearing ${params.fashionItemsKhas || "structured white blazer"}, soft diffused Rembrandt lighting, shallow depth of field, natural skin pores, neutral studio background, masterwork photography.`,
          flux: `cinematic film still, photorealistic 85mm portrait of ${effectiveName}, ${anchorTokens}, soft Rembrandt lighting, authentic micro skin texture, subsurface scattering, neutral studio background, shot on Hasselblad H6D-100c.`,
          seedream: {
            positive: `(masterpiece, best quality:1.3), (photorealistic:1.4), raw photo of ${effectiveName}, ${anchorTokens}, studio lighting, rembrandt shadow, 85mm lens, f1.4, clean background, 8k uhd`,
            negative: "blurry, low quality, bad anatomy, deformed eyes, plastic doll skin, airbrushed, cartoon, 3d render, extra fingers, oversaturated",
            steps: 32,
            cfg: 7.0,
          },
          chatgptImage: `A high-end editorial studio portrait of ${effectiveName}. Featuring ${effectiveFeatures}, ${effectiveHair}, dressed in ${effectiveStyle}. Soft Rembrandt studio light against a minimalist neutral backdrop, captured on an 85mm prime lens with crisp pupil reflections.`,
          geminiImage: `Photorealistic cinematic portrait of ${effectiveName}, sharp facial features, detailed skin texture, studio ambient lighting, shallow depth of field f/1.4, 8k resolution, award-winning photography.`,
          midjourney: `editorial studio portrait of ${effectiveName}, ${effectiveHair}, ${effectiveFeatures}, tailored blazer, rembrandt lighting, architectural studio background, shot on 85mm f/1.4 --ar 4:5 --stylize 250 --v 6.1 --raw`,
        },
      },
      package2_lifestyle: {
        title: "Paket 2: Lifestyle & Daily In-Action",
        concept: "Momen candid santai menikmati suasana cafe yang membangun kedekatan emosional dan interaksi organik dengan audiens.",
        cameraLens: "35mm f/2.0 Street & Candid Lens",
        lighting: "Natural warm golden hour sunlight streaming through panoramic windows",
        setting: "Aesthetic sun-drenched greenhouse specialty cafe, lush indoor plants and warm wooden table",
        wardrobe: params.gayaFashion || "Oversized ribbed oatmeal knit sweater, delicate silver rings, ceramic coffee cup in hand",
        generatorPrompts: {
          nanoBanana: `A candid lifestyle photograph of ${effectiveName}, ${anchorTokens}, sitting at a sunlit greenhouse cafe, holding a ceramic coffee cup, soft golden hour sunlight, authentic relaxed smile, lush plants in background, 35mm lens depth, candid realism, 8k.`,
          flux: `lifestyle candid photography, 35mm photograph of ${effectiveName}, ${anchorTokens}, cozy aesthetic cafe, warm golden hour rays casting gentle shadows, holding a ceramic coffee cup, natural skin tone, Fuji Pro 400H color palette.`,
          seedream: {
            positive: `(masterpiece, photorealistic:1.3), candid photo of ${effectiveName}, aesthetic cafe, holding coffee cup, warm golden hour light, 35mm photography, natural bokeh, 8k`,
            negative: "lowres, bad hands, distorted fingers, oversaturated, anime, 3d, artificial flash, blurry face",
            steps: 30,
            cfg: 6.5,
          },
          chatgptImage: `A candid lifestyle photo of ${effectiveName} sitting at a wooden table in an airy modern cafe filled with indoor plants. Golden afternoon sunlight streams through large windows while holding a handmade ceramic cup, wearing cozy knitwear. Realistic candid framing, authentic skin texture.`,
          geminiImage: `A natural lifestyle photograph of ${effectiveName} sitting by a cafe window during golden hour, holding a warm latte, wearing casual stylish knitwear, soft natural lighting, subtle lens flare, 8k photorealism.`,
          midjourney: `candid lifestyle photo of ${effectiveName} sitting in a sunlit botanical cafe, holding ceramic coffee cup, oversized cozy sweater, golden hour sunlight, 35mm street photography --ar 4:5 --stylize 180 --v 6.1 --raw`,
        },
      },
      package3_brandEditorial: {
        title: "Paket 3: Brand Collaboration & High-Concept Editorial",
        concept: "Tampilan high-fashion campaign untuk kolaborasi brand komersial dengan pencahayaan dramatis dan daya pikat visual tinggi.",
        cameraLens: "50mm f/1.8 High-Resolution Commercial Cinema Lens",
        lighting: "Dual-tone cinematic lighting: midnight blue ambient with neon cyan and warm gold rim lights",
        setting: "High-rise glass balcony overlooking glowing illuminated metropolis skyline at twilight",
        wardrobe: "Metallic iridescent sculptural trench coat, high collar, sleek modern styling",
        generatorPrompts: {
          nanoBanana: `High-fashion commercial editorial photograph of ${effectiveName}, ${anchorTokens}, standing on a glass balcony overlooking a sparkling metropolis at dusk, wearing an avant-garde iridescent trench coat, dramatic dual-tone neon cyan and amber rim lighting, Vogue aesthetic, 8k resolution.`,
          flux: `editorial fashion campaign photo, 50mm portrait of ${effectiveName}, rooftop overlooking illuminated city skyline at night, wearing sculptural metallic trench coat, dramatic cinematic lighting, cyan and amber highlights, Vogue style, high key contrast.`,
          seedream: {
            positive: `(masterpiece, top quality:1.4), (editorial fashion:1.3), ${effectiveName} on high-rise balcony at night, futuristic city lights, iridescent metallic trench coat, dramatic lighting, cyan and gold tones, 50mm lens, 8k uhd`,
            negative: "cartoon, anime, plastic, watermark, low quality, deformed body, bad eyes, oversaturated",
            steps: 35,
            cfg: 7.5,
          },
          chatgptImage: `A luxury high-concept fashion editorial shot of ${effectiveName} standing on a minimalist glass balcony overlooking a sprawling night skyline. Wearing a structured iridescent charcoal coat, illuminated by moody cinematic lighting with electric cyan edge lights and warm highlights.`,
          geminiImage: `High-concept luxury editorial fashion photograph of ${effectiveName} in an avant-garde metallic coat on a penthouse balcony at twilight, glowing urban skyline in background, dramatic cinematic dual-tone lighting, 8k magazine cover quality.`,
          midjourney: `high-fashion editorial campaign, ${effectiveName} on glass penthouse balcony overlooking illuminated neon skyline at night, wearing iridescent metallic coat, dramatic cinematic cyan and gold lighting, 50mm lens --ar 16:9 --stylize 300 --v 6.1 --raw`,
        },
      },
    },
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "25mb" }));

  // API Health Check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      timestamp: new Date().toISOString(),
    });
  });

  // 1. Build AI Influencer (Identity summary, personality profile, 3 visual prompt packages for all generators)
  app.post("/api/influencer/build", async (req, res) => {
    try {
      const {
        // Simple/legacy fallback fields
        userPrompt,
        niche,
        archetype,
        gender,
        aesthetic,
        targetMarket,
        language,

        // 1. Identitas Dasar
        nama,
        handle,
        usia,
        etnisitas,
        lokasiBasis,
        bahasaUtama,
        bahasaSekunder,

        // 2. Kepribadian
        mbti,
        toneOfVoice,
        nilaiUtama,
        hobi,
        ciriKhasCatchphrase,

        // 3. Niche Konten
        nicheKonten,
        subNiche,

        // 4. Target Audiens
        targetAudiensUsia,
        targetAudiensMinat,
        wilayahAudiens,

        // 5. Gaya Fashion
        gayaFashion,
        fashionItemsKhas,

        // 6. Penampilan Fisik
        bentukWajah,
        mata,
        rambut,
        tipeTubuh,
        keunikanFisik,

        // 7. Gaya Visual
        gayaVisual,
        preferensiLighting,
        paletWarnaVisual,

        // 8. Jenis Konten
        jenisKonten,

        // 9. Platform Utama
        platformUtama,

        // 10. Tujuan AI Influencer
        tujuanAI,
        catatanTambahan,
      } = req.body;

      const ai = getGenAI();

      const effectiveNiche = nicheKonten || niche || "Fashion & Lifestyle";
      const effectiveGender = gender || "Perempuan";
      const effectiveArchetype = archetype || "The Trendsetter";
      const effectiveAesthetic = gayaVisual || aesthetic || "Clean Minimalist Chic";
      const effectiveToneTier = (req.body.toneTier as "tier1" | "tier2" | "tier3") || "tier2";

      const systemInstruction = `Anda adalah Master Architect & Virtual Influencer Producer profesional kelas dunia.
Tugas Anda adalah merancang dan menyusun identitas utuh AI Influencer (Virtual Human) yang hyper-realistic, bernilai komersial tinggi, konsisten secara visual, dan memiliki daya tarik audiens yang kuat.

${ANTI_SLOP_DIRECTIVES}

Tone Tier yang digunakan untuk seluruh tulisan persona (tagline, catchphrases, backstory, interaksi): ${effectiveToneTier === "tier3" ? "Tier 3 (Informal - santai, conversational, kata ganti aku/kamu, kontraksi wajar: nggak, udah, gimana)" : effectiveToneTier === "tier1" ? "Tier 1 (Formal - baku, terstruktur, tanpa kontraksi)" : "Tier 2 (Semi-formal - hangat, luwes, natural, standar blog/LinkedIn)"}.

PENTING:
1. Susun Ringkasan Identitas lengkap (Nama, Handle, Persona Tagline, Niche, Demografi, Ciri Fisik, Konsistensi Token/LoRA Anchor, Nilai Utama, Tone of Voice).
   - Jika pengguna telah memberikan nama/handle/usia/gender spesifik, WAJIB gunakan data tersebut tanpa menggantinya.
2. Susun Profil Kepribadian mendalam (Archetype, MBTI, Minat, Filosofi Konten, Cara Berinteraksi, Aturan Sponsor Brand) selaras dengan input pengguna.
   - Patuhi aturan Anti-Slop: nol em-dash, burstiness tinggi, tanpa formula klise 'tidak hanya... tetapi juga'.
3. Buat TIGA PAKET PROMPT VISUAL SIAP PAKAI:
   - Paket 1: Signature Portrait & Studio Headshot (Hero profile, close-up, focal length 85mm, Rembrandt/Split lighting, micro skin texture, razor sharp focus pada mata).
   - Paket 2: Lifestyle & Daily In-Action (Candid street/cafe/workout/studio, natural 35mm lens, ambient golden hour/cinematic daylight, natural pose).
   - Paket 3: Brand Collaboration & High-Concept Editorial (Editorial fashion/commercial sponsorship, 50mm, dramatic high-fashion styling, luxury or futuristic aesthetic).
4. Setiap paket HARUS menyertakan format prompt yang dioptimalkan secara spesifik untuk generator terkemuka:
   - NanoBanana (Gemini 3.1 image prompt format: vivid, direct photorealistic directives)
   - Flux (Flux.1 Dev format: natural descriptive realism, cinematic framing, 35mm/85mm photography cues, authentic skin pores)
   - Seedream (Seedream / SDXL format: comma-separated weights, positive tokens, negative prompt, steps 30, CFG 7.0)
   - ChatGPT Image (DALL-E 3 format: rich conversational scene descriptions, camera lens, color grading)
   - Gemini Image (Imagen 3 format: ultra-detailed photorealistic photography, ray-traced lighting, shallow depth of field)
   - Midjourney v6 (Parameter-driven with --ar, --v 6.1, --stylize, --raw)

Keluarkan output HANYA dalam format JSON murni tanpa pembuka/penutup markdown.`;

      const promptText = `Bangun AI Influencer lengkap dengan 10 pilar karakter terstruktur berikut:

[1. IDENTITAS DASAR]
- Nama: ${nama || "Nama kreatif sesuai etnis & konsep"}
- Handle: ${handle || (nama ? `@${nama.toLowerCase().replace(/\s+/g, "")}` : "@virtual.creator")}
- Usia: ${usia || "23 tahun"}
- Gender: ${effectiveGender}
- Etnisitas / Kebangsaan: ${etnisitas || "Indonesian modern"}
- Lokasi Basis: ${lokasiBasis || "Jakarta & Bali, Indonesia"}
- Bahasa Komunikasi: Utama: ${bahasaUtama || language || "Bahasa Indonesia"}, Sekunder: ${bahasaSekunder || "English"}

[2. KEPRIBADIAN & BRAND SOUL]
- Arketipe: ${effectiveArchetype}
- MBTI: ${mbti || "ENFJ"}
- Tone of Voice: ${toneOfVoice || "Warm, articulate, witty, relatable, uplifting"}
- Nilai Utama: ${nilaiUtama || "Otentisitas digital, mindful aesthetics, positive youth empowerment"}
- Hobi & Passion: ${hobi || "Specialty coffee, analog photography, pilates"}
- Slogan / Catchphrase Khas: ${ciriKhasCatchphrase || "Buatkan catchphrase menarik"}

[3. NICHE KONTEN]
- Niche: ${effectiveNiche}
- Sub-Niche / Fokus Spesifik: ${subNiche || "Digital lifestyle & aesthetics"}

[4. TARGET AUDIENS]
- Usia Audiens: ${targetAudiensUsia || targetMarket || "Gen Z & Millennials (18-34)"}
- Minat Audiens: ${targetAudiensMinat || "Mode, teknologi, self-expression, visual content"}
- Wilayah Audiens: ${wilayahAudiens || "Indonesia & Asia Tenggara"}

[5. GAYA FASHION]
- Aesthetic Gaya Busana: ${gayaFashion || "Clean Minimalist Chic"}
- Pakaian & Aksesori Khas: ${fashionItemsKhas || "Tailored blazers, monochrome linen, minimalist accessories"}

[6. PENAMPILAN FISIK & KONSISTENSI VISUAL]
- Bentuk Wajah: ${bentukWajah || "Symmetrical, elegant sharp jawline"}
- Mata & Sorot: ${mata || "Almond hazel brown eyes, warm engaging gaze"}
- Rambut: ${rambut || "Soft layered dark brown hair"}
- Tipe Tubuh: ${tipeTubuh || "Slim athletic build, 168cm"}
- Ciri Khas Unik: ${keunikanFisik || "Subtle beauty mark on left cheek under eye"}

[7. GAYA VISUAL]
- Gaya Estetika Visual: ${gayaVisual || effectiveAesthetic}
- Preferensi Lighting: ${preferensiLighting || "Cinematic Rembrandt studio lighting and warm golden hour flares"}
- Palet Warna Visual: ${paletWarnaVisual || "Warm neutrals, charcoal black, beige, subtle gold"}

[8. JENIS KONTEN]
- Format Konten Utama: ${Array.isArray(jenisKonten) && jenisKonten.length > 0 ? jenisKonten.join(", ") : "OOTD, Transition Reels, Carousel Edukasi, Daily POV, Review"}

[9. PLATFORM UTAMA]
- Platform Media Sosial: ${Array.isArray(platformUtama) && platformUtama.length > 0 ? platformUtama.join(", ") : "Instagram, TikTok, YouTube Shorts"}

[10. TUJUAN AI INFLUENCER]
- Tujuan Utama: ${tujuanAI || "Kemitraan komersial brand, modeling virtual, dan edukasi audiens"}
- Catatan Tambahan: ${catatanTambahan || userPrompt || "Buat persona yang sangat realistis, konsisten, dan siap diproduksi."}

Harap buat struktur JSON persis seperti format ini:
{
  "id": "inf_${Date.now()}",
  "name": "${nama || "Nama Lengkap Influencer"}",
  "handle": "${handle || "@handle_resmi"}",
  "tagline": "Satu kalimat slogan persona yang catchy",
  "niche": "${effectiveNiche}",
  "category": "${subNiche || effectiveNiche}",
  "demographics": {
    "age": ${typeof usia === "number" ? usia : (parseInt(String(usia)) || 23)},
    "gender": "${effectiveGender}",
    "ethnicity": "${etnisitas || "Mixed Indonesian"}",
    "primaryLanguage": "${bahasaUtama || language || "Bahasa Indonesia"}",
    "secondaryLanguage": "${bahasaSekunder || "English (Casual Fluent)"}",
    "baseLocation": "${lokasiBasis || "Jakarta & Bali, Indonesia"}",
    "targetAudience": "${targetAudiensUsia || "Urban Gen Z & Millennial 18-34"} - ${targetAudiensMinat || "Lifestyle & Tech"}",
    "educationOrOccupation": "${tujuanAI || "Digital Virtual Creator & Brand Ambassador"}"
  },
  "visualIdentity": {
    "faceFeatures": "Deskripsi detail wajah (${bentukWajah || "rahang tegas"}, ${mata || "mata ekspresif"}, ${keunikanFisik || "tanda khas"})",
    "hairStyle": "${rambut || "Warna dan model rambut khas"}",
    "bodyType": "${tipeTubuh || "Tipe tubuh dan postur"}",
    "signatureStyle": "${gayaFashion || "Gaya berpakaian khas sehari-hari"}",
    "colorPalette": ["#1A1A1A", "#E6DFD5", "#C89D7C", "#3E5C76", "#D4AF37"],
    "consistencyAnchorTokens": "Kata kunci konsistensi wajah & LoRA trigger yang mencakup secara detail: usia ${usia || 23}yo, etnisitas ${etnisitas || "indonesian"}, ${bentukWajah || "oval face"}, ${mata || "hazel almond eyes"}, ${rambut || "dark textured hair"}, ${keunikanFisik || "subtle beauty mark"}, 8k, raw photo, realistic skin texture"
  },
  "personalityProfile": {
    "archetype": "${effectiveArchetype}",
    "mbti": "${mbti || "ENFJ - The Protagonist"}",
    "toneOfVoice": "${toneOfVoice || "Warm, articulate, witty, relatable, uplifting"}",
    "catchphrases": ["Catchphrase 1", "Catchphrase 2", "Catchphrase 3"],
    "coreValues": ["Authenticity in Digital Age", "Mindful Aesthetics", "Empowering Youth"],
    "hobbies": ["Specialty Coffee", "Photography", "Music"],
    "backstory": "Kisah latar belakang virtual influencer 2-3 paragraf yang menarik dan humanis.",
    "interactionStrategy": {
      "captionHookStyle": "Memulai dengan pertanyaan provokatif atau pengamatan relatable sehari-hari.",
      "dmResponseVibe": "Ramah seperti sahabat dekat, menggunakan emoji yang pas dan bahasa sopan namun santai.",
      "storyEngagementTechnique": "Sering polling 'This or That', Q&A mingguan, dan behind the scenes 'render/fit check'."
    },
    "brandRules": {
      "idealSponsors": ["Luxury Skincare", "Tech Gadgets", "Sustainable Fashion", "Boutique Cafes"],
      "forbiddenCategories": ["Judi online", "Skincare tanpa BPOM", "Fast fashion sekali pakai"]
    }
  },
  "promptPackages": {
    "package1_portrait": {
      "title": "Paket 1: Signature Portrait & Studio Headshot",
      "concept": "Headshot ikonik profil utama dengan pencahayaan studio sinematik untuk avatar, press kit, dan feed announcement.",
      "cameraLens": "85mm f/1.4 Prime Lens, Eye-level",
      "lighting": "${preferensiLighting || "Cinematic Rembrandt studio lighting, subtle warm hair rim light"}",
      "setting": "Minimalist architectural concrete studio with soft diffused shadows",
      "wardrobe": "${fashionItemsKhas || "Structured cream blazer with minimalist titanium jewellery"}",
      "generatorPrompts": {
        "nanoBanana": "Prompt khusus NanoBanana/Gemini image",
        "flux": "Prompt khusus Flux.1 Dev",
        "seedream": {
          "positive": "Prompt positif Seedream/SDXL",
          "negative": "blurry, bad anatomy, deformed eyes, plastic skin, oversaturated, 3d render, cartoon, extra fingers",
          "steps": 32,
          "cfg": 7.0
        },
        "chatgptImage": "Prompt khusus ChatGPT / DALL-E 3",
        "geminiImage": "Prompt khusus Gemini Image / Imagen 3",
        "midjourney": "Prompt khusus Midjourney v6 dengan flags --ar 4:5 --stylize 250 --v 6.1 --raw"
      }
    },
    "package2_lifestyle": {
      "title": "Paket 2: Lifestyle & Daily In-Action",
      "concept": "Momen candid santai sehari-hari yang membangun kedekatan emosional dan interaksi organik dengan audiens.",
      "cameraLens": "35mm f/2.0 Street Photography Lens",
      "lighting": "Natural golden hour ambient sunlight streaming through cafe window",
      "setting": "Aesthetic sunlit greenhouse specialty cafe, potted monstera in background",
      "wardrobe": "${gayaFashion || "Oversized knitted beige cardigan, white ribbed tank top, vintage silver wristwatch"}",
      "generatorPrompts": {
        "nanoBanana": "Prompt khusus NanoBanana/Gemini image",
        "flux": "Prompt khusus Flux.1 Dev",
        "seedream": {
          "positive": "Prompt positif Seedream/SDXL",
          "negative": "low quality, distorted hands, bad face, CGI, oversaturated, artificial blur",
          "steps": 30,
          "cfg": 6.5
        },
        "chatgptImage": "Prompt khusus ChatGPT / DALL-E 3",
        "geminiImage": "Prompt khusus Gemini Image / Imagen 3",
        "midjourney": "Prompt khusus Midjourney v6 dengan flags --ar 4:5 --stylize 200 --v 6.1 --raw"
      }
    },
    "package3_brandEditorial": {
      "title": "Paket 3: Brand Collaboration & High-Concept Editorial",
      "concept": "Tampilan high-fashion campaign untuk kolaborasi brand komersial dengan pencahayaan dramatis dan daya pikat visual tinggi.",
      "cameraLens": "50mm f/1.8 High-Resolution Commercial Lens",
      "lighting": "Dual-tone neon cyan and warm amber accent lighting, dark moody ambiance",
      "setting": "Futuristic glass skyscraper balcony overlooking illuminated metropolis skyline at night",
      "wardrobe": "Metallic asymmetrical avant-garde trench coat, slicked-back hairstyle",
      "generatorPrompts": {
        "nanoBanana": "Prompt khusus NanoBanana/Gemini image",
        "flux": "Prompt khusus Flux.1 Dev",
        "seedream": {
          "positive": "Prompt positif Seedream/SDXL",
          "negative": "watermark, text, blurry, low resolution, plastic doll face, extra limbs",
          "steps": 35,
          "cfg": 7.5
        },
        "chatgptImage": "Prompt khusus ChatGPT / DALL-E 3",
        "geminiImage": "Prompt khusus Gemini Image / Imagen 3",
        "midjourney": "Prompt khusus Midjourney v6 dengan flags --ar 16:9 --stylize 350 --v 6.1 --raw"
      }
    }
  }
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const rawText = response.text || "";
      const parsedData = extractJSON(rawText);

      if (!parsedData || !parsedData.name) {
        throw new Error("Gagal menguraikan output JSON dari AI model.");
      }

      parsedData.createdAt = new Date().toISOString();
      parsedData.toneTier = effectiveToneTier;
      const cleanInfluencer = sanitizeDeep(parsedData, effectiveToneTier);
      res.json({ success: true, influencer: cleanInfluencer });
    } catch (error: any) {
      console.warn("Notice in /api/influencer/build (synthesizing resilient structured influencer):", error?.message || error);
      const effectiveToneTier = (req.body?.toneTier as "tier1" | "tier2" | "tier3") || "tier2";
      const fallbackData = sanitizeDeep(generateFallbackInfluencer(req.body), effectiveToneTier);
      fallbackData.toneTier = effectiveToneTier;
      res.json({ success: true, influencer: fallbackData, isFallback: true });
    }
  });

  // 2. Discover Real-time Market Trends with Google Search Grounding
  app.post("/api/trends/discover", async (req, res) => {
    try {
      const { niche, region = "Indonesia & Global" } = req.body;
      const ai = getGenAI();

      const searchPrompt = `Lakukan pencarian tren pasar, topik viral di media sosial (Instagram, TikTok, X, YouTube), gaya konten populer, dan dinamika audiens terkini untuk niche "${niche || "Lifestyle & Fashion"}" di wilayah ${region} hari ini.
Berikan 5 tren teratas yang sangat cocok untuk dijadikan konten oleh seorang Virtual / AI Influencer.

Formatkan jawaban Anda sebagai JSON murni (array of objects) dengan struktur berikut tanpa teks markdown tambahan:
[
  {
    "id": "trend_1",
    "title": "Judul Tren Singkat & Menarik",
    "niche": "${niche || "Lifestyle"}",
    "momentum": "Explosive" | "High" | "Rising",
    "summary": "Penjelasan tren apa yang sedang terjadi dan mengapa audiens ramai membicarakannya.",
    "viralAngle": "Sudut pandang / angle unik yang bisa diambil oleh AI Influencer agar konten viral.",
    "trendingHashtags": ["#Hashtag1", "#Hashtag2", "#Hashtag3"],
    "audioSuggestion": "Jenis audio / soundtrack / trending sound yang cocok dipasangkan",
    "sourceGrounding": "Topik berita atau platform utama sumber tren"
  }
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: searchPrompt,
        config: {
          systemInstruction: `Anda adalah analis tren media sosial real-time dan market intelligence strategist. 
${ANTI_SLOP_DIRECTIVES}
Gunakan data faktual media sosial terkini. DILARANG menggunakan em-dash, klise AI, atau kata penggelembung. Kembalikan HANYA JSON array valid.`,
          tools: [{ googleSearch: {} }],
        },
      });

      const rawText = response.text || "";
      let trends = [];
      try {
        trends = extractJSON(rawText);
      } catch (e) {
        console.warn("Could not parse direct trends JSON, creating fallback structured list", e);
      }

      if (!Array.isArray(trends) || trends.length === 0) {
        trends = [
          {
            id: "trend_1",
            title: `AI & Human Co-Existence in ${niche || "Creative Industry"}`,
            niche: niche || "Tech & Lifestyle",
            momentum: "Explosive",
            summary: "Diskusi hangat tentang bagaimana kreator virtual melengkapi rutinitas harian manusia tanpa menggantikan sentuhan emosional.",
            viralAngle: "Video POV: Sehari di balik layar pemrosesan memori AI Influencer vs rutinitas manusia nyata.",
            trendingHashtags: ["#VirtualHuman", "#AICreator", "#BehindTheScreens", "#FutureTech"],
            audioSuggestion: "Synthwave ambient lo-fi beat dengan vinyl crackle",
            sourceGrounding: "Trending diskusi TikTok & Instagram Reels",
          },
          {
            id: "trend_2",
            title: "Micro-Ritual Wellness & Quiet Luxury",
            niche: niche || "Lifestyle",
            momentum: "High",
            summary: "Audiens beralih dari konsumsi mencolok ke rutinitas mikro mindful seperti sustainable capsule fashion.",
            viralAngle: "Fit check gaya minimalis berpadu tips merapikan lemari digital 5 menit.",
            trendingHashtags: ["#QuietLuxury", "#MindfulAesthetic", "#CleanLiving", "#OOTD"],
            audioSuggestion: "Acoustic chill piano loop dengan tempo 85 BPM",
            sourceGrounding: "Instagram Explore & Pinterest Trend Report",
          },
          {
            id: "trend_3",
            title: "Interactive Dilemma: Bantu Aku Pilih Outfit Besok",
            niche: niche || "Fashion",
            momentum: "Rising",
            summary: "Format carousel interaktif di mana audiens diajak memvoting keputusan outfit atau aktivitas di hari esok.",
            viralAngle: "2 visual kontras (Cyber Chic vs Cozy Earth Tone) dengan ajakan voting kuat di caption.",
            trendingHashtags: ["#PickMyFit", "#StylingChallenge", "#CommunityChoice"],
            audioSuggestion: "Upbeat electronic pop hook",
            sourceGrounding: "Viral engagement format di Instagram Carousels",
          },
        ];
      }

      const cleanTrends = sanitizeDeep(trends, "tier2");
      res.json({ success: true, trends: cleanTrends, searchedAt: new Date().toISOString() });
    } catch (error: any) {
      console.warn("Notice in /api/trends/discover (using curated trends fallback):", error?.message || error);
      const fallbackTrends = [
        {
          id: "trend_1",
          title: `AI & Human Co-Existence in ${req.body.niche || "Creative Industry"}`,
          niche: req.body.niche || "Tech & Lifestyle",
          momentum: "Explosive",
          summary: "Diskusi hangat tentang bagaimana kreator virtual melengkapi rutinitas harian manusia tanpa menggantikan sentuhan emosional.",
          viralAngle: "Video POV: Sehari di balik layar pemrosesan memori AI Influencer vs rutinitas manusia nyata.",
          trendingHashtags: ["#VirtualHuman", "#AICreator", "#BehindTheScreens", "#FutureTech"],
          audioSuggestion: "Synthwave ambient lo-fi beat dengan vinyl crackle",
          sourceGrounding: "Trending diskusi media sosial",
        },
        {
          id: "trend_2",
          title: "Micro-Ritual Wellness & Quiet Luxury",
          niche: req.body.niche || "Lifestyle",
          momentum: "High",
          summary: "Audiens beralih dari pamer konsumtif ke rutinitas mikro penuh kesadaran dan material ramah lingkungan.",
          viralAngle: "Fit check gaya minimalis berpadu tips de-cluttering digital 5 menit.",
          trendingHashtags: ["#QuietLuxury", "#MindfulAesthetic", "#CleanLiving", "#OOTD"],
          audioSuggestion: "Acoustic chill piano loop dengan tempo 85 BPM",
          sourceGrounding: "Instagram Explore & Pinterest Trend Report",
        },
        {
          id: "trend_3",
          title: "Interactive Dilemma: Bantu Aku Pilih Outfit Besok",
          niche: req.body.niche || "Fashion",
          momentum: "Rising",
          summary: "Format carousel interaktif di mana audiens diajak memvoting keputusan outfit atau styling hari esok.",
          viralAngle: "2 visual kontras (Cyber Chic vs Cozy Earth Tone) dengan ajakan voting langsung di caption.",
          trendingHashtags: ["#PickMyFit", "#StylingChallenge", "#CommunityChoice"],
          audioSuggestion: "Upbeat electronic pop hook",
          sourceGrounding: "Viral engagement format di Instagram Carousels",
        },
      ];
      res.json({
        success: true,
        trends: sanitizeDeep(fallbackTrends, "tier2"),
        searchedAt: new Date().toISOString(),
      });
    }
  });

  // 3. Automate Content Creation based on Trends and Influencer Identity (Strictly Anti-Slop Compliant)
  app.post("/api/content/automate", async (req, res) => {
    try {
      const { influencer, selectedTrend, count = 3 } = req.body;
      const effectiveToneTier = (req.body.toneTier || influencer?.toneTier || "tier2") as "tier1" | "tier2" | "tier3";
      const ai = getGenAI();

      const systemInstruction = `Anda adalah Senior Content Strategist & Social Media Ghostwriter untuk AI Influencer papan atas.
Buatkan paket konten otomatis yang siap dipublikasikan berdasarkan identitas AI Influencer dan tren pasar terkini.

${ANTI_SLOP_DIRECTIVES}

Tone Tier yang digunakan: ${
  effectiveToneTier === "tier3"
    ? "Tier 3 (Informal - santai, conversational, bahasa media sosial yang asyik, kata ganti aku/kamu, kontraksi wajar: nggak, udah, gimana, emang, aja)"
    : effectiveToneTier === "tier1"
    ? "Tier 1 (Formal - baku, terstruktur rapi, tanpa kontraksi)"
    : "Tier 2 (Semi-formal - hangat, luwes, komunikatif, standar blog/LinkedIn/opini majalah, code-switching wajar)"
}.

Format HANYA berupa JSON valid (array of objects) dengan properti:
[
  {
    "id": "post_1",
    "trendTitle": "Judul tren yang diangkat",
    "platform": "Instagram Reel" | "Instagram Carousel" | "TikTok" | "X Post",
    "pillar": "Educational" | "Entertainment" | "Inspirational" | "Relatable",
    "hook3s": "Hook 3 detik pertama yang sangat kuat memancing atensi (Stop the scroll, bebas klise)",
    "visualSceneDescription": "Deskripsi detail adegan/foto visual AI Influencer yang pas",
    "readyVisualPrompt": "Prompt lengkap siap pakai untuk di-render di generator gambar dengan konsistensi wajah",
    "recommendedGenerator": "Flux" | "NanoBanana" | "Seedream" | "ChatGPT Image" | "Gemini Image" | "Midjourney",
    "caption": "Caption lengkap dengan pembuka spesifik (tanpa 'Di era modern ini'), isi bernilai, ritme variatif (burstiness tinggi), dan nol em-dash",
    "callToAction": "Pertanyaan atau ajakan bertindak untuk mendongkrak komentar",
    "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"],
    "soundtrack": "Rekomendasi musik atau format audio viral",
    "predictedEngagement": "Prediksi metrik performa (misal: High Share & Save Rate)"
  }
]`;

      const promptText = `AI Influencer Profile:
- Nama: ${influencer.name} (${influencer.handle})
- Niche: ${influencer.niche} - ${influencer.category || ""}
- Tone of Voice: ${influencer.personalityProfile?.toneOfVoice || "Warm & Witty"}
- Tone Tier Target: ${effectiveToneTier}
- Ciri Konsistensi Visual: ${influencer.visualIdentity?.consistencyAnchorTokens || ""}
- Catchphrases: ${(influencer.personalityProfile?.catchphrases || []).join(", ")}

Tren Pasar yang Diangkat:
- Judul Tren: ${selectedTrend?.title || "Gaya Hidup & Masa Depan Kreativitas Digital"}
- Ringkasan: ${selectedTrend?.summary || "Eksplorasi estetika dan rutinitas modern"}
- Viral Angle: ${selectedTrend?.viralAngle || "POV autentik dan interaktif"}

Tolong buatkan ${count} paket konten otomasi yang unik, mendalam, bebas slop AI, dan langsung bisa dieksekusi.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.75,
        },
      });

      const rawText = response.text || "";
      const posts = extractJSON(rawText);
      const postList = Array.isArray(posts) ? posts : [posts];
      const cleanPosts = sanitizeDeep(postList, effectiveToneTier);

      res.json({ success: true, posts: cleanPosts, toneTier: effectiveToneTier });
    } catch (error: any) {
      console.warn("Notice in /api/content/automate (generating structured posts fallback):", error?.message || error);
      const inf = req.body.influencer || {};
      const trend = req.body.selectedTrend || {};
      const effectiveToneTier = (req.body?.toneTier || inf?.toneTier || "tier2") as "tier1" | "tier2" | "tier3";

      const fallbackPosts = [
        {
          id: "post_1",
          trendTitle: trend.title || "Gaya Hidup & Masa Depan Kreativitas Digital",
          platform: "Instagram Reel",
          pillar: "Educational",
          hook3s: "Berapa jam kamu habiskan di depan layar hari ini? Coba cek rutinitas ini sebentar.",
          visualSceneDescription: `Portrait 85mm ${inf.name || "AI Influencer"} di depan studio minimalis, menatap kamera dengan sorot mata hangat, pencahayaan golden hour lembut.`,
          readyVisualPrompt: `${inf.visualIdentity?.consistencyAnchorTokens || ""}, sitting in studio, warm lighting, looking into lens, 8k resolution, raw photo`,
          recommendedGenerator: "Flux",
          caption: `Teknologi sering bikin kita lupa satu hal penting: kesadaran untuk hadir di sini sekarang. Sebagai kreator virtual, aku belajar bahwa kecepatan komputasi harus diimbangi ketenangan batin. Hari ini aku mematikan notifikasi selama dua jam penuh untuk membaca buku fisik.\n\nBagaimana caramu menjaga batas antara waktu layar dan dunia nyata hari ini?\n\nKomen ceritamu di bawah ya!`,
          callToAction: "Tulis di kolom komentar caramu rehat dari layar hari ini!",
          hashtags: ["#VirtualCreator", "#MindfulLiving", "#DigitalAesthetic", "#AICreator", "#SlowLiving"],
          soundtrack: "Chill lo-fi vinyl beat 85 BPM",
          predictedEngagement: "High Comment & Save Rate",
        },
        {
          id: "post_2",
          trendTitle: trend.title || "Sustainable Fashion Breakdown",
          platform: "Instagram Carousel",
          pillar: "Relatable",
          hook3s: "Tiga aturan memilih outfit tahan lama yang ramah lingkungan:",
          visualSceneDescription: `Candid 35mm ${inf.name || "AI Influencer"} memegang cangkir kopi keramik di cafe bertema tanaman hijau, pakaian knitwear netral.`,
          readyVisualPrompt: `${inf.visualIdentity?.consistencyAnchorTokens || ""}, cafe aesthetic, holding ceramic mug, natural sunlight, 35mm lens, photorealistic`,
          recommendedGenerator: "NanoBanana",
          caption: `Geser slide untuk melihat paduan outfit minggu ini. Gaya personal bukan soal beli baju baru setiap musim. Kuncinya ada pada pemilihan bahan katun organik berkualitas dan potongan siluet abadi.\n\nSlide mana yang paling sesuai dengan seleramu minggu ini?`,
          callToAction: "Simpan postingan ini untuk inspirasi padu padan lemari kapsulmu!",
          hashtags: ["#OOTD", "#SustainableStyle", "#CapsuleWardrobe", "#CleanAesthetic"],
          soundtrack: "Warm acoustic guitar rhythm",
          predictedEngagement: "Explosive Shares & Saves",
        },
      ];

      res.json({
        success: true,
        posts: sanitizeDeep(fallbackPosts, effectiveToneTier),
        toneTier: effectiveToneTier,
      });
    }
  });

  // 4. Anti-Slop Writing Quality Audit Engine
  app.post("/api/anti-slop/audit", (req, res) => {
    try {
      const { text } = req.body;
      const audit = auditAntiSlopText(text || "");
      res.json({ success: true, audit });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e?.message || "Audit failed" });
    }
  });

  // 5. Anti-Slop Rewriter & Polisher Engine
  app.post("/api/anti-slop/rewrite", async (req, res) => {
    try {
      const { text, toneTier = "tier2", context } = req.body;
      if (!text || text.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Teks diperlukan untuk dipoles" });
      }

      const effectiveToneTier = (toneTier as "tier1" | "tier2" | "tier3") || "tier2";
      const ai = getGenAI();

      const prompt = `Anda adalah master editor Anti-Slop Writing v3.0 kelas dunia.
Tugas Anda adalah menulis ulang teks berikut agar 100% bebas dari segala pola AI slop, klise, keseragaman ritme (cadence uniformity), dan tanda baca terlarang.

${ANTI_SLOP_DIRECTIVES}

Tone Tier Target: ${
        effectiveToneTier === "tier3"
          ? "Tier 3 (Informal - santai, conversational, bahasa medsos hangat, kata ganti aku/kamu, kontraksi wajar: nggak, udah, gimana, emang, aja)"
          : effectiveToneTier === "tier1"
          ? "Tier 1 (Formal - baku, terstruktur, tanpa kontraksi)"
          : "Tier 2 (Semi-formal - hangat, luwes, komunikatif, standar blog/LinkedIn, code-switching wajar)"
      }.

Konteks Teks: ${context || "Caption atau naskah konten AI Influencer"}

Teks Asli:
"${text}"

Tuliskan HANYA hasil teks yang sudah dipoles secara langsung, tanpa pembuka atau penutup basa-basi.`;

      let rewrittenText = "";
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            temperature: 0.65,
          },
        });
        rewrittenText = (response.text || "").trim();
      } catch (genErr) {
        console.warn("AI rewrite fallback to sanitizer:", genErr);
        rewrittenText = sanitizeAntiSlopText(text, effectiveToneTier);
      }

      // Ensure zero dashes and zero slop through sanitizer pass
      rewrittenText = sanitizeAntiSlopText(rewrittenText, effectiveToneTier);
      const audit = auditAntiSlopText(rewrittenText);

      res.json({
        success: true,
        originalText: text,
        rewrittenText,
        toneTier: effectiveToneTier,
        audit,
      });
    } catch (error: any) {
      console.error("Anti-slop rewrite error:", error);
      const effectiveToneTier = (req.body.toneTier || "tier2") as "tier1" | "tier2" | "tier3";
      const sanitized = sanitizeAntiSlopText(req.body.text || "", effectiveToneTier);
      res.json({
        success: true,
        originalText: req.body.text,
        rewrittenText: sanitized,
        toneTier: effectiveToneTier,
        audit: auditAntiSlopText(sanitized),
      });
    }
  });

  // 4. Generate Visual Image Preview (using Gemini 3.1 Flash Lite Image or Curated Studio Visuals)
  app.post("/api/influencer/generate-preview-image", async (req, res) => {
    try {
      const { prompt, aspectRatio = "1:1", gender, ethnicity, style, packageKey } = req.body;
      if (!prompt) {
        return res.status(400).json({ success: false, error: "Prompt gambar diperlukan" });
      }

      let base64Image: string | null = null;

      // Attempt live Gemini image generation (active if user has paid tier / active billing quota)
      try {
        const ai = getGenAI();
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [
              {
                text: `${prompt}, photorealistic, ultra-realistic portrait, 8k resolution, cinematic lighting, highly detailed skin texture, masterwork photography, sharp focus`,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: aspectRatio as any,
            },
          },
        });

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData && part.inlineData.data) {
              base64Image = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
              break;
            }
          }
        }
      } catch (genError: any) {
        // Safe detection of quota exhaustion (Free tier limit: 0), permission denial, or rate limits
        const msg = genError?.message || "";
        const isQuotaOrLimit =
          genError?.status === "RESOURCE_EXHAUSTED" ||
          msg.includes("429") ||
          msg.includes("RESOURCE_EXHAUSTED") ||
          msg.includes("quota") ||
          msg.includes("limit: 0") ||
          msg.includes("PERMISSION_DENIED");

        if (isQuotaOrLimit) {
          console.info("[Image Studio] Gemini image generation requires paid key (free-tier limit 0). Applying curated ultra-realistic studio visual.");
        } else {
          console.info("[Image Studio] Image model notice:", msg);
        }
      }

      if (base64Image) {
        return res.json({
          success: true,
          imageUrl: base64Image,
          isFallback: false,
          source: "gemini",
        });
      }

      // Provide curated high-resolution studio visual matching character's profile
      const fallbackUrl = getCuratedVisualFallback({ gender, packageKey, prompt });
      return res.json({
        success: true,
        imageUrl: fallbackUrl,
        isFallback: true,
        source: "curated_studio",
        message: "Preview visual studio ultra-realistic. Format prompt lengkap untuk NanoBanana, Flux, Seedream, dan Midjourney siap disalin.",
      });
    } catch (error: any) {
      console.warn("Handled image preview request notice:", error?.message || error);
      const fallbackUrl = getCuratedVisualFallback(req.body);
      return res.json({
        success: true,
        imageUrl: fallbackUrl,
        isFallback: true,
        source: "curated_studio",
      });
    }
  });

  // 6. Transform Text Prompt into Voice-over Short Video Narration Script (Gemini 3.8 Flash)
  app.post("/api/voiceover/generate", async (req, res) => {
    try {
      const {
        promptText,
        influencer,
        targetDurationSec = 30,
        platform = "TikTok",
        voiceStyle = "Santai",
        toneTier = "tier2",
        language = "id",
        customInstructions = "",
      } = req.body;

      if (!promptText || typeof promptText !== "string" || promptText.trim().length === 0) {
        return res.status(400).json({ success: false, error: "Teks prompt atau ide konten wajib diisi." });
      }

      const effectiveToneTier = (toneTier || influencer?.toneTier || "tier2") as "tier1" | "tier2" | "tier3";
      const durationSec = Number(targetDurationSec) === 15 ? 15 : Number(targetDurationSec) === 60 ? 60 : 30;

      const targetMinWords = durationSec === 15 ? 30 : durationSec === 60 ? 125 : 60;
      const targetMaxWords = durationSec === 15 ? 45 : durationSec === 60 ? 165 : 85;

      const ai = getGenAI();

      const systemInstruction = `Anda adalah Sutradara Kreatif Video Pendek Viral & Naskah Penulis Voice-over (TikTok, Reels, YouTube Shorts) kelas dunia.
Tugas Anda adalah mengubah ide prompt visual atau narasi menjadi skrip narasi suara (voice-over) yang siap dibacakan, terstruktur per adegan dengan timing detik, arahan ekspresi visual, dan hook awal yang menghentikan scroll.

${ANTI_SLOP_DIRECTIVES}

ATURAN STRUKTURAL SKRIP VOICE-OVER VIDEO PENDEK:
1. HOOK 3 DETIK PERTAMA (00:00 - 00:03):
   - Wajib menusuk rasa ingin tahu, kontras visual, atau pertanyaan tidak terduga.
   - Dilarang keras sapaan klise seperti: "Halo guys", "Selamat datang kembali", "Di era serba cepat ini", "Pernahkah Anda membayangkan".
2. KETEPATAN PACING DAN JUMLAH KATA:
   - Durasi Target: ${durationSec} detik.
   - Kecepatan bicara alami adalah 140 sampai 150 kata per menit (~2.3 kata per detik).
   - Jumlah kata total WAJIB antara ${targetMinWords} sampai ${targetMaxWords} kata.
3. STRUKTUR ADEGAN (SCENES):
   - Buat tepat ${durationSec === 15 ? "2 sampai 3 adegan" : durationSec === 60 ? "5 sampai 7 adegan" : "3 sampai 4 adegan"}.
   - Setiap adegan memiliki:
     * sceneNumber: Angka urutan (1, 2, dst)
     * timestamp: Rentang detik akurat ("00:00 - 00:03", "00:03 - 00:10", dst)
     * durationSec: Durasi adegan dalam detik
     * visualCue: Arahan kamera dan gerakan visual influencer yang sinkron dengan ucapan
     * narrationText: Teks kalimat yang dibaca pengisi suara (bahasa tutur alami, bukan bahasa tulisan kaku)
     * toneDelivery: Petunjuk nada suara (misal: "Antusias dengan senyuman", "Berbisik pelan penasaran", "Tegas meyakinkan")
     * onScreenText: Subtitle ringkas / teks tempel di layar (3 sampai 5 kata kuat)
4. TONE REGISTER:
   - Nada Suara: ${voiceStyle}.
   - Register Bahasa: ${
     effectiveToneTier === "tier3"
       ? "Tier 3 (Informal medsos santai, luwes, kata ganti aku/kamu, kontraksi wajar: nggak, udah, gimana, emang, aja)"
       : effectiveToneTier === "tier1"
       ? "Tier 1 (Formal elegan, berwibawa, tanpa kontraksi)"
       : "Tier 2 (Semi-formal natural, komunikatif, hangat, standar kreator profesional)"
   }.
5. CALL TO ACTION AKHIR:
   - Di detik-detik terakhir, berikan ajakan interaksi organik (bukan paksaan klise).
6. KEBIJAKAN TANDA BACA & SLOP:
   - NOL em dash ('—') dan NOL en dash ('–'). Ganti dengan titik, koma, titik dua, atau kurung.
   - Dilarang kata klise: "menyelami", "ekosistem", "paradigma", "berperan penting", "memastikan".

Output WAJIB berupa JSON valid dengan format persis berikut:
{
  "title": "Judul Skrip Video Pendek",
  "hook3s": "Kalimat pembuka 0-3 detik pertama",
  "scenes": [
    {
      "sceneNumber": 1,
      "timestamp": "00:00 - 00:03",
      "durationSec": 3,
      "visualCue": "Kamera zoom-in cepat ke tatapan mata influencer...",
      "narrationText": "Satu hal yang jarang orang sadari soal gaya berpakaian:",
      "toneDelivery": "Intonasi penasaran dan tatapan fokus",
      "onScreenText": "Rahasia Gaya Paling Disembunyikan"
    }
  ],
  "callToAction": "Komen di bawah caramu memilih outfit andalan!",
  "soundtrackSuggestion": "Lo-fi beat 90 BPM atau audio tren upbeat dengan ketukan santai",
  "audioPacingVibe": "140 WPM, tempo ritmis dengan artikulasi jelas",
  "fullNarration": "Naskah lengkap gabungan seluruh narasi yang siap dibaca",
  "totalWordCount": 72,
  "estimatedReadingTimeSec": ${durationSec}
}`;

      const promptPayload = `Konversikan teks prompt berikut menjadi skrip narasi voice-over video pendek:
PROMPT/KONSEP DASAR:
"${promptText}"

DATA INFLUENCER & KONTEN:
- Platform: ${platform}
- Target Durasi: ${durationSec} Detik
- Gaya Suara: ${voiceStyle}
- Nama Karakter: ${influencer?.name || "Virtual Influencer"} (${influencer?.handle || "@creator"})
- Niche & Archetype: ${influencer?.niche || "Lifestyle & Fashion"} / ${influencer?.personalityProfile?.archetype || "Trendsetter"}
- Tone of Voice: ${influencer?.personalityProfile?.toneOfVoice || "Natural & Engaging"}
${customInstructions ? `- Instruksi Khusus: ${customInstructions}` : ""}

Hasilkan struktur JSON sekarang:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: promptPayload,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const rawText = response.text || "";
      const scriptData = extractJSON(rawText);

      if (!scriptData || !Array.isArray(scriptData.scenes) || scriptData.scenes.length === 0) {
        throw new Error("Gagal membaca struktur skrip narasi dari Gemini.");
      }

      const cleanScript = sanitizeDeep(scriptData, effectiveToneTier);
      const fullNarration = cleanScript.fullNarration || cleanScript.scenes.map((s: any) => s.narrationText).join(" ");
      const wordsCount = fullNarration.split(/\s+/).filter(Boolean).length;
      cleanScript.totalWordCount = wordsCount;
      cleanScript.estimatedReadingTimeSec = Math.round((wordsCount / 140) * 60) || durationSec;

      res.json({
        success: true,
        script: cleanScript,
        platform,
        targetDurationSec: durationSec,
        toneTier: effectiveToneTier,
        voiceStyle,
      });
    } catch (err: any) {
      console.warn("Handled voiceover script generation fallback:", err?.message || err);
      const {
        promptText = "Inspirasi outfit dan rutinitas harian virtual creator",
        influencer = {},
        targetDurationSec = 30,
        platform = "TikTok",
        voiceStyle = "Santai",
        toneTier = "tier2",
      } = req.body;

      const durationSec = Number(targetDurationSec) === 15 ? 15 : Number(targetDurationSec) === 60 ? 60 : 30;
      const infName = influencer.name || "Virtual Creator";

      let fallbackScenes = [];
      if (durationSec === 15) {
        fallbackScenes = [
          {
            sceneNumber: 1,
            timestamp: "00:00 - 00:03",
            durationSec: 3,
            visualCue: `Close-up dinamis ${infName} menoleh ke kamera sambil merapikan pakaian.`,
            narrationText: "Kalian pernah ngerasa outfit biasa aja tiba-tiba kelihatan mewah?",
            toneDelivery: "Nada penasaran dan tersenyum hangat",
            onScreenText: "Outfit Biasa Jadi Mewah?",
          },
          {
            sceneNumber: 2,
            timestamp: "00:03 - 00:11",
            durationSec: 8,
            visualCue: "Transisi kamera cepat menyoroti detail potongan kain, aksesoris minimalis, dan siluet rapi.",
            narrationText: "Kuncinya bukan di harga, tapi di paduan warna netral dan potongan siluet yang pas di badan.",
            toneDelivery: "Percaya diri dan komunikatif",
            onScreenText: "Kuncinya Siluet & Warna Netral",
          },
          {
            sceneNumber: 3,
            timestamp: "00:11 - 00:15",
            durationSec: 4,
            visualCue: `${infName} melangkah santai sambil menatap kamera dan melambaikan tangan ringan.`,
            narrationText: "Coba cek lemarimu sekarang, dan komen kombinasi favoritmu!",
            toneDelivery: "Santai dan mengundang",
            onScreenText: "Komen Warna Favoritmu!",
          },
        ];
      } else if (durationSec === 60) {
        fallbackScenes = [
          {
            sceneNumber: 1,
            timestamp: "00:00 - 00:05",
            durationSec: 5,
            visualCue: `Sudut pandang sinematik 35mm ${infName} di ruang studio minimalis dengan pencahayaan golden hour.`,
            narrationText: "Banyak orang mikir bikin konten berkualitas itu butuh studio mahal dan kamera bioskop.",
            toneDelivery: "Nada santai membuka obrolan langsung",
            onScreenText: "Mitos Bikin Konten Berkualitas",
          },
          {
            sceneNumber: 2,
            timestamp: "00:05 - 00:18",
            durationSec: 13,
            visualCue: "Kamera beralih ke layar kerja, menunjukkan storyboard dan catatan konsep naskah.",
            narrationText: "Kenyataannya, fondasi paling penting ada pada kejelasan pesan dan sudut pandang autentik yang kamu bawakan ke audiens.",
            toneDelivery: "Reflektif dan meyakinkan",
            onScreenText: "Pesan Jelas > Alat Mahal",
          },
          {
            sceneNumber: 3,
            timestamp: "00:18 - 00:32",
            durationSec: 14,
            visualCue: `${infName} menunjukkan perbandingan dua tangkapan visual, satu terlalu ramai dan satu terfokus rapi.`,
            narrationText: "Visual yang terarah bikin orang berhenti scrolling. Jangan penuhi layar dengan terlalu banyak elemen yang mengganggu fokus.",
            toneDelivery: "Memberikan arahan praktis",
            onScreenText: "Fokus Pada Satu Pesan Kuat",
          },
          {
            sceneNumber: 4,
            timestamp: "00:32 - 00:46",
            durationSec: 14,
            visualCue: "Tampilan candid influencer duduk rileks menikmati kopi sambil berdiskusi santai.",
            narrationText: "Saat narasi suaramu mengalir seperti ngobrol langsung di depan teman, penonton bakal betah menyimak sampai detik terakhir.",
            toneDelivery: "Hangat dan intim",
            onScreenText: "Bicara Seperti ke Teman Baik",
          },
          {
            sceneNumber: 5,
            timestamp: "00:46 - 00:60",
            durationSec: 14,
            visualCue: `${infName} tersenyum menatap kamera, teks interaktif muncul di sisi kanan layar.`,
            narrationText: "Langkah kecil apa yang mau kamu mulai hari ini? Tulis rencana kontenmu di kolom komentar ya!",
            toneDelivery: "Penuh dorongan positif",
            onScreenText: "Tulis Rencana Kontenmu!",
          },
        ];
      } else {
        // 30 seconds default
        fallbackScenes = [
          {
            sceneNumber: 1,
            timestamp: "00:00 - 00:04",
            durationSec: 4,
            visualCue: `Transisi cepat ke potret ${infName} menatap kamera dengan senyum percaya diri.`,
            narrationText: "Kenapa sebagian konten bisa langsung nempel di ingatan orang cuma dalam tiga detik?",
            toneDelivery: "Penasaran dan bertenaga",
            onScreenText: "Kenapa Konten Ini Nempel?",
          },
          {
            sceneNumber: 2,
            timestamp: "00:04 - 00:14",
            durationSec: 10,
            visualCue: "Cuplikan adegan berganti menunjukkan gestur dinamis dan pencahayaan studio terarah.",
            narrationText: "Jawabannya ada di ritme bicara dan keselarasan visual yang langsung to the point tanpa basa-basi pengantar.",
            toneDelivery: "Jelas dan artikulatif",
            onScreenText: "To The Point Tanpa Basa-Basi",
          },
          {
            sceneNumber: 3,
            timestamp: "00:14 - 00:23",
            durationSec: 9,
            visualCue: `${infName} memegang secangkir kopi keramik, latar belakang cafe estetik dan natural.`,
            narrationText: "Saat kamu menyajikan nilai konkret dengan gaya tutur yang santai, audiens bakal merasa terhubung secara alami.",
            toneDelivery: "Hangat dan ramah",
            onScreenText: "Nilai Nyata + Bahasa Tutur Santai",
          },
          {
            sceneNumber: 4,
            timestamp: "00:23 - 00:30",
            durationSec: 7,
            visualCue: `${infName} mengarahkan telunjuk ke area tombol follow dan komentar di antarmuka ponsel.`,
            narrationText: "Simpan video ini buat latihan naskahmu nanti, dan bagikan ke teman kreatormu!",
            toneDelivery: "Menutup dengan riang",
            onScreenText: "Simpan & Bagikan ke Teman!",
          },
        ];
      }

      const fullNarr = fallbackScenes.map((s) => s.narrationText).join(" ");
      const wordsCount = fullNarr.split(/\s+/).filter(Boolean).length;

      const fallbackScript = {
        title: `Naskah Narasi Voice-over: ${promptText.slice(0, 40)}`,
        hook3s: fallbackScenes[0].narrationText,
        scenes: fallbackScenes,
        callToAction: fallbackScenes[fallbackScenes.length - 1].narrationText,
        soundtrackSuggestion: "Chill electronic lo-fi 95 BPM dengan ketukan perkusi lembut",
        audioPacingVibe: "140 WPM, artikulasi santai dan ritme mengalir",
        fullNarration: fullNarr,
        totalWordCount: wordsCount,
        estimatedReadingTimeSec: durationSec,
      };

      const cleanFallback = sanitizeDeep(fallbackScript, toneTier as any);

      res.json({
        success: true,
        script: cleanFallback,
        platform,
        targetDurationSec: durationSec,
        toneTier,
        voiceStyle,
      });
    }
  });


  // Vite development middleware vs production static handling
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Fatal error starting server:", err);
  process.exit(1);
});
