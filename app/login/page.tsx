"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChefHat } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { useToastStore } from "@/store/toastStore";
import { hasAuthCookie } from "@/lib/authCookie";

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/book/customize";

  const vendorName = useBookingStore((s) => s.vendorName);
  const selectedPackage = useBookingStore((s) => s.selectedPackage);
  const pricePerPlate = useBookingStore((s) => s.pricePerPlate);
  const setField = useBookingStore((s) => s.setField);

  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (hasAuthCookie()) {
      router.replace(redirect);
    }
  }, [router, redirect]);

  const sendOtp = () => {
    if (phone.length < 10) return;
    const code = String(Math.floor(100000 + Math.random() * 900000));
    if (typeof window !== "undefined") {
      sessionStorage.setItem("mh_pending_otp", code);
    }
    setField("otpPhone", phone.replace(/\D/g, "").slice(-10));
    router.push("/login/otp?redirect=" + encodeURIComponent(redirect));
  };

  const googleDemo = () => {
    useToastStore.getState().show("Google sign-in is coming soon.");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFAF5] px-5 pt-8 pb-16">
      <div className="w-full max-w-[400px] rounded-2xl border border-[#E8D5B7] bg-white p-8 shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#DE903E]">
          <ChefHat className="h-6 w-6 text-white" strokeWidth={2} />
        </div>
        <h1 className="text-center text-[22px] font-bold text-[#1E1E1E]">Welcome to Mera Halwai</h1>
        <p className="mt-1 text-center text-[13px] font-normal text-[#8B7355]">Login to complete your booking</p>

        {vendorName ? (
          <div className="mt-4 flex items-center gap-3 rounded-xl border border-[#E8D5B7] bg-[#FFF3E8] px-4 py-3">
            <ChefHat className="h-4 w-4 flex-shrink-0 text-[#DE903E]" />
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-[#8B7355]">Completing booking for</span>
              <span className="text-[13px] font-bold text-[#804226]">
                {vendorName} · {selectedPackage} · ₹{pricePerPlate}/plate
              </span>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={googleDemo}
          className="mt-6 flex h-12 w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-[#E8D5B7] bg-white transition-all hover:border-[#804226] hover:bg-[#FFFAF5]"
        >
          <GoogleIcon />
          <span className="text-[14px] font-semibold text-[#1E1E1E]">Continue with Google</span>
        </button>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#E8D5B7]" />
          <span className="text-[11px] text-[#8B7355]">or</span>
          <div className="h-px flex-1 bg-[#E8D5B7]" />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-[12px] font-semibold text-[#804226]">Mobile Number</label>
          <div className="flex gap-2">
            <div className="flex h-12 w-14 flex-shrink-0 items-center justify-center rounded-xl border-2 border-[#E8D5B7] bg-[#FFF3E8]">
              <span className="text-[13px] font-semibold text-[#804226]">+91</span>
            </div>
            <input
              type="tel"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="98765 43210"
              className="h-12 flex-1 rounded-xl border-2 border-[#E8D5B7] bg-white px-4 text-[14px] font-medium text-[#1E1E1E] outline-none placeholder:text-[#8B7355] focus:border-[#804226]"
            />
          </div>
          <button
            type="button"
            disabled={phone.length < 10}
            onClick={sendOtp}
            className={
              "mt-3 h-12 w-full rounded-xl text-[14px] font-bold text-white transition-colors " +
              (phone.length >= 10
                ? "bg-[#DE903E] hover:bg-[#804226]"
                : "cursor-not-allowed bg-[#E8D5B7]")
            }
          >
            Send OTP
          </button>
        </div>

        <p className="mt-6 text-center text-[11px] text-[#8B7355]">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="font-semibold text-[#DE903E]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-semibold text-[#DE903E]">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  );
}
