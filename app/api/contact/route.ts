import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { firstName, lastName, email, subject, message } = await req.json();

  await resend.emails.send({
    from: 'SPRTD Contact <noreply@sprtd.co>',
    to: 'info@sprtd.co',
    replyTo: email,
    subject: `[SPRTD] ${subject}`,
    text: `From: ${firstName} ${lastName} <${email}>\n\n${message}`,
  });

  return NextResponse.json({ ok: true });
}