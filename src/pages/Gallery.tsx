import { useState } from "react";
import { Download, Eye, Star, Search, Loader2 } from "lucide-react";
import { generateSkinPack, generateModPack, generateAddon } from "@/lib/packGenerator";
import { toast } from "sonner";

type GalleryTab = "skins" | "modpacks" | "addons";

interface GalleryItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  stars: number;
  tags: string[];
  color: string;
}

const premadeSkins: GalleryItem[] = [
  { id: "ninja", name: "Shadow Ninja", description: "Stealthy dark ninja with red headband", emoji: "🥷", stars: 5, tags: ["combat", "cool"], color: "hsl(var(--primary))" },
  { id: "astronaut", name: "Space Explorer", description: "Ready for the End dimension and beyond!", emoji: "🧑‍🚀", stars: 4, tags: ["space", "adventure"], color: "hsl(var(--secondary))" },
  { id: "dragon_knight", name: "Dragon Knight", description: "Armored warrior with dragon-scale details", emoji: "🐲", stars: 5, tags: ["combat", "epic"], color: "hsl(var(--accent))" },
  { id: "pixel_cat", name: "Pixel Kitty", description: "Adorable cat skin with whiskers and tail", emoji: "🐱", stars: 5, tags: ["cute", "animal"], color: "hsl(var(--gold))" },
  { id: "ice_wizard", name: "Ice Wizard", description: "Frosty mage with glowing blue robe", emoji: "🧊", stars: 4, tags: ["magic", "cool"], color: "hsl(var(--sky))" },
  { id: "zombie_hunter", name: "Zombie Hunter", description: "Brave survivor with bandana and gear", emoji: "🧟", stars: 4, tags: ["combat", "survival"], color: "hsl(var(--creeper))" },
  { id: "pirate", name: "Captain Blockbeard", description: "Yarr! A pirate with an eyepatch", emoji: "🏴‍☠️", stars: 3, tags: ["adventure", "fun"], color: "hsl(var(--primary))" },
  { id: "rainbow", name: "Rainbow Steve", description: "Colorful Steve with rainbow gradient", emoji: "🌈", stars: 5, tags: ["colorful", "fun"], color: "hsl(var(--secondary))" },
];

const premadeModPacks: GalleryItem[] = [
  { id: "ultimate_survival", name: "Ultimate Survival", description: "Better tools, backpacks, and more pets!", emoji: "🏕️", stars: 5, tags: ["survival", "popular"], color: "hsl(var(--primary))" },
  { id: "crazy_explosions", name: "Crazy Explosions", description: "Super TNT and lucky blocks galore", emoji: "💥", stars: 4, tags: ["fun", "chaos"], color: "hsl(var(--accent))" },
  { id: "furniture_life", name: "Home Designer", description: "Furniture mod + vehicles for the best base", emoji: "🏠", stars: 4, tags: ["creative", "building"], color: "hsl(var(--secondary))" },
  { id: "mob_madness", name: "Mob Madness", description: "More mobs, more pets, more chaos!", emoji: "🐉", stars: 5, tags: ["mobs", "adventure"], color: "hsl(var(--gold))" },
  { id: "mini_games", name: "Party Pack", description: "Lucky blocks + fun for mini games", emoji: "🎮", stars: 3, tags: ["minigame", "party"], color: "hsl(var(--sky))" },
  { id: "adventure_kit", name: "Adventure Kit", description: "Everything you need for epic quests", emoji: "🗺️", stars: 4, tags: ["adventure", "tools"], color: "hsl(var(--creeper))" },
];

const premadeAddons: GalleryItem[] = [
  { id: "friendly_dragon", name: "Friendly Dragon", description: "A tameable dragon that follows you!", emoji: "🐲", stars: 5, tags: ["mob", "pets"], color: "hsl(var(--primary))" },
  { id: "ruby_ore", name: "Ruby Ore & Tools", description: "New ruby ore with full tool set", emoji: "💎", stars: 4, tags: ["items", "mining"], color: "hsl(var(--accent))" },
  { id: "glow_blocks", name: "Glow Blocks", description: "Rainbow glowing blocks for building", emoji: "✨", stars: 4, tags: ["blocks", "creative"], color: "hsl(var(--gold))" },
  { id: "candy_biome", name: "Candy Land Biome", description: "A sweet biome made of candy!", emoji: "🍭", stars: 5, tags: ["biome", "fun"], color: "hsl(var(--secondary))" },
  { id: "jetpack", name: "Jetpack Item", description: "Fly around with a craftable jetpack", emoji: "🚀", stars: 5, tags: ["item", "flying"], color: "hsl(var(--sky))" },
  { id: "mini_boss", name: "Mini Boss Mobs", description: "Tough new mobs with special drops", emoji: "👾", stars: 4, tags: ["mob", "combat"], color: "hsl(var(--creeper))" },
];

const skinStyleMap: Record<string, string> = {
  ninja: "warrior", astronaut: "explorer", dragon_knight: "warrior",
  pixel_cat: "animal", ice_wizard: "wizard", zombie_hunter: "warrior",
  pirate: "explorer", rainbow: "custom",
};

const modPackMap: Record<string, string[]> = {
  ultimate_survival: ["Better Tools", "Backpacks", "More Pets"],
  crazy_explosions: ["Super TNT", "Lucky Blocks"],
  furniture_life: ["Furniture Mod", "Vehicles"],
  mob_madness: ["More Mobs", "More Pets"],
  mini_games: ["Lucky Blocks"],
  adventure_kit: ["Better Tools", "Backpacks", "More Mobs"],
};

const addonTypeMap: Record<string, { addonType: string; entityType: string }> = {
  friendly_dragon: { addonType: "both", entityType: "mob" },
  ruby_ore: { addonType: "both", entityType: "item" },
  glow_blocks: { addonType: "resource", entityType: "block" },
  candy_biome: { addonType: "both", entityType: "biome" },
  jetpack: { addonType: "both", entityType: "item" },
  mini_boss: { addonType: "behavior", entityType: "mob" },
};

const Gallery = () => {
  const [activeTab, setActiveTab] = useState<GalleryTab>("skins");
  const [search, setSearch] = useState("");
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const tabs: { key: GalleryTab; label: string; emoji: string }[] = [
    { key: "skins", label: "Skins", emoji: "🎨" },
    { key: "modpacks", label: "Mod Packs", emoji: "📦" },
    { key: "addons", label: "Add-ons", emoji: "🧩" },
  ];

  const getItems = (): GalleryItem[] => {
    const all = activeTab === "skins" ? premadeSkins : activeTab === "modpacks" ? premadeModPacks : premadeAddons;
    if (!search) return all;
    const q = search.toLowerCase();
    return all.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.tags.some((t) => t.includes(q)));
  };

  const handleDownload = async (item: GalleryItem) => {
    setDownloading(item.id);
    try {
      if (activeTab === "skins") {
        await generateSkinPack({ skinType: "steve", skinStyle: skinStyleMap[item.id] || "custom", textureUrl: null });
      } else if (activeTab === "modpacks") {
        await generateModPack({ packName: item.name, category: "survival", mods: modPackMap[item.id] || ["Better Tools"], iconUrl: null });
      } else {
        const cfg = addonTypeMap[item.id] || { addonType: "both", entityType: "mob" };
        await generateAddon({ addonName: item.name, addonType: cfg.addonType, entityType: cfg.entityType, difficulty: "medium", textureUrl: null });
      }
      toast.success(`${item.name} downloaded! 🎉`);
    } catch {
      toast.error("Oops! Download failed. Try again!");
    } finally {
      setDownloading(null);
    }
  };

  const items = getItems();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-pixel text-xl md:text-2xl text-foreground mb-2">🏪 Gallery</h1>
        <p className="text-lg font-semibold text-muted-foreground">Browse and download ready-made packs!</p>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearch(""); setPreviewItem(null); }}
              className={`flex items-center gap-2 rounded px-5 py-3 font-bold transition-all hover:scale-105 ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground pixel-border"
                  : "border-3 border-border bg-card text-foreground hover:bg-muted pixel-border"
              }`}
            >
              <span>{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search packs..."
              className="w-full rounded border-3 border-border bg-card py-3 pl-10 pr-4 font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none pixel-border"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border-4 border-border bg-card transition-all hover:scale-[1.02] hover:shadow-lg pixel-border"
            >
              {/* Color banner */}
              <div
                className="flex h-28 items-center justify-center text-5xl"
                style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}88)` }}
              >
                <span className="drop-shadow-lg transition-transform group-hover:scale-125">{item.emoji}</span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-pixel text-xs text-foreground mb-1">{item.name}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{item.description}</p>

                {/* Stars */}
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < item.stars ? "fill-gold text-gold" : "text-border"}`}
                    />
                  ))}
                </div>

                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => setPreviewItem(previewItem?.id === item.id ? null : item)}
                    className="flex items-center gap-1.5 rounded border-2 border-border bg-muted px-3 py-2 text-sm font-bold text-foreground transition-all hover:bg-muted/80 hover:scale-105"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownload(item)}
                    disabled={downloading === item.id}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded bg-primary px-3 py-2 text-sm font-bold text-primary-foreground transition-all hover:scale-105 disabled:opacity-60"
                  >
                    {downloading === item.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    {downloading === item.id ? "..." : "Get it!"}
                  </button>
                </div>
              </div>

              {/* Preview overlay */}
              {previewItem?.id === item.id && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/95 p-4 text-center backdrop-blur-sm">
                  <span className="mb-3 text-6xl">{item.emoji}</span>
                  <h3 className="font-pixel text-xs text-foreground mb-2">{item.name}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">{item.description}</p>
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < item.stars ? "fill-gold text-gold" : "text-border"}`}
                      />
                    ))}
                  </div>
                  <div className="mb-4 text-xs text-muted-foreground">
                    {activeTab === "skins" && "64×64 PNG skin for Steve model"}
                    {activeTab === "modpacks" && `Includes ${(modPackMap[item.id] || []).length} mods`}
                    {activeTab === "addons" && `${(addonTypeMap[item.id]?.addonType || "both").replace("both", "Behavior + Resource")} pack`}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewItem(null)}
                      className="rounded border-2 border-border bg-muted px-4 py-2 text-sm font-bold text-foreground hover:scale-105 transition-all"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => { setPreviewItem(null); handleDownload(item); }}
                      disabled={downloading === item.id}
                      className="rounded bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:scale-105 transition-all"
                    >
                      <Download className="mr-1 inline h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="py-16 text-center">
            <span className="text-5xl">🔍</span>
            <p className="mt-4 font-pixel text-sm text-muted-foreground">No packs found!</p>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
