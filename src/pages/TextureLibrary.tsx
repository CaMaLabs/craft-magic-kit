import { useState } from "react";
import { Search, Download, Eye, Sparkles, Loader2, Wand2 } from "lucide-react";
import { textureLibrary, textureCategories, type TextureCategory, type TextureItem } from "@/lib/textureLibrary";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TextureLibrary = () => {
  const [activeCategory, setActiveCategory] = useState<TextureCategory | "all">("all");
  const [search, setSearch] = useState("");
  const [previewItem, setPreviewItem] = useState<TextureItem | null>(null);

  // AI Generator state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiType, setAiType] = useState<"block" | "item" | "mob">("block");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);

  const filteredTextures = textureLibrary.filter((t) => {
    const matchesCategory = activeCategory === "all" || t.category === activeCategory;
    if (!search) return matchesCategory;
    const q = search.toLowerCase();
    return matchesCategory && (t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.tags.some((tag) => tag.includes(q)));
  });

  const handleGenerateTexture = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Type a description for your texture!");
      return;
    }
    setIsGenerating(true);
    setGeneratedImage(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-texture", {
        body: { prompt: aiPrompt, textureType: aiType },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error);
        return;
      }
      if (data?.imageUrl) {
        setGeneratedImage(data.imageUrl);
        toast.success("Texture generated! 🎨");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate texture. Try again!");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadGenerated = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `minecraft-texture-${aiType}-${Date.now()}.png`;
    link.click();
    toast.success("Texture downloaded! 🎉");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-pixel text-xl md:text-2xl text-foreground mb-2">🎨 Texture Library</h1>
        <p className="text-lg font-semibold text-muted-foreground">
          {textureLibrary.length}+ premade textures & AI-powered generation!
        </p>
      </div>

      <div className="mx-auto max-w-6xl">
        {/* AI Generator Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowGenerator(!showGenerator)}
            className="mx-auto flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:scale-105 pixel-border"
          >
            <Wand2 className="h-5 w-5" />
            {showGenerator ? "Hide AI Generator" : "✨ Generate with AI"}
          </button>
        </div>

        {/* AI Generator Panel */}
        {showGenerator && (
          <div className="mb-8 rounded-lg border-4 border-primary/30 bg-card p-6 pixel-border">
            <h2 className="font-pixel text-sm text-primary mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              AI Texture Generator
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Describe what you want and AI will create a Minecraft-style texture for you!
            </p>

            <div className="flex flex-col gap-4 md:flex-row">
              {/* Type selector */}
              <div className="flex gap-2">
                {(["block", "item", "mob"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setAiType(type)}
                    className={`rounded px-4 py-2 text-sm font-bold transition-all ${
                      aiType === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {type === "block" ? "🧱 Block" : type === "item" ? "⚒️ Item" : "🐾 Mob"}
                  </button>
                ))}
              </div>

              {/* Prompt input */}
              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isGenerating && handleGenerateTexture()}
                  placeholder="e.g. Galaxy obsidian with swirling purple stars..."
                  className="flex-1 rounded border-2 border-border bg-background px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
                <button
                  onClick={handleGenerateTexture}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="flex items-center gap-2 rounded bg-accent px-5 py-2 font-bold text-accent-foreground transition-all hover:scale-105 disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {isGenerating ? "Creating..." : "Generate!"}
                </button>
              </div>
            </div>

            {/* Generated result */}
            {generatedImage && (
              <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
                <div className="h-32 w-32 overflow-hidden rounded-lg border-4 border-border pixel-border">
                  <img src={generatedImage} alt="AI generated texture" className="h-full w-full object-cover" style={{ imageRendering: "pixelated" }} />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-bold text-foreground">Your AI texture is ready! 🎉</p>
                  <p className="text-sm text-muted-foreground">Download it and use it in your resource pack</p>
                  <button
                    onClick={handleDownloadGenerated}
                    className="flex items-center gap-2 rounded bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-all hover:scale-105"
                  >
                    <Download className="h-4 w-4" />
                    Download Texture
                  </button>
                </div>
              </div>
            )}

            {/* Prompt suggestions */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs font-bold text-muted-foreground">Try:</span>
              {[
                "Lava cake block with frosting",
                "Diamond sword with lightning",
                "Cute baby zombie with hat",
                "Crystal ore with rainbow glow",
                "Enchanted netherite armor",
                "Candy cane pickaxe",
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setAiPrompt(suggestion)}
                  className="rounded bg-muted px-2 py-1 text-xs font-bold text-muted-foreground transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category tabs */}
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { setActiveCategory("all"); setSearch(""); }}
            className={`rounded px-4 py-2 text-sm font-bold transition-all hover:scale-105 ${
              activeCategory === "all"
                ? "bg-primary text-primary-foreground pixel-border"
                : "border-2 border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            🌟 All ({textureLibrary.length})
          </button>
          {textureCategories.map((cat) => {
            const count = textureLibrary.filter((t) => t.category === cat.key).length;
            return (
              <button
                key={cat.key}
                onClick={() => { setActiveCategory(cat.key); setSearch(""); }}
                className={`rounded px-3 py-2 text-sm font-bold transition-all hover:scale-105 ${
                  activeCategory === cat.key
                    ? "bg-primary text-primary-foreground pixel-border"
                    : "border-2 border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                {cat.emoji} {cat.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search textures..."
              className="w-full rounded border-3 border-border bg-card py-3 pl-10 pr-4 font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none pixel-border"
            />
          </div>
        </div>

        {/* Results count */}
        <p className="mb-4 text-center text-sm font-bold text-muted-foreground">
          Showing {filteredTextures.length} texture{filteredTextures.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredTextures.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border-3 border-border bg-card transition-all hover:scale-[1.03] hover:shadow-lg pixel-border cursor-pointer"
              onClick={() => setPreviewItem(previewItem?.id === item.id ? null : item)}
            >
              <div
                className="flex h-20 items-center justify-center text-3xl"
                style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}66)` }}
              >
                <span className="drop-shadow-lg transition-transform group-hover:scale-125">{item.emoji}</span>
              </div>
              <div className="p-2">
                <h3 className="text-xs font-bold text-foreground truncate">{item.name}</h3>
                <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                <div className="mt-1 flex flex-wrap gap-0.5">
                  {item.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded bg-muted px-1 py-0.5 text-[9px] font-bold text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTextures.length === 0 && (
          <div className="py-16 text-center">
            <span className="text-5xl">🔍</span>
            <p className="mt-4 font-pixel text-sm text-muted-foreground">No textures found!</p>
            <p className="text-muted-foreground">Try a different search or category</p>
          </div>
        )}

        {/* Preview Modal */}
        {previewItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
            onClick={() => setPreviewItem(null)}
          >
            <div
              className="w-full max-w-sm rounded-lg border-4 border-border bg-card p-6 pixel-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="mb-4 flex h-32 items-center justify-center rounded-lg text-6xl"
                style={{ background: `linear-gradient(135deg, ${previewItem.color}, ${previewItem.color}66)` }}
              >
                <span>{previewItem.emoji}</span>
              </div>
              <h3 className="font-pixel text-xs text-foreground mb-1">{previewItem.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{previewItem.description}</p>
              <p className="text-xs text-muted-foreground mb-3">
                Category: {textureCategories.find((c) => c.key === previewItem.category)?.label} • {previewItem.subcategory}
              </p>
              <div className="mb-4 flex flex-wrap gap-1">
                {previewItem.tags.map((tag) => (
                  <span key={tag} className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewItem(null)}
                  className="rounded border-2 border-border bg-muted px-4 py-2 text-sm font-bold text-foreground hover:scale-105 transition-all"
                >
                  Close
                </button>
                <button
                  className="flex flex-1 items-center justify-center gap-2 rounded bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:scale-105 transition-all"
                  onClick={() => {
                    toast.success(`${previewItem.name} added to your pack! 🎉`);
                    setPreviewItem(null);
                  }}
                >
                  <Download className="h-4 w-4" />
                  Use in Pack
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextureLibrary;
