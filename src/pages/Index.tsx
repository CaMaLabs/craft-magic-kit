import { Link } from "react-router-dom";
import { Paintbrush, Package, Puzzle, ArrowRight, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-minecraft.jpg";

const creatorCards = [
  {
    title: "Skin Creator",
    description: "Design awesome character skins! Upload textures and see them come to life. 🎨",
    icon: Paintbrush,
    path: "/skins",
    color: "bg-accent text-accent-foreground",
    emoji: "👾",
  },
  {
    title: "Mod Pack Builder",
    description: "Mix and match mods to create the perfect adventure pack! ⚡",
    icon: Package,
    path: "/modpacks",
    color: "bg-secondary text-secondary-foreground",
    emoji: "📦",
  },
  {
    title: "Add-on Maker",
    description: "Create custom behaviors and items for your Minecraft world! 🌍",
    icon: Puzzle,
    path: "/addons",
    color: "bg-primary text-primary-foreground",
    emoji: "🧩",
  },
];

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Minecraft world"
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
          <p className="mx-auto max-w-lg text-lg md:text-xl font-bold text-foreground/80">
            Create amazing mods, skins, and add-ons for Minecraft Bedrock Edition! 
            Super easy and fun for everyone! 🎮
          </p>
        </div>
      </section>

      {/* Creator Cards */}
      <section className="container mx-auto px-4 -mt-8 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {creatorCards.map((card) => (
            <Link
              key={card.path}
              to={card.path}
              className="group rounded-lg border-4 border-border bg-card p-6 transition-all duration-300 hover:scale-105 hover:border-primary pixel-border-strong"
            >
              <div className={`mb-4 inline-flex items-center gap-2 rounded px-3 py-1.5 ${card.color}`}>
                <card.icon className="h-5 w-5" />
                <span className="font-pixel text-xs">{card.title}</span>
              </div>
              <p className="mb-4 text-base font-semibold text-muted-foreground leading-relaxed">
                {card.description}
              </p>
              <div className="flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-all">
                <span>Start Creating</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Fun tips */}
      <section className="border-t-4 border-border bg-muted/50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-pixel text-lg mb-6 text-foreground">How It Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { step: "1", title: "Pick a Creator", desc: "Choose what you want to make!", emoji: "🎯" },
              { step: "2", title: "Customize It", desc: "Use dropdowns & upload textures!", emoji: "🎨" },
              { step: "3", title: "Download & Play", desc: "Get your pack and jump into MC!", emoji: "🚀" },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded bg-primary text-primary-foreground font-pixel text-lg pixel-border">
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
