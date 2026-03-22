import { useState } from "react";
import BlockDropdown from "@/components/BlockDropdown";
import NestedBlockDropdown, { type NestedOption } from "@/components/NestedBlockDropdown";
import TextureUploader from "@/components/TextureUploader";
import { Download, RotateCcw, Loader2, Upload } from "lucide-react";
import { generateAddon, generateAddonBlob } from "@/lib/packGenerator";
import { supabase } from "@/integrations/supabase/client";
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
      { value: "mov_walk", label: "Walk Around", emoji: "🚶", tooltip: "Your mob wanders around exploring the world on foot!" },
      { value: "mov_fly", label: "Fly", emoji: "🕊️", tooltip: "Soar through the skies! Great for birds or dragons." },
      { value: "mov_swim", label: "Swim", emoji: "🐟", tooltip: "Lives in water and swims around like a fish." },
      { value: "mov_teleport", label: "Teleport", emoji: "✨", tooltip: "Poof! Disappears and reappears somewhere else." },
    ],
  },
  {
    value: "combat", label: "Combat", emoji: "⚔️",
    children: [
      { value: "cmb_melee", label: "Melee Attack", emoji: "👊", tooltip: "Punches and hits enemies up close!" },
      { value: "cmb_ranged", label: "Ranged Attack", emoji: "🏹", tooltip: "Shoots projectiles at targets from far away." },
      { value: "cmb_explode", label: "Explode", emoji: "💥", tooltip: "BOOM! Blows up when near players, like a Creeper." },
      { value: "cmb_poison", label: "Poison", emoji: "☠️", tooltip: "Poisons enemies on contact, dealing damage over time." },
    ],
  },
  {
    value: "social", label: "Social", emoji: "💬",
    children: [
      { value: "soc_tame", label: "Tameable", emoji: "❤️", tooltip: "Players can tame this mob and make it a pet!" },
      { value: "soc_trade", label: "Can Trade", emoji: "💰", tooltip: "Opens a trading menu like a Villager." },
      { value: "soc_follow", label: "Follows Player", emoji: "🐕", tooltip: "Follows the nearest player around like a loyal dog." },
      { value: "soc_herd", label: "Herd Behavior", emoji: "🐑", tooltip: "Sticks together with others of its kind in groups." },
    ],
  },
  {
    value: "special", label: "Special Abilities", emoji: "🌟",
    children: [
      { value: "spc_glow", label: "Glows in Dark", emoji: "💡", tooltip: "Emits light so you can see it at night!" },
      { value: "spc_invis", label: "Turns Invisible", emoji: "👻", tooltip: "Becomes invisible when players get close. Spooky!" },
      { value: "spc_regen", label: "Regenerates Health", emoji: "💚", tooltip: "Slowly heals itself over time, hard to defeat!" },
      { value: "spc_loot", label: "Drops Special Loot", emoji: "🎁", tooltip: "Drops rare and unique items when defeated." },
    ],
  },
];

const itemBehaviors: NestedOption[] = [
  {
    value: "usage", label: "Usage Type", emoji: "🎯",
    children: [
      { value: "use_weapon", label: "Weapon", emoji: "⚔️", tooltip: "Used to fight mobs and other players!" },
      { value: "use_tool", label: "Tool", emoji: "⛏️", tooltip: "Helps you mine, dig, or chop things faster." },
      { value: "use_food", label: "Food", emoji: "🍎", tooltip: "Eat it to restore hunger and health." },
      { value: "use_potion", label: "Potion", emoji: "🧪", tooltip: "Drink it for a magical temporary effect!" },
    ],
  },
  {
    value: "effects", label: "Effects", emoji: "✨",
    children: [
      { value: "eff_speed", label: "Speed Boost", emoji: "💨", tooltip: "Makes you run super fast like a cheetah!" },
      { value: "eff_strength", label: "Strength Boost", emoji: "💪", tooltip: "Hit harder and deal more damage to enemies." },
      { value: "eff_heal", label: "Healing", emoji: "💖", tooltip: "Restores hearts so you don't get knocked out." },
      { value: "eff_fire", label: "Fire Aspect", emoji: "🔥", tooltip: "Sets enemies on fire when you hit them!" },
    ],
  },
  {
    value: "rarity", label: "Rarity", emoji: "💎",
    children: [
      { value: "rar_common", label: "Common", emoji: "⬜", tooltip: "Easy to find — nothing special but still useful!" },
      { value: "rar_rare", label: "Rare", emoji: "🟦", tooltip: "Hard to find! Has a blue name tag." },
      { value: "rar_epic", label: "Epic", emoji: "🟪", tooltip: "Super rare with a purple glow. Very powerful!" },
      { value: "rar_legendary", label: "Legendary", emoji: "🟨", tooltip: "The rarest of all! Golden name and amazing powers." },
    ],
  },
];

const blockBehaviors: NestedOption[] = [
  {
    value: "physics", label: "Physics", emoji: "🧲",
    children: [
      { value: "phys_solid", label: "Solid", emoji: "🧱", tooltip: "A normal solid block you can walk on and build with." },
      { value: "phys_gravity", label: "Affected by Gravity", emoji: "⬇️", tooltip: "Falls down like sand or gravel when unsupported." },
      { value: "phys_liquid", label: "Liquid-like", emoji: "💧", tooltip: "Flows and spreads like water or lava!" },
      { value: "phys_bouncy", label: "Bouncy", emoji: "🏀", tooltip: "Boing! Players and mobs bounce off this block." },
    ],
  },
  {
    value: "interaction", label: "Interaction", emoji: "👆",
    children: [
      { value: "int_redstone", label: "Redstone Power", emoji: "🔴", tooltip: "Emits a redstone signal for machines and contraptions." },
      { value: "int_light", label: "Emits Light", emoji: "💡", tooltip: "Glows brightly to light up dark areas." },
      { value: "int_container", label: "Storage Container", emoji: "📦", tooltip: "Store your items inside, like a chest!" },
      { value: "int_craft", label: "Crafting Station", emoji: "🔨", tooltip: "Use it to craft new and unique items." },
    ],
  },
  {
    value: "appearance", label: "Appearance", emoji: "🎨",
    children: [
      { value: "app_transparent", label: "Transparent", emoji: "🪟", tooltip: "See-through like glass! Light passes through." },
      { value: "app_animated", label: "Animated Texture", emoji: "🎬", tooltip: "The texture moves and changes over time." },
      { value: "app_connected", label: "Connected Textures", emoji: "🔗", tooltip: "Blends seamlessly with neighboring blocks." },
    ],
  },
];

const biomeBehaviors: NestedOption[] = [
  {
    value: "climate", label: "Climate", emoji: "🌡️",
    children: [
      { value: "cli_hot", label: "Hot & Dry", emoji: "☀️", tooltip: "Scorching desert heat — bring water!" },
      { value: "cli_cold", label: "Frozen", emoji: "❄️", tooltip: "Everything is covered in snow and ice." },
      { value: "cli_tropical", label: "Tropical", emoji: "🌴", tooltip: "Warm, lush, and full of colorful plants." },
      { value: "cli_stormy", label: "Stormy", emoji: "⛈️", tooltip: "Constant thunder and lightning — watch out!" },
    ],
  },
  {
    value: "terrain", label: "Terrain", emoji: "⛰️",
    children: [
      { value: "ter_flat", label: "Flat Plains", emoji: "🌾", tooltip: "Wide open grasslands, perfect for building." },
      { value: "ter_mountains", label: "Mountains", emoji: "🏔️", tooltip: "Towering peaks with snow-capped summits." },
      { value: "ter_caves", label: "Underground Caves", emoji: "🕳️", tooltip: "Deep underground tunnels full of secrets." },
      { value: "ter_floating", label: "Floating Islands", emoji: "🏝️", tooltip: "Islands that float in the sky! Don't fall off!" },
    ],
  },
  {
    value: "life", label: "Wildlife", emoji: "🦜",
    children: [
      { value: "life_dense", label: "Dense Forest", emoji: "🌳", tooltip: "Thick trees everywhere — easy to get lost!" },
      { value: "life_mushroom", label: "Mushroom Fields", emoji: "🍄", tooltip: "Giant mushrooms as tall as trees!" },
      { value: "life_crystal", label: "Crystal Gardens", emoji: "💎", tooltip: "Sparkling crystal formations light up the ground." },
      { value: "life_void", label: "Barren Void", emoji: "🌑", tooltip: "Empty and dark — nothing grows here." },
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
  const [behaviors, setBehaviors] = useState<string[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handleEntityChange = (val: string) => {
    setEntityType(val);
    setBehaviors([]); // reset behaviors when entity changes
  };

  const handleReset = () => {
    setAddonType("");
    setEntityType("");
    setDifficulty("");
    setAddonName("");
    setTexture(null);
    setBehaviors([]);
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

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Prevent duplicates
      const { data: existing } = await supabase.from("packs").select("id").eq("name", addonName).limit(1);
      if (existing && existing.length > 0) {
        toast.error(`"${addonName}" is already in the store! Use a different name.`);
        setIsPublishing(false);
        return;
      }
      const blob = await generateAddonBlob({ addonName, addonType, entityType, difficulty, textureUrl: texture });
      const fileName = `${addonName.replace(/\s/g, "_")}_${Date.now()}.mcaddon`;

      // Upload pack file
      const { error: uploadError } = await supabase.storage
        .from("packs")
        .upload(fileName, blob, { contentType: "application/octet-stream" });
      if (uploadError) throw uploadError;

      // Upload thumbnail if texture exists
      let thumbnailPath: string | null = null;
      if (texture) {
        const thumbName = `thumbs/${addonName.replace(/\s/g, "_")}_${Date.now()}.png`;
        const thumbBlob = await fetch(texture).then((r) => r.blob());
        const { error: thumbErr } = await supabase.storage
          .from("packs")
          .upload(thumbName, thumbBlob, { contentType: "image/png" });
        if (!thumbErr) thumbnailPath = thumbName;
      }

      // Insert into packs table
      const packType = addonType === "both" ? "addon" : addonType;
      const { error: dbError } = await supabase.from("packs").insert({
        name: addonName,
        description: `Custom ${entityType} add-on — ${difficulty || "any"} difficulty`,
        pack_type: packType as "behavior" | "resource" | "skin" | "addon",
        entity_type: entityType,
        file_path: fileName,
        thumbnail_path: thumbnailPath,
      });
      if (dbError) throw dbError;

      toast.success("Published to the Pack Store! 🎉 Others can now download it.");
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
              label="Choose behaviors"
              options={behaviorMap[entityType]}
              value={behaviors}
              onChange={setBehaviors}
              placeholder="Pick abilities to combine!"
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

        {/* Summary Panel — visible when key fields are filled */}
        {addonName && addonType && entityType && (
          <div className="rounded-lg border-4 border-primary/40 bg-primary/5 p-6 pixel-border-strong space-y-4">
            <h2 className="font-pixel text-sm text-primary mb-2">📋 Your Add-on Summary</h2>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded bg-card p-3 pixel-border">
                <span className="text-muted-foreground text-xs font-bold uppercase tracking-wide">Name</span>
                <p className="font-bold text-foreground mt-1 truncate">{addonName}</p>
              </div>
              <div className="rounded bg-card p-3 pixel-border">
                <span className="text-muted-foreground text-xs font-bold uppercase tracking-wide">Pack Type</span>
                <p className="font-bold text-foreground mt-1">
                  {addonTypes.find(t => t.value === addonType)?.emoji}{" "}
                  {addonTypes.find(t => t.value === addonType)?.label}
                </p>
              </div>
              <div className="rounded bg-card p-3 pixel-border">
                <span className="text-muted-foreground text-xs font-bold uppercase tracking-wide">Entity</span>
                <p className="font-bold text-foreground mt-1">
                  {entityTypes.find(t => t.value === entityType)?.emoji}{" "}
                  {entityTypes.find(t => t.value === entityType)?.label}
                </p>
              </div>
              <div className="rounded bg-card p-3 pixel-border">
                <span className="text-muted-foreground text-xs font-bold uppercase tracking-wide">Difficulty</span>
                <p className="font-bold text-foreground mt-1">
                  {difficulty
                    ? `${difficulties.find(d => d.value === difficulty)?.emoji} ${difficulties.find(d => d.value === difficulty)?.label}`
                    : "—"}
                </p>
              </div>
            </div>

            {/* Selected behaviors */}
            {behaviors.length > 0 && (
              <div className="rounded bg-card p-3 pixel-border">
                <span className="text-muted-foreground text-xs font-bold uppercase tracking-wide">Abilities</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {behaviors.map(b => {
                    const match = behaviorMap[entityType]
                      ?.flatMap(cat => cat.children ?? [])
                      .find(c => c.value === b);
                    return (
                      <span
                        key={b}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-sm font-bold text-primary"
                      >
                        {match?.emoji} {match?.label ?? b}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Texture preview */}
            {texture && (
              <div className="rounded bg-card p-3 pixel-border flex items-center gap-3">
                <img
                  src={texture}
                  alt="Texture preview"
                  className="h-12 w-12 rounded border-2 border-border object-cover"
                  style={{ imageRendering: "pixelated" }}
                />
                <span className="text-sm font-bold text-foreground">Custom texture attached ✅</span>
              </div>
            )}
          </div>
        )}

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
            disabled={!addonName || !addonType || !entityType || isGenerating}
            onClick={handleDownload}
            className="flex flex-1 items-center justify-center gap-2 rounded bg-primary px-6 py-3 font-bold text-primary-foreground transition-all hover:scale-105 pixel-border disabled:opacity-50 disabled:hover:scale-100"
          >
            {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isGenerating ? "Creating..." : "Create Add-on!"}
          </button>
          <button
            disabled={!addonName || !addonType || !entityType || isPublishing}
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

export default AddOnCreator;
