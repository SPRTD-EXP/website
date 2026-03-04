'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../../components/Navbar';
import { products } from '../../lib/products';

gsap.registerPlugin(ScrollTrigger);

export default function ProductPage({ params }: { params: { slug: string } }) {
  const product = products.find(p => p.slug === params.slug);
  if (!product) notFound();

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

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
    gsap.from('.product-image', { x: -40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.1 });
    gsap.from('.product-info',  { x:  40, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.2 });
  }, []);

  return (
    <main className="min-h-screen bg-[#111]">
      <Navbar />

      <div className="pt-28 px-16 pb-24">
        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 mb-12 text-[#f5f0e8]/40 hover:text-[#fff3af] transition-colors uppercase tracking-[0.2em]"
          style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '10px' }}
        >
          ← BACK TO SHOP
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — product image */}
          <div
            className="product-image relative aspect-[3/4] bg-[#1a1a1a] border border-[#fffeca]/20 flex items-center justify-center overflow-hidden"
          >
            <Image
              src="/logoWeb.svg"
              alt=""
              width={64}
              height={64}
              style={{ opacity: 0.08 }}
            />
            {/* Swap above for <Image src={product.image} fill style={{ objectFit: 'cover' }} /> when photos are ready */}
          </div>

          {/* Right — product info */}
          <div className="product-info flex flex-col gap-6 lg:pt-8">
            <div>
              <h1
                className="text-white uppercase tracking-[4px]"
                style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '48px' }}
              >
                {product.name}
              </h1>
              <p
                className="mt-3 text-[#fff3af] tracking-[2px]"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '16px' }}
              >
                {product.price}
              </p>
            </div>

            <hr className="border-[#2a2a2a]" />

            {/* Size selector */}
            <div>
              <p
                className="mb-4 text-[#f5f0e8]/50 uppercase tracking-[0.2em]"
                style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '10px' }}
              >
                SELECT SIZE
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className="w-12 h-12 uppercase transition-all duration-200"
                    style={{
                      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                      fontWeight: 300,
                      fontSize: '11px',
                      letterSpacing: '0.1em',
                      border: selectedSize === size ? '1px solid #fff3af' : '1px solid rgba(245,240,232,0.2)',
                      color: selectedSize === size ? '#fff3af' : 'rgba(245,240,232,0.5)',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to cart */}
            <button
              className="w-full py-4 uppercase tracking-[3px] transition-all duration-200 hover:brightness-90 active:scale-[0.98] mt-2"
              style={{
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 700,
                fontSize: '11px',
                background: '#fff3af',
                color: '#111',
              }}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
