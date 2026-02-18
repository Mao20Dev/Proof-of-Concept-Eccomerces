import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from './useStore'
import { colorMap } from './data'

const CSS = `
.br{min-height:100vh;background:#F5F2EB;color:#000;font-family:'DM Sans',system-ui,sans-serif;overflow-x:hidden;cursor:crosshair}
.br *{box-sizing:border-box}
.br a{cursor:crosshair}
::selection{background:#000;color:#F5F2EB}

/* GRAIN OVERLAY */
.br::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");pointer-events:none;z-index:9998}

.br-back{position:fixed;top:12px;left:12px;z-index:9999;padding:8px 20px;background:#000;color:#F5F2EB;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;border:2px solid #000;cursor:crosshair;transition:all .15s}
.br-back:hover{background:#F5F2EB;color:#000}

/* LOADER - Clip path reveal */
.br-loader{position:fixed;inset:0;z-index:10000;background:#000;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:clip-path .8s cubic-bezier(.77,0,.175,1);clip-path:inset(0 0 0 0)}
.br-loader.hide{clip-path:inset(0 0 100% 0)}
.br-loader-text{font-family:'DM Sans',sans-serif;font-size:clamp(80px,18vw,200px);font-weight:900;color:#F5F2EB;letter-spacing:-8px;text-transform:uppercase;line-height:.85;mix-blend-mode:difference}
.br-loader-text .per{color:#444}
.br-loader-meta{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#444;margin-top:24px;letter-spacing:2px}
.br-loader-line{width:120px;height:1px;background:#333;margin-top:16px;position:relative;overflow:hidden}
.br-loader-line::after{content:'';position:absolute;inset:0;background:#F5F2EB;animation:brLine 1.4s ease-in-out infinite}
@keyframes brLine{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}

/* TRANSITION - Horizontal blinds */
.br-trans{position:fixed;inset:0;z-index:9990;pointer-events:none;display:flex;flex-direction:column}
.br-trans-strip{flex:1;background:#000;transform:scaleY(0);transition:transform .35s cubic-bezier(.77,0,.18,1);transform-origin:top}
.br-trans-strip:nth-child(1){transition-delay:0ms}
.br-trans-strip:nth-child(2){transition-delay:40ms}
.br-trans-strip:nth-child(3){transition-delay:80ms}
.br-trans-strip:nth-child(4){transition-delay:120ms}
.br-trans-strip:nth-child(5){transition-delay:160ms}
.br-trans.active .br-trans-strip{transform:scaleY(1)}
.br-tpage{opacity:1;transform:translateY(0);transition:opacity .3s,transform .3s}
.br-tpage.out{opacity:0;transform:translateY(15px)}

/* TOP BAR */
.br-topbar{display:flex;justify-content:space-between;padding:6px 24px;border-bottom:1px solid #000;font-family:'IBM Plex Mono',monospace;font-size:10px;color:#777;letter-spacing:1px}

/* NAV */
.br-nav{position:sticky;top:0;z-index:1000;background:#F5F2EB;border-bottom:2px solid #000}
.br-nav-row{display:grid;grid-template-columns:auto 1fr auto}
.br-logo{font-size:42px;font-weight:900;letter-spacing:-4px;padding:10px 24px;border-right:2px solid #000;display:flex;align-items:center;text-transform:uppercase;cursor:crosshair;transition:all .15s;background:none;border-top:0;border-bottom:0;border-left:0;color:#000;font-family:'DM Sans',sans-serif}
.br-logo:hover{background:#000;color:#F5F2EB}
.br-logo .per{color:#777}
.br-nlinks{display:flex;align-items:stretch}
.br-nlinks button{display:flex;align-items:center;padding:0 24px;font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:500;text-transform:uppercase;letter-spacing:2px;color:#000;border:none;border-right:1px solid #000;background:none;cursor:crosshair;transition:all .15s}
.br-nlinks button:hover,.br-nlinks button.a{background:#000;color:#F5F2EB}
.br-nlinks .idx{font-size:8px;vertical-align:super;margin-right:4px;color:#777}
.br-nright{display:flex;align-items:stretch;border-left:2px solid #000}
.br-nright button{display:flex;align-items:center;padding:0 24px;font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#000;border:none;border-right:1px solid #000;background:none;cursor:crosshair;transition:all .15s}
.br-nright button:last-child{border-right:none}
.br-nright button:hover{background:#000;color:#F5F2EB}
.br-nright .cart-n{font-weight:700;margin-left:4px}

/* HERO */
.br-hero{display:grid;grid-template-columns:1fr 1fr;min-height:88vh;border-bottom:2px solid #000}
.br-hero-l{display:flex;flex-direction:column;justify-content:space-between;padding:48px}
.br-hero-stamp{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#777;letter-spacing:2px;text-transform:uppercase}
.br-hero-center{position:relative}
.br-hero-title{font-size:clamp(56px,8.5vw,120px);font-weight:900;line-height:.88;letter-spacing:-6px;text-transform:uppercase}
.br-hero-title .struck{text-decoration:line-through;text-decoration-thickness:4px;color:#999}
.br-hero-title .ital{font-style:italic;font-weight:400}
.br-hero-title .outline{-webkit-text-stroke:2px #000;color:transparent}
.br-hero-note{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#555;line-height:1.7;max-width:340px;margin-top:28px;padding-top:20px;border-top:1px solid #000}
.br-hero-bottom{display:flex;justify-content:space-between;align-items:flex-end}
.br-hero-cta{display:inline-block;padding:14px 36px;border:2px solid #000;text-decoration:none;color:#000;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:3px;text-transform:uppercase;transition:all .15s;background:none;cursor:crosshair;font-weight:600}
.br-hero-cta:hover{background:#000;color:#F5F2EB}
.br-hero-coords{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#999;text-align:right;line-height:1.8}
.br-hero-r{position:relative;overflow:hidden;border-left:2px solid #000;background:#0A0A0A}
.br-hero-r img{width:100%;height:100%;object-fit:cover;filter:grayscale(100%) contrast(1.3);mix-blend-mode:luminosity;opacity:.85;transition:filter .5s}
.br-hero-r:hover img{filter:grayscale(100%) contrast(1.6) brightness(1.1)}
.br-hero-ov{position:absolute;bottom:0;left:0;right:0;padding:28px;font-size:clamp(50px,7vw,100px);font-weight:900;color:#F5F2EB;text-transform:uppercase;letter-spacing:-5px;line-height:.85;mix-blend-mode:difference;pointer-events:none}
.br-hero-idx{position:absolute;top:20px;right:20px;font-family:'IBM Plex Mono',monospace;font-size:100px;font-weight:700;color:rgba(255,255,255,.04);line-height:1}

/* TICKER */
.br-ticker{border-bottom:2px solid #000;padding:12px 0;overflow:hidden;background:#000}
.br-tick-track{display:flex;gap:80px;animation:brTick 30s linear infinite;width:max-content}
.br-tick-item{font-family:'IBM Plex Mono',monospace;font-size:11px;font-weight:400;text-transform:uppercase;letter-spacing:4px;white-space:nowrap;color:#555;display:flex;align-items:center;gap:80px}
.br-tick-item .sep{color:#333}
@keyframes brTick{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* SECTION */
.br-section{padding:64px 40px;border-bottom:2px solid #000}
.br-sec-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:40px;padding-bottom:20px;border-bottom:1px solid #000}
.br-sec-title{font-size:clamp(32px,5vw,56px);font-weight:900;text-transform:uppercase;letter-spacing:-3px;line-height:.9}
.br-sec-title .num{font-family:'IBM Plex Mono',monospace;font-size:14px;color:#777;letter-spacing:2px;display:block;margin-bottom:4px;font-weight:400}
.br-sec-meta{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#777;text-transform:uppercase;letter-spacing:2px;text-align:right;line-height:1.8}
.br-va{padding:12px 28px;border:2px solid #000;font-family:'IBM Plex Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;background:none;color:#000;cursor:crosshair;transition:all .15s}
.br-va:hover{background:#000;color:#F5F2EB}

/* FILTER */
.br-filter{display:flex;gap:0;margin-bottom:32px;border:2px solid #000;width:fit-content}
.br-ftag{padding:10px 20px;font-family:'IBM Plex Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:1px;border:none;border-right:1px solid #000;background:none;color:#000;cursor:crosshair;transition:all .15s}
.br-ftag:last-child{border-right:none}
.br-ftag:hover,.br-ftag.a{background:#000;color:#F5F2EB}

/* PRODUCT GRID */
.br-pgrid{display:grid;grid-template-columns:repeat(4,1fr)}
.br-pcard{overflow:hidden;border:2px solid #000;cursor:crosshair;transition:all .15s;text-align:left;color:#000;font-family:'DM Sans',sans-serif;padding:0;width:100%;background:#F5F2EB;position:relative;margin:-1px}
.br-pcard:hover{z-index:2;background:#000;color:#F5F2EB}
.br-pimg{position:relative;aspect-ratio:3/4;overflow:hidden;border-bottom:2px solid #000}
.br-pimg img{width:100%;height:100%;object-fit:cover;filter:grayscale(100%) contrast(1.2);transition:all .4s;mix-blend-mode:luminosity}
.br-pcard:hover .br-pimg img{filter:grayscale(100%) contrast(1.5) brightness(1.1)}
.br-ptag{position:absolute;top:0;left:0;padding:6px 14px;font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:2px;background:#000;color:#F5F2EB;border-right:1px solid #333;border-bottom:1px solid #333}
.br-pbody{padding:16px}
.br-pnum{font-family:'IBM Plex Mono',monospace;font-size:9px;color:#999;letter-spacing:1px;margin-bottom:4px}
.br-pname{font-size:14px;font-weight:700;margin-bottom:8px;line-height:1.3;letter-spacing:-.3px}
.br-pprice{display:flex;justify-content:space-between;align-items:center;font-family:'IBM Plex Mono',monospace}
.br-pprice .cur{font-size:16px;font-weight:700;letter-spacing:-1px}
.br-pprice .old{font-size:11px;text-decoration:line-through;color:#999;margin-left:6px}
.br-padd{padding:6px 14px;border:1px solid currentColor;font-family:'IBM Plex Mono',monospace;font-size:9px;text-transform:uppercase;letter-spacing:1px;background:none;color:inherit;cursor:crosshair;transition:all .15s}
.br-pcard:hover .br-padd{border-color:#F5F2EB}
.br-padd:hover{background:currentColor}

/* CATEGORIES */
.br-cats{display:grid;grid-template-columns:repeat(3,1fr)}
.br-cat{position:relative;aspect-ratio:3/4;overflow:hidden;border:2px solid #000;cursor:crosshair;background:none;color:inherit;width:100%;padding:0;margin:-1px;transition:all .15s}
.br-cat img{width:100%;height:100%;object-fit:cover;filter:grayscale(100%) contrast(1.3);transition:filter .4s}
.br-cat:hover img{filter:grayscale(100%) contrast(1.8) brightness(1.2)}
.br-cat-ov{position:absolute;inset:0;background:rgba(0,0,0,.6);display:flex;flex-direction:column;justify-content:flex-end;padding:24px;font-family:'DM Sans',sans-serif}
.br-cat-ov h3{font-size:clamp(24px,3vw,40px);font-weight:900;color:#F5F2EB;text-transform:uppercase;letter-spacing:-2px;line-height:.9}
.br-cat-ov span{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#888;letter-spacing:2px;margin-top:6px;text-transform:uppercase}
.br-cat-idx{position:absolute;top:16px;right:16px;font-family:'IBM Plex Mono',monospace;font-size:64px;font-weight:700;color:rgba(255,255,255,.06)}

/* EDITORIAL */
.br-editorial{display:grid;grid-template-columns:1fr 1fr;min-height:450px;border-bottom:2px solid #000}
.br-ed-text{padding:48px;display:flex;flex-direction:column;justify-content:center;border-right:2px solid #000}
.br-ed-text .stamp{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#777;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px}
.br-ed-text h3{font-size:clamp(28px,4vw,48px);font-weight:900;line-height:.9;text-transform:uppercase;letter-spacing:-3px;margin-bottom:16px}
.br-ed-text p{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#555;line-height:1.7;margin-bottom:24px;max-width:360px}
.br-ed-img{overflow:hidden;background:#0A0A0A}
.br-ed-img img{width:100%;height:100%;object-fit:cover;filter:grayscale(100%) contrast(1.3);mix-blend-mode:luminosity;opacity:.9}

/* DETAIL */
.br-detail{display:grid;grid-template-columns:1fr 1fr;border-bottom:2px solid #000}
.br-detail-img{overflow:hidden;border-right:2px solid #000;background:#0A0A0A;aspect-ratio:3/4}
.br-detail-img img{width:100%;height:100%;object-fit:cover;filter:grayscale(100%) contrast(1.2)}
.br-detail-info{padding:48px;display:flex;flex-direction:column;justify-content:center}
.br-detail-crumb{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#999;margin-bottom:20px;display:flex;gap:8px;letter-spacing:1px;text-transform:uppercase}
.br-detail-crumb span{cursor:crosshair;transition:color .15s}
.br-detail-crumb span:hover{color:#000}
.br-detail-name{font-size:clamp(28px,3.5vw,48px);font-weight:900;text-transform:uppercase;letter-spacing:-3px;line-height:.9;margin-bottom:16px}
.br-detail-price{font-family:'IBM Plex Mono',monospace;font-size:24px;font-weight:700;letter-spacing:-1px;margin-bottom:20px;display:flex;align-items:center;gap:12px}
.br-detail-price .old{font-size:16px;text-decoration:line-through;color:#999;font-weight:400}
.br-detail-desc{font-size:14px;color:#555;line-height:1.7;margin-bottom:28px;padding-bottom:24px;border-bottom:1px solid #000}
.br-opts{display:flex;flex-direction:column;gap:20px;margin-bottom:28px}
.br-opt-label{font-family:'IBM Plex Mono',monospace;font-size:9px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;color:#777}
.br-sizes{display:flex;gap:0}
.br-sizes button{padding:10px 18px;border:2px solid #000;margin-right:-2px;background:none;font-family:'IBM Plex Mono',monospace;font-size:12px;cursor:crosshair;transition:all .15s;color:#000}
.br-sizes button:hover,.br-sizes button.sel{background:#000;color:#F5F2EB}
.br-colors{display:flex;gap:8px}
.br-colors button{width:32px;height:32px;border-radius:0;border:2px solid #000;cursor:crosshair;transition:all .15s}
.br-colors button.sel{outline:2px solid #000;outline-offset:3px}
.br-add-btn{padding:16px 40px;border:2px solid #000;background:#000;color:#F5F2EB;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:crosshair;transition:all .15s;width:fit-content}
.br-add-btn:hover{background:#F5F2EB;color:#000}

/* RELATED */
.br-related{padding:48px 40px;border-bottom:2px solid #000}
.br-related h3{font-size:28px;font-weight:900;text-transform:uppercase;letter-spacing:-2px;margin-bottom:28px;padding-bottom:16px;border-bottom:1px solid #000}

/* SEARCH */
.br-search{max-width:700px;margin:0 auto;padding:60px 40px}
.br-search-box{display:flex;gap:0;margin-bottom:40px}
.br-search-box input{flex:1;padding:14px 20px;border:2px solid #000;font-family:'IBM Plex Mono',monospace;font-size:14px;outline:none;background:transparent;color:#000}
.br-search-box input:focus{background:#000;color:#F5F2EB}
.br-search-box button{padding:14px 28px;border:2px solid #000;border-left:none;background:#000;color:#F5F2EB;font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:2px;text-transform:uppercase;cursor:crosshair;transition:all .15s}

/* NEWSLETTER */
.br-nl{display:grid;grid-template-columns:1fr 1fr;border-bottom:2px solid #000}
.br-nl-l{padding:48px;border-right:2px solid #000;display:flex;flex-direction:column;justify-content:center}
.br-nl-l .stamp{font-family:'IBM Plex Mono',monospace;font-size:10px;color:#777;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px}
.br-nl-l h3{font-size:32px;font-weight:900;text-transform:uppercase;letter-spacing:-2px;line-height:.9;margin-bottom:10px}
.br-nl-l p{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#777;line-height:1.7}
.br-nl-r{padding:48px;display:flex;flex-direction:column;justify-content:center;gap:12px;background:#E8E4DE}
.br-nl-r label{font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#777}
.br-nl-r input{padding:12px 0;border:none;border-bottom:2px solid #000;background:transparent;font-family:'IBM Plex Mono',monospace;font-size:14px;outline:none;color:#000}
.br-nl-r input:focus{border-color:#555}
.br-nl-r button{align-self:flex-start;margin-top:8px}

/* FOOTER */
.br-footer{background:#000;color:#F5F2EB;border-top:2px solid #000}
.br-ftgrid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;border-bottom:1px solid #1A1A1A}
.br-ftcol{padding:48px 28px;border-right:1px solid #1A1A1A}
.br-ftcol:last-child{border-right:none}
.br-ftcol .logo{font-size:28px;font-weight:900;letter-spacing:-3px;margin-bottom:8px;display:flex;align-items:center}
.br-ftcol .logo .per{color:#555}
.br-ftcol .desc{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#444;line-height:1.7}
.br-ftcol h5{font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#555;margin-bottom:16px}
.br-ftcol a{display:block;color:#555;font-family:'IBM Plex Mono',monospace;font-size:11px;margin-bottom:8px;cursor:crosshair;transition:color .15s;text-decoration:none}
.br-ftcol a:hover{color:#F5F2EB}
.br-ftbot{display:flex;justify-content:space-between;padding:20px 28px;font-family:'IBM Plex Mono',monospace;font-size:10px;color:#444;letter-spacing:1px}
.br-ftbot .sc{display:flex;gap:16px}
.br-ftbot .sc a{color:#444;cursor:crosshair;transition:color .15s;text-decoration:none}
.br-ftbot .sc a:hover{color:#F5F2EB}

@media(max-width:1024px){
  .br-hero,.br-editorial,.br-nl,.br-detail{grid-template-columns:1fr}
  .br-hero-r{border-left:none;border-top:2px solid #000;min-height:50vh}
  .br-detail-img{border-right:none;border-bottom:2px solid #000;min-height:50vh}
  .br-ed-text{border-right:none;border-bottom:2px solid #000}
  .br-nl-l{border-right:none;border-bottom:2px solid #000}
  .br-pgrid{grid-template-columns:repeat(2,1fr)}
  .br-cats{grid-template-columns:1fr}
  .br-ftgrid{grid-template-columns:1fr 1fr}
}
@media(max-width:640px){
  .br-nlinks{display:none}
  .br-section{padding:32px 16px}
  .br-pgrid{grid-template-columns:1fr}
  .br-hero-l{padding:28px 16px}
  .br-detail-info{padding:28px 16px}
  .br-ftgrid{grid-template-columns:1fr}
  .br-topbar{padding:6px 16px}
  .br-related{padding:32px 16px}
}
`

const Card = ({ p, st, i }) => (
  <button className="br-pcard" onClick={() => st.go('product', { id: p.id })}>
    <div className="br-pimg">
      <img src={p.img} alt={p.name} loading="lazy" />
      {p.badge && <span className="br-ptag">{p.badge}</span>}
    </div>
    <div className="br-pbody">
      <div className="br-pnum">No.{String(i + 1).padStart(3, '0')}</div>
      <div className="br-pname">{p.name}</div>
      <div className="br-pprice">
        <span><span className="cur">${p.price}</span>{p.oldPrice && <span className="old">${p.oldPrice}</span>}</span>
        <button className="br-padd" onClick={e => e.stopPropagation()}>Add</button>
      </div>
    </div>
  </button>
)

const tickItems = ['RAW COMMERCE','—','REDUCTION','—','FUNCTION OVER FORM','—','EST. 2026','—','ANTI-DESIGN','—','CROSSHAIR','—']

export default function Brut() {
  const nav = useNavigate()
  const st = useStore('BRT', 1.1)
  useEffect(() => { document.body.style.background = '#F5F2EB'; return () => { document.body.style.background = '' } }, [])
  const tClass = st.transitioning ? 'br-tpage out' : 'br-tpage'

  return (
    <div className="br">
      <style>{CSS}</style>

      {/* LOADER */}
      <div className={`br-loader ${!st.loading ? 'hide' : ''}`}>
        <div className="br-loader-text">BRUT<span className="per">.</span></div>
        <div className="br-loader-meta">RAW COMMERCE SYSTEM — 2026</div>
        <div className="br-loader-line" />
      </div>

      {/* TRANSITION - Horizontal blinds */}
      <div className={`br-trans ${st.transitioning ? 'active' : ''}`}>
        <div className="br-trans-strip" />
        <div className="br-trans-strip" />
        <div className="br-trans-strip" />
        <div className="br-trans-strip" />
        <div className="br-trans-strip" />
      </div>

      <button className="br-back" onClick={() => nav('/')}>← Portfolio</button>

      {/* TOP BAR */}
      <div className="br-topbar">
        <span>BRT.SYS — V.01</span>
        <span>47°22'N / 8°32'E</span>
        <span>RAW COMMERCE™</span>
      </div>

      {/* NAV */}
      <nav className="br-nav">
        <div className="br-nav-row">
          <button className="br-logo" onClick={() => st.go('home')}>BRUT<span className="per">.</span></button>
          <div className="br-nlinks">
            {st.cats.map((c, i) => <button key={c} className={st.cat === c && st.page === 'shop' ? 'a' : ''} onClick={() => st.go('shop', { cat: c })}><span className="idx">{String(i + 1).padStart(2, '0')}</span>{c}</button>)}
          </div>
          <div className="br-nright">
            <button onClick={() => st.go('search')}>Search</button>
            <button>Cart<span className="cart-n">(2)</span></button>
          </div>
        </div>
      </nav>

      <div className={tClass}>
        {/* HOME */}
        {st.page === 'home' && <>
          {/* HERO */}
          <div className="br-hero">
            <div className="br-hero-l">
              <div className="br-hero-stamp">SS26 — Raw Collection</div>
              <div className="br-hero-center">
                <h1 className="br-hero-title"><span className="struck">FASHION</span><br/>IS <span className="ital">dead</span><br/><span className="outline">LONG LIVE</span><br/>FORM</h1>
                <p className="br-hero-note">Reduction to essence. Every piece stripped of the unnecessary. What remains is structure, material, and intent. Nothing more.</p>
              </div>
              <div className="br-hero-bottom">
                <button className="br-hero-cta" onClick={() => st.go('shop', { cat: 'All' })}>Enter Archive →</button>
                <div className="br-hero-coords">47°22′35″N<br/>008°32′51″E<br/>Zürich, CH</div>
              </div>
            </div>
            <div className="br-hero-r">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80" alt="Hero" />
              <div className="br-hero-ov">RAW<br/>FORM</div>
              <div className="br-hero-idx">01</div>
            </div>
          </div>

          {/* TICKER */}
          <div className="br-ticker">
            <div className="br-tick-track">
              {[...tickItems, ...tickItems].map((t, i) => <span key={i} className="br-tick-item">{t === '—' ? <span className="sep">—</span> : t}</span>)}
            </div>
          </div>

          {/* PRODUCTS */}
          <div className="br-section">
            <div className="br-sec-head">
              <h2 className="br-sec-title"><span className="num">SEC.01</span>ARCHIVE</h2>
              <div className="br-sec-meta">20 OBJECTS<br/>SS26 COLLECTION</div>
            </div>
            <div className="br-pgrid">{st.products.slice(0, 8).map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}</div>
          </div>

          {/* CATEGORIES */}
          <div className="br-section">
            <div className="br-sec-head">
              <h2 className="br-sec-title"><span className="num">SEC.02</span>INDEX</h2>
              <button className="br-va" onClick={() => st.go('shop', { cat: 'All' })}>View Archive →</button>
            </div>
            <div className="br-cats">
              <button className="br-cat" onClick={() => st.go('shop', { cat: 'Outerwear' })}><img src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=700&q=80" alt="" /><div className="br-cat-ov"><h3>Outer—<br/>wear</h3><span>8 Objects</span></div><span className="br-cat-idx">01</span></button>
              <button className="br-cat" onClick={() => st.go('shop', { cat: 'Footwear' })}><img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700&q=80" alt="" /><div className="br-cat-ov"><h3>Foot—<br/>wear</h3><span>6 Objects</span></div><span className="br-cat-idx">02</span></button>
              <button className="br-cat" onClick={() => st.go('shop', { cat: 'Accessories' })}><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80" alt="" /><div className="br-cat-ov"><h3>Access—<br/>ories</h3><span>6 Objects</span></div><span className="br-cat-idx">03</span></button>
            </div>
          </div>

          {/* EDITORIAL */}
          <div className="br-editorial">
            <div className="br-ed-text">
              <span className="stamp">JOURNAL — VOL.01</span>
              <h3>THE<br/>BEAUTY OF<br/>NOTHING</h3>
              <p>Our SS26 collection asks: what happens when you remove everything that doesn't serve the garment? What remains is honest, functional, and — perhaps accidentally — beautiful.</p>
              <button className="br-hero-cta" onClick={() => st.go('shop', { cat: 'All' })}>Read →</button>
            </div>
            <div className="br-ed-img"><img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80" alt="" /></div>
          </div>

          {/* NEWSLETTER */}
          <div className="br-nl">
            <div className="br-nl-l">
              <span className="stamp">TRANSMISSIONS</span>
              <h3>RECEIVE<br/>SIGNALS</h3>
              <p>Dispatches on raw form, new objects, and occasional thoughts on reduction. No noise.</p>
            </div>
            <div className="br-nl-r">
              <label>EMAIL</label>
              <input type="email" placeholder="address@domain" />
              <label>NAME</label>
              <input type="text" placeholder="identifier" />
              <button className="br-hero-cta" style={{ marginTop: 8 }}>Subscribe →</button>
            </div>
          </div>
        </>}

        {/* SHOP */}
        {st.page === 'shop' && <div className="br-section">
          <div className="br-sec-head"><h2 className="br-sec-title"><span className="num">ARCHIVE</span>{st.cat !== 'All' ? st.cat.toUpperCase() : 'ALL OBJECTS'}</h2></div>
          <div className="br-filter">
            {st.cats.map(c => <button key={c} className={`br-ftag ${st.cat === c ? 'a' : ''}`} onClick={() => st.go('shop', { cat: c })}>{c}</button>)}
          </div>
          <div className="br-pgrid">{st.filtered.map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}</div>
          {st.filtered.length === 0 && <p style={{ textAlign: 'center', padding: 60, color: '#777', fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, letterSpacing: 2 }}>NO OBJECTS FOUND</p>}
        </div>}

        {/* PRODUCT */}
        {st.page === 'product' && st.product && <><div className="br-detail">
          <div className="br-detail-img"><img src={st.product.img} alt={st.product.name} /></div>
          <div className="br-detail-info">
            <div className="br-detail-crumb"><span onClick={() => st.go('home')}>Home</span> / <span onClick={() => st.go('shop', { cat: st.product.cat })}>{st.product.cat}</span> / {st.product.name}</div>
            <h1 className="br-detail-name">{st.product.name}</h1>
            <div className="br-detail-price"><span>${st.product.price}</span>{st.product.oldPrice && <span className="old">${st.product.oldPrice}</span>}</div>
            <p className="br-detail-desc">{st.product.desc}</p>
            <div className="br-opts">
              <div><div className="br-opt-label">SIZE</div><div className="br-sizes">{st.product.sizes.map(s => <button key={s} className={st.selSize === s ? 'sel' : ''} onClick={() => st.setSelSize(s)}>{s}</button>)}</div></div>
              <div><div className="br-opt-label">COLOR</div><div className="br-colors">{st.product.colors.map(c => <button key={c} className={st.selColor === c ? 'sel' : ''} style={{ background: colorMap[c] || '#ddd' }} onClick={() => st.setSelColor(c)} />)}</div></div>
            </div>
            <button className="br-add-btn">ADD TO ARCHIVE →</button>
          </div>
        </div>
        <div className="br-related">
          <h3>RELATED OBJECTS</h3>
          <div className="br-pgrid">{st.related.map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}</div>
        </div></>}

        {/* SEARCH */}
        {st.page === 'search' && <div className="br-search">
          <h2 className="br-sec-title" style={{ marginBottom: 24 }}><span className="num">QUERY</span>SEARCH ARCHIVE</h2>
          <div className="br-search-box">
            <input value={st.search} onChange={e => st.setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && st.doSearch()} placeholder="Enter search query..." />
            <button onClick={st.doSearch}>Search →</button>
          </div>
          {st.sq && <div className="br-pgrid">{st.filtered.map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}</div>}
        </div>}
      </div>

      {/* FOOTER */}
      <footer className="br-footer">
        <div className="br-ftgrid">
          <div className="br-ftcol"><div className="logo">BRUT<span className="per">.</span></div><p className="desc">Raw commerce. Reduced to essence. Anti-design since 2026.</p></div>
          <div className="br-ftcol"><h5>ARCHIVE</h5><a onClick={() => st.go('shop', { cat: 'All' })}>All</a><a onClick={() => st.go('shop', { cat: 'Outerwear' })}>Outerwear</a><a onClick={() => st.go('shop', { cat: 'Footwear' })}>Footwear</a><a onClick={() => st.go('shop', { cat: 'Bags' })}>Bags</a></div>
          <div className="br-ftcol"><h5>INDEX</h5><a>Journal</a><a>About</a><a>Process</a><a>Contact</a></div>
          <div className="br-ftcol"><h5>SYSTEM</h5><a>Shipping</a><a>Returns</a><a>FAQ</a><a>Terms</a></div>
        </div>
        <div className="br-ftbot"><span>© 2026 BRUT. ALL RIGHTS RESERVED.</span><div className="sc"><a>IG</a><a>TW</a><a>ARE.NA</a></div></div>
      </footer>
    </div>
  )
}
