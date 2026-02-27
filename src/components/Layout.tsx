import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Paintbrush, Package, Puzzle, Sparkles, GalleryHorizontalEnd, Store } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/gallery", label: "Gallery", icon: GalleryHorizontalEnd },
  { path: "/skins", label: "Skins", icon: Paintbrush },
  { path: "/modpacks", label: "Mod Packs", icon: Package },
  { path: "/addons", label: "Add-ons", icon: Puzzle },
  { path: "/store", label: "Store", icon: Store },
];

const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background block-pattern">
      <header className="sticky top-0 z-50 border-b-4 border-primary bg-card/95 backdrop-blur pixel-border-strong">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-gold animate-bounce-slow" />
            <span className="font-pixel text-sm md:text-base text-primary">
              BlockCraft
            </span>
          </Link>
          <nav className="flex items-center gap-1 md:gap-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 rounded px-3 py-2 text-sm font-bold transition-all hover:scale-105 ${
                  location.pathname === path
                    ? "bg-primary text-primary-foreground pixel-border"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
