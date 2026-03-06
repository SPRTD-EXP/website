'use client';

import { useEffect, useRef, useState } from 'react';

type Props = { open: boolean; onClose: () => void };

const NICHES = [
  'FITNESS & WELLNESS',
  'SPORTS & ATHLETICS',
  'STREETWEAR & FASHION',
  'FOOD & BEVERAGE',
  'MUSIC & ENTERTAINMENT',
  'TECH & MEDIA',
  'BEAUTY & GROOMING',
  'OTHER',
];

const TIERS = ['ASSOCIATE', 'PARTNER', 'PRINCIPAL', 'NOT SURE YET'];

export default function PartnerModal({ open, onClose }: Props) {
  const [form, setForm] = useState({
    businessName: '',
    contactName: '',
    email: '',
    website: '',
    niche: '',
    tier: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/partner', {
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
    appearance: 'none',
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
        background: 'rgba(0,0,0,0.8)',
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
          maxWidth: '560px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '40px 36px',
          animation: 'fadeInUp 0.3s cubic-bezier(0.16,1,0.3,1) both',
          position: 'relative',
        }}
      >
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
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <p className="label" style={{ marginBottom: '16px' }}>
              APPLICATION RECEIVED
            </p>
            <h2 className="heading" style={{ fontSize: '28px', letterSpacing: '4px', marginBottom: '12px' }}>
              WE&apos;LL BE IN TOUCH.
            </h2>
            <p style={{ fontWeight: 300, fontSize: '11px', color: '#f5f0e8', letterSpacing: '0.08em', lineHeight: 1.6 }}>
              A MEMBER OF THE SPRTD TEAM WILL REACH OUT WITHIN 48 HOURS.
            </p>
          </div>
        ) : (
          <>
            <p className="label" style={{ marginBottom: '10px' }}>
              PARTNERSHIP INQUIRY
            </p>
            <h2 className="heading" style={{ fontSize: '24px', letterSpacing: '4px', marginBottom: '32px' }}>
              GET STARTED.
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Business Name</label>
                  <input name="businessName" value={form.businessName} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Your Name</label>
                  <input name="contactName" value={form.contactName} onChange={handleChange} required style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Website (optional)</label>
                  <input name="website" value={form.website} onChange={handleChange} style={inputStyle} placeholder="https://" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Business Niche</label>
                <select name="niche" value={form.niche} onChange={handleChange} required style={{ ...inputStyle, color: '#f5f0e8' }}>
                  <option value="" disabled style={{ background: '#111' }}>SELECT YOUR INDUSTRY</option>
                  {NICHES.map(n => (
                    <option key={n} value={n} style={{ background: '#111', color: '#f5f0e8' }}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Partnership Tier Interest</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {TIERS.map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, tier: t }))}
                      style={{
                        padding: '10px 8px',
                        border: form.tier === t ? '1px solid #fff3af' : '1px solid rgba(245,240,232,0.15)',
                        background: 'transparent',
                        color: form.tier === t ? '#fff3af' : '#f5f0e8',
                        fontWeight: 300,
                        fontSize: '9px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Tell Us About Your Business</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="WHAT DO YOU DO, WHO DO YOU SERVE, AND WHAT ARE YOU LOOKING FOR IN A PARTNERSHIP?"
                  style={{ ...inputStyle, resize: 'none', color: '#f5f0e8' }}
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
                  marginTop: '4px',
                }}
              >
                {loading ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
