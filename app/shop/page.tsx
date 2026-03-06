'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';
import { type Product, formatPrice } from '../lib/products';

gsap.registerPlugin(ScrollTrigger);

function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/product-images?product=${encodeURIComponent(product.name)}&colorway=black`)
      .then(r => r.json())
      .then(({ urls }) => { if (urls?.length > 0) setImageUrls(urls); });
  }, [product.name]);

  return (
    <Link href={`/shop/${product.slug}`} className="product-card group block">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-[#1a1a1a] overflow-hidden">
        {imageUrls.length > 0 ? (
          <>
            <Image src={imageUrls[0]} alt={product.name} fill unoptimized priority={priority} style={{ objectFit: 'cover' }} />
            {imageUrls[1] && (
              <Image
                src={imageUrls[1]}
                alt={product.name}
                fill
                unoptimized
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
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-black/20" style={{ transition: 'opacity 0.4s ease' }} />
      </div>
      {/* Info below image */}
      <div className="pt-3 pb-1 flex items-baseline justify-between">
        <p
          className="uppercase text-foreground tracking-[0.15em]"
          style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '10px' }}
        >
          {product.name}
        </p>
        <p className="text-gold" style={{ fontWeight: 300, fontSize: '11px', letterSpacing: '0.05em' }}>
          {formatPrice(product.price_cents)}
        </p>
      </div>
    </Link>
  );
}

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
    <main className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-[72px] pb-4 text-center">
        <p className="label" style={{ fontSize: '8px', letterSpacing: '0.3em', paddingLeft: '0.3em', color: '#fff3af' }}>SHOP</p>
      </div>

      <section className="pt-6 px-4 pb-24 md:pt-8 md:px-12 lg:px-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} priority={i < 4} />
        ))}
      </section>
      
      <Footer />
    </main>
  );
}
