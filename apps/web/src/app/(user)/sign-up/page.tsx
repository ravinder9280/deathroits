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

const signUpSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  email: z.email("Please enter a valid email address"),
});

const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only digits"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;
type OtpFormValues = z.infer<typeof otpSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignUpPage(): ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/tournaments";

  const [step, setStep] = useState<"details" | "otp">("details");
  const [userData, setUserData] = useState<SignUpFormValues | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Step 1: details form ──
  const detailsForm = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { firstName: "", lastName: "", email: "" },
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

  async function sendOtp(email: string): Promise<boolean> {
    // We use "sign-in" type here because Better Auth's signIn.emailOtp()
    // automatically registers a new user on first use — the `name` field
    // passed in the verify step is used for the initial profile creation.
    const { error } = await emailOtp.sendVerificationOtp({ email, type: "sign-in" });
    if (error) {
      toast.error(error.message ?? "Failed to send OTP");
      return false;
    }
    return true;
  }

  // ── Handlers ──

  const handleDetailsSubmit = detailsForm.handleSubmit(async (values) => {
    const ok = await sendOtp(values.email);
    if (!ok) return;
    setUserData(values);
    setStep("otp");
    startCooldown();
    toast.success(`A 6-digit code was sent to ${values.email}`);
  });

  const handleOtpSubmit = otpForm.handleSubmit(async ({ otp }) => {
    if (!userData) return;

    const fullName = `${userData.firstName.trim()} ${userData.lastName.trim()}`;

    // signIn.emailOtp auto-registers new users; `name` is used only for new accounts
    const { error } = await signIn.emailOtp({
      email: userData.email,
      otp,
      name: fullName,
    });

    if (error) {
      toast.error(error.message ?? "Invalid or expired OTP");
      otpForm.setError("otp", { message: "Invalid or expired code" });
      return;
    }

    toast.success("Account created! Welcome to Deathroit 🎮");
    router.push(redirect);
  });

  const handleResend = async () => {
    if (!userData || resendCooldown > 0) return;
    const ok = await sendOtp(userData.email);
    if (ok) {
      startCooldown();
      toast.success("A new code was sent to your email");
    }
  };

  // ── Render ──

  const isDetailsLoading = detailsForm.formState.isSubmitting;
  const isOtpLoading = otpForm.formState.isSubmitting;

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="max-w-[450px] w-full px-2">
        {/* Heading */}
        <div className="flex items-center justify-center mb-4">
          <h2 className="text-xl font-bold text-center">
            {step === "details" ? "Create your account" : "Check your email"}
          </h2>
        </div>

        <div className="bg-custom-dark flex flex-col gap-6 rounded-xl md:rounded-3xl p-6 md:p-10">
          {/* ─── Step 1: Details ─── */}
          {step === "details" && (
            <>
              <form onSubmit={handleDetailsSubmit} className="flex flex-col gap-4">
                {/* First / Last name row */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      className="mt-2 border-white/30"
                      placeholder="Your First Name"
                      autoComplete="given-name"
                      disabled={isDetailsLoading}
                      {...detailsForm.register("firstName")}
                    />
                    {detailsForm.formState.errors.firstName && (
                      <p className="text-destructive text-sm mt-1">
                        {detailsForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      className="mt-2 border-white/30"
                      placeholder="Your Last Name"
                      autoComplete="family-name"
                      disabled={isDetailsLoading}
                      {...detailsForm.register("lastName")}
                    />
                    {detailsForm.formState.errors.lastName && (
                      <p className="text-destructive text-sm mt-1">
                        {detailsForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-2 border-white/30"
                    placeholder="Your email address"
                    autoComplete="email"
                    disabled={isDetailsLoading}
                    {...detailsForm.register("email")}
                  />
                  {detailsForm.formState.errors.email && (
                    <p className="text-destructive text-sm mt-1">
                      {detailsForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isDetailsLoading}>
                  {isDetailsLoading ? (
                    <span className="flex items-center gap-2">
                      <Spinner /> Sending code…
                    </span>
                  ) : (
                    "Continue"
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
                Already have an account?{" "}
                <Link className="text-foreground hover:underline" href="/sign-in">
                  Sign in
                </Link>
              </div>
            </>
          )}

          {/* ─── Step 2: OTP ─── */}
          {step === "otp" && userData && (
            <>
              <h2 className=" text-[16px] text-muted-foreground ">
                Enter The Code Sent To

                <span className="text-foreground font-medium">{" "} { userData.email}</span>.
              </h2>

              <form onSubmit={handleOtpSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col items-center gap-3">
                  <Controller
                    control={otpForm.control}
                    name="otp"
                    render={({ field }) => (
                      <InputOTP
                        id="otp"
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
                      <Spinner /> Creating account…
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                {resendCooldown>0?

                    <p className="text-muted-foreground">
                Resend Code in {resendCooldown}
              </p>:<div className="text-muted-foreground">
                Didn't receive it?  {" "}

                <button onClick={handleResend} className="text-foreground hover:underline cursor-pointer">

                
                Resend code
                </button>
              </div>
                
            }
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
