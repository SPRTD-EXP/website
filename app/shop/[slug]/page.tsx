'use client';

import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../../components/Navbar';
import { supabase } from '../../lib/supabase';
import { type Product, type Colorway, COLORWAYS, formatPrice } from '../../lib/products';
import { useCart } from '../../context/CartContext';

gsap.registerPlugin(ScrollTrigger);

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [notFoundState, setNotFoundState] = useState(false);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColorway, setSelectedColorway] = useState<Colorway>('black');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    supabase.from('products').select('*').eq('slug', slug).single().then(({ data, error }) => {
      if (error || !data) { setNotFoundState(true); return; }
      setProduct(data);
    });
  }, [slug]);

  useEffect(() => {
    if (notFoundState) notFound();
  }, [notFoundState]);

  // Fetch images when product or colorway changes
  useEffect(() => {
    if (!product) return;
    fetch(`/api/product-images?product=${encodeURIComponent(product.name)}&colorway=${encodeURIComponent(selectedColorway)}`)
      .then(r => r.json())
      .then(({ urls }) => setImageUrls(urls ?? []));
  }, [product, selectedColorway]);

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
    if (!product) return;
    gsap.fromTo('.product-info', { opacity: 0 }, { opacity: 1, duration: 0.9, ease: 'power2.out', delay: 0.25, clearProps: 'all' });
  }, [product]);

  function handleAddToCart() {
    if (!selectedSize) { setSizeError(true); return; }
    if (!product) return;
    setSizeError(false);
    addItem({ productId: product.id, slug: product.slug, name: product.name, priceCents: product.price_cents, size: selectedSize });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1600);
  }

  if (!product) return <main className="min-h-screen bg-[#111]"><Navbar /></main>;

  return (
    <main className="min-h-screen bg-[#111]">
      <Navbar />

      <div className="pt-14 grid grid-cols-1 lg:grid-cols-[3fr_2fr] items-start">

        {/* Left — stacked image gallery */}
        <div className="border-r border-[#2a2a2a]">
          {imageUrls.length > 0 ? (
            imageUrls.map((url, i) => (
              <div
                key={url}
                className={`relative w-full aspect-[3/4]${i < imageUrls.length - 1 ? ' border-b border-[#2a2a2a]' : ''}`}
              >
                <Image src={url} alt={`${product.name} ${selectedColorway} — view ${i + 1}`} fill unoptimized style={{ objectFit: 'cover' }} />
              </div>
            ))
          ) : (
            <div className="relative w-full aspect-[3/4] bg-[#1a1a1a] flex items-center justify-center">
              <Image src="/logoWeb.svg" alt="" width={72} height={72} style={{ opacity: 0.12 }} />
            </div>
          )}
        </div>

        {/* Right — info panel (sticky) */}
        <div className="product-info flex flex-col px-6 pt-8 pb-12 md:px-12 md:pt-16 md:pb-16 border-t border-[#2a2a2a] lg:border-t-0 lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)] lg:overflow-y-auto">

          {/* Breadcrumb */}
          <Link
            href="/shop"
            className="text-[#f5f0e8]/30 hover:text-[#fff3af] transition-colors uppercase tracking-[0.22em] mb-10 self-start"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '9px' }}
          >
            ← SHOP
          </Link>

          {/* Name + price */}
          <h1
            className="text-white uppercase"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '32px', letterSpacing: '3px', lineHeight: 1.1 }}
          >
            {product.name}
          </h1>
          <p
            className="mt-2 text-[#fff3af]"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '13px', letterSpacing: '2px' }}
          >
            {formatPrice(product.price_cents)}
          </p>

          <hr className="border-[#2a2a2a] my-8" />

          {/* Colorway */}
          <p
            className="mb-4 uppercase tracking-[0.22em]"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '9px', color: 'rgba(245,240,232,0.4)' }}
          >
            COLOR — <span style={{ color: '#f5f0e8' }}>{selectedColorway.toUpperCase()}</span>
          </p>
          <div className="flex items-center gap-3 mb-8">
            {COLORWAYS.map(cw => (
              <button
                key={cw}
                onClick={() => setSelectedColorway(cw)}
                title={cw.toUpperCase()}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: cw === 'black' ? '#111' : '#f472b6',
                  border: selectedColorway === cw ? '2px solid #fff3af' : '2px solid rgba(245,240,232,0.25)',
                  outline: selectedColorway === cw ? '1px solid #fff3af' : 'none',
                  outlineOffset: 2,
                  cursor: 'pointer',
                  transition: 'border 0.2s',
                }}
              />
            ))}
          </div>

          {/* Size */}
          <p
            className="mb-4 uppercase tracking-[0.22em]"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '9px', color: sizeError ? '#ff6b6b' : 'rgba(245,240,232,0.4)' }}
          >
            {sizeError ? 'PLEASE SELECT A SIZE' : 'SELECT SIZE'}
          </p>
          <div className="flex items-center gap-2 flex-wrap mb-8">
            {product.sizes.map(size => (
              <button
                key={size}
                onClick={() => { setSelectedSize(size); setSizeError(false); }}
                className="w-11 h-11 uppercase transition-all duration-200"
                style={{
                  fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                  fontWeight: 300,
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  border: selectedSize === size ? '1px solid #fff3af' : '1px solid rgba(245,240,232,0.2)',
                  color: selectedSize === size ? '#fff3af' : '#f5f0e8',
                }}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            className="w-full py-4 uppercase tracking-[3px] transition-all duration-200 hover:brightness-90 active:scale-[0.99]"
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 700,
              fontSize: '10px',
              background: addedFeedback ? '#b8f5a0' : '#fff3af',
              color: '#111',
            }}
          >
            {addedFeedback ? 'ADDED ✓' : 'ADD TO CART'}
          </button>

          {/* Info rows */}
          <div className="mt-10 flex flex-col border-t border-[#2a2a2a]">
            {['SHIPPING & RETURNS', 'SIZE GUIDE', 'CONTACT'].map(label => (
              <div
                key={label}
                className="flex items-center justify-between py-4 border-b border-[#2a2a2a] cursor-pointer group"
              >
                <span
                  className="text-[#f5f0e8]/50 group-hover:text-[#f5f0e8] transition-colors uppercase tracking-[0.18em]"
                  style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '9px' }}
                >
                  {label}
                </span>
                <span className="text-[#f5f0e8]/30 group-hover:text-[#f5f0e8] transition-colors text-xs">›</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
