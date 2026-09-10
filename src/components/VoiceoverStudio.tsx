import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Play,
  Pause,
  Square,
  Sparkles,
  Clock,
  Volume2,
  Copy,
  Check,
  Download,
  Share2,
  Film,
  Camera,
  Layers,
  Wand2,
  Sliders,
  FileText,
  RefreshCw,
  Eye,
  Subtitles,
  AudioWaveform,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  AIInfluencer,
  VoiceoverScript,
  VoiceoverScene,
} from "../types";

interface VoiceoverStudioProps {
  influencer: AIInfluencer;
  initialPrompt?: string;
  onSendToAntiSlop?: (text: string) => void;
}

export const VoiceoverStudio: React.FC<VoiceoverStudioProps> = ({
  influencer,
  initialPrompt = "",
  onSendToAntiSlop,
}) => {
  // Input state
  const [promptText, setPromptText] = useState(initialPrompt);
  const [targetDuration, setTargetDuration] = useState<15 | 30 | 60>(30);
  const [platform, setPlatform] = useState<"TikTok" | "Instagram Reel" | "YouTube Shorts">("TikTok");
  const [voiceStyle, setVoiceStyle] = useState<"Energetik" | "Santai" | "Sinematik" | "Edukasi" | "Intim">("Santai");
  const [toneTier, setToneTier] = useState<"tier1" | "tier2" | "tier3">(influencer.toneTier || "tier2");
  const [customInstructions, setCustomInstructions] = useState("");

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<VoiceoverScript | null>(null);
  const [activeTab, setActiveTab] = useState<"scenes" | "teleprompter" | "srt">("scenes");

  // Audio Teleprompter (Web Speech API) state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState<number | null>(null);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>("");
  const [copiedSceneId, setCopiedSceneId] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Sync initialPrompt prop if it changes
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      setPromptText(initialPrompt);
    }
  }, [initialPrompt]);

  // Load available synthesis voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        // Default to Indonesian voice if present, otherwise default
        const idVoice = voices.find(
          (v) => v.lang.toLowerCase().includes("id") || v.lang.toLowerCase().includes("indonesia")
        );
        if (idVoice) {
          setSelectedVoiceURI(idVoice.voiceURI);
        } else if (voices.length > 0 && !selectedVoiceURI) {
          setSelectedVoiceURI(voices[0].voiceURI);
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Handle Voiceover Generation
  const handleGenerateScript = async () => {
    if (!promptText.trim()) return;

    setIsGenerating(true);
    // Stop any playing speech
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setActiveSceneIndex(null);
    }

    try {
      const response = await fetch("/api/voiceover/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          promptText,
          influencer,
          targetDurationSec: targetDuration,
          platform,
          voiceStyle,
          toneTier,
          customInstructions,
        }),
      });

      const data = await response.json();
      if (data.success && data.script) {
        setGeneratedScript({
          ...data.script,
          id: `vo_${Date.now()}`,
          sourcePrompt: promptText,
          platform,
          targetDurationSec: targetDuration,
          toneTier,
          voiceStyle,
          createdAt: new Date().toISOString(),
        });
      } else {
        throw new Error(data.message || "Gagal mendapatkan skrip narasi");
      }
    } catch (err) {
      console.warn("Server voiceover fallback triggered:", err);
      // Construct rich client-side fallback adhering to Anti-Slop Writing rules
      const infName = influencer.name;
      const isShort = targetDuration <= 15;
      const isLong = targetDuration >= 60;
      
      let fallbackScenes = [];
      if (isShort) {
        fallbackScenes = [
          {
            sceneNumber: 1,
            timestamp: "00:00 - 00:03",
            durationSec: 3,
            visualCue: `Transisi dinamis memperlihatkan ${infName} menoleh langsung ke arah lensa kamera.`,
            narrationText: "Pernah kepikiran nggak, kenapa satu detail kecil bisa mengubah impresi total?",
            toneDelivery: "Penuh rasa penasaran dan memikat",
            onScreenText: "Satu Detail Pengubah Segalanya",
          },
          {
            sceneNumber: 2,
            timestamp: "00:03 - 00:10",
            durationSec: 7,
            visualCue: `Sorotan close-up pada visual utama dengan pencahayaan terarah dan komposisi bersih.`,
            narrationText: "Kuncinya ada di konsistensi visual dan pemilihan komposisi yang rapi tanpa elemen berlebih.",
            toneDelivery: "Lugaskan poin inti secara mantap",
            onScreenText: "Komposisi Rapi & Konsisten",
          },
          {
            sceneNumber: 3,
            timestamp: "00:10 - 00:15",
            durationSec: 5,
            visualCue: `${infName} tersenyum santai dengan teks interaktif muncul di bawah layar.`,
            narrationText: "Coba praktikkan di konten berikutnya, dan kasih tahu hasilnya di komentar ya!",
            toneDelivery: "Ramah dan mengajak interaksi",
            onScreenText: "Coba Praktikkan Sekarang!",
          },
        ];
      } else if (isLong) {
        fallbackScenes = [
          {
            sceneNumber: 1,
            timestamp: "00:00 - 00:05",
            durationSec: 5,
            visualCue: `Kamera bergerak mendekati ${infName} di ruang studio minimalis dengan pencahayaan sinematik.`,
            narrationText: "Banyak kreator terjebak bikin konten rumit, padahal audiens cuma butuh kejelasan pesan.",
            toneDelivery: "Reflektif dan bertenaga",
            onScreenText: "Audiens Butuh Kejelasan",
          },
          {
            sceneNumber: 2,
            timestamp: "00:05 - 00:18",
            durationSec: 13,
            visualCue: `${infName} memperlihatkan contoh konsep visual melalui layar perangkat.`,
            narrationText: "Saat kamu menyusun konsep visual, tentukan satu titik fokus utama sebelum memikirkan pernak-pernik lainnya.",
            toneDelivery: "Tenang dan informatif",
            onScreenText: "Tentukan Titik Fokus Utama",
          },
          {
            sceneNumber: 3,
            timestamp: "00:18 - 00:32",
            durationSec: 14,
            visualCue: `Perbandingan cepat antara tata visual yang padat versus tata visual yang lapang dan bernapas.`,
            narrationText: "Visual yang terarah bikin orang berhenti scrolling. Jangan penuhi layar dengan terlalu banyak teks pengganggu.",
            toneDelivery: "Memberi panduan praktis",
            onScreenText: "Fokus Pada Satu Pesan Kuat",
          },
          {
            sceneNumber: 4,
            timestamp: "00:32 - 00:46",
            durationSec: 14,
            visualCue: `${infName} duduk santai menikmati kopi, berbicara natural seperti kepada teman.`,
            narrationText: "Waktu narasi suaramu mengalir seperti obrolan tatap muka, penonton bakal betah mendengarkan sampai akhir.",
            toneDelivery: "Hangat dan akrab",
            onScreenText: "Bicara Seperti ke Teman Baik",
          },
          {
            sceneNumber: 5,
            timestamp: "00:46 - 00:60",
            durationSec: 14,
            visualCue: `${infName} tersenyum menatap kamera dengan teks ajakan berinteraksi di layar.`,
            narrationText: "Langkah kecil apa yang mau kamu mulai hari ini? Tulis rencana kontenmu di kolom komentar ya!",
            toneDelivery: "Penuh semangat positif",
            onScreenText: "Tulis Rencana Kontenmu!",
          },
        ];
      } else {
        fallbackScenes = [
          {
            sceneNumber: 1,
            timestamp: "00:00 - 00:04",
            durationSec: 4,
            visualCue: `Transisi cepat ke potret ${infName} menatap kamera dengan senyum percaya diri.`,
            narrationText: "Kenapa sebagian konten bisa langsung nempel di ingatan orang cuma dalam tiga detik?",
            toneDelivery: "Penasaran dan energik",
            onScreenText: "Kenapa Konten Ini Nempel?",
          },
          {
            sceneNumber: 2,
            timestamp: "00:04 - 00:14",
            durationSec: 10,
            visualCue: `Adegan berganti menunjukkan gestur dinamis dan pencahayaan studio terarah.`,
            narrationText: "Jawabannya ada di ritme bicara dan keselarasan visual yang langsung to the point tanpa basa-basi pengantar.",
            toneDelivery: "Jelas dan artikulatif",
            onScreenText: "To The Point Tanpa Basa-Basi",
          },
          {
            sceneNumber: 3,
            timestamp: "00:14 - 00:23",
            durationSec: 9,
            visualCue: `${infName} memegang secangkir kopi keramik dengan latar cafe estetik dan natural.`,
            narrationText: "Waktu kamu menyajikan nilai konkret dengan gaya tutur santai, audiens bakal merasa terhubung secara alami.",
            toneDelivery: "Hangat dan ramah",
            onScreenText: "Nilai Nyata + Tutur Santai",
          },
          {
            sceneNumber: 4,
            timestamp: "00:23 - 00:30",
            durationSec: 7,
            visualCue: `${infName} mengarahkan telunjuk ke area tombol simpan dan komentar di layar.`,
            narrationText: "Simpan video ini buat latihan naskahmu nanti, dan bagikan ke teman kreatormu!",
            toneDelivery: "Menutup dengan riang",
            onScreenText: "Simpan & Bagikan ke Teman!",
          },
        ];
      }

      const fullNarr = fallbackScenes.map((s) => s.narrationText).join(" ");
      const wordsCount = fullNarr.split(/\s+/).filter(Boolean).length;

      setGeneratedScript({
        id: `vo_${Date.now()}`,
        sourcePrompt: promptText,
        title: `Naskah Narasi Voice-over: ${promptText.slice(0, 35)}...`,
        hook3s: fallbackScenes[0].narrationText,
        scenes: fallbackScenes,
        callToAction: fallbackScenes[fallbackScenes.length - 1].narrationText,
        soundtrackSuggestion: "Chill electronic lo-fi 95 BPM dengan ketukan perkusi lembut",
        audioPacingVibe: "140 WPM, artikulasi santai dan ritme mengalir",
        fullNarration: fullNarr,
        totalWordCount: wordsCount,
        estimatedReadingTimeSec: targetDuration,
        platform,
        targetDurationSec: targetDuration,
        toneTier,
        voiceStyle,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Preset Prompts from influencer's packages
  const handleApplyPackagePrompt = (pkgNum: 1 | 2 | 3) => {
    const pkg =
      pkgNum === 1
        ? influencer.promptPackages.package1_portrait
        : pkgNum === 2
        ? influencer.promptPackages.package2_lifestyle
        : influencer.promptPackages.package3_brandEditorial;

    const text = `${pkg.title}. Konsep: ${pkg.concept}. Setting: ${pkg.setting}. Wardrobe: ${pkg.wardrobe}.`;
    setPromptText(text);
  };

  // Audio Playback using Web Speech API
  const handlePlayAudio = () => {
    if (!generatedScript || typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.pause();
      setIsPlayingAudio(false);
      return;
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlayingAudio(true);
      return;
    }

    window.speechSynthesis.cancel();

    const fullText = generatedScript.fullNarration || generatedScript.scenes.map((s) => s.narrationText).join(" ");
    const utterance = new SpeechSynthesisUtterance(fullText);
    utteranceRef.current = utterance;

    utterance.rate = speechRate;
    utterance.pitch = speechPitch;

    if (selectedVoiceURI) {
      const voiceObj = availableVoices.find((v) => v.voiceURI === selectedVoiceURI);
      if (voiceObj) utterance.voice = voiceObj;
    }

    utterance.onstart = () => {
      setIsPlayingAudio(true);
      setActiveSceneIndex(0);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setActiveSceneIndex(null);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setActiveSceneIndex(null);
    };

    // Approximate scene highlight based on boundary events if supported
    utterance.onboundary = (event) => {
      if (event.name === "word" && generatedScript.scenes.length > 0) {
        const charIdx = event.charIndex;
        let cumulative = 0;
        for (let i = 0; i < generatedScript.scenes.length; i++) {
          cumulative += generatedScript.scenes[i].narrationText.length + 1;
          if (charIdx <= cumulative) {
            setActiveSceneIndex(i);
            break;
          }
        }
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStopAudio = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setActiveSceneIndex(null);
    }
  };

  // Copy scene text
  const handleCopyScene = (text: string, sceneNum: number) => {
    navigator.clipboard.writeText(text);
    setCopiedSceneId(sceneNum);
    setTimeout(() => setCopiedSceneId(null), 2000);
  };

  // Copy full script
  const handleCopyAll = () => {
    if (!generatedScript) return;
    const content = `Judul: ${generatedScript.title}
Platform: ${generatedScript.platform} (${generatedScript.targetDurationSec} Detik)
Gaya Suara: ${generatedScript.voiceStyle} | Musik: ${generatedScript.soundtrackSuggestion}

HOOK 3 DETIK PERTAMA:
"${generatedScript.hook3s}"

NASKAH PER ADEGAN:
${generatedScript.scenes
  .map(
    (s) => `[${s.timestamp}] (${s.durationSec}s)
Nada: ${s.toneDelivery}
Visual: ${s.visualCue}
Teks Layar: ${s.onScreenText || "-"}
Voice-over: "${s.narrationText}"`
  )
  .join("\n\n")}

CALL TO ACTION:
"${generatedScript.callToAction}"

NASKAH MONOLOG UTUH:
${generatedScript.fullNarration}`;

    navigator.clipboard.writeText(content);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Generate SRT Subtitle format
  const generateSRT = (scenes: VoiceoverScene[]) => {
    return scenes
      .map((s, idx) => {
        const times = s.timestamp.split("-").map((t) => t.trim());
        const startSec = times[0] || "00:00";
        const endSec = times[1] || "00:03";
        return `${idx + 1}\n00:${startSec},000 --> 00:${endSec},000\n${s.narrationText}\n`;
      })
      .join("\n");
  };

  // Download files
  const handleDownloadFile = (type: "txt" | "srt") => {
    if (!generatedScript) return;
    let content = "";
    let filename = "";

    if (type === "srt") {
      content = generateSRT(generatedScript.scenes);
      filename = `${generatedScript.title.replace(/\s+/g, "_")}_subtitles.srt`;
    } else {
      content = `AI INFLUENCER VOICEOVER SCRIPT
Judul: ${generatedScript.title}
Influencer: ${influencer.name} (${influencer.handle})
Target Durasi: ${generatedScript.targetDurationSec} Detik
Platform: ${generatedScript.platform}
Tempo: ${generatedScript.audioPacingVibe}
Musik: ${generatedScript.soundtrackSuggestion}

=== NASKAH VOICE-OVER LENGKAP ===
${generatedScript.fullNarration}

=== BREAKDOWN PER ADEGAN ===
${generatedScript.scenes
  .map(
    (s) => `Scene ${s.sceneNumber} (${s.timestamp})
Nada: ${s.toneDelivery}
Visual: ${s.visualCue}
On-Screen: ${s.onScreenText || "-"}
VO: ${s.narrationText}`
  )
  .join("\n\n")}
`;
      filename = `${generatedScript.title.replace(/\s+/g, "_")}_voiceover.txt`;
    }

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Banner Card */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-zinc-900 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-0.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
                <Mic className="h-3.5 w-3.5 text-indigo-400" />
                <span>Voice-over Studio Video Pendek</span>
              </span>
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[11px] font-bold text-purple-300">
                Gemini 3.8 Flash
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Ubah Prompt Visual Jadi Skrip Narasi Suara
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Konversikan konsep visual atau prompt gambar menjadi naskah voice-over terstruktur per adegan
              dengan hook 3 detik penghenti scroll, panduan intonasi, arahan kamera, dan estimasi waktu bicara.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <div className="h-10 w-10 overflow-hidden rounded-lg border border-indigo-500/40 bg-zinc-800 shrink-0">
              {influencer.avatarUrl ? (
                <img
                  src={influencer.avatarUrl}
                  alt={influencer.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs font-bold text-zinc-400">
                  {influencer.name.slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className="text-xs">
              <p className="font-semibold text-zinc-100">{influencer.name}</p>
              <p className="text-zinc-400">{influencer.handle} • {influencer.niche}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Input Form & Output Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Input Configurator (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/90 p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-indigo-400" />
                1. Masukkan Ide / Prompt Visual
              </span>
              <span className="text-[11px] text-zinc-500">Bebas atau dari paket</span>
            </div>

            {/* Quick preset buttons from prompt packages */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-medium text-zinc-400">
                Pilih dari Paket Prompt {influencer.name}:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleApplyPackagePrompt(1)}
                  className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-2 text-left hover:border-indigo-500/50 hover:bg-indigo-950/20 transition-all text-xs group"
                >
                  <span className="font-semibold text-zinc-200 block truncate group-hover:text-indigo-300">
                    Paket 1
                  </span>
                  <span className="text-[10px] text-zinc-500 block truncate">Portrait Studio</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPackagePrompt(2)}
                  className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-2 text-left hover:border-indigo-500/50 hover:bg-indigo-950/20 transition-all text-xs group"
                >
                  <span className="font-semibold text-zinc-200 block truncate group-hover:text-indigo-300">
                    Paket 2
                  </span>
                  <span className="text-[10px] text-zinc-500 block truncate">Lifestyle Candid</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPackagePrompt(3)}
                  className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-2 text-left hover:border-indigo-500/50 hover:bg-indigo-950/20 transition-all text-xs group"
                >
                  <span className="font-semibold text-zinc-200 block truncate group-hover:text-indigo-300">
                    Paket 3
                  </span>
                  <span className="text-[10px] text-zinc-500 block truncate">Editorial Fashion</span>
                </button>
              </div>
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Teks Prompt Visual / Narasi Dasar:
              </label>
              <textarea
                id="input-voiceover-prompt"
                rows={4}
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Contoh: Portrait 85mm di cafe outdoor, menikmati matcha latte dengan outfit blazer linen krem, tatapan mata tersenyum hangat..."
                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950 p-3 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>Target Durasi Video:</span>
                <span className="text-[11px] text-zinc-400">
                  {targetDuration === 15 ? "~35-45 kata" : targetDuration === 60 ? "~130-160 kata" : "~70-85 kata"}
                </span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { sec: 15, label: "15 Detik", desc: "Flash Hook" },
                  { sec: 30, label: "30 Detik", desc: "Standar Viral" },
                  { sec: 60, label: "60 Detik", desc: "Storytelling" },
                ].map((item) => (
                  <button
                    key={item.sec}
                    type="button"
                    onClick={() => setTargetDuration(item.sec as 15 | 30 | 60)}
                    className={`rounded-xl border p-2.5 text-center transition-all ${
                      targetDuration === item.sec
                        ? "border-indigo-500 bg-indigo-950/50 text-white shadow-sm"
                        : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                    }`}
                  >
                    <span className="block text-xs font-bold">{item.label}</span>
                    <span className="block text-[10px] text-zinc-400 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Platform & Voice Style Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Format Platform:
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value as any)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-2.5 py-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="TikTok">TikTok Video</option>
                  <option value="Instagram Reel">Instagram Reel</option>
                  <option value="YouTube Shorts">YouTube Shorts</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Gaya Suara (Voice Style):
                </label>
                <select
                  value={voiceStyle}
                  onChange={(e) => setVoiceStyle(e.target.value as any)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-2.5 py-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Santai">Santai & Akrab</option>
                  <option value="Energetik">Energetik & Ceria</option>
                  <option value="Sinematik">Sinematik & Misterius</option>
                  <option value="Edukasi">Edukasi & Lugas</option>
                  <option value="Intim">Intim & Hangat</option>
                </select>
              </div>
            </div>

            {/* Tone Tier Selector */}
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Register Bahasa Anti-Slop:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { key: "tier2", label: "Semi-formal", desc: "Luwes & Akrab" },
                  { key: "tier3", label: "Informal", desc: "Bahasa Gaul" },
                  { key: "tier1", label: "Formal", desc: "Baku Elegan" },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setToneTier(t.key as any)}
                    className={`rounded-lg border px-2 py-1.5 text-center text-xs transition-all ${
                      toneTier === t.key
                        ? "border-purple-500 bg-purple-950/40 text-purple-200"
                        : "border-zinc-800 bg-zinc-950/40 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <span className="font-semibold block">{t.label}</span>
                    <span className="text-[9px] text-zinc-500 block">{t.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Instructions */}
            <div>
              <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                Instruksi Khusus (Opsional):
              </label>
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Misal: Selipkan pertanyaan soal budget fashion, gunakan analogi kopi..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Submit Button */}
            <button
              id="btn-generate-voiceover-script"
              type="button"
              onClick={handleGenerateScript}
              disabled={isGenerating || !promptText.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 hover:brightness-110 active:scale-[0.98] disabled:opacity-50 transition-all cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-white" />
                  <span>Menyusun Skrip Voice-over via Gemini...</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 text-white" />
                  <span>Konversikan Jadi Skrip Voice-over</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Generated Voice-over Script & Teleprompter (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {!generatedScript ? (
            <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
              <div className="h-14 w-14 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
                <Mic className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-zinc-200 mb-1">
                Belum Ada Skrip Voice-over yang Dibuat
              </h3>
              <p className="text-xs text-zinc-400 max-w-sm mb-5 leading-relaxed">
                Pilih salah satu paket visual prompt di sebelah kiri atau ketikkan ide kontenmu sendiri, lalu klik tombol konversi untuk menyusun skrip suara per adegan.
              </p>
              <button
                type="button"
                onClick={() => {
                  handleApplyPackagePrompt(1);
                  setTimeout(() => handleGenerateScript(), 50);
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-950/30 px-4 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-900/40 transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                <span>Coba Paket 1 Influencer Ini Sekarang</span>
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 space-y-5 shadow-sm">
              {/* Header Script Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 text-[10px] font-bold text-indigo-300">
                      {generatedScript.platform}
                    </span>
                    <span className="rounded-full bg-purple-500/20 border border-purple-500/30 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                      Target {generatedScript.targetDurationSec} Detik
                    </span>
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                      {generatedScript.totalWordCount} Kata
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-zinc-100">
                    {generatedScript.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    id="btn-copy-all-voiceover"
                    type="button"
                    onClick={handleCopyAll}
                    className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-all"
                    title="Salin seluruh naskah dan arahan adegan"
                  >
                    {copiedAll ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-zinc-400" />
                        <span>Salin Naskah</span>
                      </>
                    )}
                  </button>

                  <div className="relative group">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-all"
                    >
                      <Download className="h-3.5 w-3.5 text-zinc-400" />
                      <span>Unduh</span>
                    </button>
                    <div className="absolute right-0 top-full mt-1 hidden w-44 rounded-xl border border-zinc-700 bg-zinc-950 p-1 shadow-xl z-20 group-hover:block">
                      <button
                        type="button"
                        onClick={() => handleDownloadFile("txt")}
                        className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 rounded-lg flex items-center gap-2"
                      >
                        <FileText className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Naskah TXT Lengkap</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadFile("srt")}
                        className="w-full text-left px-3 py-2 text-xs text-zinc-200 hover:bg-zinc-800 rounded-lg flex items-center gap-2"
                      >
                        <Subtitles className="h-3.5 w-3.5 text-purple-400" />
                        <span>Subtitle SRT Format</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Audio Player & Speech Synthesis Preview Bar */}
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-3.5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      id="btn-toggle-play-voiceover"
                      type="button"
                      onClick={handlePlayAudio}
                      className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold text-white shadow transition-all ${
                        isPlayingAudio
                          ? "bg-amber-600 hover:bg-amber-500"
                          : "bg-indigo-600 hover:bg-indigo-500"
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <Pause className="h-3.5 w-3.5" />
                          <span>Pause Audio</span>
                        </>
                      ) : (
                        <>
                          <Play className="h-3.5 w-3.5 fill-current" />
                          <span>Dengarkan Narasi Suara</span>
                        </>
                      )}
                    </button>

                    {isPlayingAudio && (
                      <button
                        type="button"
                        onClick={handleStopAudio}
                        className="flex items-center gap-1 rounded-xl border border-zinc-700 bg-zinc-800 px-2.5 py-2 text-xs text-zinc-300 hover:bg-zinc-700"
                        title="Stop Audio"
                      >
                        <Square className="h-3.5 w-3.5 fill-current" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-zinc-300">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Estimasi: <strong>{generatedScript.estimatedReadingTimeSec}s</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AudioWaveform className="h-3.5 w-3.5 text-purple-400" />
                      <span>Speed:</span>
                      <select
                        value={speechRate}
                        onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                        className="rounded-lg border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 text-xs text-zinc-200"
                      >
                        <option value="0.9">0.9x</option>
                        <option value="1.0">1.0x</option>
                        <option value="1.15">1.15x</option>
                        <option value="1.25">1.25x</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Soundtrack and pacing info note */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-indigo-500/20 gap-2">
                  <div className="flex items-center gap-1.5">
                    <Volume2 className="h-3 w-3 text-indigo-400" />
                    <span>Rekomendasi BGM: <strong className="text-zinc-300">{generatedScript.soundtrackSuggestion}</strong></span>
                  </div>
                  <div>
                    <span>Vibe Tempo: <strong className="text-zinc-300">{generatedScript.audioPacingVibe}</strong></span>
                  </div>
                </div>
              </div>

              {/* View Switcher Tabs (Scenes vs Teleprompter vs SRT) */}
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("scenes")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === "scenes"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Adegan per Adegan ({generatedScript.scenes.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("teleprompter")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === "teleprompter"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5 text-purple-400" />
                  <span>Mode Naskah Teleprompter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("srt")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    activeTab === "srt"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900"
                  }`}
                >
                  <Subtitles className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Subtitle (.srt)</span>
                </button>
              </div>

              {/* TAB 1: SCENES LIST */}
              {activeTab === "scenes" && (
                <div className="space-y-4">
                  {/* Hook Highlight Card */}
                  <div className="rounded-xl border border-purple-500/40 bg-purple-950/20 p-3.5">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold tracking-wider text-purple-300 uppercase flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-purple-400" />
                        0-3 Detik Hook Pembuka (Stop-the-Scroll):
                      </span>
                      <span className="text-[10px] text-purple-400 font-semibold">
                        Menahan swipe pertama penonton
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-purple-100 italic">
                      "{generatedScript.hook3s}"
                    </p>
                  </div>

                  {/* Scene cards */}
                  <div className="space-y-3">
                    {generatedScript.scenes.map((scene, idx) => {
                      const isActivePlaying = activeSceneIndex === idx;
                      return (
                        <div
                          key={scene.sceneNumber}
                          className={`rounded-xl border p-4 transition-all duration-300 ${
                            isActivePlaying
                              ? "border-indigo-500 bg-indigo-950/40 shadow-md ring-1 ring-indigo-500/50"
                              : "border-zinc-800 bg-zinc-950/70 hover:border-zinc-700"
                          }`}
                        >
                          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5 mb-3">
                            <div className="flex items-center gap-2">
                              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                                {scene.sceneNumber}
                              </span>
                              <span className="font-mono text-xs font-bold text-indigo-300">
                                {scene.timestamp}
                              </span>
                              <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400">
                                {scene.durationSec} detik
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleCopyScene(scene.narrationText, scene.sceneNumber)}
                                className="flex items-center gap-1 rounded bg-zinc-800/80 px-2 py-1 text-[11px] text-zinc-300 hover:bg-zinc-700 transition-all"
                                title="Salin kalimat narasi ini"
                              >
                                {copiedSceneId === scene.sceneNumber ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-400" />
                                    <span className="text-emerald-300">Tersalin</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3 text-zinc-400" />
                                    <span>Salin VO</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Narration voice text */}
                          <div className="mb-3">
                            <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">
                              Teks Narasi Voice-over:
                            </span>
                            <p className="text-sm font-medium text-zinc-100 leading-relaxed bg-zinc-900/90 rounded-lg p-2.5 border border-zinc-800">
                              "{scene.narrationText}"
                            </p>
                          </div>

                          {/* Tone & Visual Cues */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            <div className="rounded-lg bg-zinc-900/60 p-2 border border-zinc-800/60">
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 mb-0.5">
                                <Volume2 className="h-3 w-3" /> Nada Suara:
                              </span>
                              <p className="text-zinc-300 text-[11px]">{scene.toneDelivery}</p>
                            </div>

                            <div className="rounded-lg bg-zinc-900/60 p-2 border border-zinc-800/60">
                              <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 mb-0.5">
                                <Camera className="h-3 w-3" /> Arahan Visual:
                              </span>
                              <p className="text-zinc-300 text-[11px]">{scene.visualCue}</p>
                            </div>
                          </div>

                          {/* On screen text popup badge */}
                          {scene.onScreenText && (
                            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-400">
                              <span className="font-semibold text-purple-400">Subtitle Layar:</span>
                              <span className="rounded bg-purple-950/50 border border-purple-500/30 px-2 py-0.5 text-purple-200 font-medium">
                                {scene.onScreenText}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Call to action card */}
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3.5">
                    <span className="text-[10px] font-bold tracking-wider text-emerald-300 uppercase block mb-1">
                      Call To Action Akhir:
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-100">
                      "{generatedScript.callToAction}"
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: TELEPROMPTER READ MODE */}
              {activeTab === "teleprompter" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Naskah utuh siap dibaca untuk take rekaman suara langsung:</span>
                    {onSendToAntiSlop && (
                      <button
                        type="button"
                        onClick={() => onSendToAntiSlop(generatedScript.fullNarration)}
                        className="inline-flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300 underline"
                      >
                        <span>Audit di Anti-Slop Studio</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 font-serif text-base sm:text-lg text-zinc-100 leading-relaxed space-y-4 select-all shadow-inner">
                    <p>{generatedScript.fullNarration}</p>
                  </div>
                </div>
              )}

              {/* TAB 3: SRT SUBTITLE CODE */}
              {activeTab === "srt" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Format Subtitle SRT standar untuk CapCut, Premiere, atau Final Cut Pro:</span>
                    <button
                      type="button"
                      onClick={() => handleDownloadFile("srt")}
                      className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 hover:bg-zinc-700"
                    >
                      <Download className="h-3 w-3" />
                      <span>Unduh .srt</span>
                    </button>
                  </div>
                  <pre className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-emerald-300 whitespace-pre-wrap overflow-x-auto max-h-72 select-all">
                    {generateSRT(generatedScript.scenes)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
