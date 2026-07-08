import type { Metadata } from "next";
import { ExchangeLandingClient } from "./exchange-client";

export const metadata: Metadata = {
  title: "Exchange",
  description: "FSLabs Exchange — fast, secure crypto-to-naira and account services. Submit a request and get processed within 30 minutes.",
  alternates: { canonical: "/exchange" },
};

export default function ExchangeLanding() {
  return <ExchangeLandingClient />;
}
