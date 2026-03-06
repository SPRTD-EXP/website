'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';

type Mode = 'signin' | 'signup';

type Props = {
  onClose: () => void;
};

const inputStyle: React.CSSProperties = {
  fontWeight: 300,
  fontSize: '11px',
  letterSpacing: '0.12em',
  background: '#1a1a1a',
  border: '1px solid #2a2a2a',
  color: '#f5f0e8',
  outline: 'none',
};

export default function LoginModal({ onClose }: Props) {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      onClose();
      router.push('/account');
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
      setSuccess('CHECK YOUR EMAIL TO CONFIRM YOUR ACCOUNT.');
    }
    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/account` },
    });
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed z-[201] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-background border border-border px-10 py-10"
        style={{ animation: 'fadeInUp 0.35s cubic-bezier(0.16,1,0.3,1) both' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-foreground/30 hover:text-foreground transition-colors"
          style={{ fontSize: '18px', lineHeight: 1 }}
        >
          ×
        </button>

        {/* Mode tabs */}
        <div className="flex gap-8 mb-8">
          {(['signin', 'signup'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); setSuccess(''); }}
              className="uppercase relative transition-colors"
              style={{
                fontWeight: 300,
                fontSize: '10px',
                letterSpacing: '0.22em',
                color: mode === m ? '#fff3af' : '#f5f0e8',
              }}
            >
              {m === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
              {mode === m && <span className="absolute -bottom-1 left-0 right-0 h-px bg-gold" />}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="EMAIL"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 uppercase placeholder:text-foreground/20"
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 uppercase placeholder:text-foreground/20"
            style={inputStyle}
          />

          {error && (
            <p className="text-[#ff6b6b] uppercase tracking-[0.15em]"
              style={{ fontWeight: 300, fontSize: '9px' }}>
              {error}
            </p>
          )}
          {success && (
            <p className="text-[#b8f5a0] uppercase tracking-[0.15em]"
              style={{ fontWeight: 300, fontSize: '9px' }}>
              {success}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 uppercase tracking-[3px] transition-all duration-200 hover:brightness-90 active:scale-[0.99] disabled:opacity-50"
            style={{
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 700,
              fontSize: '10px',
              background: '#fff3af',
              color: '#111',
              marginTop: '4px',
            }}
          >
            {loading ? '...' : mode === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span
            className="text-foreground/20 uppercase tracking-[0.2em]"
            style={{ fontWeight: 300, fontSize: '8px' }}
          >
            OR
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full py-4 uppercase tracking-[3px] transition-all duration-200 hover:brightness-110 active:scale-[0.99]"
          style={{
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 700,
            fontSize: '10px',
            background: 'transparent',
            color: '#f5f0e8',
            border: '1px solid #2a2a2a',
          }}
        >
          CONTINUE WITH GOOGLE
        </button>
      </div>
    </>
  );
}
