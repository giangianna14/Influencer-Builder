import React, { useState } from "react";
import {
  Sparkles,
  X,
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
  CheckCircle2,
  Sliders,
  RotateCcw,
} from "lucide-react";
import { CharacterCreationData } from "../types";

interface InfluencerBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuild: (params: CharacterCreationData) => Promise<void>;
  isLoading: boolean;
  onOpenFullStudio?: () => void;
}

const PRESET_CHARACTERS: { label: string; data: CharacterCreationData }[] = [
  {
    label: "Maya Danastri - Sustainable Fashion & Clean Living",
    data: {
      nama: "Maya Danastri",
      handle: "@maya.danastri",
      usia: "23",
      gender: "Perempuan",
      etnisitas: "Indonesia (Jawa-Sunda modern)",
      lokasiBasis: "Jakarta Selatan & Canggu, Bali",
      bahasaUtama: "Bahasa Indonesia (Santai & Artikulatif)",
      bahasaSekunder: "English (Fluent)",
      arketipe: "The Trendsetter (Pelopor Tren)",
      mbti: "ENFJ - The Protagonist",
      toneOfVoice: "Hangat, cerdas, mindful, witty, dan relatable",
      nilaiUtama: "Otentisitas digital, sustainable fashion, mindful living",
      hobi: "Specialty coffee brewing, 35mm film photography, pilates",
      ciriKhasCatchphrase: "Mindful in a hyperconnected world | Tenun meets future",
      nicheKonten: "Fashion & Mindful Lifestyle",
      subNiche: "Sustainable Fashion & Slow Living Modern",
      targetAudiensUsia: "18 - 32 tahun (Gen Z & Young Millennials)",
      targetAudiensMinat: "Pecinta mode estetik, slow living, specialty cafe, fashion editorial",
      wilayahAudiens: "Indonesia perkotaan & Asia Tenggara",
      gayaFashion: "Clean Minimalist Chic",
      fashionItemsKhas: "Structured neutral blazers, raw linen trousers, minimalist silver watch",
      bentukWajah: "Oval simetris dengan rahang lembut terdefinisi",
      mata: "Hazel almond-shaped eyes dengan sorot mata hangat dan cerdas",
      rambut: "Dark espresso brown, textured wavy bob sebahu",
      tipeTubuh: "Slim athletic toned posture, 169 cm",
      keunikanFisik: "Tahi lalat halus tepat di bawah mata kiri, natural dewy skin",
      gayaVisual: "Cinematic 35mm Analog Film",
      preferensiLighting: "Cinematic Rembrandt studio lighting & warm golden hour flares",
      paletWarnaVisual: "Warm earthy neutrals, charcoal black, terracotta, gold",
      jenisKonten: [
        "OOTD & Fashion Breakdown",
        "3-Second Transition Reels / TikTok POV",
        "Carousel Edukatif & Review Produk",
        "Get Ready With Me (GRWM) / Daily POV",
      ],
      platformUtama: ["Instagram", "TikTok", "YouTube Shorts"],
      tujuanAI: "Kolaborasi brand fashion sustainable, modeling virtual komersial, dan edukasi gaya hidup mindful",
      catatanTambahan: "Pencahayaan foto harus tampak sangat nyata (8k hyper-realistic) dengan tekstur pori kulit alami.",
    },
  },
  {
    label: "Kenzo Arisawa - AI Hardware & Future Tech",
    data: {
      nama: "Kenzo Arisawa",
      handle: "@kenzo.futurist",
      usia: "25",
      gender: "Laki-laki",
      etnisitas: "Campuran Indonesia-Jepang (Hapa)",
      lokasiBasis: "Tokyo & Jakarta",
      bahasaUtama: "Bahasa Indonesia & Japanese",
      bahasaSekunder: "English (Tech Standard)",
      arketipe: "The Visionary (Inovator Masa Depan)",
      mbti: "INTJ - The Architect",
      toneOfVoice: "Tech-savvy, tenang, analitis, tajam namun santai",
      nilaiUtama: "Demokratisasi AI, hardware masa depan, open innovation",
      hobi: "Custom mechanical keyboards, cyberpunk night walks, espresso pulling",
      ciriKhasCatchphrase: "Hardware is the new canvas | Automate the mundane",
      nicheKonten: "AI, Hardware & Future Gadgets",
      subNiche: "Spatial Computing, AI Wearables & Consumer Robotics",
      targetAudiensUsia: "20 - 38 tahun (Techies, Designers, Developers)",
      targetAudiensMinat: "Gadget flagship, clean desk setups, smart devices, cyberpunk aesthetic",
      wilayahAudiens: "Indonesia, Jepang, dan komunitas tech global",
      gayaFashion: "Cyberpunk Techwear & Minimalist Dark Mode",
      fashionItemsKhas: "Matte black waterproof modular jacket, technical cargo pants, minimal high-top sneakers",
      bentukWajah: "Angular sharp jawline, high cheekbones",
      mata: "Deep dark monolid eyes, tatapan fokus tajam",
      rambut: "Jet black modern two-block cut sedikit messy",
      tipeTubuh: "Lean athletic build, 178 cm",
      keunikanFisik: "Garis alis tebal tegas, goresan tipis di pangkal hidung",
      gayaVisual: "Moody Neon Cyberpunk Dual-Tone",
      preferensiLighting: "Dual-tone neon cyan dan amber gold backlight, moody high contrast",
      paletWarnaVisual: "Obsidian black, cyber cyan, neon amber, dark slate",
      jenisKonten: [
        "Product Review & Unboxing Hardware",
        "3-Second Transition Reels / TikTok POV",
        "Cinematic Photo Stills & Desk Setups",
      ],
      platformUtama: ["YouTube Shorts", "Instagram", "X / Twitter"],
      tujuanAI: "Menjadi AI tech reviewer kredibel terdepan dan brand ambassador gadget mutakhir",
      catatanTambahan: "Pencahayaan kontras tinggi sinematik dengan pantulan neon tajam pada device gadget.",
    },
  },
];

const CONTENT_TYPES = [
  "OOTD & Fashion Breakdown",
  "3-Second Transition Reels / TikTok POV",
  "Carousel Edukatif & Review Produk",
  "Get Ready With Me (GRWM) / Daily POV",
  "Cinematic Photo Stills & Editorial Feed",
  "Interactive Q&A & Story Polls",
  "Product Review & Unboxing Hardware",
];

const PLATFORMS = ["Instagram", "TikTok", "YouTube Shorts", "X / Twitter", "Threads"];

export const InfluencerBuilderModal: React.FC<InfluencerBuilderModalProps> = ({
  isOpen,
  onClose,
  onBuild,
  isLoading,
  onOpenFullStudio,
}) => {
  const [form, setForm] = useState<CharacterCreationData>(PRESET_CHARACTERS[0].data);
  const [activeTabSection, setActiveTabSection] = useState<
    "identitas" | "kepribadian" | "niche_audiens" | "fashion_fisik" | "visual_konten" | "tujuan"
  >("identitas");
  const [buildingStep, setBuildingStep] = useState(0);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const interval = setInterval(() => {
      setBuildingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1800);

    try {
      await onBuild(form);
      clearInterval(interval);
      setBuildingStep(0);
      onClose();
    } catch (err) {
      clearInterval(interval);
      setBuildingStep(0);
    }
  };

  const handleToggleContent = (type: string) => {
    setForm((prev) => {
      const exists = prev.jenisKonten.includes(type);
      return {
        ...prev,
        jenisKonten: exists
          ? prev.jenisKonten.filter((t) => t !== type)
          : [...prev.jenisKonten, type],
      };
    });
  };

  const handleTogglePlatform = (plat: string) => {
    setForm((prev) => {
      const exists = prev.platformUtama.includes(plat);
      if (exists && prev.platformUtama.length === 1) return prev;
      return {
        ...prev,
        platformUtama: exists
          ? prev.platformUtama.filter((p) => p !== plat)
          : [...prev.platformUtama, plat],
      };
    });
  };

  const stepsText = [
    "Merancang profil psikologis & arketipe persona...",
    "Mengunci token konsistensi wajah & LoRA visual DNA...",
    "Menyusun 3 paket prompt visual multi-generator (NanoBanana, Flux, Seedream, ChatGPT, Gemini)...",
    "Finalisasi dossier identitas AI Influencer...",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-4 bg-zinc-900/70">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
              <Wand2 className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Formulir 10 Parameter AI Influencer
                </h3>
                <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                  Full Pipeline
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Isi spesifikasi karakter, lalu klik tombol generate untuk menyusun dossier lengkap
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Preset Selector */}
        <div className="border-b border-zinc-800/80 bg-zinc-900/40 px-6 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-zinc-400">Gunakan Preset Cepat:</span>
            {PRESET_CHARACTERS.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setForm({ ...p.data })}
                className="rounded-md border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-[11px] text-zinc-200 hover:bg-indigo-600 hover:text-white transition-all"
              >
                {p.data.nama}
              </button>
            ))}
          </div>
          {onOpenFullStudio && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenFullStudio();
              }}
              className="text-[11px] font-semibold text-indigo-400 hover:underline"
            >
              Buka di Tab Studio Penuh →
            </button>
          )}
        </div>

        {/* Form Category Navigation Tabs */}
        <div className="flex border-b border-zinc-800 bg-zinc-900/30 px-6 overflow-x-auto gap-2 py-2">
          <button
            type="button"
            onClick={() => setActiveTabSection("identitas")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTabSection === "identitas"
                ? "bg-zinc-800 text-sky-400 border border-zinc-700"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <User className="h-3.5 w-3.5" />
            <span>1. Identitas Dasar</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection("kepribadian")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTabSection === "kepribadian"
                ? "bg-zinc-800 text-purple-400 border border-zinc-700"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Brain className="h-3.5 w-3.5" />
            <span>2. Kepribadian</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection("niche_audiens")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTabSection === "niche_audiens"
                ? "bg-zinc-800 text-emerald-400 border border-zinc-700"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>3 & 4. Niche & Audiens</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection("fashion_fisik")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTabSection === "fashion_fisik"
                ? "bg-zinc-800 text-pink-400 border border-zinc-700"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Shirt className="h-3.5 w-3.5" />
            <span>5 & 6. Fashion & Fisik</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection("visual_konten")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTabSection === "visual_konten"
                ? "bg-zinc-800 text-orange-400 border border-zinc-700"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>7, 8 & 9. Visual & Platform</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSection("tujuan")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              activeTabSection === "tujuan"
                ? "bg-zinc-800 text-indigo-400 border border-zinc-700"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Target className="h-3.5 w-3.5" />
            <span>10. Tujuan AI</span>
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          {/* TAB 1: IDENTITAS DASAR */}
          {activeTabSection === "identitas" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Nama Lengkap Influencer:
                  </label>
                  <input
                    type="text"
                    value={form.nama}
                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                    required
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Handle Media Sosial:
                  </label>
                  <input
                    type="text"
                    value={form.handle}
                    onChange={(e) => setForm({ ...form, handle: e.target.value })}
                    required
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Usia:</label>
                  <input
                    type="text"
                    value={form.usia}
                    onChange={(e) => setForm({ ...form, usia: e.target.value })}
                    required
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Gender:</label>
                  <select
                    value={form.gender}
                    onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  >
                    <option value="Perempuan">Perempuan</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Androgynous">Androgynous</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Etnisitas:
                  </label>
                  <input
                    type="text"
                    value={form.etnisitas}
                    onChange={(e) => setForm({ ...form, etnisitas: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Lokasi Basis:
                  </label>
                  <input
                    type="text"
                    value={form.lokasiBasis}
                    onChange={(e) => setForm({ ...form, lokasiBasis: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Bahasa Utama & Sekunder:
                  </label>
                  <input
                    type="text"
                    value={`${form.bahasaUtama} | ${form.bahasaSekunder || ""}`}
                    onChange={(e) => {
                      const parts = e.target.value.split("|");
                      setForm({
                        ...form,
                        bahasaUtama: parts[0]?.trim() || "",
                        bahasaSekunder: parts[1]?.trim() || "",
                      });
                    }}
                    placeholder="Bahasa Indonesia | English"
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KEPRIBADIAN */}
          {activeTabSection === "kepribadian" && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Arketipe Kepribadian:
                  </label>
                  <input
                    type="text"
                    value={form.arketipe}
                    onChange={(e) => setForm({ ...form, arketipe: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Tipe MBTI:
                  </label>
                  <input
                    type="text"
                    value={form.mbti}
                    onChange={(e) => setForm({ ...form, mbti: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Tone of Voice (Gaya Bicara):
                  </label>
                  <input
                    type="text"
                    value={form.toneOfVoice}
                    onChange={(e) => setForm({ ...form, toneOfVoice: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Nilai Utama (Core Values):
                  </label>
                  <input
                    type="text"
                    value={form.nilaiUtama}
                    onChange={(e) => setForm({ ...form, nilaiUtama: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Hobi & Passion:
                  </label>
                  <input
                    type="text"
                    value={form.hobi}
                    onChange={(e) => setForm({ ...form, hobi: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Catchphrases / Slogan Khas:
                  </label>
                  <input
                    type="text"
                    value={form.ciriKhasCatchphrase}
                    onChange={(e) => setForm({ ...form, ciriKhasCatchphrase: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NICHE & AUDIENS */}
          {activeTabSection === "niche_audiens" && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Niche Konten:
                  </label>
                  <input
                    type="text"
                    value={form.nicheKonten}
                    onChange={(e) => setForm({ ...form, nicheKonten: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Sub-Niche Spesifik:
                  </label>
                  <input
                    type="text"
                    value={form.subNiche}
                    onChange={(e) => setForm({ ...form, subNiche: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Rentang Usia Audiens:
                  </label>
                  <input
                    type="text"
                    value={form.targetAudiensUsia}
                    onChange={(e) => setForm({ ...form, targetAudiensUsia: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Wilayah Target:
                  </label>
                  <input
                    type="text"
                    value={form.wilayahAudiens}
                    onChange={(e) => setForm({ ...form, wilayahAudiens: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Minat & Karakteristik Audiens:
                  </label>
                  <input
                    type="text"
                    value={form.targetAudiensMinat}
                    onChange={(e) => setForm({ ...form, targetAudiensMinat: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FASHION & FISIK */}
          {activeTabSection === "fashion_fisik" && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Gaya Fashion (Aesthetic):
                  </label>
                  <input
                    type="text"
                    value={form.gayaFashion}
                    onChange={(e) => setForm({ ...form, gayaFashion: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Pakaian & Aksesori Khas:
                  </label>
                  <input
                    type="text"
                    value={form.fashionItemsKhas}
                    onChange={(e) => setForm({ ...form, fashionItemsKhas: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Bentuk Wajah:
                  </label>
                  <input
                    type="text"
                    value={form.bentukWajah}
                    onChange={(e) => setForm({ ...form, bentukWajah: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Mata & Sorot:
                  </label>
                  <input
                    type="text"
                    value={form.mata}
                    onChange={(e) => setForm({ ...form, mata: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">Rambut:</label>
                  <input
                    type="text"
                    value={form.rambut}
                    onChange={(e) => setForm({ ...form, rambut: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Tipe Tubuh & Tinggi:
                  </label>
                  <input
                    type="text"
                    value={form.tipeTubuh}
                    onChange={(e) => setForm({ ...form, tipeTubuh: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Keunikan Fisik (LoRA Lock):
                  </label>
                  <input
                    type="text"
                    value={form.keunikanFisik}
                    onChange={(e) => setForm({ ...form, keunikanFisik: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VISUAL & PLATFORM */}
          {activeTabSection === "visual_konten" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Gaya Visual:
                  </label>
                  <input
                    type="text"
                    value={form.gayaVisual}
                    onChange={(e) => setForm({ ...form, gayaVisual: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Preferensi Lighting:
                  </label>
                  <input
                    type="text"
                    value={form.preferensiLighting}
                    onChange={(e) => setForm({ ...form, preferensiLighting: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Jenis Konten Rutin:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CONTENT_TYPES.map((ct) => {
                      const sel = form.jenisKonten.includes(ct);
                      return (
                        <button
                          key={ct}
                          type="button"
                          onClick={() => handleToggleContent(ct)}
                          className={`rounded-lg px-2.5 py-1 text-xs border transition-all ${
                            sel
                              ? "bg-rose-600 text-white border-rose-500"
                              : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                          }`}
                        >
                          {sel ? "✓ " : "+ "}
                          {ct}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-zinc-300 block mb-1">
                    Platform Utama:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PLATFORMS.map((plat) => {
                      const sel = form.platformUtama.includes(plat);
                      return (
                        <button
                          key={plat}
                          type="button"
                          onClick={() => handleTogglePlatform(plat)}
                          className={`rounded-lg px-2.5 py-1 text-xs border transition-all ${
                            sel
                              ? "bg-teal-600 text-white border-teal-500"
                              : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white"
                          }`}
                        >
                          {sel ? "✓ " : "+ "}
                          {plat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: TUJUAN AI */}
          {activeTabSection === "tujuan" && (
            <div className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Tujuan Utama AI Influencer:
                </label>
                <input
                  type="text"
                  value={form.tujuanAI}
                  onChange={(e) => setForm({ ...form, tujuanAI: e.target.value })}
                  placeholder="Kemitraan brand, modeling komersial, edukasi, dsb."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Catatan Tambahan & Arahan Khusus:
                </label>
                <textarea
                  rows={3}
                  value={form.catatanTambahan || ""}
                  onChange={(e) => setForm({ ...form, catatanTambahan: e.target.value })}
                  placeholder="Instruksi tambahan untuk prompt generator atau persona..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-zinc-100 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Loading status */}
          {isLoading && (
            <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <RefreshCw className="h-4 w-4 animate-spin text-indigo-400" />
                <span>Memproses Sintesis AI Influencer...</span>
              </div>
              <p className="text-xs text-zinc-300 pl-6">
                {stepsText[buildingStep] || stepsText[0]}
              </p>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden mt-2">
                <div
                  className="bg-indigo-500 h-full transition-all duration-700"
                  style={{ width: `${((buildingStep + 1) / 4) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Footer with Big Generate Button */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="rounded-lg px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Tutup
            </button>
            <button
              id="btn-submit-build-influencer"
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-950/50 hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Sedang Merancang...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  <span>Generate AI Influencer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
