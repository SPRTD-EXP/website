'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PartnerModal from '../components/PartnerModal';
import Spline from '@splinetool/react-spline';

type Project = { id: string; name: string; description: string | null; image: string | null; active?: boolean };

const projects: Project[] = [
  {
    id: 'queue',
    name: 'QUEUE',
    description: 'A full loyalty program buildout for an emerging streetwear label — custom point system, member tiers, and exclusive drop access for top customers.',
    image: null,
    active: true,
  },
  {
    id: 'runs',
    name: 'RUNS',
    description: null,
    image: null,
    active: false,
  },
];

export default function Solutions() {
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project>(projects[0]);

  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      <PartnerModal open={partnerOpen} onClose={() => setPartnerOpen(false)} />

      {/* ── HERO ── */}
      <section className="relative min-h-screen overflow-hidden">

        {/* Spline — full background */}
        <div className="absolute inset-0 z-[1] pointer-events-none">
          <Spline
            scene="https://prod.spline.design/7Y-pM0UpfaWlBWvO/scene.splinecode"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Top center — page label */}
        <div className="absolute top-[72px] left-1/2 -translate-x-1/2 z-10 text-center">
          <p className="label" style={{ fontSize: '8px', letterSpacing: '0.3em', paddingLeft: '0.3em', color: '#fff3af' }}>SOLUTIONS</p>
        </div>

        {/* Top center — heading */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-10 text-center" style={{ animation: 'fadeInDown 1s cubic-bezier(0.16,1,0.3,1) 0.3s both' }}>
          <h1
            className="heading"
            style={{ fontSize: 'clamp(44px, 9vw, 100px)', letterSpacing: '-0.01em', lineHeight: 0.95, textShadow: '0 2px 40px rgba(0,0,0,0.85), 0 0 80px rgba(0,0,0,0.5), 0 0 60px rgba(200,160,60,0.18), 0 0 120px rgba(200,160,60,0.09)' }}
          >
            EARN LOYALTY.<br />BUILD TRUST.
          </h1>
        </div>

        {/* Bottom center — buttons + scroll cue */}
        <div className="absolute bottom-[25vh] left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-6 text-center" style={{ animation: 'fadeInUp 1s cubic-bezier(0.16,1,0.3,1) 0.5s both' }}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setPartnerOpen(true)}
              className="discover-btn uppercase tracking-[0.22em] cursor-pointer"
            >
              GET STARTED
            </button>
            <button
              className="discover-btn uppercase tracking-[0.22em] cursor-pointer"
            >
              POLICIES
            </button>
          </div>

          <a
            href="#projects"
            className="flex flex-col items-center gap-2 group transition-all duration-200 hover:text-gold"
            style={{ color: '#fff3af' }}
          >
            <span style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '8px', letterSpacing: '0.25em', paddingLeft: '0.25em' }}>SEE PROJECTS</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-y-1 transition-transform duration-300">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>

      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="flex min-h-screen border-t border-border">

        {/* Sidebar */}
        <aside className="w-[200px] shrink-0 border-r border-border flex flex-col items-start justify-center px-8">
          {projects.map(p => (
            <button
              key={p.id}
              onClick={() => setActiveProject(p)}
              style={{
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: activeProject.id === p.id ? 700 : 300,
                fontSize: '10px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                textAlign: 'left',
                color: activeProject.id === p.id ? '#fff3af' : '#f5f0e8',
                background: 'none',
                border: 'none',
                paddingBottom: '12px',
                marginBottom: '16px',
                cursor: 'pointer',
                width: '100%',
                transition: 'font-weight 0.15s',
              }}
            >
              <span style={{ display: 'inline-block', transform: 'translateX(0.09em)' }}>{p.name}</span>
            </button>
          ))}
        </aside>

        {/* Main panel */}
        <div className="flex-1 flex flex-col items-center justify-center gap-10 px-12 lg:px-20 py-16">
          {activeProject.description === null ? (
            <div className="flex flex-col items-center text-center gap-4">
              <p className="label">PAGE LOCKED</p>
              <h2 className="heading" style={{ fontSize: 'clamp(36px, 8vw, 64px)', letterSpacing: '4px', lineHeight: 1 }}>NOT YET.</h2>
              <p style={{ fontWeight: 300, fontSize: '12px', color: '#f5f0e8', lineHeight: 1.7, letterSpacing: '0.08em', maxWidth: '20rem' }}>
                THIS PAGE ISN&apos;T AVAILABLE YET. CHECK BACK SOON.
              </p>
            </div>
          ) : (
            <>
              <p className="body-copy max-w-lg" style={{ fontSize: '13px', lineHeight: 1.7 }}>
                {activeProject.description}
              </p>
              <div className="relative w-full max-w-3xl bg-[#1a1a1a] border border-border overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {activeProject.image ? (
                  <Image src={activeProject.image} alt={activeProject.name} fill unoptimized style={{ objectFit: 'cover' }} />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontWeight: 300, fontSize: '9px', letterSpacing: '0.25em', color: 'rgba(245,240,232,0.2)', textTransform: 'uppercase' }}>
                      PROJECT IMAGE
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </section>

      <Footer />
    </main>
  );
}
