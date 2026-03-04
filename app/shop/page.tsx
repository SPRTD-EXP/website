'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';
import { type Product, formatPrice } from '../lib/products';

gsap.registerPlugin(ScrollTrigger);

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    supabase.from('products').select('*').order('id').then(({ data }) => {
      if (data) setProducts(data);
    });
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenis.on('scroll', () => ScrollTrigger.update());
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  useEffect(() => {
    if (products.length === 0) return;
    gsap.fromTo('.product-card',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out', delay: 0.1, clearProps: 'all' }
    );
  }, [products]);

  return (
    <main className="min-h-screen bg-[#111]">
      <Navbar />

      {/* Page header */}
      <header
        className="pt-32 px-16 pb-10"
        style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
      >
        <h1
          className="text-[#fffeca] uppercase tracking-[6px]"
          style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '56px' }}
        >
          SHOP
        </h1>
        <p
          className="mt-2 text-[#f5f0e8]/60 uppercase tracking-[3px]"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '11px' }}
        >
          S1 · APRIL 2026
        </p>
        <hr className="mt-8 border-[#2a2a2a]" />
      </header>

      {/* Product grid */}
      <section className="px-16 pb-24 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map(product => (
          <Link
            key={product.id}
            href={`/shop/${product.slug}`}
            className="product-card group block"
          >
            {/* Image area */}
            <div className="relative aspect-[3/4] bg-[#1a1a1a] overflow-hidden">
              {product.image_urls.length > 0 ? (
                <>
                  {/* Primary image */}
                  <Image
                    src={product.image_urls[0]}
                    alt={product.name}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  {/* Secondary image — crossfades in on hover */}
                  {product.image_urls[1] && (
                    <Image
                      src={product.image_urls[1]}
                      alt={product.name}
                      fill
                      style={{ objectFit: 'cover', transition: 'opacity 0.55s ease' }}
                      className="opacity-0 group-hover:opacity-100"
                    />
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src="/logoWeb.svg" alt="" width={48} height={48} style={{ opacity: 0.14 }} />
                </div>
              )}
              {/* Subtle hover dim */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/30"
                style={{ transition: 'opacity 0.4s ease' }}
              />
              {/* Name + price — centered, hidden until hover */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100"
                style={{ transition: 'opacity 0.35s ease' }}
              >
                <p
                  className="uppercase text-[#f5f0e8] tracking-[0.18em]"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '10px' }}
                >
                  {product.name}
                </p>
                <p
                  className="text-[#fff3af] tracking-[0.12em]"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '9px' }}
                >
                  {formatPrice(product.price_cents)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
