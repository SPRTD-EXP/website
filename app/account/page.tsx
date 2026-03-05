'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../lib/products';

type Order = {
  id: string;
  total_cents: number;
  status: string;
  created_at: string;
};

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);

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

  return (
    <main className="min-h-screen bg-[#111]">
      <Navbar />

      <div
        className="pt-24 px-6 pb-16 md:pt-32 md:px-16 md:pb-24 max-w-2xl"
        style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
      >
        <h1
          className="text-[#fffeca] uppercase tracking-[6px]"
          style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: 'clamp(36px, 8vw, 56px)' }}
        >
          ACCOUNT
        </h1>
        <p
          className="mt-2 text-[#f5f0e8]/40 tracking-[2px]"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '11px' }}
        >
          {user.email}
        </p>
        <hr className="mt-8 border-[#2a2a2a]" />

        {/* Order history */}
        <div className="mt-10">
          <p
            className="text-[#f5f0e8]/40 uppercase tracking-[0.22em] mb-6"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '9px' }}
          >
            ORDER HISTORY
          </p>

          {orders.length === 0 ? (
            <p
              className="text-[#f5f0e8]/20 uppercase tracking-[0.2em]"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '9px' }}
            >
              NO ORDERS YET
            </p>
          ) : (
            <div className="flex flex-col border-t border-[#2a2a2a]">
              {orders.map(order => (
                <div key={order.id} className="flex items-center justify-between py-4 border-b border-[#2a2a2a]">
                  <div className="flex flex-col gap-1">
                    <p
                      className="text-[#f5f0e8] uppercase tracking-[0.15em]"
                      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '10px' }}
                    >
                      {new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                    </p>
                    <p
                      className="text-[#f5f0e8]/30 uppercase tracking-[0.12em]"
                      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '8px' }}
                    >
                      {order.status}
                    </p>
                  </div>
                  <p
                    className="text-[#fff3af]"
                    style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '11px', letterSpacing: '1px' }}
                  >
                    {formatPrice(order.total_cents)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          className="mt-16 uppercase tracking-[3px] py-3 px-8 transition-all duration-200 hover:brightness-90"
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 700,
            fontSize: '9px',
            border: '1px solid #2a2a2a',
            color: '#f5f0e8]/50',
          }}
        >
          SIGN OUT
        </button>
      </div>
    </main>
  );
}
