import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const { items } = await req.json() as {
    items: { name: string; priceCents: number; quantity: number; size: string; slug: string }[];
  };

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const origin = req.headers.get('origin') ?? process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: items.map(item => ({
      price_data: {
        currency: 'usd',
        unit_amount: item.priceCents,
        product_data: {
          name: `${item.name} — ${item.size}`,
        },
      },
      quantity: item.quantity,
    })),
    success_url: `${origin}/order-confirmed?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    metadata: {
      items: JSON.stringify(items.map(i => ({
        slug: i.slug,
        name: i.name,
        size: i.size,
        quantity: i.quantity,
        priceCents: i.priceCents,
      }))),
    },
  });

  return NextResponse.json({ url: session.url });
}
