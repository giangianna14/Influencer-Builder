# AI Influencer Builder

Platform terpadu untuk merancang persona virtual influencer dari nol. Aplikasi ini menyusun dossier identitas visual lengkap, profil kepribadian, paket prompt multi-generator gambar, otomasi konten berbasis tren pasar, serta editor caption anti-slop dengan gaya bahasa manusiawi.

---

## Fitur Utama

### 1. Perancangan Persona 10 Dimensi
Formulir terstruktur untuk membangun karakter virtual yang konsisten:
- **Identitas Dasar**: Nama panggung, handle media sosial, usia, etnisitas, lokasi kota basis, dan bahasa komunikasi.
- **Profil Kepribadian**: Tipe MBTI, tone of voice, nilai hidup, hobi, dan slogan khas.
- **Niche & Spesialisasi**: Kategori utama (Fashion, Tech, Wellness, Gaming, dll.) beserta sub-topik terperinci.
- **Target Audiens**: Demografi usia, minat spesifik, dan wilayah geografis pengikut.
- **Gaya Busana & Wardrobe**: Signature style, siluet favorit, dan palet pakaian andalan.
- **Anatomi Fisik**: Bentuk rahang, tipe mata, tekstur rambut, postur tubuh, serta tanda lahir atau keunikan fisik.
- **Estetika Visual & Pencahayaan**: Tone warna foto, preferensi rasio golden hour, dan atmosfer latar.
- **Format Konten Andalan**: Reels, photo dump carousel, story kasual, atau podcast visual.
- **Platform Utama**: Instagram, TikTok, X, YouTube, LinkedIn.
- **Tujuan Persona**: Brand ambassador komersial, edukator komunitas, atau persona kreasi seni digital.

### 2. Tiga Paket Prompt Multi-Generator Gambar
Setiap karakter dilengkapi dengan 3 skenario visual utama:
- **Paket 1: Studio Portrait & Signature Headshot** (Profil avatar resolusi tinggi).
- **Paket 2: Lifestyle Candid & On-the-Go Scene** (Aktivitas harian kasual di ruang publik).
- **Paket 3: Editorial High-Fashion / Niche Showcase** (Konsep visual tematik bernilai produksi tinggi).

Tiap paket menyediakan prompt terpisah yang diformulasikan khusus untuk masing-masing mesin generator:
- **NanoBanana**: Struktur tag deskriptif dan bobot detail wajah.
- **Flux**: Prompt natural language dengan deskripsi pencahayaan fotografi analog.
- **Seedream**: Parameter sinematik dan komposisi framing tajam.
- **ChatGPT Image (DALL-E)**: Deskripsi naratif beresolusi detail tanpa teks glitch.
- **Gemini Image**: Pengaturan lighting, kedalaman ruang, dan tekstur kulit fotorealistis.
- **Midjourney**: Prompt ringkas dengan parameter rasio aspek dan gaya render.

Tersedia juga fitur token konsistensi wajah (Consistency Anchor Tokens) yang dapat disalin satu klik untuk menjaga kemiripan wajah di berbagai pose.

### 3. Radar Tren Real-Time & Otomasi Konten
- Mengintegrasikan Google Search Grounding untuk memindai topik viral dan momentum pasar terkini.
- Memproduksi draft naskah konten multi-platform (Instagram Reels, Carousels, TikTok, dan thread X).
- Menyediakan hook pembuka 3 detik pertama yang memikat audiens, panduan adegan visual, caption lengkap, rekomendasi audio, dan tagar relevan.

### 4. Studio Anti-Slop (Anti-Slop Writing Engine v3.0)
Alat bantu khusus untuk membersihkan gaya penulisan agar tidak terbaca seperti hasil cetakan mesin:
- **Skor Audit AI Slop**: Menilai orisinalitas dan keluwesan teks dalam skala 0 sampai 100.
- **Deteksi Keseragaman Ritme (Cadence Uniformity)**: Memindai deretan kalimat berpanjang monoton (17 sampai 23 kata).
- **Inspeksi Tanda Baca**: Mendeteksi dan menghapus em-dash dan en-dash terlarang.
- **Pembersih Kosakata Klise**: Menyaring kata-kata hampa seperti "menyelami", "permadani", "ekosistem", atau pembuka klise "di era modern ini".
- **Pemoles Otomatis**: Menulis ulang teks ke dalam tiga tingkatan tone pilihan (Formal, Semi-formal, atau Santai/Informal).

### 5. Pratinjau Media Sosial & Open Graph Meta Tags
- Simulasi kartu tautan realistis untuk X (Large Image Card), Facebook, LinkedIn, WhatsApp bubble chat, Discord embed, dan Google Search Snippet.
- Injeksi dinamis tag `<meta property="og:...">` dan `<meta name="twitter:...">` ke elemen head peramban secara langsung.
- Fitur salin kode HTML lengkap untuk disematkan ke landing page atau web portofolio influencer.

### 6. Ekspor Dossier Lengkap
Mengekspor seluruh data identitas, prompt visual, dan rencana konten ke berkas Markdown (`.md`) atau JSON terstruktur untuk dokumentasi tim kreatif.

---

## Tumpukan Teknologi

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide React.
- **Backend**: Express, Node.js (ESM), tsx, esbuild.
- **AI & Integrasi Model**:
  - `@google/genai` TypeScript SDK
  - Gemini 3.8 Flash (Penyusunan profil persona, pencarian tren terkini, otomasi konten, dan engine anti-slop)
  - Gemini 3.1 Flash Lite Image (Render pratinjau gambar fotorealistis)
  - Google Search Grounding (Pencarian tren pasar real-time)

---

## Struktur Direktori

```text
├── src/
│   ├── components/
│   │   ├── AntiSlopStudio.tsx            # Alat audit dan pemoles caption anti-slop
│   │   ├── CharacterStudioForm.tsx       # Formulir 10 dimensi builder persona
│   │   ├── Header.tsx                    # Bilah navigasi dan tombol aksi cepat
│   │   ├── IdentitySummaryCard.tsx       # Kartu ringkasan identitas dan token wajah
│   │   ├── InfluencerBuilderModal.tsx    # Modal generator instan AI Influencer
│   │   ├── PersonalityProfileCard.tsx    # Profil MBTI, nilai hidup, dan gaya bicara
│   │   ├── PromptPackagesSection.tsx     # 3 paket visual multi-generator prompt
│   │   ├── RealtimeTrendsAndAutomation.tsx # Radar tren dan generator naskah konten
│   │   ├── SocialMetaPreview.tsx         # Pratinjau tampilan kartu medsos dan meta tag
│   │   └── TutorialGuideView.tsx         # Panduan komprehensif alur kerja builder
│   ├── data/
│   │   └── defaultInfluencers.ts         # Koleksi persona bawaan siap pakai
│   ├── utils/
│   │   └── metaTags.ts                   # Utilitas manipulasi Open Graph tag dinamis
│   ├── types.ts                          # Definisi antarmuka dan tipe TypeScript
│   ├── App.tsx                           # Komponen induk aplikasi
│   ├── main.tsx                          # Titik masuk React
│   └── index.css                         # Impor dan konfigurasi Tailwind CSS
├── server.ts                             # Server Express dan orkestrasi Gemini API
├── anti-slop-skill/                      # Repositori aturan Anti-Slop Writing v3.0
├── metadata.json                         # Metadata aplikasi dan izin peramban
├── package.json                          # Konfigurasi dependensi dan skrip
├── tsconfig.json                         # Konfigurasi kompiler TypeScript
└── vite.config.ts                        # Konfigurasi bundling Vite
```

---

## Panduan Instalasi dan Penggunaan

### 1. Prasyarat Sistem
- Node.js versi 18 atau yang lebih baru.
- npm, pnpm, atau bun sebagai package manager.
- Kunci API Google Gemini (dapatkan dari [Google AI Studio](https://aistudio.google.com)).

### 2. Kloning Repositori
```bash
git clone https://github.com/username/ai-influencer-builder.git
cd ai-influencer-builder
```

### 3. Pasang Dependensi
```bash
npm install
```

### 4. Konfigurasi Lingkungan (.env)
Salin berkas contoh konfigurasi:
```bash
cp .env.example .env
```
Buka berkas `.env` dan masukkan API key Gemini milik Anda:
```env
GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
APP_URL="http://localhost:3000"
```

### 5. Jalankan Mode Pengembangan
```bash
npm run dev
```
Buka peramban di alamat `http://localhost:3000`. Server Express dan bundler Vite akan berjalan bersamaan.

### 6. Build untuk Produksi
```bash
npm run build
npm run start
```
Perintah ini akan mengompilasi aset frontend ke direktori `dist/` dan mem-bundle backend ke `dist/server.cjs` menggunakan esbuild.

---

## Dokumentasi Endpoint API

Server menyediakan sejumlah endpoint backend untuk memproses logika AI dan data:

| Metode | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Mengecek status server dan ketersediaan API key Gemini |
| `POST` | `/api/influencer/build` | Membangun dossier identitas, psikologi, dan paket prompt visual |
| `POST` | `/api/trends/realtime` | Mengambil tren pasar terkini berbasis Google Search Grounding |
| `POST` | `/api/content/automate` | Memproduksi naskah konten otomatis bebas slop berdasarkan tren |
| `POST` | `/api/anti-slop/audit` | Menganalisis teks untuk menghitung skor orisinalitas manusiawi |
| `POST` | `/api/anti-slop/rewrite` | Memoles caption agar terbebas dari klise AI dan dash terlarang |
| `POST` | `/api/influencer/generate-preview-image` | Menghasilkan gambar pratinjau avatar atau visual studio |

---

## Panduan Penulisan Anti-Slop v3.0

Modul ini mengacu pada standar kurasi gaya bahasa alami untuk mencegah tulisan terbaca kaku:
1. **Nol Dash**: Tidak menggunakan em-dash atau en-dash. Gunakan tanda titik, koma, titik dua, atau kurung sebagai penggantinya.
2. **Kaya Variasi Ritme**: Memadukan kalimat ringkas (3 sampai 6 kata) dengan kalimat penjelas (15 sampai 25 kata).
3. **Bebas Kata Pengisi**: Memangkas kata klise seperti "menyoroti", "menggarisbawahi", "berperan penting", "dalam hal ini", dan sejenisnya.
4. **Pembuka Langsung**: Memulai teks dengan fakta konkret atau adegan nyata tanpa pengantar berputar-putar.

---

## Lisensi

Didistribusikan di bawah lisensi MIT. Silakan gunakan dan kembangkan untuk kebutuhan personal maupun komersial.
