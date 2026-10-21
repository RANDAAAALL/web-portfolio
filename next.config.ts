import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do not advertise the framework to scanners.
  poweredByHeader: false,

  images: {
    // Remote image optimization stays OFF.
    //
    // The image optimizer is the only path in this app that reaches node:dns
    // and performs outbound fetches to a caller-supplied host. Keeping
    // remotePatterns empty means those paths are unreachable, which also
    // keeps the DNS-related Node.js advisories out of scope.
    remotePatterns: [],

    // AVIF decoding has been the vector for critical remote-code-execution
    // advisories in the image optimizer. WebP only.
    formats: ["image/webp"],

    dangerouslyAllowSVG: false,
    dangerouslyAllowLocalIP: false,
  },

  // NOTE on HTTP keep-alive:
  //
  // Next.js creates a shared `http.Agent({ keepAlive: true })` for outbound
  // requests. The free-socket reuse in that pool is the mechanism behind the
  // HTTP response-desync advisory class (CVE-2026-105481).
  //
  // Node.js 24.22.1 contains the upstream fix ("http: ensure agent data guard
  // works without I/O"), so keep-alive can stay enabled without a per-request
  // TLS handshake penalty. Do NOT downgrade Node below 24.22.1 -- if you do,
  // set `httpAgentOptions: { keepAlive: false }` here as well.
};

export default nextConfig;
