"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Mail, MapPin, Phone, Twitter, Youtube } from "lucide-react";
import LogoOrange from "@/logos/Horizontal/MH_Logo_Horizontal_Orange.png";

const footerLinks = {
  discover: [
    { label: "Find Caterers", href: "/caterers" },
    { label: "Wedding Catering", href: "/caterers?event=Wedding" },
    { label: "Corporate Events", href: "/caterers?event=Corporate" },
    { label: "Birthday Parties", href: "/caterers?event=Birthday" },
    { label: "Satsang & Pooja", href: "/caterers?event=Pooja" },
  ],
  cuisines: [
    { label: "Rajasthani", href: "/caterers?cuisine=Rajasthani" },
    { label: "North Indian", href: "/caterers?cuisine=North+Indian" },
    { label: "Mughlai", href: "/caterers?cuisine=Mughlai" },
    { label: "South Indian", href: "/caterers?cuisine=South+Indian" },
    { label: "Chaat & Snacks", href: "/caterers?cuisine=Chaat" },
  ],
  company: [
    { label: "About Us", href: "/" },
    { label: "How It Works", href: "/" },
    { label: "Trust & Safety", href: "/" },
    { label: "Help Center", href: "/" },
    { label: "Privacy Policy", href: "/" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[#E8D5B7] bg-[#FFFAF5]">
      {/* Top section */}
      <div className="mx-auto w-full max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div>
            <Image
              src={LogoOrange}
              alt="Mera Halwai"
              className="h-[36px] w-auto object-contain"
            />
            <p className="mt-4 max-w-[260px] text-[13px] leading-relaxed text-[#8B7355]">
              Jaipur&apos;s most trusted platform to book verified halwais and caterers with transparent pricing.
            </p>
            <div className="mt-5 flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 text-[12px] text-[#8B7355]">
                <Phone className="h-3.5 w-3.5 flex-shrink-0 text-[#DE903E]" />
                +91 123 456 7890
              </div>
              <div className="flex items-center gap-2.5 text-[12px] text-[#8B7355]">
                <Mail className="h-3.5 w-3.5 flex-shrink-0 text-[#DE903E]" />
                hello@merahalwai.com
              </div>
              <div className="flex items-center gap-2.5 text-[12px] text-[#8B7355]">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-[#DE903E]" />
                Jaipur, Rajasthan
              </div>
            </div>
            <div className="mt-5 flex gap-3">
              {[Instagram, Twitter, Youtube].map((Icon, i) => (
                <button
                  key={i}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8D5B7] bg-white text-[#8B7355] transition-all hover:border-[#DE903E] hover:text-[#DE903E]"
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Discover */}
          <div>
            <p className="mb-4 text-[12px] font-bold uppercase tracking-widest text-[#804226]">Discover</p>
            <div className="flex flex-col gap-2.5">
              {footerLinks.discover.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-[#8B7355] transition-colors hover:text-[#804226]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Cuisines */}
          <div>
            <p className="mb-4 text-[12px] font-bold uppercase tracking-widest text-[#804226]">Cuisines</p>
            <div className="flex flex-col gap-2.5">
              {footerLinks.cuisines.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-[#8B7355] transition-colors hover:text-[#804226]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="mb-4 text-[12px] font-bold uppercase tracking-widest text-[#804226]">Company</p>
            <div className="flex flex-col gap-2.5">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-[13px] text-[#8B7355] transition-colors hover:text-[#804226]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#E8D5B7]">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-[12px] text-[#8B7355] md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} Mera Halwai. All rights reserved. Made with love for Jaipur&apos;s Halwais.</p>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-[#804226]">Terms</Link>
            <Link href="/" className="hover:text-[#804226]">Privacy</Link>
            <Link href="/" className="hover:text-[#804226]">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
