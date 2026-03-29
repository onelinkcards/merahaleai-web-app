"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Calendar, Check, ChevronDown, MapPin, MessageSquare, User } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { getVendorDetailBySlug } from "@/data/vendors";
import { bookFormSchema, type BookFormValues } from "@/lib/bookFormSchema";
import { calculateBill } from "@/lib/calculateBill";

const EVENT_TYPES = [
  "Wedding",
  "Birthday Party",
  "Anniversary",
  "Corporate Event",
  "Baby Shower",
  "Satsang / Pooja",
  "Get-Together",
  "Retirement Party",
  "Engagement",
  "Farewell Party",
  "Funeral Bhoj",
];

const TIME_OPTIONS = [
  "7:00 AM",
  "10:00 AM",
  "12:00 PM",
  "1:00 PM",
  "4:00 PM",
  "7:00 PM",
  "9:00 PM",
  "10:00 PM",
];

function tomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function BookingProgressDetails() {
  const steps = [
    { n: 1, label: "Customize", done: true },
    { n: 2, label: "Details", active: true },
    { n: 3, label: "Review", active: false },
    { n: 4, label: "Done", active: false },
  ];
  return (
    <div className="flex items-center justify-center overflow-x-auto px-2 py-3">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center px-1">
            <div
              className={
                "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold " +
                (s.done
                  ? "bg-[#804226] text-white"
                  : s.active
                    ? "bg-[#DE903E] text-white"
                    : "bg-[#F0EBE3] text-[#8B7355]")
              }
            >
              {s.done ? <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} /> : s.n}
            </div>
            <span
              className={
                "mt-1 whitespace-nowrap text-[9px] font-semibold " +
                (s.active ? "text-[#DE903E]" : s.done ? "text-[#804226]" : "text-[#8B7355]")
              }
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 ? <div className="mx-0.5 h-px w-4 flex-shrink-0 bg-[#E8D5B7] sm:w-6" /> : null}
        </div>
      ))}
    </div>
  );
}

export default function BookDetailsPage() {
  const router = useRouter();
  const store = useBookingStore();
  const setMany = useBookingStore((s) => s.setMany);

  const [eventOpen, setEventOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const vendorSlug = store.vendorSlug;
  const vendorName = store.vendorName;
  const selectedPackage = store.selectedPackage;
  const pricePerPlate = store.pricePerPlate;
  const guestCountStore = store.guestCount;
  const otpPhone = store.otpPhone;

  useEffect(() => {
    if (!vendorSlug) router.replace("/caterers");
  }, [vendorSlug, router]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema) as Resolver<BookFormValues>,
    defaultValues: {
      guestCount: store.guestCount >= 25 ? store.guestCount : 100,
      customerName: store.customerName || "",
      customerPhone: store.customerPhone || otpPhone || "",
      customerEmail: store.customerEmail || "",
      customerWhatsapp: store.customerWhatsapp || "",
      whatsappSameAsPhone: true,
      whatsappOptIn: store.whatsappOptIn,
      eventType: store.eventType || "",
      eventDate: store.eventDate || tomorrowStr(),
      eventTime: store.eventTime || "7:00 PM",
      venueName: store.venueName || "",
      venueAddress: store.venueAddress || "",
      venueCity: store.venueCity || "Jaipur",
      venuePincode: store.venuePincode || "",
      venueState: store.venueState || "Rajasthan",
      specialNote: store.specialNote || "",
    },
  });

  const watchWhatsappSame = useWatch({ control, name: "whatsappSameAsPhone" });
  const watchPhone = useWatch({ control, name: "customerPhone" });
  const watchEventType = useWatch({ control, name: "eventType" });
  const watchSpecialNote = useWatch({ control, name: "specialNote" });
  const watchGuestCount = useWatch({ control, name: "guestCount" });

  useEffect(() => {
    if (guestCountStore >= 25) setValue("guestCount", guestCountStore);
  }, [guestCountStore, setValue]);

  useEffect(() => {
    if (watchWhatsappSame && watchPhone) {
      setValue("customerWhatsapp", watchPhone);
    }
  }, [watchWhatsappSame, watchPhone, setValue]);

  const effectiveGuests =
    typeof watchGuestCount === "number" && !Number.isNaN(watchGuestCount) && watchGuestCount >= 25
      ? watchGuestCount
      : guestCountStore >= 25
        ? guestCountStore
        : 100;

  const liveBill = useMemo(() => {
    return calculateBill({
      vendorSlug,
      selectedPackage,
      pricePerPlate,
      guestCount: effectiveGuests,
      selectedItems: store.selectedItems,
      addOnItems: store.addOnItems,
      couponDiscount: store.couponDiscount,
    });
  }, [
    vendorSlug,
    selectedPackage,
    pricePerPlate,
    effectiveGuests,
    store.selectedItems,
    store.addOnItems,
    store.couponDiscount,
  ]);

  const onSubmit = (data: BookFormValues) => {
    setSubmitted(true);
    const wa = data.whatsappSameAsPhone ? data.customerPhone : data.customerWhatsapp ?? data.customerPhone;
    setMany({
      guestCount: data.guestCount,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      customerWhatsapp: wa,
      whatsappOptIn: data.whatsappOptIn,
      eventType: data.eventType,
      guestSlab: data.guestCount + " guests",
      eventDate: data.eventDate,
      eventTime: data.eventTime,
      venueName: data.venueName ?? "",
      venueAddress: data.venueAddress,
      venueCity: data.venueCity,
      venuePincode: data.venuePincode,
      venueState: data.venueState,
      specialNote: data.specialNote ?? "",
    });
    router.push("/book/review");
  };

  const fieldClass =
    "w-full h-12 bg-[#FFFAF5] border-2 border-[#E8D5B7] rounded-xl px-4 text-[14px] text-[#1E1E1E] font-medium outline-none transition-all focus:border-[#804226] focus:bg-white placeholder:text-[#8B7355]";
  const fieldError = (name: keyof BookFormValues) =>
    submitted && errors[name] ? "border-red-500 focus:border-red-500" : "";

  const vendorData = vendorSlug ? getVendorDetailBySlug(vendorSlug) : undefined;
  const thumb = vendorData?.images[0] ?? "";

  if (!vendorSlug) return null;

  return (
    <div className="min-h-screen bg-[#FFFAF5] pb-36">
      <div className="sticky top-0 z-50 border-b border-[#E8D5B7] bg-white">
        <BookingProgressDetails />
      </div>

      <div className="mx-auto max-w-2xl px-5 py-6">
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#E8D5B7] bg-[#FFF3E8] px-4 py-3">
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-[#E8D5B7]">
            {thumb ? (
              <Image src={thumb} alt="" width={48} height={48} className="h-12 w-12 object-cover" />
            ) : null}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-[14px] font-bold text-[#804226]">{vendorName}</p>
            <p className="text-[12px] text-[#8B7355]">
              {selectedPackage} package · {effectiveGuests} guests · ₹{pricePerPlate}/plate
            </p>
            <p className="text-[11px] text-[#8B7355]">Add your event, venue &amp; contact below</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/book/customize")}
            className="flex-shrink-0 cursor-pointer text-[12px] font-semibold text-[#DE903E]"
          >
            Edit
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit, () => setSubmitted(true))}
          className="space-y-4"
        >
          <section className="rounded-2xl border border-[#E8D5B7] bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-[#DE903E]" />
              <h2 className="text-[16px] font-bold text-[#1E1E1E]">Your Details</h2>
              {store.customerPhone || otpPhone ? (
                <span className="rounded-md bg-green-100 px-2 py-0.5 text-[9px] font-bold text-green-700">
                  Auto-filled from your account
                </span>
              ) : null}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#804226]">Full Name *</label>
                <input
                  {...register("customerName")}
                  placeholder="Priya Sharma"
                  className={fieldClass + " " + fieldError("customerName")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#804226]">Phone Number *</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[13px] text-[#8B7355]">
                    +91
                  </span>
                  <input
                    {...register("customerPhone")}
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    className={fieldClass + " pl-12 " + fieldError("customerPhone")}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-[12px] font-semibold text-[#804226]">Email Address *</label>
              <input
                {...register("customerEmail")}
                type="email"
                placeholder="priya@example.com"
                className={fieldClass + " " + fieldError("customerEmail")}
              />
            </div>
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="text-[12px] font-semibold text-[#804226]">WhatsApp Number</label>
                <label className="flex cursor-pointer items-center gap-2 text-[11px] text-[#8B7355]">
                  <input type="checkbox" {...register("whatsappSameAsPhone")} className="rounded border-[#E8D5B7]" />
                  Same as phone
                </label>
              </div>
              <input
                {...register("customerWhatsapp")}
                type="tel"
                disabled={watchWhatsappSame}
                placeholder="Same as phone"
                className={fieldClass + (watchWhatsappSame ? " opacity-60" : "")}
              />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <input
                type="checkbox"
                {...register("whatsappOptIn")}
                className="h-4 w-4 rounded border-[#E8D5B7] accent-[#00B050]"
              />
              <span className="text-[12px] font-medium text-[#1E1E1E]">
                Send booking updates &amp; invoice on WhatsApp
              </span>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E8D5B7] bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#DE903E]" />
              <h2 className="text-[16px] font-bold text-[#1E1E1E]">Event Details</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="relative md:col-span-2">
                <label className="mb-1.5 block text-[12px] font-semibold text-[#804226]">Event Type *</label>
                <button
                  type="button"
                  onClick={() => setEventOpen(!eventOpen)}
                  className={
                    "flex h-12 w-full items-center justify-between rounded-xl border-2 border-[#E8D5B7] bg-[#FFFAF5] px-4 text-left text-[14px] font-medium text-[#1E1E1E] " +
                    (submitted && errors.eventType ? "border-red-500" : "")
                  }
                >
                  <span>{watchEventType || "Select"}</span>
                  <ChevronDown className="h-4 w-4 text-[#8B7355]" />
                </button>
                <input type="hidden" {...register("eventType")} />
                {eventOpen ? (
                  <div className="absolute left-0 right-0 z-20 mt-1 max-h-[240px] overflow-y-auto rounded-xl border border-[#E8D5B7] bg-white shadow-lg scrollbar-hide">
                    {EVENT_TYPES.map((ev) => (
                      <button
                        key={ev}
                        type="button"
                        className="w-full cursor-pointer px-4 py-2.5 text-left text-[13px] text-[#1E1E1E] hover:bg-[#FFF3E8]"
                        onClick={() => {
                          setValue("eventType", ev);
                          setEventOpen(false);
                        }}
                      >
                        {ev}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-[12px] font-semibold text-[#804226]">Guest count</label>
                <input
                  type="number"
                  min={25}
                  max={2000}
                  step={25}
                  {...register("guestCount", { valueAsNumber: true })}
                  className={fieldClass + " " + fieldError("guestCount")}
                />
                {submitted && errors.guestCount ? (
                  <p className="mt-1 text-[11px] text-red-500">{errors.guestCount.message}</p>
                ) : null}
                <p className="mt-1 text-[10px] text-[#8B7355]">Pre-filled from customize step; you can change it here.</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#804226]">Event Date *</label>
                <input
                  {...register("eventDate")}
                  type="date"
                  min={tomorrowStr()}
                  className={fieldClass + " " + fieldError("eventDate")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#804226]">Event Time *</label>
                <select
                  {...register("eventTime")}
                  className={fieldClass + " " + fieldError("eventTime")}
                >
                  {TIME_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E8D5B7] bg-white p-5">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#DE903E]" />
              <h2 className="text-[16px] font-bold text-[#1E1E1E]">Venue Details</h2>
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block text-[12px] font-semibold text-[#804226]">Venue / Hall Name</label>
              <input
                {...register("venueName")}
                placeholder="XYZ Palace, Hotel Raj Mahal, Home, etc."
                className={fieldClass}
              />
            </div>
            <div className="mb-4">
              <label className="mb-1.5 block text-[12px] font-semibold text-[#804226]">Complete Venue Address *</label>
              <textarea
                {...register("venueAddress")}
                rows={3}
                placeholder="Street, Area, Landmark..."
                className={
                  "w-full resize-none rounded-xl border-2 border-[#E8D5B7] bg-[#FFFAF5] px-4 py-3 text-[14px] text-[#1E1E1E] outline-none transition-all focus:border-[#804226] focus:bg-white placeholder:text-[#8B7355] " +
                  fieldError("venueAddress")
                }
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#804226]">City *</label>
                <input {...register("venueCity")} placeholder="Jaipur" className={fieldClass + " " + fieldError("venueCity")} />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#804226]">Pincode *</label>
                <input
                  {...register("venuePincode")}
                  maxLength={6}
                  placeholder="302021"
                  className={fieldClass + " " + fieldError("venuePincode")}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#804226]">State</label>
                <input {...register("venueState")} placeholder="Rajasthan" className={fieldClass} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E8D5B7] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-[#DE903E]" />
              <h2 className="text-[16px] font-bold text-[#1E1E1E]">Special Requests</h2>
            </div>
            <textarea
              {...register("specialNote")}
              rows={3}
              maxLength={300}
              placeholder="Allergy info, live counter requests, setup preferences, dietary restrictions..."
              className="w-full resize-none rounded-xl border-2 border-[#E8D5B7] bg-[#FFFAF5] px-4 py-3 text-[14px] text-[#1E1E1E] outline-none transition-all focus:border-[#804226] focus:bg-white placeholder:text-[#8B7355]"
            />
            <p className="mt-1 text-right text-[10px] text-[#8B7355]">
              {(watchSpecialNote || "").length}/300 characters
            </p>
          </section>

          <div className="h-24" />

          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#E8D5B7] bg-white px-5 py-4 shadow-lg">
            <div className="mx-auto flex max-w-2xl items-center gap-4">
              <div>
                <p className="text-[11px] font-medium text-[#8B7355]">Estimated Total</p>
                <p className="text-[24px] font-extrabold text-[#804226]">
                  ₹{liveBill.grandTotal.toLocaleString("en-IN")}
                </p>
                <p className="text-[10px] text-[#8B7355]">incl. GST</p>
              </div>
              <button
                type="submit"
                onClick={() => setSubmitted(true)}
                className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-2xl bg-[#DE903E] text-[15px] font-bold text-white transition-all hover:bg-[#804226] active:scale-[0.98]"
              >
                Review Order
                <ArrowRight className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
