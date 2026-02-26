import { ChevronDown, ChevronRight } from "lucide-react";
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
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const NestedBlockDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Pick one!",
}: NestedBlockDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setExpandedGroups(new Set());
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const findSelected = (opts: NestedOption[]): NestedOption | undefined => {
    for (const o of opts) {
      if (o.value === value) return o;
      if (o.children) {
        const found = findSelected(o.children);
        if (found) return found;
      }
    }
    return undefined;
  };

  const selected = findSelected(options);

  const toggleGroup = (groupValue: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupValue)) next.delete(groupValue);
      else next.add(groupValue);
      return next;
    });
  };

  const renderOptions = (opts: NestedOption[], depth = 0) =>
    opts.map((opt) => {
      const hasChildren = opt.children && opt.children.length > 0;
      const isExpanded = expandedGroups.has(opt.value);

      return (
        <div key={opt.value}>
          <button
            onClick={() => {
              if (hasChildren) {
                toggleGroup(opt.value);
              } else {
                onChange(opt.value);
                setOpen(false);
                setExpandedGroups(new Set());
              }
            }}
            className={`flex w-full items-center gap-2 px-4 py-3 text-left font-semibold transition-colors ${
              !hasChildren && opt.value === value
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted text-foreground"
            }`}
            style={{ paddingLeft: `${16 + depth * 16}px` }}
          >
            {opt.emoji && <span>{opt.emoji}</span>}
            <span className="flex-1">{opt.label}</span>
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
        <div className="absolute z-50 mt-1 w-full rounded border-2 border-border bg-card shadow-lg pixel-border overflow-hidden overflow-y-auto max-h-72 animate-in fade-in slide-in-from-top-2 duration-200">
          {renderOptions(options)}
        </div>
      )}
    </div>
  );
};

export default NestedBlockDropdown;
