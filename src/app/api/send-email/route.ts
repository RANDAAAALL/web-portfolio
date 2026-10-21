import ContactEmailTemplate from "@/components/ui/email/contact-email-template";
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import {
  EmailSendingGlobalLimiter,
  EmailSendingRouteLimiter,
  GLOBAL_RATE_LIMIT_KEY,
} from "@/lib/redis";
import { getClientIP } from "@/lib/helper/get-client-ip";

export const runtime = "nodejs";

/**
 * A real contact message is small. Anything larger is abuse, not a message.
 * Checked against the declared Content-Length and again on the buffered body,
 * because Content-Length is attacker-controlled and may be absent.
 */
const MAX_BODY_BYTES = 16 * 1024;

const LIMITS = {
  name: 120,
  senderEmail: 254,
  subject: 200,
  message: 5000,
} as const;

/**
 * Deliberately strict: a single "@", no whitespace, no control characters,
 * and a dotted domain. The browser's `type="email"` check is advisory only --
 * this endpoint can be called directly.
 */
const EMAIL_PATTERN = /^[^\s@,;:<>()[\]\\"]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

type ContactPayload = {
  name?: unknown;
  senderEmail?: unknown;
  subject?: unknown;
  message?: unknown;
};

let resendClient: Resend | undefined;

/**
 * Lazy init: the Resend constructor throws when the API key is missing, and
 * this module is evaluated during `next build`, where the key is absent.
 */
const getResend = (): Resend => {
  resendClient ??= new Resend(process.env.RESEND_API_KEY);
  return resendClient;
};

const asString = (value: unknown): string =>
  typeof value === "string" ? value : "";

function validate(body: ContactPayload) {
  const name = asString(body.name).trim();
  const senderEmail = asString(body.senderEmail).trim();
  const subject = asString(body.subject).trim();
  const message = asString(body.message).trim();

  if (!name || name.length > LIMITS.name) return null;
  if (!senderEmail || senderEmail.length > LIMITS.senderEmail) return null;
  if (!EMAIL_PATTERN.test(senderEmail)) return null;
  if (!subject || subject.length > LIMITS.subject) return null;
  if (!message || message.length > LIMITS.message) return null;

  // Belt and braces: a CR/LF must never reach an email header.
  if (/[\r\n]/.test(senderEmail) || /[\r\n]/.test(subject)) return null;

  return { name, senderEmail, subject, message };
}

export async function POST(req: NextRequest) {
  try {
    // 1. Reject oversized bodies before buffering them.
    const declaredLength = Number(req.headers.get("content-length") ?? "0");
    if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { errorMessage: "Request payload too large." },
        { status: 413 }
      );
    }

    const raw = await req.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json(
        { errorMessage: "Request payload too large." },
        { status: 413 }
      );
    }

    let body: ContactPayload;
    try {
      body = JSON.parse(raw) as ContactPayload;
    } catch {
      return NextResponse.json(
        { errorMessage: "Invalid request body." },
        { status: 400 }
      );
    }

    // 2. Validate every field server-side.
    const payload = validate(body);
    if (!payload) {
      return NextResponse.json(
        { errorMessage: "Invalid contact form submission." },
        { status: 400 }
      );
    }

    // 3. Enforce the budget in the handler, not only in the proxy. The proxy
    //    layer has been bypassable in past Next.js releases, so the route must
    //    not assume the proxy ran.
    const clientIP = getClientIP(req);

    const [routeLimit, globalLimit] = await Promise.all([
      EmailSendingRouteLimiter.limit(clientIP),
      EmailSendingGlobalLimiter.limit(GLOBAL_RATE_LIMIT_KEY),
    ]);

    if (!routeLimit.success || !globalLimit.success) {
      const reset = Math.min(routeLimit.reset, globalLimit.reset);
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      return NextResponse.json(
        { errorMessage: "Too many requests, please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }

    const { data, error } = await getResend().emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["testraaa0506@gmail.com"],
      replyTo: payload.senderEmail,
      subject: payload.subject,
      react: ContactEmailTemplate({
        name: payload.name,
        email: payload.senderEmail,
        subject: payload.subject,
        message: payload.message,
      }),
    });

    if (error) {
      // Log the provider detail server-side; never echo it to the caller.
      console.error("[send-email] resend rejected the request:", error);
      return NextResponse.json(
        { errorMessage: "Failed to send message." },
        { status: 502 }
      );
    }

    return NextResponse.json({ payload: data }, { status: 200 });
  } catch (error: unknown) {
    console.error("[send-email] unexpected error:", error);
    return NextResponse.json(
      { errorMessage: "Failed to send message." },
      { status: 500 }
    );
  }
}
