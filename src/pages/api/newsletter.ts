import type { APIRoute } from 'astro';
import { sendNotification } from '../../lib/mailer';
import { renderNewsletterEmail, renderNewsletterText, type NewsletterPayload } from '../../lib/emails/newsletter';
import { getString, isValidEmail, json } from '../../lib/validation';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ error: 'Requête invalide.' }, 400);
  }

  const payload: NewsletterPayload = {
    email: getString(form, 'email', 254),
  };

  if (!isValidEmail(payload.email)) {
    return json({ error: 'Adresse email invalide.' }, 400);
  }

  try {
    await sendNotification({
      subject: `Nouvel abonné newsletter — ${payload.email}`,
      html: renderNewsletterEmail(payload),
      text: renderNewsletterText(payload),
      replyTo: payload.email,
    });
    return json({ ok: true });
  } catch (err) {
    console.error('[api/newsletter] mail error:', err);
    return json(
      { error: 'L’envoi a échoué. Veuillez réessayer dans quelques instants.' },
      502,
    );
  }
};
