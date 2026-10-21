import { getClientIP } from "@/lib/helper/get-client-ip";
import { EmailSendingRateLimiter } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Only POST can send mail; do not spend rate-limit budget on anything else.
  if (request.method !== "POST") {
    return NextResponse.next();
  }

  try {
    const rateLimit = await EmailSendingRateLimiter.limit(getClientIP(request));

    if (!rateLimit.success) {
      const retryAfter = Math.max(
        1,
        Math.ceil((rateLimit.reset - Date.now()) / 1000)
      );
      return NextResponse.json(
        { errorMessage: "Too many requests, please try again later." },
        { status: 429, headers: { "Retry-After": String(retryAfter) } }
      );
    }
  } catch (error) {
    // Fail closed: an unavailable limiter must not become an open relay.
    console.error("[proxy] rate limiter unavailable:", error);
    return NextResponse.json(
      { errorMessage: "Service temporarily unavailable." },
      { status: 503 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/send-email"],
};
