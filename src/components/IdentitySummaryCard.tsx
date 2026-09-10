import React, { useState } from "react";
import {
  Check,
  Copy,
  Sparkles,
  MapPin,
  Globe2,
  Users,
  Briefcase,
  ShieldCheck,
  Palette,
  Camera,
  Layers,
  Fingerprint,
  Share2,
  Mic,
  Images,
} from "lucide-react";
import { AIInfluencer } from "../types";

interface IdentitySummaryCardProps {
  influencer: AIInfluencer;
  onGenerateAvatar?: () => void;
  isGeneratingAvatar?: boolean;
  onOpenSocialMeta?: () => void;
  onOpenVoiceover?: () => void;
  onOpenMoodboard?: () => void;
}

export const IdentitySummaryCard: React.FC<IdentitySummaryCardProps> = ({
  influencer,
  onGenerateAvatar,
  isGeneratingAvatar = false,
  onOpenSocialMeta,
  onOpenVoiceover,
  onOpenMoodboard,
}) => {
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyTokens = () => {
    navigator.clipboard.writeText(influencer.visualIdentity.consistencyAnchorTokens);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedHex(color);
    setTimeout(() => setCopiedHex(null), 1500);
  };

  return (
    <div id="identity-summary-card" className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-xl">
      {/* Top Banner Cover */}
      <div className="relative h-36 w-full overflow-hidden bg-gradient-to-r from-zinc-900 via-indigo-950/60 to-purple-950/70 p-6 sm:h-44">
        {/* Abstract Ambient Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent" />
        <div className="absolute right-6 top-6 hidden sm:block">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300 backdrop-blur-md">
            <Fingerprint className="h-3.5 w-3.5 text-indigo-400" />
            Synthetic Persona ID: {influencer.id}
          </span>
        </div>
      </div>

      {/* Profile Header Row */}
      <div className="relative px-6 pb-6 pt-0 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          {/* Avatar & Key Names */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="relative -mt-16 sm:-mt-20">
              <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-4 border-zinc-900 bg-zinc-800 shadow-2xl sm:h-32 sm:w-32">
                <img
                  src={influencer.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"}
                  alt={influencer.name}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
                {isGeneratingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/75 backdrop-blur-xs">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
                  </div>
                )}
              </div>
              {onGenerateAvatar && (
                <button
                  id="btn-reroll-avatar"
                  onClick={onGenerateAvatar}
                  disabled={isGeneratingAvatar}
                  className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-zinc-300 shadow-md transition-transform hover:scale-105 hover:bg-zinc-700 active:scale-95 disabled:opacity-50"
                  title="Generate Avatar AI Baru"
                >
                  <Camera className="h-4 w-4 text-indigo-400" />
                </button>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                  {influencer.name}
                </h1>
                <span className="flex items-center gap-1 rounded-md bg-sky-500/10 px-2 py-0.5 text-xs font-semibold text-sky-400 border border-sky-500/20">
                  <ShieldCheck className="h-3 w-3" />
                  Verified AI
                </span>
                <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                  {influencer.niche}
                </span>
              </div>
              <p className="text-sm font-medium text-zinc-400">
                {influencer.handle} • <span className="text-zinc-300">{influencer.category}</span>
              </p>
              <p className="max-w-2xl text-xs italic text-zinc-300/90 sm:text-sm">
                "{influencer.tagline}"
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 sm:pt-0">
            {onOpenMoodboard && (
              <button
                id="btn-open-moodboard-card"
                onClick={onOpenMoodboard}
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20 hover:text-white shadow-sm"
                title="Buka Moodboard Visual & Galeri Gaya"
              >
                <Images className="h-3.5 w-3.5 text-indigo-400" />
                <span>Moodboard Visual</span>
              </button>
            )}

            {onOpenVoiceover && (
              <button
                id="btn-open-voiceover-card"
                onClick={onOpenVoiceover}
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20 hover:text-white shadow-sm"
                title="Buka Voice-over Studio untuk Karakter Ini"
              >
                <Mic className="h-3.5 w-3.5 text-indigo-400" />
                <span>Naskah Voice-over</span>
              </button>
            )}

            {onOpenSocialMeta && (
              <button
                id="btn-open-social-meta-card"
                onClick={onOpenSocialMeta}
                className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-2 text-xs font-semibold text-purple-300 transition-colors hover:bg-purple-500/20 hover:text-white shadow-sm"
                title="Lihat Pratinjau Kartu Berbagi Media Sosial & Open Graph Meta Tags"
              >
                <Share2 className="h-3.5 w-3.5 text-purple-400" />
                <span>Pratinjau Medsos</span>
              </button>
            )}
          </div>
        </div>

        {/* Demographics & Metadata Matrix */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-zinc-800/80 pt-6 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/50 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <Users className="h-3.5 w-3.5 text-indigo-400" />
              <span>Demografi & Usia</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-zinc-100">
              {influencer.demographics.age} Tahun • {influencer.demographics.gender}
            </p>
            <p className="text-xs text-zinc-400 truncate" title={influencer.demographics.ethnicity}>
              {influencer.demographics.ethnicity}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/50 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <MapPin className="h-3.5 w-3.5 text-rose-400" />
              <span>Lokasi Basis</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-zinc-100">
              {influencer.demographics.baseLocation}
            </p>
            <p className="text-xs text-zinc-400">Global Virtual Presence</p>
          </div>

          <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/50 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <Globe2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Bahasa Komunikasi</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-zinc-100 truncate" title={influencer.demographics.primaryLanguage}>
              {influencer.demographics.primaryLanguage}
            </p>
            <p className="text-xs text-zinc-400 truncate" title={influencer.demographics.secondaryLanguage}>
              {influencer.demographics.secondaryLanguage || "Bilingual Fluent"}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/60 bg-zinc-950/50 p-3.5">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <Briefcase className="h-3.5 w-3.5 text-amber-400" />
              <span>Profesi & Peran</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-zinc-100 truncate" title={influencer.demographics.educationOrOccupation}>
              {influencer.demographics.educationOrOccupation}
            </p>
            <p className="text-xs text-zinc-400">Content Architect</p>
          </div>
        </div>

        {/* Target Audience Note */}
        <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-zinc-800/60 bg-zinc-950/30 p-3 text-xs text-zinc-300">
          <span className="font-semibold text-indigo-400 whitespace-nowrap">Target Audience:</span>
          <span className="text-zinc-300/90">{influencer.demographics.targetAudience}</span>
        </div>

        {/* Visual Identity DNA & Consistency Lock */}
        <div className="mt-6 space-y-4 rounded-xl border border-indigo-900/40 bg-gradient-to-b from-indigo-950/20 via-zinc-950/40 to-zinc-950/60 p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-zinc-100">
                Visual Consistency Lock & LoRA Anchor
              </h3>
            </div>
            <span className="text-xs text-zinc-400">
              Kunci konsistensi wajah untuk NanoBanana, Flux, Seedream, & SDXL
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
            <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800/80">
              <span className="font-medium text-zinc-400">Ciri Khas Wajah:</span>
              <p className="mt-1 font-semibold text-zinc-200 leading-relaxed">
                {influencer.visualIdentity.faceFeatures}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800/80">
              <span className="font-medium text-zinc-400">Gaya & Model Rambut:</span>
              <p className="mt-1 font-semibold text-zinc-200 leading-relaxed">
                {influencer.visualIdentity.hairStyle}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800/80">
              <span className="font-medium text-zinc-400">Postur & Body Type:</span>
              <p className="mt-1 font-semibold text-zinc-200 leading-relaxed">
                {influencer.visualIdentity.bodyType}
              </p>
            </div>
            <div className="rounded-lg bg-zinc-900/80 p-3 border border-zinc-800/80">
              <span className="font-medium text-zinc-400">Signature Fashion Style:</span>
              <p className="mt-1 font-semibold text-zinc-200 leading-relaxed">
                {influencer.visualIdentity.signatureStyle}
              </p>
            </div>
          </div>

          {/* Color Palette */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400">
              <Palette className="h-3.5 w-3.5 text-indigo-400" />
              <span>Palet Warna Brand:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {influencer.visualIdentity.colorPalette.map((color, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopyColor(color)}
                  className="group relative flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] font-mono font-medium text-zinc-300 transition-all hover:border-zinc-500"
                  title="Klik untuk salin kode HEX"
                >
                  <span
                    className="h-3 w-3 rounded-full border border-black/30 shadow-xs"
                    style={{ backgroundColor: color }}
                  />
                  <span>{copiedHex === color ? "Tersalin!" : color}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Consistency Anchor Prompt Tokens Box */}
          <div className="mt-2 rounded-lg border border-indigo-500/30 bg-zinc-950 p-3.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-indigo-300">
                Anchor Prompt Tokens (Sematkan di awal setiap pembuatan prompt):
              </span>
              <button
                id="btn-copy-anchor-tokens"
                onClick={handleCopyTokens}
                className="flex items-center gap-1 rounded bg-indigo-600/20 px-2.5 py-1 text-xs font-medium text-indigo-300 border border-indigo-500/30 transition-colors hover:bg-indigo-600/30"
              >
                {copiedToken ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-300">Tersalin ke Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Salin Anchor Tokens</span>
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 rounded bg-zinc-900/90 p-2.5 font-mono text-xs text-zinc-300 select-all border border-zinc-800">
              {influencer.visualIdentity.consistencyAnchorTokens}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
