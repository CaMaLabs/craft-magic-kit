import { useState } from "react";
import TextureUploader from "@/components/TextureUploader";
import BlockDropdown from "@/components/BlockDropdown";
import { Download, RotateCcw } from "lucide-react";

const skinTypes = [
  { value: "steve", label: "Steve (Classic)", emoji: "🧑" },
  { value: "alex", label: "Alex (Slim)", emoji: "👩" },
];

const skinStyles = [
  { value: "warrior", label: "Warrior", emoji: "⚔️" },
  { value: "explorer", label: "Explorer", emoji: "🧭" },
  { value: "wizard", label: "Wizard", emoji: "🧙" },
  { value: "robot", label: "Robot", emoji: "🤖" },
  { value: "animal", label: "Animal", emoji: "🐱" },
  { value: "custom", label: "Custom (Upload Your Own!)", emoji: "🎨" },
];

const SkinCreator = () => {
  const [skinType, setSkinType] = useState("");
  const [skinStyle, setSkinStyle] = useState("");
  const [texture, setTexture] = useState<string | null>(null);

  const handleTextureUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setTexture(url);
  };

  const handleReset = () => {
    setSkinType("");
    setSkinStyle("");
    setTexture(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-pixel text-xl md:text-2xl text-foreground mb-2">
          🎨 Skin Creator
        </h1>
        <p className="text-lg font-semibold text-muted-foreground">
          Design your dream Minecraft character!
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Step 1: Pick a type */}
        <div className="rounded-lg border-4 border-border bg-card p-6 pixel-border">
          <h2 className="font-pixel text-sm text-primary mb-4">Step 1: Pick Your Base</h2>
          <BlockDropdown
            label="Character Model"
            options={skinTypes}
            value={skinType}
            onChange={setSkinType}
            placeholder="Choose a character model..."
          />
        </div>

        {/* Step 2: Style */}
        <div className="rounded-lg border-4 border-border bg-card p-6 pixel-border">
          <h2 className="font-pixel text-sm text-secondary mb-4">Step 2: Pick a Style</h2>
          <BlockDropdown
            label="Skin Style"
            options={skinStyles}
            value={skinStyle}
            onChange={setSkinStyle}
            placeholder="What kind of skin do you want?"
          />
        </div>

        {/* Step 3: Upload texture */}
        <div className="rounded-lg border-4 border-border bg-card p-6 pixel-border">
          <h2 className="font-pixel text-sm text-accent mb-4">Step 3: Upload Texture</h2>
          <TextureUploader
            label="Skin Texture"
            description="Upload a 64x64 or 64x32 PNG image for your skin!"
            onUpload={handleTextureUpload}
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
            disabled={!skinType || !skinStyle}
            className="flex flex-1 items-center justify-center gap-2 rounded bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:scale-105 pixel-border disabled:opacity-50 disabled:hover:scale-100"
          >
            <Download className="h-4 w-4" />
            Download Skin Pack!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkinCreator;
