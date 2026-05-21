import type { APIRoute } from 'astro';
import { sendNotification } from '../../lib/mailer';
import { renderInscriptionEmail, renderInscriptionText, type InscriptionPayload } from '../../lib/emails/inscription';
import { getString, isValidEmail, json } from '../../lib/validation';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Requête invalide.' }, 400);
  }

  const payload: InscriptionPayload = {
    nom:          getString(form, 'nom', 120),
    prenom:       getString(form, 'prenom', 120),
    email:        getString(form, 'email', 254),
    telephone:    getString(form, 'telephone', 40),
    adresse:      getString(form, 'adresse', 300),
    participants: getString(form, 'participants', 10),
    paiement:     getString(form, 'paiement', 40),
  };

  // Validation
  if (!payload.nom || !payload.prenom) {
    return json({ error: 'Veuillez renseigner votre nom et prénom.' }, 400);
  }
  if (!isValidEmail(payload.email)) {
    return json({ error: 'Adresse email invalide.' }, 400);
  }
  if (!payload.telephone) {
    return json({ error: 'Veuillez renseigner un numéro de téléphone.' }, 400);
  }

  try {
    await sendNotification({
      subject: `Nouvelle inscription — ${payload.prenom} ${payload.nom}`,
      html: renderInscriptionEmail(payload),
      text: renderInscriptionText(payload),
      replyTo: payload.email,
    });
    return json({ ok: true });
  } catch (err) {
    console.error('[api/inscription] mail error:', err);
    return json(
      { error: 'L’envoi a échoué. Veuillez réessayer dans quelques instants.' },
      502,
    );
  }
};
