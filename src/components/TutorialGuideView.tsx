import React, { useState } from "react";
import {
  BookOpen,
  Sparkles,
  UserCheck,
  Camera,
  Radio,
  ShieldCheck,
  CheckCircle2,
  Download,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  Layers,
  Wand2,
  Copy,
  Check,
  Compass,
} from "lucide-react";

interface TutorialGuideViewProps {
  onNavigateTab: (
    tab: "identity" | "personality" | "prompts" | "trends" | "studio" | "antislop" | "meta"
  ) => void;
  onOpenCreateModal: () => void;
}

export const TutorialGuideView: React.FC<TutorialGuideViewProps> = ({
  onNavigateTab,
  onOpenCreateModal,
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const steps = [
    {
      step: 1,
      title: "Pilih atau Buat Karakter Baru",
      subtitle: "Menyiapkan sosok influencer virtual pertama kamu",
      icon: UserCheck,
      color: "from-indigo-500 to-purple-600",
      content: [
        "Pilih salah satu karakter siap pakai dari menu drop-down di bilah atas. Contohnya Maya Danastri untuk kecantikan, Kenjiro Tanaka untuk gadget, atau Tara Dewantari untuk kebugaran.",
        "Ingin sosok baru? Klik tombol Bangun Persona Baru di pojok kanan atas.",
        "Ketik konsep sederhana sesuai imajinasimu, misalnya: Gadis asal Bandung usia 22 tahun penyuka kopi dan fotografi vintage. Mesin pintar akan otomatis merangkum data fisik, karakter, dan gayanya.",
      ],
      actionText: "Buka Pembuat Karakter",
      action: onOpenCreateModal,
      tip: "Kamu bisa membuat lebih dari satu influencer dan berganti karakter kapan saja lewat menu atas.",
    },
    {
      step: 2,
      title: "Atur Tampilan Fisik dan Gambar Visual",
      subtitle: "Menjaga wajah dan bentuk fisik tetap konsisten di setiap foto",
      icon: Wand2,
      color: "from-purple-500 to-pink-600",
      content: [
        "Buka tab Identitas & Visual untuk melihat ciri khas wajah seperti bentuk mata, hidung, warna kulit, dan rambut.",
        "Di kolom kanan, temukan kotak prompt gambar yang dirancang untuk Midjourney, Stable Diffusion, atau Flux.",
        "Klik tombol Salin Prompt untuk mengambil rumusan visual tersebut, atau tekan Generate Gambar Profil untuk melihat pratinjau avatar langsung di aplikasi ini.",
      ],
      actionText: "Lihat Identitas Visual",
      action: () => onNavigateTab("identity"),
      tip: "Rumus LoRA Anchor dan Negative Prompt sudah otomatis terpasang agar wajah influencer tidak berubah-ubah saat kamu membuat banyak foto.",
    },
    {
      step: 3,
      title: "Tentukan Gaya Bahasa dan Kepribadian",
      subtitle: "Membuat karakter terasa hidup dan akrab saat berinteraksi",
      icon: Compass,
      color: "from-blue-500 to-indigo-600",
      content: [
        "Masuk ke tab Kepribadian & Suara untuk membaca ringkasan bio media sosial dan kisah latar belakang karakter.",
        "Pahami 3 Tingkat Nada Bicara (Tone Tier): Tier 1 untuk gaya formal edukatif, Tier 2 untuk semi-formal yang santai namun sopan, dan Tier 3 untuk gaya obrolan gaul khas video pendek.",
        "Pelajari contoh cara karakter membalas pesan dan komentar pengikutnya agar gaya komunikasimu di media sosial tetap serasi.",
      ],
      actionText: "Buka Tab Kepribadian",
      action: () => onNavigateTab("personality"),
      tip: "Tentukan satu tingkat nada bicara utama agar audiens mudah mengenali ciri khas karaktermu.",
    },
    {
      step: 4,
      title: "Ambil Paket Prompt Pemotretan Siap Pakai",
      subtitle: "3 gaya pemotretan foto untuk berbagai kebutuhan konten",
      icon: Camera,
      color: "from-amber-500 to-orange-600",
      content: [
        "Buka tab 3 Paket Prompt Visual. Di sini tersedia tiga jenis tema pemotretan teruji.",
        "Signature Portrait: Foto close-up untuk foto profil dan materi perkenalan.",
        "Lifestyle In-Action: Foto saat karakter beraktivitas di kafe, kantor, atau jalan raya.",
        "Commercial & Brand Collab: Foto pose memegang produk endorsement untuk kerja sama bisnis.",
        "Cukup tekan tombol Salin Prompt pada kartu yang kamu inginkan, lalu tempelkan ke aplikasi pembuat gambar.",
      ],
      actionText: "Lihat Paket Prompt",
      action: () => onNavigateTab("prompts"),
      tip: "Gunakan rasio foto vertikal (9:16) untuk kebutuhan Instagram Story atau TikTok.",
    },
    {
      step: 5,
      title: "Pantau Tren Viral dan Buat Konten Otomatis",
      subtitle: "Menemukan topik hangat dan meracik draf postingan media sosial",
      icon: Radio,
      color: "from-emerald-500 to-teal-600",
      content: [
        "Klik tab Radar Tren & Otomasi Konten.",
        "Ketik topik atau wilayah yang ingin kamu telusuri, lalu klik tombol Cari Tren.",
        "Pilih salah satu kartu tren yang sedang ramai diperbincangkan netizen.",
        "Klik tombol Generate Konten Otomasi. Dalam beberapa detik, sistem akan menyusun ide video 3 detik pertama, naskah caption lengkap, ajakan bertindak (CTA), serta daftar hashtag yang relevan.",
      ],
      actionText: "Buka Radar Tren",
      action: () => onNavigateTab("trends"),
      tip: "Konten yang terhubung dengan tren hangat di Google Search berpeluang mendapatkan interaksi organik lebih tinggi.",
    },
    {
      step: 6,
      title: "Periksa Mutu Teks di Studio Anti-Slop v3.0",
      subtitle: "Memastikan naskah terdengar alami, bersahabat, dan bebas dari gaya kaku AI",
      icon: ShieldCheck,
      color: "from-purple-500 to-indigo-600",
      content: [
        "Buka tab Studio Anti-Slop v3.0 atau gunakan tombol poles cepat yang ada di bawah setiap draf konten.",
        "Sistem menerapkan aturan ketat Nol Tanda Pisah (Em-Dash) karena tanda baca tersebut adalah tanda khas buatan robot.",
        "Sistem juga mendeteksi kata klise yang membosankan seperti 'menyelami', 'permadani', atau 'memfasilitasi', lalu menggantinya dengan bahasa percakapan sehari-hari.",
        "Pantau skor mutu teks (0 sampai 100). Bila skor masih rendah, klik tombol Poles Otomatis untuk memperhalus tulisan.",
      ],
      actionText: "Buka Studio Anti-Slop",
      action: () => onNavigateTab("antislop"),
      tip: "Pilih Tier 3 bila naskah ditujukan untuk video santai Instagram Reels atau konten TikTok.",
    },
    {
      step: 7,
      title: "Simpan dan Ekspor Berkas Karakter",
      subtitle: "Menyimpan seluruh data persona agar aman dan bisa dibuka kapan saja",
      icon: Download,
      color: "from-cyan-500 to-blue-600",
      content: [
        "Klik tombol Ekspor Dossier di bilah navigasi bagian atas.",
        "Semua data mulai dari ciri fisik, prompt visual, daftar postingan, hingga riwayat tren akan terunduh dalam satu berkas JSON rapi di komputermu.",
        "Kamu bisa menyimpan berkas ini sebagai arsip cadangan atau membagikannya ke rekan tim kontenmu.",
      ],
      actionText: null,
      action: null,
      tip: "Seluruh data juga otomatis tersimpan di peramban web kamu, jadi data tidak akan hilang saat halaman ditutup.",
    },
  ];

  const quickPrompts = [
    {
      title: "Contoh Konsep Influencer Fashion Santai",
      text: "Gadis asal Bandung usia 23 tahun, gaya fashion thrift dan earth tone, hobi mengunjungi kedai kopi vintage, ramah dan suka berbagi tips padu padan baju hemat.",
    },
    {
      title: "Contoh Konsep Influencer Gadget & Reviewer",
      text: "Pemuda usia 26 tahun asal Jakarta, antusias pada ponsel kamera dan laptop gaming, gaya bicara to-the-point tanpa basa-basi, sering menguji ketahanan baterai.",
    },
    {
      title: "Contoh Konsep Influencer Gaya Hidup Sehat",
      text: "Wanita usia 25 tahun pegiat lari maraton dan yoga, suka masak sarapan praktis tinggi protein, selalu membagikan afirmasi positif setiap pagi.",
    },
  ];

  const faqs = [
    {
      q: "Apakah saya harus paham bahasa pemrograman untuk memakai alat ini?",
      a: "Sama sekali tidak. Semua tombol dirancang visual dan mudah dipahami. Kamu cukup mengetik ide singkat atau memilih opsi yang tersedia di layar.",
    },
    {
      q: "Di mana saya memasukkan kode prompt gambar yang sudah disalin?",
      a: "Kamu bisa menempelkan prompt tersebut ke berbagai aplikasi pembuat gambar berbasis AI, seperti Midjourney (ketik /imagine lalu paste), Leonardo AI, Stable Diffusion WebUI, atau SeaArt.",
    },
    {
      q: "Mengapa teks tidak boleh memakai tanda pisah panjang (em-dash)?",
      a: "Tanda pisah panjang (—) sangat jarang digunakan penutur asli bahasa Indonesia dalam percakapan media sosial. Mesin detektor dan pembaca manusia mengenali tanda tersebut sebagai sidik jari tulisan robot. Menggantinya dengan koma atau titik membuat tulisan terasa hangat dan manusiawi.",
    },
    {
      q: "Apakah saya bisa mengubah detail karakter yang sudah jadi?",
      a: "Tentu saja. Kamu bisa masuk ke tab Studio Karakter untuk mengisi formulir 10 parameter mulai dari warna mata, bentuk pakaian, hingga platform utama yang dituju.",
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-indigo-950/40 via-zinc-950 to-zinc-900 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
              <BookOpen className="h-3.5 w-3.5 text-indigo-400" />
              <span>Buku Panduan Pemula</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Langkah Demi Langkah Mengoperasikan AI Influencer Builder
            </h1>
            <p className="max-w-2xl text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Panduan praktis untuk membantu siapa saja merancang model virtual, menyusun prompt visual yang konsisten, membuat ide konten viral, dan memoles tulisan agar terasa alami.
            </p>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              onClick={onOpenCreateModal}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-950/50 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              <span>Mulai Buat Karakter</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7 Steps Cards Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              7 Langkah Menuju Karakter Influencer Siap Tayang
            </h2>
          </div>
          <span className="text-xs text-zinc-400">Ikuti urutan ini untuk hasil optimal</span>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/80 p-5 sm:p-6 transition-all hover:border-zinc-700 hover:bg-zinc-900"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* Step Number & Title */}
                  <div className="flex items-start gap-3.5">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} text-white shadow-md font-bold text-base`}
                    >
                      {item.step}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                          Langkah {item.step}
                        </span>
                        <span className="text-zinc-600">•</span>
                        <span className="text-xs text-zinc-400">{item.subtitle}</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-zinc-100 mt-0.5">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Action Button (if present) */}
                  {item.actionText && item.action && (
                    <button
                      onClick={item.action}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-zinc-200 shadow-sm transition-all hover:bg-zinc-700 hover:text-white shrink-0 self-start"
                    >
                      <span>{item.actionText}</span>
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
                    </button>
                  )}
                </div>

                {/* Content Bullet Points */}
                <div className="mt-4 space-y-2 border-t border-zinc-800/80 pt-4">
                  {item.content.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300 leading-relaxed">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Practical Tip Callout */}
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-indigo-500/20 bg-indigo-950/20 p-2.5 text-xs text-indigo-300">
                  <Lightbulb className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    <strong className="font-semibold text-indigo-200">Tips Praktis:</strong> {item.tip}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Ideas & Prompts Inspiration */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-400" />
          <h3 className="text-sm font-bold text-zinc-200">
            Contoh Ide Cepat untuk Pembuat Karakter Otomatis
          </h3>
        </div>
        <p className="text-xs text-zinc-400">
          Bingung mau mulai dari mana? Kamu bisa menyalin salah satu ide konsep di bawah ini, lalu tempelkan ke jendela pembuatan karakter baru:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickPrompts.map((p, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-lg border border-zinc-800 bg-zinc-950/70 p-3.5 text-xs"
            >
              <div className="space-y-1.5">
                <span className="font-semibold text-zinc-200 block">{p.title}</span>
                <p className="text-zinc-400 leading-relaxed italic">"{p.text}"</p>
              </div>
              <button
                onClick={() => handleCopy(p.text, idx)}
                className="mt-3 flex items-center justify-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800/80 px-2.5 py-1 text-[11px] font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-zinc-400" />
                    <span>Salin Teks Ide</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm sm:text-base font-bold text-zinc-100">
            Pertanyaan yang Sering Diajukan Pemula (FAQ)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-zinc-800 bg-zinc-950/60 p-4 space-y-2 text-xs sm:text-sm"
            >
              <p className="font-semibold text-indigo-300">{faq.q}</p>
              <p className="text-zinc-300 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
