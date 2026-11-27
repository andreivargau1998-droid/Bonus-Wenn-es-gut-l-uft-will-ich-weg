// Funzione serverless Vercel: è il VERO gate.
// Il link del bonus esce da qui solo dopo che il foglio Google ha confermato la scrittura.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function clean(v, max) {
  return String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const { GOOGLE_SCRIPT_URL, APPS_SCRIPT_SECRET, BONUS_DRIVE_URL, BONUS_URL } = process.env;
  const bonusUrl = BONUS_DRIVE_URL || BONUS_URL;
  if (!GOOGLE_SCRIPT_URL || !APPS_SCRIPT_SECRET || !bonusUrl) {
    return res.status(500).json({ ok: false, error: 'server_not_configured' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (e) { body = null; }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'invalid_body' });
  }

  // Honeypot: se un bot compila il campo nascosto, rispondiamo "ok" finto SENZA link e senza scrivere nulla.
  if (clean(body.website, 200) !== '') {
    return res.status(200).json({ ok: false, error: 'rejected' });
  }

  const vorname = clean(body.vorname, 80);
  const nachname = clean(body.nachname, 80);
  const email = clean(body.email, 160).toLowerCase();
  const consent = body.consent === true;

  if (!vorname || !nachname || !EMAIL_RE.test(email) || !consent) {
    return res.status(400).json({ ok: false, error: 'invalid_input' });
  }

  try {
    const upstream = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        secret: APPS_SCRIPT_SECRET,
        vorname,
        nachname,
        email,
        consent: true,
        buch: 'Wenn es gut läuft, will ich weg',
        timestamp: new Date().toISOString()
      }),
      redirect: 'follow'
    });
    if (!upstream.ok) {
      return res.status(502).json({ ok: false, error: 'upstream_failed' });
    }
    let data = null;
    try { data = await upstream.json(); } catch (e) { data = null; }
    if (!data || data.ok !== true) {
      return res.status(502).json({ ok: false, error: 'upstream_rejected' });
    }
    return res.status(200).json({ ok: true, bonusUrl });
  } catch (e) {
    return res.status(502).json({ ok: false, error: 'upstream_unreachable' });
  }
};
