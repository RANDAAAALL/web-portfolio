import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

/**
 * NOTE: do NOT throw at module scope.
 *
 * This module is evaluated during `next build` and by the proxy on every
 * request. A throw here would break secretless CI builds and turn a
 * misconfiguration into an unhandled 500. Missing credentials are surfaced at
 * request time by the limiters instead, and they fail closed.
 */
export const redis = new Redis({ url, token });

export const isRedisConfigured = Boolean(url && token);

/**
 * Per-client budget enforced by the proxy (src/proxy.ts): 5 requests / 60s.
 */
export const EmailSendingRateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: false,
  prefix: "portfolio:ratelimit:email:proxy",
});

/**
 * Per-client budget enforced inside the route handler itself.
 *
 * This is a separate budget on purpose: the proxy layer has been bypassable
 * in past Next.js releases (middleware/proxy bypass advisories), so the route
 * handler must not depend on the proxy having run.
 */
export const EmailSendingRouteLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: false,
  prefix: "portfolio:ratelimit:email:route",
});

/**
 * Global cap on outbound mail, independent of how the caller is identified.
 *
 * This is what makes abuse bounded even if the client IP cannot be trusted
 * (spoofed forwarding headers, a misconfigured proxy, or a direct-to-node
 * deployment).
 */
export const EmailSendingGlobalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "60 s"),
  analytics: false,
  prefix: "portfolio:ratelimit:email:global",
});

/** Identifier used for the global limiter. */
export const GLOBAL_RATE_LIMIT_KEY = "global";
