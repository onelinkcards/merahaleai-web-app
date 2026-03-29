"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChefHat, ChevronLeft, Loader2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthCookie } from "@/lib/authCookie";
import { useBookingStore } from "@/store/bookingStore";

type Step = "phone" | "otp";

function GoogleMark() {
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

type Props = {
  open: boolean;
  onClose: () => void;
  vendorSlug: string;
  vendorName: string;
  startingFromPerPlate: number;
};

export default function LoginModal({
  open,
  onClose,
  vendorSlug,
  vendorName,
  startingFromPerPlate,
}: Props) {
  const router = useRouter();
  const setMany = useBookingStore((s) => s.setMany);
  const customerName = useBookingStore((s) => s.customerName);
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [verifying, setVerifying] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const autoSubmitRef = useRef<number | null>(null);
  const [pendingOtp, setPendingOtp] = useState("");

  useEffect(() => {
    if (!open) {
      setStep("phone");
      setPhone("");
      setDigits(["", "", "", "", "", ""]);
      setTimer(60);
      setVerifying(false);
      setPendingOtp("");
      if (autoSubmitRef.current != null) window.clearTimeout(autoSubmitRef.current);
    }
  }, [open]);

  useEffect(() => {
    if (step !== "otp" || timer <= 0) return;
    const t = window.setInterval(() => setTimer((x) => x - 1), 1000);
    return () => window.clearInterval(t);
  }, [step, timer]);

  const sendOtp = useCallback(() => {
    if (phone.length < 10) return;
    setPendingOtp(String(Math.floor(100000 + Math.random() * 900000)));
    setMany({ otpPhone: phone });
    setStep("otp");
    setTimer(60);
  }, [phone, setMany]);

  const filled = digits.every((d) => d.length === 1);

  const runVerify = useCallback(() => {
    if (!digits.every((d) => d.length === 1)) return;
    const entered = digits.join("");
    if (!pendingOtp || entered !== pendingOtp) {
      return;
    }
    setVerifying(true);
    setAuthCookie();
    setMany({
      customerPhone: phone,
      customerWhatsapp: phone,
      customerName: customerName || "Guest",
    });
    window.setTimeout(() => {
      setVerifying(false);
      onClose();
      const q = encodeURIComponent(vendorSlug);
      router.push("/book/customize?vendor=" + q);
    }, 400);
  }, [digits, pendingOtp, phone, customerName, onClose, router, setMany, vendorSlug]);

  useEffect(() => {
    if (step !== "otp" || !filled) return;
    if (autoSubmitRef.current != null) window.clearTimeout(autoSubmitRef.current);
    autoSubmitRef.current = window.setTimeout(() => {
      runVerify();
    }, 500);
    return () => {
      if (autoSubmitRef.current != null) window.clearTimeout(autoSubmitRef.current);
    };
  }, [step, filled, runVerify]);

  const onChangeDigit = (i: number, v: string) => {
    const ch = v.replace(/\D/g, "").slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[i] = ch;
      return next;
    });
    if (ch && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const onKeyDownDigit = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) inputsRef.current[i - 1]?.focus();
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="login-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center"
        >
          <button
            type="button"
            aria-label="Close backdrop"
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={step === "phone" && !verifying ? onClose : undefined}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            className="relative z-[61] max-h-[92vh] w-full overflow-y-auto rounded-t-[28px] bg-white sm:max-h-[90vh] sm:max-w-md sm:rounded-[28px]"
          >
            <div className="mx-auto mb-0 mt-4 h-1 w-10 rounded-full bg-[#E8D5B7] sm:hidden" />

            {step === "phone" ? (
              <>
                <div className="flex items-start justify-between px-6 pb-4 pt-5">
                  <div>
                    <h2 className="text-[20px] font-bold text-[#1E1E1E]">Login to Continue</h2>
                    <p className="mt-1 text-[12px] text-[#8B7355]">One step away from booking!</p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F5F5F5] text-[#8B7355]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="mx-6 mb-5 flex items-center gap-3 rounded-2xl border border-[#E8D5B7] bg-[#FFF3E8] px-4 py-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[#DE903E]">
                    <ChefHat className="h-5 w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium uppercase tracking-wide text-[#8B7355]">Booking for</p>
                    <p className="truncate text-[14px] font-bold text-[#804226]">{vendorName}</p>
                    <p className="text-[11px] text-[#8B7355]">
                      Starting from ₹{startingFromPerPlate}/plate · Pick package &amp; menu next
                    </p>
                  </div>
                </div>

                <div className="px-6">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    title="Google sign-in is not available yet"
                    className="flex h-12 w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border-2 border-[#E8D5B7] bg-[#F8F6F3] opacity-70"
                  >
                    <GoogleMark />
                    <span className="text-[14px] font-semibold text-[#8B7355]">Continue with Google</span>
                  </button>
                  <p className="mt-2 text-center text-[11px] text-[#8B7355]">
                    Use mobile OTP to sign in. Google is coming soon.
                  </p>
                </div>

                <div className="mx-6 my-5 flex items-center gap-3">
                  <div className="h-px flex-1 bg-[#E8D5B7]" />
                  <span className="px-2 text-[11px] text-[#8B7355]">or</span>
                  <div className="h-px flex-1 bg-[#E8D5B7]" />
                </div>

                <div className="px-6">
                  <label className="mb-2 block text-[12px] font-semibold text-[#804226]">Mobile Number</label>
                  <div className="flex gap-2">
                    <span className="flex h-12 w-14 flex-shrink-0 items-center justify-center rounded-xl border-2 border-[#E8D5B7] bg-[#FFF3E8] text-[13px] font-bold text-[#804226]">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      placeholder="98765 43210"
                      className="h-12 flex-1 rounded-xl border-2 border-[#E8D5B7] bg-[#FFFAF5] px-4 text-[15px] font-semibold text-[#1E1E1E] outline-none focus:border-[#804226] focus:bg-white"
                    />
                  </div>
                </div>

                <div className="px-6 pb-8 pt-4">
                  <button
                    type="button"
                    disabled={phone.length < 10}
                    onClick={sendOtp}
                    className={
                      "flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-bold text-white " +
                      (phone.length >= 10 ? "bg-[#DE903E] hover:bg-[#804226]" : "cursor-not-allowed bg-[#E8D5B7]")
                    }
                  >
                    Send OTP
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-6 pt-5">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep("phone");
                        setPendingOtp("");
                        setDigits(["", "", "", "", "", ""]);
                      }}
                      className="flex h-9 w-9 cursor-pointer items-center justify-center text-[#804226]"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <h2 className="text-[20px] font-bold text-[#1E1E1E]">Verify OTP</h2>
                      <p className="mt-2 text-[12px] text-[#8B7355]">Sent to +91 {phone}</p>
                    </div>
                  </div>
                </div>

                {pendingOtp ? (
                  <p className="mx-6 mt-4 rounded-xl border border-[#E8D5B7] bg-[#FFF3E8] px-4 py-3 text-center text-[12px] text-[#804226]">
                    <span className="font-semibold">Demo OTP:</span>{" "}
                    <span className="font-mono font-bold tracking-widest">{pendingOtp}</span>
                    <span className="mt-1 block text-[10px] font-normal text-[#8B7355]">
                      Replace with SMS delivery before production.
                    </span>
                  </p>
                ) : null}

                <div className="mt-8 flex justify-center gap-2.5 px-6">
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
                      onChange={(e) => onChangeDigit(i, e.target.value)}
                      onKeyDown={(e) => onKeyDownDigit(i, e)}
                      className={
                        "h-14 w-12 rounded-xl border-2 bg-[#FFFAF5] text-center text-[20px] font-extrabold text-[#804226] outline-none focus:border-[#DE903E] focus:bg-white " +
                        (filled ? "border-[#804226]" : "border-[#E8D5B7]")
                      }
                    />
                  ))}
                </div>

                <p className="mt-5 text-center text-[12px] text-[#8B7355]">
                  {timer > 0 ? (
                    <>
                      Resend in 0:{timer < 10 ? "0" : ""}
                      {timer}
                    </>
                  ) : (
                    <button
                      type="button"
                      className="font-semibold text-[#DE903E]"
                      onClick={() => {
                        setPendingOtp(String(Math.floor(100000 + Math.random() * 900000)));
                        setDigits(["", "", "", "", "", ""]);
                        setTimer(60);
                      }}
                    >
                      Resend OTP
                    </button>
                  )}
                </p>

                <div className="mt-5 px-6 pb-8">
                  <button
                    type="button"
                    disabled={!filled || verifying}
                    onClick={runVerify}
                    className={
                      "flex h-12 w-full items-center justify-center gap-2 rounded-xl text-[14px] font-bold text-white " +
                      (filled && !verifying ? "bg-[#DE903E] hover:bg-[#804226]" : "cursor-not-allowed bg-[#E8D5B7]")
                    }
                  >
                    {verifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify & Book
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                <p className="mt-2 px-6 pb-6 text-center text-[10px] text-[#8B7355]">
                  By continuing, you agree to our Terms & Privacy Policy
                </p>
              </>
            )}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
