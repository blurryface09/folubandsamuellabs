import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, company, service, message } = await req.json();

  if (!name || !email || !service || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "FSLabs Contact <contact@folubandsamuellabs.com>",
    to: "admin@folubandsamuellabs.com",
    replyTo: email,
    subject: `New Enquiry: ${service} from ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f9fafb; border-radius: 8px;">
        <h2 style="color: #0e7490; margin-bottom: 4px;">New Contact Form Submission</h2>
        <p style="color: #6b7280; font-size: 14px; margin-top: 0;">FolubandSamuel Labs Website</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #0e7490;">${email}</a></td></tr>
          ${company ? `<tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Company</td><td style="padding: 8px 0;">${company}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Service</td><td style="padding: 8px 0;"><span style="background: #ecfeff; color: #0e7490; padding: 2px 10px; border-radius: 999px; font-size: 13px; font-weight: 600;">${service}</span></td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="color: #6b7280; font-size: 14px; margin-bottom: 8px;">Message</p>
        <p style="background: white; padding: 16px; border-radius: 6px; border: 1px solid #e5e7eb; white-space: pre-wrap;">${message}</p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">Reply directly to this email to respond to ${name}.</p>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
