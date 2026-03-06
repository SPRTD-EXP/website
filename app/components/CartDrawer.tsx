'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/products';

type Props = {
  onClose: () => void;
};

export default function CartDrawer({ onClose }: Props) {
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
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 z-[201] h-full w-full max-w-md bg-background border-l border-border flex flex-col"
        style={{ animation: 'slideInRight 0.35s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 h-14 border-b border-border shrink-0">
          <div className="flex items-baseline gap-3">
            <p
              className="heading  tracking-[0.22em]"
              style={{ fontSize: '13px' }}
            >
              CART
            </p>
            {itemCount > 0 && (
              <p
                className="text-foreground/40 uppercase  tracking-[0.22em]"
                style={{ fontWeight: 300, fontSize: '9px' }}
              >
                {itemCount} ITEM{itemCount !== 1 ? 'S' : ''}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-foreground/30 hover:text-foreground transition-colors"
            style={{ fontSize: '20px', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-8">
          {items.length === 0 ? (
            <div className="py-16 flex flex-col items-start gap-5">
              <p
                className="text-foreground/30 uppercase tracking-[0.3em]"
                style={{ fontWeight: 300, fontSize: '10px' }}
              >
                YOUR CART IS EMPTY
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="text-gold uppercase tracking-[0.22em] hover:opacity-70 transition-opacity"
                style={{ fontWeight: 300, fontSize: '9px' }}
              >
                ← SHOP
              </Link>
            </div>
          ) : (
            <div className="flex flex-col">
              {items.map(item => (
                <div
                  key={`${item.productId}_${item.size}`}
                  className="flex items-center justify-between py-5 border-b border-border"
                >
                  {/* Product info */}
                  <div className="flex flex-col gap-1">
                    <p
                      className="uppercase text-white tracking-[0.18em]"
                      style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '10px' }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-foreground/40 uppercase tracking-[0.15em]"
                      style={{ fontWeight: 300, fontSize: '8px' }}
                    >
                      SIZE: {item.size}
                    </p>
                  </div>

                  {/* Qty + price + remove */}
                  <div className="flex items-center gap-5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors"
                        style={{ fontSize: '13px' }}
                      >
                        −
                      </button>
                      <span
                        className="text-foreground w-3 text-center"
                        style={{ fontWeight: 300, fontSize: '10px' }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors"
                        style={{ fontSize: '13px' }}
                      >
                        +
                      </button>
                    </div>

                    <p
                      className="text-gold w-14 text-right"
                      style={{ fontWeight: 300, fontSize: '10px', letterSpacing: '1px' }}
                    >
                      {formatPrice(item.priceCents * item.quantity)}
                    </p>

                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="text-foreground/20 hover:text-foreground/60 transition-colors"
                      style={{ fontSize: '15px' }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer — subtotal + CTA */}
        {items.length > 0 && (
          <div className="shrink-0 px-8 pb-8 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-6">
              <p
                className="text-foreground/40 uppercase tracking-[0.22em]"
                style={{ fontWeight: 300, fontSize: '9px' }}
              >
                SUBTOTAL
              </p>
              <p
                className="text-gold"
                style={{ fontWeight: 300, fontSize: '13px', letterSpacing: '2px' }}
              >
                {formatPrice(subtotalCents)}
              </p>
            </div>
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
        )}
      </div>
    </>
  );
}
