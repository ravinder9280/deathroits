import { Resend } from "resend";

/** Lazily creates the Resend client so env vars are resolved at call-time, not at import-time. */
let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY environment variable is not set");
    _resend = new Resend(key);
  }
  return _resend;
}

/** Sender address – update once your domain is verified in Resend */
const FROM_ADDRESS = "Deathroit <noreply@deathroit.ravindertech.me>";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type OtpType = "sign-in" | "email-verification" | "forget-password" | "change-email";

interface SendOtpEmailParams {
  to: string;
  otp: string;
  type: OtpType;
}

// ---------------------------------------------------------------------------
// OTP email subject / body helpers
// ---------------------------------------------------------------------------

const OTP_META: Record<OtpType, { subject: string; heading: string; description: string }> = {
  "sign-in": {
    subject: "Your Deathroit sign-in code",
    heading: "Sign in to Deathroit",
    description: "Use the code below to complete your sign-in. It expires in 10 minutes.",
  },
  "email-verification": {
    subject: "Verify your Deathroit email",
    heading: "Verify your email address",
    description: "Use the code below to verify your email address. It expires in 10 minutes.",
  },
  "forget-password": {
    subject: "Reset your Deathroit password",
    heading: "Reset your password",
    description: "Use the code below to reset your password. It expires in 10 minutes.",
  },
  "change-email": {
    subject: "Confirm your new Deathroit email",
    heading: "Confirm your new email address",
    description: "Use the code below to confirm your new email address. It expires in 10 minutes.",
  },
};

function buildOtpHtml(otp: string, type: OtpType): string {
  const { heading, description } = OTP_META[type];

  return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${heading}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:12px;border:1px solid #222;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#7c3aed,#db2777);padding:32px 40px;text-align:center;">
              <p style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:1px;">DEATHROIT</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:600;color:#f5f5f5;">${heading}</h1>
              <p style="margin:0 0 32px;font-size:15px;color:#aaa;line-height:1.6;">${description}</p>
              <!-- OTP box -->
              <div style="background:#1a1a1a;border:1px solid #333;border-radius:10px;padding:24px;text-align:center;margin-bottom:32px;">
                <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#a855f7;font-family:monospace;">${otp}</span>
              </div>
              <p style="margin:0;font-size:13px;color:#666;line-height:1.6;">
                If you didn't request this, you can safely ignore this email.
                Never share this code with anyone.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #222;text-align:center;">
              <p style="margin:0;font-size:12px;color:#555;">
                © ${new Date().getFullYear()} Deathroit. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
// Exported send functions
// ---------------------------------------------------------------------------

/**
 * Send an OTP email via Resend.
 * This is the single reusable function consumed by auth.ts and anywhere else
 * that needs to deliver a one-time code to a user.
 */
export async function sendOtpEmail({ to, otp, type }: SendOtpEmailParams): Promise<void> {
  const meta = OTP_META[type];

  const { error } = await getResend().emails.send({
    from: FROM_ADDRESS,
    to: [to],
    subject: meta.subject,
    html: buildOtpHtml(otp, type),
  });

  if (error) {
    console.error(`[Resend] Failed to send OTP (${type}) to ${to}:`, error);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
}

/**
 * Generic transactional email sender – extend with more templates as needed.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<void> {
  const { error } = await getResend().emails.send({
    from: FROM_ADDRESS,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
  });

  if (error) {
    console.error(`[Resend] Failed to send email to ${to}:`, error);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
}
