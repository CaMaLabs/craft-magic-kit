import { useState } from "react";
import { Download, Eye, Star, Search, Loader2 } from "lucide-react";
import { generateSkinPack, generateModPack, generateAddon } from "@/lib/packGenerator";
import { toast } from "sonner";

type GalleryTab = "skins" | "modpacks" | "addons";

interface GalleryItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  stars: number;
  tags: string[];
  color: string;
}

const premadeSkins: GalleryItem[] = [
  { id: "ninja", name: "Shadow Ninja", description: "Stealthy dark ninja with red headband", emoji: "🥷", stars: 5, tags: ["combat", "cool"], color: "hsl(var(--primary))" },
  { id: "astronaut", name: "Space Explorer", description: "Ready for the End dimension and beyond!", emoji: "🧑‍🚀", stars: 4, tags: ["space", "adventure"], color: "hsl(var(--secondary))" },
  { id: "dragon_knight", name: "Dragon Knight", description: "Armored warrior with dragon-scale details", emoji: "🐲", stars: 5, tags: ["combat", "epic"], color: "hsl(var(--accent))" },
  { id: "pixel_cat", name: "Pixel Kitty", description: "Adorable cat skin with whiskers and tail", emoji: "🐱", stars: 5, tags: ["cute", "animal"], color: "hsl(var(--gold))" },
  { id: "ice_wizard", name: "Ice Wizard", description: "Frosty mage with glowing blue robe", emoji: "🧊", stars: 4, tags: ["magic", "cool"], color: "hsl(var(--sky))" },
  { id: "zombie_hunter", name: "Zombie Hunter", description: "Brave survivor with bandana and gear", emoji: "🧟", stars: 4, tags: ["combat", "survival"], color: "hsl(var(--creeper))" },
  { id: "pirate", name: "Captain Blockbeard", description: "Yarr! A pirate with an eyepatch", emoji: "🏴‍☠️", stars: 3, tags: ["adventure", "fun"], color: "hsl(var(--primary))" },
  { id: "rainbow", name: "Rainbow Steve", description: "Colorful Steve with rainbow gradient", emoji: "🌈", stars: 5, tags: ["colorful", "fun"], color: "hsl(var(--secondary))" },
  { id: "robot_mech", name: "Mech Pilot", description: "Futuristic mech suit pilot", emoji: "🤖", stars: 5, tags: ["sci-fi", "cool"], color: "hsl(var(--accent))" },
  { id: "vampire", name: "Count Bloccula", description: "Spooky vampire with cape and fangs", emoji: "🧛", stars: 4, tags: ["spooky", "halloween"], color: "hsl(var(--enderman))" },
  { id: "superhero", name: "Block Hero", description: "Caped superhero with mask", emoji: "🦸", stars: 5, tags: ["hero", "epic"], color: "hsl(var(--destructive))" },
  { id: "mermaid", name: "Ocean Mermaid", description: "Shimmering mermaid with coral crown", emoji: "🧜", stars: 4, tags: ["ocean", "magic"], color: "hsl(var(--accent))" },
  { id: "elf_ranger", name: "Elf Ranger", description: "Forest elf with bow and green cloak", emoji: "🧝", stars: 5, tags: ["fantasy", "nature"], color: "hsl(var(--creeper))" },
  { id: "samurai", name: "Samurai Warrior", description: "Traditional samurai with katana", emoji: "⚔️", stars: 5, tags: ["combat", "japan"], color: "hsl(var(--destructive))" },
  { id: "witch_cute", name: "Cute Witch", description: "Friendly witch with purple hat", emoji: "🧙‍♀️", stars: 4, tags: ["magic", "cute"], color: "hsl(var(--enderman))" },
  { id: "penguin", name: "Penguin Suit", description: "Adorable tuxedo penguin skin", emoji: "🐧", stars: 5, tags: ["cute", "animal"], color: "hsl(var(--foreground))" },
  { id: "fire_mage", name: "Fire Mage", description: "Blazing fire mage with lava staff", emoji: "🔥", stars: 4, tags: ["magic", "fire"], color: "hsl(var(--lava))" },
  { id: "alien", name: "Space Alien", description: "Green alien with big eyes", emoji: "👽", stars: 3, tags: ["space", "funny"], color: "hsl(var(--creeper))" },
  { id: "bear_teddy", name: "Teddy Bear", description: "Fluffy teddy bear character", emoji: "🧸", stars: 5, tags: ["cute", "cozy"], color: "hsl(var(--secondary))" },
  { id: "chef", name: "Master Chef", description: "Chef with tall hat and apron", emoji: "👨‍🍳", stars: 3, tags: ["food", "fun"], color: "hsl(var(--primary))" },
  { id: "werewolf", name: "Werewolf", description: "Transforming werewolf with glowing eyes", emoji: "🐺", stars: 5, tags: ["spooky", "transformation"], color: "hsl(var(--secondary))" },
  { id: "fairy_princess", name: "Fairy Princess", description: "Sparkly fairy with butterfly wings", emoji: "🧚", stars: 5, tags: ["magic", "cute"], color: "hsl(var(--accent))" },
  { id: "cowboy", name: "Wild West Cowboy", description: "Rootin' tootin' cowboy with hat and boots", emoji: "🤠", stars: 4, tags: ["adventure", "western"], color: "hsl(var(--secondary))" },
  { id: "deep_sea_diver", name: "Deep Sea Diver", description: "Retro deep sea diving suit", emoji: "🤿", stars: 4, tags: ["ocean", "adventure"], color: "hsl(var(--accent))" },
  { id: "cyborg", name: "Cyborg 3000", description: "Half-human half-robot cyborg warrior", emoji: "🦾", stars: 5, tags: ["sci-fi", "combat"], color: "hsl(var(--muted))" },
  { id: "clown_happy", name: "Happy Clown", description: "Colorful circus clown with big smile", emoji: "🤡", stars: 3, tags: ["fun", "colorful"], color: "hsl(var(--primary))" },
  { id: "pharaoh", name: "Pharaoh King", description: "Ancient Egyptian pharaoh with gold mask", emoji: "🏺", stars: 5, tags: ["ancient", "epic"], color: "hsl(var(--gold))" },
  { id: "ghost_friendly", name: "Friendly Ghost", description: "Cute transparent ghost with bow tie", emoji: "👻", stars: 4, tags: ["spooky", "cute"], color: "hsl(var(--muted))" },
  { id: "rock_star", name: "Rock Star", description: "Electric guitar-wielding rock musician", emoji: "🎸", stars: 4, tags: ["music", "cool"], color: "hsl(var(--destructive))" },
  { id: "knight_dark", name: "Dark Knight", description: "Mysterious dark armored knight", emoji: "🗡️", stars: 5, tags: ["combat", "dark"], color: "hsl(var(--foreground))" },
  { id: "fox_girl", name: "Fox Girl", description: "Anime-style fox girl with fluffy tail", emoji: "🦊", stars: 5, tags: ["anime", "cute"], color: "hsl(var(--lava))" },
  { id: "bee_keeper", name: "Beekeeper", description: "Friendly beekeeper with honeycomb suit", emoji: "🐝", stars: 3, tags: ["nature", "peaceful"], color: "hsl(var(--gold))" },
  { id: "lava_demon", name: "Lava Demon", description: "Fiery nether demon with horns", emoji: "😈", stars: 5, tags: ["nether", "epic"], color: "hsl(var(--lava))" },
  { id: "snowman_frosty", name: "Frosty Snowman", description: "Jolly snowman with carrot nose and scarf", emoji: "⛄", stars: 4, tags: ["winter", "cute"], color: "hsl(var(--muted))" },
  { id: "steampunk", name: "Steampunk Explorer", description: "Victorian steampunk adventurer with goggles", emoji: "⚙️", stars: 5, tags: ["steampunk", "adventure"], color: "hsl(var(--secondary))" },
  { id: "panda_warrior", name: "Panda Warrior", description: "Kung-fu fighting panda warrior", emoji: "🐼", stars: 5, tags: ["combat", "animal"], color: "hsl(var(--foreground))" },
  { id: "angel_guardian", name: "Guardian Angel", description: "Heavenly angel with golden wings and halo", emoji: "😇", stars: 5, tags: ["magic", "epic"], color: "hsl(var(--gold))" },
  { id: "skeleton_pirate", name: "Skeleton Pirate", description: "Undead pirate skeleton captain", emoji: "☠️", stars: 4, tags: ["spooky", "adventure"], color: "hsl(var(--muted))" },
  { id: "bunny_suit", name: "Bunny Suit", description: "Fluffy pink bunny rabbit skin", emoji: "🐰", stars: 4, tags: ["cute", "animal"], color: "hsl(var(--accent))" },
  { id: "enderman_suit", name: "Enderman Suit", description: "Tall dark enderman disguise skin", emoji: "🟣", stars: 5, tags: ["end", "disguise"], color: "hsl(var(--enderman))" },
];

const premadeModPacks: GalleryItem[] = [
  { id: "ultimate_survival", name: "Ultimate Survival", description: "Better tools, backpacks, and more pets!", emoji: "🏕️", stars: 5, tags: ["survival", "popular"], color: "hsl(var(--primary))" },
  { id: "crazy_explosions", name: "Crazy Explosions", description: "Super TNT and lucky blocks galore", emoji: "💥", stars: 4, tags: ["fun", "chaos"], color: "hsl(var(--accent))" },
  { id: "furniture_life", name: "Home Designer", description: "Furniture mod + vehicles for the best base", emoji: "🏠", stars: 4, tags: ["creative", "building"], color: "hsl(var(--secondary))" },
  { id: "mob_madness", name: "Mob Madness", description: "More mobs, more pets, more chaos!", emoji: "🐉", stars: 5, tags: ["mobs", "adventure"], color: "hsl(var(--gold))" },
  { id: "mini_games", name: "Party Pack", description: "Lucky blocks + fun for mini games", emoji: "🎮", stars: 3, tags: ["minigame", "party"], color: "hsl(var(--sky))" },
  { id: "adventure_kit", name: "Adventure Kit", description: "Everything you need for epic quests", emoji: "🗺️", stars: 4, tags: ["adventure", "tools"], color: "hsl(var(--creeper))" },
  { id: "pvp_pro", name: "PvP Pro Pack", description: "Competitive PvP tools and maps", emoji: "⚔️", stars: 5, tags: ["pvp", "competitive"], color: "hsl(var(--destructive))" },
  { id: "skyblock_ultra", name: "Skyblock Ultra", description: "Enhanced skyblock with custom islands", emoji: "🏝️", stars: 5, tags: ["skyblock", "challenge"], color: "hsl(var(--accent))" },
  { id: "magic_academy", name: "Magic Academy", description: "Spells, wands, and magic schools", emoji: "🪄", stars: 4, tags: ["magic", "schools"], color: "hsl(var(--enderman))" },
  { id: "tech_craft", name: "TechCraft", description: "Machines, automation, and robots", emoji: "⚙️", stars: 4, tags: ["tech", "machines"], color: "hsl(var(--muted))" },
  { id: "horror_night", name: "Horror Night", description: "Scary mobs and spooky biomes", emoji: "👻", stars: 3, tags: ["horror", "spooky"], color: "hsl(var(--foreground))" },
  { id: "farm_life", name: "Farm Life", description: "Crops, animals, and farming tools", emoji: "🌾", stars: 4, tags: ["farming", "peaceful"], color: "hsl(var(--creeper))" },
  { id: "medieval_kingdom", name: "Medieval Kingdom", description: "Castles, knights, and medieval villages", emoji: "🏰", stars: 5, tags: ["medieval", "building"], color: "hsl(var(--secondary))" },
  { id: "space_odyssey", name: "Space Odyssey", description: "Rockets, space stations, and alien planets", emoji: "🚀", stars: 5, tags: ["space", "sci-fi"], color: "hsl(var(--accent))" },
  { id: "underwater_world", name: "Underwater World", description: "Submarines, coral cities, and sea creatures", emoji: "🌊", stars: 4, tags: ["ocean", "adventure"], color: "hsl(var(--accent))" },
  { id: "dinosaur_age", name: "Dinosaur Age", description: "Dig up fossils and ride dinosaurs!", emoji: "🦖", stars: 5, tags: ["dinosaurs", "adventure"], color: "hsl(var(--creeper))" },
  { id: "ninja_training", name: "Ninja Training", description: "Stealth, parkour, and martial arts", emoji: "🥷", stars: 4, tags: ["ninja", "combat"], color: "hsl(var(--foreground))" },
  { id: "candy_world", name: "Candy World", description: "Everything is made of candy and sweets!", emoji: "🍬", stars: 5, tags: ["fun", "sweet"], color: "hsl(var(--primary))" },
  { id: "volcano_island", name: "Volcano Island", description: "Volcanic island survival with eruptions", emoji: "🌋", stars: 4, tags: ["survival", "challenge"], color: "hsl(var(--lava))" },
  { id: "pirate_seas", name: "Pirate Seas", description: "Ships, treasure maps, and sea battles", emoji: "🏴‍☠️", stars: 5, tags: ["pirate", "adventure"], color: "hsl(var(--secondary))" },
  { id: "wizard_wars", name: "Wizard Wars", description: "Epic wizard duels and spell casting", emoji: "🧙", stars: 4, tags: ["magic", "pvp"], color: "hsl(var(--enderman))" },
  { id: "racing_mania", name: "Racing Mania", description: "Custom karts, tracks, and racing!", emoji: "🏎️", stars: 4, tags: ["racing", "fun"], color: "hsl(var(--destructive))" },
  { id: "zoo_tycoon", name: "Zoo Tycoon", description: "Build and manage your own zoo", emoji: "🦁", stars: 4, tags: ["management", "animals"], color: "hsl(var(--gold))" },
  { id: "super_heroes_pack", name: "Super Heroes Pack", description: "Powers, capes, and villain battles", emoji: "🦸", stars: 5, tags: ["hero", "combat"], color: "hsl(var(--destructive))" },
  { id: "ice_age", name: "Ice Age Pack", description: "Frozen biomes, mammoths, and igloos", emoji: "🧊", stars: 4, tags: ["winter", "survival"], color: "hsl(var(--accent))" },
  { id: "pixel_art_studio", name: "Pixel Art Studio", description: "Special blocks and tools for pixel art", emoji: "🎨", stars: 3, tags: ["creative", "art"], color: "hsl(var(--primary))" },
  { id: "dungeon_crawler", name: "Dungeon Crawler", description: "Procedural dungeons with epic boss fights", emoji: "🏛️", stars: 5, tags: ["dungeon", "combat"], color: "hsl(var(--enderman))" },
  { id: "mythical_beasts", name: "Mythical Beasts", description: "Dragons, phoenixes, and legendary creatures", emoji: "🐲", stars: 5, tags: ["mythical", "mobs"], color: "hsl(var(--lava))" },
];

const premadeAddons: GalleryItem[] = [
  { id: "friendly_dragon", name: "Friendly Dragon", description: "A tameable dragon that follows you!", emoji: "🐲", stars: 5, tags: ["mob", "pets"], color: "hsl(var(--primary))" },
  { id: "ruby_ore", name: "Ruby Ore & Tools", description: "New ruby ore with full tool set", emoji: "💎", stars: 4, tags: ["items", "mining"], color: "hsl(var(--accent))" },
  { id: "glow_blocks", name: "Glow Blocks", description: "Rainbow glowing blocks for building", emoji: "✨", stars: 4, tags: ["blocks", "creative"], color: "hsl(var(--gold))" },
  { id: "candy_biome", name: "Candy Land Biome", description: "A sweet biome made of candy!", emoji: "🍭", stars: 5, tags: ["biome", "fun"], color: "hsl(var(--secondary))" },
  { id: "jetpack", name: "Jetpack Item", description: "Fly around with a craftable jetpack", emoji: "🚀", stars: 5, tags: ["item", "flying"], color: "hsl(var(--sky))" },
  { id: "mini_boss", name: "Mini Boss Mobs", description: "Tough new mobs with special drops", emoji: "👾", stars: 4, tags: ["mob", "combat"], color: "hsl(var(--creeper))" },
  { id: "portal_gun", name: "Portal Gun", description: "Shoot portals to teleport anywhere!", emoji: "🌀", stars: 5, tags: ["item", "teleport"], color: "hsl(var(--accent))" },
  { id: "pet_cat_breeds", name: "Cat Breeds", description: "10 new cat breeds with unique skins", emoji: "🐱", stars: 5, tags: ["mob", "pets"], color: "hsl(var(--gold))" },
  { id: "underwater_temple", name: "Underwater Temple", description: "New ocean structure with treasures", emoji: "🏛️", stars: 4, tags: ["structure", "ocean"], color: "hsl(var(--accent))" },
  { id: "magic_wands", name: "Magic Wands", description: "Craftable wands with special spells", emoji: "🪄", stars: 5, tags: ["item", "magic"], color: "hsl(var(--enderman))" },
  { id: "rideable_mobs", name: "Rideable Mobs", description: "Ride spiders, bears, and more!", emoji: "🐻", stars: 4, tags: ["mob", "riding"], color: "hsl(var(--secondary))" },
  { id: "custom_villagers", name: "Custom Villagers", description: "New villager jobs and trades", emoji: "🧑‍🌾", stars: 3, tags: ["mob", "village"], color: "hsl(var(--primary))" },
  { id: "gravity_blocks", name: "Gravity Blocks", description: "Blocks that float and defy gravity", emoji: "🫧", stars: 4, tags: ["blocks", "physics"], color: "hsl(var(--accent))" },
  { id: "neon_armor", name: "Neon Armor Set", description: "Glowing neon armor in all colors", emoji: "💡", stars: 5, tags: ["armor", "glow"], color: "hsl(var(--primary))" },
  { id: "lucky_sword", name: "Lucky Sword", description: "Random enchantment every time you swing!", emoji: "🗡️", stars: 5, tags: ["item", "combat"], color: "hsl(var(--gold))" },
  { id: "pet_dinosaur", name: "Pet Dinosaur", description: "Hatch and raise your own baby T-Rex", emoji: "🦖", stars: 5, tags: ["mob", "pets"], color: "hsl(var(--creeper))" },
  { id: "cloud_biome", name: "Cloud Kingdom Biome", description: "A floating biome above the clouds", emoji: "☁️", stars: 5, tags: ["biome", "flying"], color: "hsl(var(--muted))" },
  { id: "grapple_hook", name: "Grappling Hook", description: "Swing between mountains like a hero!", emoji: "🪝", stars: 4, tags: ["item", "movement"], color: "hsl(var(--foreground))" },
  { id: "mini_dragon", name: "Mini Dragon Pet", description: "Tiny shoulder dragon that breathes fire", emoji: "🐉", stars: 5, tags: ["mob", "pets"], color: "hsl(var(--lava))" },
  { id: "slime_boots", name: "Slime Boots", description: "Bouncy boots that let you jump super high", emoji: "🟢", stars: 4, tags: ["item", "movement"], color: "hsl(var(--creeper))" },
  { id: "mushroom_biome_neon", name: "Neon Mushroom Biome", description: "Glowing mushroom forest dimension", emoji: "🍄", stars: 5, tags: ["biome", "glow"], color: "hsl(var(--enderman))" },
  { id: "crystal_caves", name: "Crystal Caves", description: "Underground caves filled with crystals", emoji: "💎", stars: 4, tags: ["biome", "mining"], color: "hsl(var(--diamond))" },
  { id: "tame_enderman", name: "Tame Enderman", description: "Befriend endermen and they teleport you!", emoji: "🟣", stars: 5, tags: ["mob", "pets"], color: "hsl(var(--enderman))" },
  { id: "paint_gun", name: "Paint Gun", description: "Color any block any color you want!", emoji: "🎨", stars: 4, tags: ["item", "creative"], color: "hsl(var(--primary))" },
  { id: "elemental_swords", name: "Elemental Swords", description: "Fire, Ice, Lightning, and Void swords", emoji: "⚔️", stars: 5, tags: ["item", "combat"], color: "hsl(var(--lava))" },
  { id: "guard_dog", name: "Guard Dogs", description: "Trained guard dogs that protect your base", emoji: "🐕", stars: 4, tags: ["mob", "defense"], color: "hsl(var(--secondary))" },
  { id: "backpack_addon", name: "Wearable Backpack", description: "Extra inventory space with a backpack", emoji: "🎒", stars: 4, tags: ["item", "utility"], color: "hsl(var(--secondary))" },
  { id: "weather_control", name: "Weather Controller", description: "Change weather with a magical staff!", emoji: "🌦️", stars: 5, tags: ["item", "magic"], color: "hsl(var(--accent))" },
  { id: "vampire_mob", name: "Vampire Mob", description: "Night-dwelling vampire with bat form", emoji: "🧛", stars: 4, tags: ["mob", "spooky"], color: "hsl(var(--enderman))" },
  { id: "underwater_base", name: "Underwater Base Kit", description: "Glass domes and airlocks for ocean bases", emoji: "🫧", stars: 4, tags: ["blocks", "ocean"], color: "hsl(var(--accent))" },
  { id: "hover_board", name: "Hover Board", description: "Futuristic floating hover board vehicle", emoji: "🛹", stars: 5, tags: ["item", "movement"], color: "hsl(var(--primary))" },
  { id: "phoenix_pet", name: "Phoenix Pet", description: "Fire bird that revives you when you die", emoji: "🔥", stars: 5, tags: ["mob", "pets"], color: "hsl(var(--lava))" },
  { id: "treasure_hunter", name: "Treasure Hunter Kit", description: "Metal detector and treasure maps", emoji: "🏴‍☠️", stars: 4, tags: ["item", "adventure"], color: "hsl(var(--gold))" },
];

const skinStyleMap: Record<string, string> = {
  ninja: "warrior", astronaut: "explorer", dragon_knight: "warrior",
  pixel_cat: "animal", ice_wizard: "wizard", zombie_hunter: "warrior",
  pirate: "explorer", rainbow: "custom", robot_mech: "robot",
  vampire: "custom", superhero: "custom", mermaid: "custom",
  elf_ranger: "explorer", samurai: "warrior", witch_cute: "wizard",
  penguin: "animal", fire_mage: "wizard", alien: "custom",
  bear_teddy: "animal", chef: "custom",
  werewolf: "custom", fairy_princess: "custom", cowboy: "explorer",
  deep_sea_diver: "explorer", cyborg: "robot", clown_happy: "custom",
  pharaoh: "custom", ghost_friendly: "custom", rock_star: "custom",
  knight_dark: "warrior", fox_girl: "animal", bee_keeper: "custom",
  lava_demon: "custom", snowman_frosty: "custom", steampunk: "explorer",
  panda_warrior: "warrior", angel_guardian: "custom", skeleton_pirate: "warrior",
  bunny_suit: "animal", enderman_suit: "custom",
};

const modPackMap: Record<string, string[]> = {
  ultimate_survival: ["Better Tools", "Backpacks", "More Pets"],
  crazy_explosions: ["Super TNT", "Lucky Blocks"],
  furniture_life: ["Furniture Mod", "Vehicles"],
  mob_madness: ["More Mobs", "More Pets"],
  mini_games: ["Lucky Blocks"],
  adventure_kit: ["Better Tools", "Backpacks", "More Mobs"],
  pvp_pro: ["Better Tools", "More Mobs"],
  skyblock_ultra: ["Better Tools", "Backpacks"],
  magic_academy: ["Lucky Blocks", "More Mobs"],
  tech_craft: ["Better Tools", "Vehicles"],
  horror_night: ["More Mobs"],
  farm_life: ["Better Tools", "More Pets"],
  medieval_kingdom: ["Furniture Mod", "Better Tools", "More Mobs"],
  space_odyssey: ["Vehicles", "Better Tools", "Backpacks"],
  underwater_world: ["More Mobs", "Better Tools"],
  dinosaur_age: ["More Mobs", "Better Tools", "Lucky Blocks"],
  ninja_training: ["Better Tools", "More Mobs"],
  candy_world: ["Lucky Blocks", "Furniture Mod"],
  volcano_island: ["Super TNT", "Better Tools", "More Mobs"],
  pirate_seas: ["Vehicles", "Better Tools", "More Mobs"],
  wizard_wars: ["Lucky Blocks", "More Mobs", "Better Tools"],
  racing_mania: ["Vehicles", "Better Tools"],
  zoo_tycoon: ["More Mobs", "More Pets", "Furniture Mod"],
  super_heroes_pack: ["Better Tools", "More Mobs", "Backpacks"],
  ice_age: ["More Mobs", "Better Tools"],
  pixel_art_studio: ["Furniture Mod"],
  dungeon_crawler: ["Better Tools", "More Mobs", "Lucky Blocks"],
  mythical_beasts: ["More Mobs", "More Pets", "Better Tools"],
};

const addonTypeMap: Record<string, { addonType: string; entityType: string }> = {
  friendly_dragon: { addonType: "both", entityType: "mob" },
  ruby_ore: { addonType: "both", entityType: "item" },
  glow_blocks: { addonType: "resource", entityType: "block" },
  candy_biome: { addonType: "both", entityType: "biome" },
  jetpack: { addonType: "both", entityType: "item" },
  mini_boss: { addonType: "behavior", entityType: "mob" },
  portal_gun: { addonType: "both", entityType: "item" },
  pet_cat_breeds: { addonType: "both", entityType: "mob" },
  underwater_temple: { addonType: "both", entityType: "biome" },
  magic_wands: { addonType: "both", entityType: "item" },
  rideable_mobs: { addonType: "both", entityType: "mob" },
  custom_villagers: { addonType: "behavior", entityType: "mob" },
  gravity_blocks: { addonType: "both", entityType: "block" },
  neon_armor: { addonType: "resource", entityType: "item" },
  lucky_sword: { addonType: "both", entityType: "item" },
  pet_dinosaur: { addonType: "both", entityType: "mob" },
  cloud_biome: { addonType: "both", entityType: "biome" },
  grapple_hook: { addonType: "both", entityType: "item" },
  mini_dragon: { addonType: "both", entityType: "mob" },
  slime_boots: { addonType: "both", entityType: "item" },
  mushroom_biome_neon: { addonType: "both", entityType: "biome" },
  crystal_caves: { addonType: "both", entityType: "biome" },
  tame_enderman: { addonType: "behavior", entityType: "mob" },
  paint_gun: { addonType: "both", entityType: "item" },
  elemental_swords: { addonType: "both", entityType: "item" },
  guard_dog: { addonType: "behavior", entityType: "mob" },
  backpack_addon: { addonType: "both", entityType: "item" },
  weather_control: { addonType: "both", entityType: "item" },
  vampire_mob: { addonType: "both", entityType: "mob" },
  underwater_base: { addonType: "both", entityType: "block" },
  hover_board: { addonType: "both", entityType: "item" },
  phoenix_pet: { addonType: "both", entityType: "mob" },
  treasure_hunter: { addonType: "both", entityType: "item" },
};

const Gallery = () => {
  const [activeTab, setActiveTab] = useState<GalleryTab>("skins");
  const [search, setSearch] = useState("");
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const tabs: { key: GalleryTab; label: string; emoji: string }[] = [
    { key: "skins", label: "Skins", emoji: "🎨" },
    { key: "modpacks", label: "Mod Packs", emoji: "📦" },
    { key: "addons", label: "Add-ons", emoji: "🧩" },
  ];

  const getItems = (): GalleryItem[] => {
    const all = activeTab === "skins" ? premadeSkins : activeTab === "modpacks" ? premadeModPacks : premadeAddons;
    if (!search) return all;
    const q = search.toLowerCase();
    return all.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.tags.some((t) => t.includes(q)));
  };

  const handleDownload = async (item: GalleryItem) => {
    setDownloading(item.id);
    try {
      if (activeTab === "skins") {
        await generateSkinPack({ skinType: "steve", skinStyle: skinStyleMap[item.id] || "custom", textureUrl: null });
      } else if (activeTab === "modpacks") {
        await generateModPack({ packName: item.name, category: "survival", mods: modPackMap[item.id] || ["Better Tools"], iconUrl: null });
      } else {
        const cfg = addonTypeMap[item.id] || { addonType: "both", entityType: "mob" };
        await generateAddon({ addonName: item.name, addonType: cfg.addonType, entityType: cfg.entityType, difficulty: "medium", textureUrl: null });
      }
      toast.success(`${item.name} downloaded! 🎉`);
    } catch {
      toast.error("Oops! Download failed. Try again!");
    } finally {
      setDownloading(null);
    }
  };

  const items = getItems();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="font-pixel text-xl md:text-2xl text-foreground mb-2">🏪 Gallery</h1>
        <p className="text-lg font-semibold text-muted-foreground">Browse and download ready-made packs!</p>
        <p className="text-sm text-muted-foreground mt-1">
          {premadeSkins.length} skins • {premadeModPacks.length} mod packs • {premadeAddons.length} add-ons
        </p>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex justify-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearch(""); setPreviewItem(null); }}
              className={`flex items-center gap-2 rounded px-5 py-3 font-bold transition-all hover:scale-105 ${
                activeTab === tab.key
                  ? "bg-primary text-primary-foreground pixel-border"
                  : "border-3 border-border bg-card text-foreground hover:bg-muted pixel-border"
              }`}
            >
              <span>{tab.emoji}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search packs..."
              className="w-full rounded border-3 border-border bg-card py-3 pl-10 pr-4 font-bold text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none pixel-border"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border-4 border-border bg-card transition-all hover:scale-[1.02] hover:shadow-lg pixel-border"
            >
              {/* Color banner */}
              <div
                className="flex h-28 items-center justify-center text-5xl"
                style={{ background: `linear-gradient(135deg, ${item.color}, ${item.color}88)` }}
              >
                <span className="drop-shadow-lg transition-transform group-hover:scale-125">{item.emoji}</span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-pixel text-xs text-foreground mb-1">{item.name}</h3>
                <p className="mb-3 text-sm text-muted-foreground">{item.description}</p>

                {/* Stars */}
                <div className="mb-3 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < item.stars ? "fill-gold text-gold" : "text-border"}`}
                    />
                  ))}
                </div>

                {/* Tags */}
                <div className="mb-4 flex flex-wrap gap-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-muted px-2 py-0.5 text-xs font-bold text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => setPreviewItem(previewItem?.id === item.id ? null : item)}
                    className="flex items-center gap-1.5 rounded border-2 border-border bg-muted px-3 py-2 text-sm font-bold text-foreground transition-all hover:bg-muted/80 hover:scale-105"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownload(item)}
                    disabled={downloading === item.id}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded bg-primary px-3 py-2 text-sm font-bold text-primary-foreground transition-all hover:scale-105 disabled:opacity-60"
                  >
                    {downloading === item.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Download className="h-3.5 w-3.5" />
                    )}
                    {downloading === item.id ? "..." : "Get it!"}
                  </button>
                </div>
              </div>

              {/* Preview overlay */}
              {previewItem?.id === item.id && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-card/95 p-4 text-center backdrop-blur-sm">
                  <span className="mb-3 text-6xl">{item.emoji}</span>
                  <h3 className="font-pixel text-xs text-foreground mb-2">{item.name}</h3>
                  <p className="mb-2 text-sm text-muted-foreground">{item.description}</p>
                  <div className="mb-3 flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < item.stars ? "fill-gold text-gold" : "text-border"}`}
                      />
                    ))}
                  </div>
                  <div className="mb-4 text-xs text-muted-foreground">
                    {activeTab === "skins" && "64×64 PNG skin for Steve model"}
                    {activeTab === "modpacks" && `Includes ${(modPackMap[item.id] || []).length} mods`}
                    {activeTab === "addons" && `${(addonTypeMap[item.id]?.addonType || "both").replace("both", "Behavior + Resource")} pack`}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewItem(null)}
                      className="rounded border-2 border-border bg-muted px-4 py-2 text-sm font-bold text-foreground hover:scale-105 transition-all"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => { setPreviewItem(null); handleDownload(item); }}
                      disabled={downloading === item.id}
                      className="rounded bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:scale-105 transition-all"
                    >
                      <Download className="mr-1 inline h-3.5 w-3.5" />
                      Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="py-16 text-center">
            <span className="text-5xl">🔍</span>
            <p className="mt-4 font-pixel text-sm text-muted-foreground">No packs found!</p>
            <p className="text-muted-foreground">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
