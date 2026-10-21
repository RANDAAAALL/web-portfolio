import { NextRequest } from "next/server";
import { isIP } from "node:net";

/**
 * Shared bucket for callers whose real IP cannot be established.
 *
 * Collapsing them into ONE bucket is deliberate: inventing a unique key per
 * request would hand an attacker an unlimited supply of fresh buckets.
 */
export const UNKNOWN_CLIENT_IP = "unknown";

/**
 * Headers that a trusted edge OVERWRITES rather than appends to.
 *
 * Ordered by specificity. These are the only headers that can be trusted on
 * their own, because the edge replaces any client-supplied value.
 */
const EDGE_OWNED_HEADERS = [
  "cf-connecting-ip", // Cloudflare
  "x-vercel-forwarded-for", // Vercel
  "x-real-ip", // nginx $remote_addr and most reverse proxies
] as const;

/**
 * Resolve a client IP that is safe to use as a rate-limit key.
 *
 * `x-forwarded-for` is attacker-controlled: the first hop is whatever the
 * client sent, so reading it directly lets an attacker mint a fresh rate-limit
 * bucket per request and bypass the limit entirely. Trusted edges APPEND the
 * real client IP as the LAST hop, so only that hop is accepted here.
 *
 * The result is validated as a real IP address so the key space stays bounded
 * to actual addresses instead of arbitrary attacker-chosen strings.
 */
export const getClientIP = (req: NextRequest): string => {
  for (const header of EDGE_OWNED_HEADERS) {
    const value = req.headers.get(header);
    if (!value) continue;

    const candidate = value.split(",").at(-1)?.trim();
    if (candidate && isIP(candidate)) return candidate;
  }

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded
      .split(",")
      .map((hop) => hop.trim())
      .filter(Boolean);

    // The edge appends the real client IP last.
    const candidate = hops.at(-1);
    if (candidate && isIP(candidate)) return candidate;
  }

  return UNKNOWN_CLIENT_IP;
};
