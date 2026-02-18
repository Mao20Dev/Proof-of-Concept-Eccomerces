import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from './useStore'
import { colorMap } from './data'

const CSS = `
.sw{min-height:100vh;background:#FAFAFA;color:#0A0A0A;font-family:'Helvetica Neue',Helvetica,'Arial Nova',Arial,sans-serif;overflow-x:hidden}
.sw *{box-sizing:border-box}
.sw-back{position:fixed;top:16px;left:16px;z-index:9999;padding:8px 20px;background:#0A0A0A;color:#FAFAFA;font-family:'Helvetica Neue',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border:2px solid #0A0A0A;cursor:pointer;transition:all .2s}
.sw-back:hover{background:#E21A1A;border-color:#E21A1A}

/* LOADER */
.sw-loader{position:fixed;inset:0;z-index:10000;background:#0A0A0A;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:opacity .5s,visibility .5s}
.sw-loader.hide{opacity:0;visibility:hidden;pointer-events:none}
.sw-loader-inner{display:flex;align-items:baseline;gap:4px}
.sw-loader-letter{font-size:clamp(48px,10vw,72px);font-weight:700;color:#FAFAFA;letter-spacing:-3px;opacity:0;transform:translateY(20px);animation:swLetterIn .4s forwards}
.sw-loader-letter:nth-child(1){animation-delay:.1s}
.sw-loader-letter:nth-child(2){animation-delay:.15s}
.sw-loader-letter:nth-child(3){animation-delay:.2s}
.sw-loader-letter:nth-child(4){animation-delay:.25s}
.sw-loader-letter:nth-child(5){animation-delay:.3s}
.sw-loader-letter:nth-child(6){animation-delay:.35s;color:#E21A1A}
.sw-loader-counter{position:absolute;bottom:40px;right:48px;font-family:'Space Mono',monospace;font-size:14px;color:#3A3A3A}
@keyframes swLetterIn{to{opacity:1;transform:translateY(0)}}

/* TRANSITION */
.sw-trans-overlay{position:fixed;inset:0;z-index:9990;background:#E21A1A;transform:translateY(-100%);pointer-events:none;transition:transform .42s cubic-bezier(.86,0,.07,1)}
.sw-trans-overlay.active{transform:translateY(0)}
.sw-page{opacity:1;transform:translateY(0);transition:opacity .3s,transform .3s}
.sw-page.out{opacity:0;transform:translateY(20px)}
.sw-page.enter{opacity:0;transform:translateY(-20px)}

/* TOPBAR */
.sw-topbar{background:#0A0A0A;color:#FAFAFA;display:flex;justify-content:space-between;align-items:center;padding:8px 48px;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:.5px;border-bottom:2px solid #E21A1A}
.sw-topbar-l{display:flex;gap:24px}
.sw-topbar-l span{opacity:.5}
.sw-topbar-r{color:#E21A1A;text-transform:uppercase;letter-spacing:2px}

/* NAV */
.sw-nav{position:sticky;top:0;z-index:1000;background:#FAFAFA;border-bottom:2px solid #0A0A0A}
.sw-nav-inner{display:grid;grid-template-columns:auto 1fr auto;align-items:center}
.sw-nav-logo{font-size:28px;font-weight:700;letter-spacing:-2px;color:#0A0A0A;padding:20px 48px;border-right:2px solid #0A0A0A;cursor:pointer;background:none;border-top:none;border-bottom:none;border-left:none;display:flex;align-items:center;gap:8px;font-family:inherit}
.sw-nav-logo .dot{width:10px;height:10px;background:#E21A1A;border-radius:50%}
.sw-nlinks{display:flex;align-items:stretch;height:100%}
.sw-nlinks button{display:flex;align-items:center;padding:0 28px;background:none;border:none;border-right:1px solid rgba(0,0,0,.06);color:#0A0A0A;font-family:inherit;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;cursor:pointer;position:relative;transition:all .25s;overflow:hidden}
.sw-nlinks button::before{content:'';position:absolute;bottom:0;left:0;width:100%;height:0;background:#E21A1A;transition:height .25s}
.sw-nlinks button:hover{color:white}
.sw-nlinks button:hover::before{height:100%}
.sw-nlinks button span{position:relative;z-index:1}
.sw-nlinks button.a{color:white}
.sw-nlinks button.a::before{height:100%}
.sw-nright{display:flex;align-items:stretch;border-left:2px solid #0A0A0A}
.sw-nright button{display:flex;align-items:center;padding:20px 28px;background:none;border:none;border-right:1px solid rgba(0,0,0,.06);color:#0A0A0A;font-family:inherit;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:all .2s}
.sw-nright button:last-child{border-right:none}
.sw-nright button:hover{background:#0A0A0A;color:white}
.sw-nright .badge{background:#E21A1A;color:white;font-size:9px;font-weight:700;width:18px;height:18px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-left:6px}

/* HERO */
.sw-hero{display:grid;grid-template-columns:1fr 1fr;min-height:92vh;border-bottom:2px solid #0A0A0A}
.sw-hero-l{background:#0A0A0A;display:flex;flex-direction:column;justify-content:space-between;padding:64px 56px;position:relative;overflow:hidden}
.sw-hero-geo{position:absolute;top:-80px;right:-80px;width:400px;height:400px;background:#E21A1A;opacity:.15;transform:rotate(15deg)}
.sw-hero-geo2{position:absolute;bottom:-40px;left:-40px;width:200px;height:200px;border:3px solid #E21A1A;opacity:.2}
.sw-hero-tag{font-family:'Space Mono',monospace;font-size:11px;color:#E21A1A;text-transform:uppercase;letter-spacing:3px;position:relative;z-index:1}
.sw-hero-titles{position:relative;z-index:1}
.sw-hero h1{font-size:clamp(56px,7.5vw,110px);font-weight:700;line-height:.92;color:#FAFAFA;letter-spacing:-4px;text-transform:uppercase}
.sw-hero h1 .outline{-webkit-text-stroke:2px #FAFAFA;color:transparent}
.sw-hero h1 .red{color:#E21A1A}
.sw-hero-bot{display:flex;justify-content:space-between;align-items:flex-end;position:relative;z-index:1}
.sw-hero-desc{font-size:14px;color:rgba(255,255,255,.5);max-width:280px;line-height:1.7}
.sw-hero-year{font-family:'Space Mono',monospace;font-size:80px;font-weight:700;color:#1E1E1E;letter-spacing:-4px;line-height:1}
.sw-hero-r{background:#F2F0ED;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.sw-hero-r img{width:100%;height:100%;object-fit:cover;filter:grayscale(30%) contrast(1.1);transition:transform .8s}
.sw-hero-r:hover img{transform:scale(1.04)}
.sw-hero-cta{position:absolute;bottom:40px;right:40px;background:#E21A1A;color:white;padding:20px 40px;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:3px;border:none;cursor:pointer;transition:all .3s;z-index:2;font-family:inherit}
.sw-hero-cta:hover{background:#0A0A0A;transform:translate(-4px,-4px);box-shadow:4px 4px 0 #E21A1A}
.sw-hero-idx{position:absolute;top:32px;left:32px;font-family:'Space Mono',monospace;font-size:11px;color:#3A3A3A;writing-mode:vertical-lr;letter-spacing:3px;text-transform:uppercase}

/* MARQUEE */
.sw-marquee{background:#E21A1A;padding:14px 0;overflow:hidden;border-bottom:2px solid #0A0A0A}
.sw-mtrack{display:flex;gap:60px;animation:swMarquee 20s linear infinite;width:max-content}
.sw-mitem{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:4px;color:white;white-space:nowrap;display:flex;align-items:center;gap:60px}
.sw-mitem::after{content:'✦';font-size:8px}
@keyframes swMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* SECTIONS */
.sw-section{padding:80px 48px;border-bottom:2px solid #0A0A0A}
.sw-sec-header{display:grid;grid-template-columns:1fr auto;align-items:end;margin-bottom:56px;padding-bottom:24px;border-bottom:2px solid #0A0A0A}
.sw-sec-label{font-family:'Space Mono',monospace;font-size:11px;color:#E21A1A;text-transform:uppercase;letter-spacing:3px;margin-bottom:8px}
.sw-sec-header h2{font-size:clamp(36px,5vw,64px);font-weight:700;letter-spacing:-3px;text-transform:uppercase;line-height:1}
.sw-sec-header h2 .thin{font-weight:300}
.sw-sec-header .count{font-family:'Space Mono',monospace;font-size:12px;color:#3A3A3A}
.sw-fbar{display:flex;gap:0;margin-bottom:40px;border:2px solid #0A0A0A;width:fit-content;flex-wrap:wrap}
.sw-fbtn{padding:12px 28px;font-family:'Helvetica Neue',sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;background:none;border:none;border-right:2px solid #0A0A0A;cursor:pointer;transition:all .2s}
.sw-fbtn:last-child{border-right:none}
.sw-fbtn.a{background:#0A0A0A;color:white}
.sw-fbtn:hover:not(.a){background:#E8E8E8}

/* PRODUCT GRID */
.sw-pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:2px solid #0A0A0A;border-right:none;border-bottom:none}
.sw-pcard{border-right:2px solid #0A0A0A;border-bottom:2px solid #0A0A0A;cursor:pointer;display:block;position:relative;transition:background .3s;background:none;padding:0;text-align:left;font-family:inherit;color:inherit}
.sw-pcard:hover{background:#F2F0ED}
.sw-pimg{aspect-ratio:1;overflow:hidden;position:relative;border-bottom:2px solid #0A0A0A;background:#E8E8E8}
.sw-pimg img{width:100%;height:100%;object-fit:cover;filter:grayscale(20%);transition:all .5s}
.sw-pcard:hover .sw-pimg img{filter:grayscale(0%);transform:scale(1.05)}
.sw-pnum{position:absolute;top:12px;left:14px;font-family:'Space Mono',monospace;font-size:10px;color:#3A3A3A;z-index:2}
.sw-ptag{position:absolute;top:12px;right:0;background:#E21A1A;color:white;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;padding:6px 14px}
.sw-ptag.sale{background:#0057FF}
.sw-ptag.hot{background:#0A0A0A}
.sw-ptag.ltd{background:#FFD600;color:#0A0A0A}
.sw-pbody{padding:16px 18px}
.sw-pbrand{font-size:10px;color:#3A3A3A;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px;font-family:'Space Mono',monospace}
.sw-pname{font-size:15px;font-weight:700;letter-spacing:-.5px;margin-bottom:10px;line-height:1.2;text-transform:uppercase}
.sw-pprice{display:flex;justify-content:space-between;align-items:center;padding-top:10px;border-top:2px solid #0A0A0A}
.sw-pprice .cur{font-size:15px;font-weight:700;letter-spacing:-.5px}
.sw-pprice .old{font-size:12px;color:#3A3A3A;text-decoration:line-through;margin-left:8px;font-weight:400}
.sw-pprice .add{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;padding:6px 14px;border:2px solid #0A0A0A;background:none;cursor:pointer;transition:all .2s;font-family:inherit}
.sw-pprice .add:hover{background:#0A0A0A;color:white}

/* BREADCRUMBS */
.sw-bc{padding:16px 48px;font-family:'Space Mono',monospace;font-size:11px;color:#3A3A3A;border-bottom:2px solid #0A0A0A;display:flex;gap:8px;letter-spacing:1px}
.sw-bc button{background:none;border:none;color:#3A3A3A;font-family:inherit;font-size:11px;cursor:pointer;letter-spacing:1px;padding:0}
.sw-bc button:hover{color:#E21A1A}

/* SEARCH */
.sw-search-sec{padding:80px 48px;text-align:center}
.sw-search-sec h2{font-size:clamp(36px,5vw,56px);font-weight:700;letter-spacing:-3px;text-transform:uppercase;margin-bottom:28px}
.sw-search-bar{display:flex;max-width:600px;margin:0 auto 48px;border:2px solid #0A0A0A}
.sw-search-bar input{flex:1;padding:16px 20px;border:none;font-family:inherit;font-size:14px;background:none;outline:none}
.sw-search-bar button{padding:16px 32px;background:#E21A1A;color:white;border:none;font-family:inherit;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;cursor:pointer;transition:background .2s}
.sw-search-bar button:hover{background:#0A0A0A}

/* PRODUCT DETAIL */
.sw-detail{display:grid;grid-template-columns:1fr 1fr;border-bottom:2px solid #0A0A0A}
.sw-detail-img{border-right:2px solid #0A0A0A;background:#F2F0ED;display:flex;align-items:center;justify-content:center;min-height:70vh}
.sw-detail-img img{max-width:85%;max-height:85%;object-fit:contain}
.sw-detail-info{padding:56px 48px;display:flex;flex-direction:column;justify-content:center}
.sw-detail-brand{font-family:'Space Mono',monospace;font-size:11px;color:#E21A1A;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px}
.sw-detail-name{font-size:clamp(32px,4vw,48px);font-weight:700;letter-spacing:-2px;text-transform:uppercase;margin-bottom:6px;line-height:1}
.sw-detail-cat{font-size:13px;color:#3A3A3A;margin-bottom:24px}
.sw-detail-price{font-size:32px;font-weight:700;letter-spacing:-1px;margin-bottom:32px}
.sw-detail-price .old{font-size:20px;color:#3A3A3A;text-decoration:line-through;margin-left:12px;font-weight:400}
.sw-detail-desc{font-size:14px;color:#3A3A3A;line-height:1.8;margin-bottom:32px;max-width:420px}
.sw-sel-label{font-family:'Space Mono',monospace;font-size:10px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;color:#3A3A3A}
.sw-sel-row{display:flex;gap:0;margin-bottom:20px;border:2px solid #0A0A0A;width:fit-content}
.sw-sel-btn{padding:10px 20px;background:none;border:none;border-right:2px solid #0A0A0A;font-family:inherit;font-size:12px;font-weight:700;cursor:pointer;transition:all .2s}
.sw-sel-btn:last-child{border-right:none}
.sw-sel-btn.a{background:#0A0A0A;color:white}
.sw-sel-btn:hover:not(.a){background:#E8E8E8}
.sw-color-row{display:flex;gap:8px;margin-bottom:28px}
.sw-color-opt{width:28px;height:28px;border:2px solid transparent;cursor:pointer;transition:all .2s}
.sw-color-opt.a{border-color:#0A0A0A;transform:scale(1.15)}
.sw-color-opt:hover{transform:scale(1.1)}
.sw-add-btn{padding:18px 48px;background:#E21A1A;color:white;border:none;font-family:inherit;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:3px;cursor:pointer;transition:all .3s;align-self:flex-start}
.sw-add-btn:hover{background:#0A0A0A;transform:translate(-3px,-3px);box-shadow:3px 3px 0 #E21A1A}

/* EDITORIAL */
.sw-editorial{display:grid;grid-template-columns:1fr 1fr;min-height:500px;border-bottom:2px solid #0A0A0A}
.sw-ed-text{display:flex;flex-direction:column;justify-content:center;padding:64px 56px;border-right:2px solid #0A0A0A}
.sw-ed-text .quote{font-size:28px;font-weight:300;font-style:italic;line-height:1.6;margin-bottom:20px;letter-spacing:-1px}
.sw-ed-text .attr{font-family:'Space Mono',monospace;font-size:10px;color:#3A3A3A;letter-spacing:4px;text-transform:uppercase}
.sw-ed-img{overflow:hidden;position:relative}
.sw-ed-img img{width:100%;height:100%;object-fit:cover;filter:grayscale(30%) contrast(1.1);transition:transform 1s}
.sw-ed-img:hover img{transform:scale(1.04)}

/* CATEGORIES */
.sw-cats{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:2px solid #0A0A0A;border-right:none}
.sw-cat{position:relative;overflow:hidden;aspect-ratio:3/4;border-right:2px solid #0A0A0A;cursor:pointer;background:none;padding:0;border-top:none;border-bottom:none;border-left:none;font-family:inherit;display:block}
.sw-cat img{width:100%;height:100%;object-fit:cover;filter:grayscale(40%);transition:all .6s}
.sw-cat:hover img{filter:grayscale(0%);transform:scale(1.06)}
.sw-cat-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,10,10,.85) 0%,transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:28px;text-align:left}
.sw-cat-ov h3{font-size:24px;font-weight:700;color:white;text-transform:uppercase;letter-spacing:-1px;margin-bottom:4px}
.sw-cat-ov span{font-family:'Space Mono',monospace;font-size:10px;color:#E21A1A;letter-spacing:2px;text-transform:uppercase}

/* FOOTER */
.sw-footer{background:#0A0A0A;color:#FAFAFA;border-top:2px solid #0A0A0A}
.sw-ftgrid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;border-bottom:1px solid #1E1E1E}
.sw-ftcol{padding:48px 28px;border-right:1px solid #1E1E1E}
.sw-ftcol:last-child{border-right:none}
.sw-ftcol .logo{font-size:24px;font-weight:700;letter-spacing:-2px;display:flex;align-items:center;gap:8px;margin-bottom:12px}
.sw-ftcol .logo .dot{width:8px;height:8px;background:#E21A1A;border-radius:50%}
.sw-ftcol .desc{font-size:12px;color:#3A3A3A;line-height:1.7;max-width:280px}
.sw-ftcol h5{font-family:'Space Mono',monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#E21A1A;margin-bottom:16px}
.sw-ftcol a{display:block;color:#3A3A3A;font-size:12px;margin-bottom:8px;cursor:pointer;transition:color .15s;text-decoration:none}
.sw-ftcol a:hover{color:#FAFAFA}
.sw-ftbot{display:flex;justify-content:space-between;padding:20px 28px;font-family:'Space Mono',monospace;font-size:10px;color:#3A3A3A;letter-spacing:1px}

/* NEWSLETTER */
.sw-nl{display:grid;grid-template-columns:1fr 1fr;border-bottom:2px solid #0A0A0A}
.sw-nl-l{padding:56px;border-right:2px solid #0A0A0A;display:flex;flex-direction:column;justify-content:center}
.sw-nl-l .label{font-family:'Space Mono',monospace;font-size:11px;color:#E21A1A;text-transform:uppercase;letter-spacing:3px;margin-bottom:12px}
.sw-nl-l h3{font-size:36px;font-weight:700;letter-spacing:-2px;text-transform:uppercase;margin-bottom:10px;line-height:1}
.sw-nl-l p{font-size:14px;color:#3A3A3A;line-height:1.7}
.sw-nl-r{padding:56px;display:flex;flex-direction:column;justify-content:center;gap:12px;background:#F2F0ED}
.sw-nl-r label{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:2px;text-transform:uppercase;color:#3A3A3A}
.sw-nl-r input{padding:14px 0;border:none;border-bottom:2px solid #0A0A0A;background:transparent;font-family:inherit;font-size:14px;outline:none}
.sw-nl-r input:focus{border-color:#E21A1A}
.sw-nl-r button{align-self:flex-start;margin-top:8px;padding:14px 36px;background:#0A0A0A;color:white;border:none;font-family:inherit;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;cursor:pointer;transition:all .2s}
.sw-nl-r button:hover{background:#E21A1A}

@media(max-width:1024px){
  .sw-hero,.sw-detail,.sw-editorial,.sw-nl{grid-template-columns:1fr}
  .sw-hero-l,.sw-ed-text,.sw-nl-l{border-right:none;border-bottom:2px solid #0A0A0A}
  .sw-detail-img{border-right:none;border-bottom:2px solid #0A0A0A;min-height:50vh}
  .sw-pgrid{grid-template-columns:repeat(2,1fr)}
  .sw-cats{grid-template-columns:1fr}
  .sw-ftgrid{grid-template-columns:1fr 1fr}
}
@media(max-width:640px){
  .sw-nlinks{display:none}
  .sw-pgrid{grid-template-columns:1fr}
  .sw-section{padding:40px 16px}
  .sw-topbar{padding:8px 16px}
  .sw-ftgrid{grid-template-columns:1fr}
  .sw-hero-l{padding:32px 24px}
  .sw-hero-year{font-size:48px}
}
`

const Card = ({ p, st, i }) => (
  <button className="sw-pcard" onClick={() => st.go('product', { id: p.id })} style={{border:'none',fontFamily:'inherit',textAlign:'left',color:'inherit'}}>
    <div className="sw-pimg">
      <img src={p.img} alt={p.name} loading="lazy" />
      <span className="sw-pnum">{String(i + 1).padStart(2, '0')}</span>
      {p.badge && <span className={`sw-ptag ${p.badge}`}>{p.badge}</span>}
    </div>
    <div className="sw-pbody">
      <div className="sw-pbrand">{st.products[0]?.brand || 'OBJKT'}</div>
      <div className="sw-pname">{p.name}</div>
      <div className="sw-pprice">
        <span><span className="cur">${p.price}</span>{p.orig && <span className="old">${p.orig}</span>}</span>
        <button className="add" onClick={e => e.stopPropagation()}>+ Add</button>
      </div>
    </div>
  </button>
)

export default function Swiss() {
  const nav = useNavigate()
  const st = useStore('OBJKT', 1.2)
  useEffect(() => { document.body.style.background = '#FAFAFA'; return () => { document.body.style.background = '' } }, [])
  const tClass = st.transitioning ? 'sw-page out' : st.transIn ? 'sw-page enter' : 'sw-page'

  return (
    <div className="sw">
      <style>{CSS}</style>

      {/* LOADER */}
      <div className={`sw-loader ${!st.loading ? 'hide' : ''}`}>
        <div className="sw-loader-inner">
          {'OBJKT'.split('').map((l, i) => <span key={i} className="sw-loader-letter">{l}</span>)}
          <span className="sw-loader-letter">.</span>
        </div>
        <div className="sw-loader-counter">Swiss Design System / 2026</div>
      </div>

      {/* TRANSITION OVERLAY */}
      <div className={`sw-trans-overlay ${st.transitioning ? 'active' : ''}`} />

      <button className="sw-back" onClick={() => nav('/')}>← Portfolio</button>

      {/* TOPBAR */}
      <div className="sw-topbar">
        <div className="sw-topbar-l"><span>50°56'N 6°57'E</span><span>Free Shipping Worldwide</span></div>
        <div className="sw-topbar-r">Swiss Made</div>
      </div>

      {/* NAV */}
      <nav className="sw-nav">
        <div className="sw-nav-inner">
          <button className="sw-nav-logo" onClick={() => st.go('home')}>OBJKT<span className="dot" /></button>
          <div className="sw-nlinks">
            <button onClick={() => st.go('shop', { cat: 'All' })} className={st.page === 'shop' ? 'a' : ''}><span>Collection</span></button>
            <button onClick={() => st.go('shop', { cat: 'Tops' })}><span>Tops</span></button>
            <button onClick={() => st.go('shop', { cat: 'Outerwear' })}><span>Outerwear</span></button>
            <button onClick={() => st.go('shop', { cat: 'Accessories' })}><span>Accessories</span></button>
          </div>
          <div className="sw-nright">
            <button onClick={() => st.go('search')}>Search</button>
            <button>Cart <span className="badge">0</span></button>
          </div>
        </div>
      </nav>

      <div className={tClass}>
        {/* HOME */}
        {st.page === 'home' && <>
          <div className="sw-hero">
            <div className="sw-hero-l">
              <div className="sw-hero-geo" /><div className="sw-hero-geo2" />
              <div className="sw-hero-tag">Collection — S/S 2026</div>
              <div className="sw-hero-titles">
                <h1>The <span className="outline">New</span><br /><span className="red">Object</span><br />Standard</h1>
              </div>
              <div className="sw-hero-bot">
                <div className="sw-hero-desc">Precision-engineered garments rooted in Swiss design principles. Form follows function, always.</div>
                <div className="sw-hero-year">26</div>
              </div>
            </div>
            <div className="sw-hero-r">
              <span className="sw-hero-idx">Index — 001</span>
              <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80" alt="Swiss Fashion" />
              <button className="sw-hero-cta" onClick={() => st.go('shop', { cat: 'All' })}>Shop Now →</button>
            </div>
          </div>

          <div className="sw-marquee">
            <div className="sw-mtrack">
              {[...Array(2)].map((_, i) => <div key={i} style={{display:'flex',gap:60}}>
                {['New Arrivals','Free Shipping','Swiss Design','Limited Edition','Handcrafted','Premium Materials'].map((t, j) => <span key={j} className="sw-mitem">{t}</span>)}
              </div>)}
            </div>
          </div>

          <div className="sw-section">
            <div className="sw-sec-header">
              <div><div className="sw-sec-label">Featured</div><h2>New <span className="thin">Arrivals</span></h2></div>
              <div className="count">{st.products.filter(p => p.badge === 'new').length} items</div>
            </div>
            <div className="sw-pgrid">
              {st.products.filter(p => p.badge === 'new').slice(0, 4).map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}
            </div>
          </div>

          <div className="sw-editorial">
            <div className="sw-ed-text">
              <div className="quote">"Design is not just what it looks like and feels like. Design is how it works."</div>
              <div className="attr">— Design Philosophy, OBJKT. Studio</div>
            </div>
            <div className="sw-ed-img">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" alt="" />
            </div>
          </div>

          <div className="sw-section" style={{ paddingBottom: 0 }}>
            <div className="sw-sec-header">
              <div><div className="sw-sec-label">Browse</div><h2>Categories</h2></div>
            </div>
            <div className="sw-cats">
              <button className="sw-cat" onClick={() => st.go('shop', { cat: 'Outerwear' })}><img src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=700&q=80" alt="" /><div className="sw-cat-ov"><h3>Outerwear</h3><span>8 Items</span></div></button>
              <button className="sw-cat" onClick={() => st.go('shop', { cat: 'Tops' })}><img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80" alt="" /><div className="sw-cat-ov"><h3>Tops</h3><span>6 Items</span></div></button>
              <button className="sw-cat" onClick={() => st.go('shop', { cat: 'Accessories' })}><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80" alt="" /><div className="sw-cat-ov"><h3>Accessories</h3><span>6 Items</span></div></button>
            </div>
          </div>

          <div className="sw-nl">
            <div className="sw-nl-l">
              <div className="label">Stay Updated</div>
              <h3>Join The<br />Movement</h3>
              <p>Be the first to access new collections and exclusive releases.</p>
            </div>
            <div className="sw-nl-r">
              <label>Email Address</label>
              <input type="email" placeholder="your@email.com" />
              <button>Subscribe</button>
            </div>
          </div>
        </>}

        {/* SHOP */}
        {st.page === 'shop' && <>
          <div className="sw-bc"><button onClick={() => st.go('home')}>Home</button> / Collection {st.cat !== 'All' ? `/ ${st.cat}` : ''}</div>
          <div className="sw-section">
            <div className="sw-sec-header">
              <div><div className="sw-sec-label">Collection</div><h2>All <span className="thin">Products</span></h2></div>
              <div className="count">{st.filtered.length} items</div>
            </div>
            <div className="sw-fbar">{st.cats.map(c => <button key={c} className={`sw-fbtn ${st.cat === c ? 'a' : ''}`} onClick={() => st.go('shop', { cat: c, q: st.sq })}>{c}</button>)}</div>
            <div className="sw-pgrid">
              {st.filtered.map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}
            </div>
          </div>
        </>}

        {/* SEARCH */}
        {st.page === 'search' && <>
          <div className="sw-search-sec">
            <h2>Search <span style={{ fontWeight: 300 }}>Collection</span></h2>
            <div className="sw-search-bar">
              <input value={st.search} onChange={e => st.setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && st.doSearch()} placeholder="Search products..." />
              <button onClick={st.doSearch}>Search</button>
            </div>
          </div>
        </>}

        {/* PRODUCT DETAIL */}
        {st.page === 'product' && st.product && <>
          <div className="sw-bc"><button onClick={() => st.go('home')}>Home</button> / <button onClick={() => st.go('shop', { cat: st.product.cat })}>{st.product.cat}</button> / {st.product.name}</div>
          <div className="sw-detail">
            <div className="sw-detail-img"><img src={st.product.img} alt={st.product.name} /></div>
            <div className="sw-detail-info">
              <div className="sw-detail-brand">OBJKT.</div>
              <h1 className="sw-detail-name">{st.product.name}</h1>
              <div className="sw-detail-cat">{st.product.cat}</div>
              <div className="sw-detail-price">${st.product.price}{st.product.orig && <span className="old">${st.product.orig}</span>}</div>
              <p className="sw-detail-desc">Precision-cut construction with Swiss design sensibility. This piece embodies the marriage of form and function — clean lines, impeccable materials, lasting quality.</p>
              <div className="sw-sel-label">Size</div>
              <div className="sw-sel-row">{['XS','S','M','L','XL'].map(s => <button key={s} className={`sw-sel-btn ${st.selSize===s?'a':''}`} onClick={() => st.setSelSize(s)}>{s}</button>)}</div>
              <div className="sw-sel-label">Color</div>
              <div className="sw-color-row">{(st.product.colors || ['#0A0A0A','#FAFAFA','#E21A1A','#3A3A3A']).map(c => <button key={c} className={`sw-color-opt ${st.selColor === c ? 'a' : ''}`} style={{ background: colorMap[c] || c }} onClick={() => st.setSelColor(c)} />)}</div>
              <button className="sw-add-btn">Add to Cart</button>
            </div>
          </div>
          {st.related.length > 0 && <div className="sw-section">
            <div className="sw-sec-header"><div><div className="sw-sec-label">Related</div><h2>You May <span className="thin">Also Like</span></h2></div></div>
            <div className="sw-pgrid">{st.related.map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}</div>
          </div>}
        </>}
      </div>

      {/* FOOTER */}
      <footer className="sw-footer">
        <div className="sw-ftgrid">
          <div className="sw-ftcol"><div className="logo">OBJKT<span className="dot" /></div><div className="desc">Swiss-designed fashion objects for the discerning individual. Form follows function since 2024.</div></div>
          <div className="sw-ftcol"><h5>Shop</h5><a onClick={() => st.go('shop', { cat: 'All' })}>All</a><a onClick={() => st.go('shop', { cat: 'Tops' })}>Tops</a><a onClick={() => st.go('shop', { cat: 'Outerwear' })}>Outerwear</a><a onClick={() => st.go('shop', { cat: 'Accessories' })}>Accessories</a></div>
          <div className="sw-ftcol"><h5>Info</h5><a>About</a><a>Sustainability</a><a>Shipping</a><a>Returns</a></div>
          <div className="sw-ftcol"><h5>Contact</h5><a>Email</a><a>Instagram</a><a>Twitter</a></div>
        </div>
        <div className="sw-ftbot"><span>© 2026 OBJKT. All rights reserved.</span><span>Designed in Switzerland</span></div>
      </footer>
    </div>
  )
}
