'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [introGone, setIntroGone] = useState(false);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const preloadRef = useRef<HTMLVideoElement>(null);
  const shopBtnRef = useRef<HTMLAnchorElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);
  const idxRef = useRef(0);

  useEffect(() => {
    fetch('/api/hero-vids')
      .then(r => r.json())
      .then(({ urls }) => { if (urls?.length > 0) setVideoUrls(urls); });
  }, []);

  useEffect(() => {
    if (videoUrls.length === 0 || !videoRef.current) return;
    idxRef.current = 0;
    videoRef.current.src = videoUrls[0];
    videoRef.current.load();
    videoRef.current.play().catch(() => {});
    if (preloadRef.current && videoUrls.length > 1) {
      preloadRef.current.src = videoUrls[1];
      preloadRef.current.load();
    }
  }, [videoUrls]);

  function handleVideoEnded() {
    if (!videoRef.current || videoUrls.length <= 1) return;
    idxRef.current = (idxRef.current + 1) % videoUrls.length;
    videoRef.current.src = videoUrls[idxRef.current];
    videoRef.current.load();
    videoRef.current.play().catch(() => {});
    if (preloadRef.current) {
      const afterNext = (idxRef.current + 1) % videoUrls.length;
      preloadRef.current.src = videoUrls[afterNext];
      preloadRef.current.load();
    }
  }

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
    setMounted(true);
    const t = setTimeout(() => setIntroGone(true), 2400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = chevronRef.current;
    if (!el) return;
    const anim = gsap.fromTo(
      el,
      { y: 0 },
      { y: 6, duration: 0.85, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 3 }
    );
    return () => { anim.kill(); };
  }, []);

  useEffect(() => {
    const btn = shopBtnRef.current;
    if (!btn) return;
    gsap.set(btn, { opacity: 0, y: 28, scale: 0.94 });
    const trigger = ScrollTrigger.create({
      trigger: btn,
      start: 'center center',
      once: true,
      onEnter: () => {
        gsap.to(btn, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: 'power4.out',
        });
      },
    });
    return () => trigger.kill();
  }, []);

  return (
    <main className="min-h-screen bg-background">

      {/* Intro overlay */}
      {!introGone && (
        <div
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center pointer-events-none"
          style={{
            opacity: mounted ? 0 : 1,
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: '1.2s',
          }}
        >
          <Image src="/logoWeb.svg" alt="SPRTD" width={72} height={72} priority />
        </div>
      )}

      <Navbar animated />

      {/* Hero — full-bleed */}
      <section className="relative h-screen overflow-hidden">

        {/* Main video */}
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleVideoEnded}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.7,
            filter: 'grayscale(1) sepia(0.9) saturate(1.3)',
          }}
        />
        {/* Hidden preload for next video */}
        <video ref={preloadRef} muted preload="auto" style={{ display: 'none' }} />

        {/* Subtle dark vignette at bottom */}
        <div
          className="absolute inset-x-0 bottom-0 h-48 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(17,17,17,0.55) 0%, transparent 100%)' }}
        />

        {/* Bottom center — discover button + scroll cue */}
        <div
          className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-6"
          style={{
            bottom: '48px',
            ...(mounted
              ? { animation: 'fadeInUp 0.8s cubic-bezier(0.16,1,0.3,1) 2.0s both' }
              : { opacity: 0 }),
          }}
        >
          <Link
            href="/shop"
            className="discover-btn uppercase tracking-[0.22em]"
          >
            DISCOVER PRESEASON
          </Link>

          <a
            href="#section-movement"
            className="flex flex-col items-center"
            style={{ color: '#fff3af' }}
          >
            <svg ref={chevronRef} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>

      </section>

      {/* Section 1 — Movement */}
      <section id="section-movement" className="relative h-screen overflow-hidden">
        {/* Gold background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/goldBG.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.5,
          }}
        />

        {/* Top-left heading — 1/4 down */}
        <div className="absolute left-0 right-0 top-[25%] px-6 md:px-16 lg:px-24 z-10">
          <p className="label mb-4">WHAT IS SPRTD</p>
          <h2
            className="heading"
            style={{ fontSize: 'clamp(32px, 6vw, 60px)', letterSpacing: '2px', lineHeight: 1 }}
          >
            MORE THAN<br />A BRAND.
          </h2>
        </div>

        {/* Center — button */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Link
            ref={shopBtnRef}
            href="/movement"
            className="relative discover-btn uppercase tracking-[0.22em]"
            style={{
              fontSize: '12px',
              padding: '16px 48px',
              boxShadow: '0 0 32px rgba(255,243,175,0.25), 0 0 80px rgba(255,243,175,0.12), 0 8px 24px rgba(0,0,0,0.5)',
              filter: 'drop-shadow(0 0 12px rgba(255,243,175,0.2))',
            }}
          >
            MOVEMENT
          </Link>
        </div>
      </section>

      {/* Section 2 — Solutions blurb */}
      <section className="h-screen bg-background flex flex-col items-start justify-center px-6 md:px-16 lg:px-24">
        <p className="label mb-6">BUILT FOR BRANDS</p>
        <h2
          className="heading mb-6"
          style={{ fontSize: 'clamp(32px, 6vw, 60px)', letterSpacing: '2px', lineHeight: 1 }}
        >
          LOYALTY THAT<br />LASTS.
        </h2>
        <p
          className="mb-10 max-w-md"
          style={{ fontWeight: 300, fontSize: 'clamp(13px, 1.6vw, 15px)', lineHeight: 1.7, color: '#f5f0e8', letterSpacing: '0.04em' }}
        >
          SPRTD builds loyalty infrastructure for emerging brands — custom point systems, member tiers, and exclusive access that turns customers into community.
        </p>
        <Link
          href="/solutions"
          className="discover-btn uppercase tracking-[0.22em]"
        >
          OUR SOLUTIONS
        </Link>
      </section>

      <Footer />

    </main>
  );
}
