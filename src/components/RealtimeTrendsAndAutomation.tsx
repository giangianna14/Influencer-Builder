import React, { useState, useEffect } from "react";
import {
  Radio,
  Sparkles,
  Flame,
  TrendingUp,
  RefreshCw,
  Search,
  Music,
  Hash,
  Send,
  Copy,
  Check,
  Share2,
  Calendar,
  Layers,
  ArrowRight,
  Lightbulb,
  Target,
  FileText,
  Clock,
  Instagram,
  Twitter,
  Video,
  ShieldCheck,
  Zap,
  Wand2,
} from "lucide-react";
import { AIInfluencer, RealtimeTrend, AutomatedContentPost } from "../types";
import { auditAntiSlop, sanitizeAntiSlop } from "../utils/antiSlop";

interface RealtimeTrendsAndAutomationProps {
  influencer: AIInfluencer;
  trends: RealtimeTrend[];
  onDiscoverTrends: (niche: string, region: string) => Promise<void>;
  isDiscoveringTrends: boolean;
  onAutomateContent: (trend: RealtimeTrend) => Promise<void>;
  isAutomatingContent: boolean;
  automatedPosts: AutomatedContentPost[];
}

export const RealtimeTrendsAndAutomation: React.FC<RealtimeTrendsAndAutomationProps> = ({
  influencer,
  trends,
  onDiscoverTrends,
  isDiscoveringTrends,
  onAutomateContent,
  isAutomatingContent,
  automatedPosts,
}) => {
  const [nicheQuery, setNicheQuery] = useState(influencer.niche);
  const [regionQuery, setRegionQuery] = useState("Indonesia & Global");
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [localPosts, setLocalPosts] = useState<AutomatedContentPost[]>(automatedPosts);
  const [polishingPostId, setPolishingPostId] = useState<string | null>(null);

  useEffect(() => {
    setLocalPosts(automatedPosts);
  }, [automatedPosts]);

  const handlePolishPost = async (postId: string, tier: "tier1" | "tier2" | "tier3") => {
    const post = localPosts.find((p) => p.id === postId);
    if (!post) return;
    setPolishingPostId(postId);
    try {
      const res = await fetch("/api/anti-slop/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: post.caption,
          toneTier: tier,
          context: `Caption media sosial untuk influencer ${influencer.name} dalam niche ${influencer.niche}`,
        }),
      });
      const data = await res.json();
      if (data.success && data.rewrittenText) {
        setLocalPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, caption: data.rewrittenText, toneTier: tier }
              : p
          )
        );
      } else {
        const sanitized = sanitizeAntiSlop(post.caption);
        setLocalPosts((prev) =>
          prev.map((p) => (p.id === postId ? { ...p, caption: sanitized, toneTier: tier } : p))
        );
      }
    } catch (err) {
      console.warn("Failed to polish via API, falling back to local sanitize:", err);
      const sanitized = sanitizeAntiSlop(post.caption);
      setLocalPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, caption: sanitized, toneTier: tier } : p))
      );
    } finally {
      setPolishingPostId(null);
    }
  };

  const handleRefreshTrends = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onDiscoverTrends(nicheQuery || influencer.niche, regionQuery);
  };

  const handleCopyCaption = (post: AutomatedContentPost) => {
    const fullText = `${post.caption}\n\n${post.hashtags.join(" ")}`;
    navigator.clipboard.writeText(fullText);
    setCopiedPostId(post.id);
    setTimeout(() => setCopiedPostId(null), 2000);
  };

  const handleCopyVisualPrompt = (post: AutomatedContentPost) => {
    navigator.clipboard.writeText(post.readyVisualPrompt);
    setCopiedPromptId(post.id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const getPlatformIcon = (platform: string) => {
    if (platform.includes("Instagram")) return <Instagram className="h-4 w-4 text-pink-400" />;
    if (platform.includes("TikTok") || platform.includes("YouTube"))
      return <Video className="h-4 w-4 text-rose-400" />;
    if (platform.includes("X") || platform.includes("Twitter"))
      return <Twitter className="h-4 w-4 text-sky-400" />;
    return <Layers className="h-4 w-4 text-indigo-400" />;
  };

  const getMomentumBadge = (momentum: string) => {
    switch (momentum) {
      case "Explosive":
        return (
          <span className="flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/30">
            <Flame className="h-3 w-3 animate-pulse text-rose-400" />
            Explosive
          </span>
        );
      case "High":
        return (
          <span className="flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold text-amber-400 border border-amber-500/30">
            <TrendingUp className="h-3 w-3 text-amber-400" />
            High Momentum
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            Rising
          </span>
        );
    }
  };

  return (
    <div id="realtime-trends-section" className="space-y-8">
      {/* 1. Real-Time Market Trend Radar Panel */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl sm:p-8">
        {/* Header & Controls */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-zinc-800/80 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Radio className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                  Radar Tren Pasar Terkini (Real-Time)
                </h2>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                  Google Search Grounded
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Pindai topik viral, format konten meledak, dan dinamika percakapan netizen hari ini
              </p>
            </div>
          </div>

          {/* Search Query Form */}
          <form onSubmit={handleRefreshTrends} className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs">
              <Search className="h-3.5 w-3.5 text-zinc-500" />
              <input
                type="text"
                value={nicheQuery}
                onChange={(e) => setNicheQuery(e.target.value)}
                placeholder="Niche tren (misal: Fashion, AI)"
                className="w-32 sm:w-44 bg-transparent text-zinc-200 outline-none placeholder:text-zinc-600"
              />
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs">
              <input
                type="text"
                value={regionQuery}
                onChange={(e) => setRegionQuery(e.target.value)}
                placeholder="Wilayah (Indonesia / Global)"
                className="w-28 sm:w-36 bg-transparent text-zinc-200 outline-none placeholder:text-zinc-600"
              />
            </div>
            <button
              id="btn-scan-trends"
              type="submit"
              disabled={isDiscoveringTrends}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 active:scale-95 disabled:opacity-50 transition-all shadow-md shadow-emerald-950/40"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isDiscoveringTrends ? "animate-spin" : ""}`} />
              <span>{isDiscoveringTrends ? "Memindai Tren..." : "Pindai Tren Sekarang"}</span>
            </button>
          </form>
        </div>

        {/* Real-time Trend Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {trends.map((trend) => (
            <div
              key={trend.id}
              className="group flex flex-col justify-between rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-5 transition-all hover:border-zinc-700 hover:shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  {getMomentumBadge(trend.momentum)}
                  <span className="text-[11px] font-medium text-zinc-400">
                    {trend.niche}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                  {trend.title}
                </h3>

                <p className="text-xs text-zinc-300/90 leading-relaxed">
                  {trend.summary}
                </p>

                {/* Viral Angle */}
                <div className="rounded-lg bg-zinc-900/90 p-3 border border-zinc-800/80">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 mb-1">
                    <Lightbulb className="h-3.5 w-3.5" /> Viral Angle untuk AI Influencer:
                  </div>
                  <p className="text-xs text-zinc-200">{trend.viralAngle}</p>
                </div>

                {/* Audio & Hashtags */}
                <div className="flex flex-col gap-2 pt-1 text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <Music className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate text-zinc-300">{trend.audioSuggestion}</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {trend.trendingHashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded bg-zinc-900 px-1.5 py-0.5 text-[10px] text-zinc-400 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button: Automate Content */}
              <div className="mt-5 border-t border-zinc-800/80 pt-3.5">
                <button
                  id={`btn-automate-trend-${trend.id}`}
                  onClick={() => onAutomateContent(trend)}
                  disabled={isAutomatingContent}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {isAutomatingContent ? "Menghasilkan Konten..." : "Otomasi Konten dari Tren Ini"}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Automated Content Production Studio */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl sm:p-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
                Pipeline Konten Otomatis Siap Publikasi
              </h2>
              <p className="text-xs text-zinc-400">
                Konten lengkap dengan 3-second hook, visual prompt siap render, caption, dan CTA terarah
              </p>
            </div>
          </div>

          <span className="text-xs text-zinc-400">
            {localPosts.length} Paket Konten Aktif
          </span>
        </div>

        {localPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-zinc-500">
            <Layers className="h-10 w-10 text-zinc-600 mb-3" />
            <p className="text-sm font-semibold text-zinc-300">Belum ada konten yang di-generate</p>
            <p className="text-xs text-zinc-500 max-w-sm mt-1">
              Pilih salah satu tren pasar di atas dan klik tombol "Otomasi Konten dari Tren Ini" untuk menyusun paket konten viral instan.
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {localPosts.map((post) => (
              <div
                key={post.id}
                className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/80 shadow-md"
              >
                {/* Post Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 bg-zinc-900/70 px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-200 border border-zinc-700">
                      {getPlatformIcon(post.platform)}
                      <span>{post.platform}</span>
                    </span>
                    <span className="rounded-md bg-purple-500/10 px-2.5 py-1 text-xs font-semibold text-purple-300 border border-purple-500/20">
                      Pillar: {post.pillar}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-emerald-400 font-medium bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                      {post.predictedEngagement}
                    </span>
                    <button
                      onClick={() => handleCopyCaption(post)}
                      className="flex items-center gap-1 rounded bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                    >
                      {copiedPostId === post.id ? (
                        <>
                          <Check className="h-3.5 w-3.5" />
                          <span>Caption Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Salin Full Caption</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Post Body Grid */}
                <div className="p-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
                  {/* Left Column: Viral Hook & Visual Prompt (lg:col-span-5) */}
                  <div className="space-y-4 lg:col-span-5 border-b lg:border-b-0 lg:border-r border-zinc-800/80 pb-5 lg:pb-0 lg:pr-5">
                    {/* 3-Second Viral Hook */}
                    <div className="rounded-lg bg-indigo-950/30 p-3.5 border border-indigo-500/20">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 mb-1">
                        <Flame className="h-3.5 w-3.5" />
                        <span>3-Second Hook (Stop the Scroll):</span>
                      </div>
                      <p className="text-sm font-semibold text-zinc-100 leading-snug">
                        "{post.hook3s}"
                      </p>
                    </div>

                    {/* Scene Visual Concept */}
                    <div>
                      <span className="text-xs font-semibold text-zinc-400 block mb-1">
                        Deskripsi Visual / Adegan:
                      </span>
                      <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/60 p-3 rounded-lg border border-zinc-800">
                        {post.visualSceneDescription}
                      </p>
                    </div>

                    {/* Visual Prompt for Generator */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-amber-400">
                          Prompt Visual Siap Render ({post.recommendedGenerator}):
                        </span>
                        <button
                          onClick={() => handleCopyVisualPrompt(post)}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          {copiedPromptId === post.id ? (
                            <span className="text-emerald-400">Tersalin</span>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Salin Prompt</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap rounded-lg bg-zinc-900 p-2.5 font-mono text-[11px] text-zinc-300 border border-zinc-800 select-all max-h-36 overflow-y-auto">
                        {post.readyVisualPrompt}
                      </pre>
                    </div>

                    {/* Audio Suggestion */}
                    <div className="flex items-center gap-2 text-xs text-zinc-400 bg-zinc-900/40 p-2.5 rounded-lg border border-zinc-800">
                      <Music className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <span className="truncate">Audio: <strong className="text-zinc-200">{post.soundtrack}</strong></span>
                    </div>
                  </div>

                  {/* Right Column: Full Caption, CTA, and Hashtags (lg:col-span-7) */}
                  <div className="space-y-4 lg:col-span-7">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1.5">
                        <span className="text-xs font-semibold text-zinc-400">
                          Draft Caption Instagram / TikTok / X:
                        </span>

                        {/* Anti-Slop Audit Indicator */}
                        {(() => {
                          const audit = auditAntiSlop(post.caption);
                          return (
                            <div className="flex items-center gap-1.5">
                              <span
                                className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold border ${
                                  audit.score >= 90
                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                }`}
                                title={`Skor Anti-Slop: ${audit.score}/100. Em-dash: ${audit.dashCount}. Klise: ${audit.bannedWordsFound.length}`}
                              >
                                <ShieldCheck className="h-3 w-3" />
                                <span>Anti-Slop: {audit.score}/100</span>
                              </span>
                              <span className="text-[10px] text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                                {audit.dashCount === 0 ? "0 Em-Dash" : "⚠ Em-Dash"}
                              </span>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="whitespace-pre-wrap rounded-lg bg-zinc-900/90 p-4 text-xs sm:text-sm leading-relaxed text-zinc-200 border border-zinc-800 select-all max-h-64 overflow-y-auto">
                        {post.caption}
                      </div>

                      {/* Anti-Slop Polisher Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mt-2 p-2 rounded-lg bg-indigo-950/20 border border-indigo-500/20">
                        <div className="flex items-center gap-1 text-[11px] text-indigo-300">
                          <Wand2 className="h-3 w-3 text-indigo-400" />
                          <span>Poles Anti-Slop Writing:</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {(["tier1", "tier2", "tier3"] as const).map((t) => (
                            <button
                              key={t}
                              type="button"
                              disabled={polishingPostId === post.id}
                              onClick={() => handlePolishPost(post.id, t)}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                                post.toneTier === t
                                  ? "bg-indigo-600 text-white shadow-sm"
                                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                              }`}
                            >
                              {polishingPostId === post.id ? (
                                <RefreshCw className="h-2.5 w-2.5 animate-spin inline mr-1" />
                              ) : null}
                              {t === "tier1" ? "Tier 1 (Formal)" : t === "tier2" ? "Tier 2 (Semi)" : "Tier 3 (Medsos)"}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Call to Action Highlight */}
                    <div className="rounded-lg bg-emerald-950/20 p-3 border border-emerald-500/20 text-xs">
                      <span className="font-semibold text-emerald-400 block mb-0.5">
                        High-Converting Call to Action (CTA):
                      </span>
                      <span className="text-zinc-200 font-medium">{post.callToAction}</span>
                    </div>

                    {/* Hashtags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.hashtags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="rounded-md bg-zinc-900 px-2 py-0.5 font-mono text-xs text-indigo-400 border border-zinc-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
