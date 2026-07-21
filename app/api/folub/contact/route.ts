import { Resend } from "resend";
import { NextResponse } from "next/server";

/*
 * FOLUB Builders enquiry handler. Uses the same verified Resend domain as the
 * FSLabs form (folubandsamuellabs.com) so deliverability is unchanged; swap the
 * from/to addresses once a dedicated folubbuilders.com domain is verified.
 */
export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { name, email, phone, intent, property, message } = await req.json();

  if (!name || !email || !intent || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const navy = "#213A54";
  const gold = "#C6A24A";

  const [{ error }] = await Promise.all([
    // Internal notification
    resend.emails.send({
      from: "FOLUB Builders <contact@folubandsamuellabs.com>",
      to: "admin@folubandsamuellabs.com",
      replyTo: email,
      subject: `New enquiry: ${intent}${property ? ` — ${property}` : ""} from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f7f4ee; border-radius: 8px;">
          <h2 style="color: ${navy}; margin-bottom: 4px;">New FOLUB Builders enquiry</h2>
          <p style="color: #6E6A5F; font-size: 14px; margin-top: 0;">folubandsamuellabs.com/folub</p>
          <hr style="border: none; border-top: 1px solid #e2dcd0; margin: 20px 0;" />
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #6E6A5F; font-size: 14px; width: 130px;">Name</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #6E6A5F; font-size: 14px;">Email</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: ${navy};">${email}</a></td></tr>
            ${phone ? `<tr><td style="padding: 8px 0; color: #6E6A5F; font-size: 14px;">Phone</td><td style="padding: 8px 0;">${phone}</td></tr>` : ""}
            <tr><td style="padding: 8px 0; color: #6E6A5F; font-size: 14px;">Intent</td><td style="padding: 8px 0;"><span style="background: rgba(198,162,74,0.15); color: ${navy}; padding: 2px 10px; border-radius: 999px; font-size: 13px; font-weight: 600;">${intent}</span></td></tr>
            ${property ? `<tr><td style="padding: 8px 0; color: #6E6A5F; font-size: 14px;">Property</td><td style="padding: 8px 0; font-weight: 600;">${property}</td></tr>` : ""}
          </table>
          <hr style="border: none; border-top: 1px solid #e2dcd0; margin: 20px 0;" />
          <p style="color: #6E6A5F; font-size: 14px; margin-bottom: 8px;">Message</p>
          <p style="background: white; padding: 16px; border-radius: 6px; border: 1px solid #e2dcd0; white-space: pre-wrap;">${message}</p>
          <p style="color: #9C978B; font-size: 12px; margin-top: 24px;">Reply directly to this email to respond to ${name}.</p>
        </div>
      `,
    }),
    // Auto-reply to the enquirer
    resend.emails.send({
      from: "FOLUB Builders <contact@folubandsamuellabs.com>",
      to: email,
      replyTo: "admin@folubandsamuellabs.com",
      subject: "We received your enquiry — FOLUB Builders",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #16283A; color: #EFE9DC; border-radius: 12px; overflow: hidden;">
          <div style="padding: 32px 32px 0; text-align: center;">
            <p style="color: #F3ECDD; font-size: 22px; font-weight: 800; letter-spacing: 0.18em; margin: 8px 0 4px;">FOLUB</p>
            <p style="color: ${gold}; font-size: 11px; letter-spacing: 0.42em; text-transform: uppercase; margin: 0 0 28px;">Builders</p>
          </div>
          <div style="padding: 0 32px 32px;">
            <p style="font-size: 16px; margin-bottom: 8px;">Hi ${name},</p>
            <p style="color: rgba(239,233,220,0.78); line-height: 1.7; margin-bottom: 24px;">
              Thank you for reaching out to FOLUB Builders. We&apos;ve received your
              ${property ? `enquiry about <strong style="color:#F3ECDD;">${property}</strong>` : "message"}
              and a member of our team will be in touch within <strong style="color:#F3ECDD;">1 business day</strong>.
            </p>
            <div style="background: rgba(198,162,74,0.08); border: 1px solid rgba(198,162,74,0.22); border-radius: 10px; padding: 20px; margin-bottom: 24px;">
              <p style="color: ${gold}; font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin: 0 0 10px;">While you wait</p>
              <p style="color: rgba(239,233,220,0.78); font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
                Browse our available homes and developments — from move-in-ready residences to off-plan opportunities.
              </p>
              <a href="https://folubandsamuellabs.com/folub/properties" style="display: inline-block; background: ${gold}; color: #16283A; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 13px; letter-spacing: 0.03em;">View properties →</a>
            </div>
          </div>
          <div style="background: rgba(255,255,255,0.03); border-top: 1px solid rgba(198,162,74,0.12); padding: 20px 32px; text-align: center;">
            <p style="color: rgba(239,233,220,0.35); font-size: 11px; margin: 0;">FOLUB Builders · Lagos, Nigeria · Build · Buy · Sell</p>
          </div>
        </div>
      `,
    }),
  ]);

  if (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
