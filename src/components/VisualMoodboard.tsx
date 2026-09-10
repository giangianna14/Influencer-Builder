import React, { useState, useMemo, useRef } from "react";
import {
  Images,
  Palette,
  Plus,
  Search,
  Filter,
  Sparkles,
  Star,
  Copy,
  Check,
  Download,
  Trash2,
  UserCheck,
  Mic,
  Maximize2,
  X,
  Camera,
  Upload,
  Layers,
  Tag,
  ArrowRight,
} from "lucide-react";
import { AIInfluencer, MoodboardItem, MoodboardCategory } from "../types";

interface VisualMoodboardProps {
  influencer: AIInfluencer;
  items: MoodboardItem[];
  onAddItem: (item: Omit<MoodboardItem, "id" | "createdAt" | "influencerId">) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onSetAsAvatar: (imageUrl: string) => void;
  onConvertToVoiceover?: (promptText: string) => void;
  onGenerateNewReference?: (prompt: string, category: MoodboardCategory) => Promise<string | null>;
}

const CATEGORY_TABS: { key: MoodboardCategory | "all"; label: string; color: string }[] = [
  { key: "all", label: "Semua Visual", color: "text-zinc-300" },
  { key: "Avatar", label: "Avatar & Headshot", color: "text-sky-400" },
  { key: "Portrait", label: "Potret Editorial", color: "text-indigo-400" },
  { key: "Lifestyle", label: "Aktivitas Harian", color: "text-emerald-400" },
  { key: "Fashion", label: "Gaya & Busana", color: "text-purple-400" },
  { key: "Setting", label: "Lokasi & Latar", color: "text-amber-400" },
  { key: "Aesthetic", label: "Detail & Estetika", color: "text-rose-400" },
];

export const VisualMoodboard: React.FC<VisualMoodboardProps> = ({
  influencer,
  items,
  onAddItem,
  onToggleFavorite,
  onDeleteItem,
  onSetAsAvatar,
  onConvertToVoiceover,
  onGenerateNewReference,
}) => {
  // Filters & State
  const [selectedCategory, setSelectedCategory] = useState<MoodboardCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "title">("newest");

  // Lightbox Modal State
  const [activeLightboxItem, setActiveLightboxItem] = useState<MoodboardItem | null>(null);

  // Add Item Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newCategory, setNewCategory] = useState<MoodboardCategory>("Fashion");
  const [newPrompt, setNewPrompt] = useState("");
  const [newGenerator, setNewGenerator] = useState("Flux.1 Dev");
  const [newNotes, setNewNotes] = useState("");
  const [isGeneratingInModal, setIsGeneratingInModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copied states
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        // Influencer filter
        if (item.influencerId !== influencer.id) return false;
        // Category filter
        if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
        // Favorites filter
        if (onlyFavorites && !item.isFavorite) return false;
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchPrompt = (item.promptUsed || "").toLowerCase().includes(q);
          const matchNotes = (item.notes || "").toLowerCase().includes(q);
          const matchGen = (item.sourceGenerator || "").toLowerCase().includes(q);
          if (!matchTitle && !matchPrompt && !matchNotes && !matchGen) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "oldest") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return a.title.localeCompare(b.title);
      });
  }, [items, influencer.id, selectedCategory, onlyFavorites, searchQuery, sortBy]);

  // Quick stats
  const totalAssets = items.filter((it) => it.influencerId === influencer.id).length;
  const favoriteCount = items.filter((it) => it.influencerId === influencer.id && it.isFavorite).length;

  const handleCopyPrompt = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1800);
  };

  // Handle local image upload via file reader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit new item
  const handleSaveNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl.trim()) return;

    onAddItem({
      title: newTitle.trim(),
      imageUrl: newImageUrl.trim(),
      category: newCategory,
      promptUsed: newPrompt.trim() || undefined,
      sourceGenerator: newGenerator,
      colorPalette: influencer.visualIdentity.colorPalette.slice(0, 3),
      notes: newNotes.trim() || undefined,
      isFavorite: false,
    });

    // Reset and close
    setNewTitle("");
    setNewImageUrl("");
    setNewPrompt("");
    setNewNotes("");
    setIsAddModalOpen(false);
  };

  // Quick AI Generate inside modal
  const handleQuickGenerate = async () => {
    if (!onGenerateNewReference) return;
    const basePrompt = newPrompt.trim()
      ? newPrompt
      : `High-end aesthetic visual reference of ${influencer.name} for ${newCategory}, ${influencer.visualIdentity.consistencyAnchorTokens}, ${influencer.visualIdentity.signatureStyle}, studio lighting, masterwork photography, 8k resolution`;
    
    setIsGeneratingInModal(true);
    try {
      const generatedUrl = await onGenerateNewReference(basePrompt, newCategory);
      if (generatedUrl) {
        setNewImageUrl(generatedUrl);
        if (!newPrompt.trim()) {
          setNewPrompt(basePrompt);
        }
      }
    } catch (err) {
      console.warn("Moodboard generation error:", err);
    } finally {
      setIsGeneratingInModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Stats */}
      <div className="rounded-2xl border border-zinc-800/90 bg-gradient-to-br from-zinc-900 via-zinc-900/90 to-zinc-950 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-400 border border-indigo-500/20">
                <Images className="h-3.5 w-3.5" />
                Moodboard Visual & Galeri Gaya
              </span>
              <span className="rounded-full bg-zinc-800/80 px-2.5 py-0.5 text-xs font-medium text-zinc-400 border border-zinc-700/60">
                {influencer.name} ({influencer.handle})
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Papan Moodboard & Konsistensi Gaya Karakter
            </h2>
            <p className="max-w-2xl text-xs sm:text-sm text-zinc-400">
              Kumpulan avatar studio, foto pemotretan, dan referensi busana yang menjaga bentuk fisik, ekspresi wajah, serta estetika visual influencer tetap serasi di setiap platform.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="btn-open-add-moodboard-modal"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-900/30 transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Tambah Referensi Visual</span>
            </button>
          </div>
        </div>

        {/* Stats Matrix & Signature Palette */}
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-zinc-800/80 pt-5 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3.5">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <Images className="h-3.5 w-3.5 text-indigo-400" />
              <span>Total Aset Visual</span>
            </div>
            <p className="mt-1.5 text-lg sm:text-xl font-bold text-white">
              {totalAssets} <span className="text-xs font-normal text-zinc-400">Foto & Render</span>
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3.5">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <Star className="h-3.5 w-3.5 text-amber-400" />
              <span>Visual Favorit</span>
            </div>
            <p className="mt-1.5 text-lg sm:text-xl font-bold text-amber-300">
              {favoriteCount} <span className="text-xs font-normal text-zinc-400">Disematkan</span>
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3.5">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Avatar Aktif</span>
            </div>
            <p className="mt-1.5 text-xs font-semibold text-zinc-200 truncate" title={influencer.name}>
              {influencer.name}
            </p>
            <p className="text-[11px] text-zinc-400">Rasio Utama 1:1</p>
          </div>

          <div className="rounded-xl border border-zinc-800/70 bg-zinc-950/40 p-3.5">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-400">
              <Palette className="h-3.5 w-3.5 text-pink-400" />
              <span>Palet Warna Utama</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5">
              {influencer.visualIdentity.colorPalette.map((hex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCopyColor(hex)}
                  title={`Salin Hex: ${hex}`}
                  className="group relative h-5 w-5 rounded-full border border-zinc-700 transition-transform hover:scale-110 active:scale-95"
                  style={{ backgroundColor: hex }}
                >
                  <span className="sr-only">{hex}</span>
                </button>
              ))}
              {copiedHex && (
                <span className="text-[10px] font-bold text-emerald-400 ml-1">Tersalin!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.key}
              id={`tab-cat-${cat.key}`}
              onClick={() => setSelectedCategory(cat.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                selectedCategory === cat.key
                  ? "bg-zinc-800 text-white shadow-sm border border-zinc-700 font-semibold"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              <span className={selectedCategory === cat.key ? cat.color : ""}>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Right side controls: Search, Favorite filter, Sort */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative min-w-[200px] flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              id="input-search-moodboard"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari visual, prompt, model..."
              className="w-full rounded-lg border border-zinc-700/80 bg-zinc-950/60 pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Only Favorites Button */}
          <button
            id="btn-filter-favorites"
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors ${
              onlyFavorites
                ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                : "border-zinc-700/70 bg-zinc-800/60 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${onlyFavorites ? "fill-amber-400 text-amber-400" : ""}`} />
            <span>Favorit</span>
          </button>

          {/* Sort Dropdown */}
          <select
            id="select-moodboard-sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-zinc-700/80 bg-zinc-950/80 px-2.5 py-1.5 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
            <option value="title">Nama Judul</option>
          </select>
        </div>
      </div>

      {/* Masonry-Style Gallery Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-800/80 text-zinc-500">
            <Images className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-zinc-200">
            Tidak Ada Referensi Visual Ditemukan
          </h3>
          <p className="mx-auto mt-1 max-w-md text-xs text-zinc-400">
            {searchQuery || selectedCategory !== "all" || onlyFavorites
              ? "Coba ubah kata kunci pencarian atau setel ulang filter kategori untuk melihat aset lainnya."
              : "Mulai bangun moodboard karakter dengan menambahkan referensi foto atau membuat render visual pertama."}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            {(searchQuery || selectedCategory !== "all" || onlyFavorites) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setOnlyFavorites(false);
                }}
                className="rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700"
              >
                Setel Ulang Filter
              </button>
            )}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
            >
              Tambah Referensi Baru
            </button>
          </div>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 xl:columns-4 gap-4 space-y-4">
          {filteredItems.map((item) => {
            const isCurrentAvatar = influencer.avatarUrl === item.imageUrl;

            return (
              <div
                key={item.id}
                id={`moodboard-card-${item.id}`}
                className="break-inside-avoid group relative rounded-2xl border border-zinc-800/80 bg-zinc-900/70 overflow-hidden transition-all duration-300 hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-950/20"
              >
                {/* Image Container with Hover Overlays */}
                <div className="relative overflow-hidden bg-zinc-950">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay for Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="pointer-events-auto rounded-md bg-zinc-950/80 px-2 py-0.5 text-[10px] font-bold text-zinc-300 backdrop-blur-md border border-zinc-700/60 shadow-sm">
                      {item.category}
                    </span>

                    <div className="flex items-center gap-1.5 pointer-events-auto">
                      {isCurrentAvatar && (
                        <span className="flex items-center gap-1 rounded-md bg-emerald-500/90 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                          <UserCheck className="h-3 w-3" />
                          Avatar Aktif
                        </span>
                      )}
                      <button
                        id={`btn-fav-${item.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(item.id);
                        }}
                        className={`flex h-7 w-7 items-center justify-center rounded-lg backdrop-blur-md transition-colors ${
                          item.isFavorite
                            ? "bg-amber-500/90 text-white shadow-md shadow-amber-900/40"
                            : "bg-zinc-900/80 text-zinc-400 hover:text-white border border-zinc-700/60"
                        }`}
                        title={item.isFavorite ? "Hapus dari favorit" : "Tandai sebagai favorit"}
                      >
                        <Star className={`h-3.5 w-3.5 ${item.isFavorite ? "fill-white" : ""}`} />
                      </button>
                    </div>
                  </div>

                  {/* Hover Quick Action Toolbar */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center gap-1.5">
                      <button
                        id={`btn-lightbox-${item.id}`}
                        onClick={() => setActiveLightboxItem(item)}
                        className="flex items-center gap-1 rounded-lg bg-zinc-900/90 px-2.5 py-1.5 text-xs font-semibold text-zinc-100 backdrop-blur-md hover:bg-zinc-800 border border-zinc-700/80 shadow-md"
                        title="Buka Pratinjau Penuh & Detail Prompt"
                      >
                        <Maximize2 className="h-3.5 w-3.5 text-indigo-400" />
                        <span>Detail</span>
                      </button>

                      {item.promptUsed && (
                        <button
                          id={`btn-copy-prompt-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopyPrompt(item.id, item.promptUsed!);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-900/90 text-zinc-300 backdrop-blur-md hover:bg-zinc-800 border border-zinc-700/80 shadow-md"
                          title="Salin Rumusan Prompt Gambar"
                        >
                          {copiedPromptId === item.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isCurrentAvatar && (
                        <button
                          id={`btn-set-avatar-${item.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSetAsAvatar(item.imageUrl);
                          }}
                          className="flex items-center gap-1 rounded-lg bg-emerald-600/90 px-2 py-1.5 text-[11px] font-semibold text-white backdrop-blur-md hover:bg-emerald-500 shadow-md"
                          title="Jadikan Gambar Profil Utama"
                        >
                          <UserCheck className="h-3 w-3" />
                          <span>Pilih Avatar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Content Footer */}
                <div className="p-3.5 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-zinc-200 line-clamp-1" title={item.title}>
                      {item.title}
                    </h4>
                    {item.sourceGenerator && (
                      <span className="shrink-0 rounded bg-zinc-800/80 px-1.5 py-0.5 text-[9px] font-medium text-zinc-400 border border-zinc-700/50">
                        {item.sourceGenerator}
                      </span>
                    )}
                  </div>

                  {item.notes && (
                    <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                      {item.notes}
                    </p>
                  )}

                  {/* Swatches & Actions Bottom Line */}
                  <div className="flex items-center justify-between border-t border-zinc-800/60 pt-2 text-[10px] text-zinc-400">
                    <div className="flex items-center gap-1">
                      {(item.colorPalette || influencer.visualIdentity.colorPalette.slice(0, 3)).map(
                        (hex, idx) => (
                          <span
                            key={idx}
                            className="h-2.5 w-2.5 rounded-full border border-zinc-700"
                            style={{ backgroundColor: hex }}
                            title={hex}
                          />
                        )
                      )}
                    </div>

                    <span className="text-[10px] text-zinc-400">
                      {new Date(item.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeLightboxItem && (
        <div
          id="modal-moodboard-lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setActiveLightboxItem(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-700/80 bg-zinc-900 shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              id="btn-close-lightbox"
              onClick={() => setActiveLightboxItem(null)}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950/80 text-zinc-400 hover:text-white border border-zinc-700"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Left: Image View */}
            <div className="relative flex-1 bg-black flex items-center justify-center p-4 min-h-[320px] md:min-h-[500px]">
              <img
                src={activeLightboxItem.imageUrl}
                alt={activeLightboxItem.title}
                className="max-h-[75vh] w-full object-contain rounded-lg"
              />
            </div>

            {/* Right: Metadata & Actions Sidebar */}
            <div className="w-full md:w-80 lg:w-96 flex flex-col justify-between border-t md:border-t-0 md:border-l border-zinc-800 p-5 space-y-4 overflow-y-auto max-h-[85vh]">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-indigo-500/10 px-2 py-0.5 text-[11px] font-bold text-indigo-400 border border-indigo-500/20">
                      {activeLightboxItem.category}
                    </span>
                    {activeLightboxItem.sourceGenerator && (
                      <span className="rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] font-medium text-zinc-400 border border-zinc-700">
                        {activeLightboxItem.sourceGenerator}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-white leading-snug">
                    {activeLightboxItem.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Karakter: {influencer.name} ({influencer.handle})
                  </p>
                </div>

                {activeLightboxItem.notes && (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3">
                    <h5 className="text-[11px] font-semibold text-zinc-300">Catatan Visual</h5>
                    <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                      {activeLightboxItem.notes}
                    </p>
                  </div>
                )}

                {/* Prompt Used */}
                {activeLightboxItem.promptUsed && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h5 className="text-[11px] font-semibold text-zinc-300">
                        Prompt Pembuat Gambar
                      </h5>
                      <button
                        onClick={() =>
                          handleCopyPrompt(
                            activeLightboxItem.id,
                            activeLightboxItem.promptUsed!
                          )
                        }
                        className="flex items-center gap-1 text-[11px] font-medium text-indigo-400 hover:text-indigo-300"
                      >
                        {copiedPromptId === activeLightboxItem.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Salin</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-3 text-xs text-zinc-300 font-mono leading-relaxed max-h-36 overflow-y-auto">
                      {activeLightboxItem.promptUsed}
                    </div>
                  </div>
                )}

                {/* Color Palette Swatches */}
                <div className="space-y-1.5">
                  <h5 className="text-[11px] font-semibold text-zinc-300">Palet Warna Terkait</h5>
                  <div className="flex flex-wrap items-center gap-2">
                    {(
                      activeLightboxItem.colorPalette ||
                      influencer.visualIdentity.colorPalette
                    ).map((hex, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCopyColor(hex)}
                        className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1 text-[10px] text-zinc-300 hover:border-zinc-700"
                        title="Klik untuk menyalin kode hex"
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-zinc-700"
                          style={{ backgroundColor: hex }}
                        />
                        <span>{hex}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-zinc-800/80">
                {influencer.avatarUrl !== activeLightboxItem.imageUrl && (
                  <button
                    id="btn-modal-set-avatar"
                    onClick={() => {
                      onSetAsAvatar(activeLightboxItem.imageUrl);
                      setActiveLightboxItem(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md transition-colors"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Jadikan Gambar Profil Utama</span>
                  </button>
                )}

                {onConvertToVoiceover && activeLightboxItem.promptUsed && (
                  <button
                    id="btn-modal-convert-voiceover"
                    onClick={() => {
                      onConvertToVoiceover(activeLightboxItem.promptUsed!);
                      setActiveLightboxItem(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-colors"
                  >
                    <Mic className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Buat Naskah Voice-over</span>
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <a
                    href={activeLightboxItem.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    download={`moodboard_${activeLightboxItem.title.replace(/\s+/g, "_")}.jpg`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Unduh Gambar</span>
                  </a>

                  <button
                    id="btn-modal-delete-item"
                    onClick={() => {
                      onDeleteItem(activeLightboxItem.id);
                      setActiveLightboxItem(null);
                    }}
                    className="flex items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/20"
                    title="Hapus gambar dari moodboard"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Reference Modal */}
      {isAddModalOpen && (
        <div
          id="modal-add-moodboard"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="relative w-full max-w-xl rounded-2xl border border-zinc-700/80 bg-zinc-900 p-6 shadow-2xl space-y-5 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Plus className="h-4 w-4 text-indigo-400" />
                  Tambah Referensi Gaya Visual Baru
                </h3>
                <p className="text-xs text-zinc-400">
                  Simpan inspirasi foto, busana, atau hasil render ke dalam moodboard {influencer.name}.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveNewItem} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Judul Referensi Visual <span className="text-rose-400">*</span>
                </label>
                <input
                  id="input-moodboard-title"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Contoh: Candid Santai di Kedai Kopi Minimalis"
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Category & Generator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Kategori Visual
                  </label>
                  <select
                    id="select-moodboard-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as MoodboardCategory)}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Avatar">Avatar & Headshot</option>
                    <option value="Portrait">Potret Editorial</option>
                    <option value="Lifestyle">Aktivitas Harian (Lifestyle)</option>
                    <option value="Fashion">Gaya & Busana (Fashion)</option>
                    <option value="Setting">Lokasi & Latar (Setting)</option>
                    <option value="Aesthetic">Detail & Estetika</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300">
                    Sumber / Model Generator
                  </label>
                  <select
                    id="select-moodboard-generator"
                    value={newGenerator}
                    onChange={(e) => setNewGenerator(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-xs text-zinc-200 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Flux.1 Dev">Flux.1 Dev</option>
                    <option value="Midjourney v6.1">Midjourney v6.1</option>
                    <option value="NanoBanana">NanoBanana (Gemini 3.1)</option>
                    <option value="Seedream SDXL">Seedream SDXL</option>
                    <option value="ChatGPT Image">ChatGPT (DALL-E 3)</option>
                    <option value="Gemini Image">Gemini (Imagen 3)</option>
                    <option value="Foto Referensi Mandiri">Foto Referensi Mandiri</option>
                  </select>
                </div>
              </div>

              {/* Image Input Options: URL or Upload */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Tautan Gambar (URL) atau Unggah Berkas <span className="text-rose-400">*</span>
                </label>
                <div className="mt-1 flex gap-2">
                  <input
                    id="input-moodboard-url"
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... atau tautan gambar langsung"
                    className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700 hover:text-white shrink-0"
                    title="Unggah berkas gambar dari komputer Anda"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span>Unggah</span>
                  </button>
                </div>
              </div>

              {/* Image Preview if available */}
              {newImageUrl && (
                <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-2 overflow-hidden flex items-center justify-center max-h-48">
                  <img
                    src={newImageUrl}
                    alt="Pratinjau referensi visual"
                    className="max-h-44 object-contain rounded-lg"
                    onError={() => console.warn("Pratinjau gambar gagal dimuat")}
                  />
                  <button
                    type="button"
                    onClick={() => setNewImageUrl("")}
                    className="absolute top-2 right-2 rounded-full bg-zinc-900/90 p-1 text-zinc-400 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}

              {/* Prompt Used */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-zinc-300">
                    Rumusan Prompt (Opsional)
                  </label>
                  {onGenerateNewReference && (
                    <button
                      type="button"
                      onClick={handleQuickGenerate}
                      disabled={isGeneratingInModal}
                      className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>{isGeneratingInModal ? "Merender AI..." : "Render Cepat AI"}</span>
                    </button>
                  )}
                </div>
                <textarea
                  id="textarea-moodboard-prompt"
                  rows={2}
                  value={newPrompt}
                  onChange={(e) => setNewPrompt(e.target.value)}
                  placeholder="Rumus prompt teks yang menghasilkan visual ini..."
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300">
                  Catatan atau Petunjuk Gaya (Opsional)
                </label>
                <input
                  id="input-moodboard-notes"
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Catatan lighting, sudut kamera, atau jenis busana..."
                  className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3.5 py-2 text-xs text-zinc-100 placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-700"
                >
                  Batal
                </button>
                <button
                  id="btn-save-moodboard-item"
                  type="submit"
                  disabled={!newTitle.trim() || !newImageUrl.trim()}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 shadow-md shadow-indigo-900/30"
                >
                  Simpan ke Moodboard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
