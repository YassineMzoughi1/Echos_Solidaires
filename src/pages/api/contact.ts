import type { APIRoute } from 'astro';
import { sendNotification } from '../../lib/mailer';
import { renderContactEmail, renderContactText, type ContactPayload } from '../../lib/emails/contact';
import { getString, isValidEmail, json } from '../../lib/validation';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Requête invalide.' }, 400);
  }

  const payload: ContactPayload = {
    nom_complet: getString(form, 'nom_complet', 160),
    email:       getString(form, 'email', 254),
    message:     getString(form, 'message', 5000),
  };

  if (!payload.nom_complet) {
    return json({ error: 'Veuillez renseigner votre nom complet.' }, 400);
  }
  if (!isValidEmail(payload.email)) {
    return json({ error: 'Adresse email invalide.' }, 400);
  }
  if (!payload.message || payload.message.length < 5) {
    return json({ error: 'Veuillez écrire un message.' }, 400);
  }

  try {
    await sendNotification({
      subject: `Message de ${payload.nom_complet} — site Échos Solidaires`,
      html: renderContactEmail(payload),
      text: renderContactText(payload),
      replyTo: payload.email,
    });
    return json({ ok: true });
  } catch (err) {
    console.error('[api/contact] mail error:', err);
    return json(
      { error: 'L’envoi a échoué. Veuillez réessayer dans quelques instants.' },
      502,
    );
  }
};
