import "server-only";

import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { Resend } from "resend";

type InviteEmailInput = {
  to: string;
  companyName: string;
  employeeName: string;
  inviteLink: string;
  expiresAt: Date;
};

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

type EmailResult =
  | { ok: true; provider: "ses" | "resend"; messageId?: string }
  | { ok: false; provider: "ses" | "resend" | "none"; error: string };

function emailFrom() {
  return process.env.EMAIL_FROM?.trim();
}

function sesRegion() {
  return process.env.AWS_SES_REGION?.trim() || process.env.SES_REGION?.trim();
}

function textInvite(input: InviteEmailInput) {
  return [
    `${input.companyName} invited ${input.employeeName} to Folub & Samuel Labs HR.`,
    "",
    `Accept your invitation: ${input.inviteLink}`,
    "",
    `This invite expires ${input.expiresAt.toUTCString()}.`,
  ].join("\n");
}

function htmlInvite(input: InviteEmailInput) {
  return `
    <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.6">
      <h1 style="font-size:20px;margin:0 0 12px">You're invited to ${input.companyName}</h1>
      <p>${input.companyName} invited ${input.employeeName} to activate their staff account.</p>
      <p>
        <a href="${input.inviteLink}" style="display:inline-block;background:#020617;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none">
          Accept invitation
        </a>
      </p>
      <p style="color:#475569;font-size:14px">This invite expires ${input.expiresAt.toUTCString()}.</p>
    </div>
  `;
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

export async function sendInviteEmail(input: InviteEmailInput): Promise<EmailResult> {
  return sendEmail({
    to: input.to,
    subject: `You're invited to ${input.companyName}`,
    text: textInvite(input),
    html: htmlInvite(input),
  });
}

export async function sendPasswordResetEmail(
  input: PasswordResetEmailInput,
): Promise<EmailResult> {
  return sendEmail({
    to: input.to,
    subject: "Reset your Folub & Samuel Labs HR password",
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

export async function sendVerificationEmail(
  input: VerificationEmailInput,
): Promise<EmailResult> {
  return sendEmail({
    to: input.to,
    subject: "Verify your Folub & Samuel Labs HR email",
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
        <p>Hi ${input.name}, verify your email to unlock sensitive HR actions.</p>
        <p><a href="${input.verificationLink}" style="display:inline-block;background:#020617;color:#fff;padding:10px 14px;border-radius:6px;text-decoration:none">Verify email</a></p>
        <p style="color:#475569;font-size:14px">This link expires ${input.expiresAt.toUTCString()}.</p>
      </div>
    `,
  });
}
