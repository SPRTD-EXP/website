'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/products';

type Tab = 'OVERVIEW' | 'ORDERS' | 'PROFILE';

type Order = {
  id: string;
  total_cents: number;
  status: string;
  created_at: string;
};

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<Tab>('OVERVIEW');

  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
    supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setOrders(data); });
  }, [user, router]);

  async function handleSignOut() {
    await signOut();
    router.push('/');
  }

  if (!user) return null;

  const initials = user.email ? user.email.slice(0, 2).toUpperCase() : '??';
  const memberSince = new Date(user.created_at ?? Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();


  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Label */}
      <div className="pt-[72px] pb-0 text-center border-b border-border">
        <p className="label mb-5" style={{ fontSize: '8px', letterSpacing: '0.3em', paddingLeft: '0.3em', color: '#fff3af' }}>ACCOUNT</p>
      </div>

      {/* ── OVERVIEW ── */}
      {tab === 'OVERVIEW' && (
        <section className="flex-1 border-b border-border">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr_1px_1fr] divide-y lg:divide-y-0 divide-border h-full" style={{ minHeight: 'calc(100vh - 160px)' }}>

            <div className="flex flex-col items-center justify-center gap-4 py-14 px-8">
              <div className="flex items-center justify-center rounded-full bg-border" style={{ width: 72, height: 72 }}>
                <span style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '22px', color: '#f5f0e8', letterSpacing: '2px' }}>
                  {initials}
                </span>
              </div>
              <div className="text-center">
                <p className="heading" style={{ fontSize: '18px', letterSpacing: '4px' }}>MEMBER</p>
                <p className="label mt-1" style={{ fontSize: '9px', letterSpacing: '0.15em' }}>{user.email}</p>
              </div>
            </div>

            <div className="hidden lg:block bg-border" />

            <div className="flex flex-col items-center justify-center gap-6 py-14 px-8">
              <div className="text-center">
                <p className="text-gold" style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '32px' }}>{orders.length}</p>
                <p className="label mt-1" style={{ fontSize: '8px', letterSpacing: '0.2em', opacity: 1 }}>ORDERS PLACED</p>
              </div>
              <div className="w-px h-6 bg-border" />
              <div className="text-center">
                <p className="text-gold" style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '32px' }}>{itemCount}</p>
                <p className="label mt-1" style={{ fontSize: '8px', letterSpacing: '0.2em', opacity: 1 }}>ITEMS IN CART</p>
              </div>
            </div>

            <div className="hidden lg:block bg-border" />

            <div className="flex flex-col items-center justify-center gap-6 py-14 px-8">
              <div className="text-center">
                <p className="label" style={{ fontSize: '8px', letterSpacing: '0.2em', opacity: 1 }}>MEMBER SINCE</p>
                <p className="heading mt-2" style={{ fontSize: '14px', letterSpacing: '3px' }}>{memberSince}</p>
              </div>
              <div className="flex flex-col gap-3 w-full max-w-[180px]">
                <Link
                  href="/shop"
                  className="w-full py-3 text-center uppercase tracking-[0.2em] transition-all duration-200 hover:brightness-90"
                  style={{ background: '#fff3af', color: '#111', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '9px' }}
                >
                  SHOP NOW
                </Link>
                <button
                  onClick={() => setTab('ORDERS')}
                  className="w-full py-3 uppercase tracking-[0.2em] transition-all hover:text-gold"
                  style={{ border: '1px solid rgba(245,240,232,0.15)', color: '#f5f0e8', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '9px' }}
                >
                  VIEW ORDERS
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ORDERS ── */}
      {tab === 'ORDERS' && (
        <section className="flex-1 py-16 px-6 md:px-16">
          <p className="label mb-8" style={{ fontSize: '9px', letterSpacing: '0.25em', opacity: 1 }}>ORDER HISTORY</p>
          {orders.length === 0 ? (
            <div className="flex flex-col items-start gap-4 py-8">
              <p className="heading" style={{ fontSize: '28px', letterSpacing: '4px' }}>NOTHING YET</p>
              <Link href="/shop" className="discover-btn uppercase tracking-[0.22em]">START SHOPPING</Link>
            </div>
          ) : (
            <div className="border-t border-border">
              {orders.map(order => (
                <div key={order.id} className="grid grid-cols-[1fr_auto] items-center py-5 border-b border-border gap-6">
                  <div className="flex flex-col gap-1">
                    <p className="text-foreground uppercase tracking-[0.15em]" style={{ fontWeight: 300, fontSize: '11px' }}>
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                    </p>
                    <p className="uppercase tracking-[0.12em]" style={{ fontWeight: 300, fontSize: '8px', color: '#f5f0e8' }}>
                      {order.status}
                    </p>
                  </div>
                  <p className="text-gold" style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '1px' }}>
                    {formatPrice(order.total_cents)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── PROFILE ── */}
      {tab === 'PROFILE' && (
        <section className="flex-1 py-16 px-6 md:px-16 max-w-xl">
          <p className="label mb-10" style={{ fontSize: '9px', letterSpacing: '0.25em', opacity: 1 }}>PROFILE</p>

          <div className="flex flex-col gap-8">
            <div className="border-b border-border pb-6">
              <p className="label mb-2" style={{ fontSize: '8px', letterSpacing: '0.2em', opacity: 1 }}>EMAIL</p>
              <p className="text-foreground" style={{ fontWeight: 300, fontSize: '13px', letterSpacing: '1px' }}>{user.email}</p>
            </div>

            <div className="border-b border-border pb-6">
              <p className="label mb-2" style={{ fontSize: '8px', letterSpacing: '0.2em', opacity: 1 }}>MEMBER SINCE</p>
              <p className="text-foreground" style={{ fontWeight: 300, fontSize: '13px', letterSpacing: '1px' }}>{memberSince}</p>
            </div>

            <div className="border-b border-border pb-6">
              <p className="label mb-2" style={{ fontSize: '8px', letterSpacing: '0.2em', opacity: 1 }}>USER ID</p>
              <p style={{ fontWeight: 300, fontSize: '10px', letterSpacing: '1px', color: '#f5f0e8', fontFamily: 'monospace' }}>{user.id}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="mt-12 uppercase tracking-[0.2em] py-3 px-8 transition-all hover:text-gold"
            style={{ border: '1px solid rgba(245,240,232,0.15)', color: '#f5f0e8', fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '9px' }}
          >
            SIGN OUT
          </button>
        </section>
      )}

      <Footer />
    </main>
  );
}
