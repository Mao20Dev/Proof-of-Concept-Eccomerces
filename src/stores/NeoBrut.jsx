import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from './useStore'
import { colorMap } from './data'

const shadows = ['5px 5px 0 #000','6px 6px 0 #000']
const accents = ['#FF5252','#FFD740','#69F0AE','#40C4FF','#E040FB','#FF6E40']
const getA = i => accents[i % accents.length]

const CSS = `
.nb{min-height:100vh;background:#FEF9EF;color:#1a1a1a;font-family:'Space Mono',monospace;overflow-x:hidden}
.nb-back{position:fixed;top:12px;left:12px;z-index:9999;padding:7px 18px;background:#FFD740;color:#1a1a1a;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border:3px solid #1a1a1a;box-shadow:4px 4px 0 #1a1a1a;cursor:pointer;transition:all .15s}

/* LOADER */
.nb-loader{position:fixed;inset:0;z-index:10000;background:#FEF9EF;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;transition:opacity .3s}
.nb-loader.hide{opacity:0;pointer-events:none}
.nb-loader-box{width:120px;height:120px;border:3px solid #000;background:#FFD740;box-shadow:5px 5px 0 #000;display:flex;align-items:center;justify-content:center;animation:nbBounce 1s ease infinite}
@keyframes nbBounce{0%,100%{transform:rotate(-3deg) scale(1)}50%{transform:rotate(3deg) scale(1.05)}}
.nb-loader-box span{font-family:'Archivo Black',sans-serif;font-size:32px}
.nb-loader-sub{font-family:'Space Mono',monospace;font-size:12px;color:#000;letter-spacing:2px;text-transform:uppercase;border:2px solid #000;padding:4px 12px;background:#69F0AE}

/* TRANSITION */
.nb-trans{position:fixed;top:0;left:0;width:100%;height:100%;z-index:9990;pointer-events:none}
.nb-trans-wipe{position:absolute;inset:0;background:#FF5252;border:3px solid #000;transform:translateY(101%);transition:transform .38s cubic-bezier(.77,0,.18,1)}
.nb-trans.active .nb-trans-wipe{transform:translateY(0)}
.nb-tpage{opacity:1;transition:opacity .25s,transform .25s}
.nb-tpage.out{opacity:0;transform:translateX(-10px)}

.nb-back:hover{transform:translate(2px,2px);box-shadow:2px 2px 0 #1a1a1a}
.nb-nav{position:sticky;top:0;z-index:1000;background:#FEF9EF;border-bottom:3px solid #1a1a1a;display:flex;align-items:stretch}
.nb-logo{font-size:20px;font-weight:700;padding:12px 20px;border-right:3px solid #1a1a1a;background:#FF5252;color:white;cursor:pointer;border:none;border-right:3px solid #1a1a1a;letter-spacing:-1px;font-family:'Space Mono',monospace}
.nb-logo:hover{background:#E040FB}
.nb-nlinks{display:flex;align-items:stretch;flex:1}
.nb-nlinks button{padding:0 16px;border:none;border-right:3px solid #1a1a1a;background:none;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:all .1s;color:#1a1a1a}
.nb-nlinks button:hover,.nb-nlinks button.a{background:#FFD740}
.nb-nright{display:flex;align-items:stretch;margin-left:auto}
.nb-nright button{padding:0 18px;border:none;border-left:3px solid #1a1a1a;background:none;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;color:#1a1a1a;transition:all .1s}
.nb-nright button:hover{background:#69F0AE}
.nb-nright button:last-child{background:#40C4FF;color:white}
.nb-hero{border-bottom:3px solid #1a1a1a;display:grid;grid-template-columns:1fr 1fr;min-height:85vh}
.nb-hero-l{padding:60px 48px;display:flex;flex-direction:column;justify-content:center;background:#FEF9EF;position:relative}
.nb-hero-l .sticker{position:absolute;top:28px;right:28px;width:90px;height:90px;background:#FF5252;border:3px solid #1a1a1a;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;text-transform:uppercase;color:white;transform:rotate(-12deg);box-shadow:4px 4px 0 #1a1a1a;line-height:1.1;text-align:center;letter-spacing:1px}
.nb-hero-badge{display:inline-block;padding:5px 14px;background:#FFD740;border:3px solid #1a1a1a;box-shadow:3px 3px 0 #1a1a1a;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;margin-bottom:20px;align-self:flex-start}
.nb-hero h1{font-family:'Archivo Black',sans-serif;font-size:clamp(42px,7vw,82px);line-height:.92;letter-spacing:-2px;text-transform:uppercase;margin-bottom:16px}
.nb-hero h1 .hl{background:#FFD740;padding:0 6px;display:inline;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.nb-hero h1 .ul{text-decoration:underline;text-decoration-color:#FF5252;text-underline-offset:6px;text-decoration-thickness:5px}
.nb-hero-sub{font-size:14px;color:#555;line-height:1.7;margin-bottom:28px;max-width:420px}
.nb-hero-btns{display:flex;gap:10px;flex-wrap:wrap}
.nb-btn{padding:12px 28px;font-family:'Space Mono',monospace;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border:3px solid #1a1a1a;cursor:pointer;transition:all .12s}
.nb-btn:hover{transform:translate(2px,2px);box-shadow:none !important}
.nb-btn.pri{background:#FF5252;color:white;box-shadow:5px 5px 0 #1a1a1a}
.nb-btn.sec{background:#FFD740;color:#1a1a1a;box-shadow:5px 5px 0 #1a1a1a}
.nb-btn.out{background:#FEF9EF;color:#1a1a1a;box-shadow:5px 5px 0 #1a1a1a}
.nb-hero-r{border-left:3px solid #1a1a1a;overflow:hidden;position:relative}
.nb-hero-r img{width:100%;height:100%;object-fit:cover}
.nb-hero-r .overlay{position:absolute;bottom:0;left:0;right:0;padding:14px 20px;background:#FFD740;border-top:3px solid #1a1a1a;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;display:flex;justify-content:space-between}
.nb-marquee{border-bottom:3px solid #1a1a1a;overflow:hidden;background:#1a1a1a}
.nb-marquee .track{display:flex;animation:nbmq 16s linear infinite;width:max-content}
.nb-marquee .item{padding:12px 0;font-family:'Archivo Black',sans-serif;font-size:34px;text-transform:uppercase;letter-spacing:-1px;white-space:nowrap;display:flex;align-items:center;gap:12px}
.nb-marquee .item::after{content:'✦';font-size:16px;margin:0 14px}
.nb-marquee .item:nth-child(6n+1){color:#FF5252}.nb-marquee .item:nth-child(6n+2){color:#FFD740}.nb-marquee .item:nth-child(6n+3){color:#69F0AE}.nb-marquee .item:nth-child(6n+4){color:#40C4FF}.nb-marquee .item:nth-child(6n+5){color:#E040FB}.nb-marquee .item:nth-child(6n+6){color:#FF6E40}
@keyframes nbmq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.nb-section{padding:44px 36px}
.nb-sec-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:28px;flex-wrap:wrap;gap:12px}
.nb-sec-head h2{font-family:'Archivo Black',sans-serif;font-size:clamp(26px,4vw,42px);text-transform:uppercase;letter-spacing:-1px;line-height:.95}
.nb-sec-head h2 .hl{background:#FFD740;padding:0 6px}
.nb-sec-head .va{padding:8px 20px;background:#FEF9EF;border:3px solid #1a1a1a;box-shadow:4px 4px 0 #1a1a1a;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:all .12s;color:#1a1a1a}
.nb-sec-head .va:hover{transform:translate(2px,2px);box-shadow:2px 2px 0 #1a1a1a}
.nb-pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.nb-pcard{border:3px solid #1a1a1a;box-shadow:6px 6px 0 #1a1a1a;cursor:pointer;transition:all .15s;overflow:hidden;background:#fff;text-align:left;font-family:'Space Mono',monospace;padding:0;width:100%}
.nb-pcard:hover{transform:translate(3px,3px);box-shadow:3px 3px 0 #1a1a1a}
.nb-pimg{aspect-ratio:1;overflow:hidden;border-bottom:3px solid #1a1a1a;position:relative}
.nb-pimg img{width:100%;height:100%;object-fit:cover;transition:transform .3s}
.nb-pcard:hover .nb-pimg img{transform:scale(1.05)}
.nb-pbadge{position:absolute;top:8px;left:8px;padding:3px 10px;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;border:2px solid #1a1a1a;box-shadow:2px 2px 0 #1a1a1a}
.nb-pbadge.new{background:#69F0AE}.nb-pbadge.sale{background:#FF5252;color:white}.nb-pbadge.hot{background:#FF6E40;color:white}.nb-pbadge.ltd{background:#E040FB;color:white}
.nb-pbody{padding:12px}
.nb-pbrand{font-size:9px;color:#999;letter-spacing:1px;text-transform:uppercase;margin-bottom:2px}
.nb-pname{font-family:'Archivo Black',sans-serif;font-size:13px;text-transform:uppercase;letter-spacing:-.3px;margin-bottom:8px;line-height:1.15;color:#1a1a1a}
.nb-prow{display:flex;justify-content:space-between;align-items:center}
.nb-pprice{font-size:18px;font-weight:700;letter-spacing:-1px}
.nb-pprice .old{font-size:11px;font-weight:400;text-decoration:line-through;color:#999;margin-left:4px}
.nb-padd{padding:5px 12px;border:2px solid #1a1a1a;box-shadow:3px 3px 0 #1a1a1a;background:#FFD740;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:all .1s;color:#1a1a1a}
.nb-padd:hover{transform:translate(1px,1px);box-shadow:2px 2px 0 #1a1a1a}
.nb-split{display:grid;grid-template-columns:1fr 1fr;border-top:3px solid #1a1a1a;border-bottom:3px solid #1a1a1a;min-height:380px}
.nb-split-text{padding:48px 40px;display:flex;flex-direction:column;justify-content:center}
.nb-split-text .label{display:inline-block;padding:3px 10px;background:#40C4FF;border:2px solid #1a1a1a;box-shadow:2px 2px 0 #1a1a1a;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;align-self:flex-start;color:#1a1a1a}
.nb-split-text h3{font-family:'Archivo Black',sans-serif;font-size:clamp(24px,3.5vw,38px);text-transform:uppercase;letter-spacing:-1px;line-height:.95;margin-bottom:10px}
.nb-split-text h3 .hl{background:#FFD740;padding:0 4px}
.nb-split-text p{font-size:13px;color:#777;line-height:1.7;margin-bottom:20px;max-width:380px}
.nb-split-img{border-left:3px solid #1a1a1a;overflow:hidden;position:relative}
.nb-split-img img{width:100%;height:100%;object-fit:cover}
.nb-cats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:3px solid #1a1a1a}
.nb-cat{border-right:3px solid #1a1a1a;position:relative;overflow:hidden;cursor:pointer;transition:all .15s;aspect-ratio:3/4;padding:0;background:none;text-align:left;font-family:inherit;width:100%}
.nb-cat:last-child{border-right:none}
.nb-cat img{width:100%;height:100%;object-fit:cover;filter:grayscale(30%);transition:all .3s}
.nb-cat:hover img{filter:grayscale(0%);transform:scale(1.04)}
.nb-cat-label{position:absolute;bottom:20px;left:20px;padding:8px 18px;border:3px solid #1a1a1a;box-shadow:5px 5px 0 #1a1a1a;font-family:'Archivo Black',sans-serif;font-size:18px;text-transform:uppercase;letter-spacing:-1px;color:#1a1a1a}
.nb-cat:nth-child(1) .nb-cat-label{background:#FF5252;color:white}
.nb-cat:nth-child(2) .nb-cat-label{background:#FFD740}
.nb-cat:nth-child(3) .nb-cat-label{background:#69F0AE}
.nb-bigtext{padding:60px 36px;text-align:center;border-bottom:3px solid #1a1a1a;background:#1a1a1a}
.nb-bigtext h2{font-family:'Archivo Black',sans-serif;font-size:clamp(28px,6vw,72px);text-transform:uppercase;letter-spacing:-2px;line-height:.92;color:#FEF9EF}
.nb-bigtext h2 .c1{color:#FF5252}.nb-bigtext h2 .c2{color:#FFD740}.nb-bigtext h2 .c3{color:#69F0AE}
.nb-nl{display:grid;grid-template-columns:1fr 1fr;border-bottom:3px solid #1a1a1a}
.nb-nl-l{padding:44px 36px;background:#69F0AE;border-right:3px solid #1a1a1a;display:flex;flex-direction:column;justify-content:center}
.nb-nl-l h2{font-family:'Archivo Black',sans-serif;font-size:28px;text-transform:uppercase;letter-spacing:-1px;margin-bottom:8px;color:#1a1a1a}
.nb-nl-l p{font-size:12px;color:rgba(0,0,0,.5);line-height:1.6}
.nb-nl-r{padding:44px 36px;display:flex;flex-direction:column;gap:10px;justify-content:center}
.nb-nl-r label{font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#999}
.nb-nl-r input{padding:10px 14px;border:3px solid #1a1a1a;background:white;font-family:'Space Mono',monospace;font-size:12px;color:#1a1a1a;outline:none;box-shadow:3px 3px 0 #1a1a1a}
.nb-nl-r input:focus{box-shadow:3px 3px 0 #FF5252;border-color:#FF5252}
.nb-nl-r input::placeholder{color:#ccc}
.nb-footer{padding:44px 36px 18px;border-top:3px solid #1a1a1a}
.nb-ftgrid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:32px;margin-bottom:32px}
.nb-ftbrand .fl{font-family:'Archivo Black',sans-serif;font-size:22px;text-transform:uppercase;letter-spacing:-1px;margin-bottom:10px}
.nb-ftbrand p{font-size:11px;color:#999;line-height:1.7;max-width:250px}
.nb-ftcol h5{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;padding:2px 8px;display:inline-block}
.nb-ftcol:nth-child(2) h5{background:#FF5252;color:white}.nb-ftcol:nth-child(3) h5{background:#FFD740}.nb-ftcol:nth-child(4) h5{background:#69F0AE}
.nb-ftcol a{display:block;color:#999;font-size:11px;margin-bottom:6px;cursor:pointer;transition:color .15s;text-decoration:none}
.nb-ftcol a:hover{color:#1a1a1a}
.nb-ftbot{border-top:3px solid #1a1a1a;padding-top:14px;display:flex;justify-content:space-between;font-size:10px;color:#ccc;text-transform:uppercase;letter-spacing:1px}
.nb-ftbot .sc{display:flex;gap:14px}
.nb-ftbot .sc a{color:#ccc;text-decoration:none;cursor:pointer;transition:color .15s}
.nb-ftbot .sc a:hover{color:#FF5252}
.nb-fbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:20px}
.nb-fbtn{padding:7px 16px;border:3px solid #1a1a1a;box-shadow:3px 3px 0 #1a1a1a;background:white;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:all .1s;color:#1a1a1a}
.nb-fbtn:hover{transform:translate(1px,1px);box-shadow:2px 2px 0 #1a1a1a}
.nb-fbtn.a{background:#FFD740}
.nb-sbar{display:flex;margin-bottom:20px;border:3px solid #1a1a1a;box-shadow:4px 4px 0 #1a1a1a}
.nb-sbar input{flex:1;padding:10px 14px;border:none;background:white;font-family:'Space Mono',monospace;font-size:12px;color:#1a1a1a;outline:none}
.nb-sbar input::placeholder{color:#ccc}
.nb-sbar button{padding:10px 20px;background:#FF5252;color:white;border:none;border-left:3px solid #1a1a1a;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:background .15s}
.nb-sbar button:hover{background:#E040FB}
.nb-bc{padding:12px 36px;font-size:11px;color:#999}
.nb-bc button{background:none;border:none;color:#FF5252;cursor:pointer;font-family:'Space Mono',monospace;font-size:11px;font-weight:700}
.nb-bc button:hover{color:#E040FB}
.nb-detail{max-width:1050px;margin:0 auto;padding:20px 36px 48px;display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:start}
.nb-detail-img{border:3px solid #1a1a1a;box-shadow:8px 8px 0 #1a1a1a;overflow:hidden;aspect-ratio:1}
.nb-detail-img img{width:100%;height:100%;object-fit:cover}
.nb-dinfo .brand{font-size:10px;color:#999;letter-spacing:1px;text-transform:uppercase;margin-bottom:6px}
.nb-dinfo h1{font-family:'Archivo Black',sans-serif;font-size:clamp(22px,3vw,34px);text-transform:uppercase;letter-spacing:-1px;margin-bottom:12px;line-height:.95;color:#1a1a1a}
.nb-dinfo .dprice{font-size:26px;font-weight:700;letter-spacing:-1px;margin-bottom:16px}
.nb-dinfo .dprice .old{font-size:13px;font-weight:400;text-decoration:line-through;color:#999;margin-left:6px}
.nb-dinfo .ddesc{font-size:13px;color:#777;line-height:1.7;margin-bottom:22px}
.nb-dinfo label{font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#999;display:block;margin-bottom:6px}
.nb-sizes{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap}
.nb-sz{padding:8px 14px;border:3px solid #1a1a1a;box-shadow:3px 3px 0 #1a1a1a;background:white;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;cursor:pointer;transition:all .1s;color:#1a1a1a}
.nb-sz:hover,.nb-sz.sel{background:#FFD740;transform:translate(1px,1px);box-shadow:2px 2px 0 #1a1a1a}
.nb-colors{display:flex;gap:6px;margin-bottom:16px}
.nb-cl{width:28px;height:28px;border:3px solid #1a1a1a;cursor:pointer;transition:all .15s}
.nb-cl:hover,.nb-cl.sel{box-shadow:0 0 0 3px #FF5252;transform:scale(1.1)}
.nb-empty{text-align:center;padding:44px;color:#999;font-size:13px}
.nb-meta{margin-top:16px;padding-top:14px;border-top:3px solid #eee;display:flex;gap:18px;font-size:10px;color:#999;text-transform:uppercase;letter-spacing:1px}
@media(max-width:1024px){.nb-pgrid{grid-template-columns:repeat(2,1fr)}.nb-hero,.nb-split,.nb-nl,.nb-detail{grid-template-columns:1fr}.nb-hero-r{border-left:none;border-top:3px solid #1a1a1a;min-height:350px}.nb-split-img{border-left:none;border-top:3px solid #1a1a1a;min-height:300px}.nb-nl-l{border-right:none;border-bottom:3px solid #1a1a1a}.nb-cats{grid-template-columns:1fr}.nb-cat{border-right:none;border-bottom:3px solid #1a1a1a;aspect-ratio:16/9}.nb-cat:last-child{border-bottom:none}.nb-ftgrid{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.nb-nlinks{display:none}.nb-pgrid{grid-template-columns:1fr}.nb-section{padding:28px 16px}.nb-hero-l{padding:32px 18px}.nb-footer{padding:28px 16px 12px}.nb-ftgrid{grid-template-columns:1fr}.nb-ftbot{flex-direction:column;gap:6px}.nb-detail{padding:14px;gap:20px}.nb-bc{padding:10px 16px}.nb-nl-l,.nb-nl-r{padding:28px 18px}.nb-bigtext{padding:36px 18px}}
`

function getBadge(b) {
  if (!b) return ''
  if (b.includes('%')) return 'sale'
  if (b.includes('🔥') || b.includes('Hot')) return 'hot'
  if (b.includes('Last') || b.includes('Limited')) return 'ltd'
  return 'new'
}

export default function NeoBrut() {
  const st = useStore('NBRÜT.', 0.9)
  const nav = useNavigate()

  useEffect(() => {
    document.body.style.cssText = "background:#FEF9EF;font-family:'Space Mono',monospace;margin:0;overflow-x:hidden;-webkit-font-smoothing:antialiased;"
    return () => { document.body.style.cssText = '' }
  }, [])

  const PCard = ({ p, i }) => (
    <button className="nb-pcard" onClick={() => st.go('product', { id: p.id })}>
      <div className="nb-pimg">
        {p.badge && <div className={`nb-pbadge ${getBadge(p.badge)}`}>{p.badge}</div>}
        <img src={p.img} alt={p.name} />
      </div>
      <div className="nb-pbody">
        <p className="nb-pbrand">NBRÜT. Goods</p>
        <p className="nb-pname">{p.name}</p>
        <div className="nb-prow">
          <span className="nb-pprice" style={{ color: getA(i) }}>${p.price}{p.oldPrice && <span className="old">${p.oldPrice}</span>}</span>
          <span className="nb-padd" onClick={e => { e.stopPropagation(); const t = e.currentTarget; t.textContent = '✓ OK!'; t.style.background = '#69F0AE'; setTimeout(() => { t.textContent = '+ Add'; t.style.background = '' }, 1200) }}>+ Add</span>
        </div>
      </div>
    </button>
  )

  const tClass = st.transitioning ? 'nb-tpage out' : 'nb-tpage'

  return (
    <div className="nb">
      <style>{CSS}</style>

      <div className={`nb-loader ${!st.loading ? 'hide' : ''}`}>
        <div className="nb-loader-box"><span>NB</span></div>
        <div className="nb-loader-sub">Loading...</div>
      </div>
      <div className={`nb-trans ${st.transitioning ? 'active' : ''}`}><div className="nb-trans-wipe" /></div>

      <button className="nb-back" onClick={() => nav('/')}>← Portfolio</button>

      <nav className="nb-nav">
        <button className="nb-logo" onClick={() => st.go('home')}>NBRÜT.</button>
        <div className="nb-nlinks">
          <button onClick={() => st.go('shop', { cat: 'All' })} className={st.page === 'shop' ? 'a' : ''}>Shop</button>
          <button onClick={() => st.go('shop', { cat: 'Tops' })}>Tops</button>
          <button onClick={() => st.go('shop', { cat: 'Outerwear' })}>Outerwear</button>
          <button onClick={() => st.go('shop', { cat: 'Accessories' })}>Acc.</button>
        </div>
        <div className="nb-nright">
          <button onClick={() => st.go('search')}>Search</button>
          <button>Cart (4)</button>
        </div>
      </nav>

      <div className={tClass}>
      {st.page === 'home' && <>
        <section className="nb-hero">
          <div className="nb-hero-l">
            <div className="sticker">New<br/>Drop<br/>SS26</div>
            <div className="nb-hero-badge">Spring / Summer 2026</div>
            <h1>Ugly Is <span className="hl">Beautiful</span>.<br/>Raw Is <span className="ul">Real</span>.</h1>
            <p className="nb-hero-sub">We stripped away the polish. What's left is honest, functional, and unapologetically bold. Clothing that doesn't need your approval.</p>
            <div className="nb-hero-btns">
              <button className="nb-btn pri" onClick={() => st.go('shop', { cat: 'All' })}>Shop Now →</button>
              <button className="nb-btn out">Read Manifesto</button>
            </div>
          </div>
          <div className="nb-hero-r">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80" alt="" />
            <div className="overlay"><span>SS26 Campaign</span><span>Shot in Berlin</span></div>
          </div>
        </section>

        <div className="nb-marquee"><div className="track">
          {['No Rules','Raw Style','Bold Choices','Zero Polish','Pure Form','Good Ugly','No Rules','Raw Style','Bold Choices','Zero Polish','Pure Form','Good Ugly'].map((t, i) => <span key={i} className="item">{t}</span>)}
        </div></div>

        <div className="nb-section">
          <div className="nb-sec-head"><h2>New <span className="hl">Drops</span></h2><button className="va" onClick={() => st.go('shop', { cat: 'All' })}>View All →</button></div>
          <div className="nb-pgrid">{st.products.slice(0, 8).map((p, i) => <PCard key={p.id} p={p} i={i} />)}</div>
        </div>

        <div className="nb-split">
          <div className="nb-split-text">
            <span className="label">About This Drop</span>
            <h3>Function Over <span className="hl">Form</span>. Always.</h3>
            <p>We don't do seasonal trends. We make things that last, that work, and that look like they were designed by humans — because they were.</p>
            <button className="nb-btn sec" onClick={() => st.go('shop', { cat: 'All' })}>Explore →</button>
          </div>
          <div className="nb-split-img"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" alt="" /></div>
        </div>

        <div className="nb-cats">
          <button className="nb-cat" onClick={() => st.go('shop', { cat: 'Outerwear' })}>
            <img src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=700&q=80" alt="" />
            <div className="nb-cat-label">Outerwear</div>
          </button>
          <button className="nb-cat" onClick={() => st.go('shop', { cat: 'Tops' })}>
            <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80" alt="" />
            <div className="nb-cat-label">Tops</div>
          </button>
          <button className="nb-cat" onClick={() => st.go('shop', { cat: 'Accessories' })}>
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80" alt="" />
            <div className="nb-cat-label">Acc.</div>
          </button>
        </div>

        <div className="nb-bigtext">
          <h2>If It Looks <span className="c1">Too Perfect</span>,<br/>It's Probably <span className="c2">Lying</span><br/>To <span className="c3">You</span>.</h2>
        </div>

        <div className="nb-section">
          <div className="nb-sec-head"><h2>Best <span className="hl">Sellers</span></h2></div>
          <div className="nb-pgrid">{st.products.slice(8, 12).map((p, i) => <PCard key={p.id} p={p} i={i + 8} />)}</div>
        </div>

        <div className="nb-nl">
          <div className="nb-nl-l"><h2>Join The Ugly Club.</h2><p>No spam. Just drops, behind-the-scenes chaos, and 10% off your first order.</p></div>
          <div className="nb-nl-r"><label>Email</label><input placeholder="you@email.com" /><label>Name</label><input placeholder="—" /><button className="nb-btn pri" style={{ alignSelf: 'flex-start', marginTop: 6 }}>Subscribe →</button></div>
        </div>
      </>}

      {st.page === 'shop' && <>
        <div className="nb-bc"><button onClick={() => st.go('home')}>Home</button> / Shop {st.cat !== 'All' ? `/ ${st.cat}` : ''}</div>
        <div className="nb-section">
          <div className="nb-sec-head"><h2>{st.cat === 'All' ? 'All' : st.cat} <span className="hl">Goods</span></h2><span style={{ fontSize: 11, color: '#999' }}>{st.filtered.length} items</span></div>
          <div className="nb-sbar"><input value={st.search} onChange={e => st.setSearch(e.target.value)} placeholder="Search..." onKeyDown={e => e.key === 'Enter' && st.doSearch()} /><button onClick={st.doSearch}>Search</button></div>
          <div className="nb-fbar">{st.cats.map(c => <button key={c} className={`nb-fbtn ${st.cat === c ? 'a' : ''}`} onClick={() => st.go('shop', { cat: c, q: st.sq })}>{c}</button>)}</div>
          <div className="nb-pgrid">{st.filtered.map((p, i) => <PCard key={p.id} p={p} i={i} />)}</div>
          {st.filtered.length === 0 && <p className="nb-empty">Nothing here. Try something else.</p>}
        </div>
      </>}

      {st.page === 'search' && <>
        <div className="nb-section" style={{ paddingTop: 44 }}>
          <div className="nb-sec-head"><h2><span className="hl">Search</span></h2></div>
          <div className="nb-sbar"><input value={st.search} onChange={e => st.setSearch(e.target.value)} placeholder="What are you looking for?" onKeyDown={e => e.key === 'Enter' && st.doSearch()} autoFocus /><button onClick={st.doSearch}>Search</button></div>
          <div className="nb-pgrid">{st.products.slice(0, 8).map((p, i) => <PCard key={p.id} p={p} i={i} />)}</div>
        </div>
      </>}

      {st.page === 'product' && st.product && <>
        <div className="nb-bc"><button onClick={() => st.go('home')}>Home</button> / <button onClick={() => st.go('shop', { cat: st.product.cat })}>{st.product.cat}</button> / {st.product.name}</div>
        <div className="nb-detail">
          <div className="nb-detail-img"><img src={st.product.img} alt={st.product.name} /></div>
          <div className="nb-dinfo">
            <div className="brand">NBRÜT. Goods</div>
            <h1>{st.product.name}</h1>
            <div className="dprice" style={{ color: getA(st.product.id) }}>${st.product.price}{st.product.oldPrice && <span className="old">${st.product.oldPrice}</span>}</div>
            <p className="ddesc">{st.product.desc}</p>
            {st.product.sizes.length > 0 && <><label>Size</label><div className="nb-sizes">{st.product.sizes.map(s => <button key={s} className={`nb-sz ${st.selSize === s ? 'sel' : ''}`} onClick={() => st.setSelSize(s)}>{s}</button>)}</div></>}
            {st.product.colors.length > 0 && <><label>Color</label><div className="nb-colors">{st.product.colors.map(c => <button key={c} className={`nb-cl ${st.selColor === c ? 'sel' : ''}`} onClick={() => st.setSelColor(c)} title={c} style={{ background: colorMap[c] || '#999' }} />)}</div></>}
            <button className="nb-btn pri" style={{ width: '100%', textAlign: 'center', marginTop: 8 }}>Add to Cart →</button>
            <div className="nb-meta"><span>Free Ship +$100</span><span>30-Day Returns</span><span>Made in EU</span></div>
          </div>
        </div>
        <div className="nb-section">
          <div className="nb-sec-head"><h2>More <span className="hl">Goods</span></h2></div>
          <div className="nb-pgrid">{st.related.map((p, i) => <PCard key={p.id} p={p} i={i + 10} />)}</div>
        </div>
      </>}
      </div>

      <footer className="nb-footer">
        <div className="nb-ftgrid">
          <div className="nb-ftbrand"><div className="fl">NBRÜT.</div><p>Ugly is beautiful. Raw is real. We make functional clothing that doesn't need your approval. Berlin-based since 2024.</p></div>
          <div className="nb-ftcol"><h5>Shop</h5><a onClick={() => st.go('shop', { cat: 'All' })}>All</a><a onClick={() => st.go('shop', { cat: 'Tops' })}>Tops</a><a onClick={() => st.go('shop', { cat: 'Outerwear' })}>Outerwear</a><a onClick={() => st.go('shop', { cat: 'Accessories' })}>Accessories</a></div>
          <div className="nb-ftcol"><h5>Info</h5><a>About</a><a>Manifesto</a><a>Press</a><a>Stockists</a></div>
          <div className="nb-ftcol"><h5>Help</h5><a>Contact</a><a>Shipping</a><a>Returns</a><a>FAQ</a></div>
        </div>
        <div className="nb-ftbot"><span>© 2026 NBRÜT. All wrongs reserved.</span><div className="sc"><a>IG</a><a>TK</a><a>YT</a></div></div>
      </footer>
    </div>
  )
}
