import type { Metadata } from "next";
import { ContactClient } from "./contact-client";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Folub & Samuel Labs. Tell us about your project — we respond within 24 hours.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return <ContactClient />;
}
