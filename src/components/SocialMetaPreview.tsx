import React, { useState, useEffect } from "react";
import {
  Share2,
  Globe2,
  Copy,
  Check,
  RefreshCw,
  Eye,
  Code2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  MessageCircle,
  Twitter,
  Image as ImageIcon,
  Layers,
  Send,
  Sliders,
  ShieldCheck,
} from "lucide-react";
import { AIInfluencer, SocialMetaConfig } from "../types";
import {
  buildDefaultSocialMeta,
  injectOpenGraphMetaTags,
  readLiveHeadMetaTags,
  generateRawMetaHtml,
} from "../utils/metaTags";

interface SocialMetaPreviewProps {
  influencer: AIInfluencer;
}

type PlatformTab = "twitter" | "facebook" | "whatsapp" | "discord" | "google" | "rawHtml";

export const SocialMetaPreview: React.FC<SocialMetaPreviewProps> = ({ influencer }) => {
  const [activePlatform, setActivePlatform] = useState<PlatformTab>("twitter");
  const [metaConfig, setMetaConfig] = useState<SocialMetaConfig>(() =>
    buildDefaultSocialMeta(influencer)
  );
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [justInjected, setJustInjected] = useState(false);
  const [liveHeadTags, setLiveHeadTags] = useState<
    Array<{ key: string; isProperty: boolean; content: string }>
  >([]);

  // Perbarui saat active influencer berubah
  useEffect(() => {
    const nextConfig = buildDefaultSocialMeta(influencer);
    setMetaConfig(nextConfig);
    injectOpenGraphMetaTags(nextConfig);
    setLiveHeadTags(readLiveHeadMetaTags());
  }, [influencer.id]);

  // Handle live form field change
  const handleChange = (field: keyof SocialMetaConfig, value: string) => {
    const updated = { ...metaConfig, [field]: value };
    setMetaConfig(updated);
    // Injeksi dinamis langsung ke document.head
    injectOpenGraphMetaTags(updated);
    setLiveHeadTags(readLiveHeadMetaTags());
  };

  const handleResetToDefault = () => {
    const defaultConfig = buildDefaultSocialMeta(influencer);
    setMetaConfig(defaultConfig);
    injectOpenGraphMetaTags(defaultConfig);
    setLiveHeadTags(readLiveHeadMetaTags());
    setJustInjected(true);
    setTimeout(() => setJustInjected(false), 2000);
  };

  const handleManualInject = () => {
    injectOpenGraphMetaTags(metaConfig);
    setLiveHeadTags(readLiveHeadMetaTags());
    setJustInjected(true);
    setTimeout(() => setJustInjected(false), 2000);
  };

  const handleCopyRawHtml = () => {
    const raw = generateRawMetaHtml(metaConfig);
    navigator.clipboard.writeText(raw);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleCopyShareUrl = () => {
    navigator.clipboard.writeText(metaConfig.pageUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Pilih gambar dari paket prompt influencer
  const availableImages = [
    { label: "Avatar Utama", url: influencer.avatarUrl || "" },
    {
      label: "Foto Potret",
      url: influencer.promptPackages?.package1_portrait?.sampleImage || "",
    },
    {
      label: "Foto Aktivitas",
      url: influencer.promptPackages?.package2_lifestyle?.sampleImage || "",
    },
    {
      label: "Foto Komersial",
      url: influencer.promptPackages?.package3_brandEditorial?.sampleImage || "",
    },
  ].filter((img) => Boolean(img.url));

  const domainName = (() => {
    try {
      const parsed = new URL(metaConfig.pageUrl);
      return parsed.hostname;
    } catch {
      return "ai-influencer-builder.app";
    }
  })();

  const brandColor =
    influencer.visualIdentity?.colorPalette?.[0] || "#6366f1";

  return (
    <div id="social-meta-preview-module" className="space-y-8 pb-12">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-indigo-950/40 via-zinc-950 to-zinc-900 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <Share2 className="h-3.5 w-3.5 text-indigo-400" />
              <span>Utilitas Open Graph & Twitter Cards</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Pratinjau Berbagi Media Sosial & Injeksi Meta Tags
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Pantau tampilan tautan profil influencer saat dibagikan ke X, Facebook, LinkedIn, WhatsApp, atau Discord. Tag Open Graph diinjeksi secara dinamis ke elemen head peramban.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>Live DOM Head Sync: Aktif</span>
            </div>

            <button
              id="btn-copy-raw-html-header"
              onClick={handleCopyRawHtml}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 hover:text-white transition-colors"
            >
              {copiedHtml ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Tag Tersalin!</span>
                </>
              ) : (
                <>
                  <Code2 className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Salin Tag HTML</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Config Panel + Right Live Mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Meta Tag Configuration (lg:col-span-5) */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 p-5 sm:p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-400" />
                <h2 className="text-sm font-bold text-zinc-100">
                  Konfigurasi Meta Tag Dinamis
                </h2>
              </div>
              <button
                id="btn-reset-meta"
                onClick={handleResetToDefault}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-indigo-300 transition-colors"
                title="Kembalikan ke data asli influencer"
              >
                <RefreshCw className="h-3 w-3" />
                <span>Reset Asli</span>
              </button>
            </div>

            {/* Field: Title */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="meta-title" className="font-medium text-zinc-300">
                  Judul Tautan (og:title / twitter:title)
                </label>
                <span
                  className={`text-[10px] ${
                    metaConfig.title.length > 70 ? "text-amber-400" : "text-zinc-500"
                  }`}
                >
                  {metaConfig.title.length}/70 kar
                </span>
              </div>
              <input
                id="meta-title"
                type="text"
                value={metaConfig.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                placeholder="Judul profil saat link dibagikan..."
              />
            </div>

            {/* Field: Description */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <label htmlFor="meta-description" className="font-medium text-zinc-300">
                  Deskripsi Singkat (og:description / twitter:description)
                </label>
                <span
                  className={`text-[10px] ${
                    metaConfig.description.length > 160
                      ? "text-amber-400"
                      : "text-zinc-500"
                  }`}
                >
                  {metaConfig.description.length}/160 kar
                </span>
              </div>
              <textarea
                id="meta-description"
                rows={3}
                value={metaConfig.description}
                onChange={(e) => handleChange("description", e.target.value)}
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors leading-relaxed"
                placeholder="Ringkasan tentang persona influencer..."
              />
              <p className="text-[10px] text-zinc-500">
                Disarankan 110 sampai 160 karakter agar tidak terpotong di layar ponsel.
              </p>
            </div>

            {/* Field: Image URL */}
            <div className="space-y-2">
              <label htmlFor="meta-image" className="block text-xs font-medium text-zinc-300">
                URL Gambar Pratinjau (og:image / twitter:image)
              </label>
              <div className="flex gap-2">
                <input
                  id="meta-image"
                  type="text"
                  value={metaConfig.imageUrl}
                  onChange={(e) => handleChange("imageUrl", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                  placeholder="https://..."
                />
              </div>

              {/* Quick Image Selectors */}
              {availableImages.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] text-zinc-400 block">
                    Pilih Gambar dari Profil Influencer:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {availableImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleChange("imageUrl", img.url)}
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                          metaConfig.imageUrl === img.url
                            ? "border-indigo-500 bg-indigo-500/20 text-indigo-200"
                            : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                        }`}
                      >
                        <ImageIcon className="h-3 w-3" />
                        <span>{img.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Field: Card Type & Creator */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <label htmlFor="meta-card-type" className="text-xs font-medium text-zinc-300 block">
                  Tipe Kartu Twitter
                </label>
                <select
                  id="meta-card-type"
                  value={metaConfig.cardType}
                  onChange={(e) =>
                    handleChange(
                      "cardType",
                      e.target.value as "summary_large_image" | "summary"
                    )
                  }
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500"
                >
                  <option value="summary_large_image">Large Image (Besar)</option>
                  <option value="summary">Summary (Kecil)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="meta-creator" className="text-xs font-medium text-zinc-300 block">
                  Handle Kreator
                </label>
                <input
                  id="meta-creator"
                  type="text"
                  value={metaConfig.creatorHandle}
                  onChange={(e) => handleChange("creatorHandle", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500"
                  placeholder="@handle"
                />
              </div>
            </div>

            {/* Field: Site Name & Page URL */}
            <div className="space-y-1.5">
              <label htmlFor="meta-page-url" className="text-xs font-medium text-zinc-300 block">
                URL Halaman Bersama (og:url)
              </label>
              <div className="flex gap-2">
                <input
                  id="meta-page-url"
                  type="text"
                  value={metaConfig.pageUrl}
                  onChange={(e) => handleChange("pageUrl", e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-indigo-500"
                />
                <button
                  id="btn-copy-share-url"
                  type="button"
                  onClick={handleCopyShareUrl}
                  className="shrink-0 px-3 py-2 rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-medium text-zinc-300 hover:text-white"
                  title="Salin Link"
                >
                  {copiedUrl ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {/* Live Action Status */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
              <button
                id="btn-manual-inject-meta"
                type="button"
                onClick={handleManualInject}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm active:scale-95"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{justInjected ? "Tersinkron ke Head!" : "Sinkronkan Ulang ke DOM"}</span>
              </button>

              <span className="text-[11px] text-zinc-400">
                {liveHeadTags.length} tag aktif terdeteksi
              </span>
            </div>
          </div>

          {/* Quick External Validators Info */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-2 text-xs text-zinc-400">
            <span className="font-semibold text-zinc-300 block">
              Alat Debugger Resmi Media Sosial:
            </span>
            <p className="text-[11px] leading-relaxed">
              Setelah mempublikasikan tautan profil, kamu bisa memvalidasi tampilan cache menggunakan alat resmi berikut:
            </p>
            <div className="flex flex-col gap-1.5 pt-1">
              <a
                href="https://developers.facebook.com/tools/debug/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 hover:underline text-[11px]"
              >
                <span>Facebook Sharing Debugger</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://cards-dev.twitter.com/validator"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 hover:underline text-[11px]"
              >
                <span>Twitter / X Card Previewer</span>
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="https://www.linkedin.com/post-inspector/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 hover:underline text-[11px]"
              >
                <span>LinkedIn Post Inspector</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Platform Previews & HTML Code View (lg:col-span-7) */}
        <div className="space-y-6 lg:col-span-7">
          {/* Platform Tabs Selector */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900/90 p-1.5">
            <button
              id="tab-preview-twitter"
              onClick={() => setActivePlatform("twitter")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activePlatform === "twitter"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              <Twitter className="h-3.5 w-3.5" />
              <span>X (Twitter)</span>
            </button>

            <button
              id="tab-preview-facebook"
              onClick={() => setActivePlatform("facebook")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activePlatform === "facebook"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Facebook / LinkedIn</span>
            </button>

            <button
              id="tab-preview-whatsapp"
              onClick={() => setActivePlatform("whatsapp")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activePlatform === "whatsapp"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp / Telegram</span>
            </button>

            <button
              id="tab-preview-discord"
              onClick={() => setActivePlatform("discord")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activePlatform === "discord"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Discord Embed</span>
            </button>

            <button
              id="tab-preview-google"
              onClick={() => setActivePlatform("google")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                activePlatform === "google"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>Google SERP</span>
            </button>

            <button
              id="tab-preview-raw"
              onClick={() => setActivePlatform("rawHtml")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ml-auto ${
                activePlatform === "rawHtml"
                  ? "bg-zinc-700 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
              }`}
            >
              <Code2 className="h-3.5 w-3.5" />
              <span>Kode Tag HTML</span>
            </button>
          </div>

          {/* 1. X / Twitter Card Preview */}
          {activePlatform === "twitter" && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-400 flex items-center justify-between">
                <span>Pratinjau Tweet di Linimasa X (Dark Theme):</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  twitter:card = {metaConfig.cardType}
                </span>
              </div>

              {/* Mock Tweet Box */}
              <div className="rounded-2xl border border-zinc-800 bg-black p-4 sm:p-5 shadow-xl text-zinc-100 font-sans max-w-lg mx-auto">
                {/* Author Info */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
                    <img
                      src={
                        influencer.avatarUrl ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
                      }
                      alt="Avatar"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white hover:underline cursor-pointer">
                        {influencer.name}
                      </span>
                      <span className="text-zinc-500 text-xs">
                        @{influencer.handle.replace(/^@/, "")}
                      </span>
                      <span className="text-zinc-600 text-xs">· 1j</span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-200 mt-1 leading-normal">
                      Baru saja merilis persona influencer virtual resmi saya. Simak identitas lengkap, foto pemotretan, dan gaya komunikasi di tautan berikut:
                    </p>
                  </div>
                </div>

                {/* Twitter Shared Card */}
                {metaConfig.cardType === "summary_large_image" ? (
                  <div className="overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-950 transition-all hover:border-zinc-700">
                    <div className="relative aspect-[1.91/1] w-full overflow-hidden bg-zinc-900">
                      <img
                        src={metaConfig.imageUrl}
                        alt="Meta Preview"
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&h=630&q=80";
                        }}
                      />
                    </div>
                    <div className="p-3 bg-zinc-950/90">
                      <span className="text-[11px] text-zinc-500 block truncate">
                        {domainName}
                      </span>
                      <h4 className="font-semibold text-xs sm:text-sm text-zinc-100 line-clamp-1 mt-0.5">
                        {metaConfig.title}
                      </h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5 leading-relaxed">
                        {metaConfig.description}
                      </p>
                    </div>
                  </div>
                ) : (
                  // Summary Small Card Layout
                  <div className="flex overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950">
                    <div className="h-28 w-28 shrink-0 overflow-hidden bg-zinc-900">
                      <img
                        src={metaConfig.imageUrl}
                        alt="Meta Preview"
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-3 flex flex-col justify-center">
                      <span className="text-[10px] text-zinc-500 block">
                        {domainName}
                      </span>
                      <h4 className="font-semibold text-xs text-zinc-100 line-clamp-1">
                        {metaConfig.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                        {metaConfig.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Facebook / LinkedIn Post Preview */}
          {activePlatform === "facebook" && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-400 flex items-center justify-between">
                <span>Pratinjau Tautan di Facebook & LinkedIn Feed:</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  og:title • og:description • og:image
                </span>
              </div>

              {/* Mock FB / LinkedIn Card */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 shadow-xl text-zinc-100 max-w-lg mx-auto space-y-3">
                {/* Author row */}
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                    {influencer.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-200 block">
                      {influencer.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      Baru saja · Publik
                    </span>
                  </div>
                </div>

                <p className="text-xs text-zinc-200">
                  Berikut ringkasan identitas dan persona digital influencer AI kami:
                </p>

                {/* Shared Link Card */}
                <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/90">
                  <div className="aspect-[1.91/1] w-full overflow-hidden bg-zinc-800">
                    <img
                      src={metaConfig.imageUrl}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-3 bg-zinc-900 space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 block">
                      {domainName}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-100 line-clamp-1">
                      {metaConfig.title}
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {metaConfig.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. WhatsApp / Telegram Chat Bubble Preview */}
          {activePlatform === "whatsapp" && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-400 flex items-center justify-between">
                <span>Pratinjau Balon Obrolan WhatsApp / Telegram:</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Chat Bubble Rich Embed
                </span>
              </div>

              {/* Mock WhatsApp Chat Window */}
              <div className="rounded-2xl border border-zinc-800 bg-[#0b141a] p-5 shadow-xl max-w-lg mx-auto">
                <div className="flex justify-end">
                  <div className="max-w-[340px] rounded-2xl rounded-tr-sm bg-[#005c4b] p-2 text-white shadow-md space-y-1.5">
                    {/* Embedded Card */}
                    <div className="overflow-hidden rounded-xl bg-[#025143] border border-[#066554]">
                      <div className="aspect-[1.91/1] w-full overflow-hidden bg-black/30">
                        <img
                          src={metaConfig.imageUrl}
                          alt="WA Meta Preview"
                          className="h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="p-2.5 space-y-0.5">
                        <h4 className="text-xs font-bold text-white line-clamp-1">
                          {metaConfig.title}
                        </h4>
                        <p className="text-[11px] text-zinc-200 line-clamp-2 leading-snug">
                          {metaConfig.description}
                        </p>
                        <span className="text-[10px] text-zinc-300 block pt-0.5 opacity-80">
                          {domainName}
                        </span>
                      </div>
                    </div>

                    {/* Chat Text Link */}
                    <div className="flex items-center justify-between gap-2 px-1 pt-0.5">
                      <a
                        href={metaConfig.pageUrl}
                        onClick={(e) => e.preventDefault()}
                        className="text-xs text-teal-200 underline truncate hover:text-white"
                      >
                        {metaConfig.pageUrl}
                      </a>
                      <span className="text-[10px] text-teal-200 shrink-0 opacity-80">
                        12:45 ✓✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. Discord Rich Embed Preview */}
          {activePlatform === "discord" && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-400 flex items-center justify-between">
                <span>Pratinjau Discord Rich Embed:</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Border Aksen: {brandColor}
                </span>
              </div>

              {/* Mock Discord Chat */}
              <div className="rounded-xl border border-zinc-800 bg-[#313338] p-4 text-[#dbdee1] font-sans max-w-lg mx-auto space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                    AI
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">
                      InfluencerBot
                    </span>
                    <span className="ml-1.5 rounded bg-[#5865f2] px-1 py-0.2 text-[9px] font-bold text-white uppercase">
                      APP
                    </span>
                    <span className="ml-1 text-[10px] text-[#949ba4]">Hari ini pukul 14.10</span>
                  </div>
                </div>

                {/* Embed Container with Left Accent Border */}
                <div
                  className="rounded-lg bg-[#2b2d31] p-3 max-w-sm space-y-2 border-l-4 shadow-md"
                  style={{ borderLeftColor: brandColor }}
                >
                  <span className="text-[11px] text-[#949ba4] block font-medium">
                    {metaConfig.siteName}
                  </span>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="text-xs sm:text-sm font-bold text-[#00a8fc] hover:underline block leading-snug"
                  >
                    {metaConfig.title}
                  </a>
                  <p className="text-xs text-[#dbdee1] leading-relaxed line-clamp-3">
                    {metaConfig.description}
                  </p>
                  <div className="aspect-[1.91/1] w-full overflow-hidden rounded-md bg-black/40">
                    <img
                      src={metaConfig.imageUrl}
                      alt="Discord Preview"
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. Google Search Snippet Preview */}
          {activePlatform === "google" && (
            <div className="space-y-4">
              <div className="text-xs text-zinc-400 flex items-center justify-between">
                <span>Pratinjau Hasil Pencarian Google (SERP):</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  Title Tag & Meta Description
                </span>
              </div>

              {/* Mock Google Result Card */}
              <div className="rounded-xl border border-zinc-800 bg-[#202124] p-5 shadow-xl text-zinc-100 max-w-lg mx-auto space-y-1.5 font-sans">
                <div className="flex items-center gap-2 text-xs text-[#bdc1c6]">
                  <div className="h-4 w-4 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white">
                    G
                  </div>
                  <span className="text-[11px] text-[#bdc1c6] truncate">{domainName}</span>
                  <span className="text-zinc-600">› persona › {influencer.id}</span>
                </div>

                <h3 className="text-sm sm:text-base font-medium text-[#8ab4f8] hover:underline cursor-pointer leading-snug">
                  {metaConfig.title}
                </h3>

                <p className="text-xs text-[#bdc1c6] leading-relaxed line-clamp-2">
                  {metaConfig.description}
                </p>
              </div>
            </div>
          )}

          {/* 6. Raw HTML Code Viewer */}
          {activePlatform === "rawHtml" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Kode Tag HTML Siap Tempel ke &lt;head&gt;:</span>
                <button
                  id="btn-copy-raw-code-tab"
                  onClick={handleCopyRawHtml}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  {copiedHtml ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedHtml ? "Tersalin!" : "Salin Kode"}</span>
                </button>
              </div>

              <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-xs font-mono text-zinc-300 overflow-x-auto shadow-inner">
                <pre className="whitespace-pre">{generateRawMetaHtml(metaConfig)}</pre>
              </div>
            </div>
          )}

          {/* Live DOM Inspector Card */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs sm:text-sm font-bold text-zinc-200">
                  Inspektur Tag Aktif di &lt;head&gt; Peramban
                </h3>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Terverifikasi Nyata
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Daftar tag berikut sedang aktif terinjeksi secara langsung pada objek dokumen halaman web saat ini:
            </p>

            <div className="max-h-48 overflow-y-auto space-y-1 rounded-lg border border-zinc-800/80 bg-zinc-950/80 p-2 text-[11px] font-mono">
              {liveHeadTags.length === 0 ? (
                <span className="text-zinc-500 p-2 block">Memindai tag di head...</span>
              ) : (
                liveHeadTags.map((t, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 px-2 rounded hover:bg-zinc-900"
                  >
                    <span className="text-indigo-300 font-semibold shrink-0">
                      {t.isProperty ? `property="${t.key}"` : `name="${t.key}"`}
                    </span>
                    <span className="text-zinc-400 truncate max-w-sm" title={t.content}>
                      "{t.content}"
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
