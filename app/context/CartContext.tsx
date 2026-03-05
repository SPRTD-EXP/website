'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  priceCents: number;
  size: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: number, size: string) => void;
  updateQuantity: (productId: number, size: string, qty: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

const STORAGE_KEY = 'sprtd_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();
  const prevUserRef = useRef<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {}
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Sync to Supabase when user logs in
  useEffect(() => {
    const prevId = prevUserRef.current;
    const currId = user?.id ?? null;
    prevUserRef.current = currId;

    if (currId && !prevId) {
      syncCartToSupabase(currId);
    }
  }, [user]);

  async function syncCartToSupabase(userId: string) {
    const { data: dbItems, error } = await supabase
      .from('cart_items')
      .select('*, products(id, slug, name, price_cents)')
      .eq('user_id', userId);

    // If the query failed, don't touch local state
    if (error) return;

    if (dbItems && dbItems.length > 0) {
      // DB is source of truth — load it and overwrite local
      const dbCart = dbItems.map(row => {
        const p = row.products as { id: number; slug: string; name: string; price_cents: number };
        return { productId: p.id, slug: p.slug, name: p.name, priceCents: p.price_cents, size: row.size, quantity: row.quantity };
      });
      setItems(dbCart);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dbCart));
    }
    // DB empty — leave local state alone so localStorage keeps persisting
  }

  function addItem(item: Omit<CartItem, 'quantity'>) {
    setItems(prev => {
      const idx = prev.findIndex(i => i.productId === item.productId && i.size === item.size);
      const newQty = idx >= 0 ? prev[idx].quantity + 1 : 1;
      if (user) {
        supabase.from('cart_items').upsert(
          { user_id: user.id, product_id: item.productId, size: item.size, quantity: newQty },
          { onConflict: 'user_id,product_id,size' }
        );
      }
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: newQty };
        return next;
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeItem(productId: number, size: string) {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.size === size)));
    if (user) {
      supabase.from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('size', size);
    }
  }

  function updateQuantity(productId: number, size: string, qty: number) {
    if (qty < 1) { removeItem(productId, size); return; }
    setItems(prev => prev.map(i =>
      i.productId === productId && i.size === size ? { ...i, quantity: qty } : i
    ));
    if (user) {
      supabase.from('cart_items')
        .update({ quantity: qty })
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .eq('size', size);
    }
  }

  function clearCart() {
    setItems([]);
    if (user) {
      supabase.from('cart_items').delete().eq('user_id', user.id);
    }
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, itemCount, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
