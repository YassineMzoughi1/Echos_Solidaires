import nodemailer from 'nodemailer';

// In Astro dev, `.env` is exposed via `import.meta.env`; on Vercel SSR runtime
// it's also in `process.env`. Read from both so the same code path works in
// both environments.
const env = (key: string): string | undefined => {
  const meta = (import.meta as { env?: Record<string, string | undefined> }).env;
  return meta?.[key] ?? process.env[key];
};

function requireEnv(key: string): string {
  const v = env(key);
  if (!v) throw new Error(`Missing required env var: ${key}`);
  return v;
}

let cached: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (cached) return cached;
  cached = nodemailer.createTransport({
    host: requireEnv('SMTP_HOST'),
    port: Number(env('SMTP_PORT') ?? '465'),
    secure: (env('SMTP_SECURE') ?? 'true') === 'true',
    auth: {
      user: requireEnv('SMTP_USER'),
      pass: requireEnv('SMTP_PASS'),
    },
  });
  return cached;
}

export interface SendOpts {
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export async function sendNotification(opts: SendOpts): Promise<void> {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: env('SMTP_FROM') ?? env('SMTP_USER'),
    to: requireEnv('NOTIFY_EMAIL'),
    subject: opts.subject,
    html: opts.html,
    text: opts.text,
    replyTo: opts.replyTo,
  });
}
