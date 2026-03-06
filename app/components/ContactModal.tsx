'use client';

import { useEffect, useRef, useState } from 'react';

type Props = { open: boolean; onClose: () => void };

export default function ContactModal({ open, onClose }: Props) {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setSubmitted(true);
  }

  function handleClose() {
    onClose();
    setTimeout(() => setSubmitted(false), 300);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: '1px solid rgba(245,240,232,0.15)',
    color: '#f5f0e8',
    fontWeight: 300,
    fontSize: '11px',
    letterSpacing: '0.08em',
    padding: '12px 14px',
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 300,
    fontSize: '9px',
    letterSpacing: '0.22em',
    color: '#f5f0e8',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px',
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) handleClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.2s ease both',
      }}
    >
      <div
        style={{
          background: '#111',
          border: '1px solid rgba(245,240,232,0.12)',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '40px 36px',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          style={{
            position: 'absolute', top: 20, right: 20,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#f5f0e8', fontSize: '18px', lineHeight: 1,
          }}
        >
          ×
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <p className="label" style={{ marginBottom: '16px' }}>
              MESSAGE SENT
            </p>
            <h2
              className="heading"
              style={{ fontSize: '28px', letterSpacing: '4px', marginBottom: '12px' }}
            >
              GOT IT.
            </h2>
            <p
              style={{ fontWeight: 300, fontSize: '11px', color: '#f5f0e8', letterSpacing: '0.08em' }}
            >
              WE&apos;LL BE IN TOUCH SOON.
            </p>
          </div>
        ) : (
          <>
            <p className="label" style={{ marginBottom: '10px' }}>
              CONTACT
            </p>
            <h2
              className="heading"
              style={{ fontSize: '26px', letterSpacing: '4px', marginBottom: '32px' }}
            >
              GET IN TOUCH.
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input name="firstName" value={form.firstName} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} required style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: loading ? 'rgba(255,243,175,0.5)' : '#fff3af',
                  color: '#111',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '3px',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'opacity 0.2s',
                  marginTop: '4px',
                }}
              >
                {loading ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
