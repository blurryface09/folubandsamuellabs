import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { type, name, email, details } = await req.json();

  if (!type || !name || !email || !details) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const rows = Object.entries(details as Record<string, string>)
    .map(([k, v]) => `
      <tr>
        <td style="padding:7px 0;color:#9ca3af;font-size:13px;width:150px;text-transform:capitalize;vertical-align:top">${k.replace(/_/g, " ")}</td>
        <td style="padding:7px 0;color:#111827;font-size:13px;font-weight:600">${v}</td>
      </tr>`)
    .join("");

  const { error } = await resend.emails.send({
    from: "FSLabs Exchange <exchange@folubandsamuellabs.com>",
    to: "admin@folubandsamuellabs.com",
    replyTo: email,
    subject: `[Exchange] ${type} — ${name}`,
    html: `
      <div style="font-family:sans-serif;max-width:580px;margin:0 auto;">
        <div style="background:#080808;padding:24px 28px;border-radius:8px 8px 0 0;">
          <p style="color:#c9a84c;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 6px">FSLabs Exchange</p>
          <h2 style="color:#ffffff;margin:0;font-size:22px;font-weight:700">New ${type}</h2>
        </div>
        <div style="background:#ffffff;padding:28px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
          <p style="margin:0 0 4px;color:#6b7280;font-size:13px;">From: <strong style="color:#111827">${name}</strong></p>
          <p style="margin:0 0 20px;color:#6b7280;font-size:13px;">Email: <a href="mailto:${email}" style="color:#c9a84c">${email}</a></p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:0 0 20px"/>
          <table style="width:100%;border-collapse:collapse">${rows}</table>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0"/>
          <p style="color:#9ca3af;font-size:12px;margin:0">Reply to this email to respond to ${name} directly.</p>
        </div>
      </div>
    `,
  });

  if (error) return NextResponse.json({ error: "Email failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
