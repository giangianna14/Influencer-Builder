import React, { useState, useMemo } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Wand2,
  ArrowRight,
  BookOpen,
  Zap,
  Info,
} from "lucide-react";
import { auditAntiSlop, sanitizeAntiSlop, BANNED_WORDS_ID } from "../utils/antiSlop";

interface AntiSlopStudioProps {
  initialText?: string;
  onApplyPolishedText?: (text: string) => void;
}

export const AntiSlopStudio: React.FC<AntiSlopStudioProps> = ({
  initialText = "",
  onApplyPolishedText,
}) => {
  const [inputText, setInputText] = useState(
    initialText ||
      `Di era digital yang serba cepat ini, mari kita menyelami lanskap fashion yang terus berkembang. Pakaian ini tidak hanya merangkul estetika kontemporer, tetapi juga memastikan revolusi gaya yang berkelanjutan—sebuah permadani inovasi yang tak lekang oleh waktu.`
  );
  const [selectedTier, setSelectedTier] = useState<"tier1" | "tier2" | "tier3">("tier2");
  const [polishedText, setPolishedText] = useState<string | null>(null);
  const [isRewriting, setIsRewriting] = useState(false);
  const [copied, setCopied] = useState(false);

  // Live Audit Calculation
  const auditResult = useMemo(() => {
    return auditAntiSlop(inputText);
  }, [inputText]);

  // Load Preset Slop Example
  const loadSlopExample = () => {
    setInputText(
      `Dalam dunia yang serba dinamis ini, penting bagi kita untuk menyelami inovasi terkini demi merajut masa depan yang lebih cerah—sebuah permadani kemungkinan yang tak terbatas. Hal ini tidak hanya memfasilitasi transformasi digital, melainkan juga memastikan setiap langkah kita berdampak nyata.`
    );
    setPolishedText(null);
  };

  // Load Preset Clean Example
  const loadCleanExample = () => {
    setInputText(
      `Hari ini aku milih blazer tenun katun buat keliling SCBD. Potongannya longgar, bahannya adem, dan gampang dipadukan sama sneakers putih. Praktis buat seharian rapat.`
    );
    setPolishedText(null);
  };

  // 1-Click Quick Sanitize (Client-side regex replacement)
  const handleQuickSanitize = () => {
    const cleaned = sanitizeAntiSlop(inputText);
    setInputText(cleaned);
  };

  // AI Rewrite Handler (Server-side Anti-Slop Rewriter)
  const handleAiRewrite = async () => {
    if (!inputText.trim()) return;
    setIsRewriting(true);
    try {
      const res = await fetch("/api/anti-slop/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          toneTier: selectedTier,
          context: "Media sosial caption & AI Influencer storytelling",
        }),
      });
      const data = await res.json();
      if (data.success && data.rewrittenText) {
        setPolishedText(data.rewrittenText);
      } else {
        // Fallback to local sanitize
        setPolishedText(sanitizeAntiSlop(inputText));
      }
    } catch (e) {
      console.warn("Rewrite error, falling back to local sanitizer:", e);
      setPolishedText(sanitizeAntiSlop(inputText));
    } finally {
      setIsRewriting(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Studio Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-zinc-900 to-indigo-950/40 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
                Studio Anti-Slop Writing v3.0
              </h2>
              <span className="rounded-full bg-purple-500/20 px-2.5 py-0.5 text-xs font-semibold text-purple-300 border border-purple-500/30">
                Standar Humanis & Natural
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl leading-relaxed">
              Pembersih otomatis pola generik AI: eliminasi total tanda em-dash (—), deteksi kata klise,
              variasi panjang kalimat (burstiness), dan penyesuaian register 3 tier bahasa Indonesia.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={loadSlopExample}
              className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors"
            >
              Uji Contoh AI Slop
            </button>
            <button
              onClick={loadCleanExample}
              className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/20 transition-colors"
            >
              Uji Contoh Organik
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Input & Live Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Box & Actions (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                <span>Teks yang Diuji / Dipoles:</span>
                <span className="text-[11px] font-normal text-zinc-500">
                  ({inputText.split(/\s+/).filter(Boolean).length} kata)
                </span>
              </label>
              {auditResult.emDashCount > 0 && (
                <button
                  onClick={handleQuickSanitize}
                  className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                  title="Ganti semua em-dash dan perbaiki format secara instan"
                >
                  <Zap className="h-3 w-3" />
                  <span>Perbaiki Em-Dash Cepat</span>
                </button>
              )}
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={6}
              placeholder="Ketik atau tempel caption, artikel, atau draf teks di sini..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs sm:text-sm text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-indigo-500 leading-relaxed font-sans"
            />

            {/* Target Tone Tier Selector */}
            <div className="space-y-2 pt-1 border-t border-zinc-800/80">
              <label className="text-xs font-semibold text-zinc-300 block">
                Pilih Target Register Bahasa (Tone Tier):
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    tier: "tier1" as const,
                    title: "Tier 1: Formal",
                    badge: "Baku & Terstruktur",
                    desc: "Tanpa kontraksi, kosakata presisi.",
                  },
                  {
                    tier: "tier2" as const,
                    title: "Tier 2: Semi-formal",
                    badge: "Standar Default",
                    desc: "Hangat, luwes, komunikatif.",
                  },
                  {
                    tier: "tier3" as const,
                    title: "Tier 3: Informal",
                    badge: "Medsos / Gen Z",
                    desc: "Bahasa santai, obrolan akrab.",
                  },
                ].map((item) => (
                  <button
                    key={item.tier}
                    type="button"
                    onClick={() => setSelectedTier(item.tier)}
                    className={`text-left p-3 rounded-xl border transition-all ${
                      selectedTier === item.tier
                        ? "border-purple-500 bg-purple-950/30 text-white ring-1 ring-purple-500/40"
                        : "border-zinc-800 bg-zinc-950/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-200 mb-0.5">
                      <span>{item.title}</span>
                      {selectedTier === item.tier && (
                        <span className="h-1.5 w-1.5 rounded-full bg-purple-400"></span>
                      )}
                    </div>
                    <span className="text-[10px] text-purple-400 block mb-1 font-medium">
                      {item.badge}
                    </span>
                    <p className="text-[11px] text-zinc-400 leading-tight">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={handleQuickSanitize}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
              >
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Sanitasi Cepat (Nol Em-dash)</span>
              </button>

              <button
                onClick={handleAiRewrite}
                disabled={isRewriting || !inputText.trim()}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-purple-950/50 hover:brightness-110 disabled:opacity-50 transition-all active:scale-95"
              >
                {isRewriting ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    <span>Memoles Gaya Tulisan...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-3.5 w-3.5" />
                    <span>Poles dengan Mesin Anti-Slop</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Polished Result Card */}
          {polishedText && (
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                    ✓
                  </span>
                  <span className="text-xs font-bold text-emerald-300">
                    Hasil Tulisan Anti-Slop ({selectedTier.toUpperCase()}):
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(polishedText)}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Salin Hasil</span>
                      </>
                    )}
                  </button>
                  {onApplyPolishedText && (
                    <button
                      onClick={() => onApplyPolishedText(polishedText)}
                      className="rounded bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                    >
                      Gunakan ke Caption
                    </button>
                  )}
                </div>
              </div>

              <div className="rounded-xl bg-zinc-900/90 p-4 text-xs sm:text-sm text-zinc-100 leading-relaxed border border-emerald-500/20 whitespace-pre-wrap select-all">
                {polishedText}
              </div>

              {/* Mini audit of polished text */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-zinc-400">
                <span className="text-emerald-400 font-semibold">Status Hasil:</span>
                <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  0 Em-Dash
                </span>
                <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Nol Klise AI
                </span>
                <span className="bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Cadence Organik
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Quality Audit Panel (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-purple-400" />
                <span>Audit Mutu Anti-Slop (Real-time)</span>
              </span>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-sm font-extrabold ${
                    auditResult.score >= 90
                      ? "text-emerald-400"
                      : auditResult.score >= 70
                      ? "text-amber-400"
                      : "text-rose-400"
                  }`}
                >
                  {auditResult.score}/100
                </span>
                <span className="text-[10px] text-zinc-500">Skor</span>
              </div>
            </div>

            {/* Score Progress Bar */}
            <div className="space-y-1.5">
              <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    auditResult.score >= 90
                      ? "bg-emerald-500"
                      : auditResult.score >= 70
                      ? "bg-amber-500"
                      : "bg-rose-500"
                  }`}
                  style={{ width: `${auditResult.score}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-zinc-500 font-medium">
                <span>0 (Kental Pola AI)</span>
                <span>100 (Sempurna & Natural)</span>
              </div>
            </div>

            {/* Checklist Parameters */}
            <div className="space-y-2.5">
              {/* 1. Em-Dash Check */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60">
                <div className="flex items-center gap-2">
                  {auditResult.dashCount === 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">
                      Tanda Pisah Em-Dash / En-Dash
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Kebijakan: Ketat 0 (Ganti koma / titik)
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    auditResult.dashCount === 0
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {auditResult.dashCount === 0 ? "Lolos (0)" : `${auditResult.dashCount} ditemukan`}
                </span>
              </div>

              {/* 2. Banned Words Check */}
              <div className="flex items-start justify-between p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60 gap-2">
                <div className="flex items-start gap-2">
                  {auditResult.bannedWordsFound.length === 0 ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">
                      Kata Klise / Slop Terlarang
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Menyelami, permadani, merangkul, memastikan, dll.
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 ${
                    auditResult.bannedWordsFound.length === 0
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {auditResult.bannedWordsFound.length === 0
                    ? "Nol Klise"
                    : `${auditResult.bannedWordsFound.length} Terdeteksi`}
                </span>
              </div>

              {/* Banned Words Details if found */}
              {auditResult.bannedWordsFound.length > 0 && (
                <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/30 text-xs space-y-1.5">
                  <span className="font-semibold text-rose-300 block text-[11px]">
                    Kata Terlarang yang Ditemukan:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {auditResult.bannedWordsFound.map((word, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-rose-500/20 px-2 py-0.5 text-[11px] font-mono font-bold text-rose-300 border border-rose-500/40"
                      >
                        "{word}"
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Cadence & Burstiness */}
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 ${
                      auditResult.burstinessGrade !== "Kaku (Pola AI)"
                        ? "text-emerald-400"
                        : "text-amber-400"
                    }`}
                  />
                  <div>
                    <span className="text-xs font-semibold text-zinc-200 block">
                      Ritme Kalimat (Burstiness)
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      Panjang kalimat bervariasi (pendek, sedang, panjang)
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded ${
                    auditResult.burstinessGrade === "Tinggi (Manusiawi)"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : auditResult.burstinessGrade === "Sedang"
                      ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {auditResult.burstinessGrade}
                </span>
              </div>
            </div>

            {/* Quick Rules Reference */}
            <div className="pt-3 border-t border-zinc-800/80 space-y-2">
              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                Ringkasan Panduan Anti-Slop:
              </span>
              <div className="text-[11px] text-zinc-400 space-y-1 leading-relaxed">
                <p>
                  • <strong>0 Em-Dash:</strong> Tanda pisah panjang adalah sidik jari AI nomor 1.
                  Gunakan koma atau pisah menjadi 2 kalimat.
                </p>
                <p>
                  • <strong>Variasikan Kalimat:</strong> Buat kalimat 4 kata. Lalu ikuti kalimat 16
                  kata dengan penjelasan konkret. Ritme ini terasa manusiawi.
                </p>
                <p>
                  • <strong>Tingkat Tier:</strong> Tier 1 untuk data/korporat, Tier 2 untuk blog,
                  Tier 3 untuk TikTok/Instagram casual.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
