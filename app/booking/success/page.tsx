"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Check,
  CheckCircle,
  Clock,
  Copy,
  FileText,
  MessageCircle,
  Package,
  Phone,
} from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";

const HOLD_SEC = 2 * 60 * 60;

export default function BookingSuccessPage() {
  const router = useRouter();
  const store = useBookingStore();
  const [left, setLeft] = useState(HOLD_SEC);

  useEffect(() => {
    if (!store.orderId) router.replace("/caterers");
  }, [store.orderId, router]);

  useEffect(() => {
    if (left <= 0) return;
    const t = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(t);
  }, [left]);

  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  const pad = (n: number) => (n < 10 ? "0" + n : String(n));

  if (!store.orderId) return null;

  const orderLabel = "MH-ORD-" + store.orderId;

  return (
    <div className="min-h-screen bg-[#FFFAF5] px-5 py-8">
      <div className="sticky top-0 z-40 border-b border-[#E8D5B7] bg-white px-2 py-3">
        <div className="mx-auto flex max-w-lg items-center justify-center overflow-x-auto">
          {["Customize", "Details", "Review", "Done"].map((label, i, arr) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center px-1">
                <div
                  className={
                    "flex h-7 w-7 items-center justify-center rounded-full text-white " +
                    (i === 3 ? "bg-[#DE903E]" : "bg-[#804226]")
                  }
                >
                  <Check className="h-3.5 w-3.5" />
                </div>
                <span
                  className={
                    "mt-1 whitespace-nowrap text-[9px] font-semibold " +
                    (i === 3 ? "text-[#DE903E]" : "text-[#804226]")
                  }
                >
                  {label}
                </span>
              </div>
              {i < arr.length - 1 ? <div className="mx-0.5 h-px w-4 flex-shrink-0 bg-[#E8D5B7] sm:w-6" /> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-green-400 bg-green-100"
        >
          <CheckCircle className="h-10 w-10 fill-green-500 text-green-500" />
        </motion.div>

        <h1 className="mt-4 text-center text-[24px] font-bold text-[#1E1E1E]">Booking Request Sent!</h1>
        <p className="mt-1 text-center text-[13px] text-[#8B7355]">
          We&apos;ll call you within 30 minutes to confirm.
        </p>

        <div className="mt-6 flex justify-center">
          <div className="flex items-center gap-3 rounded-xl border-2 border-[#DE903E] bg-[#FFF3E8] px-5 py-3">
            <Clock className="h-[18px] w-[18px] text-[#DE903E]" />
            <div>
              <p className="text-[10px] font-medium text-[#8B7355]">Slot held for</p>
              {left > 0 ? (
                <p className="font-mono text-[22px] font-extrabold text-[#804226]">
                  {pad(h)}:{pad(m)}:{pad(s)}
                </p>
              ) : (
                <p className="text-[13px] font-semibold text-[#804226]">Slot expired. Please rebook.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#E8D5B7] bg-white p-5">
          <h2 className="mb-4 text-[15px] font-bold text-[#1E1E1E]">Order Summary</h2>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#8B7355]">Order ID</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[13px] font-bold text-[#804226]">{orderLabel}</span>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(orderLabel);
                }}
                className="text-[#DE903E]"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="space-y-2 text-[12px]">
            <Row label="Vendor" value={store.vendorName} />
            <Row
              label="Package"
              value={(store.selectedPackage ?? "") + " · " + store.selectedItems.length + " items"}
            />
            <Row label="Event" value={store.eventType} />
            <Row label="Date" value={store.eventDate + " at " + store.eventTime} />
            <Row label="Guests" value={String(store.guestCount)} />
            <Row label="Venue" value={store.venueName + ", " + store.venueCity} />
            <div className="flex justify-between">
              <span className="text-[#8B7355]">Total</span>
              <span className="font-bold text-[#804226]">₹{store.grandTotal.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B7355]">Payment</span>
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                Pending
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#E8D5B7] bg-[#FFFAF5] p-4">
          <p className="mb-3 text-[13px] font-semibold text-[#804226]">What Happens Next</p>
          <div className="flex flex-col gap-0">
            <StepRow
              done
              title="Request Received"
              sub="Your booking is in queue"
            />
            <StepRow
              current
              title="Team Calls You"
              sub={"Within 30 min on +91 " + store.customerPhone}
            />
            <StepRow title="Vendor Confirmed" sub="Caterer accepts your slot" />
            <StepRow title="Payment Link Sent" sub="Via WhatsApp + Email" last />
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push("/invoice/" + store.orderId)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#804226] text-[14px] font-bold text-white"
          >
            <FileText className="h-[18px] w-[18px]" />
            View Invoice
          </button>
          <button
            type="button"
            onClick={() => router.push("/my-bookings/" + store.orderId)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#804226] text-[14px] font-bold text-[#804226]"
          >
            <Package className="h-[18px] w-[18px]" />
            Track Booking
          </button>
          <div className="flex gap-3">
            <a
              href="tel:+919876543210"
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#E8D5B7] text-[13px] font-semibold text-[#8B7355]"
            >
              <Phone className="h-4 w-4" />
              Call Us
            </a>
            <a
              href="https://wa.me/919876543210"
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#E8D5B7] text-[13px] font-semibold text-[#8B7355]"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
          <Link href="/" className="mt-2 block text-center text-[12px] font-semibold text-[#DE903E]">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-[#8B7355]">{label}</span>
      <span className="max-w-[60%] text-right font-semibold text-[#1E1E1E]">{value}</span>
    </div>
  );
}

function StepRow({
  done,
  current,
  title,
  sub,
  last,
}: {
  done?: boolean;
  current?: boolean;
  title: string;
  sub: string;
  last?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div
          className={
            "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-white " +
            (done ? "bg-[#804226]" : current ? "bg-[#DE903E] ring-4 ring-[#DE903E]/30" : "bg-[#F0EBE3]")
          }
        >
          {done ? (
            <Check className="h-3 w-3 text-white" />
          ) : current ? (
            <span className="block h-2 w-2 rounded-full bg-white" />
          ) : (
            <span className="block h-2 w-2 rounded-full bg-[#8B7355]" />
          )}
        </div>
        {!last ? <div className="h-6 w-px bg-[#E8D5B7]" /> : null}
      </div>
      <div className="pb-3">
        <p className="text-[13px] font-semibold text-[#1E1E1E]">{title}</p>
        <p className="text-[11px] text-[#8B7355]">{sub}</p>
      </div>
    </div>
  );
}
