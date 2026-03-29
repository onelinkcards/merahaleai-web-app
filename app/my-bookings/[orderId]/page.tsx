"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useBookingStore } from "@/store/bookingStore";
import { Package } from "lucide-react";

export default function MyBookingDetailPage() {
  const params = useParams<{ orderId: string }>();
  const store = useBookingStore();

  return (
    <div className="mx-auto max-w-lg px-5 py-10">
      <div className="rounded-2xl border border-[#E8D5B7] bg-white p-6 text-center">
        <Package className="mx-auto h-10 w-10 text-[#DE903E]" />
        <h1 className="mt-4 text-[18px] font-bold text-[#1E1E1E]">Booking #{params.orderId}</h1>
        <p className="mt-2 text-[13px] text-[#8B7355]">
          {store.vendorName ? "Vendor: " + store.vendorName : "Open this page after placing a booking."}
        </p>
        <Link href="/caterers" className="mt-6 inline-block text-[14px] font-semibold text-[#DE903E]">
          Browse caterers
        </Link>
      </div>
    </div>
  );
}
