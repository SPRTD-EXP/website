'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import ContactModal from './ContactModal';

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

export default function Footer() {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
    <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    <footer className="py-10 px-6 md:py-12 md:px-8 border-t border-border bg-background">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-12 lg:gap-[120px]">
        <button
          onClick={() => setContactOpen(true)}
          className="text-foreground text-sm tracking-widest uppercase hover:text-gold transition-colors bg-transparent border-none cursor-pointer"
        >
          CONTACT
        </button>
        <Link
          href="/policies"
          className="text-foreground text-sm tracking-widest uppercase hover:text-gold transition-colors"
        >
          POLICIES
        </Link>

        <div className="flex items-center gap-5">
          <a href="https://instagram.com/sprtd.co" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-gold transition-colors">
            <InstagramIcon />
          </a>
          <a href="https://tiktok.com/@sprtd.co" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-gold transition-colors">
            <TikTokIcon />
          </a>
          <a href="https://www.youtube.com/@SPRTD.LIVE3" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-gold transition-colors">
            <YouTubeIcon />
          </a>
          <a href="https://discord.gg/sprtd" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-gold transition-colors">
            <DiscordIcon />
          </a>
        </div>
      </div>

      <p
        className="mt-8 text-center uppercase tracking-[0.2em]"
        style={{ fontWeight: 300, fontSize: '9px', color: '#f5f0e8' }}
      >
        © 2026 SPRTD. ALL RIGHTS RESERVED.
      </p>
    </footer>
    </>
  );
}
