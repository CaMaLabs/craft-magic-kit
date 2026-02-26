import { useState } from "react";
import BlockDropdown from "@/components/BlockDropdown";
import TextureUploader from "@/components/TextureUploader";
import { Download, RotateCcw } from "lucide-react";

const addonTypes = [
  { value: "behavior", label: "Behavior Pack", emoji: "⚙️" },
  { value: "resource", label: "Resource Pack", emoji: "🎨" },
  { value: "both", label: "Both (Behavior + Resource)", emoji: "🔥" },
];

const entityTypes = [
  { value: "mob", label: "Custom Mob", emoji: "🐙" },
  { value: "item", label: "Custom Item", emoji: "🗡️" },
  { value: "block", label: "Custom Block", emoji: "🧱" },
  { value: "biome", label: "Custom Biome", emoji: "🌲" },
];

const difficulties = [
  { value: "easy", label: "Easy Peasy", emoji: "😊" },
  { value: "medium", label: "Just Right", emoji: "💪" },
  { value: "hard", label: "Super Tough", emoji: "🔥" },
];

const AddOnCreator = () => {
  const [addonType, setAddonType] = useState("");
  const [entityType, setEntityType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [addonName, setAddonName] = useState("");
  const [texture, setTexture] = useState<string | null>(null);

  const handleReset = () => {
    setAddonType("");
    setEntityType("");
    setDifficulty("");
    setAddonName("");
    setTexture(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-pixel text-xl md:text-2xl text-foreground mb-2">
          🧩 Add-on Maker
        </h1>
        <p className="text-lg font-semibold text-muted-foreground">
          Create custom behaviors, items, and more for Bedrock!
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Name */}
        <div className="rounded-lg border-4 border-border bg-card p-6 pixel-border">
          <h2 className="font-pixel text-sm text-primary mb-4">Name Your Add-on</h2>
          <label className="font-bold text-foreground">Add-on Name</label>
          <input
            type="text"
            value={addonName}
            onChange={(e) => setAddonName(e.target.value)}
            placeholder="My Cool Add-on..."
            className="mt-2 w-full rounded border-3 border-border bg-background px-4 py-3 font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none pixel-border"
          />
        </div>

        {/* Pack Type */}
        <div className="rounded-lg border-4 border-border bg-card p-6 pixel-border">
          <h2 className="font-pixel text-sm text-secondary mb-4">Pack Type</h2>
          <BlockDropdown
            label="What kind of add-on?"
            options={addonTypes}
            value={addonType}
            onChange={setAddonType}
            placeholder="Choose a pack type..."
          />
        </div>

        {/* Entity Type */}
        <div className="rounded-lg border-4 border-border bg-card p-6 pixel-border">
          <h2 className="font-pixel text-sm text-accent mb-4">What Are You Creating?</h2>
          <BlockDropdown
            label="Entity Type"
            options={entityTypes}
            value={entityType}
            onChange={setEntityType}
            placeholder="What do you want to add?"
          />
        </div>

        {/* Difficulty */}
        <div className="rounded-lg border-4 border-border bg-card p-6 pixel-border">
          <h2 className="font-pixel text-sm text-gold mb-4">Difficulty Level</h2>
          <BlockDropdown
            label="How hard should it be?"
            options={difficulties}
            value={difficulty}
            onChange={setDifficulty}
            placeholder="Pick a difficulty..."
          />
        </div>

        {/* Texture Upload */}
        <div className="rounded-lg border-4 border-border bg-card p-6 pixel-border">
          <h2 className="font-pixel text-sm text-creeper mb-4">Custom Texture (Optional)</h2>
          <TextureUploader
            label="Entity Texture"
            description="Upload a PNG texture for your custom mob, item, or block!"
            onUpload={(file) => setTexture(URL.createObjectURL(file))}
            preview={texture}
            onClear={() => setTexture(null)}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded border-3 border-border bg-muted px-6 py-3 font-bold text-foreground transition-all hover:bg-muted/80 hover:scale-105 pixel-border"
          >
            <RotateCcw className="h-4 w-4" />
            Start Over
          </button>
          <button
            disabled={!addonName || !addonType || !entityType}
            className="flex flex-1 items-center justify-center gap-2 rounded bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:scale-105 pixel-border disabled:opacity-50 disabled:hover:scale-100"
          >
            <Download className="h-4 w-4" />
            Create Add-on!
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOnCreator;
