import React from "react";
import { Sparkles, Plus, Download, Radio, UserCheck, Bot, ShieldCheck, BookOpen, Share2 } from "lucide-react";
import { AIInfluencer } from "../types";

interface HeaderProps {
  influencers: AIInfluencer[];
  activeInfluencer: AIInfluencer;
  onSelectInfluencer: (influencer: AIInfluencer) => void;
  onOpenCreateModal: () => void;
  onExportDossier: () => void;
  onOpenGuide?: () => void;
  onOpenSocialMeta?: () => void;
  isTrendsLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  influencers,
  activeInfluencer,
  onSelectInfluencer,
  onOpenCreateModal,
  onExportDossier,
  onOpenGuide,
  onOpenSocialMeta,
  isTrendsLoading = false,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-500 p-0.5 shadow-lg shadow-purple-950/40">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950">
              <Bot className="h-5 w-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white sm:text-lg">
                AI INFLUENCER BUILDER
              </span>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[11px] font-semibold text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
                Studio Pro
              </span>
            </div>
            <p className="hidden text-xs text-zinc-400 sm:block">
              Identity Engine • Multi-Generator Visual Prompts • Real-Time Content
            </p>
          </div>
        </div>

        {/* Right: Influencer Switcher & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Influencer Switcher */}
          <div className="relative flex items-center">
            <label htmlFor="influencer-select" className="sr-only">
              Pilih AI Influencer
            </label>
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/90 px-3 py-1.5 text-xs text-zinc-200 shadow-sm focus-within:border-indigo-500">
              <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
              <select
                id="influencer-select"
                className="bg-transparent font-medium text-zinc-200 outline-none cursor-pointer pr-1"
                value={activeInfluencer.id}
                onChange={(e) => {
                  const selected = influencers.find((inf) => inf.id === e.target.value);
                  if (selected) onSelectInfluencer(selected);
                }}
              >
                {influencers.map((inf) => (
                  <option key={inf.id} value={inf.id} className="bg-zinc-900 text-zinc-100">
                    {inf.name} ({inf.handle})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Anti-Slop Writing v3.0 Status Badge */}
          <div
            className="hidden items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-300 lg:flex"
            title="Anti-Slop Writing v3.0 Aktif: Nol Em-Dash, Nol Klise AI, Cadence Variatif"
          >
            <ShieldCheck className="h-3 w-3 text-purple-400" />
            <span>Anti-Slop v3.0: Aktif</span>
          </div>

          {/* Real-time Status Badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 md:flex">
            <Radio className={`h-3 w-3 ${isTrendsLoading ? "animate-spin text-amber-400" : "animate-pulse text-emerald-400"}`} />
            <span>{isTrendsLoading ? "Scanning Web..." : "Trend Radar Live"}</span>
          </div>

          {/* Panduan Pemula Button */}
          {onOpenGuide && (
            <button
              id="btn-open-guide-header"
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-colors hover:bg-indigo-500/20 hover:text-white"
              title="Lihat Panduan Langkah demi Langkah"
            >
              <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
              <span>Panduan</span>
            </button>
          )}

          {/* Social Meta Preview Button */}
          {onOpenSocialMeta && (
            <button
              id="btn-open-social-meta-header"
              onClick={onOpenSocialMeta}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 transition-colors hover:bg-purple-500/20 hover:text-white"
              title="Pratinjau Tampilan Medsos dan Injeksi Open Graph Meta Tags"
            >
              <Share2 className="h-3.5 w-3.5 text-purple-400" />
              <span>Meta Medsos</span>
            </button>
          )}

          {/* Export Button */}
          <button
            id="btn-export-dossier"
            onClick={onExportDossier}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700 hover:text-white"
            title="Ekspor Dossier Lengkap (JSON & Prompts)"
          >
            <Download className="h-3.5 w-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Ekspor Dossier</span>
          </button>

          {/* New Influencer Builder Button */}
          <button
            id="btn-open-create-modal"
            onClick={onOpenCreateModal}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-950/50 transition-all hover:brightness-110 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Bangun Persona Baru</span>
          </button>
        </div>
      </div>
    </header>
  );
};
