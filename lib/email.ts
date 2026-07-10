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

export async function sendInviteEmail(input: InviteEmailInput): Promise<EmailResult> {
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
            ToAddresses: [input.to],
          },
          Content: {
            Simple: {
              Subject: {
                Data: `You're invited to ${input.companyName}`,
              },
              Body: {
                Text: {
                  Data: textInvite(input),
                },
                Html: {
                  Data: htmlInvite(input),
                },
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
      error: "Configure AWS_SES_REGION or RESEND_API_KEY for invite emails.",
    };
  }

  try {
    const response = await new Resend(resendKey).emails.send({
      from,
      to: input.to,
      subject: `You're invited to ${input.companyName}`,
      text: textInvite(input),
      html: htmlInvite(input),
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
