"use client";

import { ArrowRight, CalendarCheck, Leaf, MapPin, Star, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { type Vendor } from "@/data/vendors";
import MHIconOrange from "@/logos/Symbol/MH_Logo_Icon_Orange.png";

type VendorCardProps = {
  vendor: Vendor;
};

function VegIcon({ isVeg }: { isVeg: boolean }) {
  if (isVeg) {
    return (
      <span className="flex items-center gap-1.5 rounded-md bg-[#16A34A]/[0.05] px-2 py-1 outline outline-1 outline-[#16A34A]/20">
        <Leaf className="h-3.5 w-3.5 fill-[#16A34A] text-[#16A34A]" strokeWidth={2} />
        <span className="text-[11px] font-bold tracking-widest text-[#15803D]">PURE VEG</span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 rounded-md bg-[#B91C1C]/[0.05] px-2 py-1 outline outline-1 outline-[#B91C1C]/20">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="4" stroke="#B91C1C" strokeWidth="2.5" />
        <polygon points="12,7 17,16 7,16" fill="#B91C1C" />
      </svg>
      <span className="text-[11px] font-bold tracking-widest text-[#B91C1C]">NON VEG</span>
    </span>
  );
}

function VegBadgeSmall({ isVeg }: { isVeg: boolean }) {
  if (isVeg) {
    return (
      <span className="flex items-center gap-1 rounded bg-[#16A34A]/5 px-1.5 py-0.5">
        <Leaf className="h-[10px] w-[10px] fill-[#16A34A] text-[#16A34A]" strokeWidth={2} />
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#15803D]">Pure Veg</span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded bg-[#B91C1C]/5 px-1.5 py-0.5">
      <svg viewBox="0 0 24 24" width="10" height="10" fill="none">
        <rect x="2" y="2" width="20" height="20" rx="3" stroke="#B91C1C" strokeWidth="3" />
        <polygon points="12,7 17,16 7,16" fill="#B91C1C" />
      </svg>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B91C1C]">Non-Veg</span>
    </span>
  );
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const router = useRouter();
  const goToProfile = () => router.push("/caterer/" + vendor.slug);
  const thumbs = vendor.images.slice(1, 3);
  const thirdThumb = vendor.images[3] ?? vendor.images[2] ?? vendor.images[0];
  const extraCount = Math.max(vendor.images.length - 3, 0);

  return (
    <motion.article
      variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
      onClick={goToProfile}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-transparent bg-white shadow-[0_2px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:border-[#E8D5B7] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] active:scale-[0.99] md:flex"
    >
      {/* ===== IMAGE BLOCK ===== */}
      <div className="relative h-[250px] w-full overflow-hidden md:h-[auto] md:min-h-[290px] md:w-[38%] md:flex-shrink-0 bg-[#1E1E1E]">
        <img
          src={vendor.images[0]}
          alt={vendor.name}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
        />

        {/* MH Verified badge */}
        {vendor.verified ? (
          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-xl border border-[#DE903E]/40 bg-gradient-to-r from-[#FFFBF5] to-white px-3 py-1.5 shadow-[0_2px_8px_rgba(224,123,57,0.15)] backdrop-blur-md">
            <Image src={MHIconOrange} alt="MH Verified" className="h-[14px] w-[14px] object-contain" />
            <span className="text-[11px] font-bold tracking-widest text-[#E07B39] md:inline">MH VERIFIED</span>
          </div>
        ) : null}

        {/* Rating badge (Desktop Only overlay position, wait it's top right) */}
        <div className="absolute right-3 top-3 z-10 hidden md:flex h-[26px] items-center justify-center gap-1 rounded-md bg-green-700 px-2 shadow-sm">
          <Star className="h-3.5 w-3.5 fill-white text-white" />
          <span className="text-[13px] font-bold text-white">{vendor.rating}</span>
        </div>

        {/* Mobile Popular Badge */}
        {vendor.rating >= 4.5 && (
          <div className="absolute right-3 top-3 z-10 flex md:hidden items-center gap-1 rounded-full bg-black/80 border border-white/20 px-2.5 py-1.5 backdrop-blur-md shadow-sm">
            <Star className="h-[10px] w-[10px] fill-white text-white" />
            <span className="text-[10px] font-extrabold text-white">Popular</span>
          </div>
        )}

        {/* Mobile-Only Gradient Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-[180px] bg-gradient-to-t from-black via-black/50 to-transparent md:hidden" />

        {/* Mobile-Only Overlay Text (Swiggy Premium Style) */}
        <div className="absolute bottom-4 left-3 right-3 z-10 md:hidden flex justify-between items-end">
          <div className="flex-1 pr-2">
            <h3 className="text-[25px] font-extrabold leading-tight tracking-tight text-white drop-shadow-lg">
              {vendor.name}
            </h3>
            <p className="flex items-center gap-1.5 text-[12px] font-bold text-white/90 drop-shadow-md mt-0.5">
              {vendor.cuisines.slice(0, 2).join(', ')} <span className="text-white/40">|</span> Starts at ₹{vendor.priceVeg} <span className="text-[10px] font-medium text-white/70">/plate</span>
            </p>
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-[13px] w-[13px] ${i < Math.floor(vendor.rating) ? 'fill-[#DE903E] text-[#DE903E]' : 'fill-white/30 text-white/30'}`} />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-end mb-1 gap-1.5">
            <div className="flex items-center gap-2">
               {vendor.isVeg ? (
                 <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-white shadow-md">
                   <span className="flex h-[16px] w-[16px] items-center justify-center rounded-[3px] border-[2px] border-[#166534]">
                     <span className="h-[8px] w-[8px] rounded-full bg-[#166534]" />
                   </span>
                 </span>
               ) : (
                 <>
                   <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-white shadow-md">
                     <span className="flex h-[16px] w-[16px] items-center justify-center rounded-[3px] border-[2px] border-[#166534]">
                       <span className="h-[8px] w-[8px] rounded-full bg-[#166534]" />
                     </span>
                   </span>
                   <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-white shadow-md">
                     <span className="flex h-[16px] w-[16px] items-center justify-center rounded-[3px] border-[2px] border-[#B91C1C]">
                       <span className="h-[8px] w-[8px] rounded-full bg-[#B91C1C]" />
                     </span>
                   </span>
                 </>
               )}
            </div>
          </div>
        </div>

        {/* Bottom gradient + thumbnails (Desktop Only) */}
        <div className="absolute bottom-0 left-0 right-0 h-[90px] bg-gradient-to-t from-black/60 to-transparent hidden md:block" />
        <div className="absolute bottom-3 left-3 hidden md:flex gap-2">
          {thumbs.map((thumb) => (
            <div key={thumb} className="h-[52px] w-[52px] overflow-hidden rounded-lg border border-white/40 shadow-sm transition-transform hover:scale-105">
              <img src={thumb} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
          {vendor.images.length > 3 ? (
            <div className="relative h-[52px] w-[52px] overflow-hidden rounded-lg border border-white/40">
              <img src={thirdThumb} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[11px] font-bold text-white">
                +{extraCount}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* ===== CONTENT BLOCK ===== */}
      <div className="hidden md:flex flex-1 flex-col p-4 md:p-6 md:w-[62%] bg-white">
        
        {/* Mobile Row: Reviews & Veg Icon */}
        <div className="flex md:hidden items-center justify-between mb-3 border-b border-[#F5F0E6] pb-3">
           <p className="text-[13px] font-extrabold text-[#1E1E1E]">
             {vendor.reviews} <span className="text-[#8B7355] font-medium">Ratings</span>
           </p>
           <VegBadgeSmall isVeg={vendor.isVeg} />
        </div>

        {/* Row 1: Name + veg icon (Desktop Only) */}
        <div className="hidden md:flex items-start justify-between gap-3">
          <h3 className="flex-1 text-[20px] font-extrabold leading-tight tracking-tight text-[#1E1E1E] md:text-[23px]">
            {vendor.name}
          </h3>
          <VegIcon isVeg={vendor.isVeg} />
        </div>

        {/* Row 2: Location + reviews (Desktop Only) */}
        <div className="mt-2.5 hidden md:flex items-center justify-between">
          <p className="flex items-center gap-1.5 text-[13px] font-semibold text-[#8B7355]">
            <MapPin className="h-4 w-4 flex-shrink-0 text-[#DE903E]" />
            {vendor.location}
          </p>
          <p className="text-[12px] font-medium text-[#8B7355]">{vendor.reviews} reviews</p>
        </div>

        {/* Row 3: Specialisation tags */}
        <div className="mt-4 flex gap-2.5 overflow-x-auto scrollbar-hide">
          {vendor.specialisations.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="flex-shrink-0 whitespace-nowrap rounded-lg bg-[#FAF8F5] px-3 py-1.5 text-[11px] font-extrabold tracking-wide uppercase text-[#8B7355]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Row 4: Guest range + packages */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-[15px] w-[15px] text-[#A3978B]" />
            <span className="text-[12px] font-bold text-[#A3978B]">
              {vendor.minPax}–{vendor.maxPax} guests
            </span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-[#804226]/[0.03] px-2.5 py-1 outline outline-1 outline-[#804226]/10">
            <span className="text-[10px] font-extrabold tracking-widest text-[#804226] uppercase">3 Packages</span>
          </div>
        </div>

        {/* Row 5: Price + CTA (Desktop Only wrappers) */}
        <div className="mt-5 flex items-end justify-between border-t border-[#F0EBE3] pt-5">
          <div className="flex flex-col gap-1 hidden md:flex">
            <span className="text-[11px] font-bold uppercase tracking-wide text-[#A3978B]">Starting at</span>
            <div className="flex items-baseline gap-1">
              <span className="text-[26px] font-black tracking-tighter leading-none text-[#1E1E1E] md:text-[30px]">
                ₹{vendor.priceVeg}
              </span>
              <span className="text-[13px] font-medium text-[#8B7355]">/ plate</span>
            </div>
            <div className="mt-1">
              <VegBadgeSmall isVeg={vendor.isVeg} />
            </div>
          </div>

          <div className="flex flex-col w-full md:w-auto gap-2.5 md:flex-row md:items-center mt-2 md:mt-0 md:gap-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToProfile();
              }}
              className="flex h-11 flex-1 items-center justify-center rounded-xl border-[1.5px] border-[#E07B39] bg-transparent px-5 text-[14px] font-bold text-[#E07B39] transition-all duration-300 hover:bg-[#FFF5eb] active:scale-[0.98]"
            >
              View Profile
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.push("/caterer/" + vendor.slug);
              }}
              className="flex h-11 items-center justify-center gap-2 rounded-xl bg-[#DE903E] px-7 text-[14px] font-bold !text-[#FFFFFF] shadow-sm transition-all hover:bg-[#C88232] active:scale-95"
            >
              Book Now
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
