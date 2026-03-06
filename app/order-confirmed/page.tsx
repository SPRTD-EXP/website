'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

export default function OrderConfirmed() {
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <div
        className="flex flex-col items-start px-6 pt-28 pb-16 md:px-16 md:pt-40 md:pb-24"
        style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
      >
        <p className="label tracking-[0.3em] mb-4">
          ORDER CONFIRMED
        </p>
        <h1
          className="heading mb-6"
          style={{ fontSize: 'clamp(32px, 8vw, 48px)', letterSpacing: '4px', lineHeight: 1.1 }}
        >
          THANK YOU.
        </h1>
        <p
          className="text-foreground/50 mb-12 max-w-md"
          style={{ fontWeight: 300, fontSize: '12px', lineHeight: 1.6, letterSpacing: '1px' }}
        >
          YOUR ORDER HAS BEEN RECEIVED. A CONFIRMATION EMAIL WILL BE SENT SHORTLY.
        </p>

        <Link
          href="/shop"
          className="uppercase tracking-[0.22em] transition-all duration-300 hover:bg-white/10"
          style={{
            fontWeight: 300,
            fontSize: '10px',
            color: '#f5f0e8',
            border: '1px solid rgba(245,240,232,0.55)',
            padding: '11px 28px',
          }}
        >
          CONTINUE SHOPPING
        </Link>
      </div>
      <Footer />
    </main>
  );
}
