import React, { useState } from "react";
import {
  Sparkles,
  Camera,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sliders,
  Sun,
  Aperture,
  Shirt,
  Image as ImageIcon,
  Download,
  Eye,
  RefreshCw,
  Zap,
  Mic,
} from "lucide-react";
import { AIInfluencer, PromptPackageDetails, GeneratorPrompts } from "../types";

interface PromptPackagesSectionProps {
  influencer: AIInfluencer;
  onTestRenderImage: (packageKey: string, promptText: string) => Promise<string | null>;
  onConvertToVoiceover?: (promptText: string) => void;
}

type GeneratorKey = "nanoBanana" | "flux" | "seedream" | "chatgptImage" | "geminiImage" | "midjourney";

const GENERATORS: { key: GeneratorKey; label: string; badge: string; desc: string }[] = [
  { key: "nanoBanana", label: "NanoBanana", badge: "Gemini 3.1", desc: "Format deskriptif visual tajam" },
  { key: "flux", label: "Flux", badge: "Flux.1 Dev", desc: "Tekstur kulit otentik & 35/85mm look" },
  { key: "seedream", label: "Seedream", badge: "SDXL / Pos-Neg", desc: "Dual prompt positif & negatif" },
  { key: "chatgptImage", label: "ChatGPT Image", badge: "DALL-E 3", desc: "Komposisi sinematik naratif" },
  { key: "geminiImage", label: "Gemini Image", badge: "Imagen 3", desc: "Photorealism 8K studio grade" },
  { key: "midjourney", label: "Midjourney", badge: "v6.1 RAW", desc: "Parameter flags (--ar, --s, --raw)" },
];

export const PromptPackagesSection: React.FC<PromptPackagesSectionProps> = ({
  influencer,
  onTestRenderImage,
  onConvertToVoiceover,
}) => {
  const [activePackageTab, setActivePackageTab] = useState<"package1" | "package2" | "package3">("package1");
  const [selectedGenerators, setSelectedGenerators] = useState<Record<string, GeneratorKey>>({
    package1: "nanoBanana",
    package2: "flux",
    package3: "midjourney",
  });
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<string | null>(null);
  const [renderedPreviews, setRenderedPreviews] = useState<Record<string, string>>({});
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);

  const packages = influencer.promptPackages;

  const currentPackageKey =
    activePackageTab === "package1"
      ? "package1_portrait"
      : activePackageTab === "package2"
      ? "package2_lifestyle"
      : "package3_brandEditorial";

  const currentPkg: PromptPackageDetails = packages[currentPackageKey];
  const currentGenKey = selectedGenerators[activePackageTab];

  const handleCopyPrompt = (textToCopy: string, identifier: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedKey(identifier);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRender = async (pkgKey: string, promptText: string) => {
    setIsRendering(pkgKey);
    try {
      const result = await onTestRenderImage(pkgKey, promptText);
      if (result) {
        setRenderedPreviews((prev) => ({ ...prev, [pkgKey]: result }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRendering(null);
    }
  };

  const getActivePromptString = (pkg: PromptPackageDetails, genKey: GeneratorKey): string => {
    if (genKey === "seedream") {
      const s = pkg.generatorPrompts.seedream;
      return `Positive Prompt:\n${s.positive}\n\nNegative Prompt:\n${s.negative}\n\nRecommended: Steps: ${s.steps}, CFG: ${s.cfg}, Sampler: DPM++ 2M Karras`;
    }
    return pkg.generatorPrompts[genKey] || "";
  };

  const currentPromptText = getActivePromptString(currentPkg, currentGenKey);

  const handleDownloadPackagePrompts = () => {
    const content = `=========================================
PROMPT DOSSIER: ${currentPkg.title}
Influencer: ${influencer.name} (${influencer.handle})
Niche: ${influencer.niche}
=========================================

[KONSEP & SETUP]
- Konsep: ${currentPkg.concept}
- Lensa & Kamera: ${currentPkg.cameraLens}
- Pencahayaan: ${currentPkg.lighting}
- Setting Lokasi: ${currentPkg.setting}
- Wardrobe: ${currentPkg.wardrobe}

-----------------------------------------
1. NANOBANANA (Gemini 3.1 Image):
${currentPkg.generatorPrompts.nanoBanana}

-----------------------------------------
2. FLUX (Flux.1 Dev / Schnell):
${currentPkg.generatorPrompts.flux}

-----------------------------------------
3. SEEDREAM (SDXL Pos / Neg):
Positive: ${currentPkg.generatorPrompts.seedream.positive}
Negative: ${currentPkg.generatorPrompts.seedream.negative}
Steps: ${currentPkg.generatorPrompts.seedream.steps} | CFG: ${currentPkg.generatorPrompts.seedream.cfg}

-----------------------------------------
4. CHATGPT IMAGE (DALL-E 3):
${currentPkg.generatorPrompts.chatgptImage}

-----------------------------------------
5. GEMINI IMAGE (Imagen 3):
${currentPkg.generatorPrompts.geminiImage}

-----------------------------------------
6. MIDJOURNEY v6.1:
${currentPkg.generatorPrompts.midjourney}
`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${influencer.handle}_${activePackageTab}_prompts.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div id="prompt-packages-section" className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl sm:p-8">
      {/* Section Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Camera className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              3 Paket Prompt Visual Siap Pakai
            </h2>
            <p className="text-xs text-zinc-400">
              Format teroptimasi untuk NanoBanana, Flux, Seedream, ChatGPT, Gemini, & Midjourney
            </p>
          </div>
        </div>

        {/* Download All Prompts in Package */}
        <button
          onClick={handleDownloadPackagePrompts}
          className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
        >
          <Download className="h-3.5 w-3.5 text-indigo-400" />
          <span>Ekspor Paket .TXT</span>
        </button>
      </div>

      {/* Package Tabs */}
      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActivePackageTab("package1")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
            activePackageTab === "package1"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
              : "bg-zinc-950/70 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800"
          }`}
        >
          <Aperture className="h-4 w-4" />
          <span>Paket 1: Signature Portrait</span>
        </button>

        <button
          onClick={() => setActivePackageTab("package2")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
            activePackageTab === "package2"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
              : "bg-zinc-950/70 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800"
          }`}
        >
          <Sun className="h-4 w-4" />
          <span>Paket 2: Lifestyle & Daily In-Action</span>
        </button>

        <button
          onClick={() => setActivePackageTab("package3")}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
            activePackageTab === "package3"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/30"
              : "bg-zinc-950/70 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Paket 3: Brand Collaboration Editorial</span>
        </button>
      </div>

      {/* Active Package Details Box */}
      <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-950/70 p-5">
        <div className="flex flex-col gap-2 border-b border-zinc-800/80 pb-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-bold text-white sm:text-lg">
              {currentPkg.title}
            </h3>
            <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              Photorealistic 8K Production Grade
            </span>
          </div>
          <p className="text-xs sm:text-sm text-zinc-300">
            {currentPkg.concept}
          </p>
        </div>

        {/* Technical Specs Breakdown */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800/70">
            <span className="flex items-center gap-1.5 font-semibold text-indigo-400 mb-1">
              <Camera className="h-3.5 w-3.5" /> Lensa & Kamera:
            </span>
            <p className="text-zinc-200">{currentPkg.cameraLens}</p>
          </div>

          <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800/70">
            <span className="flex items-center gap-1.5 font-semibold text-amber-400 mb-1">
              <Sun className="h-3.5 w-3.5" /> Pencahayaan:
            </span>
            <p className="text-zinc-200">{currentPkg.lighting}</p>
          </div>

          <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800/70">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-400 mb-1">
              <Layers className="h-3.5 w-3.5" /> Setting & Background:
            </span>
            <p className="text-zinc-200">{currentPkg.setting}</p>
          </div>

          <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800/70">
            <span className="flex items-center gap-1.5 font-semibold text-purple-400 mb-1">
              <Shirt className="h-3.5 w-3.5" /> Wardrobe & Styling:
            </span>
            <p className="text-zinc-200">{currentPkg.wardrobe}</p>
          </div>
        </div>

        {/* Generator Selector Tabs */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Pilih Target Generator Gambar:
            </span>
            <span className="text-[11px] text-zinc-400">
              Setiap generator memiliki format & parameter spesifik
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {GENERATORS.map((gen) => {
              const isSelected = currentGenKey === gen.key;
              return (
                <button
                  key={gen.key}
                  onClick={() =>
                    setSelectedGenerators((prev) => ({
                      ...prev,
                      [activePackageTab]: gen.key,
                    }))
                  }
                  className={`flex flex-col items-start p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-indigo-500 bg-indigo-950/40 text-white shadow-md shadow-indigo-950/30"
                      : "border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-xs font-bold text-zinc-100">{gen.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                        isSelected ? "bg-indigo-500 text-white" : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {gen.badge}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 mt-1 line-clamp-1">{gen.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Prompt Display & Quick Actions */}
        <div className="mt-5 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-200">
                Prompt Siap Pakai untuk{" "}
                <span className="text-indigo-400 font-bold">
                  {GENERATORS.find((g) => g.key === currentGenKey)?.label}
                </span>
                :
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Copy Button */}
              <button
                id={`btn-copy-prompt-${activePackageTab}-${currentGenKey}`}
                onClick={() => handleCopyPrompt(currentPromptText, `${activePackageTab}-${currentGenKey}`)}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-indigo-500 active:scale-95 transition-all"
              >
                {copiedKey === `${activePackageTab}-${currentGenKey}` ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span>Prompt Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Salin Prompt</span>
                  </>
                )}
              </button>

              {/* Test Render Button */}
              <button
                id={`btn-test-render-${activePackageTab}`}
                onClick={() => handleRender(activePackageTab, currentPkg.generatorPrompts.nanoBanana || currentPromptText)}
                disabled={isRendering === activePackageTab}
                className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 bg-purple-950/40 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-900/50 active:scale-95 disabled:opacity-50 transition-all"
                title="Generate visual preview menggunakan model AI"
              >
                {isRendering === activePackageTab ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin text-purple-400" />
                    <span>Rendering Visual...</span>
                  </>
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5 text-purple-400" />
                    <span>Live Test Render</span>
                  </>
                )}
              </button>

              {/* Voice-over Script Converter Button */}
              {onConvertToVoiceover && (
                <button
                  id={`btn-voiceover-${activePackageTab}`}
                  onClick={() => onConvertToVoiceover(currentPromptText)}
                  className="flex items-center gap-1.5 rounded-lg border border-indigo-500/40 bg-indigo-950/40 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/50 active:scale-95 transition-all"
                  title="Ubah teks prompt ini menjadi skrip narasi voice-over video pendek"
                >
                  <Mic className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Naskah Voice-over</span>
                </button>
              )}
            </div>
          </div>

          {/* Prompt Content */}
          <div className="mt-3">
            {currentGenKey === "seedream" ? (
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                    Positive Prompt:
                  </span>
                  <pre className="whitespace-pre-wrap rounded-lg bg-zinc-950 p-3 font-mono text-xs text-zinc-200 border border-zinc-800/80 select-all">
                    {currentPkg.generatorPrompts.seedream.positive}
                  </pre>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block mb-1">
                    Negative Prompt:
                  </span>
                  <pre className="whitespace-pre-wrap rounded-lg bg-zinc-950 p-3 font-mono text-xs text-zinc-400 border border-zinc-800/80 select-all">
                    {currentPkg.generatorPrompts.seedream.negative}
                  </pre>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-400 pt-1">
                  <span>Steps: <strong className="text-zinc-200">{currentPkg.generatorPrompts.seedream.steps}</strong></span>
                  <span>CFG Scale: <strong className="text-zinc-200">{currentPkg.generatorPrompts.seedream.cfg}</strong></span>
                  <span>Clip Skip: <strong className="text-zinc-200">2</strong></span>
                </div>
              </div>
            ) : (
              <pre className="whitespace-pre-wrap rounded-lg bg-zinc-950 p-3.5 font-mono text-xs text-zinc-200 leading-relaxed border border-zinc-800/80 select-all max-h-56 overflow-y-auto">
                {currentPromptText}
              </pre>
            )}
          </div>

          {/* Rendered Live Preview Banner (if generated) */}
          {renderedPreviews[activePackageTab] && (
            <div className="mt-4 rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
                  <ImageIcon className="h-4 w-4" /> Hasil Live Test Render untuk {currentPkg.title}:
                </span>
                <button
                  onClick={() => setPreviewModalImage(renderedPreviews[activePackageTab])}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-200"
                >
                  <Eye className="h-3.5 w-3.5" /> Lihat Resolusi Penuh
                </button>
              </div>
              <div className="relative h-56 w-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 sm:h-72">
                <img
                  src={renderedPreviews[activePackageTab]}
                  alt="Render Preview"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal View for full image */}
      {previewModalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] max-w-2xl overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 p-2 shadow-2xl">
            <button
              onClick={() => setPreviewModalImage(null)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
            >
              ✕
            </button>
            <img
              src={previewModalImage}
              alt="High Res Render"
              referrerPolicy="no-referrer"
              className="max-h-[85vh] w-full rounded-xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};
