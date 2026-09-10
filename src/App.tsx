import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { IdentitySummaryCard } from "./components/IdentitySummaryCard";
import { PersonalityProfileCard } from "./components/PersonalityProfileCard";
import { PromptPackagesSection } from "./components/PromptPackagesSection";
import { RealtimeTrendsAndAutomation } from "./components/RealtimeTrendsAndAutomation";
import { InfluencerBuilderModal } from "./components/InfluencerBuilderModal";
import { CharacterStudioForm } from "./components/CharacterStudioForm";
import { AntiSlopStudio } from "./components/AntiSlopStudio";
import { TutorialGuideView } from "./components/TutorialGuideView";
import { SocialMetaPreview } from "./components/SocialMetaPreview";
import { defaultInfluencers, initialRealtimeTrends } from "./data/defaultInfluencers";
import {
  AIInfluencer,
  RealtimeTrend,
  AutomatedContentPost,
  BuilderFormState,
  CharacterCreationData,
} from "./types";
import {
  injectOpenGraphMetaTags,
  buildDefaultSocialMeta,
} from "./utils/metaTags";
import {
  Sparkles,
  Layers,
  Radio,
  Camera,
  Brain,
  CheckCircle2,
  AlertCircle,
  FileJson,
  Zap,
  Sliders,
  Wand2,
  ShieldCheck,
  BookOpen,
  Share2,
} from "lucide-react";

export default function App() {
  // 1. Core State
  const [influencers, setInfluencers] = useState<AIInfluencer[]>(() => {
    try {
      const saved = localStorage.getItem("ai_influencers_list");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return defaultInfluencers;
  });

  const [activeInfluencer, setActiveInfluencer] = useState<AIInfluencer>(() => {
    return influencers[0] || defaultInfluencers[0];
  });

  const [trends, setTrends] = useState<RealtimeTrend[]>(() => {
    try {
      const saved = localStorage.getItem("ai_realtime_trends");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return initialRealtimeTrends;
  });

  const [automatedPosts, setAutomatedPosts] = useState<AutomatedContentPost[]>(() => {
    // Generate an initial sample post from the first trend for immediate delight
    return [
      {
        id: "post_sample_1",
        trendTitle: "AI Metamorphosis: Digital Wardrobe & Virtual Fit Checks",
        platform: "Instagram Reel",
        pillar: "Entertainment",
        hook3s: "Berapa lama waktu yang kamu butuhin buat milih outfit hari ini? Aku cuma butuh 1 frame render.",
        visualSceneDescription:
          "Candid video transisi kamera 360 derajat di mana Maya Danastri mengenakan pakaian linen biasa, lalu dalam sekejap bertransformasi menjadi cyber-sculptural blazer dengan pencahayaan neon ambient yang elegan.",
        readyVisualPrompt:
          "Cinematic photorealistic 8k video still of 23yo Indonesian woman Maya Danastri standing in minimalist concrete room, dynamic clothing transition effect, wearing iridescent white tailored cyber blazer, Rembrandt studio lighting, 35mm f/1.8 lens, raw photography",
        recommendedGenerator: "Flux",
        caption: `Pakaian hari ini lebih dari sekadar pelindung fisik, melainkan kanvas ekspresi kita. Hari ini aku memadukan tenun lokal dengan siluet cybernetic 3D. 

Menurut kalian, apakah 5 tahun lagi lemari fisik kita bakal digantikan sepenuhnya oleh digital augmented fashion? Let me know your thoughts di kolom komentar! 👇✨`,
        callToAction: "Komen 'CYBER' kalau kamu mau breakdown prompt styling 3D ini di DM kamu!",
        hashtags: [
          "#MayaDanastri",
          "#DigitalFashion",
          "#VirtualHuman",
          "#FutureOOTD",
          "#CleanAesthetics",
        ],
        soundtrack: "Speed-up Electronic Synthwave (Trending 2026 Audio)",
        predictedEngagement: "Tinggi (Estimasi 12k Shares & Saves)",
      },
    ];
  });

  // UI state
  const [activeTab, setActiveTab] = useState<
    "guide" | "identity" | "personality" | "prompts" | "trends" | "studio" | "antislop" | "meta"
  >("identity");
  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);
  const [isBuildingInfluencer, setIsBuildingInfluencer] = useState(false);
  const [isDiscoveringTrends, setIsDiscoveringTrends] = useState(false);
  const [isAutomatingContent, setIsAutomatingContent] = useState(false);
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ai_influencers_list", JSON.stringify(influencers));
    } catch (e) {
      console.error(e);
    }
  }, [influencers]);

  useEffect(() => {
    try {
      localStorage.setItem("ai_realtime_trends", JSON.stringify(trends));
    } catch (e) {
      console.error(e);
    }
  }, [trends]);

  // Dynamically sync Open Graph & Twitter meta tags to document.head whenever active influencer changes
  useEffect(() => {
    try {
      if (activeInfluencer) {
        const config = buildDefaultSocialMeta(activeInfluencer);
        injectOpenGraphMetaTags(config);
      }
    } catch (err) {
      console.error("Failed to dynamically update Open Graph meta tags:", err);
    }
  }, [activeInfluencer]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Build New Influencer API Call (Supports 10-parameter CharacterCreationData & legacy BuilderFormState)
  const handleBuildInfluencer = async (params: CharacterCreationData | BuilderFormState) => {
    setIsBuildingInfluencer(true);
    try {
      const res = await fetch("/api/influencer/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!data.success || !data.influencer) {
        throw new Error(data.error || "Gagal membangun AI Influencer");
      }

      const newInf: AIInfluencer = {
        ...data.influencer,
        avatarUrl:
          params.gender === "Laki-laki"
            ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
            : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
      };

      setInfluencers((prev) => [newInf, ...prev]);
      setActiveInfluencer(newInf);
      setActiveTab("identity");
      showToast(`Sukses membangun AI Influencer baru: ${newInf.name} (${newInf.handle})!`);
    } catch (err: any) {
      console.warn("Influencer build notice:", err);
      showToast(`Terjadi kendala: ${err.message}`);
      throw err;
    } finally {
      setIsBuildingInfluencer(false);
    }
  };

  // Discover Trends API Call (Google Search Grounded)
  const handleDiscoverTrends = async (niche: string, region: string) => {
    setIsDiscoveringTrends(true);
    try {
      const res = await fetch("/api/trends/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche, region }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.trends) && data.trends.length > 0) {
        setTrends(data.trends);
        showToast(`Berhasil menemukan ${data.trends.length} tren pasar real-time terkini!`);
      } else {
        throw new Error(data.error || "Gagal mengambil data tren");
      }
    } catch (err: any) {
      console.warn("Discover trends notice:", err);
      showToast(`Pencarian tren: ${err.message}`);
    } finally {
      setIsDiscoveringTrends(false);
    }
  };

  // Automate Content API Call
  const handleAutomateContent = async (trend: RealtimeTrend) => {
    setIsAutomatingContent(true);
    try {
      const res = await fetch("/api/content/automate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          influencer: activeInfluencer,
          selectedTrend: trend,
          count: 3,
          toneTier: activeInfluencer.toneTier || "tier2",
        }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.posts) && data.posts.length > 0) {
        setAutomatedPosts((prev) => [...data.posts, ...prev]);
        setActiveTab("trends");
        showToast(`Berhasil menyusun ${data.posts.length} konten otomatis untuk tren "${trend.title}"!`);
      } else {
        throw new Error(data.error || "Gagal mengotomasi konten");
      }
    } catch (err: any) {
      console.warn("Content automation notice:", err);
      showToast(`Gagal otomasi: ${err.message}`);
    } finally {
      setIsAutomatingContent(false);
    }
  };

  // Generate Image Preview / Avatar using Gemini Image or Curated Studio
  const handleGenerateAvatar = async () => {
    setIsGeneratingAvatar(true);
    try {
      const prompt = `Headshot avatar portrait of ${activeInfluencer.name}, ${activeInfluencer.visualIdentity.consistencyAnchorTokens}, sharp eye focus, high-end studio lighting, 8k resolution, photorealistic`;
      const res = await fetch("/api/influencer/generate-preview-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          aspectRatio: "1:1",
          gender: activeInfluencer.demographics.gender,
          ethnicity: activeInfluencer.demographics.ethnicity,
          style: activeInfluencer.visualIdentity.signatureStyle,
          packageKey: "avatar",
        }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        const updated = { ...activeInfluencer, avatarUrl: data.imageUrl };
        setActiveInfluencer(updated);
        setInfluencers((prev) => prev.map((inf) => (inf.id === updated.id ? updated : inf)));
        if (data.isFallback) {
          showToast("Avatar visual studio berkualitas tinggi berhasil disinkronkan!");
        } else {
          showToast("Avatar baru berhasil di-render oleh model AI!");
        }
      } else {
        showToast(data.message || "Preview avatar studio visual siap digunakan.");
      }
    } catch (err: any) {
      console.warn("Avatar notice:", err);
      showToast("Avatar visual studio berhasil disinkronkan.");
    } finally {
      setIsGeneratingAvatar(false);
    }
  };

  // Test Render Visual Image for Package Prompt
  const handleTestRenderImage = async (packageKey: string, promptText: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/influencer/generate-preview-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `${activeInfluencer.visualIdentity.consistencyAnchorTokens}, ${promptText}`,
          aspectRatio: packageKey === "package3" || packageKey.includes("brand") ? "16:9" : "3:4",
          gender: activeInfluencer.demographics.gender,
          ethnicity: activeInfluencer.demographics.ethnicity,
          style: activeInfluencer.visualIdentity.signatureStyle,
          packageKey,
        }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        if (data.isFallback) {
          showToast("Visual studio preview siap! Prompt siap disalin ke NanoBanana, Flux, & Seedream.");
        } else {
          showToast("Visual preview berhasil di-render secara langsung!");
        }
        return data.imageUrl;
      } else {
        showToast(data.message || "Format prompt siap disalin ke generator favorit Anda.");
        return null;
      }
    } catch (err) {
      console.warn("Visual render notice:", err);
      showToast("Format prompt siap disalin ke web generator favorit Anda.");
      return null;
    }
  };

  // Export Dossier as formatted JSON
  const handleExportDossier = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(
        JSON.stringify(
          {
            influencer: activeInfluencer,
            exportedAt: new Date().toISOString(),
            generatedContentPipeline: automatedPosts,
            activeTrends: trends,
          },
          null,
          2,
        ),
      );
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${activeInfluencer.handle}_complete_dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Dossier lengkap berhasil diekspor (.json)!");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-zinc-900/95 px-4 py-3 text-xs sm:text-sm font-medium text-white shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <Header
        influencers={influencers}
        activeInfluencer={activeInfluencer}
        onSelectInfluencer={(inf) => setActiveInfluencer(inf)}
        onOpenCreateModal={() => setIsBuilderModalOpen(true)}
        onExportDossier={handleExportDossier}
        onOpenGuide={() => setActiveTab("guide")}
        onOpenSocialMeta={() => setActiveTab("meta")}
        isTrendsLoading={isDiscoveringTrends}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
          <div className="flex flex-wrap gap-2">
            <button
              id="tab-guide"
              onClick={() => setActiveTab("guide")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "guide"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/40 border border-indigo-400"
                  : "bg-indigo-950/40 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-900/60 hover:text-white"
              }`}
            >
              <BookOpen className="h-4 w-4 text-indigo-400" />
              <span>Buku Panduan Pemula</span>
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 text-[10px] font-bold">
                Tutorial
              </span>
            </button>

            <button
              id="tab-studio"
              onClick={() => setActiveTab("studio")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold transition-all ${
                activeTab === "studio"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-950/40 border border-indigo-400"
                  : "bg-zinc-900/80 text-zinc-300 border border-zinc-700 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Wand2 className="h-4 w-4" />
              <span>Input Data Karakter (10 Pilar)</span>
              <span className="rounded-full bg-indigo-400/20 px-1.5 py-0.2 text-[10px] font-bold">
                Generate
              </span>
            </button>

            <button
              id="tab-identity"
              onClick={() => setActiveTab("identity")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "identity"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
              }`}
            >
              <Layers className="h-4 w-4 text-indigo-400" />
              <span>Ringkasan Identitas & Visual</span>
            </button>

            <button
              id="tab-personality"
              onClick={() => setActiveTab("personality")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "personality"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
              }`}
            >
              <Brain className="h-4 w-4 text-purple-400" />
              <span>Profil Kepribadian</span>
            </button>

            <button
              id="tab-prompts"
              onClick={() => setActiveTab("prompts")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "prompts"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
              }`}
            >
              <Camera className="h-4 w-4 text-amber-400" />
              <span>3 Paket Prompt Visual</span>
            </button>

            <button
              id="tab-trends"
              onClick={() => setActiveTab("trends")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "trends"
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60"
              }`}
            >
              <Radio className="h-4 w-4 text-emerald-400" />
              <span>Radar Tren & Otomasi Konten</span>
              {automatedPosts.length > 0 && (
                <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.2 text-[10px] text-emerald-400 font-bold">
                  {automatedPosts.length}
                </span>
              )}
            </button>

            <button
              id="tab-antislop"
              onClick={() => setActiveTab("antislop")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "antislop"
                  ? "bg-purple-950/80 text-purple-200 shadow-sm border border-purple-500/50"
                  : "text-zinc-400 hover:text-purple-300 hover:bg-purple-950/30"
              }`}
            >
              <ShieldCheck className="h-4 w-4 text-purple-400" />
              <span>Studio Anti-Slop v3.0</span>
              <span className="rounded-full bg-purple-500/20 px-1.5 py-0.2 text-[10px] text-purple-300 font-bold">
                Poles
              </span>
            </button>

            <button
              id="tab-meta"
              onClick={() => setActiveTab("meta")}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === "meta"
                  ? "bg-purple-900/70 text-purple-100 shadow-sm border border-purple-400"
                  : "text-zinc-400 hover:text-purple-300 hover:bg-purple-950/30"
              }`}
            >
              <Share2 className="h-4 w-4 text-purple-400" />
              <span>Pratinjau Medsos & Meta</span>
              <span className="rounded-full bg-purple-500/20 px-1.5 py-0.2 text-[10px] text-purple-300 font-bold">
                OG Tag
              </span>
            </button>
          </div>

          <div className="hidden items-center gap-2 text-xs text-zinc-400 lg:flex">
            <span>Influencer Aktif:</span>
            <span className="font-semibold text-zinc-200">{activeInfluencer.name}</span>
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === "studio" && (
          <CharacterStudioForm
            onGenerate={handleBuildInfluencer}
            isLoading={isBuildingInfluencer}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === "identity" && (
          <div className="space-y-6">
            <IdentitySummaryCard
              influencer={activeInfluencer}
              onGenerateAvatar={handleGenerateAvatar}
              isGeneratingAvatar={isGeneratingAvatar}
              onOpenSocialMeta={() => setActiveTab("meta")}
            />
            {/* Quick Next Jump */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
              <div>
                <h4 className="text-xs font-semibold text-zinc-300">
                  Langkah Selanjutnya: Jelajahi Profil Kepribadian & 3 Paket Prompt
                </h4>
                <p className="text-[11px] text-zinc-500">
                  Kepribadian mendalam dan prompt siap pakai untuk NanoBanana, Flux, Seedream, ChatGPT, & Gemini
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab("studio")}
                  className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
                >
                  Edit / Input Data Baru
                </button>
                <button
                  onClick={() => setActiveTab("prompts")}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                >
                  Buka Paket Prompt Visual →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "personality" && (
          <PersonalityProfileCard influencer={activeInfluencer} />
        )}

        {activeTab === "prompts" && (
          <PromptPackagesSection
            influencer={activeInfluencer}
            onTestRenderImage={handleTestRenderImage}
          />
        )}

        {activeTab === "trends" && (
          <RealtimeTrendsAndAutomation
            influencer={activeInfluencer}
            trends={trends}
            onDiscoverTrends={handleDiscoverTrends}
            isDiscoveringTrends={isDiscoveringTrends}
            onAutomateContent={handleAutomateContent}
            isAutomatingContent={isAutomatingContent}
            automatedPosts={automatedPosts}
          />
        )}

        {activeTab === "antislop" && <AntiSlopStudio />}

        {activeTab === "meta" && (
          <SocialMetaPreview influencer={activeInfluencer} />
        )}

        {activeTab === "guide" && (
          <TutorialGuideView
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenCreateModal={() => setIsBuilderModalOpen(true)}
          />
        )}
      </main>

      {/* New Influencer Creation Modal */}
      <InfluencerBuilderModal
        isOpen={isBuilderModalOpen}
        onClose={() => setIsBuilderModalOpen(false)}
        onBuild={handleBuildInfluencer}
        isLoading={isBuildingInfluencer}
        onOpenFullStudio={() => setActiveTab("studio")}
      />
    </div>
  );
}
