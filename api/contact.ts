import type { IncomingMessage, ServerResponse } from 'node:http';
import nodemailer from 'nodemailer';

interface VercelRequest extends IncomingMessage {
  body?: unknown;
}

interface VercelResponse extends ServerResponse {
  status?: (code: number) => VercelResponse;
  json?: (data: unknown) => void;
}

const DEFAULT_CONTACT_RECIPIENTS = [
  'tugce.utku@insurup.com',
  'tugce.utku@acerpro.com.tr',
];

function getContactRecipients(): string[] {
  const configured = process.env.CONTACT_TO_EMAILS?.trim();
  if (!configured) return DEFAULT_CONTACT_RECIPIENTS;
  const list = configured
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length > 0 ? list : DEFAULT_CONTACT_RECIPIENTS;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sendJson(res: VercelResponse, statusCode: number, payload: unknown) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(statusCode).json(payload);
    return;
  }
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

async function readBody(req: VercelRequest): Promise<Record<string, unknown>> {
  if (req.body && typeof req.body === 'object') {
    return req.body as Record<string, unknown>;
  }
  if (typeof req.body === 'string') {
    return JSON.parse(req.body) as Record<string, unknown>;
  }
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  return raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, error: 'Method not allowed' });
    return;
  }

  try {
    const body = await readBody(req);

    if (typeof body.website === 'string' && body.website.trim() !== '') {
      sendJson(res, 200, { ok: true, recipients: getContactRecipients() });
      return;
    }

    const name = String(body.name || '').trim();
    const company = String(body.company || '').trim();
    const email = String(body.email || '').trim();
    const topic = String(body.topic || 'İletişim').trim();
    const message = String(body.message || '').trim();

    if (!name || !email || !message) {
      sendJson(res, 400, {
        ok: false,
        code: 'VALIDATION_ERROR',
        error: 'Lütfen ad soyad, e-posta ve mesaj alanlarını doldurun.',
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      sendJson(res, 400, {
        ok: false,
        code: 'INVALID_EMAIL',
        error: 'Lütfen geçerli bir e-posta adresi girin.',
      });
      return;
    }

    const recipients = getContactRecipients();
    const subject = `[tugceutku.com] ${topic} — ${name}`;
    const textBody = [
      'Web sitenizdeki iletişim formundan yeni bir mesaj geldi:',
      '',
      `Ad Soyad: ${name}`,
      `Şirket / Kurum: ${company || '-'}`,
      `E-posta: ${email}`,
      `İletişim Konusu: ${topic}`,
      '',
      'Mesaj:',
      message,
    ].join('\n');

    const htmlBody = `
      <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; color: #0f172a; line-height: 1.6;">
        <div style="padding: 20px 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px;">
          <p style="margin: 0 0 6px; font-size: 12px; font-weight: 600; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.04em;">
            Yeni İletişim Formu Mesajı
          </p>
          <h2 style="margin: 0 0 18px; font-size: 20px; color: #0f172a;">${escapeHtml(topic)}</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 18px;">
            <tr><td style="padding: 6px 0; color: #64748b; width: 140px;">Ad Soyad:</td><td style="padding: 6px 0; font-weight: 600; color: #0f172a;">${escapeHtml(name)}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Şirket / Kurum:</td><td style="padding: 6px 0; color: #0f172a;">${escapeHtml(company || '-')}</td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">E-posta:</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(email)}" style="color: #1d4ed8;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="padding: 6px 0; color: #64748b;">Konu:</td><td style="padding: 6px 0; color: #0f172a;">${escapeHtml(topic)}</td></tr>
          </table>
          <div style="padding: 14px 16px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; color: #334155; white-space: pre-wrap;">${escapeHtml(message)}</div>
        </div>
      </div>
    `;

    const resendApiKey = process.env.RESEND_API_KEY?.trim();
    if (resendApiKey) {
      const from =
        process.env.CONTACT_FROM_EMAIL?.trim() || 'Tuğçe Utku Web <onboarding@resend.dev>';
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to: recipients,
          reply_to: email,
          subject,
          text: textBody,
          html: htmlBody,
        }),
        signal: AbortSignal.timeout(12000),
      });

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`Resend error (${response.status}): ${errText}`);
      }

      sendJson(res, 200, { ok: true, recipients });
      return;
    }

    const smtpHost = process.env.SMTP_HOST?.trim();
    const smtpUser = process.env.SMTP_USER?.trim();
    const smtpPass = process.env.SMTP_PASS?.trim();
    if (smtpHost && smtpUser && smtpPass) {
      const smtpPort = Number(process.env.SMTP_PORT || 587);
      const smtpSecure = process.env.SMTP_SECURE === 'true' || smtpPort === 465;
      const from = process.env.CONTACT_FROM_EMAIL?.trim() || smtpUser;

      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from,
        to: recipients,
        replyTo: email,
        subject,
        text: textBody,
        html: htmlBody,
      });

      sendJson(res, 200, { ok: true, recipients });
      return;
    }

    sendJson(res, 503, {
      ok: false,
      code: 'MAIL_NOT_CONFIGURED',
      recipients,
      error: 'E-posta gönderim servisi henüz yapılandırılmadı.',
    });
  } catch (error) {
    console.error('Vercel /api/contact error:', error);
    sendJson(res, 502, {
      ok: false,
      code: 'DELIVERY_FAILED',
      recipients: getContactRecipients(),
      error: 'Mesaj gönderilirken geçici bir hata oluştu.',
    });
  }
}
