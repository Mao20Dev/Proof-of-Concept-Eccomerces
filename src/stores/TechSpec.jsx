import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from './useStore'
import { colorMap } from './data'

const CSS = `
.ts{min-height:100vh;background:#0C0C0C;color:#E8E8E8;font-family:'JetBrains Mono','Space Mono',monospace;overflow-x:hidden}
.ts *{box-sizing:border-box}
.ts::after{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,.008) 2px,rgba(255,255,255,.008) 4px);pointer-events:none;z-index:9998}
.ts-back{position:fixed;top:16px;left:16px;z-index:9999;padding:7px 18px;background:transparent;color:#666;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;border:1px solid #2A2A2A;cursor:pointer;transition:all .2s}
.ts-back:hover{border-color:#FF4D00;color:#FF4D00}

/* LOADER */
.ts-loader{position:fixed;inset:0;z-index:10000;background:#0C0C0C;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;transition:opacity .4s}
.ts-loader.hide{opacity:0;pointer-events:none}
.ts-loader-id{font-size:11px;color:#666;letter-spacing:4px;text-transform:uppercase}
.ts-loader-bar{width:200px;height:2px;background:#222;overflow:hidden;border-radius:1px}
.ts-loader-fill{height:100%;background:#FF4D00;animation:tsFill 1.5s ease forwards}
@keyframes tsFill{from{width:0}to{width:100%}}
.ts-loader-pct{font-family:'Inter',sans-serif;font-size:48px;font-weight:700;color:#FF4D00;letter-spacing:-2px}

/* TRANSITION */
.ts-trans{position:fixed;inset:0;z-index:9990;pointer-events:none;display:flex}
.ts-trans-strip{flex:1;background:#FF4D00;transform:scaleY(0);transition:transform .35s cubic-bezier(.86,0,.07,1)}
.ts-trans-strip:nth-child(1){transition-delay:0s}
.ts-trans-strip:nth-child(2){transition-delay:.04s}
.ts-trans-strip:nth-child(3){transition-delay:.08s}
.ts-trans-strip:nth-child(4){transition-delay:.12s}
.ts-trans-strip:nth-child(5){transition-delay:.16s}
.ts-trans.active .ts-trans-strip{transform:scaleY(1)}
.ts-page{opacity:1;transition:opacity .25s}
.ts-page.out{opacity:0}

/* NAV TOP */
.ts-navtop{display:flex;justify-content:space-between;padding:6px 32px;border-bottom:1px solid #2A2A2A;font-size:10px;color:#666;letter-spacing:2px}
.ts-nav{position:sticky;top:0;z-index:1000;background:rgba(12,12,12,.95);backdrop-filter:blur(12px);border-bottom:1px solid #2A2A2A}
.ts-nav-main{display:flex;align-items:stretch;justify-content:space-between}
.ts-nav-logo{font-family:'Inter',sans-serif;font-size:22px;font-weight:800;color:#F5F5F5;padding:14px 32px;border-right:1px solid #2A2A2A;display:flex;align-items:center;gap:8px;letter-spacing:-1px;cursor:pointer;background:none;border-top:none;border-bottom:none;border-left:none}
.ts-nav-logo .dot{width:8px;height:8px;background:#FF4D00;border-radius:50%;animation:tsPulse 2s infinite}
@keyframes tsPulse{0%,100%{opacity:1}50%{opacity:.4}}
.ts-nlinks{display:flex;align-items:stretch}
.ts-nlinks button{display:flex;align-items:center;padding:0 20px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#666;border:none;border-right:1px solid #2A2A2A;background:none;cursor:pointer;transition:all .15s}
.ts-nlinks button:hover,.ts-nlinks button.a{color:#FF4D00;background:#111}
.ts-nlinks button .k{color:#444;margin-right:6px;font-size:9px}
.ts-nright{display:flex;align-items:stretch;border-left:1px solid #2A2A2A}
.ts-nright button{display:flex;align-items:center;padding:0 20px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#666;border:none;border-right:1px solid #2A2A2A;background:none;cursor:pointer;transition:all .15s}
.ts-nright button:last-child{border-right:none}
.ts-nright button:hover{color:#FF4D00;background:#111}
.ts-nright .ct{color:#FF4D00;font-weight:700}

/* HERO */
.ts-hero{display:grid;grid-template-columns:1fr 1fr;min-height:90vh;border-bottom:1px solid #2A2A2A}
.ts-hero-data{padding:48px 40px;display:flex;flex-direction:column;justify-content:space-between;border-right:1px solid #2A2A2A;position:relative}
.ts-hero-tag{display:inline-flex;align-items:center;gap:8px;font-size:10px;color:#FF4D00;letter-spacing:3px;text-transform:uppercase}
.ts-hero-tag .live{width:6px;height:6px;background:#00FF87;border-radius:50%;animation:tsPulse 1.5s infinite}
.ts-hero-titles{margin:40px 0}
.ts-hero h1{font-family:'Inter',sans-serif;font-size:clamp(48px,7vw,96px);font-weight:900;line-height:.9;letter-spacing:-4px;color:#F5F5F5}
.ts-hero h1 .accent{color:#FF4D00}
.ts-hero h1 .dim{color:#666;font-weight:300}
.ts-hero-specs{margin-top:32px;display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#2A2A2A;border:1px solid #2A2A2A}
.ts-spec{background:#0C0C0C;padding:16px}
.ts-spec .label{font-size:9px;color:#444;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px}
.ts-spec .val{font-family:'Inter',sans-serif;font-size:16px;font-weight:700;color:#F5F5F5;letter-spacing:-.5px}
.ts-spec .val .unit{font-size:10px;color:#666;font-weight:400;margin-left:2px}
.ts-hero-btns{display:flex;gap:12px}
.ts-btn-pri{padding:14px 32px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;border:1px solid #FF4D00;background:#FF4D00;color:#0C0C0C;cursor:pointer;transition:all .2s;display:inline-flex;align-items:center;gap:8px}
.ts-btn-pri:hover{background:transparent;color:#FF4D00}
.ts-btn-ghost{padding:14px 32px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;border:1px solid #2A2A2A;background:transparent;color:#666;cursor:pointer;transition:all .2s}
.ts-btn-ghost:hover{border-color:#E8E8E8;color:#E8E8E8}
.ts-hero-vis{position:relative;overflow:hidden;background:#111;display:flex;align-items:center;justify-content:center}
.ts-hero-vis img{width:100%;height:100%;object-fit:cover;filter:grayscale(30%) contrast(1.1);opacity:.8;transition:all .5s}
.ts-hero-vis:hover img{filter:grayscale(0%);opacity:.9}
.ts-hero-overlay{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:32px;background:linear-gradient(to top,rgba(12,12,12,.8) 0%,transparent 50%)}
.ts-hero-overlay .big{font-family:'Inter',sans-serif;font-size:80px;font-weight:900;color:rgba(255,255,255,.04);letter-spacing:-4px;line-height:.85}
.ts-hero-corner{position:absolute;top:24px;right:24px;font-size:10px;color:#444;text-align:right;line-height:1.8;letter-spacing:1px}

/* TICKER */
.ts-ticker{border-bottom:1px solid #2A2A2A;padding:10px 0;overflow:hidden}
.ts-ttrack{display:flex;gap:48px;animation:tsTick 25s linear infinite;width:max-content}
.ts-titem{font-size:11px;color:#444;letter-spacing:3px;text-transform:uppercase;white-space:nowrap;display:flex;align-items:center;gap:48px}
.ts-titem::after{content:'//';color:#333}
@keyframes tsTick{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* SECTIONS */
.ts-products-sec{border-bottom:1px solid #2A2A2A}
.ts-secbar{display:flex;justify-content:space-between;align-items:center;padding:16px 32px;border-bottom:1px solid #2A2A2A}
.ts-secbar .title{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#666}
.ts-secbar .title span{color:#FF4D00}
.ts-secbar .meta{font-size:10px;color:#444}
.ts-frow{display:flex;border-bottom:1px solid #2A2A2A}
.ts-fbtn{padding:10px 20px;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;background:none;border:none;border-right:1px solid #2A2A2A;color:#666;cursor:pointer;transition:all .15s}
.ts-fbtn.a{color:#FF4D00;background:#111}
.ts-fbtn:hover:not(.a){color:#E8E8E8;background:#111}

/* PRODUCT GRID */
.ts-pgrid{display:grid;grid-template-columns:repeat(4,1fr)}
.ts-pcard{border-right:1px solid #2A2A2A;border-bottom:1px solid #2A2A2A;cursor:pointer;transition:background .2s;background:none;padding:0;text-align:left;font-family:inherit;color:inherit}
.ts-pcard:nth-child(4n){border-right:none}
.ts-pcard:hover{background:#111}
.ts-pimg{aspect-ratio:1;overflow:hidden;border-bottom:1px solid #2A2A2A;position:relative;background:#1A1A1A}
.ts-pimg img{width:100%;height:100%;object-fit:cover;filter:grayscale(40%) contrast(1.1);transition:all .4s}
.ts-pcard:hover .ts-pimg img{filter:grayscale(0%);transform:scale(1.04)}
.ts-pimg .idx{position:absolute;top:8px;left:10px;font-size:9px;color:#444;letter-spacing:1px}
.ts-pimg .tag{position:absolute;top:8px;right:10px;font-size:8px;letter-spacing:2px;text-transform:uppercase;background:#FF4D00;color:#0C0C0C;padding:3px 8px}
.ts-pimg .tag.sale{background:#0066FF}
.ts-pimg .tag.hot{background:#00FF87;color:#0C0C0C}
.ts-pimg .tag.ltd{background:#FFD600;color:#0C0C0C}
.ts-pinfo{padding:14px 16px}
.ts-pinfo .brand{font-size:9px;color:#444;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px}
.ts-pinfo .name{font-family:'Inter',sans-serif;font-size:14px;font-weight:600;color:#F5F5F5;margin-bottom:8px;letter-spacing:-.3px;line-height:1.2}
.ts-pinfo .row{display:flex;justify-content:space-between;align-items:center;padding-top:8px;border-top:1px solid #2A2A2A}
.ts-pinfo .price{font-size:14px;font-weight:700;color:#FF4D00;letter-spacing:-.5px}
.ts-pinfo .price .old{color:#444;text-decoration:line-through;font-weight:400;font-size:11px;margin-left:6px}
.ts-pinfo .add{font-size:8px;letter-spacing:2px;text-transform:uppercase;padding:5px 12px;border:1px solid #2A2A2A;background:none;color:#666;cursor:pointer;transition:all .15s;font-family:inherit}
.ts-pinfo .add:hover{border-color:#FF4D00;color:#FF4D00}

/* SPLIT */
.ts-split{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #2A2A2A;min-height:420px}
.ts-split-data{padding:48px 40px;display:flex;flex-direction:column;justify-content:center;border-right:1px solid #2A2A2A}
.ts-split-data .lab{font-size:9px;color:#FF4D00;letter-spacing:3px;text-transform:uppercase;margin-bottom:16px}
.ts-split-data h3{font-family:'Inter',sans-serif;font-size:clamp(28px,3.5vw,48px);font-weight:800;color:#F5F5F5;letter-spacing:-2px;line-height:.95;margin-bottom:16px}
.ts-split-data p{font-size:13px;color:#666;line-height:1.8;max-width:400px}
.ts-split-img{overflow:hidden;position:relative}
.ts-split-img img{width:100%;height:100%;object-fit:cover;filter:grayscale(30%) contrast(1.1);opacity:.8}

/* STATS */
.ts-stats{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid #2A2A2A}
.ts-stat{padding:32px 24px;border-right:1px solid #2A2A2A;text-align:center}
.ts-stat:last-child{border-right:none}
.ts-stat .num{font-family:'Inter',sans-serif;font-size:36px;font-weight:800;color:#F5F5F5;letter-spacing:-2px}
.ts-stat .num .ac{color:#FF4D00}
.ts-stat .lb{font-size:9px;color:#444;letter-spacing:2px;text-transform:uppercase;margin-top:4px}

/* BREADCRUMBS */
.ts-bc{padding:12px 32px;font-size:10px;color:#444;border-bottom:1px solid #2A2A2A;display:flex;gap:8px;letter-spacing:1px}
.ts-bc button{background:none;border:none;color:#666;font-family:inherit;font-size:10px;cursor:pointer;letter-spacing:1px;padding:0}
.ts-bc button:hover{color:#FF4D00}

/* SEARCH */
.ts-search-sec{padding:80px 32px;text-align:center}
.ts-search-sec h2{font-family:'Inter',sans-serif;font-size:clamp(28px,4vw,48px);font-weight:800;letter-spacing:-2px;color:#F5F5F5;margin-bottom:24px}
.ts-search-sec h2 .ac{color:#FF4D00}
.ts-search-bar{display:flex;max-width:560px;margin:0 auto;border:1px solid #2A2A2A}
.ts-search-bar input{flex:1;padding:14px 16px;border:none;background:transparent;color:#E8E8E8;font-family:'JetBrains Mono',monospace;font-size:13px;outline:none}
.ts-search-bar input::placeholder{color:#444}
.ts-search-bar button{padding:14px 28px;background:#FF4D00;color:#0C0C0C;border:none;font-family:inherit;font-size:10px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:background .2s}
.ts-search-bar button:hover{background:#FF6B2C}

/* PRODUCT DETAIL */
.ts-detail{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #2A2A2A}
.ts-detail-img{border-right:1px solid #2A2A2A;background:#1A1A1A;display:flex;align-items:center;justify-content:center;min-height:70vh}
.ts-detail-img img{max-width:85%;max-height:85%;object-fit:contain}
.ts-detail-info{padding:48px 40px;display:flex;flex-direction:column;justify-content:center}
.ts-detail-brand{font-size:9px;color:#FF4D00;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px}
.ts-detail-name{font-family:'Inter',sans-serif;font-size:clamp(28px,3.5vw,42px);font-weight:800;letter-spacing:-2px;color:#F5F5F5;margin-bottom:6px;line-height:1}
.ts-detail-cat{font-size:11px;color:#444;margin-bottom:24px;letter-spacing:2px}
.ts-detail-price{font-family:'Inter',sans-serif;font-size:28px;font-weight:800;color:#FF4D00;letter-spacing:-1px;margin-bottom:32px}
.ts-detail-price .old{font-size:18px;color:#444;text-decoration:line-through;font-weight:400;margin-left:10px}
.ts-detail-desc{font-size:12px;color:#666;line-height:1.8;margin-bottom:32px;max-width:400px}
.ts-sel-label{font-size:9px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;color:#444}
.ts-sel-row{display:flex;gap:0;margin-bottom:20px;border:1px solid #2A2A2A;width:fit-content}
.ts-sel-btn{padding:10px 18px;background:none;border:none;border-right:1px solid #2A2A2A;font-family:inherit;font-size:11px;color:#666;cursor:pointer;transition:all .15s}
.ts-sel-btn:last-child{border-right:none}
.ts-sel-btn.a{color:#FF4D00;background:#111}
.ts-sel-btn:hover:not(.a){color:#E8E8E8;background:#111}
.ts-color-row{display:flex;gap:8px;margin-bottom:28px}
.ts-color-opt{width:24px;height:24px;border:2px solid transparent;cursor:pointer;transition:all .2s}
.ts-color-opt.a{border-color:#FF4D00}
.ts-color-opt:hover{border-color:#666}
.ts-add-btn{padding:14px 36px;background:#FF4D00;color:#0C0C0C;border:none;font-family:inherit;font-size:10px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:all .2s;align-self:flex-start}
.ts-add-btn:hover{background:transparent;color:#FF4D00;border:1px solid #FF4D00}

/* NEWSLETTER */
.ts-nl{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid #2A2A2A}
.ts-nl-l{padding:48px 40px;border-right:1px solid #2A2A2A;display:flex;flex-direction:column;justify-content:center}
.ts-nl-l .lab{font-size:9px;color:#FF4D00;letter-spacing:3px;text-transform:uppercase;margin-bottom:12px}
.ts-nl-l h2{font-family:'Inter',sans-serif;font-size:32px;font-weight:800;color:#F5F5F5;letter-spacing:-2px;line-height:.95;margin-bottom:12px}
.ts-nl-l p{font-size:12px;color:#666;line-height:1.8;max-width:360px}
.ts-nl-r{padding:48px 40px;display:flex;flex-direction:column;justify-content:center;gap:14px;background:#111}
.ts-nl-r label{font-size:8px;color:#444;letter-spacing:2px;text-transform:uppercase}
.ts-nl-r input{padding:12px 0;border:none;border-bottom:1px solid #2A2A2A;background:transparent;color:#E8E8E8;font-family:inherit;font-size:13px;outline:none;transition:border-color .2s}
.ts-nl-r input:focus{border-color:#FF4D00}
.ts-nl-r input::placeholder{color:#444}

/* FOOTER */
.ts-footer{background:#0C0C0C;border-top:1px solid #2A2A2A}
.ts-ftgrid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;border-bottom:1px solid #2A2A2A}
.ts-ftcol{padding:40px 28px;border-right:1px solid #2A2A2A}
.ts-ftcol:last-child{border-right:none}
.ts-ftcol .fl{font-family:'Inter',sans-serif;font-size:18px;font-weight:800;color:#F5F5F5;letter-spacing:-1px;margin-bottom:12px;display:flex;align-items:center;gap:6px}
.ts-ftcol .fl .dot{width:6px;height:6px;background:#FF4D00;border-radius:50%}
.ts-ftcol .fd{font-size:11px;color:#444;line-height:1.7;max-width:260px}
.ts-ftcol h5{font-size:9px;letter-spacing:3px;text-transform:uppercase;color:#FF4D00;margin-bottom:16px}
.ts-ftcol a{display:block;color:#444;text-decoration:none;font-size:11px;margin-bottom:8px;transition:color .15s;cursor:pointer}
.ts-ftcol a:hover{color:#F5F5F5}
.ts-ftbot{display:flex;justify-content:space-between;padding:16px 28px;font-size:9px;color:#444;letter-spacing:1px}

@media(max-width:1024px){
  .ts-hero,.ts-split,.ts-nl,.ts-detail{grid-template-columns:1fr}
  .ts-hero-data,.ts-split-data,.ts-nl-l,.ts-detail-img{border-right:none;border-bottom:1px solid #2A2A2A}
  .ts-hero-vis,.ts-split-img{min-height:350px}
  .ts-pgrid{grid-template-columns:repeat(2,1fr)}
  .ts-stats{grid-template-columns:repeat(2,1fr)}
  .ts-stat{border-bottom:1px solid #2A2A2A}
  .ts-ftgrid{grid-template-columns:1fr 1fr}
}
@media(max-width:640px){
  .ts-nlinks{display:none}
  .ts-pgrid{grid-template-columns:1fr}
  .ts-stats{grid-template-columns:1fr}
  .ts-ftgrid{grid-template-columns:1fr}
  .ts-hero-data{padding:28px 16px}
}
`

const Card = ({ p, st, i }) => (
  <button className="ts-pcard" onClick={() => st.go('product', { id: p.id })} style={{border:'none',fontFamily:'inherit',textAlign:'left',color:'inherit'}}>
    <div className="ts-pimg">
      <img src={p.img} alt={p.name} loading="lazy" />
      <span className="idx">{String(i + 1).padStart(3, '0')}</span>
      {p.badge && <span className={`tag ${p.badge}`}>{p.badge}</span>}
    </div>
    <div className="ts-pinfo">
      <div className="brand">SPCTRM_01</div>
      <div className="name">{p.name}</div>
      <div className="row">
        <span className="price">${p.price}{p.orig && <span className="old">${p.orig}</span>}</span>
        <button className="add" onClick={e => e.stopPropagation()}>+ Add</button>
      </div>
    </div>
  </button>
)

export default function TechSpec() {
  const nav = useNavigate()
  const st = useStore('SPCT', 1.1)
  const [pct, setPct] = useState(0)
  useEffect(() => { document.body.style.background = '#0C0C0C'; return () => { document.body.style.background = '' } }, [])
  useEffect(() => {
    if (st.loading) {
      const iv = setInterval(() => setPct(p => p >= 100 ? 100 : p + Math.floor(Math.random() * 12) + 3), 120)
      return () => clearInterval(iv)
    }
  }, [st.loading])
  const tClass = st.transitioning ? 'ts-page out' : 'ts-page'

  return (
    <div className="ts">
      <style>{CSS}</style>

      {/* LOADER */}
      <div className={`ts-loader ${!st.loading ? 'hide' : ''}`}>
        <div className="ts-loader-id">SPCTRM_01 // Initializing</div>
        <div className="ts-loader-bar"><div className="ts-loader-fill" /></div>
        <div className="ts-loader-pct">{Math.min(pct, 100)}%</div>
      </div>

      {/* TRANSITION */}
      <div className={`ts-trans ${st.transitioning ? 'active' : ''}`}>
        <div className="ts-trans-strip" /><div className="ts-trans-strip" /><div className="ts-trans-strip" /><div className="ts-trans-strip" /><div className="ts-trans-strip" />
      </div>

      <button className="ts-back" onClick={() => nav('/')}>← Portfolio</button>

      {/* NAV TOP */}
      <div className="ts-navtop"><span>SPCTRM_01 // TECH COMMERCE</span><span>SYS.ONLINE — {new Date().toISOString().split('T')[0]}</span></div>

      {/* NAV */}
      <nav className="ts-nav">
        <div className="ts-nav-main">
          <button className="ts-nav-logo" onClick={() => st.go('home')}>SPCTRM<span className="dot" /></button>
          <div className="ts-nlinks">
            <button onClick={() => st.go('shop', { cat: 'All' })} className={st.page === 'shop' ? 'a' : ''}><span className="k">[01]</span> Collection</button>
            <button onClick={() => st.go('shop', { cat: 'Tops' })}><span className="k">[02]</span> Tops</button>
            <button onClick={() => st.go('shop', { cat: 'Outerwear' })}><span className="k">[03]</span> Outerwear</button>
            <button onClick={() => st.go('shop', { cat: 'Accessories' })}><span className="k">[04]</span> Accessories</button>
          </div>
          <div className="ts-nright">
            <button onClick={() => st.go('search')}>Search</button>
            <button>Cart <span className="ct">[0]</span></button>
          </div>
        </div>
      </nav>

      <div className={tClass}>
        {/* HOME */}
        {st.page === 'home' && <>
          <div className="ts-hero">
            <div className="ts-hero-data">
              <div className="ts-hero-tag"><span className="live" /> Now Live — SS26</div>
              <div className="ts-hero-titles">
                <h1>The <span className="accent">Next</span><br /><span className="dim">Gen</span> Object<br />Protocol</h1>
              </div>
              <div className="ts-hero-specs">
                <div className="ts-spec"><div className="label">Products</div><div className="val">20<span className="unit">items</span></div></div>
                <div className="ts-spec"><div className="label">Categories</div><div className="val">4<span className="unit">types</span></div></div>
                <div className="ts-spec"><div className="label">Rating</div><div className="val">4.9<span className="unit">/5.0</span></div></div>
                <div className="ts-spec"><div className="label">Status</div><div className="val" style={{color:'#00FF87'}}>Active</div></div>
              </div>
              <div className="ts-hero-btns">
                <button className="ts-btn-pri" onClick={() => st.go('shop', { cat: 'All' })}>Browse All →</button>
                <button className="ts-btn-ghost" onClick={() => st.go('search')}>Search</button>
              </div>
            </div>
            <div className="ts-hero-vis">
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80" alt="Tech Fashion" />
              <div className="ts-hero-overlay"><div className="big">01</div></div>
              <div className="ts-hero-corner">SEASON // 26<br/>EDITION // 01<br/>STATUS // LIVE</div>
            </div>
          </div>

          <div className="ts-ticker">
            <div className="ts-ttrack">
              {[...Array(2)].map((_, i) => <div key={i} style={{display:'flex',gap:48}}>
                {['New Drop','Free Shipping','Tech Fabric','Limited Run','Next Gen','Premium Grade'].map((t, j) => <span key={j} className="ts-titem">{t}</span>)}
              </div>)}
            </div>
          </div>

          <div className="ts-products-sec">
            <div className="ts-secbar"><span className="title">Featured // <span>New Arrivals</span></span><span className="meta">{st.products.filter(p => p.badge === 'new').length} items</span></div>
            <div className="ts-pgrid">
              {st.products.filter(p => p.badge === 'new').slice(0, 4).map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}
            </div>
          </div>

          <div className="ts-split">
            <div className="ts-split-data">
              <div className="lab">About // SPCTRM_01</div>
              <h3>Engineered for the digital age</h3>
              <p>Technical fabrics meet computational design. Every piece in the SPCTRM collection is precision-engineered using data-driven patterns and performance materials.</p>
            </div>
            <div className="ts-split-img"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" alt="" /></div>
          </div>

          <div className="ts-stats">
            <div className="ts-stat"><div className="num">20<span className="ac">+</span></div><div className="lb">Products</div></div>
            <div className="ts-stat"><div className="num">4<span className="ac">.</span>9</div><div className="lb">Avg Rating</div></div>
            <div className="ts-stat"><div className="num">48<span className="ac">h</span></div><div className="lb">Shipping</div></div>
            <div className="ts-stat"><div className="num">∞</div><div className="lb">Returns</div></div>
          </div>

          <div className="ts-products-sec">
            <div className="ts-secbar"><span className="title">Catalog // <span>All Products</span></span><span className="meta">{st.products.length} items</span></div>
            <div className="ts-pgrid">
              {st.products.slice(0, 8).map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}
            </div>
          </div>

          <div className="ts-nl">
            <div className="ts-nl-l">
              <div className="lab">Subscribe // Updates</div>
              <h2>Stay in the loop</h2>
              <p>Get early access to drops, exclusive tech specs, and system updates.</p>
            </div>
            <div className="ts-nl-r">
              <label>Email Protocol</label>
              <input type="email" placeholder="user@system.io" />
              <button className="ts-btn-pri" style={{marginTop:8,alignSelf:'flex-start'}}>Subscribe →</button>
            </div>
          </div>
        </>}

        {/* SHOP */}
        {st.page === 'shop' && <>
          <div className="ts-bc"><button onClick={() => st.go('home')}>Home</button> / Collection {st.cat !== 'All' ? `/ ${st.cat}` : ''}</div>
          <div className="ts-products-sec">
            <div className="ts-secbar"><span className="title">Catalog // <span>Collection</span></span><span className="meta">{st.filtered.length} items</span></div>
            <div className="ts-frow">{st.cats.map(c => <button key={c} className={`ts-fbtn ${st.cat === c ? 'a' : ''}`} onClick={() => st.go('shop', { cat: c, q: st.sq })}>{c}</button>)}</div>
            <div className="ts-pgrid">
              {st.filtered.map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}
            </div>
          </div>
        </>}

        {/* SEARCH */}
        {st.page === 'search' && <>
          <div className="ts-search-sec">
            <h2>Search <span className="ac">Protocol</span></h2>
            <div className="ts-search-bar">
              <input value={st.search} onChange={e => st.setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && st.doSearch()} placeholder="query://search..." />
              <button onClick={st.doSearch}>Execute</button>
            </div>
          </div>
        </>}

        {/* PRODUCT DETAIL */}
        {st.page === 'product' && st.product && <>
          <div className="ts-bc"><button onClick={() => st.go('home')}>Home</button> / <button onClick={() => st.go('shop', { cat: st.product.cat })}>{st.product.cat}</button> / {st.product.name}</div>
          <div className="ts-detail">
            <div className="ts-detail-img"><img src={st.product.img} alt={st.product.name} /></div>
            <div className="ts-detail-info">
              <div className="ts-detail-brand">SPCTRM_01</div>
              <h1 className="ts-detail-name">{st.product.name}</h1>
              <div className="ts-detail-cat">{st.product.cat} // #{st.product.id}</div>
              <div className="ts-detail-price">${st.product.price}{st.product.orig && <span className="old">${st.product.orig}</span>}</div>
              <p className="ts-detail-desc">Precision-engineered construction with technical fabrics. Data-driven patterns optimized for fit, comfort, and durability. Built for the next generation.</p>
              <div className="ts-sel-label">Size</div>
              <div className="ts-sel-row">{['XS','S','M','L','XL'].map(s => <button key={s} className={`ts-sel-btn ${st.selSize===s?'a':''}`} onClick={() => st.setSelSize(s)}>{s}</button>)}</div>
              <div className="ts-sel-label">Color</div>
              <div className="ts-color-row">{(st.product.colors || ['#0C0C0C','#F5F5F5','#FF4D00','#2A2A2A']).map(c => <button key={c} className={`ts-color-opt ${st.selColor === c ? 'a' : ''}`} style={{ background: colorMap[c] || c }} onClick={() => st.setSelColor(c)} />)}</div>
              <button className="ts-add-btn">Add to Cart →</button>
            </div>
          </div>
          {st.related.length > 0 && <div className="ts-products-sec">
            <div className="ts-secbar"><span className="title">Related // <span>Similar Items</span></span></div>
            <div className="ts-pgrid">{st.related.map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}</div>
          </div>}
        </>}
      </div>

      {/* FOOTER */}
      <footer className="ts-footer">
        <div className="ts-ftgrid">
          <div className="ts-ftcol"><div className="fl">SPCTRM<span className="dot" /></div><div className="fd">Technical commerce for the digital generation. Precision-engineered fashion objects. System online since 2024.</div></div>
          <div className="ts-ftcol"><h5>Catalog</h5><a onClick={() => st.go('shop', { cat: 'All' })}>All</a><a onClick={() => st.go('shop', { cat: 'Tops' })}>Tops</a><a onClick={() => st.go('shop', { cat: 'Outerwear' })}>Outerwear</a><a onClick={() => st.go('shop', { cat: 'Accessories' })}>Accessories</a></div>
          <div className="ts-ftcol"><h5>System</h5><a>About</a><a>Specs</a><a>Shipping</a><a>Returns</a></div>
          <div className="ts-ftcol"><h5>Connect</h5><a>Terminal</a><a>Instagram</a><a>Discord</a></div>
        </div>
        <div className="ts-ftbot"><span>© 2026 SPCTRM_01 // All rights reserved</span><span>SYS.VERSION // 2.4.1</span></div>
      </footer>
    </div>
  )
}
