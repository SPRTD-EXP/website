'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import { products } from '../lib/products';

gsap.registerPlugin(ScrollTrigger);

const FILTERS = ['ALL', 'TOPS', 'BOTTOMS', 'OUTERWEAR'] as const;
type Filter = typeof FILTERS[number];

export default function Shop() {
  const [filter, setFilter] = useState<Filter>('ALL');

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
    gsap.from('.product-card', {
      opacity: 0,
      y: 40,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power3.out',
      delay: 0.2,
    });
  }, []);

  useEffect(() => {
    gsap.from('.product-card', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      stagger: 0.06,
      ease: 'power3.out',
    });
  }, [filter]);

  const visible = filter === 'ALL' ? products : products.filter(p => p.category === filter);

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

      {/* Filter bar */}
      <div className="px-16 py-6 flex items-center gap-8">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="uppercase transition-colors relative"
            style={{
              fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
              fontWeight: 300,
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: filter === f ? '#fff3af' : 'rgba(245,240,232,0.4)',
            }}
          >
            {f}
            {filter === f && (
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#fff3af]" />
            )}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <section className="px-16 pb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2a2a2a]">
        {visible.map(product => (
          <Link
            key={product.id}
            href={`/shop/${product.slug}`}
            className="product-card group relative aspect-[3/4] bg-[#111] overflow-hidden border border-[#fffeca]/20"
          >
            {/* Placeholder — swap for <Image> once product photos are ready */}
            <div className="absolute inset-0 bg-[#1a1a1a] flex items-center justify-center">
              <Image
                src="/logoWeb.svg"
                alt=""
                width={48}
                height={48}
                style={{ opacity: 0.08 }}
              />
            </div>

            {/* Hover overlay */}
            <div
              className="absolute inset-x-0 bottom-0 px-6 py-5 flex flex-col gap-1 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
                transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.5s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <p
                className="text-white uppercase tracking-[0.15em]"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '13px' }}
              >
                {product.name}
              </p>
              <p
                className="text-[#fff3af] tracking-[0.1em]"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '10px' }}
              >
                {product.price}
              </p>
            </div>

            {/* Image zoom on hover */}
            <div
              className="absolute inset-0 group-hover:scale-105 group-hover:brightness-75"
              style={{ transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), filter 0.6s ease' }}
            />
          </Link>
        ))}
      </section>
    </main>
  );
}
