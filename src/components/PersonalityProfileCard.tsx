import React, { useState } from "react";
import {
  Brain,
  Compass,
  MessageSquare,
  Sparkles,
  Heart,
  Quote,
  ShieldAlert,
  ThumbsUp,
  Radio,
  BookOpen,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AIInfluencer } from "../types";

interface PersonalityProfileCardProps {
  influencer: AIInfluencer;
}

export const PersonalityProfileCard: React.FC<PersonalityProfileCardProps> = ({
  influencer,
}) => {
  const [isBackstoryExpanded, setIsBackstoryExpanded] = useState(false);
  const personality = influencer.personalityProfile;

  return (
    <div id="personality-profile-card" className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-6 shadow-xl sm:p-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
              Profil Kepribadian & Brand Soul
            </h2>
            <p className="text-xs text-zinc-400">
              Karakter psikologis, arketipe, gaya tutur bahasa, dan strategi interaksi
            </p>
          </div>
        </div>

        {/* Archetype & MBTI Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-950/40 px-3 py-1 text-xs font-semibold text-purple-300">
            <Compass className="h-3.5 w-3.5 text-purple-400" />
            {personality.archetype}
          </span>
          <span className="inline-flex items-center rounded-lg border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-xs font-semibold text-amber-300">
            MBTI: {personality.mbti}
          </span>
        </div>
      </div>

      {/* Grid: Tone of Voice, Core Values, Hobbies */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Tone of Voice */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
            <MessageSquare className="h-4 w-4 text-sky-400" />
            <span>Tone of Voice (Gaya Bahasa)</span>
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-200 leading-relaxed">
            {personality.toneOfVoice}
          </p>
          {/* Catchphrases */}
          <div className="mt-3.5 border-t border-zinc-800/70 pt-3">
            <span className="text-[11px] font-semibold text-zinc-400 block mb-2">
              Signature Catchphrases:
            </span>
            <div className="space-y-1.5">
              {personality.catchphrases.map((phrase, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-1.5 text-xs text-zinc-300 italic"
                >
                  <Quote className="h-3 w-3 shrink-0 text-sky-400 mt-0.5" />
                  <span>"{phrase}"</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Nilai-Nilai Inti (Core Values)</span>
          </div>
          <ul className="mt-2.5 space-y-2">
            {personality.coreValues.map((val, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-zinc-200">
                <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="leading-snug">{val}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Hobbies & Passion Points */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
            <Heart className="h-4 w-4 text-rose-400" />
            <span>Hobi & Minat Kehidupan</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {personality.hobbies.map((hobby, idx) => (
              <span
                key={idx}
                className="rounded-md border border-zinc-700 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-200"
              >
                {hobby}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Deep Backstory */}
      <div className="mt-5 rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
            <BookOpen className="h-4 w-4 text-indigo-400" />
            <span>Kisah Latar Belakang (Backstory & Lore)</span>
          </div>
          <button
            onClick={() => setIsBackstoryExpanded(!isBackstoryExpanded)}
            className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
          >
            <span>{isBackstoryExpanded ? "Tutup" : "Baca Selengkapnya"}</span>
            {isBackstoryExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
        <div
          className={`mt-2.5 text-xs sm:text-sm leading-relaxed text-zinc-300/90 transition-all ${
            isBackstoryExpanded ? "" : "line-clamp-2"
          }`}
        >
          <p>{personality.backstory}</p>
        </div>
      </div>

      {/* Audience Interaction Strategy & Brand Partnership Rules */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Interaction Strategy */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
            <Radio className="h-4 w-4 text-emerald-400" />
            <span>Playbook Interaksi Audiens</span>
          </div>
          <div className="mt-3 space-y-2.5 text-xs text-zinc-300">
            <div className="rounded-lg bg-zinc-900/60 p-2.5 border border-zinc-800/50">
              <span className="font-semibold text-emerald-400 block mb-0.5">
                Caption Hook Style:
              </span>
              <span>{personality.interactionStrategy.captionHookStyle}</span>
            </div>
            <div className="rounded-lg bg-zinc-900/60 p-2.5 border border-zinc-800/50">
              <span className="font-semibold text-emerald-400 block mb-0.5">
                Vibe Respon DM & Komentar:
              </span>
              <span>{personality.interactionStrategy.dmResponseVibe}</span>
            </div>
            <div className="rounded-lg bg-zinc-900/60 p-2.5 border border-zinc-800/50">
              <span className="font-semibold text-emerald-400 block mb-0.5">
                Teknik Engagement Story:
              </span>
              <span>{personality.interactionStrategy.storyEngagementTechnique}</span>
            </div>
          </div>
        </div>

        {/* Brand Rules */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
            <ThumbsUp className="h-4 w-4 text-amber-400" />
            <span>Pedoman Kolaborasi & Sponsor Brand</span>
          </div>
          <div className="mt-3 space-y-3 text-xs">
            {/* Ideal Sponsors */}
            <div>
              <span className="font-semibold text-emerald-400 flex items-center gap-1 mb-1.5">
                <ThumbsUp className="h-3 w-3" /> Sponsor Brand Ideal:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {personality.brandRules.idealSponsors.map((brand, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 text-emerald-300 text-[11px]"
                  >
                    {brand}
                  </span>
                ))}
              </div>
            </div>

            {/* Forbidden Categories */}
            <div className="border-t border-zinc-800/60 pt-2.5">
              <span className="font-semibold text-rose-400 flex items-center gap-1 mb-1.5">
                <ShieldAlert className="h-3 w-3" /> Kategori Terlarang (Blacklist):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {personality.brandRules.forbiddenCategories.map((bad, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 text-rose-300 text-[11px]"
                  >
                    {bad}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
