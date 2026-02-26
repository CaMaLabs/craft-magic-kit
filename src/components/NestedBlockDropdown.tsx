import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export interface NestedOption {
  value: string;
  label: string;
  emoji?: string;
  children?: NestedOption[];
}

interface NestedBlockDropdownProps {
  label: string;
  options: NestedOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

const NestedBlockDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Pick abilities!",
}: NestedBlockDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const findOption = (opts: NestedOption[], val: string): NestedOption | undefined => {
    for (const o of opts) {
      if (o.value === val) return o;
      if (o.children) {
        const found = findOption(o.children, val);
        if (found) return found;
      }
    }
    return undefined;
  };

  const selectedOptions = value.map((v) => findOption(options, v)).filter(Boolean) as NestedOption[];

  const toggleGroup = (groupValue: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupValue)) next.delete(groupValue);
      else next.add(groupValue);
      return next;
    });
  };

  const toggleValue = (val: string) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };

  const removeValue = (val: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  };

  const renderOptions = (opts: NestedOption[], depth = 0) =>
    opts.map((opt) => {
      const hasChildren = opt.children && opt.children.length > 0;
      const isExpanded = expandedGroups.has(opt.value);
      const isSelected = value.includes(opt.value);

      return (
        <div key={opt.value}>
          <button
            onClick={() => {
              if (hasChildren) {
                toggleGroup(opt.value);
              } else {
                toggleValue(opt.value);
              }
            }}
            className={`flex w-full items-center gap-2 px-4 py-3 text-left font-semibold transition-colors ${
              !hasChildren && isSelected
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-foreground"
            }`}
            style={{ paddingLeft: `${16 + depth * 16}px` }}
          >
            {opt.emoji && <span>{opt.emoji}</span>}
            <span className="flex-1">{opt.label}</span>
            {!hasChildren && isSelected && (
              <span className="text-xs">✓</span>
            )}
            {hasChildren && (
              <span className="text-muted-foreground">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </span>
            )}
          </button>
          {hasChildren && isExpanded && (
            <div className="border-l-2 border-border ml-4">
              {renderOptions(opt.children!, depth + 1)}
            </div>
          )}
        </div>
      );
    });

  return (
    <div className="relative space-y-2" ref={ref}>
      <label className="font-bold text-foreground">{label}</label>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded border-3 border-border bg-card px-4 py-3 font-bold transition-all hover:border-primary pixel-border min-h-[48px]"
      >
        <span className={selectedOptions.length > 0 ? "text-foreground" : "text-muted-foreground"}>
          {selectedOptions.length > 0 ? `${selectedOptions.length} selected` : placeholder}
        </span>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Selected tags */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {selectedOptions.map((opt) => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-sm font-semibold text-primary border border-primary/30"
            >
              {opt.emoji && <span>{opt.emoji}</span>}
              {opt.label}
              <button
                onClick={(e) => removeValue(opt.value, e)}
                className="ml-1 rounded-full hover:bg-primary/20 p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded border-2 border-border bg-card shadow-lg pixel-border overflow-hidden overflow-y-auto max-h-72 animate-in fade-in slide-in-from-top-2 duration-200">
          {renderOptions(options)}
        </div>
      )}
    </div>
  );
};

export default NestedBlockDropdown;
