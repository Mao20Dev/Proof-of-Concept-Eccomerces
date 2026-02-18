import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const stores = [
  {
    id: 'rvlt', name: 'RVLT.', subtitle: 'Grunge Commerce', style: 'Grunge / Punk',
    colors: ['#E8541A', '#1A1612', '#39FF14', '#D41920'],
    font: 'Permanent Marker + Bebas Neue',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    description: 'Torn paper textures, distorted typography, spray paint accents, and rebellious underground energy. Anti-fashion for those who never fit in.'
  },
  // {
  //   id: 'frmat', name: 'FRMΛT.', subtitle: 'Maximum Everything', style: 'Maximalism',
  //   colors: ['#0A0A0A', '#FF0066', '#0057FF', '#E8FF00'],
  //   font: 'Unbounded + Space Mono',
  //   image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
  //   description: 'Sensory overload with clashing neons, kinetic typography, overlapping color blocks, and controlled chaos. We said no to boring.'
  // },
  {
    id: 'glss', name: 'GLSS.', subtitle: 'Clarity Through Design', style: 'Glassmorphism',
    colors: ['#0c0a1a', '#8B5CF6', '#38BDF8', '#EC4899'],
    font: 'Inter + System',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    description: 'Frosted glass panels, luminous gradients, and floating elements. Transparent luxury meets digital elegance in every interaction.'
  },

  
  {
    id: 'nbrut', name: 'NBRÜT.', subtitle: 'Ugly Is Beautiful', style: 'Neo-Brutalism',
    colors: ['#FEF9EF', '#FF5252', '#FFD740', '#69F0AE'],
    font: 'Archivo Black + Space Mono',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    description: 'Thick borders, solid shadows, flat colors, and raw honesty. Functional design that stripped away the polish and kept the soul.'
  },
  {
    id: 'snth', name: 'SNTH.', subtitle: 'Rewind The Future', style: '80s Synthwave',
    colors: ['#0D0221', '#FF0080', '#00D4FF', '#7928CA'],
    font: 'Bebas Neue + Space Mono',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    description: 'Neon gradients, chrome typography, retro grids, and VHS aesthetics. Fashion from a future that never happened — wear it now.'
  },
  {
    id: 'objkt', name: 'OBJKT.', subtitle: 'International Typography', style: 'Swiss Design',
    colors: ['#FAFAFA', '#0A0A0A', '#E21A1A', '#0057FF'],
    font: 'Helvetica Neue + Space Mono',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    description: 'Grid-based precision, bold Helvetica, red accent, black borders. The International Typographic Style — where form meets function.'
  },
  {
    id: 'dore', name: 'DORÈ.', subtitle: 'Heritage Collection', style: 'Luxury',
    colors: ['#1A2A1B', '#C9B99A', '#B8963E', '#F5F0E8'],
    font: 'Cormorant Garamond + Josefin Sans',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    description: 'Serif elegance, forest greens, champagne gold, and whisper-thin typography. Heritage craftsmanship meets contemporary refinement.'
  },
  {
    id: 'spct', name: 'SPCT.', subtitle: 'Tech Commerce', style: 'TechSpec / Terminal',
    colors: ['#0C0C0C', '#FF4D00', '#00FF87', '#0066FF'],
    font: 'JetBrains Mono + Inter',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
    description: 'Monospace terminal aesthetic, data-driven layouts, orange accent, progress bars and spec sheets. Technical fashion for the digital age.'
  },
  {
    id: 'chnk', name: 'CHNK.', subtitle: 'Bold Is The New Black', style: 'Bold / Pop',
    colors: ['#FFFDF5', '#2B44FF', '#FF2D8A', '#B8FF00'],
    font: 'Outfit + Space Grotesk',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80',
    description: 'Chunky borders, pop shadows, acid colors, and playful energy. Fashion that screams, laughs, and absolutely refuses to whisper.'
  },
  {
    id: 'brt', name: 'BRT.', subtitle: 'Raw Commerce', style: 'Brutalist / Editorial',
    colors: ['#F5F2EB', '#000000', '#444444', '#777777'],
    font: 'DM Sans + IBM Plex Mono',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    description: 'Monochrome editorial, crosshair cursor, halftone grain, and raw honesty. Anti-design stripped to its structural bones.'
  },
  {
    id: 'aftr', name: 'AFTR.', subtitle: 'Soft Club EP.3', style: 'Soft / Ethereal',
    colors: ['#E8EDF6', '#9498D4', '#B8B0D8', '#4A5A8A'],
    font: 'Sora + DM Sans',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80',
    description: 'Periwinkle dreamscapes, floating orbs, glass panels, and whisper-thin typography. A gentler way to dress — for quiet souls.'
  }
]

export default function Portfolio() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    document.body.style.cssText = 'background:#08080C;font-family:Inter,sans-serif;margin:0;'
    setTimeout(() => setLoaded(true), 100)
    return () => { document.body.style.cssText = '' }
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#08080C', color: '#F0F0F0' }}>
      <style>{`
        .pf-h{padding:80px 60px 40px;position:relative;overflow:hidden}
        .pf-h::before{content:'';position:absolute;top:-200px;right:-200px;width:600px;height:600px;background:radial-gradient(circle,rgba(139,92,246,.15),transparent 70%);pointer-events:none}
        .pf-badge{display:inline-block;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#8B5CF6;border:1px solid rgba(139,92,246,.3);padding:6px 16px;border-radius:100px;margin-bottom:24px;font-family:'Space Mono',monospace}
        .pf-title{font-size:clamp(48px,7vw,96px);font-weight:800;line-height:1;letter-spacing:-3px;margin-bottom:20px;background:linear-gradient(135deg,#F0F0F0,#8B5CF6,#3B82F6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .pf-sub{font-size:18px;color:#6B7280;max-width:600px;line-height:1.7;font-weight:300}
        .pf-count{font-family:'Space Mono',monospace;font-size:13px;color:#4B5563;margin-top:32px;letter-spacing:2px}
        .pf-count span{color:#8B5CF6}
        .pf-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(500px,1fr));gap:32px;padding:40px 60px 100px}
        .pf-card{position:relative;border-radius:20px;overflow:hidden;background:#111115;border:1px solid #1F1F28;text-decoration:none;color:inherit;transition:all .5s cubic-bezier(.22,1,.36,1);opacity:0;transform:translateY(30px)}
        .pf-card.show{opacity:1;transform:translateY(0)}
        .pf-card:hover{border-color:#8B5CF6;transform:translateY(-8px);box-shadow:0 20px 60px rgba(139,92,246,.15)}
        .pf-card-img{width:100%;aspect-ratio:16/9;overflow:hidden;position:relative}
        .pf-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .6s}
        .pf-card:hover .pf-card-img img{transform:scale(1.08)}
        .pf-card-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(8,8,12,.9) 0%,transparent 60%)}
        .pf-card-style{position:absolute;top:16px;left:16px;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.7);background:rgba(0,0,0,.5);backdrop-filter:blur(10px);padding:5px 12px;border-radius:100px;border:1px solid rgba(255,255,255,.1)}
        .pf-card-colors{position:absolute;top:16px;right:16px;display:flex;gap:4px}
        .pf-card-colors span{width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,.2)}
        .pf-card-body{padding:24px 28px 28px}
        .pf-card-name{font-size:28px;font-weight:700;letter-spacing:-0.5px;margin-bottom:6px}
        .pf-card-subtitle{font-size:14px;color:#6B7280;margin-bottom:14px}
        .pf-card-desc{font-size:13px;color:#4B5563;line-height:1.6;margin-bottom:20px}
        .pf-card-meta{display:flex;justify-content:space-between;align-items:center}
        .pf-card-font{font-size:11px;color:#374151;font-family:'Space Mono',monospace;letter-spacing:1px}
        .pf-card-arrow{width:40px;height:40px;border-radius:50%;background:#1F1F28;display:flex;align-items:center;justify-content:center;transition:all .3s;font-size:18px;color:#8B5CF6}
        .pf-card:hover .pf-card-arrow{background:#8B5CF6;color:white}
        @media(max-width:900px){.pf-h{padding:48px 24px 24px}.pf-grid{grid-template-columns:1fr;padding:24px}}
      `}</style>
      <div className="pf-h">
        <div className="pf-badge">MomentForge • Portfolio • 2026</div>
        <h1 className="pf-title">E-Commerce<br/>Design Systems</h1>
        <p className="pf-sub">Eleven radically different e-commerce experiences — fully functional with navigation, search, filters, and product pages. Each store maintains its own unique design language throughout.</p>
        <p className="pf-count"><span>11</span> stores • <span>11</span> unique design systems</p>
      </div>
      <div className="pf-grid">
        {stores.map((s, i) => (
          <Link to={`/${s.id}`} key={s.id} className={`pf-card ${loaded?'show':''}`} style={{ transitionDelay: `${i*120}ms` }}>
            <div className="pf-card-img">
              <img src={s.image} alt={s.name} loading="lazy" />
              <div className="pf-card-ov" />
              <span className="pf-card-style">{s.style}</span>
              <div className="pf-card-colors">{s.colors.map((c, j) => <span key={j} style={{ backgroundColor: c }} />)}</div>
            </div>
            <div className="pf-card-body">
              <h3 className="pf-card-name">{s.name}</h3>
              <p className="pf-card-subtitle">{s.subtitle}</p>
              <p className="pf-card-desc">{s.description}</p>
              <div className="pf-card-meta">
                <span className="pf-card-font">{s.font}</span>
                <span className="pf-card-arrow">→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
