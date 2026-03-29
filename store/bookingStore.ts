import { create } from "zustand";

export type PackageTier = "bronze" | "silver" | "gold";
export type OrderStatus = "pending" | "confirmed" | "paid" | "completed" | "cancelled";
export type WaterType = "ro" | "packaged" | "none";

export interface BookingStore {
  vendorSlug: string;
  vendorName: string;
  vendorPhone: string;
  vendorImage: string;

  selectedPackage: PackageTier | null;
  pricePerPlate: number;

  selectedItems: string[];
  addOnItems: string[];

  guestCount: number;
  guestSlab: string;

  eventType: string;
  eventDate: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  venueCity: string;
  venuePincode: string;
  venueState: string;
  specialNote: string;

  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerWhatsapp: string;
  whatsappOptIn: boolean;

  waterType: WaterType;

  couponCode: string;
  couponDiscount: number;

  orderId: string;
  orderStatus: OrderStatus;
  bookingTimestamp: string;

  baseTotal: number;
  addOnTotal: number;
  gstAmount: number;
  convenienceFee: number;
  grandTotal: number;

  otpPhone: string;

  setField: <K extends keyof BookingStore>(key: K, value: BookingStore[K]) => void;
  setMany: (partial: Partial<BookingStore>) => void;
  setBulk: (partial: Partial<BookingStore>) => void;
  reset: () => void;
}

const initial: BookingStore = {
  vendorSlug: "",
  vendorName: "",
  vendorPhone: "",
  vendorImage: "",

  selectedPackage: null,
  pricePerPlate: 0,

  selectedItems: [],
  addOnItems: [],

  guestCount: 0,
  guestSlab: "",

  eventType: "",
  eventDate: "",
  eventTime: "",
  venueName: "",
  venueAddress: "",
  venueCity: "",
  venuePincode: "",
  venueState: "Rajasthan",
  specialNote: "",

  customerName: "",
  customerPhone: "",
  customerEmail: "",
  customerWhatsapp: "",
  whatsappOptIn: true,

  waterType: "packaged",

  couponCode: "",
  couponDiscount: 0,

  orderId: "",
  orderStatus: "pending",
  bookingTimestamp: "",

  baseTotal: 0,
  addOnTotal: 0,
  gstAmount: 0,
  convenienceFee: 0,
  grandTotal: 0,

  otpPhone: "",

  setField: () => {},
  setMany: () => {},
  setBulk: () => {},
  reset: () => {},
};

export const useBookingStore = create<BookingStore>((set) => ({
  ...initial,

  setField: (key, value) => set((state) => ({ ...state, [key]: value })),

  setMany: (partial) => set((state) => ({ ...state, ...partial })),

  setBulk: (partial) => set((state) => ({ ...state, ...partial })),

  reset: () => set({ ...initial }),
}));
