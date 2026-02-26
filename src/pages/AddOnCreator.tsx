import { useState } from "react";
import BlockDropdown from "@/components/BlockDropdown";
import NestedBlockDropdown, { type NestedOption } from "@/components/NestedBlockDropdown";
import TextureUploader from "@/components/TextureUploader";
import { Download, RotateCcw, Loader2 } from "lucide-react";
import { generateAddon } from "@/lib/packGenerator";
import { toast } from "sonner";

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

// Nested behavior options per entity type
const mobBehaviors: NestedOption[] = [
  {
    value: "movement", label: "Movement", emoji: "🏃",
    children: [
      { value: "mov_walk", label: "Walk Around", emoji: "🚶" },
      { value: "mov_fly", label: "Fly", emoji: "🕊️" },
      { value: "mov_swim", label: "Swim", emoji: "🐟" },
      { value: "mov_teleport", label: "Teleport", emoji: "✨" },
    ],
  },
  {
    value: "combat", label: "Combat", emoji: "⚔️",
    children: [
      { value: "cmb_melee", label: "Melee Attack", emoji: "👊" },
      { value: "cmb_ranged", label: "Ranged Attack", emoji: "🏹" },
      { value: "cmb_explode", label: "Explode", emoji: "💥" },
      { value: "cmb_poison", label: "Poison", emoji: "☠️" },
    ],
  },
  {
    value: "social", label: "Social", emoji: "💬",
    children: [
      { value: "soc_tame", label: "Tameable", emoji: "❤️" },
      { value: "soc_trade", label: "Can Trade", emoji: "💰" },
      { value: "soc_follow", label: "Follows Player", emoji: "🐕" },
      { value: "soc_herd", label: "Herd Behavior", emoji: "🐑" },
    ],
  },
  {
    value: "special", label: "Special Abilities", emoji: "🌟",
    children: [
      { value: "spc_glow", label: "Glows in Dark", emoji: "💡" },
      { value: "spc_invis", label: "Turns Invisible", emoji: "👻" },
      { value: "spc_regen", label: "Regenerates Health", emoji: "💚" },
      { value: "spc_loot", label: "Drops Special Loot", emoji: "🎁" },
    ],
  },
];

const itemBehaviors: NestedOption[] = [
  {
    value: "usage", label: "Usage Type", emoji: "🎯",
    children: [
      { value: "use_weapon", label: "Weapon", emoji: "⚔️" },
      { value: "use_tool", label: "Tool", emoji: "⛏️" },
      { value: "use_food", label: "Food", emoji: "🍎" },
      { value: "use_potion", label: "Potion", emoji: "🧪" },
    ],
  },
  {
    value: "effects", label: "Effects", emoji: "✨",
    children: [
      { value: "eff_speed", label: "Speed Boost", emoji: "💨" },
      { value: "eff_strength", label: "Strength Boost", emoji: "💪" },
      { value: "eff_heal", label: "Healing", emoji: "💖" },
      { value: "eff_fire", label: "Fire Aspect", emoji: "🔥" },
    ],
  },
  {
    value: "rarity", label: "Rarity", emoji: "💎",
    children: [
      { value: "rar_common", label: "Common", emoji: "⬜" },
      { value: "rar_rare", label: "Rare", emoji: "🟦" },
      { value: "rar_epic", label: "Epic", emoji: "🟪" },
      { value: "rar_legendary", label: "Legendary", emoji: "🟨" },
    ],
  },
];

const blockBehaviors: NestedOption[] = [
  {
    value: "physics", label: "Physics", emoji: "🧲",
    children: [
      { value: "phys_solid", label: "Solid", emoji: "🧱" },
      { value: "phys_gravity", label: "Affected by Gravity", emoji: "⬇️" },
      { value: "phys_liquid", label: "Liquid-like", emoji: "💧" },
      { value: "phys_bouncy", label: "Bouncy", emoji: "🏀" },
    ],
  },
  {
    value: "interaction", label: "Interaction", emoji: "👆",
    children: [
      { value: "int_redstone", label: "Redstone Power", emoji: "🔴" },
      { value: "int_light", label: "Emits Light", emoji: "💡" },
      { value: "int_container", label: "Storage Container", emoji: "📦" },
      { value: "int_craft", label: "Crafting Station", emoji: "🔨" },
    ],
  },
  {
    value: "appearance", label: "Appearance", emoji: "🎨",
    children: [
      { value: "app_transparent", label: "Transparent", emoji: "🪟" },
      { value: "app_animated", label: "Animated Texture", emoji: "🎬" },
      { value: "app_connected", label: "Connected Textures", emoji: "🔗" },
    ],
  },
];

const biomeBehaviors: NestedOption[] = [
  {
    value: "climate", label: "Climate", emoji: "🌡️",
    children: [
      { value: "cli_hot", label: "Hot & Dry", emoji: "☀️" },
      { value: "cli_cold", label: "Frozen", emoji: "❄️" },
      { value: "cli_tropical", label: "Tropical", emoji: "🌴" },
      { value: "cli_stormy", label: "Stormy", emoji: "⛈️" },
    ],
  },
  {
    value: "terrain", label: "Terrain", emoji: "⛰️",
    children: [
      { value: "ter_flat", label: "Flat Plains", emoji: "🌾" },
      { value: "ter_mountains", label: "Mountains", emoji: "🏔️" },
      { value: "ter_caves", label: "Underground Caves", emoji: "🕳️" },
      { value: "ter_floating", label: "Floating Islands", emoji: "🏝️" },
    ],
  },
  {
    value: "life", label: "Wildlife", emoji: "🦜",
    children: [
      { value: "life_dense", label: "Dense Forest", emoji: "🌳" },
      { value: "life_mushroom", label: "Mushroom Fields", emoji: "🍄" },
      { value: "life_crystal", label: "Crystal Gardens", emoji: "💎" },
      { value: "life_void", label: "Barren Void", emoji: "🌑" },
    ],
  },
];

const behaviorMap: Record<string, NestedOption[]> = {
  mob: mobBehaviors,
  item: itemBehaviors,
  block: blockBehaviors,
  biome: biomeBehaviors,
};

const AddOnCreator = () => {
  const [addonType, setAddonType] = useState("");
  const [entityType, setEntityType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [addonName, setAddonName] = useState("");
  const [texture, setTexture] = useState<string | null>(null);
  const [behavior, setBehavior] = useState("");

  const [isGenerating, setIsGenerating] = useState(false);

  const handleEntityChange = (val: string) => {
    setEntityType(val);
    setBehavior(""); // reset behavior when entity changes
  };

  const handleReset = () => {
    setAddonType("");
    setEntityType("");
    setDifficulty("");
    setAddonName("");
    setTexture(null);
    setBehavior("");
  };

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      await generateAddon({ addonName, addonType, entityType, difficulty, textureUrl: texture });
      toast.success("Add-on downloaded! 🎉 Import the .mcaddon into Minecraft Bedrock!");
    } catch {
      toast.error("Oops! Something went wrong creating your add-on.");
    } finally {
      setIsGenerating(false);
    }
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
            onChange={handleEntityChange}
            placeholder="What do you want to add?"
          />
        </div>

        {/* Behavior Config — appears after entity type is chosen */}
        {entityType && behaviorMap[entityType] && (
          <div className="rounded-lg border-4 border-border bg-card p-6 pixel-border">
            <h2 className="font-pixel text-sm text-diamond mb-4">
              ⚡ Custom Behavior
            </h2>
            <NestedBlockDropdown
              label="Choose a behavior"
              options={behaviorMap[entityType]}
              value={behavior}
              onChange={setBehavior}
              placeholder="Expand a category..."
            />
          </div>
        )}

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
            disabled={!addonName || !addonType || !entityType || isGenerating}
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:scale-105 pixel-border disabled:opacity-50 disabled:hover:scale-100"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isGenerating ? "Creating..." : "Create Add-on!"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOnCreator;
