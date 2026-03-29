"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  ChevronDown,
  Clock,
  Lock,
  ShieldCheck,
  Star,
  Tag,
  X,
} from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { getVendorDetailBySlug } from "@/data/vendors";
import { calculateBill } from "@/lib/calculateBill";
import { groupMenuItemsForReview } from "@/lib/bookingMenuHelpers";
import { useToastStore } from "@/store/toastStore";

function ReviewSkeleton() {
  return (
    <div className="min-h-screen bg-[#FFFAF5] pb-10">
      <div className="sticky top-0 z-50 border-b border-[#E8D5B7] bg-white px-5 py-3">
        <div className="mx-auto h-7 max-w-5xl animate-pulse rounded bg-[#E8D5B7]" />
      </div>
      <div className="mx-auto max-w-5xl px-5 py-8">
        <div className="h-40 animate-pulse rounded-2xl bg-[#E8D5B7]/60" />
      </div>
    </div>
  );
}

export default function BookReviewPage() {
  const router = useRouter();
  const store = useBookingStore();
  const setMany = useBookingStore((s) => s.setMany);

  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [openCats, setOpenCats] = useState<Record<string, boolean>>({});
  const [confirming, setConfirming] = useState(false);

  const vendorSlug = store.vendorSlug;
  const pkgId = store.selectedPackage ?? "silver";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!vendorSlug) router.replace("/caterers");
  }, [mounted, vendorSlug, router]);

  useEffect(() => {
    if (!mounted) return;
    if (vendorSlug && !store.customerName) router.replace("/book/details");
  }, [mounted, vendorSlug, store.customerName, router]);

  useEffect(() => {
    if (!mounted) return;
    if (vendorSlug && !getVendorDetailBySlug(vendorSlug)) {
      router.replace("/caterers");
    }
  }, [mounted, vendorSlug, router]);

  const vendor = vendorSlug ? getVendorDetailBySlug(vendorSlug) : null;

  const bill = useMemo(() => {
    return calculateBill({
      vendorSlug: store.vendorSlug,
      selectedPackage: store.selectedPackage,
      pricePerPlate: store.pricePerPlate,
      guestCount: store.guestCount,
      selectedItems: store.selectedItems,
      addOnItems: store.addOnItems,
      couponDiscount: store.couponDiscount,
    });
  }, [
    store.vendorSlug,
    store.selectedPackage,
    store.pricePerPlate,
    store.guestCount,
    store.selectedItems,
    store.addOnItems,
    store.couponDiscount,
  ]);

  const grouped = useMemo(() => {
    if (!vendorSlug) return [];
    const veg = vendor?.autoAddonPricing?.vegPerItemPerPax ?? 30;
    const nv = vendor?.autoAddonPricing?.nonVegPerItemPerPax ?? 45;
    return groupMenuItemsForReview(vendorSlug, pkgId, store.selectedItems, veg, nv);
  }, [vendorSlug, pkgId, store.selectedItems, vendor?.autoAddonPricing]);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === "FLAT10") {
      setMany({ couponCode: "FLAT10", couponDiscount: 500 });
      useToastStore.getState().show("Coupon applied.");
    } else if (code) {
      useToastStore.getState().show("Invalid coupon.");
    }
  };

  const clearCoupon = () => {
    setMany({ couponCode: "", couponDiscount: 0 });
  };

  const confirm = async () => {
    setConfirming(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(useBookingStore.getState()),
      });
      const data = (await res.json()) as { orderId?: string; status?: string };
      const id = data.orderId ?? "2026-" + String(Math.floor(100000 + Math.random() * 899999));
      const ts = new Date().toISOString();
      setMany({
        orderId: id,
        bookingTimestamp: ts,
        orderStatus: "pending",
        baseTotal: bill.baseAmount,
        addOnTotal: bill.addOnTotal,
        gstAmount: bill.gstAmount,
        convenienceFee: bill.convenienceFee,
        grandTotal: bill.grandTotal,
      });
      router.push("/booking/success");
    } catch {
      useToastStore.getState().show("Could not place request. Try again.");
    } finally {
      setConfirming(false);
    }
  };

  if (!mounted) {
    return <ReviewSkeleton />;
  }

  if (!vendorSlug || !vendor) {
    return <ReviewSkeleton />;
  }

  if (!store.customerName?.trim()) {
    return <ReviewSkeleton />;
  }

  const toggleCat = (name: string) =>
    setOpenCats((prev) => ({ ...prev, [name]: !prev[name] }));

  return (
    <div className="min-h-screen bg-[#FFFAF5] pb-10">
      <div className="sticky top-0 z-50 border-b border-[#E8D5B7] bg-white px-2 py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-center overflow-x-auto">
          {[
            { done: true, label: "Customize" },
            { done: true, label: "Details" },
            { active: true, n: 3, label: "Review" },
            { n: 4, label: "Done" },
          ].map((s, i, arr) => (
            <div key={s.label} className="flex items-center">
              <div className="flex flex-col items-center px-1">
                <div
                  className={
                    "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold " +
                    ("done" in s && s.done
                      ? "bg-[#804226] text-white"
                      : "active" in s && s.active
                        ? "bg-[#DE903E] text-white"
                        : "bg-[#F0EBE3] text-[#8B7355]")
                  }
                >
                  {"done" in s && s.done ? <CheckCircle className="h-3.5 w-3.5 text-white" /> : "n" in s ? s.n : ""}
                </div>
                <span
                  className={
                    "mt-1 whitespace-nowrap text-[9px] font-semibold " +
                    ("active" in s && s.active ? "text-[#DE903E]" : "done" in s && s.done ? "text-[#804226]" : "text-[#8B7355]")
                  }
                >
                  {s.label}
                </span>
              </div>
              {i < arr.length - 1 ? <div className="mx-0.5 h-px w-4 flex-shrink-0 bg-[#E8D5B7] sm:w-6" /> : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-5 py-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <div>
          <div className="mb-4 rounded-2xl border border-[#E8D5B7] bg-white p-5">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-[#E8D5B7]">
                <Image
                  src={vendor.images[0]}
                  alt=""
                  width={64}
                  height={64}
                  className="h-16 w-16 object-cover"
                />
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#1E1E1E]">{store.vendorName}</p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <Star className="h-3 w-3 fill-[#DE903E] text-[#DE903E]" />
                  <span className="text-[12px] font-semibold">{vendor.rating}</span>
                  <span className="text-[11px] text-[#8B7355]">({vendor.reviewsCount} reviews)</span>
                </div>
                <p className="mt-0.5 text-[12px] text-[#8B7355]">{vendor.location}</p>
              </div>
            </div>
            <div className="my-4 h-px bg-[#E8D5B7]" />
            <div className="grid grid-cols-2 gap-y-3 text-[12px]">
              {[
                ["Event Type", store.eventType],
                ["Event Date", store.eventDate],
                ["Event Time", store.eventTime],
                ["Guests", String(store.guestCount) + " guests"],
                ["Venue", store.venueName || "—"],
                [
                  "Address",
                  store.venueAddress + ", " + store.venueCity + " " + store.venuePincode,
                ],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-col">
                  <span className="text-[10px] font-medium uppercase tracking-wide text-[#8B7355]">
                    {k}
                  </span>
                  <span className="mt-0.5 font-semibold text-[#1E1E1E]">{v}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => router.push("/book/details")}
              className="float-right mt-2 text-[12px] font-semibold text-[#DE903E]"
            >
              Edit
            </button>
          </div>

          <div className="mb-4 rounded-2xl border border-[#E8D5B7] bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1E1E1E]">
                {store.selectedPackage} package menu
              </h3>
              <span className="rounded-lg bg-[#FFF3E8] px-2.5 py-1 text-[11px] font-semibold text-[#804226]">
                {store.selectedItems.length} items
              </span>
            </div>
            {grouped.map((g) => {
              const open = openCats[g.category] ?? false;
              return (
                <div key={g.category} className="border-b border-[#F0EBE3] last:border-0">
                  <button
                    type="button"
                    onClick={() => toggleCat(g.category)}
                    className="flex w-full items-center justify-between py-2.5 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-semibold text-[#1E1E1E]">{g.category}</span>
                      <span className="rounded bg-[#FFFAF5] px-2 py-0.5 text-[11px] text-[#8B7355]">
                        {g.items.length} items
                      </span>
                    </div>
                    <ChevronDown
                      className={
                        "h-4 w-4 text-[#8B7355] transition-transform " + (open ? "rotate-180" : "")
                      }
                    />
                  </button>
                  {open ? (
                    <div className="flex flex-wrap gap-1.5 pb-3 pt-1">
                      {g.items.map((it) => (
                        <span
                          key={it.key}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8D5B7] bg-[#FFFAF5] px-2.5 py-1 text-[11px]"
                        >
                          <span
                            className={
                              "h-2 w-2 rounded-full " + (it.isVeg ? "bg-green-600" : "bg-red-600")
                            }
                          />
                          {it.name}
                          {it.isAddOn ? (
                            <span className="text-[10px] text-[#D4A017]">
                              (+₹{it.isVeg ? 30 : 45}/person)
                            </span>
                          ) : null}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          <div className="mb-4 rounded-2xl border border-[#E8D5B7] bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-[#1E1E1E]">Your Details</h3>
              <button
                type="button"
                onClick={() => router.push("/book/details")}
                className="text-[12px] font-semibold text-[#DE903E]"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[12px]">
              <div>
                <span className="text-[#8B7355]">Name</span>
                <p className="font-semibold text-[#1E1E1E]">{store.customerName}</p>
              </div>
              <div>
                <span className="text-[#8B7355]">Phone</span>
                <p className="font-semibold text-[#1E1E1E]">+91 {store.customerPhone}</p>
              </div>
              <div>
                <span className="text-[#8B7355]">Email</span>
                <p className="font-semibold text-[#1E1E1E]">{store.customerEmail}</p>
              </div>
              <div>
                <span className="text-[#8B7355]">WhatsApp</span>
                <p className="font-semibold text-[#1E1E1E]">+91 {store.customerWhatsapp}</p>
              </div>
              <div className="col-span-2">
                <span className="text-[#8B7355]">Special Note</span>
                <p className="italic text-[#8B7355]">{store.specialNote || "—"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E8D5B7] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Tag className="h-4 w-4 text-[#DE903E]" />
              <h3 className="text-[14px] font-bold text-[#1E1E1E]">Apply Coupon</h3>
            </div>
            {!store.couponCode ? (
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter coupon code"
                  className="h-10 flex-1 rounded-xl border-2 border-[#E8D5B7] bg-[#FFFAF5] px-4 text-[13px] uppercase outline-none focus:border-[#804226]"
                />
                <button
                  type="button"
                  onClick={applyCoupon}
                  className="h-10 rounded-xl bg-[#1E1E1E] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#804226]"
                >
                  Apply
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-[12px] font-semibold text-green-800">{store.couponCode} applied!</p>
                    <p className="text-[11px] text-green-600">₹{store.couponDiscount} discount</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearCoupon}
                  className="flex h-6 w-6 items-center justify-center rounded-full border border-green-200 bg-white"
                >
                  <X className="h-3 w-3 text-green-600" />
                </button>
              </div>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl border border-[#E8D5B7] bg-white p-5">
            <h3 className="mb-4 text-[16px] font-bold text-[#1E1E1E]">Bill Summary</h3>
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between">
                <div>
                  <span className="text-[12px] text-[#8B7355]">Base Amount</span>
                  <p className="text-[10px] text-[#8B7355]">
                    {store.guestCount} guests × ₹{store.pricePerPlate}/plate
                  </p>
                </div>
                <span className="text-[12px] font-semibold text-[#1E1E1E]">
                  ₹{bill.baseAmount.toLocaleString("en-IN")}
                </span>
              </div>
              {bill.addOnTotal > 0 ? (
                <div className="flex justify-between">
                  <span className="text-[12px] text-[#8B7355]">Add-on Items</span>
                  <span className="text-[12px] font-semibold text-[#D4A017]">
                    ₹{bill.addOnTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span className="text-[12px] text-[#8B7355]">Water Arrangement</span>
                <span className="text-[12px] font-semibold text-green-600">Included</span>
              </div>
              {store.couponDiscount > 0 ? (
                <div className="flex justify-between">
                  <span className="text-[12px] text-[#8B7355]">Coupon ({store.couponCode})</span>
                  <span className="text-[12px] font-semibold text-green-600">
                    -₹{store.couponDiscount.toLocaleString("en-IN")}
                  </span>
                </div>
              ) : null}
              <div className="my-1 h-px bg-[#E8D5B7]" />
              <div className="flex justify-between">
                <span className="text-[12px] text-[#8B7355]">Subtotal</span>
                <span className="text-[12px] font-bold">₹{bill.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-[#8B7355]">GST (18%)</span>
                <span className="text-[12px] text-[#8B7355]">₹{bill.gstAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[12px] text-[#8B7355]">Convenience Fee (2%)</span>
                <span className="text-[12px] text-[#8B7355]">₹{bill.convenienceFee.toLocaleString("en-IN")}</span>
              </div>
              <div className="my-2 h-px bg-[#1E1E1E]" />
              <div className="flex justify-between">
                <span className="text-[15px] font-extrabold text-[#804226]">Total Amount</span>
                <span className="text-[22px] font-extrabold text-[#804226]">
                  ₹{bill.grandTotal.toLocaleString("en-IN")}
                </span>
              </div>
              <p className="mt-2 text-[10px] italic text-[#8B7355]">*No payment now. Pay after confirmation.</p>
            </div>
            <button
              type="button"
              disabled={confirming}
              onClick={() => void confirm()}
              className={
                "mt-4 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl text-[15px] font-bold text-white transition-all active:scale-[0.98] " +
                (confirming ? "cursor-wait bg-[#E8D5B7]" : "bg-[#DE903E] hover:bg-[#804226]")
              }
            >
              {confirming ? (
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <ShieldCheck className="h-[18px] w-[18px]" />
              )}
              {confirming ? "Placing request..." : "Confirm Booking Request"}
            </button>
            <div className="mt-4 flex justify-around">
              <div className="flex flex-col items-center gap-0.5">
                <ShieldCheck className="h-3 w-3 text-green-600" />
                <span className="text-[10px] text-[#8B7355]">Secure</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Lock className="h-3 w-3 text-[#804226]" />
                <span className="text-[10px] text-[#8B7355]">No Payment Now</span>
              </div>
              <div className="flex flex-col items-center gap-0.5">
                <Clock className="h-3 w-3 text-[#DE903E]" />
                <span className="text-[10px] text-[#8B7355]">2hr Slot Hold</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
