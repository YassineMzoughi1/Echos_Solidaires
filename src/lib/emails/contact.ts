import { emailShell, infoPair, blockQuote, escapeHtml, COLORS } from './shell';

export interface ContactPayload {
  nom_complet: string;
  email: string;
  message: string;
}

export function renderContactEmail(p: ContactPayload): string {
  const received = new Date().toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Africa/Tunis',
  });

  const body = `
    <p style="margin:0 0 18px 0;font-family:'Inter',Arial,sans-serif;font-size:14px;line-height:1.6;color:${COLORS.ink700};">
      Un nouveau message a été envoyé via le formulaire de contact du site.
    </p>

    ${infoPair(
      { label: 'Nom complet', value: p.nom_complet },
      { label: 'Email', value: p.email },
    )}

    ${blockQuote(p.message)}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:18px 0 4px 0;">
      <tr>
        <td style="padding:14px 18px;background:${COLORS.cream};border:1px dashed ${COLORS.forest};border-radius:10px;font-family:'Inter',Arial,sans-serif;font-size:12px;color:${COLORS.ink700};">
          <strong style="color:${COLORS.indigo};">Reçu le :</strong> ${escapeHtml(received)}<br/>
          <strong style="color:${COLORS.indigo};">Répondre à :</strong>
          <a href="mailto:${escapeHtml(p.email)}" style="color:${COLORS.argile};text-decoration:underline;">${escapeHtml(p.email)}</a>
        </td>
      </tr>
    </table>
  `;

  return emailShell({
    title: `Message de ${p.nom_complet}`,
    badge: 'Contact',
    preheader: `${p.nom_complet} · ${p.email}`,
    accent: COLORS.forest,
    body,
  });
}

export function renderContactText(p: ContactPayload): string {
  return [
    'Nouveau message — Échos Solidaires',
    '',
    `Nom    : ${p.nom_complet}`,
    `Email  : ${p.email}`,
    '',
    'Message :',
    p.message,
  ].join('\n');
}
