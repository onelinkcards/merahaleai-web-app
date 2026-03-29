"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Baby,
  Briefcase,
  Cake,
  Camera,
  ChefHat,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coffee,
  FileCheck,
  Gem,
  Heart,
  MapPin,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoginModal from "@/components/auth/LoginModal";
import { getVendorDetailBySlug } from "@/data/vendors";
import { hasAuthCookie } from "@/lib/authCookie";
import { useBookingStore } from "@/store/bookingStore";

const EVENT_TILES: { Icon: typeof Heart; label: string }[] = [
  { Icon: Heart, label: "Wedding" },
  { Icon: Cake, label: "Birthday" },
  { Icon: Briefcase, label: "Corporate" },
  { Icon: Gem, label: "Anniversary" },
  { Icon: Sparkles, label: "Satsang/Pooja" },
  { Icon: Coffee, label: "Retirement" },
  { Icon: Baby, label: "Baby Shower" },
  { Icon: Users, label: "Get-Together" },
  { Icon: Star, label: "Engagement" },
];

const WHY_TILES: { Icon: typeof ShieldCheck; title: string; subtitle: string }[] = [
  { Icon: ShieldCheck, title: "FSSAI Certified", subtitle: "Licensed & inspected kitchen" },
  { Icon: Users, title: "340+ Events Done", subtitle: "Trusted by hundreds of families" },
  { Icon: Star, title: "4.2 Avg Rating", subtitle: "Consistently excellent service" },
  { Icon: Clock, title: "Since 1985", subtitle: "39 years of catering expertise" },
  { Icon: ChefHat, title: "40+ Expert Cooks", subtitle: "Trained & professional team" },
  { Icon: Truck, title: "On-time Every Time", subtitle: "Never missed a deadline" },
];

export default function CatererDetailClient() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug ?? "";
  const vendor = slug ? getVendorDetailBySlug(slug) : null;
  const setMany = useBookingStore((s) => s.setMany);

  const [scrolled, setScrolled] = useState(false);
  const [activeImg] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [aboutExpanded, setAboutExpanded] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [touchLbX, setTouchLbX] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!vendor) return;
    setMany({
      vendorSlug: slug,
      vendorName: vendor.name,
      vendorPhone: vendor.phone,
      vendorImage: vendor.images[0] ?? "",
    });
  }, [slug, vendor, setMany]);

  const startingPlate = useMemo(() => {
    if (!vendor) return 0;
    const b = vendor.packages.find((p) => p.id === "bronze");
    return b?.pricePerPlate ?? vendor.packages[0]?.pricePerPlate ?? 0;
  }, [vendor]);

  const menuPreviewSource = useMemo(() => {
    if (!vendor) return { categories: [] as { name: string; items: { name: string; isVeg: boolean }[] }[] };
    const silver = vendor.packages.find((p) => p.id === "silver") ?? vendor.packages[0];
    const cats = (silver?.categories ?? []).slice(0, 3).map((c) => ({
      name: c.name,
      items: c.items.slice(0, 3).map((i) => ({ name: i.name, isVeg: i.isVeg })),
    }));
    return { categories: cats };
  }, [vendor]);

  const images: string[] = vendor?.images ? [...vendor.images] : [];
  const remaining = Math.max(0, images.length - 5);

  const openLightbox = (i: number) => {
    setLightboxIndex(i);
    setLightboxOpen(true);
  };

  const handleLbSwipeEnd = (endX: number) => {
    if (touchLbX === null || !images.length) return;
    const diff = touchLbX - endX;
    if (diff > 50) setLightboxIndex((p) => (p + 1) % images.length);
    if (diff < -50) setLightboxIndex((p) => (p - 1 + images.length) % images.length);
    setTouchLbX(null);
  };

  const onBookNow = () => {
    if (!vendor) return;
    if (!hasAuthCookie()) {
      setLoginOpen(true);
      return;
    }
    router.push("/book/customize?vendor=" + encodeURIComponent(slug));
  };

  const areaLabel = vendor
    ? `${vendor.location.split(",")[0]?.trim() ?? vendor.location}, Jaipur`
    : "";

  if (!vendor) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFAF5] px-4">
        <div className="rounded-2xl border border-[#E8D5B7] bg-white p-8 text-center">
          <p className="text-[20px] font-bold text-[#1E1E1E]">Caterer not found</p>
          <button
            type="button"
            onClick={() => router.push("/caterers")}
            className="mt-4 h-10 rounded-xl bg-[#DE903E] px-6 text-[13px] font-bold text-white hover:bg-[#804226]"
          >
            Back to Caterers
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDF9F3] md:bg-white pb-28 md:pb-12 text-[#1E1E1E]">
      <header
        className={
          "fixed left-0 right-0 top-0 z-50 flex h-14 transition-all duration-300 md:hidden " +
          (scrolled ? "border-b border-[#E8D5B7] bg-white shadow-sm" : "bg-transparent")
        }
      >
        <div className="flex h-full w-full items-center justify-between px-4">
          <button onClick={() => router.back()} className={"flex h-10 w-10 items-center justify-center rounded-full " + (scrolled ? "bg-[#FDF9F3]" : "bg-black/30 backdrop-blur-md")}>
            <ArrowLeft className={"h-[18px] w-[18px] " + (scrolled ? "text-[#1E1E1E]" : "text-white")} />
          </button>
          <p className={"truncate px-4 text-[15px] font-bold text-[#1E1E1E] transition-opacity duration-300 " + (scrolled ? "opacity-100" : "opacity-0")}>
            {vendor.name}
          </p>
          <div className="flex gap-2">
            <button className={"flex h-10 w-10 items-center justify-center rounded-full " + (scrolled ? "bg-[#FDF9F3]" : "bg-black/30 backdrop-blur-md")}>
              <Share2 className={"h-[17px] w-[17px] " + (scrolled ? "text-[#1E1E1E]" : "text-white")} />
            </button>
            <button onClick={() => setWishlisted((w) => !w)} className={"flex h-10 w-10 items-center justify-center rounded-full " + (scrolled ? "bg-[#FDF9F3]" : "bg-black/30 backdrop-blur-md")}>
              <Heart className={"h-[18px] w-[18px] " + (wishlisted ? "fill-[#B91C1C] text-[#B91C1C]" : scrolled ? "text-[#1E1E1E]" : "text-white")} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Desktop Persistent Top Nav */}
      <header className="hidden md:flex fixed top-0 w-full z-50 bg-white border-b border-[#E8D5B7] h-16 items-center px-8 shadow-sm justify-between">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-[#DE903E] font-bold text-[14px] transition-colors hover:text-[#804226]">
          <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.5}/> Back to Search
        </button>
      </header>

      {/* MOBILE HERO (Zomato Swipe-up Style) */}
      <section className="relative h-[360px] w-full overflow-hidden md:hidden">
        <button type="button" onClick={() => openLightbox(activeImg)} className="relative block h-full w-full">
          <Image src={images[activeImg] ?? images[0]} alt="" fill priority className="object-cover" sizes="100vw" />
        </button>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute left-4 top-20 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-md">
          <ShieldCheck className="h-[13px] w-[13px] text-green-700" />
          <span className="text-[10px] items-center flex font-extrabold tracking-widest text-[#166534]">FSSAI CERTIFIED</span>
        </div>
        
        <button onClick={() => openLightbox(0)} className="absolute right-4 bottom-[50px] flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 backdrop-blur-md border border-white/20">
          <Camera className="h-[13px] w-[13px] text-white" />
          <span className="text-[11px] font-semibold text-white">{images.length} Photos</span>
        </button>
        
        <div className="absolute bottom-[40px] left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.slice(0, 5).map((_, i) => (
             <span key={i} className={"h-[5px] rounded-full transition-all " + (activeImg === i ? "w-4 bg-[#DE903E]" : "w-1.5 bg-white/50")}/>
          ))}
        </div>
      </section>

      {/* MAIN CONTAINER (2-Column Desktop, Slide-Up Mobile) */}
      <div className="mx-auto max-w-6xl md:pt-24 flex flex-col md:flex-row gap-10 md:px-8">
        
        {/* LEFT COLUMN: Main Details */}
        <div className="flex-1 -mt-8 relative z-10 md:mt-0 rounded-t-[32px] md:rounded-none bg-[#FDF9F3] md:bg-transparent px-5 pt-8 pb-10 md:px-0 md:pt-0 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] md:shadow-none">
          
          {/* Title & Stats */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-[26px] md:text-[34px] font-black leading-[1.1] text-[#1E1E1E]">{vendor.name}</h1>
              <p className="mt-1.5 text-[14px] md:text-[15px] font-medium text-[#8B7355]">{vendor.cuisines.join(", ")}</p>
              <div className="mt-2 text-[13px] font-semibold text-[#8B7355] flex items-center gap-1">
                 <MapPin className="h-[14px] w-[14px] text-[#DE903E]"/> {areaLabel}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
               <div className="flex items-center gap-1.5 rounded-[10px] bg-green-700 px-2.5 py-1.5 text-white shadow-sm">
                  <span className="text-[14px] font-bold">{vendor.rating}</span>
                  <Star className="h-3 w-3 fill-white" />
               </div>
               <span className="text-[10px] font-bold text-[#8B7355] underline cursor-pointer">{vendor.reviewsCount} reviews</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-b border-[#E8D5B7] pb-6">
             <div className="flex items-center gap-2 rounded-lg bg-white border border-[#E8D5B7] px-3 py-1.5 shadow-sm">
                <span className={"flex h-[15px] w-[15px] items-center justify-center rounded-[3px] border-[1.5px] " + (vendor.isVeg ? "border-green-700" : "border-red-700")}>
                   <span className={"h-2 w-2 rounded-full " + (vendor.isVeg ? "bg-green-700" : "bg-red-700")}/>
                </span>
                <span className={"text-[12px] font-extrabold " + (vendor.isVeg ? "text-green-800" : "text-red-800")}>
                   {vendor.isVeg ? "PURE VEG" : "NON VEG"}
                </span>
             </div>
             <p className="text-[13px] font-bold text-[#DE903E] italic">&quot;{vendor.tagline}&quot;</p>
          </div>

          {/* DESKTOP HERO GALLERY */}
          <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 mt-8 h-[400px]">
             <div onClick={() => openLightbox(0)} className="col-span-2 row-span-2 relative rounded-[20px] overflow-hidden cursor-pointer group shadow-sm bg-white">
                <Image src={images[0] ?? ""} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 shadow-sm backdrop-blur-md">
                   <ShieldCheck className="h-3.5 w-3.5 text-green-700" />
                   <span className="text-[10px] font-extrabold tracking-widest text-[#166534]">FSSAI CERTIFIED</span>
                </div>
             </div>
             {images.slice(1, 5).map((img, i) => (
                <div key={i} onClick={() => openLightbox(i + 1)} className="relative rounded-[20px] overflow-hidden cursor-pointer group shadow-sm bg-white">
                   <Image src={img} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                   {i === 3 && images.length > 5 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                         <span className="text-white text-[15px] font-bold">+{remaining} Photos</span>
                      </div>
                   )}
                </div>
             ))}
          </div>

          {/* Stats Bar */}
          <section className="mt-8 flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {[
              { v: String(vendor.reviewsCount), l: "Reviews" },
              { v: `${vendor.totalBookings}+`, l: "Events" },
              { v: `${vendor.yearsActive} yrs`, l: "Experience" },
            ].map((s) => (
              <div key={s.l} className="flex flex-1 min-w-[110px] flex-col justify-center items-center text-center rounded-2xl bg-white p-4 shadow-sm border border-[#E8D5B7]">
                <span className="text-[22px] font-black text-[#1E1E1E]">{s.v}</span>
                <span className="mt-1 text-[10px] font-bold uppercase tracking-widest text-[#8B7355]">{s.l}</span>
              </div>
            ))}
          </section>
          {/* Menu Highlights (Zomato Styling) */}
          <section className="mt-6 md:mt-8">
            <h2 className="mb-4 text-[20px] font-black text-[#1E1E1E]">Menu Highlights</h2>
            <div className="space-y-4 rounded-[20px] border border-[#E8D5B7] bg-white p-5 shadow-sm">
              {menuPreviewSource.categories.map((cat) => (
                <div key={cat.name}>
                  <p className="mb-2 text-[14px] font-bold text-[#804226]">{cat.name}</p>
                  <ul className="space-y-3">
                    {cat.items.map((it) => (
                      <li key={it.name} className="flex items-start gap-2.5 text-[14px] font-semibold text-[#1E1E1E]">
                        <span className={"mt-1 flex h-[15px] w-[15px] flex-shrink-0 items-center justify-center rounded-[3px] border-[1.5px] " + (it.isVeg ? "border-green-700" : "border-red-700")}>
                          <span className={"h-2 w-2 rounded-full " + (it.isVeg ? "bg-green-700" : "bg-red-700")} />
                        </span>
                        <span>{it.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[13px] font-bold italic text-[#DE903E] cursor-pointer hover:underline">
              Customize full menu before booking →
            </p>
          </section>

          {/* Packages */}
          <section className="mt-8">
            <h2 className="mb-4 text-[20px] font-black text-[#1E1E1E]">Our Packages</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {vendor.packages.map((p) => {
                const dot = p.id === "gold" ? "#D4A017" : p.id === "silver" ? "#6B6B6B" : "#CD7F32";
                return (
                  <div key={p.id} className="min-w-[280px] flex-shrink-0 rounded-[20px] border border-[#E8D5B7] bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between gap-2">
                       <div>
                          <div className="mb-1.5 flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full shadow-[inset_0_-1px_2px_rgba(0,0,0,0.4)]" style={{ background: dot }} />
                            <span className="text-[17px] font-black tracking-tight" style={{ color: dot }}>{p.name}</span>
                          </div>
                          <p className="text-[12px] font-semibold text-[#8B7355]">{p.paxRange.replace("-", "–")} guests</p>
                          <p className="text-[12px] font-semibold text-[#8B7355]">Up to {p.maxLimit} dishes</p>
                       </div>
                       <div className="text-right">
                         <p className="text-[22px] font-black text-[#804226]">₹{p.pricePerPlate}</p>
                         <p className="text-[11px] font-bold text-[#8B7355]">/plate</p>
                       </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* About & Certs */}
          <section className="mt-6 rounded-[20px] border border-[#E8D5B7] bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-[18px] font-black text-[#1E1E1E]">About Us</h2>
            <p className={"text-[14px] leading-relaxed font-medium text-[#8B7355] " + (aboutExpanded ? "" : "line-clamp-3")}>
              {vendor.about}
            </p>
            <button onClick={() => setAboutExpanded((e) => !e)} className="mt-2 text-[13px] font-bold text-[#DE903E] hover:underline">
              {aboutExpanded ? "Read less" : "Read more"}
            </button>
            <div className="mt-5 border-t border-[#E8D5B7] pt-5">
              <h3 className="mb-3 text-[15px] font-black text-[#1E1E1E]">Certifications</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-1 min-w-[160px] items-center gap-3 rounded-[14px] border border-green-200 bg-green-50 px-4 py-3">
                  <ShieldCheck className="h-6 w-6 text-green-700" />
                  <div>
                    <p className="text-[13px] font-extrabold text-green-900">FSSAI Licensed</p>
                    <p className="font-mono text-[11px] font-bold tracking-wider text-green-700">No: {vendor.fssaiNo}</p>
                  </div>
                </div>
                <div className="flex flex-1 min-w-[160px] items-center gap-3 rounded-[14px] border border-blue-200 bg-blue-50 px-4 py-3">
                  <FileCheck className="h-6 w-6 text-blue-700" />
                  <div>
                    <p className="text-[13px] font-extrabold text-blue-900">GST Registered</p>
                    <p className="font-mono text-[11px] font-bold tracking-wider text-blue-700">Verified</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Events & Why Us Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
             <section>
                <h2 className="mb-4 text-[18px] font-black text-[#1E1E1E]">Events We Cater</h2>
                <div className="grid grid-cols-3 gap-2">
                   {EVENT_TILES.map(({ Icon, label }) => (
                     <div key={label} className="flex flex-col items-center gap-2 rounded-2xl border border-[#E8D5B7] bg-[#FDF9F3] py-3.5 shadow-sm transition-all hover:border-[#804226] hover:shadow-md cursor-pointer">
                       <Icon className="h-[22px] w-[22px] text-[#DE903E]" strokeWidth={2.5} />
                       <span className="text-center text-[10px] font-extrabold tracking-wide text-[#804226]">{label}</span>
                     </div>
                   ))}
                </div>
             </section>
             <section>
                <h2 className="mb-4 text-[18px] font-black text-[#1E1E1E]">Why Book Us?</h2>
                <div className="space-y-2">
                   {WHY_TILES.map(({ Icon, title, subtitle }) => (
                     <div key={title} className="flex items-center gap-3 rounded-2xl border border-[#E8D5B7] bg-[#FDF9F3] p-3.5 shadow-sm">
                       <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white shadow-sm border border-[#E8D5B7]/50">
                         <Icon className="h-[20px] w-[20px] text-[#DE903E]" strokeWidth={2.5}/>
                       </div>
                       <div>
                         <p className="text-[13px] font-bold text-[#1E1E1E]">{title}</p>
                         <p className="mt-0.5 text-[11px] font-semibold text-[#8B7355]">{subtitle}</p>
                       </div>
                     </div>
                   ))}
                </div>
             </section>
          </div>

          {/* Reviews */}
          <section className="mt-8 mb-6 overflow-hidden rounded-[20px] border border-[#E8D5B7] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E8D5B7] px-5 py-4">
              <h2 className="text-[18px] font-black text-[#1E1E1E]">Customer Reviews</h2>
              <span className="text-[13px] font-bold text-[#DE903E] cursor-pointer hover:underline">See all {vendor.reviewsCount} →</span>
            </div>
            <div className="space-y-4 p-5">
              {vendor.reviews.map((r) => (
                <div key={r.id} className="rounded-2xl border border-[#E8D5B7] bg-[#FDF9F3] p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#804226] text-[14px] font-black text-white shadow-sm">
                      {r.initials}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-[14px] font-black text-[#1E1E1E]">{r.name}</p>
                      <p className="text-[11px] font-bold text-[#8B7355] mt-0.5">
                        {r.event} · {r.date}
                      </p>
                    </div>
                    <div className="flex gap-0.5 rounded-lg bg-white px-2 py-1 shadow-sm border border-[#E8D5B7] items-center h-fit">
                      <span className="text-[12px] font-bold text-[#1E1E1E] mr-1">{r.rating}</span>
                      <Star className="h-3.5 w-3.5 fill-[#DE903E] text-[#DE903E]" />
                    </div>
                  </div>
                  <p className="mt-3 text-[13px] font-medium leading-relaxed text-[#1E1E1E]">{r.text}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN: Sticky Sidebar Booking Card (Desktop Only) */}
        <aside className="hidden md:block w-[380px] flex-shrink-0">
           <div className="sticky top-[100px] rounded-[24px] border border-[#E8D5B7] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <div className="mb-6 flex items-start justify-between">
                 <div>
                    <p className="text-[13px] font-bold text-[#8B7355]">Starting from</p>
                    <p className="text-[32px] font-black tracking-tight text-[#804226]">
                      ₹{startingPlate}
                      <span className="text-[15px] font-bold text-[#8B7355] tracking-normal"> /plate</span>
                    </p>
                 </div>
                 <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-0.5">
                       {Array.from({length: 5}).map((_,i) => <Star key={i} className="h-4 w-4 fill-[#DE903E] text-[#DE903E]"/>)}
                    </div>
                    <span className="text-[11px] font-bold text-[#8B7355] underline cursor-pointer">{vendor.reviewsCount} reviews</span>
                 </div>
              </div>

              <button onClick={onBookNow} className="group relative w-full overflow-hidden rounded-2xl bg-[#DE903E] px-4 py-4 text-[17px] font-black text-white transition-all hover:bg-[#804226] active:scale-[0.98] shadow-md">
                 <div className="relative z-10 flex items-center justify-center gap-2">
                    <ChefHat className="h-5 w-5" strokeWidth={2.5}/>
                    Request Booking Quote
                 </div>
              </button>

              <div className="mt-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-3">
                 <ShieldCheck className="h-5 w-5 text-green-700"/>
                 <p className="text-[12px] font-bold text-green-800 leading-tight">MH Verified Partner<br/><span className="text-[10px] font-semibold text-green-700">100% Quality Assurance Guarantee</span></p>
              </div>
           </div>
        </aside>

      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8D5B7] bg-white px-5 py-4"
        style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <div>
            <p className="text-[11px] text-[#8B7355]">Starting from</p>
            <p className="text-[26px] font-extrabold text-[#804226]">
              ₹{startingPlate}
              <span className="text-[14px] font-semibold text-[#8B7355]">/plate</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onBookNow}
            className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#DE903E] text-[16px] font-bold text-white transition-all hover:bg-[#804226] active:scale-[0.98]"
          >
            <ChefHat className="h-[18px] w-[18px]" />
            Book Now
          </button>
        </div>
      </div>

      {/* MOBILE BOOKING BOTTOM BAR */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8D5B7] bg-white px-5 py-4 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] md:hidden rounded-t-[24px]"
        style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <div>
            <p className="text-[11px] font-bold text-[#8B7355]">Starting from</p>
            <p className="text-[26px] font-black text-[#804226] tracking-tight">
              ₹{startingPlate}
              <span className="text-[12px] font-bold text-[#8B7355] tracking-normal">/plate</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onBookNow}
            className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-[18px] bg-[#DE903E] text-[16px] font-black text-white transition-all shadow-sm active:scale-[0.98]"
          >
            <ChefHat className="h-[18px] w-[18px]" strokeWidth={2.5}/>
            Select Packages
          </button>
        </div>
      </div>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        vendorSlug={slug}
        vendorName={vendor.name}
        startingFromPerPlate={startingPlate}
      />

      <AnimatePresence>
        {lightboxOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col bg-black"
          >
            <div className="flex items-center justify-between px-5 py-4">
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10"
              >
                <X className="h-[18px] w-[18px] text-white" />
              </button>
              <span className="text-[14px] font-semibold text-white">
                {lightboxIndex + 1} / {images.length}
              </span>
              <span className="w-9" />
            </div>
            <div
              className="relative flex flex-1 touch-pan-y"
              onTouchStart={(e) => setTouchLbX(e.touches[0]?.clientX ?? null)}
              onTouchEnd={(e) => handleLbSwipeEnd(e.changedTouches[0]?.clientX ?? 0)}
            >
              <div className="relative flex-1">
                <Image
                  src={images[lightboxIndex]}
                  alt=""
                  fill
                  className="object-contain p-4"
                  sizes="100vw"
                />
              </div>
              <button
                type="button"
                onClick={() => setLightboxIndex((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxIndex((i) => (i + 1) % images.length)}
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/15"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto px-5 py-4 scrollbar-hide">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className={
                    "relative h-12 w-16 flex-shrink-0 overflow-hidden rounded-xl " +
                    (lightboxIndex === i ? "border-2 border-[#DE903E]" : "opacity-60 hover:opacity-100")
                  }
                >
                  <Image src={src} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
