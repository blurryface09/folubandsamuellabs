import "server-only";

import { headers } from "next/headers";

export async function appOrigin() {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";

  return `${protocol}://${host}`;
}
