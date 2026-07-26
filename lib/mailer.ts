import nodemailer from "nodemailer";

interface SendMagicLinkParams {
  to: string;
  url: string;
}

// Create Nodemailer Transporter using environment variables
export const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

export const sendMagicLinkEmail = async ({ to, url }: SendMagicLinkParams) => {
  const transporter = createTransporter();
  const fromEmail = process.env.EMAIL_FROM || "AIVV Store <noreply@aivvstore.com>";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign in to AIVV Store</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: 'Georgia', serif; color: #1a1918;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf8f5; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="540" border="0" cellspacing="0" cellpadding="0" style="max-width: 540px; background-color: #ffffff; border: 1px solid #e8e2d9; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color: #171615; padding: 28px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: -0.5px;">
                      AIVV Store <span style="font-size: 10px; font-family: sans-serif; background-color: rgba(245,158,11,0.2); color: #f59e0b; padding: 2px 6px; border-radius: 4px; vertical-align: middle;">Digital</span>
                    </div>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 36px 32px; font-family: sans-serif;">
                    <h1 style="font-family: 'Georgia', serif; font-size: 22px; font-weight: bold; color: #171615; margin: 0 0 12px 0;">
                      Sign in to your library
                    </h1>
                    <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
                      Click the button below to sign in to your <strong>AIVV Store</strong> account. This passwordless magic link will grant instant access to your in-browser reader and DRM-free downloads.
                    </p>

                    <!-- Button CTA -->
                    <div style="text-align: center; margin: 32px 0;">
                      <a href="${url}" target="_blank" style="display: inline-block; background-color: #171615; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 14px 28px; border-radius: 12px; border: 1px solid #d97706;">
                        Sign In to AIVV Store →
                      </a>
                    </div>

                    <p style="font-size: 12px; color: #6b7280; line-height: 1.5; margin: 24px 0 0 0;">
                      If you did not request this email, you can safely ignore it. The link will expire shortly for security.
                    </p>

                    <!-- Fallback URL text -->
                    <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #f3ebd9; font-size: 11px; color: #9ca3af; word-break: break-all;">
                      Or copy and paste this link into your browser:<br>
                      <a href="${url}" style="color: #d97706; text-decoration: underline;">${url}</a>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f6f2ec; padding: 20px; text-align: center; font-size: 11px; color: #78716c; border-top: 1px solid #e8e2d9;">
                    © ${new Date().getFullYear()} AIVV Store Inc. Digital Ebook Marketplace.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  if (!transporter) {
    console.log("=================================================");
    console.log(`[Nodemailer Dev Mode] SMTP not configured in .env.`);
    console.log(`Magic link for ${to}:`);
    console.log(url);
    console.log("=================================================");
    return { success: true, mode: "dev-log" };
  }

  const info = await transporter.sendMail({
    from: fromEmail,
    to,
    subject: "Sign in to AIVV Store",
    html: htmlContent,
  });

  console.log(`[Nodemailer] Magic link email sent to ${to}. MessageId: ${info.messageId}`);
  return { success: true, messageId: info.messageId };
};
