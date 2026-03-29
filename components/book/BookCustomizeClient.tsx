"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Cake,
  Check,
  CheckCircle,
  ChevronDown,
  Coffee,
  Droplets,
  Minus,
  Package,
  Plus,
  UtensilsCrossed,
  Users,
  Wheat,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getMenuItemImageUrl, shortMenuDescription } from "@/data/menuItemImages";
import { getVendorDetailBySlug, type VendorDetailFull } from "@/data/vendors";
import { calculateBill } from "@/lib/calculateBill";
import { getDefaultMenuKeys } from "@/lib/bookingMenuHelpers";
import { useBookingStore } from "@/store/bookingStore";
import { useToastStore } from "@/store/toastStore";
import type { PackageTier, WaterType } from "@/store/bookingStore";

const SLABS = [50, 100, 150, 200, 300, 500, 750, 1000];

const ADDON_IMG: Record<string, string> = {
  "Ice Cream": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=100",
  Falooda: "https://images.unsplash.com/photo-1571167530149-c1105da4b1ac?w=100",
  "Mango Lassi": "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=100",
  "Soft Drink": "https://images.unsplash.com/photo-1625772452859-1c03d884dcd7?w=100",
  Mocktail: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=100",
  "Extra Raita": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=100",
};

function addonImage(name: string) {
  return ADDON_IMG[name] ?? "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80";
}

function catIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("soup") || n.includes("starter")) return Zap;
  if (n.includes("main")) return UtensilsCrossed;
  if (n.includes("bread") || n.includes("rice")) return Wheat;
  if (n.includes("dessert")) return Cake;
  if (n.includes("drink") || n.includes("welcome")) return Coffee;
  return UtensilsCrossed;
}

function pkgCardMeta(id: string) {
  if (id === "gold")
    return {
      dot: "#D4A017",
      ring: "border-[#D4A017]",
      unsel: "hover:border-[#D4A017]/50",
      selShadow: "shadow-[0_0_0_1px_#D4A017,0_4px_20px_rgba(212,160,23,0.2)]",
      gstLine: "₹800–944 incl. GST",
      headerSub: "100–2000 guests · Premium",
      badge: "PREMIUM",
      badgeBg: "bg-[#D4A017]",
      lines: [
        { Icon: UtensilsCrossed, text: "Up to 25 dishes" },
        { Icon: CheckCircle, text: "Royal setup + live counters" },
        { Icon: Package, text: "Full staffing team" },
      ],
    };
  if (id === "silver")
    return {
      dot: "#6B6B6B",
      ring: "border-[#6B6B6B]",
      unsel: "hover:border-[#6B6B6B]/50",
      selShadow: "shadow-[0_4px_20px_rgba(107,107,107,0.15)]",
      gstLine: "₹500–590 incl. GST",
      headerSub: "50–800 guests · Popular choice",
      badge: "MOST POPULAR",
      badgeBg: "bg-[#DE903E]",
      lines: [
        { Icon: UtensilsCrossed, text: "Up to 18 dishes" },
        { Icon: CheckCircle, text: "Premium setup" },
        { Icon: Package, text: "Professional staffing" },
      ],
    };
  return {
    dot: "#CD7F32",
    ring: "border-[#CD7F32]",
    unsel: "hover:border-[#CD7F32]/50",
    selShadow: "shadow-[0_4px_20px_rgba(205,127,50,0.15)]",
    gstLine: "₹300–360 incl. GST",
    headerSub: "50–500 guests · Budget friendly",
    badge: "",
    badgeBg: "",
    lines: [
      { Icon: UtensilsCrossed, text: "Up to 12 dishes" },
      { Icon: CheckCircle, text: "Standard setup & service" },
      { Icon: Package, text: "Basic staffing included" },
    ],
  };
}

function ProgressBar() {
  const steps = [
    { n: 1, label: "Customize" },
    { n: 2, label: "Details" },
    { n: 3, label: "Review" },
    { n: 4, label: "Done" },
  ];
  return (
    <div className="flex items-center justify-center overflow-x-auto px-2 py-3">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center px-1">
            <div
              className={
                "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold " +
                (s.n === 1 ? "bg-[#DE903E] text-white" : "bg-[#F0EBE3] text-[#8B7355]")
              }
            >
              {s.n}
            </div>
            <span
              className={
                "mt-1 whitespace-nowrap text-[9px] font-semibold " +
                (s.n === 1 ? "text-[#DE903E]" : "text-[#8B7355]")
              }
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 ? (
            <div className="mx-0.5 h-px w-4 flex-shrink-0 bg-[#E8D5B7] sm:mx-1 sm:w-6" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export default function BookCustomizeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setMany = useBookingStore((s) => s.setMany);
  const store = useBookingStore();

  const slug = useMemo(() => {
    const q = searchParams.get("vendor");
    if (q && getVendorDetailBySlug(q)) return q;
    if (store.vendorSlug && getVendorDetailBySlug(store.vendorSlug)) return store.vendorSlug;
    return "";
  }, [searchParams, store.vendorSlug]);

  useEffect(() => {
    if (!slug) router.replace("/caterers");
  }, [slug, router]);

  const vendor: VendorDetailFull | null = useMemo(
    () => (slug ? getVendorDetailBySlug(slug) : null),
    [slug]
  );

  const [selectedPkg, setSelectedPkg] = useState<string>(store.selectedPackage ?? "silver");
  const [guestCount, setGuestCount] = useState(() =>
    store.vendorSlug === slug && store.guestCount >= 25 ? store.guestCount : 100
  );
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [addOnItems, setAddOnItems] = useState<string[]>(store.addOnItems ?? []);
  const [waterType, setWaterType] = useState<WaterType>(store.waterType ?? "packaged");
  const [openCat, setOpenCat] = useState<Record<string, boolean>>({});
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!slug || !vendor) return;
    setMany({
      vendorSlug: slug,
      vendorName: vendor.name,
      vendorPhone: vendor.phone,
      vendorImage: vendor.images[0] ?? "",
    });
  }, [slug, vendor, setMany]);

  useEffect(() => {
    if (!vendor) return;
    if (store.vendorSlug === slug && store.guestCount >= 25) {
      setGuestCount(store.guestCount);
    } else {
      setGuestCount(Math.max(100, vendor.minPax));
    }
  }, [slug, vendor, store.vendorSlug, store.guestCount]);

  useEffect(() => {
    if (!slug) return;
    setSelectedItems(getDefaultMenuKeys(slug, selectedPkg));
  }, [slug, selectedPkg]);

  const pkg = vendor?.packages.find((p) => p.id === selectedPkg) ?? vendor?.packages[0];
  const meta = pkg ? pkgCardMeta(pkg.id) : pkgCardMeta("silver");

  const defaultSet = useMemo(() => new Set(getDefaultMenuKeys(slug, selectedPkg)), [slug, selectedPkg]);
  const regularAllowed = Math.max(0, (pkg?.baseLimit ?? 0) - defaultSet.size);

  const toggleItem = useCallback((key: string, locked: boolean) => {
    if (locked) return;
    setSelectedItems((prev) => (prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]));
  }, []);

  const selectedRegular = selectedItems.filter((k) => !defaultSet.has(k));
  const autoAddonSet = new Set(selectedRegular.slice(regularAllowed));
  const autoAddonCount = Math.max(0, selectedItems.length - (pkg?.baseLimit ?? 0));

  const vegAddonRate =
    vendor && "autoAddonPricing" in vendor && vendor.autoAddonPricing
      ? vendor.autoAddonPricing.vegPerItemPerPax
      : 40;

  const bill = useMemo(
    () =>
      vendor && pkg
        ? calculateBill({
            vendorSlug: slug,
            selectedPackage: selectedPkg as PackageTier,
            pricePerPlate: pkg.pricePerPlate,
            guestCount,
            selectedItems,
            addOnItems,
            couponDiscount: store.couponDiscount ?? 0,
          })
        : null,
    [slug, selectedPkg, pkg, guestCount, selectedItems, addOnItems, vendor, store.couponDiscount]
  );

  const pct = Math.min(100, Math.round((selectedItems.length / Math.max(1, pkg?.maxLimit ?? 1)) * 100));

  const syncStore = useCallback(() => {
    if (!vendor || !pkg) return;
    setMany({
      vendorSlug: slug,
      vendorName: vendor.name,
      vendorPhone: vendor.phone,
      vendorImage: vendor.images[0] ?? "",
      selectedPackage: selectedPkg as PackageTier,
      pricePerPlate: pkg.pricePerPlate,
      selectedItems,
      addOnItems,
      guestCount,
      guestSlab: `${guestCount} guests`,
      waterType,
    });
  }, [setMany, slug, vendor, selectedPkg, pkg, selectedItems, addOnItems, guestCount, waterType]);

  const onContinue = () => {
    if (!pkg) return;
    if (guestCount < 25) {
      setShake(true);
      window.setTimeout(() => setShake(false), 400);
      useToastStore.getState().show("Please set guest count (min 25).");
      return;
    }
    if (selectedItems.length === 0) {
      useToastStore.getState().show("Select at least one menu item.");
      return;
    }
    syncStore();
    router.push("/book/details");
  };

  const resetMenu = () => setSelectedItems(getDefaultMenuKeys(slug, selectedPkg));
  const toggleAddon = (name: string) =>
    setAddOnItems((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));

  const selectedPackageLabel = selectedPkg
    ? selectedPkg.charAt(0).toUpperCase() + selectedPkg.slice(1)
    : "";

  if (!vendor || !pkg || !slug) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FFFAF5] px-4">
        <p className="text-[14px] text-[#8B7355]">Select a caterer to continue.</p>
      </main>
    );
  }

  const thumb = vendor.images[0] ?? "";
  const canContinue = selectedItems.length > 0 && guestCount >= 25;

  return (
    <main className="min-h-screen bg-[#FFFAF5] pb-36">
      <div className="sticky top-0 z-50 border-b border-[#E8D5B7] bg-white">
        <ProgressBar />
        <div className="border-t border-[#F0EBE3] px-5 py-3">
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl bg-[#E8D5B7]">
              {thumb ? <Image src={thumb} alt="" fill className="object-cover" sizes="40px" /> : null}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-bold text-[#804226]">{vendor.name}</p>
              <p className="text-[11px] text-[#8B7355]">Pick your package, guests &amp; menu</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={
            "mx-4 mt-4 rounded-2xl border border-[#E8D5B7] bg-white p-5 " + (shake ? "animate-shake-card" : "")
          }
        >
          <div className="mb-4 flex items-center gap-2">
            <Users className="h-4 w-4 text-[#DE903E]" />
            <h2 className="text-[16px] font-bold text-[#1E1E1E]">How many guests?</h2>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setGuestCount((g) => Math.max(25, g - 25))}
              disabled={guestCount <= 25}
              className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#E8D5B7] text-[#804226] transition-colors hover:border-[#804226] hover:bg-[#FFF3E8] disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus className="h-[18px] w-[18px]" />
            </button>
            <span className="w-20 text-center text-[32px] font-black tabular-nums text-[#804226]">{guestCount}</span>
            <button
              type="button"
              onClick={() => setGuestCount((g) => Math.min(2000, g + 25))}
              className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#E8D5B7] text-[#804226] transition-colors hover:border-[#804226] hover:bg-[#FFF3E8]"
            >
              <Plus className="h-[18px] w-[18px]" />
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {SLABS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setGuestCount(n)}
                className={
                  "h-9 cursor-pointer rounded-xl border-2 px-4 text-[12px] font-semibold transition-all " +
                  (guestCount === n
                    ? "border-[#804226] bg-[#FFF3E8] text-[#804226]"
                    : "border-[#E8D5B7] text-[#8B7355]")
                }
              >
                {n}
              </button>
            ))}
          </div>
        </motion.section>

        <div className="mx-4 mt-4">
          <h2 className="mb-4 text-[18px] font-bold text-[#1E1E1E]">Choose Package</h2>
          <div className="space-y-3">
            {vendor.packages.map((p) => {
              const selected = selectedPkg === p.id;
              const m = pkgCardMeta(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedPkg(p.id)}
                  className={
                    "w-full cursor-pointer overflow-hidden rounded-2xl border-2 bg-white text-left transition-all " +
                    (selected ? m.ring + " " + m.selShadow : "border-[#E8D5B7] " + m.unsel)
                  }
                >
                  <div className="flex items-start justify-between px-5 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ background: m.dot }} />
                        <span className="text-[18px] font-extrabold" style={{ color: m.dot }}>
                          {p.name}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-[#8B7355]">{m.headerSub}</p>
                    </div>
                    <div className="text-right">
                      {m.badge ? (
                        <span className={"mb-1 inline-block rounded-md px-2.5 py-1 text-[9px] font-extrabold text-white " + m.badgeBg}>
                          {m.badge}
                        </span>
                      ) : null}
                      <p className="text-[34px] font-black leading-none text-[#804226]">₹{p.pricePerPlate}</p>
                      <p className="text-[12px] text-[#8B7355]">/plate</p>
                      <p className="mt-0.5 text-[10px] text-[#8B7355]">{m.gstLine}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-[#F0EBE3] px-5 py-4">
                    <div className="flex flex-col gap-2">
                      {m.lines.map(({ Icon, text }) => (
                        <span key={text} className="flex items-center gap-2 text-[12px] text-[#8B7355]">
                          <Icon className="h-[13px] w-[13px] flex-shrink-0 text-[#DE903E]" />
                          {text}
                        </span>
                      ))}
                    </div>
                    <div
                      className={
                        "flex h-9 w-24 flex-shrink-0 items-center justify-center gap-1 rounded-xl text-[13px] font-bold " +
                        (selected ? "bg-[#804226] text-white" : "border-2 border-[#804226] text-[#804226]")
                      }
                    >
                      {selected ? (
                        <>
                          <Check className="h-3.5 w-3.5" /> Selected
                        </>
                      ) : (
                        "Select"
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {selectedPkg ? (
            <motion.section
              key="menu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-4 mt-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-bold text-[#1E1E1E]">Build Your Menu</h2>
                  <p className="text-[12px] text-[#8B7355]">
                    {selectedPackageLabel} · {selectedItems.length}/{pkg.maxLimit} dishes
                  </p>
                </div>
                <button type="button" onClick={resetMenu} className="cursor-pointer text-[12px] font-semibold text-red-400">
                  Reset
                </button>
              </div>
              <div className="mb-4 h-1.5 w-full rounded-full bg-[#F0EBE3]">
                <motion.div
                  className="h-full rounded-full bg-[#DE903E]"
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              {autoAddonCount > 0 ? (
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <AlertCircle className="h-[14px] w-[14px] flex-shrink-0 text-amber-600" />
                  <p className="text-[12px] text-amber-700">
                    {autoAddonCount} extra items as add-ons · +₹{vegAddonRate}/person each
                  </p>
                </div>
              ) : null}
              {pkg.categories.map((cat) => {
                const CatIcon = catIcon(cat.name);
                const open = openCat[cat.name] ?? true;
                const catKeys = cat.items.map((it) => `${cat.name}::${it.name}`);
                const selInCat = catKeys.filter((k) => selectedItems.includes(k)).length;
                const catLimit = cat.items.filter((it) => it.isDefault).length + 2;
                return (
                  <div key={cat.name} className="mb-3 overflow-hidden rounded-2xl border border-[#E8D5B7] bg-white">
                    <button
                      type="button"
                      onClick={() => setOpenCat((o) => ({ ...o, [cat.name]: !open }))}
                      className="flex w-full cursor-pointer items-center justify-between px-5 py-4"
                    >
                      <div className="flex items-center gap-2.5">
                        <CatIcon className="h-4 w-4 text-[#DE903E]" />
                        <span className="text-[15px] font-bold text-[#1E1E1E]">{cat.name}</span>
                        <span className="rounded-md bg-[#FFF3E8] px-2 py-0.5 text-[10px] font-bold text-[#804226]">
                          {selInCat}/{catLimit}
                        </span>
                      </div>
                      <ChevronDown className={"h-4 w-4 text-[#8B7355] transition-transform " + (open ? "rotate-180" : "")} />
                    </button>
                    <AnimatePresence initial={false}>
                      {open ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.22 }}
                          className="overflow-hidden"
                        >
                          <div className="flex flex-col gap-2 px-4 pb-4">
                            {cat.items.map((item) => {
                              const key = `${cat.name}::${item.name}`;
                              const locked = item.isDefault;
                              const checked = selectedItems.includes(key);
                              const isAuto = autoAddonSet.has(key);
                              const img = getMenuItemImageUrl(item.name);
                              return (
                                <button
                                  key={key}
                                  type="button"
                                  onClick={() => toggleItem(key, locked)}
                                  className={
                                    "flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 text-left transition-all " +
                                    (checked
                                      ? isAuto
                                        ? "border-[#D4A017] bg-[#FFFBEC]"
                                        : "border-[#804226] bg-[#FFF3E8]"
                                      : "border-[#E8D5B7] bg-[#FFFAF5] hover:border-[#8B7355]")
                                  }
                                >
                                  <span
                                    className={
                                      "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border-2 " +
                                      (checked
                                        ? isAuto
                                          ? "border-[#D4A017] bg-[#D4A017]"
                                          : "border-[#804226] bg-[#804226]"
                                        : "border-[#E8D5B7] bg-white")
                                    }
                                  >
                                    {checked ? <Check className="h-3 w-3 text-white" /> : null}
                                  </span>
                                  <span
                                    className={
                                      "flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-sm border-2 " +
                                      (item.isVeg ? "border-green-600" : "border-red-600")
                                    }
                                  >
                                    <span
                                      className={
                                        "h-2.5 w-2.5 rounded-full " + (item.isVeg ? "bg-green-600" : "bg-red-600")
                                      }
                                    />
                                  </span>
                                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-[#E8D5B7]">
                                    <Image src={img} alt="" width={56} height={56} className="h-14 w-14 object-cover" />
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[14px] font-semibold text-[#1E1E1E]">{item.name}</p>
                                    <p className="line-clamp-1 text-[11px] text-[#8B7355]">{shortMenuDescription(item.name)}</p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1">
                                    {locked ? (
                                      <span className="rounded-md bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-700">
                                        Default
                                      </span>
                                    ) : null}
                                    {isAuto ? (
                                      <span className="rounded-md border border-[#D4A017] bg-[#FFFBEC] px-2 py-0.5 text-[9px] font-bold text-[#D4A017]">
                                        Add-on +₹{vegAddonRate}/pp
                                      </span>
                                    ) : null}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.section>
          ) : null}
        </AnimatePresence>

        <section className="mx-4 mt-4 rounded-2xl border border-[#E8D5B7] bg-white p-5">
          <h3 className="mb-4 text-[16px] font-bold text-[#1E1E1E]">Optional Add-ons</h3>
          <div className="grid grid-cols-2 gap-3">
            {vendor.addons.map((a) => {
              const on = addOnItems.includes(a.name);
              return (
                <button
                  key={a.name}
                  type="button"
                  onClick={() => toggleAddon(a.name)}
                  className={
                    "flex cursor-pointer items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all " +
                    (on ? "border-[#DE903E] bg-[#FFF3E8]" : "border-[#E8D5B7] hover:border-[#DE903E]/50")
                  }
                >
                  <Image
                    src={addonImage(a.name)}
                    alt=""
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-[#1E1E1E]">{a.name}</p>
                    <p className="text-[12px] font-semibold text-[#DE903E]">+₹{a.pricePerPax}/pp</p>
                  </div>
                  <span className={"relative h-6 w-11 flex-shrink-0 rounded-full " + (on ? "bg-[#DE903E]" : "bg-[#E8D5B7]")}>
                    <span
                      className={
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform " +
                        (on ? "right-0.5" : "left-0.5")
                      }
                    />
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mx-4 mt-4 rounded-2xl border border-[#E8D5B7] bg-white p-5">
          <h3 className="mb-4 text-[16px] font-bold text-[#1E1E1E]">Water Arrangement</h3>
          <div className="flex gap-3">
            {(
              [
                { id: "ro" as WaterType, label: "RO Water", price: "₹15/pp", Icon: Droplets },
                { id: "packaged" as WaterType, label: "Packaged Bottles", price: "₹20/pp", Icon: Package },
                { id: "none" as WaterType, label: "Not Required", price: "Free", Icon: X },
              ] as const
            ).map(({ id, label, price, Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setWaterType(id)}
                className={
                  "flex flex-1 cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all " +
                  (waterType === id ? "border-[#804226] bg-[#FFF3E8]" : "border-[#E8D5B7]")
                }
              >
                <Icon
                  className={
                    "h-[22px] w-[22px] " +
                    (id === "ro" ? "text-blue-500" : id === "packaged" ? "text-[#804226]" : "text-[#8B7355]")
                  }
                />
                <span className="text-[13px] font-bold">{label}</span>
                <span className="text-[11px] text-[#DE903E]">{price}</span>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8D5B7] bg-white px-5 py-4"
        style={{ paddingBottom: "calc(16px + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full" style={{ background: meta.dot }} />
              <span className="text-[11px] font-bold capitalize text-[#804226]">{selectedPkg}</span>
            </div>
            <p className="text-[28px] font-black leading-none text-[#804226]">₹{pkg.pricePerPlate}/plate</p>
            {bill ? (
              <p className="text-[10px] text-[#8B7355]">
                Est. ₹{bill.grandTotal.toLocaleString("en-IN")} for {guestCount} guests
              </p>
            ) : null}
          </div>
          <button
            type="button"
            disabled={!canContinue}
            onClick={onContinue}
            className={
              "flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl text-[15px] font-bold transition-all active:scale-[0.98] " +
              (canContinue ? "bg-[#DE903E] text-white hover:bg-[#804226]" : "cursor-not-allowed bg-[#E8D5B7] text-[#8B7355]")
            }
          >
            <ArrowRight className="h-[18px] w-[18px]" />
            Continue to Details
          </button>
        </div>
      </div>
    </main>
  );
}
