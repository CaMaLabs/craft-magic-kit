export interface TextureItem {
  id: string;
  name: string;
  category: TextureCategory;
  subcategory: string;
  emoji: string;
  description: string;
  tags: string[];
  color: string;
}

export type TextureCategory = "blocks" | "items" | "mobs" | "nature" | "building" | "food" | "weapons" | "armor" | "decoration" | "redstone";

export const textureCategories: { key: TextureCategory; label: string; emoji: string }[] = [
  { key: "blocks", label: "Blocks", emoji: "🧱" },
  { key: "nature", label: "Nature", emoji: "🌿" },
  { key: "building", label: "Building", emoji: "🏗️" },
  { key: "items", label: "Items", emoji: "⚒️" },
  { key: "weapons", label: "Weapons", emoji: "⚔️" },
  { key: "armor", label: "Armor", emoji: "🛡️" },
  { key: "food", label: "Food", emoji: "🍎" },
  { key: "mobs", label: "Mobs", emoji: "🐾" },
  { key: "decoration", label: "Decor", emoji: "🪴" },
  { key: "redstone", label: "Redstone", emoji: "🔴" },
];

export const textureLibrary: TextureItem[] = [
  // === BLOCKS (20) ===
  { id: "stone_brick_mossy", name: "Mossy Stone Brick", category: "blocks", subcategory: "Stone", emoji: "🧱", description: "Weathered stone bricks covered in moss", tags: ["stone", "mossy", "medieval"], color: "hsl(var(--creeper))" },
  { id: "obsidian_cracked", name: "Cracked Obsidian", category: "blocks", subcategory: "Stone", emoji: "🟣", description: "Dark obsidian with glowing purple cracks", tags: ["obsidian", "nether", "dark"], color: "hsl(var(--enderman))" },
  { id: "diamond_block_shimmer", name: "Shimmering Diamond", category: "blocks", subcategory: "Ore", emoji: "💎", description: "Brilliant diamond block with sparkle effect", tags: ["diamond", "precious", "shiny"], color: "hsl(var(--diamond))" },
  { id: "gold_block_ornate", name: "Ornate Gold Block", category: "blocks", subcategory: "Ore", emoji: "🥇", description: "Decorative gold block with carved patterns", tags: ["gold", "fancy", "temple"], color: "hsl(var(--gold))" },
  { id: "lava_animated", name: "Flowing Lava", category: "blocks", subcategory: "Liquid", emoji: "🌋", description: "Hot flowing lava texture", tags: ["lava", "hot", "nether"], color: "hsl(var(--lava))" },
  { id: "ice_crystal", name: "Crystal Ice", category: "blocks", subcategory: "Ice", emoji: "🧊", description: "Transparent crystalline ice block", tags: ["ice", "frozen", "cold"], color: "hsl(var(--accent))" },
  { id: "emerald_block", name: "Emerald Block", category: "blocks", subcategory: "Ore", emoji: "💚", description: "Rich emerald block with faceted surface", tags: ["emerald", "green", "village"], color: "hsl(var(--creeper))" },
  { id: "ruby_block", name: "Ruby Block", category: "blocks", subcategory: "Ore", emoji: "❤️", description: "Custom deep red ruby block", tags: ["ruby", "red", "custom"], color: "hsl(var(--destructive))" },
  { id: "amethyst_cluster", name: "Amethyst Cluster", category: "blocks", subcategory: "Crystal", emoji: "🔮", description: "Glowing amethyst crystal formation", tags: ["amethyst", "purple", "geode"], color: "hsl(var(--enderman))" },
  { id: "copper_oxidized", name: "Oxidized Copper", category: "blocks", subcategory: "Metal", emoji: "🟢", description: "Weathered copper with green patina", tags: ["copper", "aged", "green"], color: "hsl(var(--creeper))" },
  { id: "netherite_block", name: "Netherite Block", category: "blocks", subcategory: "Metal", emoji: "⬛", description: "Ultra-tough dark netherite block", tags: ["netherite", "strong", "nether"], color: "hsl(var(--foreground))" },
  { id: "prismarine_dark", name: "Dark Prismarine", category: "blocks", subcategory: "Ocean", emoji: "🌊", description: "Deep ocean dark prismarine with patterns", tags: ["ocean", "dark", "monument"], color: "hsl(var(--accent))" },
  { id: "end_stone_carved", name: "Carved End Stone", category: "blocks", subcategory: "End", emoji: "🌀", description: "End stone with dragon carvings", tags: ["end", "dragon", "carved"], color: "hsl(var(--gold))" },
  { id: "terracotta_glazed", name: "Glazed Terracotta", category: "blocks", subcategory: "Clay", emoji: "🎨", description: "Colorful glazed terracotta pattern", tags: ["terracotta", "colorful", "mesa"], color: "hsl(var(--secondary))" },
  { id: "concrete_rainbow", name: "Rainbow Concrete", category: "blocks", subcategory: "Concrete", emoji: "🌈", description: "Vibrant rainbow gradient concrete", tags: ["rainbow", "colorful", "build"], color: "hsl(var(--primary))" },
  { id: "wool_galaxy", name: "Galaxy Wool", category: "blocks", subcategory: "Wool", emoji: "🌌", description: "Deep space galaxy pattern wool", tags: ["space", "galaxy", "dark"], color: "hsl(var(--enderman))" },
  { id: "glass_stained_fire", name: "Fire Stained Glass", category: "blocks", subcategory: "Glass", emoji: "🔥", description: "Flame-patterned stained glass", tags: ["glass", "fire", "transparent"], color: "hsl(var(--lava))" },
  { id: "sandstone_hieroglyph", name: "Hieroglyph Sandstone", category: "blocks", subcategory: "Sand", emoji: "🏺", description: "Ancient Egyptian hieroglyph sandstone", tags: ["desert", "ancient", "egypt"], color: "hsl(var(--gold))" },
  { id: "bookshelf_enchanted", name: "Enchanted Bookshelf", category: "blocks", subcategory: "Wood", emoji: "📚", description: "Glowing enchanted bookshelf", tags: ["enchanting", "magic", "books"], color: "hsl(var(--secondary))" },
  { id: "tnt_neon", name: "Neon TNT", category: "blocks", subcategory: "Explosive", emoji: "💣", description: "Glowing neon-colored TNT block", tags: ["tnt", "explosive", "neon"], color: "hsl(var(--destructive))" },

  // === NATURE (15) ===
  { id: "oak_leaves_autumn", name: "Autumn Oak Leaves", category: "nature", subcategory: "Leaves", emoji: "🍂", description: "Beautiful fall-colored oak leaves", tags: ["autumn", "leaves", "orange"], color: "hsl(var(--secondary))" },
  { id: "cherry_blossom", name: "Cherry Blossoms", category: "nature", subcategory: "Leaves", emoji: "🌸", description: "Pink cherry blossom leaves", tags: ["cherry", "pink", "spring"], color: "hsl(var(--accent))" },
  { id: "bamboo_tropical", name: "Tropical Bamboo", category: "nature", subcategory: "Plants", emoji: "🎍", description: "Lush tropical bamboo stalks", tags: ["bamboo", "jungle", "green"], color: "hsl(var(--creeper))" },
  { id: "mushroom_glowing", name: "Glow Mushroom", category: "nature", subcategory: "Mushroom", emoji: "🍄", description: "Bioluminescent glowing mushroom", tags: ["mushroom", "glow", "cave"], color: "hsl(var(--accent))" },
  { id: "flower_rose_blue", name: "Blue Rose", category: "nature", subcategory: "Flowers", emoji: "🌹", description: "Rare magical blue rose", tags: ["flower", "blue", "magic"], color: "hsl(var(--accent))" },
  { id: "flower_sunflower", name: "Giant Sunflower", category: "nature", subcategory: "Flowers", emoji: "🌻", description: "Bright happy sunflower", tags: ["flower", "yellow", "happy"], color: "hsl(var(--gold))" },
  { id: "grass_enchanted", name: "Enchanted Grass", category: "nature", subcategory: "Ground", emoji: "✨", description: "Sparkly magical grass block", tags: ["grass", "magic", "sparkle"], color: "hsl(var(--creeper))" },
  { id: "mycelium_neon", name: "Neon Mycelium", category: "nature", subcategory: "Ground", emoji: "🟣", description: "Glowing neon mushroom mycelium", tags: ["mushroom", "neon", "glow"], color: "hsl(var(--enderman))" },
  { id: "cactus_flowering", name: "Flowering Cactus", category: "nature", subcategory: "Plants", emoji: "🌵", description: "Desert cactus with pink flowers", tags: ["cactus", "desert", "flower"], color: "hsl(var(--creeper))" },
  { id: "vine_glowing", name: "Glow Vines", category: "nature", subcategory: "Plants", emoji: "🌿", description: "Bioluminescent cave vines", tags: ["vine", "glow", "cave"], color: "hsl(var(--creeper))" },
  { id: "coral_brain", name: "Brain Coral", category: "nature", subcategory: "Ocean", emoji: "🧠", description: "Vibrant pink brain coral", tags: ["coral", "ocean", "pink"], color: "hsl(var(--accent))" },
  { id: "kelp_giant", name: "Giant Kelp", category: "nature", subcategory: "Ocean", emoji: "🌊", description: "Tall swaying ocean kelp", tags: ["kelp", "ocean", "green"], color: "hsl(var(--creeper))" },
  { id: "snow_sparkling", name: "Sparkling Snow", category: "nature", subcategory: "Ground", emoji: "❄️", description: "Fresh snow with diamond sparkles", tags: ["snow", "winter", "sparkle"], color: "hsl(var(--accent))" },
  { id: "moss_ancient", name: "Ancient Moss", category: "nature", subcategory: "Ground", emoji: "🌿", description: "Thick ancient moss carpet", tags: ["moss", "lush", "green"], color: "hsl(var(--creeper))" },
  { id: "lily_pad_lotus", name: "Lotus Lily Pad", category: "nature", subcategory: "Water", emoji: "🪷", description: "Elegant lotus flower on lily pad", tags: ["lotus", "water", "flower"], color: "hsl(var(--creeper))" },

  // === BUILDING (12) ===
  { id: "brick_medieval", name: "Medieval Brick", category: "building", subcategory: "Brick", emoji: "🏰", description: "Aged medieval castle bricks", tags: ["medieval", "castle", "brick"], color: "hsl(var(--secondary))" },
  { id: "marble_white", name: "White Marble", category: "building", subcategory: "Stone", emoji: "🏛️", description: "Polished white marble with veins", tags: ["marble", "fancy", "white"], color: "hsl(var(--muted))" },
  { id: "wood_dark_oak_carved", name: "Carved Dark Oak", category: "building", subcategory: "Wood", emoji: "🪵", description: "Dark oak with intricate carvings", tags: ["wood", "carved", "dark"], color: "hsl(var(--secondary))" },
  { id: "tile_mosaic", name: "Mosaic Tiles", category: "building", subcategory: "Tile", emoji: "🔷", description: "Colorful mosaic floor tiles", tags: ["mosaic", "floor", "colorful"], color: "hsl(var(--accent))" },
  { id: "pillar_quartz", name: "Quartz Pillar", category: "building", subcategory: "Stone", emoji: "🏛️", description: "Elegant quartz pillar block", tags: ["quartz", "pillar", "fancy"], color: "hsl(var(--muted))" },
  { id: "roof_thatch", name: "Thatch Roof", category: "building", subcategory: "Roof", emoji: "🏠", description: "Rustic straw thatch roofing", tags: ["roof", "village", "rustic"], color: "hsl(var(--gold))" },
  { id: "fence_iron_ornate", name: "Ornate Iron Fence", category: "building", subcategory: "Fence", emoji: "🏗️", description: "Decorative wrought iron fence", tags: ["fence", "iron", "decorative"], color: "hsl(var(--foreground))" },
  { id: "window_gothic", name: "Gothic Window", category: "building", subcategory: "Glass", emoji: "⛪", description: "Pointed arch gothic window", tags: ["window", "gothic", "church"], color: "hsl(var(--accent))" },
  { id: "door_castle", name: "Castle Door", category: "building", subcategory: "Door", emoji: "🚪", description: "Heavy reinforced castle door", tags: ["door", "castle", "iron"], color: "hsl(var(--secondary))" },
  { id: "stairs_spiral", name: "Spiral Staircase", category: "building", subcategory: "Stairs", emoji: "🔄", description: "Elegant spiral stone staircase", tags: ["stairs", "spiral", "stone"], color: "hsl(var(--muted))" },
  { id: "wall_cobblestone_mossy", name: "Mossy Cobblestone", category: "building", subcategory: "Wall", emoji: "🧱", description: "Old cobblestone covered in moss", tags: ["cobblestone", "mossy", "old"], color: "hsl(var(--creeper))" },
  { id: "floor_checker", name: "Checkered Floor", category: "building", subcategory: "Floor", emoji: "♟️", description: "Classic black and white checkered floor", tags: ["checker", "floor", "classic"], color: "hsl(var(--foreground))" },

  // === ITEMS (12) ===
  { id: "pickaxe_diamond_enchanted", name: "Enchanted Diamond Pick", category: "items", subcategory: "Tools", emoji: "⛏️", description: "Glowing enchanted diamond pickaxe", tags: ["pickaxe", "diamond", "enchanted"], color: "hsl(var(--diamond))" },
  { id: "compass_ancient", name: "Ancient Compass", category: "items", subcategory: "Navigation", emoji: "🧭", description: "Mystical compass pointing to treasure", tags: ["compass", "navigation", "treasure"], color: "hsl(var(--gold))" },
  { id: "map_treasure", name: "Treasure Map", category: "items", subcategory: "Navigation", emoji: "🗺️", description: "Weathered treasure map with X marks", tags: ["map", "treasure", "adventure"], color: "hsl(var(--secondary))" },
  { id: "potion_rainbow", name: "Rainbow Potion", category: "items", subcategory: "Potions", emoji: "🧪", description: "Swirling rainbow-colored potion", tags: ["potion", "rainbow", "magic"], color: "hsl(var(--primary))" },
  { id: "book_spells", name: "Spell Book", category: "items", subcategory: "Magic", emoji: "📖", description: "Ancient leather-bound spell book", tags: ["book", "magic", "spells"], color: "hsl(var(--enderman))" },
  { id: "key_golden", name: "Golden Key", category: "items", subcategory: "Keys", emoji: "🗝️", description: "Ornate golden dungeon key", tags: ["key", "gold", "dungeon"], color: "hsl(var(--gold))" },
  { id: "gem_sapphire", name: "Sapphire Gem", category: "items", subcategory: "Gems", emoji: "💠", description: "Perfect cut sapphire gemstone", tags: ["sapphire", "blue", "gem"], color: "hsl(var(--accent))" },
  { id: "lantern_soul", name: "Soul Lantern", category: "items", subcategory: "Light", emoji: "🏮", description: "Eerie blue soul fire lantern", tags: ["lantern", "soul", "blue"], color: "hsl(var(--accent))" },
  { id: "crystal_ball", name: "Crystal Ball", category: "items", subcategory: "Magic", emoji: "🔮", description: "Fortune-telling crystal ball", tags: ["crystal", "magic", "fortune"], color: "hsl(var(--enderman))" },
  { id: "pearl_ender", name: "Ender Pearl", category: "items", subcategory: "Ender", emoji: "🟢", description: "Glowing ender pearl with swirls", tags: ["ender", "teleport", "pearl"], color: "hsl(var(--creeper))" },
  { id: "totem_undying", name: "Totem of Undying", category: "items", subcategory: "Magic", emoji: "🗿", description: "Mystical totem that cheats death", tags: ["totem", "undying", "rare"], color: "hsl(var(--gold))" },
  { id: "nether_star", name: "Nether Star", category: "items", subcategory: "Boss", emoji: "⭐", description: "Brilliant nether star from the Wither", tags: ["star", "wither", "boss"], color: "hsl(var(--gold))" },

  // === WEAPONS (10) ===
  { id: "sword_dragon", name: "Dragon Slayer", category: "weapons", subcategory: "Swords", emoji: "🗡️", description: "Legendary dragon-forged sword", tags: ["sword", "dragon", "legendary"], color: "hsl(var(--destructive))" },
  { id: "bow_flame", name: "Flame Bow", category: "weapons", subcategory: "Ranged", emoji: "🏹", description: "Enchanted bow with fire arrows", tags: ["bow", "flame", "ranged"], color: "hsl(var(--lava))" },
  { id: "trident_ocean", name: "Ocean Trident", category: "weapons", subcategory: "Trident", emoji: "🔱", description: "Powerful trident of the deep", tags: ["trident", "ocean", "powerful"], color: "hsl(var(--accent))" },
  { id: "axe_berserker", name: "Berserker Axe", category: "weapons", subcategory: "Axes", emoji: "🪓", description: "Brutal double-headed battle axe", tags: ["axe", "battle", "brutal"], color: "hsl(var(--destructive))" },
  { id: "crossbow_repeating", name: "Repeating Crossbow", category: "weapons", subcategory: "Ranged", emoji: "🎯", description: "Rapid-fire enchanted crossbow", tags: ["crossbow", "rapid", "ranged"], color: "hsl(var(--secondary))" },
  { id: "mace_thunder", name: "Thunder Mace", category: "weapons", subcategory: "Maces", emoji: "⚡", description: "Lightning-infused heavy mace", tags: ["mace", "thunder", "lightning"], color: "hsl(var(--gold))" },
  { id: "dagger_shadow", name: "Shadow Dagger", category: "weapons", subcategory: "Daggers", emoji: "🗡️", description: "Silent assassin's shadow dagger", tags: ["dagger", "shadow", "stealth"], color: "hsl(var(--enderman))" },
  { id: "staff_ice", name: "Ice Staff", category: "weapons", subcategory: "Staves", emoji: "🧊", description: "Frost wizard's ice staff", tags: ["staff", "ice", "magic"], color: "hsl(var(--accent))" },
  { id: "hammer_titan", name: "Titan Hammer", category: "weapons", subcategory: "Hammers", emoji: "🔨", description: "Ground-shaking titan warhammer", tags: ["hammer", "titan", "heavy"], color: "hsl(var(--secondary))" },
  { id: "scythe_reaper", name: "Reaper's Scythe", category: "weapons", subcategory: "Scythes", emoji: "💀", description: "Dark reaper's harvest scythe", tags: ["scythe", "dark", "reaper"], color: "hsl(var(--foreground))" },

  // === ARMOR (10) ===
  { id: "helmet_knight", name: "Knight Helmet", category: "armor", subcategory: "Helmets", emoji: "⛑️", description: "Full plate knight's helmet", tags: ["helmet", "knight", "plate"], color: "hsl(var(--muted))" },
  { id: "chestplate_dragon", name: "Dragon Chestplate", category: "armor", subcategory: "Chest", emoji: "🛡️", description: "Dragonscale chestplate armor", tags: ["chest", "dragon", "scales"], color: "hsl(var(--destructive))" },
  { id: "leggings_mithril", name: "Mithril Leggings", category: "armor", subcategory: "Legs", emoji: "🦿", description: "Lightweight mithril leg armor", tags: ["leggings", "mithril", "light"], color: "hsl(var(--accent))" },
  { id: "boots_winged", name: "Winged Boots", category: "armor", subcategory: "Boots", emoji: "👟", description: "Enchanted boots with tiny wings", tags: ["boots", "wings", "flying"], color: "hsl(var(--gold))" },
  { id: "shield_royal", name: "Royal Shield", category: "armor", subcategory: "Shields", emoji: "🛡️", description: "Royal crest decorated shield", tags: ["shield", "royal", "crest"], color: "hsl(var(--gold))" },
  { id: "cape_phantom", name: "Phantom Cape", category: "armor", subcategory: "Capes", emoji: "🦇", description: "Dark phantom membrane cape", tags: ["cape", "phantom", "dark"], color: "hsl(var(--enderman))" },
  { id: "crown_king", name: "King's Crown", category: "armor", subcategory: "Helmets", emoji: "👑", description: "Golden jeweled king's crown", tags: ["crown", "king", "gold"], color: "hsl(var(--gold))" },
  { id: "armor_samurai", name: "Samurai Armor", category: "armor", subcategory: "Sets", emoji: "⚔️", description: "Full traditional samurai armor set", tags: ["samurai", "japan", "warrior"], color: "hsl(var(--destructive))" },
  { id: "gauntlets_power", name: "Power Gauntlets", category: "armor", subcategory: "Gloves", emoji: "🥊", description: "Strength-enhancing power gauntlets", tags: ["gauntlets", "power", "strength"], color: "hsl(var(--lava))" },
  { id: "armor_stealth", name: "Stealth Suit", category: "armor", subcategory: "Sets", emoji: "🥷", description: "Near-invisible stealth armor", tags: ["stealth", "invisible", "ninja"], color: "hsl(var(--foreground))" },

  // === FOOD (10) ===
  { id: "cake_rainbow", name: "Rainbow Cake", category: "food", subcategory: "Baked", emoji: "🎂", description: "Multi-layered rainbow celebration cake", tags: ["cake", "rainbow", "party"], color: "hsl(var(--primary))" },
  { id: "apple_golden_enchanted", name: "Enchanted Golden Apple", category: "food", subcategory: "Fruit", emoji: "🍎", description: "Ultra-rare enchanted golden apple", tags: ["apple", "golden", "enchanted"], color: "hsl(var(--gold))" },
  { id: "steak_perfect", name: "Perfect Steak", category: "food", subcategory: "Meat", emoji: "🥩", description: "Perfectly cooked juicy steak", tags: ["steak", "meat", "cooked"], color: "hsl(var(--secondary))" },
  { id: "cookie_chocolate", name: "Chocolate Cookie", category: "food", subcategory: "Baked", emoji: "🍪", description: "Fresh warm chocolate chip cookie", tags: ["cookie", "chocolate", "sweet"], color: "hsl(var(--secondary))" },
  { id: "potion_healing", name: "Healing Potion", category: "food", subcategory: "Potions", emoji: "❤️‍🩹", description: "Sparkling red healing potion", tags: ["potion", "healing", "red"], color: "hsl(var(--destructive))" },
  { id: "pie_pumpkin", name: "Pumpkin Pie", category: "food", subcategory: "Baked", emoji: "🥧", description: "Homemade pumpkin pie with cream", tags: ["pie", "pumpkin", "autumn"], color: "hsl(var(--secondary))" },
  { id: "berry_glow", name: "Glow Berries", category: "food", subcategory: "Fruit", emoji: "🫐", description: "Cave-grown glowing berries", tags: ["berry", "glow", "cave"], color: "hsl(var(--gold))" },
  { id: "bread_artisan", name: "Artisan Bread", category: "food", subcategory: "Baked", emoji: "🍞", description: "Crusty artisan wheat bread", tags: ["bread", "baked", "wheat"], color: "hsl(var(--secondary))" },
  { id: "candy_lollipop", name: "Lollipop", category: "food", subcategory: "Sweets", emoji: "🍭", description: "Swirly rainbow lollipop candy", tags: ["candy", "sweet", "rainbow"], color: "hsl(var(--primary))" },
  { id: "sushi_roll", name: "Sushi Roll", category: "food", subcategory: "Exotic", emoji: "🍣", description: "Fresh salmon sushi roll", tags: ["sushi", "fish", "exotic"], color: "hsl(var(--lava))" },

  // === MOBS (15) ===
  { id: "mob_dragon_baby", name: "Baby Dragon", category: "mobs", subcategory: "Dragons", emoji: "🐉", description: "Adorable baby ender dragon pet", tags: ["dragon", "baby", "pet"], color: "hsl(var(--enderman))" },
  { id: "mob_wolf_dire", name: "Dire Wolf", category: "mobs", subcategory: "Wolves", emoji: "🐺", description: "Large fierce dire wolf mount", tags: ["wolf", "dire", "mount"], color: "hsl(var(--muted))" },
  { id: "mob_cat_neon", name: "Neon Cat", category: "mobs", subcategory: "Cats", emoji: "🐱", description: "Glow-in-the-dark neon cat", tags: ["cat", "neon", "glow"], color: "hsl(var(--accent))" },
  { id: "mob_golem_crystal", name: "Crystal Golem", category: "mobs", subcategory: "Golems", emoji: "🤖", description: "Protective crystal guardian golem", tags: ["golem", "crystal", "guardian"], color: "hsl(var(--diamond))" },
  { id: "mob_phoenix", name: "Phoenix", category: "mobs", subcategory: "Mythical", emoji: "🔥", description: "Majestic fire phoenix bird", tags: ["phoenix", "fire", "mythical"], color: "hsl(var(--lava))" },
  { id: "mob_unicorn", name: "Unicorn", category: "mobs", subcategory: "Mythical", emoji: "🦄", description: "Magical rainbow unicorn mount", tags: ["unicorn", "rainbow", "magic"], color: "hsl(var(--accent))" },
  { id: "mob_fox_arctic", name: "Arctic Fox", category: "mobs", subcategory: "Wildlife", emoji: "🦊", description: "Fluffy white arctic fox", tags: ["fox", "arctic", "white"], color: "hsl(var(--muted))" },
  { id: "mob_parrot_pirate", name: "Pirate Parrot", category: "mobs", subcategory: "Birds", emoji: "🦜", description: "Colorful pirate shoulder parrot", tags: ["parrot", "pirate", "colorful"], color: "hsl(var(--creeper))" },
  { id: "mob_spider_queen", name: "Spider Queen", category: "mobs", subcategory: "Bosses", emoji: "🕷️", description: "Terrifying spider queen boss mob", tags: ["spider", "boss", "queen"], color: "hsl(var(--enderman))" },
  { id: "mob_slime_king", name: "Slime King", category: "mobs", subcategory: "Bosses", emoji: "🟢", description: "Giant bouncing slime king", tags: ["slime", "king", "boss"], color: "hsl(var(--creeper))" },
  { id: "mob_skeleton_knight", name: "Skeleton Knight", category: "mobs", subcategory: "Undead", emoji: "💀", description: "Armored skeleton warrior", tags: ["skeleton", "knight", "undead"], color: "hsl(var(--muted))" },
  { id: "mob_fairy", name: "Forest Fairy", category: "mobs", subcategory: "Mythical", emoji: "🧚", description: "Tiny glowing forest fairy", tags: ["fairy", "forest", "glow"], color: "hsl(var(--creeper))" },
  { id: "mob_kraken", name: "Kraken", category: "mobs", subcategory: "Ocean", emoji: "🦑", description: "Massive ocean kraken boss", tags: ["kraken", "ocean", "boss"], color: "hsl(var(--accent))" },
  { id: "mob_griffin", name: "Griffin", category: "mobs", subcategory: "Mythical", emoji: "🦅", description: "Majestic flying griffin mount", tags: ["griffin", "flying", "mount"], color: "hsl(var(--gold))" },
  { id: "mob_panda_red", name: "Red Panda", category: "mobs", subcategory: "Wildlife", emoji: "🐼", description: "Cute red panda pet companion", tags: ["panda", "red", "cute"], color: "hsl(var(--lava))" },

  // === DECORATION (10) ===
  { id: "banner_dragon", name: "Dragon Banner", category: "decoration", subcategory: "Banners", emoji: "🏴", description: "Fearsome dragon sigil banner", tags: ["banner", "dragon", "medieval"], color: "hsl(var(--destructive))" },
  { id: "painting_landscape", name: "Landscape Painting", category: "decoration", subcategory: "Art", emoji: "🖼️", description: "Beautiful mountain landscape painting", tags: ["painting", "landscape", "art"], color: "hsl(var(--creeper))" },
  { id: "chandelier_crystal", name: "Crystal Chandelier", category: "decoration", subcategory: "Lighting", emoji: "💡", description: "Sparkling crystal chandelier", tags: ["chandelier", "crystal", "fancy"], color: "hsl(var(--gold))" },
  { id: "carpet_persian", name: "Persian Carpet", category: "decoration", subcategory: "Rugs", emoji: "🧶", description: "Ornate Persian carpet pattern", tags: ["carpet", "persian", "ornate"], color: "hsl(var(--destructive))" },
  { id: "statue_hero", name: "Hero Statue", category: "decoration", subcategory: "Statues", emoji: "🗿", description: "Grand hero memorial statue", tags: ["statue", "hero", "memorial"], color: "hsl(var(--muted))" },
  { id: "fountain_marble", name: "Marble Fountain", category: "decoration", subcategory: "Water", emoji: "⛲", description: "Elegant marble water fountain", tags: ["fountain", "marble", "water"], color: "hsl(var(--muted))" },
  { id: "torch_magic", name: "Magic Torch", category: "decoration", subcategory: "Lighting", emoji: "🔥", description: "Colorful ever-burning magic torch", tags: ["torch", "magic", "light"], color: "hsl(var(--lava))" },
  { id: "trophy_gold", name: "Gold Trophy", category: "decoration", subcategory: "Awards", emoji: "🏆", description: "First place gold trophy", tags: ["trophy", "gold", "winner"], color: "hsl(var(--gold))" },
  { id: "pot_plant", name: "Potted Plant", category: "decoration", subcategory: "Plants", emoji: "🪴", description: "Decorative potted house plant", tags: ["plant", "pot", "indoor"], color: "hsl(var(--creeper))" },
  { id: "clock_grandfather", name: "Grandfather Clock", category: "decoration", subcategory: "Furniture", emoji: "🕰️", description: "Tall ornate grandfather clock", tags: ["clock", "antique", "time"], color: "hsl(var(--secondary))" },

  // === REDSTONE (8) ===
  { id: "piston_golden", name: "Golden Piston", category: "redstone", subcategory: "Mechanical", emoji: "⚙️", description: "Enhanced golden piston mechanism", tags: ["piston", "golden", "mechanical"], color: "hsl(var(--gold))" },
  { id: "repeater_neon", name: "Neon Repeater", category: "redstone", subcategory: "Signal", emoji: "🔴", description: "Glowing neon redstone repeater", tags: ["repeater", "neon", "signal"], color: "hsl(var(--destructive))" },
  { id: "lamp_rainbow", name: "Rainbow Lamp", category: "redstone", subcategory: "Lighting", emoji: "💡", description: "Color-changing rainbow redstone lamp", tags: ["lamp", "rainbow", "color"], color: "hsl(var(--primary))" },
  { id: "dispenser_skull", name: "Skull Dispenser", category: "redstone", subcategory: "Mechanical", emoji: "💀", description: "Skull-faced arrow dispenser", tags: ["dispenser", "skull", "trap"], color: "hsl(var(--foreground))" },
  { id: "hopper_diamond", name: "Diamond Hopper", category: "redstone", subcategory: "Transport", emoji: "💎", description: "Fast diamond-plated hopper", tags: ["hopper", "diamond", "fast"], color: "hsl(var(--diamond))" },
  { id: "observer_eye", name: "Eye Observer", category: "redstone", subcategory: "Detection", emoji: "👁️", description: "Creepy eye-themed observer block", tags: ["observer", "eye", "detection"], color: "hsl(var(--destructive))" },
  { id: "rail_speed", name: "Speed Rail", category: "redstone", subcategory: "Rails", emoji: "🛤️", description: "Ultra-fast golden speed rail", tags: ["rail", "speed", "gold"], color: "hsl(var(--gold))" },
  { id: "button_emerald", name: "Emerald Button", category: "redstone", subcategory: "Input", emoji: "🟢", description: "Fancy emerald redstone button", tags: ["button", "emerald", "input"], color: "hsl(var(--creeper))" },
];
