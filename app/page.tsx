'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from './components/Navbar';

function ChevronDown() {
  return (
    <svg width="14" height="8" viewBox="0 0 14 8" fill="none">
      <path d="M1 1l6 6 6-6" stroke="#f5f0e8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="20" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [videoEnded, setVideoEnded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [introGone, setIntroGone] = useState(false);

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

  return (
    <main className="min-h-screen bg-[#111]">

      {/* Intro overlay */}
      {!introGone && (
        <div
          className="fixed inset-0 z-[100] bg-[#111] flex items-center justify-center pointer-events-none"
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

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen pt-14 px-4 overflow-hidden">

        {/* Single background image filling entire section — shared source for both inner and outer */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/goldBG.png"
            alt=""
            fill
            style={{ objectFit: 'cover', objectPosition: 'center', opacity: 0.48 }}
            priority
          />
        </div>

        {/* Bordered hero frame — box-shadow dims the surrounding area to ~6% effective opacity */}
        <div
          className="relative w-full max-w-[1064px]"
          style={mounted
            ? { aspectRatio: '16 / 9', border: '3px solid #2a2a2a', boxShadow: '0 0 0 200vmax rgba(17,17,17,0.88)', animation: 'fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) 1.6s both' }
            : { aspectRatio: '16 / 9', border: '3px solid #2a2a2a', boxShadow: '0 0 0 200vmax rgba(17,17,17,0.88)', opacity: 0 }
          }
        >
          {/* Dark base — keeps frame black while video plays, fades out after */}
          <div
            className="absolute inset-0 bg-[#111] transition-opacity duration-1000 overflow-hidden"
            style={{ opacity: videoEnded ? 0 : 1 }}
          />

          {/* Video — plays inside frame, fades out on end revealing section bg through transparent frame */}
          <video
            autoPlay
            muted
            playsInline
            onEnded={() => setVideoEnded(true)}
            className="transition-opacity duration-1000"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              opacity: videoEnded ? 0 : 0.48,
              filter: 'grayscale(1) sepia(0.9) saturate(1.3)',
            }}
          >
            <source src="/FINAL KICK_3 (online-video-cutter.com).mp4" type="video/mp4" />
          </video>

          {/* Event overlay — bottom left, hidden until video ends then animates in */}
          <div
            className="absolute bottom-6 left-8"
            style={videoEnded ? { animation: 'fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both' } : { opacity: 0 }}
          >
            <p
              className="text-[#fff3af] uppercase tracking-[2px] leading-tight"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '28px' }}
            >
              S1 APRIL 2026
            </p>
            <p
              className="text-[#f5f0e8] uppercase tracking-widest mt-1"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '11px' }}
            >
              EVENTS + QIMAH INTRODUCTION
            </p>
          </div>

          {/* Chevron — inside frame, bottom center */}
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
            style={mounted ? { animation: 'fadeIn 0.5s ease-out 2.1s both' } : { opacity: 0 }}
          >
            <ChevronDown />
          </div>
        </div>

        {/* Main tagline — clip reveal */}
        <div style={{ overflow: 'hidden', marginTop: '1.5rem' }}>
          <h1
            className="text-[#fff3af] text-center uppercase tracking-[6px]"
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(36px, 5vw, 60px)',
              textShadow: '6px 6px 3.8px rgba(0,0,0,0.25)',
              ...(mounted
                ? { animation: 'slideUpReveal 1s cubic-bezier(0.16, 1, 0.3, 1) 1.9s both' }
                : { transform: 'translateY(105%)' }),
            }}
          >
            EARNED. NOT GIVEN.
          </h1>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 px-8">
        <div className="max-w-[500px] ml-[20%]">
          <h2
            className="text-[#fffeca] uppercase mb-4"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '40px' }}
          >
            DRIVEN BY PURPOSE,
          </h2>
          <p
            className="text-[#f5f0e8]"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '27px', lineHeight: 1.4 }}
          >
            SPRTD is the foundation connecting individuals, businesses, and communities across every walk of life.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8">
        <div className="flex items-center justify-center gap-[120px]">
          <Link
            href="/contact"
            className="text-[#f5f0e8] text-sm tracking-widest uppercase hover:text-[#fff3af] transition-colors"
          >
            CONTACT
          </Link>
          <Link
            href="/policies"
            className="text-[#f5f0e8] text-sm tracking-widest uppercase hover:text-[#fff3af] transition-colors"
          >
            POLICIES
          </Link>

          {/* Social icons */}
          <div className="flex items-center gap-5">
            <a
              href="https://instagram.com/sprtd.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f5f0e8] hover:text-[#fff3af] transition-colors"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://tiktok.com/@sprtd.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f5f0e8] hover:text-[#fff3af] transition-colors"
            >
              <TikTokIcon />
            </a>
            <a
              href="https://www.youtube.com/@SPRTD.LIVE3"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f5f0e8] hover:text-[#fff3af] transition-colors"
            >
              <YouTubeIcon />
            </a>
            <a
              href="https://discord.gg/sprtd"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f5f0e8] hover:text-[#fff3af] transition-colors"
            >
              <DiscordIcon />
            </a>
          </div>
        </div>
      </footer>

    </main>
  );
}
