import type { Metadata } from "next";
import { FolubPageHeader } from "@/components/folub/FolubPageHeader";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a private viewing or talk to FOLUB Builders about buying, selling, or developing property. We respond within 1 business day.",
  alternates: { canonical: "/folub/contact" },
};

const details = [
  { label: "Email", value: "hello@folubbuilders.com", href: "mailto:hello@folubbuilders.com" },
  { label: "Phone", value: "+234 000 000 0000", href: "tel:+2340000000000" },
  { label: "Office", value: "Lagos, Nigeria", href: undefined },
  { label: "Hours", value: "Mon–Sat, 9am–6pm", href: undefined },
];

export default function ContactPage() {
  return (
    <>
      <FolubPageHeader
        eyebrow="Contact us"
        title="Let's start a conversation."
        subtitle="Buying, selling, developing, or partnering — tell us what you need and the right person on our team will get back to you within one business day."
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.4fr]">
          {/* details */}
          <div>
            <h2 className="font-display text-2xl text-[#1B2A38]">Get in touch</h2>
            <p className="mt-3 text-[#6E6A5F]">
              Prefer to reach us directly? Here&apos;s where to find us.
            </p>
            <dl className="mt-8 flex flex-col gap-6">
              {details.map((d) => (
                <div key={d.label}>
                  <dt className="text-xs uppercase tracking-[0.16em] text-[#9C978B]">{d.label}</dt>
                  <dd className="mt-1 text-lg text-[#1B2A38]">
                    {d.href ? (
                      <a href={d.href} className="transition-colors hover:text-[#A9863A]">
                        {d.value}
                      </a>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* form */}
          <div className="rounded-lg border border-[#E2DCD0] bg-white p-8 shadow-[0_18px_45px_-32px_rgba(22,40,58,0.45)]">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
