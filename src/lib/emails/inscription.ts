import { emailShell, infoRow, infoPair, escapeHtml, COLORS } from './shell';

export interface InscriptionPayload {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
  participants?: string;
  paiement?: string;
}

const PAYMENT_LABELS: Record<string, string> = {
  cb: 'Carte bancaire',
  d17: 'D17 / Mobile money',
  virement: 'Virement bancaire',
  place: 'Paiement sur place',
};

export function renderInscriptionEmail(p: InscriptionPayload): string {
  const paiementLabel = p.paiement ? (PAYMENT_LABELS[p.paiement] ?? p.paiement) : '';
  const fullName = `${p.prenom} ${p.nom}`.trim();
  const received = new Date().toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Africa/Tunis',
  });

  const body = `
    <p style="margin:0 0 18px 0;font-family:'Inter',Arial,sans-serif;font-size:14px;line-height:1.6;color:${COLORS.ink700};">
      Une nouvelle personne s’est inscrite au rassemblement Échos Solidaires.
      Voici le détail de sa participation :
    </p>

    ${infoPair(
      { label: 'Nom', value: p.nom },
      { label: 'Prénom', value: p.prenom },
    )}

    ${infoPair(
      { label: 'Email', value: p.email },
      { label: 'Téléphone', value: p.telephone },
    )}

    ${infoRow('Adresse', p.adresse)}

    ${infoPair(
      { label: 'Nombre de participants', value: p.participants ?? '1' },
      { label: 'Moyen de paiement', value: paiementLabel },
    )}

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:18px 0 4px 0;">
      <tr>
        <td style="padding:14px 18px;background:${COLORS.cream};border:1px dashed ${COLORS.argile};border-radius:10px;font-family:'Inter',Arial,sans-serif;font-size:12px;color:${COLORS.ink700};">
          <strong style="color:${COLORS.indigo};">Reçue le :</strong> ${escapeHtml(received)}<br/>
          <strong style="color:${COLORS.indigo};">Action suggérée :</strong>
          répondre à <a href="mailto:${escapeHtml(p.email)}" style="color:${COLORS.argile};text-decoration:underline;">${escapeHtml(p.email)}</a>
          sous 48 h avec la confirmation et les modalités d’accueil.
        </td>
      </tr>
    </table>

    <p style="margin:18px 0 4px 0;font-family:'Inter',Arial,sans-serif;font-size:13px;color:${COLORS.ink500};line-height:1.6;">
      Cette inscription a été envoyée par
      <strong style="color:${COLORS.ink700};">${escapeHtml(fullName) || 'un visiteur'}</strong>
      via le formulaire de la page <code style="background:${COLORS.sable};padding:1px 5px;border-radius:4px;font-size:12px;">/inscription</code>.
    </p>
  `;

  return emailShell({
    title: `Nouvelle inscription — ${fullName}`,
    badge: 'Inscription',
    preheader: `${fullName} · ${p.email} · ${p.telephone}`,
    accent: COLORS.argile,
    body,
  });
}

/** Plain-text fallback for email clients that prefer it. */
export function renderInscriptionText(p: InscriptionPayload): string {
  const paiementLabel = p.paiement ? (PAYMENT_LABELS[p.paiement] ?? p.paiement) : '—';
  return [
    'Nouvelle inscription — Échos Solidaires',
    '',
    `Nom            : ${p.nom}`,
    `Prénom         : ${p.prenom}`,
    `Email          : ${p.email}`,
    `Téléphone      : ${p.telephone}`,
    `Adresse        : ${p.adresse ?? '—'}`,
    `Participants   : ${p.participants ?? '1'}`,
    `Moyen paiement : ${paiementLabel}`,
  ].join('\n');
}
