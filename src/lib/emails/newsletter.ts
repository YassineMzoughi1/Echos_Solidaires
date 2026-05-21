import { emailShell, infoRow, escapeHtml, COLORS } from './shell';

export interface NewsletterPayload {
  email: string;
}

export function renderNewsletterEmail(p: NewsletterPayload): string {
  const received = new Date().toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Africa/Tunis',
  });

  const body = `
    <p style="margin:0 0 18px 0;font-family:'Inter',Arial,sans-serif;font-size:14px;line-height:1.6;color:${COLORS.ink700};">
      Une personne souhaite être tenue informée des actualités et prochains
      événements d’Échos Solidaires. Pensez à l’ajouter à votre liste de diffusion.
    </p>

    ${infoRow('Adresse email', p.email)}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:18px 0 4px 0;">
      <tr>
        <td style="padding:14px 18px;background:${COLORS.cream};border:1px dashed ${COLORS.oasis};border-radius:10px;font-family:'Inter',Arial,sans-serif;font-size:12px;color:${COLORS.ink700};">
          <strong style="color:${COLORS.indigo};">Reçu le :</strong> ${escapeHtml(received)}<br/>
          <strong style="color:${COLORS.indigo};">Source :</strong> formulaire « Newsletter » du pied de page<br/>
          <strong style="color:${COLORS.indigo};">Contact direct :</strong>
          <a href="mailto:${escapeHtml(p.email)}" style="color:${COLORS.argile};text-decoration:underline;">${escapeHtml(p.email)}</a>
        </td>
      </tr>
    </table>

    <p style="margin:18px 0 4px 0;font-family:'Inter',Arial,sans-serif;font-size:13px;color:${COLORS.ink500};line-height:1.6;">
      Cette personne a explicitement demandé à recevoir vos communications.
      Vous pouvez lui envoyer la prochaine annonce du rassemblement.
    </p>
  `;

  return emailShell({
    title: 'Nouvel abonné à la newsletter',
    badge: 'Newsletter',
    preheader: `${p.email} souhaite être informé(e) des prochains événements.`,
    accent: COLORS.oasis,
    body,
  });
}

export function renderNewsletterText(p: NewsletterPayload): string {
  return [
    'Nouvel abonné — Newsletter Échos Solidaires',
    '',
    `Email : ${p.email}`,
    '',
    'Cette personne souhaite recevoir vos prochaines communications.',
  ].join('\n');
}
