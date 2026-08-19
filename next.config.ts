import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // React streams Suspense/loading.tsx content and the RSC payload via
      // inline scripts; blocking them leaves every skeleton stuck forever.
      // TODO: replace 'unsafe-inline' with a nonce-based CSP set in proxy.ts.
      `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // The Academy is a standalone product living under /academy. These are the
  // pre-split routes; keep them resolving so old links don't 404, but always
  // land the user on the Academy version.
  async redirects() {
    return [
      { source: "/courses", destination: "/academy/courses", permanent: false },
      { source: "/courses/:path*", destination: "/academy/courses/:path*", permanent: false },
      { source: "/dashboard", destination: "/academy/dashboard", permanent: false },
      { source: "/profile", destination: "/academy/profile", permanent: false },
      { source: "/training", destination: "/academy/courses", permanent: false },
    ];
  },
};

export default nextConfig;
