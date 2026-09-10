import React, { useState } from "react";
import {
  Sparkles,
  User,
  Brain,
  Layers,
  Users,
  Shirt,
  Eye,
  Camera,
  Video,
  Share2,
  Target,
  RefreshCw,
  Wand2,
  Check,
  Zap,
  RotateCcw,
  Sliders,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CharacterCreationData } from "../types";

interface CharacterStudioFormProps {
  onGenerate: (data: CharacterCreationData) => Promise<void>;
  isLoading: boolean;
  onSelectTab?: (tab: "identity" | "personality" | "prompts" | "trends" | "studio") => void;
}

const PRESET_CHARACTERS: { name: string; tag: string; data: CharacterCreationData }[] = [
  {
    name: "Maya Danastri",
    tag: "Fashion Sustainable & Lifestyle (Jakarta)",
    data: {
      nama: "Maya Danastri",
      handle: "@maya.danastri",
      usia: "23",
      gender: "Perempuan",
      etnisitas: "Indonesia (Mixed Jawa-Sunda modern)",
      lokasiBasis: "Jakarta Selatan & Canggu, Bali",
      bahasaUtama: "Bahasa Indonesia (Santai & Artikulatif)",
      bahasaSekunder: "English (Fluent)",
      arketipe: "The Trendsetter (Pelopor Tren)",
      mbti: "ENFJ - The Protagonist",
      toneOfVoice: "Hangat, cerdas, mindful, witty, dan relatable dengan sentuhan empowerment",
      nilaiUtama: "Otentisitas di era digital, sustainable fashion, mindful living, dan apresiasi kriya lokal",
      hobi: "Specialty coffee brewing, analog 35mm film photography, pilates reformer, vinyl listening",
      ciriKhasCatchphrase: "Mindful in a hyperconnected world | Less waste, more presence | Tenun meets future",
      nicheKonten: "Fashion & Mindful Lifestyle",
      subNiche: "Sustainable Fashion & Slow Living Modern",
      targetAudiensUsia: "18 - 32 tahun (Gen Z & Young Millennials)",
      targetAudiensMinat: "Pecinta mode estetik, slow-living, specialty cafe, fashion editorial, dan conscious consumerism",
      wilayahAudiens: "Jabodetabek, Bandung, Bali, Surabaya, dan regional Asia Tenggara",
      gayaFashion: "Clean Minimalist Chic",
      fashionItemsKhas: "Structured neutral blazers, raw linen trousers, vintage silver wristwatch, minimalist leather tote bag",
      bentukWajah: "Oval simetris dengan rahang lembut terdefinisi dan tulang pipi proporsional",
      mata: "Hazel almond-shaped eyes dengan sorot mata hangat, cerdas, dan ekspresif",
      rambut: "Dark espresso brown, textured wavy bob sebahu dengan curtain bangs halus",
      tipeTubuh: "Slim athletic toned posture, tinggi 169 cm",
      keunikanFisik: "Tahi lalat halus tepat di bawah mata kiri, tekstur kulit natural dengan subtle glow",
      gayaVisual: "Cinematic 35mm Analog Film",
      preferensiLighting: "Cinematic Rembrandt studio lighting & warm golden hour flares streaming through windows",
      paletWarnaVisual: "Warm earthy neutrals (#E6DFD5), charcoal black (#1A1A1A), warm terracotta, subtle gold",
      jenisKonten: [
        "OOTD & Fashion Breakdown",
        "3-Second Transition Reels / TikTok POV",
        "Carousel Edukatif & Slow Fashion Guide",
        "Get Ready With Me (GRWM) / Daily POV",
        "Interactive Q&A & Story Polls",
      ],
      platformUtama: ["Instagram", "TikTok", "YouTube Shorts"],
      tujuanAI: "Kolaborasi brand fashion sustainable & luxury skincare, serta membangun komunitas sadar mode",
      catatanTambahan: "Tampilkan tekstur visual mikro kulit asli dan serat kain katun/linen secara otentik tanpa efek plastik.",
      toneTier: "tier2",
    },
  },
  {
    name: "Kenzo Arisawa",
    tag: "AI Tech & Hardware Futurist (Tokyo-Jakarta)",
    data: {
      nama: "Kenzo Arisawa",
      handle: "@kenzo.futurist",
      usia: "25",
      gender: "Laki-laki",
      etnisitas: "Campuran Indonesia-Jepang (Hapa)",
      lokasiBasis: "Shibuya, Tokyo & SCBD, Jakarta",
      bahasaUtama: "Bahasa Indonesia & Japanese",
      bahasaSekunder: "English (Tech Industry Standard)",
      arketipe: "The Visionary (Inovator Masa Depan)",
      mbti: "INTJ - The Architect",
      toneOfVoice: "Tech-savvy, analitis, tenang, tajam, visioner namun santai tanpa jargon berlebih",
      nilaiUtama: "Demokratisasi AI, hardware inovatif, ergonomi masa depan, open-source knowledge",
      hobi: "Custom mechanical keyboard tinkering, cyberpunk night walks, sim racing, espresso pulling",
      ciriKhasCatchphrase: "Hardware is the new canvas | Automate the mundane, amplify the human",
      nicheKonten: "AI, Hardware & Future Gadgets",
      subNiche: "Spatial Computing, AI Wearables & Consumer Robotics",
      targetAudiensUsia: "20 - 38 tahun (Techies, Designers, Developers, Early Adopters)",
      targetAudiensMinat: "Gadget flagship, AI agents, clean desk setups, cyberpunk aesthetic, smart home",
      wilayahAudiens: "Indonesia, Jepang, Singapura, dan audiens global tech enthusiast",
      gayaFashion: "Cyberpunk Techwear & Minimalist Dark Mode",
      fashionItemsKhas: "Matte black waterproof modular jacket, titanium smart ring, technical cargo pants, minimal high-top sneakers",
      bentukWajah: "Angular sharp jawline, high cheekbones, tatapan mata fokus dan percaya diri",
      mata: "Deep dark monolid eyes dengan tatapan intens dan tajam",
      rambut: "Jet black modern two-block wolf cut dengan tekstur sedikit messy",
      tipeTubuh: "Lean athletic build, tinggi 178 cm",
      keunikanFisik: "Garis alis tebal tegas, goresan tipis bekas kacamata AR di pangkal hidung",
      gayaVisual: "Moody Neon Cyberpunk Dual-Tone",
      preferensiLighting: "Dual-tone neon cyan (#00F5D4) dan amber gold backlight, dark high-contrast moody environment",
      paletWarnaVisual: "Obsidian black (#0D0D11), cyber cyan (#00F5D4), neon amber, dark slate",
      jenisKonten: [
        "Product Review & Unboxing Hardware",
        "3-Second Transition Reels / TikTok POV",
        "Carousel Edukatif & Review Produk",
        "Cinematic Photo Stills & Desk Setups",
      ],
      platformUtama: ["YouTube Shorts", "Instagram", "X / Twitter"],
      tujuanAI: "Menjadi tech reviewer AI terpercaya nomor 1 di Asia Tenggara dan brand ambassador gadget mutakhir",
      catatanTambahan: "Pencahayaan harus memiliki kontras tinggi sinematik dengan bayangan dramatis pada gadget dan wajah.",
      toneTier: "tier2",
    },
  },
  {
    name: "Alya Santoso",
    tag: "Wellness, Biohacking & Longevity (Bali)",
    data: {
      nama: "Alya Santoso",
      handle: "@alya.wellness",
      usia: "26",
      gender: "Perempuan",
      etnisitas: "Indonesia (Bali & Jawa)",
      lokasiBasis: "Ubud & Canggu, Bali",
      bahasaUtama: "Bahasa Indonesia & English",
      bahasaSekunder: "French (Conversational)",
      arketipe: "The Sage / Mindful Healer",
      mbti: "INFJ - The Advocate",
      toneOfVoice: "Menenangkan, ilmiah, berempati, grounded, inspiratif, dan bebas toxic positivity",
      nilaiUtama: "Holistic longevity, mindful circadian rhythms, clean organic nutrition, inner peace",
      hobi: "Ice bathing, sunrise breathwork, sound healing meditation, organic gardening, pottery",
      ciriKhasCatchphrase: "Your nervous system is your superpower | Align with the sun",
      nicheKonten: "Wellness & Biohacking",
      subNiche: "Circadian Optimization & Holistic Longevity",
      targetAudiensUsia: "22 - 40 tahun (Health-conscious individuals, urban professionals)",
      targetAudiensMinat: "Kebugaran holistik, skincare herbal, meditasi, cold plunge, nutrisi bersih",
      wilayahAudiens: "Indonesia, Australia, dan komunitas nomad global",
      gayaFashion: "Quiet Luxury & Resort Bohemian",
      fashionItemsKhas: "Pure unbleached organic linen wrap dress, woven straw visor, raw crystal pendant",
      bentukWajah: "Wajah lembut bersinar alami (dewy sun-kissed), senyum teduh",
      mata: "Warm brown doe eyes dengan kerutan tawa halus yang ramah",
      rambut: "Sun-kissed honey brown hair, long wavy texture naturally air-dried",
      tipeTubuh: "Toned yoga practitioner build, fleksibel, tinggi 167 cm",
      keunikanFisik: "Subtle sun freckles di jembatan hidung dan kedua pipi",
      gayaVisual: "Warm Golden Hour & Sunlight Flares",
      preferensiLighting: "Natural morning golden hour backlight with soft atmospheric diffusion",
      paletWarnaVisual: "Sage green, warm terracotta, oatmeal linen, sand gold",
      jenisKonten: [
        "Get Ready With Me (GRWM) / Daily POV",
        "Carousel Edukatif & Health Protocols",
        "Tips, Tutorial & Mindful Practices",
        "Cinematic Photo Stills & Nature Feeds",
      ],
      platformUtama: ["Instagram", "TikTok", "YouTube Shorts"],
      tujuanAI: "Edukasi kesehatan holistik, mempromosikan clean wellness brands, dan memandu gaya hidup seimbang",
      catatanTambahan: "Nuansa visual harus memancarkan cahaya tropis hangat yang menenangkan dan organik.",
      toneTier: "tier3",
    },
  },
];

const NICHES = [
  "Fashion & Mindful Lifestyle",
  "AI, Hardware & Future Gadgets",
  "Beauty, Skincare & Dermatics",
  "Wellness, Longevity & Biohacking",
  "Luxury Travel & Hospitality",
  "Gaming, Esports & Virtual Idol",
  "Specialty Coffee & Culinary Review",
  "Personal Finance, Investing & Web3",
  "Sustainable Living & Eco-Innovation",
];

const ARCHETYPES = [
  "The Trendsetter (Pelopor Tren)",
  "The Visionary (Inovator Masa Depan)",
  "The Creator (Artistik & Otentik)",
  "The Sage (Cerdas, Analitis & Bijak)",
  "The Rebel (Berani, Provokatif & Avant-Garde)",
  "The Caregiver (Hangat, Empatik & Memberdayakan)",
  "The Explorer (Petualang & Bebas)",
  "The Magnetic / Siren (Penuh Pesona & Elegan)",
];

const FASHION_STYLES = [
  "Clean Minimalist Chic",
  "Cyberpunk Techwear & Futuristic",
  "Quiet Luxury & Old Money Aesthetic",
  "Y2K Streetwear & Retro Grunge",
  "Korean Ulzzang Street Chic",
  "Avant-Garde & High-Fashion Sculpture",
  "Casual Bohemian & Resort Linen",
  "Athleisure & High-Performance Sportswear",
];

const VISUAL_STYLES = [
  "Cinematic 35mm Analog Film",
  "Ultra-Realistic 8K Commercial Studio",
  "Moody Neon Cyberpunk Dual-Tone",
  "Warm Golden Hour & Sunlight Flares",
  "Editorial High-Fashion Magazine Cover",
  "Raw Candid Street Photography",
];

const ALL_CONTENT_TYPES = [
  "OOTD & Fashion Breakdown",
  "3-Second Transition Reels / TikTok POV",
  "Carousel Edukatif & Review Produk",
  "Get Ready With Me (GRWM) / Daily POV",
  "Cinematic Photo Stills & Editorial Feed",
  "Interactive Q&A & Story Polls",
  "Product Review & Unboxing Hardware",
  "Tips, Tutorial & Mindful Practices",
];

const ALL_PLATFORMS = [
  { name: "Instagram", desc: "Reels, Carousels, Stories" },
  { name: "TikTok", desc: "Short video, viral audio" },
  { name: "YouTube Shorts", desc: "Cinematic vertical videos" },
  { name: "X / Twitter", desc: "Threads, witty commentary" },
  { name: "Threads", desc: "Micro-blogging & daily thoughts" },
];

export const CharacterStudioForm: React.FC<CharacterStudioFormProps> = ({
  onGenerate,
  isLoading,
}) => {
  const [formData, setFormData] = useState<CharacterCreationData>(PRESET_CHARACTERS[0].data);
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);

  const handleApplyPreset = (index: number) => {
    setSelectedPresetIndex(index);
    setFormData({ ...PRESET_CHARACTERS[index].data });
  };

  const handleToggleContentType = (type: string) => {
    setFormData((prev) => {
      const exists = prev.jenisKonten.includes(type);
      if (exists) {
        return {
          ...prev,
          jenisKonten: prev.jenisKonten.filter((t) => t !== type),
        };
      } else {
        return {
          ...prev,
          jenisKonten: [...prev.jenisKonten, type],
        };
      }
    });
  };

  const handleTogglePlatform = (platform: string) => {
    setFormData((prev) => {
      const exists = prev.platformUtama.includes(platform);
      if (exists) {
        if (prev.platformUtama.length === 1) return prev; // keep at least 1
        return {
          ...prev,
          platformUtama: prev.platformUtama.filter((p) => p !== platform),
        };
      } else {
        return {
          ...prev,
          platformUtama: [...prev.platformUtama, platform],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerate(formData);
  };

  return (
    <div id="character-studio-form-container" className="space-y-6">
      {/* Banner & Preset Selector */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-zinc-900 to-purple-950/40 p-6 shadow-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Wand2 className="h-4 w-4" />
              </div>
              <h2 className="text-xl font-bold text-white sm:text-2xl">
                Studio Konfigurasi Karakter AI
              </h2>
              <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                10 Parameter Lengkap
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-300">
              Lengkapi 10 data spesifikasi karakter di bawah ini, lalu klik tombol{" "}
              <strong className="text-indigo-300">"Generate AI Influencer"</strong> untuk menghasilkan
              dossier identitas, profil kepribadian, dan 3 paket prompt multi-generator siap pakai.
            </p>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center">
            <span className="text-xs font-semibold text-zinc-400">Pilih Preset Cepat:</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_CHARACTERS.map((preset, idx) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(idx)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all border ${
                    selectedPresetIndex === idx
                      ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-950/40"
                      : "bg-zinc-900/80 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: IDENTITAS DASAR */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/30">
              <User className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
                  Pilar 1
                </span>
                <h3 className="text-base font-bold text-white">Identitas Dasar</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Nama, handle resmi, usia, gender, etnisitas, domisili, dan bahasa komunikasi
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Nama */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Nama Lengkap Influencer:
              </label>
              <input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="Contoh: Maya Danastri"
                required
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Handle */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Handle Media Sosial:
              </label>
              <input
                type="text"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                placeholder="Contoh: @maya.danastri"
                required
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Usia */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Usia Karakter:
              </label>
              <input
                type="text"
                value={formData.usia}
                onChange={(e) => setFormData({ ...formData, usia: e.target.value })}
                placeholder="Contoh: 23"
                required
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Gender / Presentasi:
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
              >
                <option value="Perempuan">Perempuan</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Androgynous / Gender Fluid">Androgynous / Gender Fluid</option>
              </select>
            </div>

            {/* Etnisitas */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Etnisitas / Latar Kebangsaan:
              </label>
              <input
                type="text"
                value={formData.etnisitas}
                onChange={(e) => setFormData({ ...formData, etnisitas: e.target.value })}
                placeholder="Contoh: Mixed Indonesia-Korean / Jawa-Sunda"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Lokasi Basis */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Kota & Negara Basis:
              </label>
              <input
                type="text"
                value={formData.lokasiBasis}
                onChange={(e) => setFormData({ ...formData, lokasiBasis: e.target.value })}
                placeholder="Contoh: Jakarta & Bali, Indonesia"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Bahasa Utama */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Bahasa Komunikasi Utama:
              </label>
              <input
                type="text"
                value={formData.bahasaUtama}
                onChange={(e) => setFormData({ ...formData, bahasaUtama: e.target.value })}
                placeholder="Contoh: Bahasa Indonesia (Santai & Artikulatif)"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Bahasa Sekunder */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Bahasa Sekunder (Opsional):
              </label>
              <input
                type="text"
                value={formData.bahasaSekunder}
                onChange={(e) => setFormData({ ...formData, bahasaSekunder: e.target.value })}
                placeholder="Contoh: English (Fluent), Japanese (Conversational)"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: KEPRIBADIAN & BRAND SOUL */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4 mb-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <Brain className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                  Pilar 2
                </span>
                <h3 className="text-base font-bold text-white">Kepribadian & Brand Soul</h3>
              </div>
              <p className="text-xs text-zinc-400">
                Arketipe psikologis, MBTI, gaya bicara (tone of voice), nilai inti, hobi, dan slogan khas
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Archetype */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Arketipe Persona:
              </label>
              <select
                value={formData.arketipe}
                onChange={(e) => setFormData({ ...formData, arketipe: e.target.value })}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
              >
                {ARCHETYPES.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            {/* MBTI */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Tipe Kepribadian MBTI:
              </label>
              <input
                type="text"
                value={formData.mbti}
                onChange={(e) => setFormData({ ...formData, mbti: e.target.value })}
                placeholder="Contoh: ENFJ - The Protagonist / INTJ"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Tone of Voice */}
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Tone of Voice (Gaya Bicara):
              </label>
              <input
                type="text"
                value={formData.toneOfVoice}
                onChange={(e) => setFormData({ ...formData, toneOfVoice: e.target.value })}
                placeholder="Contoh: Hangat, witty, mindful, relatable, cerdas"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Nilai Utama */}
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Nilai-Nilai Inti (Core Values):
              </label>
              <input
                type="text"
                value={formData.nilaiUtama}
                onChange={(e) => setFormData({ ...formData, nilaiUtama: e.target.value })}
                placeholder="Contoh: Otentisitas digital, mindful aesthetics, sustainability"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Hobi */}
            <div>
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Hobi & Passion Points:
              </label>
              <input
                type="text"
                value={formData.hobi}
                onChange={(e) => setFormData({ ...formData, hobi: e.target.value })}
                placeholder="Contoh: Specialty coffee, 35mm film, pilates"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Signature Catchphrase */}
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-xs font-semibold text-zinc-300 block mb-1">
                Ciri Khas & Slogan / Catchphrases (Gunakan pembatas | untuk beberapa frase):
              </label>
              <input
                type="text"
                value={formData.ciriKhasCatchphrase}
                onChange={(e) => setFormData({ ...formData, ciriKhasCatchphrase: e.target.value })}
                placeholder="Contoh: Mindful in a hyperconnected world | Render your reality"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Anti-Slop Writing Tone Tier Selector */}
            <div className="sm:col-span-2 lg:col-span-3 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 text-[11px] font-bold">
                    ✓
                  </span>
                  <label className="text-xs font-bold text-indigo-200">
                    Register Bahasa & Standar Anti-Slop Writing v3.0:
                  </label>
                </div>
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full w-fit">
                  0 Em-Dash • Nol Klise AI • Bursty Cadence
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    tier: "tier1" as const,
                    title: "Tier 1: Formal",
                    desc: "Bahasa baku, terstruktur, resmi. Tanpa kontraksi. Cocok untuk korporat, fintech, & riset.",
                  },
                  {
                    tier: "tier2" as const,
                    title: "Tier 2: Semi-formal (Default)",
                    desc: "Hangat, komunikatif, luwes, standar blog & LinkedIn. Code-switching wajar & natural.",
                  },
                  {
                    tier: "tier3" as const,
                    title: "Tier 3: Informal / Medsos",
                    desc: "Bahasa obrolan akrab, kata ganti aku/kamu, kontraksi wajar (nggak, udah, gimana).",
                  },
                ].map((item) => (
                  <button
                    key={item.tier}
                    type="button"
                    onClick={() => setFormData({ ...formData, toneTier: item.tier })}
                    className={`text-left p-3 rounded-lg border transition-all ${
                      (formData.toneTier || "tier2") === item.tier
                        ? "border-indigo-400 bg-indigo-600/20 text-white shadow-sm ring-1 ring-indigo-400/50"
                        : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <div className="text-xs font-bold text-zinc-200 mb-1 flex items-center justify-between">
                      <span>{item.title}</span>
                      {(formData.toneTier || "tier2") === item.tier && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                      )}
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-400">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: NICHE KONTEN & SECTION 4: TARGET AUDIENS (2-Column Grid) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* SECTION 3: NICHE KONTEN */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
            <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Pilar 3
                  </span>
                  <h3 className="text-base font-bold text-white">Niche Konten</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Fokus industri utama dan sub-topik diferensiasi
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Kategori Niche Utama:
                </label>
                <select
                  value={formData.nicheKonten}
                  onChange={(e) => setFormData({ ...formData, nicheKonten: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                >
                  {NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Sub-Niche & Fokus Spesifik:
                </label>
                <input
                  type="text"
                  value={formData.subNiche}
                  onChange={(e) => setFormData({ ...formData, subNiche: e.target.value })}
                  placeholder="Contoh: Slow Fashion, Tenun Nusantara & Minimalist Wear"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: TARGET AUDIENS */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
            <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Pilar 4
                  </span>
                  <h3 className="text-base font-bold text-white">Target Audiens</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Demografi usia, minat psikografis, dan jangkauan wilayah
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Rentang Usia Audiens:
                </label>
                <input
                  type="text"
                  value={formData.targetAudiensUsia}
                  onChange={(e) => setFormData({ ...formData, targetAudiensUsia: e.target.value })}
                  placeholder="Contoh: 18 - 32 tahun (Gen Z & Young Millennials)"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Minat & Karakteristik Audiens:
                </label>
                <input
                  type="text"
                  value={formData.targetAudiensMinat}
                  onChange={(e) => setFormData({ ...formData, targetAudiensMinat: e.target.value })}
                  placeholder="Contoh: Pecinta mode estetik, gadget inovatif, self-growth"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Wilayah Geografis Target:
                </label>
                <input
                  type="text"
                  value={formData.wilayahAudiens}
                  onChange={(e) => setFormData({ ...formData, wilayahAudiens: e.target.value })}
                  placeholder="Contoh: Indonesia perkotaan & Asia Tenggara"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 5: GAYA FASHION & SECTION 6: PENAMPILAN FISIK */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* SECTION 5: GAYA FASHION */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
            <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-500/15 text-pink-400 border border-pink-500/30">
                <Shirt className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                    Pilar 5
                  </span>
                  <h3 className="text-base font-bold text-white">Gaya Fashion</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Estetika berbusana dan jenis pakaian/aksesori khas
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Arah Gaya Busana:
                </label>
                <select
                  value={formData.gayaFashion}
                  onChange={(e) => setFormData({ ...formData, gayaFashion: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                >
                  {FASHION_STYLES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Pakaian & Aksesori Khas (Signature Wardrobe):
                </label>
                <textarea
                  rows={3}
                  value={formData.fashionItemsKhas}
                  onChange={(e) => setFormData({ ...formData, fashionItemsKhas: e.target.value })}
                  placeholder="Contoh: Structured neutral blazers, raw linen trousers, vintage silver wristwatch, minimalist leather bag"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 6: PENAMPILAN FISIK */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
            <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                <Eye className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Pilar 6
                  </span>
                  <h3 className="text-base font-bold text-white">Penampilan Fisik & DNA Visual</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Ciri wajah, mata, rambut, tipe tubuh, dan tanda unik konsistensi LoRA
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Bentuk Wajah & Rahang:
                </label>
                <input
                  type="text"
                  value={formData.bentukWajah}
                  onChange={(e) => setFormData({ ...formData, bentukWajah: e.target.value })}
                  placeholder="Contoh: Oval simetris, rahang tegas lembut"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Mata & Sorot Tatapan:
                </label>
                <input
                  type="text"
                  value={formData.mata}
                  onChange={(e) => setFormData({ ...formData, mata: e.target.value })}
                  placeholder="Contoh: Hazel almond eyes, hangat & ekspresif"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Model & Warna Rambut:
                </label>
                <input
                  type="text"
                  value={formData.rambut}
                  onChange={(e) => setFormData({ ...formData, rambut: e.target.value })}
                  placeholder="Contoh: Dark espresso brown wavy bob sebahu"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Tipe Tubuh & Tinggi:
                </label>
                <input
                  type="text"
                  value={formData.tipeTubuh}
                  onChange={(e) => setFormData({ ...formData, tipeTubuh: e.target.value })}
                  placeholder="Contoh: Slim athletic, 169 cm"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Tanda Lahir / Keunikan Fisik (LoRA Consistency Lock):
                </label>
                <input
                  type="text"
                  value={formData.keunikanFisik}
                  onChange={(e) => setFormData({ ...formData, keunikanFisik: e.target.value })}
                  placeholder="Contoh: Tahi lalat halus di bawah mata kiri, dewy skin glow"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 7: GAYA VISUAL & SECTION 8: JENIS KONTEN */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* SECTION 7: GAYA VISUAL */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
            <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/30">
                <Camera className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
                    Pilar 7
                  </span>
                  <h3 className="text-base font-bold text-white">Gaya Visual & Fotografi</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Estetika render gambar, pencahayaan (lighting), dan palet warna visual
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Estetika Visual Utama:
                </label>
                <select
                  value={formData.gayaVisual}
                  onChange={(e) => setFormData({ ...formData, gayaVisual: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                >
                  {VISUAL_STYLES.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Preferensi Pencahayaan (Lighting):
                </label>
                <input
                  type="text"
                  value={formData.preferensiLighting}
                  onChange={(e) => setFormData({ ...formData, preferensiLighting: e.target.value })}
                  placeholder="Contoh: Rembrandt studio lighting & warm golden hour flares"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Vibe Palet Warna Visual:
                </label>
                <input
                  type="text"
                  value={formData.paletWarnaVisual}
                  onChange={(e) => setFormData({ ...formData, paletWarnaVisual: e.target.value })}
                  placeholder="Contoh: Warm earthy neutrals, charcoal black, terracotta, gold"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 8: JENIS KONTEN */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
            <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/15 text-rose-400 border border-rose-500/30">
                <Video className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Pilar 8
                  </span>
                  <h3 className="text-base font-bold text-white">Jenis Konten</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Pilih format konten yang akan rutin diproduksi (klik untuk memilih)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ALL_CONTENT_TYPES.map((type) => {
                const isSelected = formData.jenisKonten.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleToggleContentType(type)}
                    className={`flex items-center gap-2 rounded-xl p-2.5 text-left text-xs transition-all border ${
                      isSelected
                        ? "bg-rose-950/40 text-white border-rose-500/60 shadow-sm"
                        : "bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <div
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                        isSelected
                          ? "bg-rose-500 border-rose-400 text-white"
                          : "border-zinc-700 bg-zinc-900"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                    </div>
                    <span className="leading-tight">{type}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* SECTION 9: PLATFORM UTAMA & SECTION 10: TUJUAN AI INFLUENCER */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* SECTION 9: PLATFORM UTAMA */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
            <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/15 text-teal-400 border border-teal-500/30">
                <Share2 className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                    Pilar 9
                  </span>
                  <h3 className="text-base font-bold text-white">Platform Utama</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Saluran media sosial prioritas untuk distribusi konten
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ALL_PLATFORMS.map((plat) => {
                const isSelected = formData.platformUtama.includes(plat.name);
                return (
                  <button
                    key={plat.name}
                    type="button"
                    onClick={() => handleTogglePlatform(plat.name)}
                    className={`flex flex-col p-3 rounded-xl text-left transition-all border ${
                      isSelected
                        ? "bg-teal-950/40 border-teal-500 text-white shadow-md shadow-teal-950/20"
                        : "bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-100">{plat.name}</span>
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${
                          isSelected ? "bg-teal-500 text-black font-bold" : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {isSelected ? "✓" : "+"}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400 mt-1">{plat.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 10: TUJUAN AI INFLUENCER */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl">
            <div className="flex items-center gap-2.5 border-b border-zinc-800/80 pb-4 mb-5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                <Target className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                    Pilar 10
                  </span>
                  <h3 className="text-base font-bold text-white">Tujuan AI Influencer</h3>
                </div>
                <p className="text-xs text-zinc-400">
                  Objektif komersial, strategi monetisasi, dan arahan khusus
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Tujuan Utama & Monetisasi:
                </label>
                <input
                  type="text"
                  value={formData.tujuanAI}
                  onChange={(e) => setFormData({ ...formData, tujuanAI: e.target.value })}
                  placeholder="Contoh: Kolaborasi brand fashion & skincare premium, serta edukasi audiens"
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Catatan Tambahan / Visi Karakter Khusus (Opsional):
                </label>
                <textarea
                  rows={3}
                  value={formData.catatanTambahan || ""}
                  onChange={(e) => setFormData({ ...formData, catatanTambahan: e.target.value })}
                  placeholder="Instruksi ekstra untuk AI: misalnya 'fokuskan detail wajah mikro pada mata hazel dan pencahayaan studio yang tajam'..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 p-2.5 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR WITH BIG GENERATE BUTTON */}
        <div className="sticky bottom-4 z-40 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-indigo-500/30 bg-zinc-900/95 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Siap Mensintesis Karakter:{" "}
                <span className="text-indigo-400">{formData.nama || "Virtual Creator"}</span>
              </h4>
              <p className="text-xs text-zinc-400">
                10 parameter telah terisi • {formData.jenisKonten.length} format konten •{" "}
                {formData.platformUtama.join(", ")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleApplyPreset(0)}
              className="flex items-center gap-1 rounded-xl border border-zinc-700 bg-zinc-800/70 px-3 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Data</span>
            </button>

            <button
              id="btn-generate-ai-influencer"
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-950/60 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Sedang Mensintesis AI Influencer...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Generate AI Influencer Sekarang</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
