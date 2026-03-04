'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/products';

export default function CartPage() {
  const { items, itemCount, removeItem, updateQuantity } = useCart();
  const [checkingOut, setCheckingOut] = useState(false);

  const subtotalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);

  async function handleCheckout() {
    setCheckingOut(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      const { url, error } = await res.json();
      if (error) throw new Error(error);
      window.location.href = url;
    } catch (err) {
      console.error(err);
      setCheckingOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#111]">
      <Navbar />

      <header
        className="pt-32 px-16 pb-10"
        style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
      >
        <h1
          className="text-[#fffeca] uppercase tracking-[6px]"
          style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '56px' }}
        >
          CART
        </h1>
        <p
          className="mt-2 text-[#f5f0e8]/60 uppercase tracking-[3px]"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '11px' }}
        >
          {itemCount === 0 ? 'EMPTY' : `${itemCount} ITEM${itemCount !== 1 ? 'S' : ''}`}
        </p>
        <hr className="mt-8 border-[#2a2a2a]" />
      </header>

      <section className="px-16 pb-24 max-w-3xl">
        {items.length === 0 ? (
          <div className="py-24 flex flex-col items-start gap-6">
            <p
              className="text-[#f5f0e8]/30 uppercase tracking-[0.3em]"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '11px' }}
            >
              YOUR CART IS EMPTY
            </p>
            <Link
              href="/shop"
              className="text-[#fff3af] uppercase tracking-[0.22em] hover:opacity-70 transition-opacity"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '10px' }}
            >
              ← BACK TO SHOP
            </Link>
          </div>
        ) : (
          <>
            {/* Line items */}
            <div className="flex flex-col">
              {items.map(item => (
                <div
                  key={`${item.productId}_${item.size}`}
                  className="flex items-center justify-between py-6 border-b border-[#2a2a2a]"
                >
                  {/* Product info */}
                  <div className="flex flex-col gap-1">
                    <p
                      className="text-white uppercase tracking-[0.18em]"
                      style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '11px' }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-[#f5f0e8]/40 uppercase tracking-[0.15em]"
                      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '9px' }}
                    >
                      SIZE: {item.size}
                    </p>
                  </div>

                  {/* Qty + price + remove */}
                  <div className="flex items-center gap-8">
                    {/* Qty stepper */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-[#f5f0e8]/40 hover:text-[#f5f0e8] transition-colors"
                        style={{ fontSize: '14px' }}
                      >
                        −
                      </button>
                      <span
                        className="text-[#f5f0e8] w-4 text-center"
                        style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '11px' }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-[#f5f0e8]/40 hover:text-[#f5f0e8] transition-colors"
                        style={{ fontSize: '14px' }}
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <p
                      className="text-[#fff3af] w-16 text-right"
                      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '11px', letterSpacing: '1px' }}
                    >
                      {formatPrice(item.priceCents * item.quantity)}
                    </p>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-[#f5f0e8]/20 hover:text-[#f5f0e8]/60 transition-colors"
                      style={{ fontSize: '16px' }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between py-6 border-b border-[#2a2a2a]">
              <p
                className="text-[#f5f0e8]/40 uppercase tracking-[0.22em]"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '9px' }}
              >
                SUBTOTAL
              </p>
              <p
                className="text-[#fff3af]"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '13px', letterSpacing: '2px' }}
              >
                {formatPrice(subtotalCents)}
              </p>
            </div>

            {/* CTA */}
            <div className="mt-8">
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="w-full py-4 uppercase tracking-[3px] transition-all duration-200 hover:brightness-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 700,
                  fontSize: '10px',
                  background: '#fff3af',
                  color: '#111',
                }}
              >
                {checkingOut ? 'REDIRECTING...' : 'PROCEED TO CHECKOUT'}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
