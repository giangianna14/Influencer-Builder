export interface Demographics {
  age: number | string;
  gender: string;
  ethnicity: string;
  primaryLanguage: string;
  secondaryLanguage?: string;
  baseLocation: string;
  targetAudience: string;
  educationOrOccupation: string;
}

export interface VisualIdentity {
  faceFeatures: string;
  hairStyle: string;
  bodyType: string;
  signatureStyle: string;
  colorPalette: string[];
  consistencyAnchorTokens: string;
}

export interface InteractionStrategy {
  captionHookStyle: string;
  dmResponseVibe: string;
  storyEngagementTechnique: string;
}

export interface BrandRules {
  idealSponsors: string[];
  forbiddenCategories: string[];
}

export interface PersonalityProfile {
  archetype: string;
  mbti: string;
  toneOfVoice: string;
  catchphrases: string[];
  coreValues: string[];
  hobbies: string[];
  backstory: string;
  interactionStrategy: InteractionStrategy;
  brandRules: BrandRules;
}

export interface GeneratorPrompts {
  nanoBanana: string;
  flux: string;
  seedream: {
    positive: string;
    negative: string;
    steps: number;
    cfg: number;
  };
  chatgptImage: string;
  geminiImage: string;
  midjourney: string;
}

export interface PromptPackageDetails {
  title: string;
  concept: string;
  cameraLens: string;
  lighting: string;
  setting: string;
  wardrobe: string;
  generatorPrompts: GeneratorPrompts;
  sampleImage?: string;
}

export interface PromptPackages {
  package1_portrait: PromptPackageDetails;
  package2_lifestyle: PromptPackageDetails;
  package3_brandEditorial: PromptPackageDetails;
}

export interface AIInfluencer {
  id: string;
  name: string;
  handle: string;
  tagline: string;
  avatarUrl?: string;
  niche: string;
  category: string;
  demographics: Demographics;
  visualIdentity: VisualIdentity;
  personalityProfile: PersonalityProfile;
  promptPackages: PromptPackages;
  createdAt?: string;
}

export interface RealtimeTrend {
  id: string;
  title: string;
  niche: string;
  momentum: "Explosive" | "High" | "Rising" | "Evergreen";
  summary: string;
  viralAngle: string;
  trendingHashtags: string[];
  audioSuggestion: string;
  sourceGrounding?: string;
}

export interface AutomatedContentPost {
  id: string;
  trendTitle: string;
  platform: "Instagram Reel" | "Instagram Carousel" | "TikTok" | "X Post" | "YouTube Short";
  pillar: "Educational" | "Entertainment" | "Inspirational" | "Relatable" | "Promotional";
  hook3s: string;
  visualSceneDescription: string;
  readyVisualPrompt: string;
  recommendedGenerator: string;
  caption: string;
  callToAction: string;
  hashtags: string[];
  soundtrack: string;
  predictedEngagement: string;
  generatedPreviewImage?: string;
}

export interface BuilderFormState {
  userPrompt: string;
  niche: string;
  archetype: string;
  gender: string;
  aesthetic: string;
  targetMarket: string;
  language: string;
}

export interface CharacterCreationData {
  // 1. Identitas Dasar
  nama: string;
  handle: string;
  usia: string | number;
  gender: string;
  etnisitas: string;
  lokasiBasis: string;
  bahasaUtama: string;
  bahasaSekunder: string;

  // 2. Kepribadian
  arketipe: string;
  mbti: string;
  toneOfVoice: string;
  nilaiUtama: string;
  hobi: string;
  ciriKhasCatchphrase: string;

  // 3. Niche Konten
  nicheKonten: string;
  subNiche: string;

  // 4. Target Audiens
  targetAudiensUsia: string;
  targetAudiensMinat: string;
  wilayahAudiens: string;

  // 5. Gaya Fashion
  gayaFashion: string;
  fashionItemsKhas: string;

  // 6. Penampilan Fisik
  bentukWajah: string;
  mata: string;
  rambut: string;
  tipeTubuh: string;
  keunikanFisik: string;

  // 7. Gaya Visual
  gayaVisual: string;
  preferensiLighting: string;
  paletWarnaVisual: string;

  // 8. Jenis Konten
  jenisKonten: string[];

  // 9. Platform Utama
  platformUtama: string[];

  // 10. Tujuan AI Influencer
  tujuanAI: string;
  catatanTambahan?: string;
}
