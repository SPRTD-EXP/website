'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

const navLinks = [
  { href: '/movement', label: 'MOVEMENT', side: 'left' },
  { href: '/shop',     label: 'SHOP',     side: 'left' },
  { href: '/about',    label: 'ABOUT',    side: 'right' },
  { href: '/apps',     label: 'APPS',     side: 'right' },
  { href: '/login',    label: 'LOGIN',    side: 'right' },
] as const;

type NavbarProps = {
  /** Pass true on the homepage to delay the fade-in until after the intro overlay */
  animated?: boolean;
};

export default function Navbar({ animated = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const animStyle = animated
    ? (mounted ? { animation: 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 1.4s both' } : { opacity: 0 })
    : undefined;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-14 border-b border-[#1e1e1e] transition-colors duration-300 ${
        scrolled ? 'bg-[#111]' : 'bg-[#111]/80 backdrop-blur-sm'
      }`}
      style={animStyle}
    >
      <div className="relative flex items-center h-full px-10">
        {/* Left links */}
        <div className="flex flex-1 items-center gap-9">
          {navLinks.filter(l => l.side === 'left').map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[10.5px] tracking-[0.18em] uppercase transition-colors ${
                pathname === l.href ? 'text-[#fff3af]' : 'text-[#f5f0e8] hover:text-[#fff3af]'
              }`}
              style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 300 }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Center logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <Image src="/logoWeb.svg" alt="SPRTD" width={34} height={34} priority />
        </Link>

        {/* Right links */}
        <div className="flex flex-1 items-center justify-end gap-9">
          {navLinks.filter(l => l.side === 'right').map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-[10.5px] tracking-[0.18em] uppercase transition-colors ${
                pathname === l.href ? 'text-[#fff3af]' : 'text-[#f5f0e8] hover:text-[#fff3af]'
              }`}
              style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 300 }}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/cart" className="text-[#f5f0e8] hover:text-[#fff3af] transition-colors ml-1">
            <CartIcon />
          </Link>
        </div>
      </div>
    </nav>
  );
}
