import nodemailer from "nodemailer";
import { Book } from "@/lib/data/books";

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
  const fromEmail = process.env.EMAIL_FROM || "AIVV Store <noreply@aivv.app>";

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

interface SendNewsletterWelcomeParams {
  to: string;
}

export const sendNewsletterWelcomeEmail = async ({ to }: SendNewsletterWelcomeParams) => {
  const transporter = createTransporter();
  const fromEmail = process.env.EMAIL_FROM || "AIVV Store <noreply@aivv.app>";

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to The Reader's Edition</title>
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
                      AIVV Store <span style="font-size: 10px; font-family: sans-serif; background-color: rgba(245,158,11,0.2); color: #f59e0b; padding: 2px 6px; border-radius: 4px; vertical-align: middle;">The Reader's Edition</span>
                    </div>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 36px 32px; font-family: sans-serif;">
                    <h1 style="font-family: 'Georgia', serif; font-size: 22px; font-weight: bold; color: #171615; margin: 0 0 12px 0;">
                      Welcome to The Reader's Edition! 📚
                    </h1>
                    <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 18px 0;">
                      Thank you for subscribing to our quiet monthly dispatch. You are now part of an independent community of modern builders, designers, and thinkers.
                    </p>
                    <p style="font-size: 14px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
                      Every month, we share curated title recommendations, deep-dive essays on digital product craft, exclusive discounts, and new release announcements.
                    </p>

                    <!-- Feature Box -->
                    <div style="background-color: #fcf9f4; border: 1px solid #f0e6d6; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                      <div style="font-size: 12px; font-weight: bold; color: #b45309; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; font-family: monospace;">
                        SUBSCRIBER ADVANTAGE
                      </div>
                      <p style="font-size: 13px; color: #374151; margin: 0; line-height: 1.5;">
                        Subscribers receive early access to new e-book releases and sample chapters 48 hours before public launch.
                      </p>
                    </div>

                    <p style="font-size: 12px; color: #6b7280; line-height: 1.5; margin: 0;">
                      You can unsubscribe at any time using the link at the bottom of any newsletter dispatch.
                    </p>
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
    console.log(`Newsletter Welcome Email dispatched to: ${to}`);
    console.log("=================================================");
    return { success: true, mode: "dev-log" };
  }

  const info = await transporter.sendMail({
    from: fromEmail,
    to,
    subject: "Welcome to The Reader's Edition | AIVV Store",
    html: htmlContent,
  });

  console.log(`[Nodemailer] Newsletter welcome email sent to ${to}. MessageId: ${info.messageId}`);
  return { success: true, messageId: info.messageId };
};

export interface SendNewBookReleaseParams {
  to: string;
  book: Book;
  storeUrl?: string;
  isTest?: boolean;
}

export const sendNewBookReleaseEmail = async ({
  to,
  book,
  storeUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  isTest = false,
}: SendNewBookReleaseParams) => {
  const transporter = createTransporter();
  const fromEmail = process.env.EMAIL_FROM || "AIVV Store <noreply@aivv.app>";
  const cleanStoreUrl = storeUrl.replace(/\/+$/, "");
  const bookUrl = `${cleanStoreUrl}/books/${encodeURIComponent(book.id)}`;
  const readingPreviewUrl = `${cleanStoreUrl}/books/${encodeURIComponent(book.id)}?preview=true`;

  const categoryLabel = book.category ? book.category.replace("-", " ").toUpperCase() : "E-BOOK";
  const badgeHtml = book.badge
    ? `<span style="display: inline-block; background-color: #f59e0b; color: #171615; font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 2px 8px; border-radius: 4px; font-family: monospace; margin-left: 6px;">${book.badge}</span>`
    : "";

  const discountHtml = book.originalPrice && book.discountPercent
    ? `<span style="text-decoration: line-through; color: #9ca3af; font-size: 14px; margin-left: 8px;">$${book.originalPrice.toFixed(2)}</span>
       <span style="display: inline-block; background-color: #ecfdf5; color: #047857; font-size: 11px; font-weight: bold; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">-${book.discountPercent}% OFF</span>`
    : "";

  const coverHtml = book.coverUrl
    ? `<div style="text-align: center; margin: 24px 0;">
         <img src="${book.coverUrl}" alt="${book.title}" style="max-width: 220px; width: 100%; height: auto; border-radius: 12px; box-shadow: 0 12px 30px rgba(0,0,0,0.15); border: 1px solid #e8e2d9;" />
       </div>`
    : `<div style="text-align: center; margin: 24px 0;">
         <div style="display: inline-block; width: 180px; height: 260px; background: linear-gradient(135deg, #1c1917 0%, #292524 100%); border-radius: 12px; padding: 20px; box-sizing: border-box; text-align: left; box-shadow: 0 12px 30px rgba(0,0,0,0.15); border: 1px solid #44403c;">
           <div style="font-size: 8px; color: #f59e0b; font-family: monospace; font-weight: bold; text-transform: uppercase; margin-bottom: 16px;">${categoryLabel}</div>
           <div style="font-family: Georgia, serif; font-size: 14px; font-weight: bold; color: #ffffff; line-height: 1.3; margin-bottom: 8px;">${book.title}</div>
           <div style="font-size: 10px; color: #a8a29e; font-style: italic;">By ${book.author}</div>
         </div>
       </div>`;

  const testBannerHtml = isTest
    ? `<div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 12px; margin-bottom: 24px; text-align: center;">
         <span style="font-size: 11px; font-weight: bold; color: #92400e; font-family: monospace;">⚠️ TEST PREVIEW EMAIL — ONLY SENT TO YOU AS ADMIN</span>
       </div>`
    : "";

  const subject = isTest
    ? `[TEST PREVIEW] New Release: "${book.title}" by ${book.author}`
    : `New Release: "${book.title}" is now available on AIVV Store 📚`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #faf8f5; font-family: 'Georgia', serif; color: #1a1918;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #faf8f5; padding: 36px 16px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border: 1px solid #e8e2d9; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 35px rgba(0,0,0,0.06);">
                
                <!-- Brand Top Header -->
                <tr>
                  <td style="background-color: #171615; padding: 24px 32px; text-align: center;">
                    <div style="font-size: 20px; font-weight: bold; color: #ffffff; letter-spacing: -0.5px;">
                      AIVV Store <span style="font-size: 10px; font-family: sans-serif; background-color: rgba(245,158,11,0.2); color: #f59e0b; padding: 3px 8px; border-radius: 4px; vertical-align: middle; margin-left: 6px;">New Release</span>
                    </div>
                  </td>
                </tr>

                <!-- Main Content Body -->
                <tr>
                  <td style="padding: 36px 32px; font-family: sans-serif;">
                    ${testBannerHtml}

                    <!-- Category & Badge -->
                    <div style="margin-bottom: 12px;">
                      <span style="display: inline-block; background-color: #f5f5f4; color: #57534e; font-size: 10px; font-weight: bold; text-transform: uppercase; padding: 3px 8px; border-radius: 6px; font-family: monospace; border: 1px solid #e7e5e4;">
                        ${categoryLabel}
                      </span>
                      ${badgeHtml}
                    </div>

                    <!-- Title & Author -->
                    <h1 style="font-family: 'Georgia', serif; font-size: 26px; font-weight: bold; color: #171615; margin: 0 0 6px 0; line-height: 1.25;">
                      ${book.title}
                    </h1>
                    <p style="font-size: 14px; color: #78716c; margin: 0 0 16px 0; font-style: italic;">
                      By <strong>${book.author}</strong>${book.authorRole ? ` · ${book.authorRole}` : ""}
                    </p>

                    <!-- Cover Artwork -->
                    ${coverHtml}

                    <!-- Synopsis Teaser -->
                    <div style="background-color: #fbf7ee; border-left: 3px solid #d97706; padding: 16px 20px; border-radius: 0 12px 12px 0; margin-bottom: 24px;">
                      <p style="font-family: 'Georgia', serif; font-size: 14px; line-height: 1.6; color: #292524; margin: 0;">
                        &ldquo;${book.synopsis ? book.synopsis.slice(0, 240) : "Discover our newest digital publication, available DRM-free for instant in-browser reading."}...&rdquo;
                      </p>
                    </div>

                    <!-- Book Specs Bar -->
                    <div style="display: flex; background-color: #f5f5f4; border-radius: 10px; padding: 12px 16px; margin-bottom: 28px; font-size: 11px; color: #44403c; font-family: monospace;">
                      <span>📄 ${book.pages} PAGES</span>
                      <span style="margin: 0 12px; color: #d6d3d1;">|</span>
                      <span>⏱️ ${book.readingTime} READ</span>
                      <span style="margin: 0 12px; color: #d6d3d1;">|</span>
                      <span>✨ PDF & EPUB DRM-FREE</span>
                    </div>

                    <!-- Pricing & Purchase Box -->
                    <div style="text-align: center; margin-bottom: 28px;">
                      <div style="margin-bottom: 16px;">
                        <span style="font-family: 'Georgia', serif; font-size: 28px; font-weight: bold; color: #171615;">
                          $${book.price.toFixed(2)}
                        </span>
                        ${discountHtml}
                      </div>

                      <!-- Primary CTA Button -->
                      <div>
                        <a href="${readingPreviewUrl}" target="_blank" style="display: inline-block; background-color: #171615; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 15px 36px; border-radius: 12px; border: 1px solid #d97706; box-shadow: 0 4px 14px rgba(0,0,0,0.15);">
                          Read Free Sample Chapter →
                        </a>
                      </div>

                      <div style="margin-top: 14px;">
                        <a href="${bookUrl}" target="_blank" style="font-size: 12px; color: #b45309; text-decoration: underline; font-weight: 600;">
                          Or view book details & formats on store
                        </a>
                      </div>
                    </div>

                    <p style="font-size: 12px; color: #78716c; line-height: 1.5; text-align: center; margin: 0;">
                      Instant digital delivery. Read immediately in your browser or load into your favorite Kindle / e-reader.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f6f2ec; padding: 24px; text-align: center; font-size: 11px; color: #78716c; border-top: 1px solid #e8e2d9; font-family: sans-serif;">
                    <p style="margin: 0 0 8px 0;">
                      You received this email because you are a registered reader or subscriber on <a href="${cleanStoreUrl}" style="color: #171615; font-weight: bold; text-decoration: none;">AIVV Store</a>.
                    </p>
                    <p style="margin: 0; color: #a8a29e;">
                      © ${new Date().getFullYear()} AIVV Store Inc. Independent Digital Publications.
                    </p>
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
    console.log(`New Release Email for "${book.title}" dispatched to: ${to}`);
    console.log(`Preview link: ${readingPreviewUrl}`);
    console.log("=================================================");
    return { success: true, mode: "dev-log" as const };
  }

  const info = await transporter.sendMail({
    from: fromEmail,
    to,
    subject,
    html: htmlContent,
  });

  console.log(`[Nodemailer] New release email for "${book.title}" sent to ${to}. MessageId: ${info.messageId}`);
  return { success: true, messageId: info.messageId, mode: "smtp" as const };
};
