import Link from 'next/link';
import Navbar from './components/Navbar';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <p className="label mb-4">PAGE LOCKED</p>

        <h1
          className="heading mb-6"
          style={{ fontSize: 'clamp(36px, 8vw, 64px)', letterSpacing: '4px', lineHeight: 1 }}
        >
          NOT YET.
        </h1>

        <p
          className="mb-12 max-w-xs"
          style={{ fontWeight: 300, fontSize: '12px', color: '#f5f0e8', lineHeight: 1.7, letterSpacing: '0.08em' }}
        >
          THIS PAGE ISN&apos;T AVAILABLE YET. CHECK BACK SOON.
        </p>

        <Link
          href="/"
          className="discover-btn uppercase tracking-[0.22em]"
        >
          BACK TO HOME
        </Link>
      </div>
    </main>
  );
}
