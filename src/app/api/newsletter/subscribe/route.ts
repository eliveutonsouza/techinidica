import { NextResponse, type NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NewsletterSubscribeSchema } from '@/schemas';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Body inválido' }, { status: 400 });
  }

  const parsed = NewsletterSubscribeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.errors[0]?.message ?? 'E-mail inválido' }, { status: 400 });
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: { ativo: true },
      create: { email: parsed.data.email, ativo: true },
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Erro ao salvar e-mail.' }, { status: 500 });
  }

  // Enviar e-mail de boas-vindas via Resend (se configurado)
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? 'TechIndica <noreply@techinidica.com>',
        to: parsed.data.email,
        subject: 'Bem-vindo às ofertas TechIndica!',
        html: `
          <h2>Olá!</h2>
          <p>Você está inscrito nas ofertas TechIndica. Em breve você receberá curadoria semanal dos melhores produtos de tecnologia com os melhores preços.</p>
          <p>Acesse: <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://techinidica.com'}">techinidica.com</a></p>
          <hr />
          <p style="font-size:12px;color:#666">Para cancelar a inscrição, responda este e-mail com "cancelar".</p>
        `,
      }),
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true });
}
