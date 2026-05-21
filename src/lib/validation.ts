// Lightweight server-side validation helpers for form endpoints.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function getString(form: FormData, key: string, max = 500): string {
  const raw = form.get(key);
  if (typeof raw !== 'string') return '';
  return raw.trim().slice(0, max);
}

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value) && value.length <= 254;
}

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
