"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Search,
  SlidersHorizontal,
  TrendingUp,
  Users,
  X,
  CalendarDays,
  ChefHat,
  Filter,
  LogIn,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import VendorCard from "@/components/caterers/VendorCard";
import FilterSidebar from "@/components/caterers/FilterSidebar";
import Navbar from "@/components/layout/Navbar";
import { VENDORS } from "@/data/vendors";
import MHIconOrange from "@/logos/Symbol/MH_Logo_Icon_Orange.png";

const DEFAULT_FILTERS = {
  eventType: "",
  guests: 100,
  cuisines: [] as string[],
  minRating: 0,
  foodPref: null as "veg" | "nonveg" | null,
  budgets: [] as string[],
  eventTypes: [] as string[],
  guestRange: null as string | null,
  specialisations: [] as string[],
};

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

const CUISINE_OPTIONS = [
  "North Indian",
  "Mughlai",
  "South Indian",
  "Rajasthani",
  "Chaat",
  "Desserts",
  "Continental",
];

const EVENT_OPTIONS = [
  "Birthday Party",
  "Wedding",
  "Wedding Anniversary",
  "Baby Shower",
  "Retirement Party",
  "Corporate Event / Office Party",
  "Get-Together / Friends Party",
  "Break-Up Party",
  "Small Gathering (under 75 pax)",
  "Satsang / Pooja",
  "Funeral Bhoj",
];

const toggle = (arr: string[], val: string) =>
  arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

export default function CaterersPage() {
  const router = useRouter();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("popular");
  const [desktopSortOpen, setDesktopSortOpen] = useState(false);
  const [mobileSortOpen, setMobileSortOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<"eventType" | "guests" | "cuisines" | null>(null);
  const [searchText, setSearchText] = useState("");
  const searchBarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredVendors = useMemo(() => {
    let result = [...VENDORS];

    if (filters.minRating > 0) result = result.filter((v) => v.rating >= filters.minRating);
    if (filters.foodPref === "veg") result = result.filter((v) => v.isVeg === true);
    if (filters.foodPref === "nonveg") result = result.filter((v) => v.isVeg === false);

    if (filters.budgets.length > 0) {
      result = result.filter((v) =>
        filters.budgets.some((b) => {
          if (b === "under300") return v.priceVeg < 300;
          if (b === "300-500") return v.priceVeg >= 300 && v.priceVeg <= 500;
          if (b === "500-800") return v.priceVeg > 500 && v.priceVeg <= 800;
          if (b === "800plus") return v.priceVeg > 800;
          return false;
        })
      );
    }

    if (filters.cuisines.length > 0) {
      result = result.filter((v) => filters.cuisines.some((c) => v.cuisines.includes(c)));
    }

    if (filters.eventType) {
      result = result.filter((v) => v.eventTypes.includes(filters.eventType));
    }

    if (filters.eventTypes.length > 0) {
      result = result.filter((v) => filters.eventTypes.some((e) => v.eventTypes.includes(e)));
    }

    if (filters.guestRange) {
      if (filters.guestRange === "0-50") {
        result = result.filter((v) => v.maxPax >= 1 && v.minPax <= 50);
      } else if (filters.guestRange === "50-100") {
        result = result.filter((v) => v.maxPax >= 50 && v.minPax <= 100);
      } else if (filters.guestRange === "100-200") {
        result = result.filter((v) => v.maxPax >= 100 && v.minPax <= 200);
      } else if (filters.guestRange === "200-500") {
        result = result.filter((v) => v.maxPax >= 200 && v.minPax <= 500);
      } else if (filters.guestRange === "500-1000") {
        result = result.filter((v) => v.maxPax >= 500 && v.minPax <= 1000);
      } else if (filters.guestRange === "1000plus") {
        result = result.filter((v) => v.maxPax >= 1000);
      }
    }

    if (filters.specialisations.length > 0) {
      result = result.filter((v) =>
        filters.specialisations.some((s) => v.specialisations.includes(s))
      );
    }

    result = result.filter((v) => v.minPax <= filters.guests && v.maxPax >= filters.guests);

    if (searchText.trim()) {
      const s = searchText.toLowerCase().trim();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(s) ||
          v.location.toLowerCase().includes(s) ||
          v.cuisines.some((c) => c.toLowerCase().includes(s)) ||
          v.specialisations.some((sp) => sp.toLowerCase().includes(s))
      );
    }

    if (sortBy === "rating") result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === "price-low") result.sort((a, b) => a.priceVeg - b.priceVeg);
    else if (sortBy === "price-high") result.sort((a, b) => b.priceVeg - a.priceVeg);
    else result.sort((a, b) => b.reviews - a.reviews);

    return result;
  }, [filters, sortBy, searchText]);

  const chips = useMemo(
    () =>
      [
        filters.foodPref && {
          label: filters.foodPref === "veg" ? "Pure Veg" : "Veg & Non-Veg",
          remove: () => setFilters((p) => ({ ...p, foodPref: null })),
        },
        filters.minRating > 0 && {
          label: "★ " + filters.minRating + "+",
          remove: () => setFilters((p) => ({ ...p, minRating: 0 })),
        },
        filters.eventType && {
          label: filters.eventType,
          remove: () => setFilters((p) => ({ ...p, eventType: "" })),
        },
        filters.guestRange && {
          label:
            filters.guestRange === "1000plus"
              ? "1000+ Guests"
              : filters.guestRange.replace("-", "–") + " Guests",
          remove: () => setFilters((p) => ({ ...p, guestRange: null })),
        },
        ...filters.budgets.map((b) => ({
          label:
            b === "under300"
              ? "Under ₹300"
              : b === "300-500"
              ? "₹300–₹500"
              : b === "500-800"
              ? "₹500–₹800"
              : "₹800+",
          remove: () => setFilters((p) => ({ ...p, budgets: p.budgets.filter((x) => x !== b) })),
        })),
        ...filters.cuisines.map((c) => ({
          label: c,
          remove: () => setFilters((p) => ({ ...p, cuisines: p.cuisines.filter((x) => x !== c) })),
        })),
        ...filters.eventTypes.map((e) => ({
          label: e,
          remove: () =>
            setFilters((p) => ({ ...p, eventTypes: p.eventTypes.filter((x) => x !== e) })),
        })),
        ...filters.specialisations.map((s) => ({
          label: s,
          remove: () =>
            setFilters((p) => ({
              ...p,
              specialisations: p.specialisations.filter((x) => x !== s),
            })),
        })),
      ].filter(Boolean) as { label: string; remove: () => void }[],
    [filters]
  );



  const selectedSortLabel = SORT_OPTIONS.find((s) => s.value === sortBy)?.label ?? "Most Popular";

  const clearAll = () => {
    setFilters((p) => ({ ...p, ...DEFAULT_FILTERS }));
    setSearchText("");
  };

  return (
    <main className="min-h-screen bg-[#FFFAF5] text-[#1E1E1E] md:pb-0 pb-[80px]">
      <Navbar />

      {/* --- MOBILE ONLY: Top Header & Search --- */}
      <div className="md:hidden sticky top-0 z-[100] bg-[#FFFAF5] pt-3 pb-3 px-4 shadow-[0_4px_24px_rgba(128,66,38,0.06)] border-b border-[#E8D5B7]">
        {/* Search Input Box */}
        <div className="relative mb-4">
          <div className="absolute left-[14px] top-1/2 -translate-y-1/2">
            <Search className="h-[15px] w-[15px] text-[#DE903E]" strokeWidth={2.5} />
          </div>
          <input
             id="mobileSearchInput"
             type="text"
             value={searchText}
             onChange={(e) => setSearchText(e.target.value)}
             placeholder="Search Events, Food, Dates"
             className="w-full bg-[#DE903E]/[0.08] h-[46px] rounded-xl pl-[38px] pr-10 text-[14px] font-bold text-[#804226] placeholder:text-[#DE903E]/70 outline-none"
          />
          {searchText && (
            <button onClick={() => setSearchText("")} className="absolute right-[14px] top-1/2 -translate-y-1/2 bg-[#DE903E] rounded-full p-[3px] text-white">
              <X className="h-[12px] w-[12px]" strokeWidth={3} />
            </button>
          )}
        </div>

        {/* Unified Mobile Filter Strip (Categories + Active Pills) */}
        <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide pb-2 pt-3 md:hidden">
          {/* Master Filter Slide-out */}
          <button onClick={() => setMobileSortOpen(true)} className="flex h-[38px] flex-shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-full border border-[#E5E0D8] bg-white px-4 text-[13px] font-bold text-[#1E1E1E] shadow-sm transition-transform active:scale-95">
            <Filter className="h-3.5 w-3.5 text-[#DE903E]" strokeWidth={2.5} /> Filters
          </button>

          {/* Active Chips rendered first */}
          {chips.map((chip) => (
            <span
              key={chip.label}
              className="flex h-[38px] flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#DE903E]/40 bg-[#FFFaf5] px-3.5 text-[13px] font-bold text-[#804226] shadow-sm transition-transform active:scale-95"
            >
              {chip.label}
              <button
                onClick={chip.remove}
                className="flex h-3.5 w-3.5 items-center justify-center text-[#DE903E] transition-colors hover:text-[#c4772b]"
              >
                <X className="h-4 w-4" strokeWidth={2.5} />
              </button>
            </span>
          ))}

          {/* Unbound Categories (Event Type, Guests, Cuisines only) */}
          {!filters.eventType && (
            <button onClick={() => setOpenDropdown("eventType")} className="flex h-[38px] flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#E5E0D8] bg-white px-3.5 text-[13px] font-bold text-[#1E1E1E] shadow-sm transition-transform active:scale-95">
              <CalendarDays className="h-4 w-4 text-[#804226]" /> Event Type <ChevronDown className="h-3.5 w-3.5 text-[#8B7355]" strokeWidth={2.5} />
            </button>
          )}
          {!chips.find(c => c.label.includes('Guest')) && (
            <button onClick={() => setOpenDropdown("guests")} className="flex h-[38px] flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#E5E0D8] bg-white px-3.5 text-[13px] font-bold text-[#1E1E1E] shadow-sm transition-transform active:scale-95">
              <Users className="h-4 w-4 text-[#804226]" /> Guests <ChevronDown className="h-3.5 w-3.5 text-[#8B7355]" strokeWidth={2.5} />
            </button>
          )}
          {filters.cuisines.length === 0 && (
            <button onClick={() => setOpenDropdown("cuisines")} className="flex h-[38px] flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#E5E0D8] bg-white px-3.5 text-[13px] font-bold text-[#1E1E1E] shadow-sm transition-transform active:scale-95">
              <ChefHat className="h-4 w-4 text-[#804226]" /> Cuisines <ChevronDown className="h-3.5 w-3.5 text-[#8B7355]" strokeWidth={2.5} />
            </button>
          )}

          {!filters.foodPref && (
            <>
              <button 
                onClick={() => setFilters(p => ({ ...p, foodPref: "veg" }))}
                className="flex h-[38px] flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#E5E0D8] bg-white px-3.5 text-[13px] font-bold text-[#1E1E1E] shadow-sm transition-transform active:scale-95 hover:border-[#166534]/50"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-[3px] border-[1.5px] border-[#166534]">
                  <span className="h-2 w-2 rounded-full bg-[#166534]" />
                </span>
                Pure Veg
              </button>
              <button 
                onClick={() => setFilters(p => ({ ...p, foodPref: "nonveg" }))}
                className="flex h-[38px] flex-shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-[#E5E0D8] bg-white px-3.5 text-[13px] font-bold text-[#1E1E1E] shadow-sm transition-transform active:scale-95 hover:border-[#B91C1C]/50"
              >
                <span className="flex h-4 w-4 items-center justify-center rounded-[3px] border-[1.5px] border-[#B91C1C]">
                  <span className="h-2 w-2 rounded-full bg-[#B91C1C]" />
                </span>
                Non Veg
              </button>
            </>
          )}

          {chips.length > 0 && (
            <button onClick={clearAll} className="inline-flex items-center whitespace-nowrap px-2 py-1.5 text-[13px] font-bold text-[#DE903E] transition-colors active:text-[#c4772b]">
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Unified 1280px Central Container */}
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-4 pt-4 md:px-8 md:pt-8">
        
        {/* TOP COMPONENT: Search Bar row (DESKTOP ONLY) */}
        <div ref={searchBarRef} className="relative z-[90] mb-8 hidden w-full md:block">
          <div className="flex w-full items-center gap-1.5 rounded-2xl border-[1.5px] border-[#DE903E]/20 bg-white p-2 shadow-sm focus-within:border-[#DE903E]/40 focus-within:shadow-md transition-all md:h-[68px] md:rounded-full">
            <div className="relative flex-1">
              <button
                onClick={() => setOpenDropdown((p) => (p === "eventType" ? null : "eventType"))}
                className={
                  "flex h-[44px] w-full cursor-pointer items-center gap-2.5 rounded-xl border-r border-[#f0ece4] bg-transparent px-[16px] transition-all " +
                  (filters.eventType ? "text-[#E07B39]" : "text-[#1a1a1a] hover:bg-[#faf8f6]")
                }
              >
                <Calendar className="h-[15px] w-[15px] flex-shrink-0 text-[#E07B39]" />
                <div className="flex min-w-0 flex-1 flex-col text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#9b8f82]">
                    Event Type
                  </span>
                  <span className="truncate text-[14px] font-semibold text-[#1a1a1a]">
                    {filters.eventType || "Any Event"}
                  </span>
                </div>
                <ChevronDown
                  className={
                    "h-[11px] w-[11px] flex-shrink-0 text-[#9b8f82] transition-transform duration-150 " +
                    (openDropdown === "eventType" ? "rotate-180" : "rotate-0")
                  }
                />
              </button>

              {openDropdown === "eventType" ? (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-0 top-[calc(100%+12px)] z-[90] w-[320px] overflow-hidden rounded-2xl border border-[#E5E0D8] bg-[#FFFBF2] shadow-[0_14px_40px_rgba(0,0,0,0.12)]"
                >
                  <div className="border-b border-[#E5E0D8]/60 px-5 py-4">
                    <p style={{ fontFamily: 'Sideware, serif' }} className="text-[12px] font-bold uppercase tracking-widest text-[#1a1a1a]">Select Event Type</p>
                  </div>
                  <div className="max-h-[260px] overflow-y-auto py-1">
                    {EVENT_OPTIONS.map((option) => {
                      const selected = filters.eventType === option;
                      return (
                        <button
                          key={option}
                          onClick={() => {
                            setFilters((p) => ({ ...p, eventType: option }));
                            setOpenDropdown(null);
                          }}
                          className="flex w-full items-center justify-between px-5 py-3.5 text-left text-[14px] transition-colors hover:bg-[#F0EBE1]"
                        >
                          <span className={selected ? "font-bold text-[#804226]" : "font-medium text-[#1E1E1E]"}>{option}</span>
                          <span
                            className={
                              "h-[16px] w-[16px] rounded-full " +
                              (selected ? "border-[4px] border-[#DE903E] bg-white shadow-sm" : "border border-[#D1A87A]/50 bg-white")
                            }
                          >
                            {selected ? <Check className="h-2.5 w-2.5 text-[#FFFFFF]" /> : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              ) : null}
            </div>

            <div className="relative flex-1">
              <button
                onClick={() => setOpenDropdown((p) => (p === "guests" ? null : "guests"))}
                className="flex h-[44px] w-full cursor-pointer items-center gap-2.5 rounded-xl border-r border-[#f0ece4] bg-transparent px-[16px] transition-all hover:bg-[#faf8f6]"
              >
                <Users className="h-[15px] w-[15px] flex-shrink-0 text-[#E07B39]" />
                <div className="flex min-w-0 flex-1 flex-col text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#9b8f82]">Guests</span>
                  <span className="text-[14px] font-semibold text-[#1a1a1a]">{filters.guests}</span>
                </div>
                <ChevronDown
                  className={
                    "h-[11px] w-[11px] flex-shrink-0 text-[#9b8f82] transition-transform duration-150 " +
                    (openDropdown === "guests" ? "rotate-180" : "rotate-0")
                  }
                />
              </button>

              {openDropdown === "guests" ? (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-0 top-[calc(100%+12px)] z-[90] w-[320px] overflow-hidden rounded-2xl border border-[#E5E0D8] bg-[#FFFBF2] shadow-[0_14px_40px_rgba(0,0,0,0.12)]"
                >
                  <div className="border-b border-[#E5E0D8]/60 px-5 py-4">
                    <p style={{ fontFamily: 'Sideware, serif' }} className="text-[12px] font-bold uppercase tracking-widest text-[#1a1a1a]">Select Guest Count</p>
                  </div>
                  <div className="mb-3 flex items-center justify-between px-5 pt-3">
                    <p className="text-[12px] font-semibold text-[#804226]">Guests (PAX)</p>
                    <span className="rounded-lg bg-[#F5F0E6] px-2.5 py-1 text-[12px] font-bold text-[#804226]">{filters.guests || "Any"}</span>
                  </div>
                  <div className="px-5 pb-5">
                    <input
                      type="range"
                      min={25}
                      max={2000}
                      step={25}
                      value={filters.guests || 25}
                      onChange={(e) =>
                        setFilters((p) => ({
                          ...p,
                          guests: Number(e.target.value),
                        }))
                      }
                      className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[#E8D5B7] accent-[#804226]"
                    />
                    <div className="mt-2 flex justify-between text-[11px] font-medium text-[#8B7355]">
                      <span>25</span>
                      <span>500</span>
                      <span>1000</span>
                      <span>2000+</span>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-2.5">
                      {[100, 250, 500, 800, 1200, 1600].map((value) => (
                        <button
                          key={value}
                          onClick={() => setFilters((p) => ({ ...p, guests: Number(value) }))}
                          className={
                            "rounded-xl border-[1.5px] px-2 py-2 text-[13px] font-semibold transition-colors " +
                            (filters.guests === Number(value)
                              ? "border-[#804226] bg-[#804226] text-[#FFFFFF]"
                              : "border-[#E5E0D8] bg-[#FFFFFF] text-[#804226] hover:border-[#804226] hover:bg-[#FAF8F5]")
                          }
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </div>

            <div className="relative flex-1">
              <button
                onClick={() => setOpenDropdown((p) => (p === "cuisines" ? null : "cuisines"))}
                className={
                  "flex h-[44px] w-full cursor-pointer items-center gap-2.5 rounded-xl border-r border-[#f0ece4] bg-transparent px-[16px] transition-all hover:bg-[#faf8f6] " +
                  (filters.cuisines.length > 0 ? "text-[#E07B39]" : "text-[#1a1a1a]")
                }
              >
                <SlidersHorizontal className="h-[15px] w-[15px] flex-shrink-0 text-[#E07B39]" />
                <div className="flex min-w-0 flex-1 flex-col text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-[#9b8f82]">
                    Cuisine
                  </span>
                  <span className="truncate text-[14px] font-semibold text-[#1a1a1a]">
                    {filters.cuisines.length > 0 ? filters.cuisines.slice(0, 2).join(", ") : "Any Cuisine"}
                    {filters.cuisines.length > 2 ? " +more" : ""}
                  </span>
                </div>
                <ChevronDown
                  className={
                    "h-[11px] w-[11px] flex-shrink-0 text-[#9b8f82] transition-transform duration-150 " +
                    (openDropdown === "cuisines" ? "rotate-180" : "rotate-0")
                  }
                />
              </button>

              {openDropdown === "cuisines" ? (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute left-0 top-[calc(100%+8px)] z-[90] w-[300px] overflow-hidden rounded-2xl border border-[#E5E0D8] bg-[#FFFBF2] shadow-[0_14px_36px_rgb(0,0,0,0.22)]"
                >
                  <div className="border-b border-[#E5E0D8] px-4 py-3">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-[#804226]">Select Cuisines</p>
                  </div>
                  <div className="py-2">
                    {CUISINE_OPTIONS.map((option) => {
                      const checked = filters.cuisines.includes(option);
                      return (
                        <button
                          key={option}
                          onClick={() =>
                            setFilters((p) => ({
                              ...p,
                              cuisines: toggle(p.cuisines, option),
                            }))
                          }
                          className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-[#F5F0E6]"
                        >
                          <span
                            className={
                              "flex h-5 w-5 items-center justify-center rounded-md border-2 " +
                              (checked ? "border-[#7A3E26] bg-[#7A3E26]" : "border-[#E5E0D8] bg-[#FFFFFF]")
                            }
                          >
                            {checked ? <Check className="h-3 w-3 text-[#FFFFFF]" /> : null}
                          </span>
                          <span className="text-[13px] font-medium text-[#1E1E1E]">{option}</span>
                          {checked ? (
                            <span className="ml-auto rounded-md bg-[#FFF3E8] px-2 py-0.5 text-[10px] font-semibold text-[#804226]">
                              Selected
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center justify-between border-t border-[#E5E0D8] px-4 py-3">
                    <span className="text-[12px] text-[#6B7280]">
                      {filters.cuisines.length > 0 ? filters.cuisines.length + " selected" : "None selected"}
                    </span>
                    <button
                      onClick={() => setOpenDropdown(null)}
                      className="h-8 rounded-lg bg-[#DF923A] px-5 text-[12px] font-bold text-[#FFFFFF] hover:bg-[#C88232]"
                    >
                      Apply
                    </button>
                  </div>
                </motion.div>
              ) : null}
            </div>

            {/* Text search input */}
            <div className="flex flex-1 items-center gap-2.5 rounded-xl px-[16px]">
              <Search className="h-[15px] w-[15px] flex-shrink-0 text-[#E07B39]" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="block text-[10px] font-bold uppercase tracking-widest text-[#9b8f82]">
                  Search
                </span>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Caterer name, cuisine..."
                  className="w-full bg-transparent text-[14px] font-semibold text-[#1a1a1a] outline-none placeholder:text-[#c8c0b8]"
                />
              </div>
              {searchText ? (
                <button onClick={() => setSearchText("")} className="flex-shrink-0 text-[#9b8f82] hover:text-[#1a1a1a]">
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>

            <button
              onClick={() => setOpenDropdown(null)}
              className="ml-2 flex h-[52px] flex-shrink-0 items-center justify-center gap-2 rounded-full bg-[#DE903E] px-8 text-[15px] font-bold text-white shadow-sm transition-colors hover:bg-[#804226] active:scale-95"
            >
              <Search className="h-[16px] w-[16px]" />
              Search
            </button>
          </div>
        </div>

        {/* MIDDLE COMPONENT: Title & Sorting Header */}
        {filteredVendors.length > 0 && (
          <div className="mb-5 flex w-full flex-col items-start justify-between gap-4 border-b border-[#E8D5B7] pb-6 md:flex-row md:items-end">
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-[13px] font-semibold text-[#DE903E]">
                <TrendingUp className="h-3.5 w-3.5" />
                Premium Caterers in Jaipur
              </p>
              <h1 className="text-[18px] font-bold text-[#1E1E1E] md:text-[20px]">
                Showing{" "}
                <span className="text-[#DE903E]">
                  {filteredVendors.length} verified {filteredVendors.length === 1 ? "caterer" : "caterers"}
                </span>{" "}
                {chips.length > 0 ? "matching your preferences" : "in Jaipur"}
              </h1>
            </div>
            <div className="relative hidden md:block">
              <button
                onClick={() => setDesktopSortOpen((prev) => !prev)}
                className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#E8D5B7] bg-white px-3.5 text-xs font-semibold text-[#804226] shadow-sm transition-all hover:border-[#804226]"
              >
                Sort: {selectedSortLabel}
                <ChevronDown className="h-3.5 w-3.5 text-[#8B7355]" />
              </button>
              {desktopSortOpen ? (
                <div className="absolute right-0 top-11 z-50 w-[220px] overflow-hidden rounded-2xl border border-[#E8D5B7] bg-white shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSortBy(option.value);
                        setDesktopSortOpen(false);
                      }}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-[13px] transition-colors hover:bg-[#FFFAF5]"
                    >
                      <span className={sortBy === option.value ? "font-bold text-[#804226]" : "font-medium text-[#1E1E1E]"}>
                        {option.label}
                      </span>
                      {sortBy === option.value ? <Check className="h-3.5 w-3.5 text-[#804226]" /> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        )}

          {chips.length > 0 ? (
            <div className="mt-3 hidden md:flex flex-wrap items-center gap-2">
              {chips.map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E8D5B7] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#804226] shadow-sm"
                >
                  {chip.label}
                  <button
                    onClick={chip.remove}
                    className="flex h-3.5 w-3.5 items-center justify-center text-[#8B7355] hover:text-[#804226]"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <button 
                onClick={clearAll} 
                className="ml-2 text-[12px] font-bold text-[#E07B39] transition-all hover:text-[#804226] hover:underline"
              >
                Clear All
              </button>
            </div>
          ) : null}

        {/* BOTTOM COMPONENT: Sidebar & Vendors Grid */}
        <section className="mt-6 flex w-full flex-1 gap-6 pb-24">
          <FilterSidebar filters={filters} setFilters={setFilters} onReset={clearAll} />

        <div id="vendor-listings" className="flex-1 p-0">
          {filteredVendors.length === 0 ? (
            <div className="flex flex-col items-center px-8 py-20 text-center">
              <div className="mx-auto flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-[20px] bg-[#F5F0E6] shadow-[0_4px_16px_rgba(222,144,62,0.1)]">
                <Image src={MHIconOrange} alt="Mera Halwai" className="h-10 w-10 opacity-80" />
              </div>
              <p className="mt-5 text-[20px] font-bold text-[#7A3E26]">No caterers found</p>
              <p className="mt-2 max-w-[280px] text-[13px] leading-relaxed text-[#6B7280]">
                No caterers match your current filters. Try changing the event type or guest count.
              </p>
              <button
                onClick={clearAll}
                className="mt-6 h-11 rounded-xl bg-[#7A3E26] px-8 text-sm font-bold text-[#FFFFFF] transition-all active:scale-95"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 gap-4 md:gap-6"
            >
              {filteredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Close Unified Central Container */}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[110] border-t border-[#E8D5B7] bg-[#FFFAF5] p-3 shadow-[0_-8px_32px_rgba(128,66,38,0.06)] md:hidden">
        <div className="flex w-full items-center justify-between gap-3">
          <button onClick={() => setMobileSortOpen(true)} className="flex h-[44px] flex-1 flex-col items-center justify-center rounded-xl bg-[#DE903E] text-white shadow-sm transition-transform active:scale-95">
            <span className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" strokeWidth={3} />
              <span className="text-[13px] font-black tracking-wide">Filters</span>
            </span>
          </button>
          <button onClick={() => { document.getElementById("mobileSearchInput")?.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => document.getElementById("mobileSearchInput")?.focus(), 300); }} className="flex h-[44px] flex-1 flex-col items-center justify-center rounded-xl bg-[#804226] text-white shadow-md transition-transform active:scale-95">
            <div className="flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" strokeWidth={3} />
              <span className="text-[13px] font-black tracking-wide">Search</span>
            </div>
          </button>
          <button onClick={() => router.push("/profile")} className="flex h-[44px] flex-1 flex-col items-center justify-center rounded-xl bg-white border border-[#E8D5B7] text-[#804226] shadow-sm transition-transform active:scale-95">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="text-[13px] font-black tracking-wide">Profile</span>
            </span>
          </button>
          <button onClick={() => router.push("/login")} className="flex h-[44px] flex-1 flex-col items-center justify-center rounded-xl bg-white border border-[#E8D5B7] text-[#804226] shadow-sm transition-transform active:scale-95">
            <span className="flex items-center gap-1.5">
              <LogIn className="h-3.5 w-3.5" strokeWidth={2.5} />
              <span className="text-[13px] font-black tracking-wide">Login</span>
            </span>
          </button>
        </div>
      </div>

      {/* Mobile-Only Dropdown Bottom Sheets */}
      <AnimatePresence>
        {["eventType", "guests", "cuisines"].includes(openDropdown || "") && (
          <div className="fixed inset-0 z-[120] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenDropdown(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute bottom-0 left-0 right-0 flex flex-col max-h-[75vh] rounded-t-[28px] bg-[#FFFAF5] shadow-[0_-8px_24px_rgba(0,0,0,0.1)]"
            >
              <div className="flex-shrink-0 p-5 pb-2">
                <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#E5E0D8]" />
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-black text-[#1E1E1E] tracking-tight">
                    {openDropdown === "eventType" ? "Event Type" : openDropdown === "guests" ? "Guests" : "Cuisines"}
                  </h3>
                  <button onClick={() => setOpenDropdown(null)} className="rounded-full bg-[#F5F0E6] p-1.5 text-[#1E1E1E] transition-transform active:scale-90">
                    <X className="h-4 w-4" strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-5 pb-8 scrollbar-hide">
                {openDropdown === "eventType" && EVENT_OPTIONS.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setFilters((p) => ({ ...p, eventType: option }));
                        setOpenDropdown(null);
                      }}
                      className="flex w-full items-center justify-between py-4 border-b border-[#F0EBE1]/70 text-left text-[15px] transition-colors last:border-none"
                    >
                      <span className={filters.eventType === option ? "font-bold text-[#804226]" : "font-semibold text-[#1E1E1E]"}>{option}</span>
                      {filters.eventType === option && <CheckCircle2 className="h-5 w-5 text-[#DE903E]" />}
                    </button>
                ))}
                
                {openDropdown === "guests" && (
                  <div className="py-2">
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-[14px] font-bold text-[#804226]">Total Guests</span>
                      <span className="rounded-lg bg-[#F5F0E6] px-3 py-1.5 text-[15px] font-black tracking-tight text-[#1E1E1E]">{filters.guests}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="1500"
                      step="10"
                      value={filters.guests}
                      onChange={(e) => setFilters((p) => ({ ...p, guests: parseInt(e.target.value) }))}
                      className="h-2 w-full appearance-none rounded-full bg-[#E5E0D8] accent-[#DE903E] outline-none"
                    />
                    <div className="mt-8">
                       <button onClick={() => setOpenDropdown(null)} className="flex w-full h-12 items-center justify-center rounded-xl bg-[#DE903E] text-white text-[15px] font-bold tracking-wide active:scale-95 shadow-md">Apply Count</button>
                    </div>
                  </div>
                )}

                {openDropdown === "cuisines" && CUISINE_OPTIONS.map((option) => {
                  const selected = filters.cuisines.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => {
                        setFilters((p) => ({
                          ...p,
                          cuisines: selected ? p.cuisines.filter((c) => c !== option) : [...p.cuisines, option],
                        }));
                      }}
                      className="flex w-full items-center justify-between py-4 border-b border-[#F0EBE1]/70 text-left text-[15px] transition-colors last:border-none"
                    >
                      <span className={selected ? "font-bold text-[#804226]" : "font-semibold text-[#1E1E1E]"}>{option}</span>
                      <span className={"flex h-[20px] w-[20px] items-center justify-center rounded-[6px] border-[1.5px] transition-colors " + (selected ? "border-[#DE903E] bg-[#DE903E]" : "border-[#D1A87A]/50 bg-white")}>
                         {selected && <Check className="h-3 w-3 text-white stroke-[3px]" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {mobileSortOpen ? (
        <div className="fixed inset-0 z-[120] bg-black/40 backdrop-blur-sm md:hidden">
          <button
            onClick={() => setMobileSortOpen(false)}
            className="h-full w-full cursor-default"
            aria-label="close sort"
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] flex flex-col rounded-t-3xl bg-[#FFFAF5] shadow-[0_-8px_24px_rgba(0,0,0,0.1)]">
            <div className="flex-shrink-0 p-5 pb-2">
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[#E5E0D8]" />
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black text-[#1E1E1E] tracking-tight">Filters & Sorting</h3>
                <button onClick={() => setMobileSortOpen(false)} className="rounded-full bg-[#F5F0E6] p-1.5 text-[#1E1E1E] transition-transform active:scale-90">
                  <X className="h-4 w-4" strokeWidth={3} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-5 scrollbar-hide pb-6">
              <div className="mb-6 pt-2">
                <h4 className="text-[13px] font-bold tracking-widest uppercase text-[#DE903E] mb-3">Sort Priority</h4>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`rounded-xl px-4 py-2 text-[12px] font-extrabold transition-all active:scale-95 ${
                        sortBy === option.value
                          ? "bg-[#DE903E] text-white shadow-sm border-[1.5px] border-[#DE903E]"
                          : "border-[1.5px] border-[#DE903E]/20 bg-white text-[#804226]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <FilterSidebar filters={filters} setFilters={setFilters} onReset={clearAll} isMobile />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
