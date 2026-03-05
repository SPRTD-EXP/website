'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import LoginModal from './LoginModal';
import CartDrawer from './CartDrawer';

function CartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <div className="flex flex-col justify-center gap-[5px] w-5">
      <span className={`block h-px bg-[#f5f0e8] transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
      <span className={`block h-px bg-[#f5f0e8] transition-all duration-300 ${open ? 'opacity-0 scale-x-0' : ''}`} />
      <span className={`block h-px bg-[#f5f0e8] transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
    </div>
  );
}

const allLinks = [
  { href: '/movement', label: 'MOVEMENT' },
  { href: '/shop',     label: 'SHOP' },
  { href: '/about',    label: 'ABOUT' },
  { href: '/apps',     label: 'APPS' },
] as const;

const leftLinks  = allLinks.slice(0, 2);
const rightLinks = allLinks.slice(2);

type NavbarProps = { animated?: boolean };

export default function Navbar({ animated = false }: NavbarProps) {
  const [scrolled, setScrolled]   = useState(false);
  const [mounted, setMounted]     = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [cartOpen, setCartOpen]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { itemCount } = useCart();

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on route change
  useEffect(() => {
    setMenuOpen(false);
    setLoginOpen(false);
    setCartOpen(false);
  }, [pathname]);

  // ESC key closes any overlay
  useEffect(() => {
    const anyOpen = loginOpen || cartOpen || menuOpen;
    if (!anyOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setLoginOpen(false); setCartOpen(false); setMenuOpen(false); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [loginOpen, cartOpen, menuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const animStyle = animated
    ? (mounted ? { animation: 'fadeIn 0.6s cubic-bezier(0.16,1,0.3,1) 1.4s both' } : { opacity: 0 })
    : undefined;

  const linkClass = (href: string) =>
    `text-[10.5px] tracking-[0.18em] uppercase transition-colors ${
      pathname === href ? 'text-[#fff3af]' : 'text-[#f5f0e8] hover:text-[#fff3af]'
    }`;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-14 border-b border-[#1e1e1e] transition-colors duration-300 ${
          scrolled || menuOpen ? 'bg-[#111]' : 'bg-[#111]/80 backdrop-blur-sm'
        }`}
        style={animStyle}
      >
        <div className="relative flex items-center h-full px-5 md:px-10">

          {/* Mobile: hamburger left */}
          <button
            className="lg:hidden text-[#f5f0e8] z-10"
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
          >
            <Hamburger open={menuOpen} />
          </button>

          {/* Desktop: left links */}
          <div className="hidden lg:flex flex-1 items-center gap-9">
            {leftLinks.map(l => (
              <Link key={l.href} href={l.href} className={linkClass(l.href)}
                style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 300 }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Center logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image src="/logoWeb.svg" alt="SPRTD" width={34} height={34} priority />
          </Link>

          {/* Right: desktop links + login/cart; mobile: login + cart */}
          <div className="flex flex-1 items-center justify-end gap-5 lg:gap-9">
            {/* Desktop-only nav links */}
            <div className="hidden lg:flex items-center gap-9">
              {rightLinks.map(l => (
                <Link key={l.href} href={l.href} className={linkClass(l.href)}
                  style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 300 }}>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Login / Account */}
            {user ? (
              <Link href="/account" className={linkClass('/account')}
                style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 300 }}>
                ACCOUNT
              </Link>
            ) : (
              <button
                onClick={() => setLoginOpen(true)}
                className="text-[10.5px] tracking-[0.18em] uppercase transition-colors text-[#f5f0e8] hover:text-[#fff3af]"
                style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontWeight: 300 }}
              >
                LOGIN
              </button>
            )}

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative text-[#f5f0e8] hover:text-[#fff3af] transition-colors"
            >
              <CartIcon />
              {itemCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-[#fff3af] text-[#111]"
                  style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700, fontSize: '8px' }}
                >
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#111] flex flex-col items-center justify-center gap-10 lg:hidden"
          style={{ animation: 'fadeIn 0.2s ease both' }}>
          {allLinks.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className={`text-2xl tracking-[0.3em] uppercase transition-colors ${
                pathname === l.href ? 'text-[#fff3af]' : 'text-[#f5f0e8] hover:text-[#fff3af]'
              }`}
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700 }}
            >
              {l.label}
            </Link>
          ))}
          {!user && (
            <button
              onClick={() => { setMenuOpen(false); setLoginOpen(true); }}
              className="text-2xl tracking-[0.3em] uppercase text-[#f5f0e8] hover:text-[#fff3af] transition-colors"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 700 }}
            >
              LOGIN
            </button>
          )}
        </div>
      )}

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      {cartOpen  && <CartDrawer onClose={() => setCartOpen(false)} />}
    </>
  );
}
