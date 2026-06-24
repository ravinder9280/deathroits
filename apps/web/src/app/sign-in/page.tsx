"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { emailOtp, signIn } from "@/lib/auth-client";
import { Button } from "@monorepo/ui/components/button";
import { Input } from "@monorepo/ui/components/input";
import { Label } from "@monorepo/ui/components/label";
import { Spinner } from "@monorepo/ui/components/spinner";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useRef, useState, type ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@monorepo/ui/components/input-otp";
import { toast } from "sonner";
import { z } from "zod";
import GoogleSignIn from "@/lib/google-sign-in";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const emailSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

type EmailFormValues = z.infer<typeof emailSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignInPage(): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/tournaments";

  const [step, setStep] = useState<"email" | "otp">("email");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Step 1: email form ──
  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
  });

  // ── Step 2: OTP form ──
  const otpForm = useForm<OtpFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  // ── Helpers ──

  function startCooldown() {
    setResendCooldown(60);
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  async function sendOtp(email: string) {
    const { error } = await emailOtp.sendVerificationOtp({ email, type: "sign-in" });
    if (error) {
      toast.error(error.message ?? "Failed to send OTP");
      return false;
    }
    return true;
  }

  // ── Handlers ──

  const handleEmailSubmit = emailForm.handleSubmit(async ({ email }) => {
    const ok = await sendOtp(email);
    if (!ok) return;
    setSubmittedEmail(email);
    setStep("otp");
    startCooldown();
    toast.success(`A 6-digit code was sent to ${email}`);
  });

  const handleOtpSubmit = otpForm.handleSubmit(async ({ otp }) => {
    const { error } = await signIn.emailOtp({
      email: submittedEmail,
      otp,
    });
    if (error) {
      toast.error(error.message ?? "Invalid or expired OTP");
      otpForm.setError("otp", { message: "Invalid or expired code" });
      return;
    }
    toast.success("Signed in successfully!");
    router.push(redirect);
  });

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    const ok = await sendOtp(submittedEmail);
    if (ok) {
      startCooldown();
      toast.success("A new code was sent to your email");
    }
  };

  // ── Render ──

  const isEmailLoading = emailForm.formState.isSubmitting;
  const isOtpLoading = otpForm.formState.isSubmitting;

  return (
    <div className="min-h-screen w-full bg-background flex items-center justify-center">
      <div className="max-w-[450px] w-full px-2">
        {/* Heading */}
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-xl font-bold text-center">
            {step === "email" ? "Sign In to Deathroit" : "Enter your code"}
          </h2>
        </div>

        <div className="bg-custom-dark flex flex-col gap-6 rounded-xl md:rounded-3xl p-6 md:p-10">
          {/* ─── Step 1: Email ─── */}
          {step === "email" && (
            <>
              <form onSubmit={handleEmailSubmit} className="flex flex-col gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-2 border-white/30"
                    placeholder="Your email address"
                    autoComplete="email"
                    disabled={isEmailLoading}
                    {...emailForm.register("email")}
                  />
                  {emailForm.formState.errors.email && (
                    <p className="text-destructive text-sm mt-1">
                      {emailForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isEmailLoading}>
                  {isEmailLoading ? (
                    <span className="flex items-center gap-2">
                      <Spinner /> Sending code…
                    </span>
                  ) : (
                    "Continue with Email"
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-2">
                <div className="flex-1 min-h-[0.5px] bg-muted-foreground" />
                <span className="text-sm text-muted-foreground">OR</span>
                <div className="flex-1 min-h-[0.5px] bg-muted-foreground" />
              </div>

              <GoogleSignIn redirect={redirect} />

              <div className="mx-auto text-muted-foreground">
                Don't have an account?{" "}
                <Link className="text-foreground hover:underline" href="/sign-up">
                  Sign up
                </Link>
              </div>
            </>
          )}

          {/* ─── Step 2: OTP ─── */}
          {step === "otp" && (
            <>
           <h2 className=" text-[16px] text-muted-foreground ">
                Enter The Code Sent To

                <span className="text-foreground font-medium">{" "} {submittedEmail}</span>.
              </h2>

              <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col items-center ">
                  <Controller
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <InputOTP
                        id="otp"
                        className=""
                        maxLength={6}
                        autoComplete="one-time-code"
                        disabled={isOtpLoading}
                        value={field.value}
                        onChange={field.onChange}
                      >
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                      </InputOTP>
                    )}
                  />
                  {otpForm.formState.errors.otp && (
                    <p className="text-destructive text-sm">
                      {otpForm.formState.errors.otp.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isOtpLoading}>
                  {isOtpLoading ? (
                    <span className="flex items-center gap-2">
                      <Spinner /> Verifying…
                    </span>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Resend + back */}
              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className="hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Didn't receive it? Resend code"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    otpForm.reset();
                  }}
                  className="hover:text-foreground transition-colors"
                >
                  ← Use a different email
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
