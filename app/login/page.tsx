'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.replace('/account');
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { setError(error.message); setLoading(false); return; }
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

  const inputStyle: React.CSSProperties = {
    fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
    fontWeight: 300,
    fontSize: '11px',
    letterSpacing: '0.12em',
    background: '#1a1a1a',
    border: '1px solid #2a2a2a',
    color: '#f5f0e8',
    outline: 'none',
  };

  return (
    <main className="min-h-screen bg-[#111]">
      <Navbar />

      <div
        className="pt-32 px-16 pb-24 max-w-md"
        style={{ animation: 'fadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.1s both' }}
      >
        {/* Mode tabs */}
        <div className="flex gap-8 mb-10">
          {(['signin', 'signup'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(''); setSuccess(''); }}
              className="uppercase relative transition-colors"
              style={{
                fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
                fontWeight: 300,
                fontSize: '10px',
                letterSpacing: '0.22em',
                color: mode === m ? '#fff3af' : 'rgba(245,240,232,0.35)',
              }}
            >
              {m === 'signin' ? 'SIGN IN' : 'CREATE ACCOUNT'}
              {mode === m && <span className="absolute -bottom-1 left-0 right-0 h-px bg-[#fff3af]" />}
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
            className="w-full px-4 py-3 uppercase placeholder:text-[#f5f0e8]/20"
            style={inputStyle}
          />
          <input
            type="password"
            placeholder="PASSWORD"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 uppercase placeholder:text-[#f5f0e8]/20"
            style={inputStyle}
          />

          {error && (
            <p className="text-[#ff6b6b] uppercase tracking-[0.15em]"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '9px' }}>
              {error}
            </p>
          )}
          {success && (
            <p className="text-[#b8f5a0] uppercase tracking-[0.15em]"
              style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '9px' }}>
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

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[#2a2a2a]" />
          <span
            className="text-[#f5f0e8]/20 uppercase tracking-[0.2em]"
            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '8px' }}
          >
            OR
          </span>
          <div className="flex-1 h-px bg-[#2a2a2a]" />
        </div>

        {/* Google OAuth */}
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
    </main>
  );
}
