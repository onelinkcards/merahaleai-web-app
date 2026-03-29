"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useBookingStore } from "@/store/bookingStore";
import { setAuthCookie } from "@/lib/authCookie";
import { useToastStore } from "@/store/toastStore";

function OtpInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/book/customize";

  const otpPhone = useBookingStore((s) => s.otpPhone);
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [demoOtp, setDemoOtp] = useState("");
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDemoOtp(sessionStorage.getItem("mh_pending_otp") ?? "");
  }, []);

  useEffect(() => {
    if (timer <= 0) return;
    const t = window.setInterval(() => setTimer((x) => x - 1), 1000);
    return () => window.clearInterval(t);
  }, [timer]);

  const filled = digits.every((d) => d.length === 1);

  const verify = useCallback(() => {
    if (!digits.every((d) => d.length === 1)) return;
    const expected =
      typeof window !== "undefined" ? sessionStorage.getItem("mh_pending_otp") : null;
    const entered = digits.join("");
    if (!expected || entered !== expected) {
      useToastStore.getState().show("Invalid OTP. Try again.");
      return;
    }
    sessionStorage.removeItem("mh_pending_otp");
    setAuthCookie();
    useToastStore.getState().show("Logged in successfully.");
    router.replace(redirect);
  }, [digits, router, redirect]);

  const onChange = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = ch;
      return next;
    });
    if (ch && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputsRef.current[i - 1]?.focus();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFFAF5] px-5 pt-8 pb-16">
      <div className="w-full max-w-[400px] rounded-2xl border border-[#E8D5B7] bg-white p-8 shadow-sm">
        <button
          type="button"
          onClick={() => router.push("/login?redirect=" + encodeURIComponent(redirect))}
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF3E8] text-[#804226]"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h1 className="text-center text-[20px] font-bold text-[#1E1E1E]">Verify OTP</h1>
        <p className="mt-1 text-center text-[12px] text-[#8B7355]">
          Sent to +91 {otpPhone || "9876543210"}
        </p>

        {demoOtp ? (
          <p className="mx-auto mt-4 max-w-sm rounded-xl border border-[#E8D5B7] bg-[#FFF3E8] px-4 py-3 text-center text-[12px] text-[#804226]">
            <span className="font-semibold">Demo OTP:</span>{" "}
            <span className="font-mono font-bold tracking-widest">{demoOtp}</span>
            <span className="mt-1 block text-[10px] font-normal text-[#8B7355]">
              Replace with SMS delivery before production.
            </span>
          </p>
        ) : null}

        <div className="mt-8 flex justify-center gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => onChange(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              className={
                "h-14 w-12 rounded-xl border-2 text-center text-[20px] font-bold text-[#804226] outline-none transition-colors " +
                (filled
                  ? "border-[#804226] bg-white"
                  : "border-[#E8D5B7] bg-[#FFFAF5] focus:border-[#DE903E] focus:bg-white")
              }
            />
          ))}
        </div>

        <button
          type="button"
          disabled={!filled}
          onClick={verify}
          className={
            "mt-6 h-12 w-full rounded-xl text-[14px] font-bold text-white transition-colors " +
            (filled ? "bg-[#DE903E] hover:bg-[#804226]" : "cursor-not-allowed bg-[#E8D5B7]")
          }
        >
          Verify OTP
        </button>

        <div className="mt-4 text-center text-[12px]">
          {timer > 0 ? (
            <span className="text-[#8B7355]">
              Resend OTP in 0:{timer < 10 ? "0" : ""}
              {timer}
            </span>
          ) : (
            <button
              type="button"
              onClick={() => {
                const code = String(Math.floor(100000 + Math.random() * 900000));
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("mh_pending_otp", code);
                  setDemoOtp(code);
                }
                setDigits(["", "", "", "", "", ""]);
                setTimer(60);
              }}
              className="cursor-pointer font-semibold text-[#DE903E]"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OtpPage() {
  return (
    <Suspense>
      <OtpInner />
    </Suspense>
  );
}
