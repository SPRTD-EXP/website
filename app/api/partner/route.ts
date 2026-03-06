import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { businessName, contactName, email, website, niche, tier, message } = await req.json();

  await resend.emails.send({
    from: 'SPRTD Solutions <noreply@sprtd.co>',
    to: 'info@sprtd.co',
    replyTo: email,
    subject: `[SPRTD PARTNERSHIP] ${businessName} — ${tier || 'Tier TBD'}`,
    text: `PARTNERSHIP INQUIRY\n\nBusiness: ${businessName}\nContact: ${contactName}\nEmail: ${email}\nWebsite: ${website || 'N/A'}\nNiche: ${niche}\nTier Interest: ${tier || 'Not specified'}\n\n${message}`,
  });

  return NextResponse.json({ ok: true });
}
