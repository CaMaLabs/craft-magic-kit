import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, QrCode, Search, Package, Paintbrush, Puzzle, Layers, Trash2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

type Pack = {
  id: string;
  name: string;
  description: string | null;
  pack_type: string;
  entity_type: string | null;
  file_path: string;
  thumbnail_path: string | null;
  download_count: number;
  created_at: string;
};

const typeConfig: Record<string, { label: string; emoji: string; icon: typeof Package }> = {
  behavior: { label: "Behavior", emoji: "⚙️", icon: Puzzle },
  resource: { label: "Resource", emoji: "🎨", icon: Paintbrush },
  skin: { label: "Skin", emoji: "👤", icon: Layers },
  addon: { label: "Add-on", emoji: "🔥", icon: Package },
};

const PackStore = () => {
  const [packs, setPacks] = useState<Pack[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [qrPackId, setQrPackId] = useState<string | null>(null);

  useEffect(() => {
    fetchPacks();
  }, []);

  const fetchPacks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("packs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load packs");
    } else {
      setPacks(data ?? []);
    }
    setLoading(false);
  };

  const getDownloadUrl = (filePath: string) => {
    const { data } = supabase.storage.from("packs").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleDownload = async (pack: Pack) => {
    const url = getDownloadUrl(pack.file_path);
    window.open(url, "_blank");

    // Increment download count
    await supabase
      .from("packs")
      .update({ download_count: pack.download_count + 1 })
      .eq("id", pack.id);

    setPacks((prev) =>
      prev.map((p) =>
        p.id === pack.id ? { ...p, download_count: p.download_count + 1 } : p
      )
    );
    toast.success(`Downloading ${pack.name}! 🎉`);
  };

  const handleDelete = async (pack: Pack) => {
    if (!window.confirm(`Delete "${pack.name}"? This can't be undone!`)) return;

    await supabase.storage.from("packs").remove([pack.file_path]);
    if (pack.thumbnail_path) {
      await supabase.storage.from("packs").remove([pack.thumbnail_path]);
    }

    const { error } = await supabase.from("packs").delete().eq("id", pack.id);
    if (error) {
      toast.error("Failed to delete pack");
      return;
    }
    setPacks((prev) => prev.filter((p) => p.id !== pack.id));
    toast.success(`"${pack.name}" deleted! 🗑️`);
  };

  const filteredPacks = packs.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchesType = filterType === "all" || p.pack_type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-pixel text-xl md:text-2xl text-foreground mb-2">
          📦 Pack Store
        </h1>
        <p className="text-lg font-semibold text-muted-foreground">
          Browse, download, and install packs on any device!
        </p>
      </div>

      {/* Search + Filter Bar */}
      <div className="mx-auto max-w-3xl mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search packs..."
            className="w-full rounded border-3 border-border bg-card pl-10 pr-4 py-3 font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none pixel-border"
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center">
          {[
            { value: "all", label: "All", emoji: "🌟" },
            ...Object.entries(typeConfig).map(([value, { label, emoji }]) => ({
              value,
              label,
              emoji,
            })),
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              className={`rounded px-4 py-2 text-sm font-bold transition-all hover:scale-105 pixel-border ${
                filterType === t.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground hover:bg-muted"
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pack Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="font-pixel text-sm text-muted-foreground animate-pulse">
            Loading packs...
          </div>
        </div>
      ) : filteredPacks.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="text-6xl">📭</div>
          <h2 className="font-pixel text-sm text-muted-foreground">
            No packs yet!
          </h2>
          <p className="text-muted-foreground font-semibold">
            Create an add-on, skin, or mod pack and publish it to the store.
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPacks.map((pack) => {
            const config = typeConfig[pack.pack_type] ?? {
              label: pack.pack_type,
              emoji: "📦",
              icon: Package,
            };
            const downloadUrl = getDownloadUrl(pack.file_path);

            return (
              <div
                key={pack.id}
                className="rounded-lg border-4 border-border bg-card p-5 pixel-border-strong flex flex-col gap-3 transition-all hover:border-primary/50 hover:scale-[1.02]"
              >
                {/* Thumbnail */}
                {pack.thumbnail_path ? (
                  <img
                    src={getDownloadUrl(pack.thumbnail_path)}
                    alt={pack.name}
                    className="h-32 w-full rounded border-2 border-border object-cover"
                    style={{ imageRendering: "pixelated" }}
                  />
                ) : (
                  <div className="h-32 w-full rounded border-2 border-border bg-muted flex items-center justify-center">
                    <span className="text-5xl">{config.emoji}</span>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-bold text-primary">
                      {config.emoji} {config.label}
                    </span>
                    {pack.entity_type && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                        {pack.entity_type}
                      </span>
                    )}
                  </div>
                  <h3 className="font-pixel text-xs text-foreground truncate mt-1">
                    {pack.name}
                  </h3>
                  {pack.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {pack.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2 font-bold">
                    📥 {pack.download_count} downloads
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(pack)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded bg-primary px-3 py-2 text-sm font-bold text-primary-foreground transition-all hover:scale-105 pixel-border"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={() =>
                      setQrPackId(qrPackId === pack.id ? null : pack.id)
                    }
                    className="flex items-center justify-center rounded border-3 border-border bg-muted px-3 py-2 text-sm font-bold text-foreground transition-all hover:scale-105 pixel-border"
                    title="Show QR Code"
                  >
                    <QrCode className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(pack)}
                    className="flex items-center justify-center rounded border-3 border-destructive/50 bg-destructive/10 px-3 py-2 text-sm font-bold text-destructive transition-all hover:scale-105 hover:bg-destructive/20 pixel-border"
                    title="Delete pack"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* QR Code (toggled) */}
                {qrPackId === pack.id && (
                  <div className="rounded bg-background border-2 border-border p-4 flex flex-col items-center gap-2 animate-scale-in">
                    <QRCodeSVG
                      value={downloadUrl}
                      size={140}
                      bgColor="transparent"
                      fgColor="hsl(25, 30%, 15%)"
                      level="M"
                    />
                    <p className="text-xs text-muted-foreground font-bold text-center">
                      📱 Scan to download on any device!
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PackStore;
