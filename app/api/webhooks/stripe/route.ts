import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  // Use service role key so webhook can write orders bypassing RLS
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook signature verification failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    await handleCheckoutComplete(session, supabaseAdmin);
  }

  return NextResponse.json({ received: true });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleCheckoutComplete(session: Stripe.Checkout.Session, supabaseAdmin: any) {
  const totalCents = session.amount_total ?? 0;
  const userId = session.client_reference_id ?? null;
  const rawItems = session.metadata?.items;

  if (!rawItems) return;

  type OrderLineItem = {
    slug: string;
    name: string;
    size: string;
    quantity: number;
    priceCents: number;
  };

  const items: OrderLineItem[] = JSON.parse(rawItems);

  // Create order row
  const { data: order, error: orderErr } = await supabaseAdmin
    .from('orders')
    .insert({ user_id: userId, total_cents: totalCents, status: 'paid', stripe_session_id: session.id })
    .select('id')
    .single();

  if (orderErr || !order) {
    console.error('Failed to insert order:', orderErr);
    return;
  }

  // Look up product IDs by slug
  const slugs = [...new Set(items.map(i => i.slug))];
  const { data: products } = await supabaseAdmin
    .from('products')
    .select('id, slug')
    .in('slug', slugs);

  const slugToId = new Map((products ?? []).map((p: { id: number; slug: string }) => [p.slug, p.id]));

  // Insert order items
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: slugToId.get(item.slug) ?? null,
    size: item.size,
    quantity: item.quantity,
    price_cents: item.priceCents,
  }));

  const { error: itemsErr } = await supabaseAdmin.from('order_items').insert(orderItems);
  if (itemsErr) console.error('Failed to insert order items:', itemsErr);
}
