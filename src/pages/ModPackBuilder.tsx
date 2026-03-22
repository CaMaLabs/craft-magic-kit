import { useState } from "react";
import BlockDropdown from "@/components/BlockDropdown";
import TextureUploader from "@/components/TextureUploader";
import { Download, Plus, Trash2, RotateCcw, Loader2, Upload } from "lucide-react";
import { generateModPack, generateModPackBlob } from "@/lib/packGenerator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const categories = [
  { value: "survival", label: "Survival", emoji: "🏕️" },
  { value: "creative", label: "Creative", emoji: "🎨" },
  { value: "adventure", label: "Adventure", emoji: "🗺️" },
  { value: "minigame", label: "Mini Games", emoji: "🎮" },
];

const availableMods = [
  { value: "better_tools", label: "Better Tools", emoji: "⛏️" },
  { value: "more_mobs", label: "More Mobs", emoji: "🐉" },
  { value: "furniture", label: "Furniture Mod", emoji: "🪑" },
  { value: "vehicles", label: "Vehicles", emoji: "🚗" },
  { value: "lucky_block", label: "Lucky Blocks", emoji: "🍀" },
  { value: "super_tnt", label: "Super TNT", emoji: "💥" },
  { value: "backpacks", label: "Backpacks", emoji: "🎒" },
  { value: "pets", label: "More Pets", emoji: "🐕" },
];

const ModPackBuilder = () => {
  const [packName, setPackName] = useState("");
  const [category, setCategory] = useState("");
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [currentMod, setCurrentMod] = useState("");
  const [icon, setIcon] = useState<string | null>(null);

  const addMod = () => {
    if (currentMod && !selectedMods.includes(currentMod)) {
      setSelectedMods([...selectedMods, currentMod]);
      setCurrentMod("");
    }
  };

  const removeMod = (mod: string) => {
    setSelectedMods(selectedMods.filter((m) => m !== mod));
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleReset = () => {
    setPackName("");
    setCategory("");
    setSelectedMods([]);
    setCurrentMod("");
    setIcon(null);
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const modLabels = selectedMods.map((v) => availableMods.find((m) => m.value === v)?.label || v);
      await generateModPack({ packName, category, mods: modLabels, iconUrl: icon });
      toast.success("Mod pack downloaded! 🎉 Import the .mcaddon file into Minecraft!");
    } catch {
      toast.error("Oops! Something went wrong building your mod pack.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const { data: existing } = await supabase.from("packs").select("id").eq("name", packName).limit(1);
      if (existing && existing.length > 0) {
        toast.error(`"${packName}" is already in the store! Use a different name.`);
        setIsPublishing(false);
        return;
      }
      const modLabels = selectedMods.map((v) => availableMods.find((m) => m.value === v)?.label || v);
      const blob = await generateModPackBlob({ packName, category, mods: modLabels, iconUrl: icon });
      const fileName = `modpack_${packName.replace(/\s/g, "_")}_${Date.now()}.mcaddon`;
      const { error: uploadError } = await supabase.storage.from("packs").upload(fileName, blob, { contentType: "application/octet-stream" });
      if (uploadError) throw uploadError;

      let thumbnailPath: string | null = null;
      if (icon) {
        const thumbName = `thumbs/modpack_${packName.replace(/\s/g, "_")}_${Date.now()}.png`;
        const thumbBlob = await fetch(icon).then((r) => r.blob());
        const { error: thumbErr } = await supabase.storage.from("packs").upload(thumbName, thumbBlob, { contentType: "image/png" });
        if (!thumbErr) thumbnailPath = thumbName;
      }

      const { error: dbError } = await supabase.from("packs").insert({
        name: packName,
        description: `${category} mod pack with ${modLabels.join(", ")}`,
        pack_type: "modpack",
        file_path: fileName,
        thumbnail_path: thumbnailPath,
      });
      if (dbError) throw dbError;

      toast.success("Published to the Pack Store! 🎉");
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish. Please try again.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-pixel text-xl md:text-2xl text-foreground mb-2">
          📦 Mod Pack Builder
        </h1>
        <p className="text-lg font-semibold text-muted-foreground">
          Mix and match mods to create the ultimate pack!
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Pack Name */}
        <div className="rounded-lg border-4 border-border bg-card p-6 pixel-border">
          <h2 className="font-pixel text-sm text-primary mb-4">Name Your Pack</h2>
          <label className="font-bold text-foreground">Pack Name</label>
          <input
            type="text"
            value={packName}
            onChange={(e) => setPackName(e.target.value)}
            placeholder="My Awesome Mod Pack..."
            className="mt-2 w-full rounded border-3 border-border bg-background px-4 py-3 font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none pixel-border"
          />
        </div>

        {/* Category */}
        <div className="rounded-lg border-4 border-border bg-card p-6 pixel-border">
          <h2 className="font-pixel text-sm text-secondary mb-4">Pick a Category</h2>
          <BlockDropdown
            label="Pack Category"
            options={categories}
            value={category}
            onChange={setCategory}
            placeholder="What kind of pack is this?"
          />
        </div>

        {/* Mod Selection */}
        <div className="rounded-lg border-4 border-border bg-card p-6 pixel-border">
          <h2 className="font-pixel text-sm text-accent mb-4">Add Mods</h2>
          <div className="flex gap-2">
            <div className="flex-1">
              <BlockDropdown
                label="Choose a Mod"
                options={availableMods.filter((m) => !selectedMods.includes(m.value))}
                value={currentMod}
                onChange={setCurrentMod}
                placeholder="Pick a mod to add..."
              />
            </div>
            <button
              onClick={addMod}
              disabled={!currentMod}
              className="mt-8 flex items-center gap-1 self-start rounded bg-primary px-4 py-3 font-bold text-primary-foreground transition-all hover:scale-105 pixel-border disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add
            </button>
          </div>

          {selectedMods.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="font-bold text-foreground">Your Mods ({selectedMods.length}):</p>
              {selectedMods.map((modValue) => {
                const mod = availableMods.find((m) => m.value === modValue);
                return (
                  <div
                    key={modValue}
                    className="flex items-center justify-between rounded border-2 border-border bg-muted px-4 py-2"
                  >
                    <span className="font-semibold">
                      {mod?.emoji} {mod?.label}
                    </span>
                    <button
                      onClick={() => removeMod(modValue)}
                      className="rounded p-1 text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Pack Icon */}
        <div className="rounded-lg border-4 border-border bg-card p-6 pixel-border">
          <h2 className="font-pixel text-sm text-creeper mb-4">Pack Icon (Optional)</h2>
          <TextureUploader
            label="Pack Icon"
            description="Upload a cool icon for your mod pack!"
            onUpload={(file) => setIcon(URL.createObjectURL(file))}
            preview={icon}
            onClear={() => setIcon(null)}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded border-3 border-border bg-muted px-6 py-3 font-bold text-foreground transition-all hover:bg-muted/80 hover:scale-105 pixel-border"
          >
            <RotateCcw className="h-4 w-4" />
            Start Over
          </button>
          <button
            disabled={!packName || !category || selectedMods.length === 0 || isGenerating}
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:scale-105 pixel-border disabled:opacity-50 disabled:hover:scale-100"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isGenerating ? "Building..." : "Build Mod Pack!"}
          </button>
          <button
            disabled={!packName || !category || selectedMods.length === 0 || isPublishing}
            onClick={handlePublish}
            className="flex items-center gap-2 rounded bg-secondary px-6 py-3 font-bold text-secondary-foreground transition-all hover:scale-105 pixel-border disabled:opacity-50 disabled:hover:scale-100"
          >
            {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {isPublishing ? "Publishing..." : "Publish to Store"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModPackBuilder;
