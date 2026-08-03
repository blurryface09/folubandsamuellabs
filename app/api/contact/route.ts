import { Resend } from "resend";
import { NextResponse } from "next/server";

import { CONTACT_INBOX, MAIL_FROM, SITE_DOMAIN, SITE_URL } from "@/lib/site";

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, company, service, message } = await req.json();

  if (!name || !email || !service || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const isTrainingEnquiry = /training|course|learn|enrol|enroll|full.?stack|frontend|backend|hacking|machine.?learn|prompt/i.test(service + " " + message);

  const [{ error }] = await Promise.all([
    resend.emails.send({
      from: MAIL_FROM.fslabsContact,
      to: CONTACT_INBOX,
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
    }),
    resend.emails.send({
      from: MAIL_FROM.fslabs,
      to: email,
      replyTo: CONTACT_INBOX,
      subject: "We received your message — FSLabs",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #0A0804; color: #F0EDE4; border-radius: 12px; overflow: hidden;">
          <div style="padding: 32px 32px 0; text-align: center;">
            <svg width="48" height="48" viewBox="0 0 240 240" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs><linearGradient id="g" x1="60" y1="20" x2="180" y2="220" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#F5D060"/><stop offset="40%" stop-color="#C9A84C"/><stop offset="100%" stop-color="#8B6200"/></linearGradient></defs>
              <path d="M120 8L210 65v100L120 232 30 165V65Z" fill="url(#g)"/>
              <path d="M120 22l76 48v90l-76 58-76-58V70Z" fill="#0A0804"/>
              <path d="M72 75c0-20 23-27 46-23 27 5 47 22 47 46 0 14-8 25-18 32l-15-10c10-6 16-13 16-22 0-16-14-30-32-33-17-3-30 3-34 14Z" fill="url(#g)"/>
              <path d="M168 165c0 20-23 27-46 23-27-5-47-22-47-46 0-14 8-25 18-32l15 10c-10 6-16 13-16 22 0 16 14 30 32 33 17 3 30-3 34-14Z" fill="url(#g)"/>
              <path d="M147 132c-9 7-19 10-27 10s-18-3-27-10l15-10c5 4 8 6 12 6s7-2 12-6Z" fill="url(#g)"/>
            </svg>
            <h1 style="color: #C9A84C; font-size: 22px; font-weight: 800; letter-spacing: 0.05em; margin: 16px 0 4px;">FOLUB &amp; SAMUEL LABS</h1>
            <p style="color: rgba(240,237,228,0.5); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; margin: 0 0 28px;">Technology &amp; Cybersecurity</p>
          </div>
          <div style="padding: 0 32px 32px;">
            <p style="font-size: 16px; margin-bottom: 8px;">Hi ${name},</p>
            <p style="color: rgba(240,237,228,0.75); line-height: 1.7; margin-bottom: 24px;">
              Thanks for reaching out — we've received your message and will get back to you within <strong style="color: #F0EDE4;">1 business day</strong>.
            </p>
            ${isTrainingEnquiry ? `
            <div style="background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.2); border-radius: 10px; padding: 20px; margin-bottom: 24px;">
              <p style="color: #C9A84C; font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; margin: 0 0 10px;">FSLabs Training — Now Open</p>
              <p style="color: rgba(240,237,228,0.75); font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
                We offer 3-month hands-on courses in Full Stack, Frontend, Backend, Prompt Engineering, ML Foundations, and Ethical Hacking — with introductory pricing from <strong style="color: #F0EDE4;">₦150,000</strong>.
              </p>
              <a href="${SITE_URL}/training" style="display: inline-block; background: linear-gradient(135deg,#C9A84C,#8B6914); color: #050505; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.05em;">View Courses &amp; Enrol →</a>
            </div>
            ` : ""}
            <p style="color: rgba(240,237,228,0.5); font-size: 13px; line-height: 1.6; margin-bottom: 0;">
              In the meantime, feel free to browse our services at
              <a href="${SITE_URL}" style="color: #C9A84C;">${SITE_DOMAIN}</a>
              or reply to this email if you have any urgent questions.
            </p>
          </div>
          <div style="background: rgba(255,255,255,0.03); border-top: 1px solid rgba(201,168,76,0.1); padding: 20px 32px; text-align: center;">
            <p style="color: rgba(240,237,228,0.3); font-size: 11px; margin: 0;">Folub &amp; Samuel Labs · Lagos, Nigeria · RC No. 9637480</p>
          </div>
        </div>
      `,
    }),
  ]);

  if (error) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
