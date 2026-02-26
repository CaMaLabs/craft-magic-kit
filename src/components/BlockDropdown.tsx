import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface DropdownOption {
  value: string;
  label: string;
  emoji?: string;
}

interface BlockDropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const BlockDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Pick one!",
}: BlockDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="space-y-2" ref={ref}>
      <label className="font-bold text-foreground">{label}</label>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded border-3 border-border bg-card px-4 py-3 font-bold transition-all hover:border-primary pixel-border"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? (
            <>
              {selected.emoji && <span className="mr-2">{selected.emoji}</span>}
              {selected.label}
            </>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full max-w-md rounded border-2 border-border bg-card shadow-lg pixel-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2 px-4 py-3 text-left font-semibold transition-colors ${
                opt.value === value
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-foreground"
              }`}
            >
              {opt.emoji && <span>{opt.emoji}</span>}
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockDropdown;
