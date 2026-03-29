"use client";

import { useCallback, useRef } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle,
  ChefHat,
  Copy,
  Download,
  Printer,
  Star,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/store/bookingStore";
import { getVendorDetailBySlug } from "@/data/vendors";
import { calculateBill } from "@/lib/calculateBill";

export default function InvoiceClient() {
  const router = useRouter();
  const store = useBookingStore();
  const printRef = useRef<HTMLDivElement>(null);

  const vendor = store.vendorSlug ? getVendorDetailBySlug(store.vendorSlug) : null;

  const bill = calculateBill({
    vendorSlug: store.vendorSlug,
    selectedPackage: store.selectedPackage,
    pricePerPlate: store.pricePerPlate,
    guestCount: store.guestCount,
    selectedItems: store.selectedItems,
    addOnItems: store.addOnItems,
    couponDiscount: store.couponDiscount,
  });

  const dateStr = store.bookingTimestamp
    ? new Date(store.bookingTimestamp).toLocaleDateString("en-IN")
    : new Date().toLocaleDateString("en-IN");

  const generatePDF = useCallback(async () => {
    const el = document.getElementById("invoice-print-area");
    if (!el) return;
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");
    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const imgW = pageW - 20;
    const imgH = (canvas.height * imgW) / canvas.width;
    const y = 10;
    if (imgH > pdf.internal.pageSize.getHeight() - 20) {
      pdf.addImage(imgData, "PNG", 10, y, imgW, pdf.internal.pageSize.getHeight() - 20);
    } else {
      pdf.addImage(imgData, "PNG", 10, y, imgW, imgH);
    }
    pdf.save("MH-Invoice-" + store.orderId + "-" + dateStr.replace(/\//g, "-") + ".pdf");
  }, [store.orderId, dateStr]);

  const printPage = () => window.print();

  if (!vendor) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FFFAF5] px-4">
        <p className="text-[#804226]">No booking data. Start from a caterer profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFAF5] print:bg-white">
      <div className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-[#E8D5B7] bg-white px-5 py-3 print:hidden">
        <button type="button" onClick={() => router.back()} className="text-[#804226]">
          <ArrowLeft className="h-[18px] w-[18px]" />
        </button>
        <span className="text-[16px] font-bold text-[#1E1E1E]">Tax Invoice</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={printPage}
            className="flex h-9 items-center gap-1 rounded-xl border-2 border-[#E8D5B7] px-4 text-[12px] font-semibold text-[#1E1E1E]"
          >
            <Printer className="h-[15px] w-[15px]" />
            Print
          </button>
          <button
            type="button"
            onClick={() => void generatePDF()}
            className="flex h-9 items-center gap-1 rounded-xl bg-[#DE903E] px-4 text-[12px] font-bold text-white"
          >
            <Download className="h-[15px] w-[15px]" />
            Download PDF
          </button>
        </div>
      </div>

      <div
        id="invoice-print-area"
        ref={printRef}
        className="mx-4 mb-8 mt-16 max-w-3xl rounded-2xl border border-[#E8D5B7] bg-white p-8 shadow-sm print:mx-0 print:mt-0 print:max-w-none print:rounded-none print:border-0 print:shadow-none lg:mx-auto"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#DE903E]">
                <ChefHat className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-serif text-[18px] font-bold text-[#804226]">Mera Halwai</p>
                <p className="text-[7px] font-bold tracking-widest text-[#DE903E]">PREMIUM CATERING PLATFORM</p>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-[#8B7355]">D-123, Vaishali Nagar, Jaipur 302021</p>
            <p className="text-[11px] text-[#8B7355]">+91 98765 43210 · hello@merahalwai.com</p>
            <p className="text-[10px] text-[#8B7355]">GSTIN: 08AABCU9603R1ZP</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-[20px] font-bold text-[#804226]">TAX INVOICE</p>
            <p className="text-[11px] italic text-[#8B7355]">Original for Recipient</p>
            <div className="mt-2 rounded-lg border border-green-300 bg-green-100 px-3 py-1">
              <span className="text-[12px] font-bold text-green-800">PAID</span>
            </div>
          </div>
        </div>

        <div className="my-5 h-px bg-[#E8D5B7]" />

        <div className="grid grid-cols-3 gap-4 text-[11px]">
          <div>
            <p className="text-[#8B7355]">Invoice No.</p>
            <p className="flex items-center gap-1 font-mono text-[13px] font-bold text-[#804226]">
              MH-INV-{store.orderId}
              <button type="button" onClick={() => void navigator.clipboard.writeText("MH-INV-" + store.orderId)}>
                <Copy className="h-3 w-3 text-[#DE903E]" />
              </button>
            </p>
          </div>
          <div>
            <p className="text-[#8B7355]">Invoice Date</p>
            <p className="font-semibold text-[#1E1E1E]">{dateStr}</p>
          </div>
          <div>
            <p className="text-[#8B7355]">Order ID</p>
            <p className="font-mono font-semibold text-[#804226]">ORD-{store.orderId}</p>
          </div>
        </div>

        <div className="my-5 h-px bg-[#E8D5B7]" />

        <div className="grid grid-cols-2 gap-8 text-[11px]">
          <div>
            <p className="mb-3 text-[10px] font-bold tracking-widest text-[#804226]">BILLED TO</p>
            <p className="text-[14px] font-semibold text-[#1E1E1E]">{store.customerName}</p>
            <p className="text-[#8B7355]">+91 {store.customerPhone}</p>
            <p className="text-[#8B7355]">{store.customerEmail}</p>
            {store.customerWhatsapp !== store.customerPhone ? (
              <p className="text-[#8B7355]">WhatsApp: +91 {store.customerWhatsapp}</p>
            ) : null}
          </div>
          <div>
            <p className="mb-3 text-[10px] font-bold tracking-widest text-[#804226]">EVENT DETAILS</p>
            <p>Event Type: {store.eventType}</p>
            <p>Date: {store.eventDate}</p>
            <p>Time: {store.eventTime}</p>
            <p>Venue: {store.venueName}</p>
            <p>Guests: {store.guestCount}</p>
            <p>Package: {store.selectedPackage}</p>
          </div>
        </div>

        <div className="my-5 rounded-xl border border-[#E8D5B7] bg-[#FFFAF5] p-4">
          <p className="mb-2 text-[9px] font-bold tracking-widest text-[#804226]">CATERING SERVICES PROVIDED BY</p>
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 overflow-hidden rounded-lg bg-[#E8D5B7]">
              <Image src={vendor.images[0]} alt="" width={56} height={56} className="object-cover" />
            </div>
            <div>
              <p className="text-[14px] font-bold">{vendor.name}</p>
              <div className="mt-0.5 flex items-center gap-1">
                <Star className="h-3 w-3 fill-[#DE903E] text-[#DE903E]" />
                <span className="text-[11px] text-[#8B7355]">
                  {vendor.rating} · {vendor.reviewsCount} reviews
                </span>
              </div>
              <p className="text-[11px] text-[#8B7355]">{vendor.location}</p>
              <p className="text-[10px] text-[#8B7355]">FSSAI: {vendor.fssaiNo}</p>
            </div>
          </div>
        </div>

        <p className="mb-3 text-[10px] font-bold tracking-widest text-[#804226]">ORDERED ITEMS</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="bg-[#FFF3E8]">
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#804226]">Category</th>
                <th className="px-3 py-2.5 text-left text-[10px] font-bold text-[#804226]">Item</th>
                <th className="px-3 py-2.5 text-center text-[10px] font-bold text-[#804226]">Type</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-bold text-[#804226]">Rate</th>
                <th className="px-3 py-2.5 text-right text-[10px] font-bold text-[#804226]">Qty</th>
              </tr>
            </thead>
            <tbody>
              {store.selectedItems.slice(0, 20).map((key, i) => {
                const parts = key.split("::");
                const cat = parts[0];
                const name = parts.slice(1).join("::");
                return (
                  <tr
                    key={key}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#FFFAF5]"}
                  >
                    <td className="border-b border-[#F0EBE3] px-3 py-2 font-semibold text-[#804226]">{cat}</td>
                    <td className="border-b border-[#F0EBE3] px-3 py-2 text-[#1E1E1E]">{name}</td>
                    <td className="border-b border-[#F0EBE3] px-3 py-2 text-center">—</td>
                    <td className="border-b border-[#F0EBE3] px-3 py-2 text-right">₹{store.pricePerPlate}/plate</td>
                    <td className="border-b border-[#F0EBE3] px-3 py-2 text-right">{store.guestCount} serves</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-[#FFF3E8]">
                <td colSpan={4} className="px-3 py-2 font-bold text-[#804226]">
                  Included Items Total
                </td>
                <td className="px-3 py-2 text-right font-bold text-[#804226]">{store.selectedItems.length} items</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-6 max-w-[320px] ml-auto">
          <div className="flex justify-between border-b border-[#F0EBE3] py-1.5 text-[12px]">
            <span>Base ({store.guestCount} × ₹{store.pricePerPlate})</span>
            <span>₹{bill.baseAmount.toLocaleString("en-IN")}</span>
          </div>
          {bill.addOnTotal > 0 ? (
            <div className="flex justify-between border-b border-[#F0EBE3] py-1.5 text-[12px] text-[#D4A017]">
              <span>Add-on Items</span>
              <span>₹{bill.addOnTotal.toLocaleString("en-IN")}</span>
            </div>
          ) : null}
          {store.couponDiscount > 0 ? (
            <div className="flex justify-between border-b border-[#F0EBE3] py-1.5 text-[12px] text-green-600">
              <span>Coupon ({store.couponCode})</span>
              <span>-₹{store.couponDiscount.toLocaleString("en-IN")}</span>
            </div>
          ) : null}
          <div className="flex justify-between border-b border-[#F0EBE3] py-1.5 text-[12px] font-semibold">
            <span>Subtotal</span>
            <span>₹{bill.subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between py-1.5 text-[12px] text-[#8B7355]">
            <span>GST @ 18%</span>
            <span>₹{bill.gstAmount.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between py-1.5 text-[12px] text-[#8B7355]">
            <span>Convenience Fee</span>
            <span>₹{bill.convenienceFee.toLocaleString("en-IN")}</span>
          </div>
          <div className="mt-2 flex justify-between rounded-xl bg-[#804226] px-4 py-3 text-white">
            <span className="text-[14px] font-bold">TOTAL AMOUNT</span>
            <span className="text-[20px] font-extrabold">₹{bill.grandTotal.toLocaleString("en-IN")}</span>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-[22px] w-[22px] fill-green-500 text-green-500" />
            <div>
              <p className="text-[13px] font-bold text-green-800">Payment Received</p>
              <p className="text-[11px] text-green-600">Paid on {dateStr} via UPI</p>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-[#E8D5B7] bg-[#FFFAF5] p-4">
          <p className="mb-2 text-[9px] font-bold tracking-widest text-[#804226]">TERMS &amp; CANCELLATION POLICY</p>
          <p className="text-[10px] leading-relaxed text-[#8B7355]">
            Cancellation 7+ days before event: 50% refund. 3–7 days before: 25% refund. Within 72 hours: No
            refund. Force majeure events will be handled case-by-case.
          </p>
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-[#E8D5B7] pt-4 text-[10px] text-[#8B7355]">
          <div>
            <p>This is a computer-generated invoice.</p>
            <p>For support: support@merahalwai.com · +91 98765 43210</p>
            <p>Platform GSTIN: 08AABCU9603R1ZP</p>
          </div>
          <div className="text-right">
            <p>MeraHalwai.com</p>
            <p>Jaipur, Rajasthan</p>
            <p>Generated: {new Date().toLocaleString("en-IN")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
