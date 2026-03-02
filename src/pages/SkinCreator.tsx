import { useState, Suspense, lazy } from "react";
import TextureUploader from "@/components/TextureUploader";
import BlockDropdown from "@/components/BlockDropdown";
import ErrorBoundary from "@/components/ErrorBoundary";
const SkinPreview3D = lazy(() => import("@/components/SkinPreview3D"));
import { Download, RotateCcw, Loader2, RotateCw, Upload } from "lucide-react";
import { generateSkinPack, generateSkinPackBlob } from "@/lib/packGenerator";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleReset = () => {
    setSkinType("");
    setSkinStyle("");
    setTexture(null);
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateSkinPack({ skinType, skinStyle, textureUrl: texture });
      toast.success("Skin pack downloaded! 🎉 Import it into Minecraft Bedrock!");
    } catch {
      toast.error("Oops! Something went wrong generating your skin pack.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const blob = await generateSkinPackBlob({ skinType, skinStyle, textureUrl: texture });
      const fileName = `skin_${skinStyle}_${Date.now()}.mcpack`;
      const { error: uploadError } = await supabase.storage.from("packs").upload(fileName, blob, { contentType: "application/octet-stream" });
      if (uploadError) throw uploadError;

      let thumbnailPath: string | null = null;
      if (texture) {
        const thumbName = `thumbs/skin_${skinStyle}_${Date.now()}.png`;
        const thumbBlob = await fetch(texture).then((r) => r.blob());
        const { error: thumbErr } = await supabase.storage.from("packs").upload(thumbName, thumbBlob, { contentType: "image/png" });
        if (!thumbErr) thumbnailPath = thumbName;
      }

      const { error: dbError } = await supabase.from("packs").insert({
        name: `${skinStyle} Skin`,
        description: `Custom ${skinStyle} skin for ${skinType} model`,
        pack_type: "skin",
        entity_type: skinType,
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
          🎨 Skin Creator
        </h1>
        <p className="text-lg font-semibold text-muted-foreground">
          Design your dream Minecraft character!
        </p>
      </div>

      <div className="mx-auto max-w-5xl flex flex-col lg:flex-row gap-6">
        {/* 3D Preview Panel */}
        <div className="lg:w-[360px] shrink-0 order-first">
          <div className="sticky top-20 rounded-lg border-4 border-border bg-card pixel-border overflow-hidden">
            <div className="h-[400px] lg:h-[480px] relative">
              <ErrorBoundary
                fallback={
                  <div className="flex h-full items-center justify-center text-center p-4">
                    <div>
                      <span className="text-4xl">🧱</span>
                      <p className="mt-2 text-sm font-bold text-muted-foreground">
                        3D preview is loading...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Refresh the page to try again!
                      </p>
                    </div>
                  </div>
                }
              >
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  }
                >
                  <SkinPreview3D
                    textureUrl={texture}
                    skinType={skinType}
                    skinStyle={skinStyle}
                  />
                </Suspense>
              </ErrorBoundary>
            </div>
            <div className="border-t-4 border-border bg-muted/50 px-4 py-3 text-center">
              <p className="flex items-center justify-center gap-2 text-xs font-bold text-muted-foreground">
                <RotateCw className="h-3.5 w-3.5" />
                Drag to rotate • Scroll to zoom
              </p>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="flex-1 space-y-6">
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
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 rounded border-3 border-border bg-muted px-6 py-3 font-bold text-foreground transition-all hover:bg-muted/80 hover:scale-105 pixel-border"
            >
              <RotateCcw className="h-4 w-4" />
              Start Over
            </button>
            <button
              disabled={!skinType || !skinStyle || isGenerating}
              onClick={handleDownload}
              className="flex flex-1 items-center justify-center gap-2 rounded bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:scale-105 pixel-border disabled:opacity-50 disabled:hover:scale-100"
            >
              {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              {isGenerating ? "Generating..." : "Download Skin Pack!"}
            </button>
            <button
              disabled={!skinType || !skinStyle || isPublishing}
              onClick={handlePublish}
              className="flex items-center gap-2 rounded bg-secondary px-6 py-3 font-bold text-secondary-foreground transition-all hover:scale-105 pixel-border disabled:opacity-50 disabled:hover:scale-100"
            >
              {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {isPublishing ? "Publishing..." : "Publish to Store"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinCreator;
