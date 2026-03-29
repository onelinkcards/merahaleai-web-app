"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Briefcase,
  Calendar,
  ChevronDown,
  Coffee,
  Filter,
  Heart,
  Mail,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  User,
  Users,
  UtensilsCrossed,
  X,
  Zap,
} from "lucide-react";
import LogoOrange from "@/logos/Horizontal/MH_Logo_Horizontal_Orange.png";

const cn = (...inputs: Array<string | false | null | undefined>) => clsx(inputs);

type MenuKey = "services" | "cuisines" | "vendors";
type MobileKey = "services" | "cuisines" | "vendors";

type LinkItem = {
  title: string;
  sub?: string;
  href?: string;
  badge?: { text: string; className: string };
};

const servicesCol1: LinkItem[] = [
  {
    title: "Wedding Catering",
    sub: "Full-scale shaadi setups",
    href: "/caterers?event=Wedding",
    badge: { text: "Popular", className: "bg-[#DE903E] text-[#FFFFFF]" },
  },
  { title: "Corporate Events", sub: "Office parties & galas", href: "/caterers?event=Corporate" },
  { title: "Birthday Parties", sub: "All age groups", href: "/caterers?event=Birthday" },
  { title: "Anniversary Celebrations", sub: "Intimate to grand scale", href: "/caterers?event=Anniversary" },
  { title: "Baby Shower & Pooja", sub: "Traditional setups", href: "/caterers?event=Pooja" },
  { title: "Retirement Parties", sub: "Memorable send-offs", href: "/caterers?event=Retirement" },
];

const servicesCol2: LinkItem[] = [
  {
    title: "Custom Cakes",
    sub: "Designer & theme cakes",
    href: "/caterers?special=Custom%20Cakes",
    badge: { text: "New", className: "bg-[#804226] text-[#FFFFFF]" },
  },
  { title: "Dessert Tables", sub: "Curated sweet spreads", href: "/caterers?special=Dessert" },
  { title: "Sweet Boxes", sub: "Gifting & favours", href: "/caterers?special=Sweet%20Boxes" },
  { title: "Mithai & Sweets", sub: "Traditional Indian sweets", href: "/caterers?special=Mithai" },
  {
    title: "Live Counters",
    sub: "Chaat, tandoor & more",
    href: "/caterers?special=Live%20Counter",
    badge: { text: "Trending", className: "bg-[#804226] text-[#FFFFFF]" },
  },
];

const servicesCol3: LinkItem[] = [
  { title: "Tea & Coffee", sub: "Hot beverage stations", href: "/caterers?special=Tea" },
  {
    title: "Mocktails",
    sub: "Fresh & signature blends",
    href: "/caterers?special=Mocktail",
    badge: { text: "Trending", className: "bg-[#804226] text-[#FFFFFF]" },
  },
  { title: "Fresh Juices", sub: "Seasonal fruit options", href: "/caterers?special=Juices" },
  { title: "Traditional Drinks", sub: "Thandai, lassi & more", href: "/caterers?special=Drinks" },
  { title: "Welcome Drinks", sub: "Event entry stations", href: "/caterers?special=Welcome" },
];

const cuisinesCol1: LinkItem[] = [
  { title: "Rajasthani", sub: "Dal baati, laal maas", href: "/caterers?cuisine=Rajasthani" },
  { title: "Punjabi", sub: "Rich curries & tandoor", href: "/caterers?cuisine=Punjabi" },
  { title: "Mughlai", sub: "Biryani & kebabs", href: "/caterers?cuisine=Mughlai" },
  { title: "Delhi Street", sub: "Chaat & snacks", href: "/caterers?cuisine=Delhi%20Street" },
  { title: "Awadhi", sub: "Dum cooking style", href: "/caterers?cuisine=Awadhi" },
];

const cuisinesCol2: LinkItem[] = [
  { title: "South Indian", sub: "Dosa, idli, sambar", href: "/caterers?cuisine=South%20Indian" },
  { title: "Chettinad", sub: "Spicy Tamil cuisine", href: "/caterers?cuisine=Chettinad" },
  { title: "Bengali", sub: "Fish curries & mishti", href: "/caterers?cuisine=Bengali" },
  { title: "Hyderabadi", sub: "Biryani & haleem", href: "/caterers?cuisine=Hyderabadi" },
];

const cuisinesCol3: LinkItem[] = [
  {
    title: "Jain Menu",
    sub: "No root vegetables",
    href: "/caterers?cuisine=Jain",
    badge: { text: "Pure Veg", className: "bg-[#DE903E] text-[#FFFFFF]" },
  },
  {
    title: "Pure Veg",
    sub: "100% vegetarian",
    href: "/caterers?food=veg",
    badge: { text: "Veg", className: "bg-[#DE903E] text-[#FFFFFF]" },
  },
  { title: "Continental", sub: "Western dishes", href: "/caterers?cuisine=Continental" },
  { title: "Multi-Cuisine", sub: "Mix of everything", href: "/caterers?cuisine=Multi-Cuisine" },
  {
    title: "Custom Menu",
    sub: "Build your own",
    href: "/caterers?cuisine=Custom",
    badge: { text: "New", className: "bg-[#804226] text-[#FFFFFF]" },
  },
];

const vendorsCol1: LinkItem[] = [
  { title: "All Caterers", sub: "Browse full directory", href: "/caterers" },
  {
    title: "Premium Caterers",
    sub: "Top-rated & verified",
    href: "/caterers?type=Premium%20%2F%20Luxury",
    badge: { text: "Verified", className: "bg-[#804226] text-[#FFFFFF]" },
  },
  { title: "Budget Friendly", sub: "Under ₹500/plate", href: "/caterers?budget=300-500" },
  { title: "Corporate Caterers", sub: "Office & event specialists", href: "/caterers?event=Corporate" },
  { title: "Wedding Caterers", sub: "Full-scale shaadi setup", href: "/caterers?event=Wedding" },
];

const areas = ["Mansarovar", "Vaishali Nagar", "C-Scheme", "Malviya Nagar", "Jagatpura"];

const mobileServices = ["Wedding", "Corporate", "Birthday", "Anniversary", "Pooja", "Retirement"];
const mobileCuisines = ["Rajasthani", "Punjabi", "South Indian", "Mughlai", "Continental"];
const mobileVendors = ["All Caterers", "Premium", "Budget Friendly", "Wedding Caterers"];

const getDropdownImage = (title: string) => {
  const map: Record<string, string> = {
    "Wedding Catering": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=120&q=80&auto=format&fit=crop",
    "Corporate Events": "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=120&q=80&auto=format&fit=crop",
    "Birthday Parties": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=120&q=80&auto=format&fit=crop",
    "Anniversary Celebrations": "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=120&q=80&auto=format&fit=crop",
    "Baby Shower & Pooja": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=120&q=80&auto=format&fit=crop",
    "Retirement Parties": "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=120&q=80&auto=format&fit=crop",
    "Custom Cakes": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=120&q=80&auto=format&fit=crop",
    "Dessert Tables": "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=120&q=80&auto=format&fit=crop",
    "Sweet Boxes": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=120&q=80&auto=format&fit=crop",
    "Mithai & Sweets": "https://images.unsplash.com/photo-1589308078055-eb7ecf20f4e2?w=120&q=80&auto=format&fit=crop",
    "Live Counters": "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=120&q=80&auto=format&fit=crop",
    "Tea & Coffee": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&q=80&auto=format&fit=crop",
    "Mocktails": "https://images.unsplash.com/photo-1536935338788-846bb9981813?w=120&q=80&auto=format&fit=crop",
    "Fresh Juices": "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=120&q=80&auto=format&fit=crop",
    "Traditional Drinks": "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=120&q=80&auto=format&fit=crop",
    "Welcome Drinks": "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=120&q=80&auto=format&fit=crop",
    Rajasthani: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=120&q=80&auto=format&fit=crop",
    Punjabi: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=120&q=80&auto=format&fit=crop",
    Mughlai: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=120&q=80&auto=format&fit=crop",
    "South Indian": "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=120&q=80&auto=format&fit=crop",
    Chettinad: "https://images.unsplash.com/photo-1633321702518-7feccafb94d5?w=120&q=80&auto=format&fit=crop",
    Bengali: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=120&q=80&auto=format&fit=crop",
    Hyderabadi: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=120&q=80&auto=format&fit=crop",
    "Jain Menu": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=120&q=80&auto=format&fit=crop",
    "Pure Veg": "https://images.unsplash.com/photo-1512621776951-a57141f2e8c5?w=120&q=80&auto=format&fit=crop",
    Continental: "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=120&q=80&auto=format&fit=crop",
    "Multi-Cuisine": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&q=80&auto=format&fit=crop",
    "Custom Menu": "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=120&q=80&auto=format&fit=crop",
    "All Caterers": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=120&q=80&auto=format&fit=crop",
    "Premium Caterers": "https://images.unsplash.com/photo-1517244683847-7456b63c5969?w=120&q=80&auto=format&fit=crop",
    "Budget Friendly": "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=120&q=80&auto=format&fit=crop",
    "Corporate Caterers": "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=120&q=80&auto=format&fit=crop",
    "Wedding Caterers": "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=120&q=80&auto=format&fit=crop",
    "Delhi Street": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=120&q=80&auto=format&fit=crop",
    Awadhi: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=120&q=80&auto=format&fit=crop",
  };
  return map[title] ?? "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=120&q=80&auto=format&fit=crop";
};

function ColumnHeader({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="text-[#804226]">{icon}</span>
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#804226]">{label}</p>
    </div>
  );
}

function DropdownRow({
  title,
  sub,
  badge,
  onClick,
}: {
  title: string;
  sub?: string;
  badge?: LinkItem["badge"];
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 hover:bg-[#FFF3E8]"
    >
      <img
        src={getDropdownImage(title)}
        alt={title}
        className="h-9 w-9 flex-shrink-0 rounded-lg border border-[#E8D5B7] object-cover shadow-sm"
      />
      <span className="flex-1">
        <span className="block text-[13px] font-semibold text-[#1E1E1E] group-hover:text-[#804226]">
          {title}
        </span>
        {sub ? <span className="mt-0.5 block text-[11px] text-[#8B7355]">{sub}</span> : null}
      </span>
      {badge ? (
        <span className={cn("rounded-md px-2 py-0.5 text-[9px] font-bold uppercase", badge.className)}>
          {badge.text}
        </span>
      ) : null}
    </button>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<Record<MobileKey, boolean>>({
    services: false,
    cuisines: false,
    vendors: false,
  });

  const openTimer = useRef<NodeJS.Timeout | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const dropdownRefs = useRef<Record<MenuKey, HTMLDivElement | null>>({
    services: null,
    cuisines: null,
    vendors: null,
  });

  const vendorsActive = useMemo(
    () => pathname === "/caterers" || pathname.startsWith("/caterer/"),
    [pathname]
  );

  useEffect(() => {
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const handleEnter = (key: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (openTimer.current) clearTimeout(openTimer.current);
    openTimer.current = setTimeout(() => setOpenMenu(key), 150);
  };

  const handleLeave = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 200);
  };

  const navItemClass = (active?: boolean) =>
    cn(
      "flex h-[42px] cursor-pointer items-center gap-1.5 rounded-full px-5 text-[15px] font-bold tracking-wide transition-all duration-[150ms]",
      active
        ? "bg-[#FFF8F2] text-[#E07B39]"
        : "bg-transparent text-[#4A3F36] hover:bg-[#F8F5F0] hover:text-[#E07B39]"
    );

  const panelMotion = {
    initial: { opacity: 0, y: -8, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -8, scale: 0.97 },
    transition: { duration: 0.15 },
  };

  return (
    <header className="sticky top-0 z-[200]">
      {/* Main navigation */}
      <div className="z-[200] border-b border-[#E5E0D8] bg-[#FFFFFF] shadow-sm">
        <div className="mx-auto flex h-[76px] w-full max-w-[1280px] items-center px-4 md:px-8">
          {/* LEFT: Logo */}
          <Link href="/" className="flex flex-shrink-0 items-center">
            <Image src={LogoOrange} alt="Mera Halwai" className="h-[46px] w-auto object-contain" priority />
          </Link>

          {/* CENTER: Nav links */}
          <div className="flex flex-1 justify-center">
            <nav className="relative hidden h-full items-center gap-2 md:flex" style={{ height: "76px" }}>
            <div
              className="relative flex h-full items-center"
              onMouseEnter={() => handleEnter("services")}
              onMouseLeave={handleLeave}
              ref={(el) => {
                dropdownRefs.current.services = el;
              }}
            >
              <button
                onClick={() => setOpenMenu((p) => (p === "services" ? null : "services"))}
                className={navItemClass(openMenu === "services")}
              >
                Services
                <ChevronDown
                  className={cn(
                    "h-[13px] w-[13px] text-current opacity-60 transition-transform duration-200",
                    openMenu === "services" ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>

              <AnimatePresence>
                {openMenu === "services" ? (
                  <motion.div
                    {...panelMotion}
                    className="absolute left-1/2 top-[calc(100%+8px)] z-[200] w-[920px] max-w-[calc(100vw-40px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-[#E8D5B7] bg-[#FFFFFF] shadow-[0_12px_48px_rgba(0,0,0,0.08)]"
                  >
                    <div className="flex">
                      <div className="flex-1 border-r border-[#E8D5B7] p-6">
                        <ColumnHeader icon={<UtensilsCrossed className="h-[14px] w-[14px]" />} label="Catering Services" />
                        <div className="space-y-1">
                          {servicesCol1.map((item) => (
                            <DropdownRow key={item.title} {...item} onClick={() => router.push(item.href ?? "/caterers")} />
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 border-r border-[#E8D5B7] p-6">
                        <ColumnHeader icon={<Sparkles className="h-[14px] w-[14px]" />} label="Specialty Items" />
                        <div className="space-y-1">
                          {servicesCol2.map((item) => (
                            <DropdownRow key={item.title} {...item} onClick={() => router.push(item.href ?? "/caterers")} />
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <ColumnHeader icon={<Coffee className="h-[14px] w-[14px]" />} label="Beverages" />
                        <div className="space-y-1">
                          {servicesCol3.map((item) => (
                            <DropdownRow key={item.title} {...item} onClick={() => router.push(item.href ?? "/caterers")} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div
              className="relative flex h-full items-center"
              onMouseEnter={() => handleEnter("cuisines")}
              onMouseLeave={handleLeave}
              ref={(el) => {
                dropdownRefs.current.cuisines = el;
              }}
            >
              <button
                onClick={() => setOpenMenu((p) => (p === "cuisines" ? null : "cuisines"))}
                className={navItemClass(openMenu === "cuisines")}
              >
                Cuisines
                <ChevronDown
                  className={cn(
                    "h-[13px] w-[13px] text-current opacity-60 transition-transform duration-200",
                    openMenu === "cuisines" ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>

              <AnimatePresence>
                {openMenu === "cuisines" ? (
                  <motion.div
                    {...panelMotion}
                    className="absolute left-1/2 top-[calc(100%+8px)] z-[200] w-[860px] max-w-[calc(100vw-40px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-[#E8D5B7] bg-[#FFFFFF] shadow-[0_12px_48px_rgba(0,0,0,0.08)]"
                  >
                    <div className="flex">
                      <div className="flex-1 border-r border-[#E8D5B7] p-6">
                        <ColumnHeader icon={<MapPin className="h-[14px] w-[14px]" />} label="North India" />
                        <div className="space-y-1">
                          {cuisinesCol1.map((item) => (
                            <DropdownRow key={item.title} {...item} onClick={() => router.push(item.href ?? "/caterers")} />
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 border-r border-[#E8D5B7] p-6">
                        <ColumnHeader icon={<MapPin className="h-[14px] w-[14px]" />} label="South & East" />
                        <div className="space-y-1">
                          {cuisinesCol2.map((item) => (
                            <DropdownRow key={item.title} {...item} onClick={() => router.push(item.href ?? "/caterers")} />
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <ColumnHeader icon={<Sparkles className="h-[14px] w-[14px]" />} label="Special" />
                        <div className="space-y-1">
                          {cuisinesCol3.map((item) => (
                            <DropdownRow key={item.title} {...item} onClick={() => router.push(item.href ?? "/caterers")} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div
              className="relative flex h-full items-center"
              onMouseEnter={() => handleEnter("vendors")}
              onMouseLeave={handleLeave}
              ref={(el) => {
                dropdownRefs.current.vendors = el;
              }}
            >
              <button
                onClick={() => setOpenMenu((p) => (p === "vendors" ? null : "vendors"))}
                className={navItemClass(vendorsActive || openMenu === "vendors")}
              >
                Vendors
                <ChevronDown
                  className={cn(
                    "h-[13px] w-[13px] text-current opacity-60 transition-transform duration-200",
                    openMenu === "vendors" ? "rotate-180" : "rotate-0"
                  )}
                />
              </button>

              <AnimatePresence>
                {openMenu === "vendors" ? (
                  <motion.div
                    {...panelMotion}
                    className="absolute left-1/2 top-[calc(100%+8px)] z-[200] w-[760px] max-w-[calc(100vw-40px)] -translate-x-1/2 overflow-hidden rounded-2xl border border-[#E8D5B7] bg-[#FFFFFF] shadow-[0_12px_48px_rgba(0,0,0,0.08)]"
                  >
                    <div className="flex">
                      <div className="flex-1 border-r border-[#E8D5B7] p-6">
                        <ColumnHeader icon={<Users className="h-[14px] w-[14px]" />} label="By Type" />
                        <div className="space-y-1">
                          {vendorsCol1.map((item) => (
                            <DropdownRow key={item.title} {...item} onClick={() => router.push(item.href ?? "/caterers")} />
                          ))}
                        </div>
                      </div>
                      <div className="flex-1 p-6">
                        <ColumnHeader icon={<MapPin className="h-[14px] w-[14px]" />} label="Jaipur Areas" />
                        <div className="space-y-1">
                          {areas.map((area) => (
                            <button
                              key={area}
                              className="block w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-[#1E1E1E] transition-colors duration-150 hover:bg-[#FFF3E8] hover:text-[#804226]"
                              onClick={() => router.push("/caterers?location=" + encodeURIComponent(area))}
                            >
                              {area}
                            </button>
                          ))}
                          <button
                            className="block w-full rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold text-[#DE903E]"
                            onClick={() => router.push("/caterers")}
                          >
                            View All Areas →
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="relative flex h-full items-center">
              <button
                onClick={() => router.push("/about")}
                className={navItemClass(pathname === "/about")}
              >
                About
              </button>
            </div>
          </nav>
          </div>{/* end CENTER */}

          {/* RIGHT: Login + CTA */}
          <div className="flex flex-shrink-0 items-center gap-4">
            <div className="hidden items-center gap-4 md:flex">
              <Link
                href="/login"
                className="flex h-[42px] items-center justify-center rounded-xl border border-[#D1A87A]/50 bg-white px-6 text-[14px] font-bold text-[#1e1e1e] transition-all hover:bg-[#FAF8F6]"
              >
                Login
              </Link>
              {/* CTA */}
              <Link
                href="/caterers"
                className="flex h-[42px] items-center justify-center rounded-xl bg-[#E07B39] px-6 text-[15px] font-bold !text-[#FFFFFF] shadow-[0_4px_12px_rgba(224,123,57,0.25)] transition-all hover:bg-[#c66a2e]"
              >
                Book a Caterer
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg md:hidden"
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
            >
            {mobileOpen ? (
              <X className="h-[18px] w-[18px] text-[var(--text-head)]" />
            ) : (
              <div className="flex flex-col gap-[4px]">
                <span className="block h-[2px] w-[18px] rounded-full bg-[var(--text-head)]" />
                <span className="block h-[2px] w-[18px] rounded-full bg-[var(--text-head)]" />
                <span className="block h-[2px] w-[18px] rounded-full bg-[var(--text-head)]" />
              </div>
            )}
          </button>
          </div>{/* end RIGHT */}
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-black/60 md:hidden backdrop-blur-[2px]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-x-0 bottom-0 top-[10vh] z-[160] flex flex-col overflow-hidden rounded-t-[24px] bg-white shadow-2xl md:hidden"
            >
              <div className="flex h-[72px] flex-shrink-0 items-center justify-between border-b border-[#E8D5B7]/50 bg-[#e5e5e5] px-6">
                <Image src={LogoOrange} alt="Mera Halwai" className="h-[30px] w-auto object-contain drop-shadow-sm" priority />
                <button
                  className="flex items-center justify-center p-2 text-[#804226] transition-opacity hover:opacity-70"
                  onClick={() => setMobileOpen(false)}
                >
                  <X className="h-6 w-6" strokeWidth={2.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-2 pb-[100px]">
                {[
                  { key: "services" as const, label: "Services", items: mobileServices },
                  { key: "cuisines" as const, label: "Cuisines", items: mobileCuisines },
                  { key: "vendors" as const, label: "Vendors", items: mobileVendors },
                ].map((section) => (
                  <div key={section.key} className="border-b border-[#F0EBE3]">
                    <button
                      className="flex w-full items-center justify-between py-[16px] text-left text-[16px] font-extrabold tracking-tight text-[#1E1E1E]"
                      onClick={() =>
                        setMobileAccordion((p) => ({ ...p, [section.key]: !p[section.key] }))
                      }
                    >
                      {section.label}
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 text-[#8B7355] transition-transform",
                          mobileAccordion[section.key] ? "rotate-180" : "rotate-0"
                        )}
                        strokeWidth={2.5}
                      />
                    </button>
                    <AnimatePresence>
                      {mobileAccordion[section.key] ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          {section.items.map((item) => (
                            <button
                              key={item}
                              className="block w-full py-3.5 pl-3 text-left text-[14px] font-bold text-[#8B7355] transition-colors active:bg-[#FFFAF5] active:text-[#DE903E]"
                            >
                              {item}
                            </button>
                          ))}
                          <div className="h-3" />
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                ))}

                <button
                  className="flex w-full items-center border-b border-[#F0EBE3] py-[16px] text-left text-[16px] font-extrabold tracking-tight text-[#1E1E1E]"
                  onClick={() => { setMobileOpen(false); router.push("/about"); }}
                >
                  About
                </button>

                <div className="mt-8 flex flex-col gap-3">
                  <a
                    href="/caterers"
                    className="flex h-[48px] w-full items-center justify-center rounded-xl bg-[#DE903E] text-[15px] font-bold tracking-wide text-white shadow-sm transition-transform active:scale-[0.98]"
                    onClick={() => setMobileOpen(false)}
                  >
                    Book a Caterer
                  </a>
                  <button className="flex h-[48px] w-full items-center justify-center rounded-xl border-[1.5px] border-[#E8D5B7] bg-white text-[15px] font-bold tracking-wide text-[#1E1E1E] shadow-sm transition-transform active:scale-[0.98]">
                    Login
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
