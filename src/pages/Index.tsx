import { Link } from "react-router-dom";
import { Paintbrush, Package, Puzzle, ArrowRight, Sparkles, GalleryHorizontalEnd, Star, Download, Users } from "lucide-react";
import heroImage from "@/assets/hero-minecraft.jpg";

const creatorCards = [
  {
    title: "Skin Creator",
    description: "Design awesome character skins with a live 3D preview! 🎨",
    icon: Paintbrush,
    path: "/skins",
    color: "bg-accent text-accent-foreground",
    emoji: "👾",
    delay: "0ms",
  },
  {
    title: "Mod Pack Builder",
    description: "Mix and match mods to create the perfect adventure pack! ⚡",
    icon: Package,
    path: "/modpacks",
    color: "bg-secondary text-secondary-foreground",
    emoji: "📦",
    delay: "150ms",
  },
  {
    title: "Add-on Maker",
    description: "Create custom behaviors and items for your world! 🌍",
    icon: Puzzle,
    path: "/addons",
    color: "bg-primary text-primary-foreground",
    emoji: "🧩",
    delay: "300ms",
  },
];

const stats = [
  { icon: Download, value: "100%", label: "Free Forever", color: "text-primary" },
  { icon: Star, value: "Easy", label: "Kid-Friendly", color: "text-gold" },
  { icon: Users, value: "Bedrock", label: "Edition Ready", color: "text-accent" },
];

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Minecraft world landscape"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        </div>
        <div className="container relative mx-auto px-4 py-20 md:py-32 text-center">
          <div className="animate-float inline-block mb-4">
            <Sparkles className="h-12 w-12 text-gold" />
          </div>
          <h1 className="font-pixel text-2xl md:text-4xl text-foreground leading-relaxed mb-4">
            BlockCraft Studio
          </h1>
          <p className="mx-auto max-w-lg text-lg md:text-xl font-bold text-foreground/80 mb-8">
            Create amazing mods, skins, and add-ons for Minecraft Bedrock Edition!
            Super easy and fun for everyone! 🎮
          </p>

          {/* Quick stats */}
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-2 animate-fade-in">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="font-pixel text-xs text-foreground">{stat.value}</span>
                <span className="text-sm font-bold text-foreground/70">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creator Cards */}
      <section className="container mx-auto px-4 -mt-8 pb-12">
        <div className="grid gap-6 md:grid-cols-3">
          {creatorCards.map((card, i) => (
            <Link
              key={card.path}
              to={card.path}
              className="group rounded-lg border-4 border-border bg-card p-6 transition-all duration-300 hover:scale-105 hover:border-primary pixel-border-strong animate-fade-in"
              style={{ animationDelay: card.delay, animationFillMode: "both" }}
            >
              <div className="text-4xl mb-3">{card.emoji}</div>
              <div className={`mb-3 inline-flex items-center gap-2 rounded px-3 py-1.5 ${card.color}`}>
                <card.icon className="h-5 w-5" />
                <span className="font-pixel text-xs">{card.title}</span>
              </div>
              <p className="mb-4 text-base font-semibold text-muted-foreground leading-relaxed">
                {card.description}
              </p>
              <div className="flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-all">
                <span>Start Creating</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Gallery CTA */}
      <section className="container mx-auto px-4 pb-12">
        <Link
          to="/gallery"
          className="group relative block overflow-hidden rounded-lg border-4 border-primary/30 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 p-8 md:p-12 transition-all duration-300 hover:border-primary hover:shadow-lg pixel-border-strong"
        >
          <div className="absolute top-4 right-4 text-5xl opacity-20 group-hover:opacity-40 transition-opacity">
            🏆
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground pixel-border">
              <GalleryHorizontalEnd className="h-8 w-8" />
            </div>
            <div className="flex-1">
              <h2 className="font-pixel text-base md:text-lg text-foreground mb-2">
                Browse the Gallery
              </h2>
              <p className="text-base font-semibold text-muted-foreground max-w-xl">
                Explore pre-made skins, mod packs, and add-ons ready to download and play!
                Find inspiration or grab something cool right away. ✨
              </p>
            </div>
            <div className="flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-all shrink-0">
              <span className="font-pixel text-xs">Explore</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
            </div>
          </div>
        </Link>
      </section>

      {/* How It Works */}
      <section className="border-t-4 border-border bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-pixel text-lg mb-8 text-foreground">How It Works</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              { step: "1", title: "Pick a Creator", desc: "Choose what you want to make!", emoji: "🎯" },
              { step: "2", title: "Customize It", desc: "Use dropdowns & upload textures!", emoji: "🎨" },
              { step: "3", title: "Download & Play", desc: "Get your pack and jump into MC!", emoji: "🚀" },
            ].map((item, i) => (
              <div
                key={item.step}
                className="flex flex-col items-center gap-3 animate-fade-in"
                style={{ animationDelay: `${i * 200}ms`, animationFillMode: "both" }}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded bg-primary text-primary-foreground font-pixel text-lg pixel-border transition-transform hover:scale-110">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg text-foreground">{item.emoji} {item.title}</h3>
                <p className="text-muted-foreground font-semibold">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
