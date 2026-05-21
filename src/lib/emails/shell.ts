/**
 * Email shell — brand-styled, table-based HTML compatible with most clients
 * (Gmail web/iOS/Android, Apple Mail, Outlook 2016+/365).
 *
 * Brand tokens are duplicated inline because most email clients strip <style>.
 */

const COLORS = {
  cream: '#F9F1E4',
  sable: '#E8DBB7',
  indigo: '#1A2639',
  argile: '#C96C4B',
  forest: '#3F6B52',
  oasis: '#99C78C',
  ink900: '#0F1419',
  ink700: '#2A2F3A',
  ink500: '#6B7280',
  ink300: '#C8C2B6',
  hairline: '#EEE5D2',
} as const;

export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface ShellOpts {
  title: string;
  preheader?: string;
  badge?: string;
  accent?: string;
  /** Pre-built HTML for the body content (between title and footer). */
  body: string;
}

export function emailShell(opts: ShellOpts): string {
  const accent = opts.accent ?? COLORS.argile;
  const preheader = opts.preheader
    ? `<div style="display:none;font-size:1px;color:${COLORS.cream};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;mso-hide:all;">${escapeHtml(opts.preheader)}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <title>${escapeHtml(opts.title)}</title>
  </head>
  <body style="margin:0;padding:0;background:${COLORS.cream};font-family:'Inter','Helvetica Neue',Arial,sans-serif;color:${COLORS.ink700};-webkit-font-smoothing:antialiased;">
    ${preheader}
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:${COLORS.cream};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid rgba(26,38,57,0.08);box-shadow:0 6px 24px rgba(26,38,57,0.05);">
            <!-- Header -->
            <tr>
              <td style="background:${COLORS.indigo};padding:24px 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                  <tr>
                    <td style="font-family:'Inter',Arial,sans-serif;font-size:13px;letter-spacing:0.22em;text-transform:uppercase;color:${COLORS.cream};font-weight:700;">
                      Échos Solidaires
                    </td>
                    <td align="right" style="font-family:'Inter',Arial,sans-serif;font-size:11px;color:rgba(249,241,228,0.6);letter-spacing:0.08em;text-transform:uppercase;">
                      ${escapeHtml(opts.badge ?? 'Notification')}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Accent stripe -->
            <tr><td style="height:4px;line-height:4px;font-size:0;background:${accent};">&nbsp;</td></tr>

            <!-- Title block -->
            <tr>
              <td style="padding:36px 32px 6px 32px;font-family:'Inter',Arial,sans-serif;">
                <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:${COLORS.ink500};font-weight:600;">
                  Nouveau message du site
                </p>
                <h1 style="margin:0;font-size:26px;line-height:1.2;font-weight:700;color:${accent};">
                  ${escapeHtml(opts.title)}
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:24px 32px 4px 32px;">
                ${opts.body}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:24px 32px 28px 32px;border-top:1px solid ${COLORS.hairline};font-family:'Inter',Arial,sans-serif;font-size:12px;line-height:1.6;color:${COLORS.ink500};">
                <p style="margin:0;">Notification automatique — site Échos Solidaires.</p>
                <p style="margin:6px 0 0 0;">26 – 27 Avril 2027 · Nefta, Tunisie</p>
              </td>
            </tr>
          </table>

          <p style="margin:16px 0 0 0;font-family:'Inter',Arial,sans-serif;font-size:11px;color:${COLORS.ink500};text-align:center;">
            Vous recevez ce message car le site Échos Solidaires est configuré pour vous notifier des soumissions.
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** A labeled value row — label above, value in a cream-tinted card. */
export function infoRow(label: string, value: string | null | undefined): string {
  const safeValue = value == null || String(value).trim() === ''
    ? `<span style="color:${COLORS.ink500};font-style:italic;">— non renseigné</span>`
    : escapeHtml(value);
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 12px 0;">
      <tr>
        <td style="font-family:'Inter',Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.ink500};font-weight:700;padding:0 4px 6px 4px;">
          ${escapeHtml(label)}
        </td>
      </tr>
      <tr>
        <td style="font-family:'Inter',Arial,sans-serif;font-size:15px;line-height:1.5;color:${COLORS.ink700};font-weight:500;padding:12px 16px;background:${COLORS.cream};border:1px solid ${COLORS.hairline};border-radius:8px;">
          ${safeValue}
        </td>
      </tr>
    </table>`;
}

/** Two info rows side by side on desktop, stacked on mobile (best-effort). */
export function infoPair(left: { label: string; value: string | null | undefined }, right: { label: string; value: string | null | undefined }): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td style="padding:0 6px 0 0;vertical-align:top;width:50%;">${infoRow(left.label, left.value)}</td>
        <td style="padding:0 0 0 6px;vertical-align:top;width:50%;">${infoRow(right.label, right.value)}</td>
      </tr>
    </table>`;
}

/** Highlight card — used for free-form text (e.g. contact messages). */
export function blockQuote(text: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 16px 0;">
      <tr>
        <td style="font-family:'Inter',Arial,sans-serif;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${COLORS.ink500};font-weight:700;padding:0 4px 6px 4px;">
          Message
        </td>
      </tr>
      <tr>
        <td style="font-family:'Inter',Arial,sans-serif;font-size:15px;line-height:1.7;color:${COLORS.ink700};padding:18px 20px;background:${COLORS.sable};border-left:4px solid ${COLORS.argile};border-radius:8px;white-space:pre-wrap;">
          ${escapeHtml(text)}
        </td>
      </tr>
    </table>`;
}

export { COLORS };
