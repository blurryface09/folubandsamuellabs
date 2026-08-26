import "server-only";

import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { Resend } from "resend";

type PasswordResetEmailInput = {
  to: string;
  name: string;
  resetLink: string;
  expiresAt: Date;
};

type VerificationEmailInput = {
  to: string;
  name: string;
  verificationLink: string;
  expiresAt: Date;
};

type HelpRequestAlertInput = {
  studentName: string;
  studentEmail: string;
  phone: string;
  preferredContact: string;
  preferredTime: string | null;
  message: string;
  courseTitle: string | null;
  moduleTitle: string | null;
};

type EmailResult =
  | { ok: true; provider: "ses" | "resend"; messageId?: string }
  | { ok: false; provider: "ses" | "resend" | "none"; error: string };

function emailFrom() {
  return process.env.EMAIL_FROM?.trim();
}

function sesRegion() {
  return process.env.AWS_SES_REGION?.trim() || process.env.SES_REGION?.trim();
}

async function sendEmail({
  to,
  subject,
  text,
  html,
}: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<EmailResult> {
  const from = emailFrom();

  if (!from) {
    return {
      ok: false,
      provider: "none",
      error: "EMAIL_FROM is not configured.",
    };
  }

  const region = sesRegion();

  if (region) {
    try {
      const response = await new SESv2Client({ region }).send(
        new SendEmailCommand({
          FromEmailAddress: from,
          Destination: {
            ToAddresses: [to],
          },
          Content: {
            Simple: {
              Subject: { Data: subject },
              Body: {
                Text: { Data: text },
                Html: { Data: html },
              },
            },
          },
        }),
      );

      return { ok: true, provider: "ses", messageId: response.MessageId };
    } catch (error) {
      return {
        ok: false,
        provider: "ses",
        error: error instanceof Error ? error.message : "SES delivery failed.",
      };
    }
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();

  if (!resendKey) {
    return {
      ok: false,
      provider: "none",
      error: "Configure AWS_SES_REGION or RESEND_API_KEY for email delivery.",
    };
  }

  try {
    const response = await new Resend(resendKey).emails.send({
      from,
      to,
      subject,
      text,
      html,
    });

    if (response.error) {
      return {
        ok: false,
        provider: "resend",
        error: response.error.message,
      };
    }

    return { ok: true, provider: "resend", messageId: response.data?.id };
  } catch (error) {
    return {
      ok: false,
      provider: "resend",
      error: error instanceof Error ? error.message : "Resend delivery failed.",
    };
  }
}

export async function sendPasswordResetEmail(
  input: PasswordResetEmailInput,
): Promise<EmailResult> {
  return sendEmail({
    to: input.to,
    subject: "Reset your FSLabs Academy password",
    text: [
      `Hi ${input.name},`,
      "",
      `Reset your password: ${input.resetLink}`,
      "",
      `This link expires ${input.expiresAt.toUTCString()}.`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6">
        <h1 style="font-size:20px;margin:0 0 12px">Reset your password</h1>
        <p>Hi ${input.name}, use the button below to reset your password.</p>
        <p><a href="${input.resetLink}" style="display:inline-block;background:#020617;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none">Reset password</a></p>
        <p style="color:#475569;font-size:14px">This link expires ${input.expiresAt.toUTCString()}.</p>
      </div>
    `,
  });
}

export async function sendHelpRequestAlert(
  input: HelpRequestAlertInput,
): Promise<EmailResult> {
  return sendEmail({
    to: "access@fslabs.tech",
    subject: `Help request: ${input.studentName}${input.courseTitle ? ` — ${input.courseTitle}` : ""}`,
    text: [
      `${input.studentName} (${input.studentEmail}) requested a call.`,
      "",
      `Course: ${input.courseTitle || "—"}`,
      `Week: ${input.moduleTitle || "—"}`,
      `Preferred contact: ${input.preferredContact}`,
      `Phone: ${input.phone}`,
      `Preferred time: ${input.preferredTime || "not specified"}`,
      "",
      `Message: ${input.message}`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6">
        <h1 style="font-size:20px;margin:0 0 12px">New help request</h1>
        <p><strong>${input.studentName}</strong> (${input.studentEmail}) requested a call.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0">
          <tr><td style="padding:6px 0;color:#475569;width:140px">Course</td><td style="padding:6px 0">${input.courseTitle || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#475569">Week</td><td style="padding:6px 0">${input.moduleTitle || "—"}</td></tr>
          <tr><td style="padding:6px 0;color:#475569">Preferred contact</td><td style="padding:6px 0">${input.preferredContact}</td></tr>
          <tr><td style="padding:6px 0;color:#475569">Phone</td><td style="padding:6px 0">${input.phone}</td></tr>
          <tr><td style="padding:6px 0;color:#475569">Preferred time</td><td style="padding:6px 0">${input.preferredTime || "not specified"}</td></tr>
        </table>
        <p style="color:#475569;font-size:14px">Message</p>
        <p style="background:#f8fafc;padding:14px;border-radius:6px;border:1px solid #e2e8f0;white-space:pre-wrap">${input.message}</p>
      </div>
    `,
  });
}

export async function sendVerificationEmail(
  input: VerificationEmailInput,
): Promise<EmailResult> {
  return sendEmail({
    to: input.to,
    subject: "Verify your FSLabs Academy email",
    text: [
      `Hi ${input.name},`,
      "",
      `Verify your email: ${input.verificationLink}`,
      "",
      `This link expires ${input.expiresAt.toUTCString()}.`,
    ].join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6">
        <h1 style="font-size:20px;margin:0 0 12px">Verify your email</h1>
        <p>Hi ${input.name}, verify your email to unlock your FSLabs Academy account.</p>
        <p><a href="${input.verificationLink}" style="display:inline-block;background:#020617;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none">Verify email</a></p>
        <p style="color:#475569;font-size:14px">This link expires ${input.expiresAt.toUTCString()}.</p>
      </div>
    `,
  });
}
