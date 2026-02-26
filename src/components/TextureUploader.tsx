import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";

interface TextureUploaderProps {
  label: string;
  description: string;
  onUpload: (file: File) => void;
  accept?: string;
  preview?: string | null;
  onClear?: () => void;
}

const TextureUploader = ({
  label,
  description,
  onUpload,
  accept = "image/png",
  preview,
  onClear,
}: TextureUploaderProps) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) onUpload(file);
    },
    [onUpload]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="space-y-2">
      <label className="font-bold text-foreground">{label}</label>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center gap-3 rounded border-4 border-dashed p-8 transition-all cursor-pointer ${
          dragOver
            ? "border-accent bg-accent/10 scale-[1.02]"
            : "border-border bg-card hover:border-primary hover:bg-muted/50"
        }`}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 rounded object-contain pixel-border"
              style={{ imageRendering: "pixelated" }}
            />
            {onClear && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:scale-110 transition-transform"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        ) : (
          <>
            <Upload className="h-10 w-10 text-muted-foreground" />
            <span className="font-bold text-muted-foreground">
              Drop your texture here or click to upload!
            </span>
            <span className="text-xs text-muted-foreground">PNG files work best 🎨</span>
          </>
        )}
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>
    </div>
  );
};

export default TextureUploader;
