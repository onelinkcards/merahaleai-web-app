import type { BookingStore } from "@/store/bookingStore";
import { getVendorDetailBySlug } from "@/data/vendors";
import { getDefaultMenuKeys } from "@/lib/bookingMenuHelpers";

export type BillBreakdown = {
  baseAmount: number;
  addOnMenuTotal: number;
  addOnExtrasTotal: number;
  addOnTotal: number;
  preTax: number;
  couponDiscount: number;
  subtotal: number;
  gstAmount: number;
  convenienceFee: number;
  grandTotal: number;
};

function menuAddOnTotal(
  slug: string,
  packageId: string,
  selectedKeys: string[],
  guestCount: number
): number {
  const v = getVendorDetailBySlug(slug);
  if (!v || !("autoAddonPricing" in v) || !v.autoAddonPricing) return 0;
  const vegRate = v.autoAddonPricing.vegPerItemPerPax;
  const nonVegRate = v.autoAddonPricing.nonVegPerItemPerPax;
  const defaultSet = new Set(getDefaultMenuKeys(slug, packageId));
  const pkg = v.packages.find((p) => p.id === packageId);
  if (!pkg) return 0;

  const itemVeg = (key: string): boolean => {
    const parts = key.split("::");
    const catName = parts[0];
    const itemName = parts.slice(1).join("::");
    for (const cat of pkg.categories) {
      if (cat.name !== catName) continue;
      const found = cat.items.find((i) => i.name === itemName);
      if (found) return found.isVeg;
    }
    return true;
  };

  let total = 0;
  for (const key of selectedKeys) {
    if (defaultSet.has(key)) continue;
    total += (itemVeg(key) ? vegRate : nonVegRate) * guestCount;
  }
  return Math.round(total);
}

function extrasAddOnTotal(slug: string, addOnNames: string[], guestCount: number): number {
  const v = getVendorDetailBySlug(slug);
  const addons = v && "addons" in v ? v.addons : undefined;
  if (!addons?.length || !addOnNames.length) return 0;
  let total = 0;
  for (const name of addOnNames) {
    const a = addons.find((x) => x.name === name);
    if (a) total += a.pricePerPax * guestCount;
  }
  return Math.round(total);
}

export function calculateBill(state: Partial<BookingStore>): BillBreakdown {
  const guestCount = Math.max(0, state.guestCount ?? 0);
  const pricePerPlate = state.pricePerPlate ?? 0;
  const baseAmount = Math.round(guestCount * pricePerPlate);

  const slug = state.vendorSlug ?? "";
  const packageId = state.selectedPackage ?? "silver";
  const selected = state.selectedItems ?? [];
  const addOnMenuTotal = slug
    ? menuAddOnTotal(slug, packageId, selected, guestCount)
    : 0;
  const addOnExtrasTotal = slug ? extrasAddOnTotal(slug, state.addOnItems ?? [], guestCount) : 0;
  const addOnTotal = addOnMenuTotal + addOnExtrasTotal;

  const couponDiscount = Math.max(0, state.couponDiscount ?? 0);

  const preTax = Math.max(0, baseAmount + addOnTotal - couponDiscount);
  const gstAmount = Math.round(preTax * 0.18);
  const convenienceFee = Math.round(preTax * 0.02);
  const grandTotal = preTax + gstAmount + convenienceFee;

  return {
    baseAmount,
    addOnMenuTotal,
    addOnExtrasTotal,
    addOnTotal,
    preTax,
    couponDiscount,
    subtotal: preTax,
    gstAmount,
    convenienceFee,
    grandTotal,
  };
}
