import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from './useStore'
import { colorMap } from './data'

const CSS = `
.af{min-height:100vh;background:#E8EDF6;color:#3A3F5A;font-family:'DM Sans',sans-serif;overflow-x:hidden;
  background-image:radial-gradient(ellipse at 20% 0%,#C8D4F0 0%,transparent 50%),radial-gradient(ellipse at 80% 100%,#D0C8E8 0%,transparent 50%);background-attachment:fixed}
.af *{box-sizing:border-box}
::selection{background:#9498D4;color:white}

.af-back{position:fixed;top:16px;left:16px;z-index:9999;padding:8px 20px;background:rgba(255,255,255,.25);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.5);border-radius:100px;color:#4A5A8A;font-family:'Sora',sans-serif;font-size:11px;font-weight:500;cursor:pointer;transition:all .3s;letter-spacing:.5px}
.af-back:hover{background:#9498D4;color:white;border-color:#9498D4}

/* LOADER - Dreamy dissolve */
.af-loader{position:fixed;inset:0;z-index:10000;background:linear-gradient(135deg,#D8E0F4,#C8CCE8);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;transition:opacity .8s ease,filter .8s ease,transform .8s ease}
.af-loader.hide{opacity:0;filter:blur(20px);transform:scale(1.05);pointer-events:none}
.af-loader-orb{position:absolute;border-radius:50%;filter:blur(60px);opacity:.6;pointer-events:none}
.af-loader-orb.o1{width:300px;height:300px;background:#C5D0EE;top:-60px;left:20%;animation:afFloat 5s ease-in-out infinite}
.af-loader-orb.o2{width:200px;height:200px;background:#B8B0D8;bottom:10%;right:20%;animation:afFloat 4s ease-in-out infinite reverse}
@keyframes afFloat{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-20px)}}
.af-loader-text{font-family:'Sora',sans-serif;font-size:48px;font-weight:200;color:#4A5A8A;letter-spacing:8px;text-transform:lowercase;position:relative;z-index:2}
.af-loader-text em{font-weight:600;font-style:normal}
.af-loader-sub{font-size:13px;color:#6B7199;letter-spacing:4px;font-style:italic;position:relative;z-index:2}
.af-loader-dots{display:flex;gap:8px;position:relative;z-index:2;margin-top:8px}
.af-loader-dots span{width:6px;height:6px;border-radius:50%;background:#A8AAE8;animation:afDot 1.2s ease infinite}
.af-loader-dots span:nth-child(2){animation-delay:.2s}
.af-loader-dots span:nth-child(3){animation-delay:.4s}
@keyframes afDot{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:1;transform:scale(1.3)}}

/* TRANSITION - Soft blur dissolve */
.af-trans{position:fixed;inset:0;z-index:9990;pointer-events:none;background:linear-gradient(135deg,rgba(200,208,238,.0),rgba(184,176,216,.0));backdrop-filter:blur(0px);transition:backdrop-filter .4s,background .4s}
.af-trans.active{backdrop-filter:blur(30px);background:linear-gradient(135deg,rgba(200,208,238,.5),rgba(184,176,216,.3))}
.af-tpage{opacity:1;transform:translateY(0) scale(1);transition:opacity .4s ease,transform .4s ease,filter .4s ease;filter:blur(0px)}
.af-tpage.out{opacity:0;transform:translateY(10px) scale(.98);filter:blur(6px)}

/* NAV */
.af-nav{position:sticky;top:0;z-index:1000;background:rgba(232,237,246,.7);backdrop-filter:blur(24px);border-bottom:1px solid rgba(255,255,255,.5);padding:14px 40px;display:flex;justify-content:space-between;align-items:center}
.af-logo{font-family:'Sora',sans-serif;font-size:22px;font-weight:200;color:#4A5A8A;letter-spacing:4px;cursor:pointer;background:none;border:none;padding:0;text-decoration:none}
.af-logo em{font-weight:600;font-style:normal}
.af-nlinks{display:flex;gap:28px}
.af-nlinks button{text-decoration:none;color:#6B7199;font-size:13px;font-weight:400;letter-spacing:1px;transition:color .3s;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;padding:0}
.af-nlinks button:hover,.af-nlinks button.a{color:#9498D4}
.af-nright{display:flex;gap:16px;align-items:center}
.af-nright button{text-decoration:none;color:#6B7199;font-size:13px;transition:color .3s;background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;padding:0}
.af-nright button:hover{color:#9498D4}
.af-cart{background:rgba(255,255,255,.25);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.5);border-radius:100px;padding:8px 20px;font-size:13px;color:#4A5A8A;font-weight:500;transition:all .3s;cursor:pointer;font-family:'Sora',sans-serif}
.af-cart:hover{background:#9498D4;color:white;border-color:#9498D4}

/* HERO */
.af-hero{min-height:86vh;display:flex;align-items:center;justify-content:center;padding:48px;position:relative;overflow:hidden}
.af-hero-orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.5;pointer-events:none}
.af-hero-orb.o1{width:500px;height:500px;background:#C5D0EE;top:-100px;left:-100px;animation:afFloat 12s ease-in-out infinite}
.af-hero-orb.o2{width:400px;height:400px;background:#B8B0D8;bottom:-80px;right:-80px;animation:afFloat 10s ease-in-out infinite reverse}
.af-hero-orb.o3{width:300px;height:300px;background:#A8AAE8;top:30%;right:20%;animation:afFloat 14s ease-in-out infinite}
.af-hero-inner{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;max-width:1200px;position:relative;z-index:2}
.af-hero-text .ep{font-size:12px;color:#9498D4;letter-spacing:4px;text-transform:lowercase;margin-bottom:16px;font-weight:500}
.af-hero-text h1{font-family:'Sora',sans-serif;font-size:clamp(40px,5.5vw,72px);font-weight:200;line-height:1.05;color:#4A5A8A;letter-spacing:-1px;margin-bottom:16px}
.af-hero-text h1 b{font-weight:700}
.af-hero-text h1 .soft{color:#9498D4}
.af-hero-text .sub{font-size:18px;font-style:italic;color:#6B7199;margin-bottom:12px;font-weight:300;line-height:1.5}
.af-hero-text p{font-size:15px;color:#9DA2BF;line-height:1.8;max-width:400px;margin-bottom:32px}
.af-hero-btns{display:flex;gap:12px;flex-wrap:wrap}
.af-btn{padding:13px 32px;border-radius:100px;font-family:'Sora',sans-serif;font-size:13px;font-weight:500;letter-spacing:1px;cursor:pointer;transition:all .4s;border:1px solid transparent}
.af-btn.primary{background:#9498D4;color:white;border-color:#9498D4;box-shadow:0 8px 32px rgba(148,152,212,.3)}
.af-btn.primary:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(148,152,212,.4)}
.af-btn.ghost{background:rgba(255,255,255,.25);backdrop-filter:blur(10px);color:#4A5A8A;border:1px solid rgba(255,255,255,.5)}
.af-btn.ghost:hover{background:rgba(255,255,255,.6)}
.af-hero-img{position:relative}
.af-hero-img img{width:100%;border-radius:24px;filter:brightness(1.05) saturate(.85);box-shadow:0 20px 60px rgba(74,90,138,.15);border:1px solid rgba(255,255,255,.5)}
.af-hero-float{position:absolute;background:rgba(255,255,255,.25);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.5);border-radius:16px;padding:16px 20px;box-shadow:0 8px 32px rgba(0,0,0,.06);top:-12px;right:-12px;text-align:center}
.af-hero-float .label{font-size:10px;color:#9DA2BF;letter-spacing:2px;margin-bottom:4px}
.af-hero-float .val{font-family:'Sora',sans-serif;font-size:24px;font-weight:700;color:#4A5A8A}

/* SECTION */
.af-section{max-width:1200px;margin:0 auto;padding:72px 40px}
.af-sec-head{text-align:center;margin-bottom:40px}
.af-sec-head .over{font-size:12px;color:#9498D4;letter-spacing:4px;text-transform:lowercase;margin-bottom:8px;display:block}
.af-sec-head h2{font-family:'Sora',sans-serif;font-size:clamp(26px,3.5vw,40px);font-weight:200;color:#4A5A8A;letter-spacing:-.5px}
.af-sec-head h2 b{font-weight:700}
.af-va{padding:10px 24px;border-radius:100px;border:1px solid rgba(255,255,255,.5);background:rgba(255,255,255,.25);backdrop-filter:blur(10px);color:#4A5A8A;font-family:'Sora',sans-serif;font-size:12px;font-weight:500;cursor:pointer;transition:all .3s;letter-spacing:.5px}
.af-va:hover{background:#9498D4;color:white;border-color:#9498D4}

/* FILTER */
.af-filter{display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin-bottom:32px}
.af-ftag{padding:8px 20px;border-radius:100px;border:1px solid rgba(255,255,255,.5);background:rgba(255,255,255,.25);backdrop-filter:blur(8px);font-family:'Sora',sans-serif;font-size:12px;font-weight:400;cursor:pointer;color:#6B7199;transition:all .3s}
.af-ftag:hover,.af-ftag.a{background:#9498D4;color:white;border-color:#9498D4}

/* PRODUCT GRID */
.af-pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.af-pcard{text-decoration:none;color:inherit;display:block;background:rgba(255,255,255,.45);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.5);border-radius:20px;overflow:hidden;transition:all .4s;box-shadow:0 4px 20px rgba(0,0,0,.04);cursor:pointer;text-align:left;padding:0;width:100%;font-family:'DM Sans',sans-serif}
.af-pcard:hover{transform:translateY(-6px);box-shadow:0 16px 48px rgba(74,90,138,.12);border-color:#9498D4}
.af-pimg{aspect-ratio:3/4;overflow:hidden;position:relative}
.af-pimg img{width:100%;height:100%;object-fit:cover;filter:brightness(1.05) saturate(.8);transition:all .5s}
.af-pcard:hover .af-pimg img{filter:brightness(1.08) saturate(.95);transform:scale(1.04)}
.af-ptag{position:absolute;top:12px;left:12px;background:rgba(255,255,255,.25);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.5);border-radius:100px;padding:4px 14px;font-size:11px;color:#4A5A8A;font-weight:500;letter-spacing:1px}
.af-pbody{padding:16px}
.af-pbrand{font-size:10px;color:#9DA2BF;letter-spacing:2px;text-transform:uppercase;margin-bottom:4px}
.af-pname{font-family:'Sora',sans-serif;font-size:15px;font-weight:500;color:#4A5A8A;margin-bottom:4px;line-height:1.2}
.af-pname em{font-weight:300;font-style:italic}
.af-pdesc{font-size:12px;font-style:italic;color:#9DA2BF;margin-bottom:10px}
.af-pprice{display:flex;justify-content:space-between;align-items:center}
.af-pprice .cur{font-family:'Sora',sans-serif;font-size:18px;font-weight:700;color:#9498D4}
.af-pprice .old{font-size:13px;font-weight:300;text-decoration:line-through;color:#9DA2BF;margin-left:6px}
.af-padd{padding:6px 16px;border-radius:100px;border:1px solid rgba(148,152,212,.3);background:rgba(148,152,212,.1);color:#9498D4;font-size:11px;font-weight:500;cursor:pointer;transition:all .3s;font-family:'Sora',sans-serif}
.af-padd:hover{background:#9498D4;color:white}

/* CATEGORIES */
.af-cats{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;max-width:1200px;margin:0 auto;padding:0 40px 72px}
.af-cat{border-radius:20px;overflow:hidden;position:relative;aspect-ratio:3/4;cursor:pointer;transition:all .4s;border:1px solid rgba(255,255,255,.5);background:none;color:inherit;width:100%;padding:0;font-family:'DM Sans',sans-serif}
.af-cat:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(74,90,138,.12)}
.af-cat img{width:100%;height:100%;object-fit:cover;filter:brightness(1.05) saturate(.8);opacity:.7;transition:all .5s}
.af-cat:hover img{opacity:.85;transform:scale(1.04)}
.af-cat-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(74,90,138,.6),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:24px}
.af-cat-ov h3{font-family:'Sora',sans-serif;font-size:clamp(22px,2.5vw,32px);font-weight:700;color:white;letter-spacing:-.5px;margin-bottom:4px}
.af-cat-ov span{font-size:12px;color:rgba(255,255,255,.6);letter-spacing:1px}

/* GLASS BANNER */
.af-banner{max-width:1200px;margin:0 auto 64px;padding:0 40px}
.af-banner-inner{background:rgba(255,255,255,.25);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.5);border-radius:28px;display:grid;grid-template-columns:1fr 1fr;overflow:hidden;box-shadow:0 12px 48px rgba(0,0,0,.06)}
.af-ban-text{padding:48px 40px;display:flex;flex-direction:column;justify-content:center}
.af-ban-text .over{font-size:11px;color:#9498D4;letter-spacing:3px;margin-bottom:12px;text-transform:lowercase}
.af-ban-text h3{font-family:'Sora',sans-serif;font-size:clamp(22px,3vw,36px);font-weight:200;color:#4A5A8A;line-height:1.1;margin-bottom:8px}
.af-ban-text h3 b{font-weight:700}
.af-ban-text .tag{font-size:16px;font-style:italic;color:#9498D4;margin-bottom:16px}
.af-ban-text p{font-size:14px;color:#9DA2BF;line-height:1.8;margin-bottom:24px;max-width:380px}
.af-ban-img{overflow:hidden}
.af-ban-img img{width:100%;height:100%;object-fit:cover;filter:brightness(1.05) saturate(.8)}

/* DETAIL */
.af-detail{display:grid;grid-template-columns:1fr 1fr;gap:48px;max-width:1200px;margin:0 auto;padding:48px 40px}
.af-detail-img{border-radius:24px;overflow:hidden;border:1px solid rgba(255,255,255,.5);box-shadow:0 12px 40px rgba(0,0,0,.08);aspect-ratio:3/4}
.af-detail-img img{width:100%;height:100%;object-fit:cover;filter:brightness(1.05) saturate(.85)}
.af-detail-info{padding:24px 0;display:flex;flex-direction:column;justify-content:center}
.af-detail-crumb{font-size:12px;color:#9DA2BF;margin-bottom:16px;display:flex;gap:8px;letter-spacing:1px}
.af-detail-crumb span{cursor:pointer;transition:color .3s}
.af-detail-crumb span:hover{color:#9498D4}
.af-detail-ep{font-size:11px;color:#9498D4;letter-spacing:3px;text-transform:lowercase;margin-bottom:8px}
.af-detail-name{font-family:'Sora',sans-serif;font-size:clamp(28px,3.5vw,44px);font-weight:200;color:#4A5A8A;letter-spacing:-.5px;line-height:1.1;margin-bottom:6px}
.af-detail-name b{font-weight:700}
.af-detail-price{font-family:'Sora',sans-serif;font-size:24px;font-weight:700;color:#9498D4;margin-bottom:20px;display:flex;align-items:center;gap:12px}
.af-detail-price .old{font-size:16px;text-decoration:line-through;color:#9DA2BF;font-weight:300}
.af-detail-desc{font-size:15px;color:#6B7199;line-height:1.8;margin-bottom:28px;padding-bottom:24px;border-bottom:1px solid rgba(255,255,255,.5);font-style:italic}
.af-opts{display:flex;flex-direction:column;gap:20px;margin-bottom:28px}
.af-opt-label{font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;color:#9DA2BF;font-family:'Sora',sans-serif}
.af-sizes{display:flex;gap:8px;flex-wrap:wrap}
.af-sizes button{padding:10px 20px;border-radius:100px;border:1px solid rgba(255,255,255,.5);background:rgba(255,255,255,.25);font-family:'Sora',sans-serif;font-size:13px;font-weight:400;cursor:pointer;transition:all .3s;color:#6B7199;backdrop-filter:blur(8px)}
.af-sizes button:hover,.af-sizes button.sel{background:#9498D4;color:white;border-color:#9498D4}
.af-colors{display:flex;gap:8px}
.af-colors button{width:34px;height:34px;border-radius:50%;border:2px solid rgba(255,255,255,.5);cursor:pointer;transition:all .3s;box-shadow:0 2px 8px rgba(0,0,0,.08)}
.af-colors button.sel{border-color:#9498D4;box-shadow:0 0 0 3px rgba(148,152,212,.3)}
.af-add-btn{padding:16px 40px;border-radius:100px;border:none;background:#9498D4;color:white;font-family:'Sora',sans-serif;font-size:14px;font-weight:500;letter-spacing:1px;cursor:pointer;box-shadow:0 8px 32px rgba(148,152,212,.3);transition:all .4s;width:fit-content}
.af-add-btn:hover{transform:translateY(-2px);box-shadow:0 12px 40px rgba(148,152,212,.4)}

/* RELATED */
.af-related{max-width:1200px;margin:0 auto;padding:48px 40px 72px}
.af-related h3{font-family:'Sora',sans-serif;font-size:24px;font-weight:200;color:#4A5A8A;margin-bottom:28px;letter-spacing:-.5px}
.af-related h3 b{font-weight:700}

/* SEARCH */
.af-search{max-width:700px;margin:0 auto;padding:60px 40px}
.af-search-box{display:flex;gap:12px;margin-bottom:40px}
.af-search-box input{flex:1;padding:14px 24px;border-radius:100px;border:1px solid rgba(255,255,255,.5);background:rgba(255,255,255,.35);backdrop-filter:blur(10px);font-family:'Sora',sans-serif;font-size:15px;outline:none;color:#4A5A8A;font-weight:400}
.af-search-box input:focus{border-color:#9498D4;box-shadow:0 4px 20px rgba(148,152,212,.15)}

/* NEWSLETTER */
.af-nl{max-width:1200px;margin:0 auto 64px;padding:0 40px}
.af-nl-inner{background:rgba(255,255,255,.25);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.5);border-radius:28px;display:grid;grid-template-columns:1fr 1fr;overflow:hidden;box-shadow:0 12px 48px rgba(0,0,0,.04)}
.af-nl-l{padding:48px 40px;display:flex;flex-direction:column;justify-content:center}
.af-nl-l .over{font-size:11px;color:#9498D4;letter-spacing:3px;margin-bottom:8px;text-transform:lowercase}
.af-nl-l h3{font-family:'Sora',sans-serif;font-size:clamp(24px,3vw,36px);font-weight:200;color:#4A5A8A;letter-spacing:-.5px;margin-bottom:10px}
.af-nl-l h3 b{font-weight:700}
.af-nl-l p{font-size:14px;color:#9DA2BF;line-height:1.7;font-style:italic}
.af-nl-r{padding:48px 40px;display:flex;flex-direction:column;gap:12px;justify-content:center;background:rgba(255,255,255,.15)}
.af-nl-r label{font-size:10px;color:#9DA2BF;letter-spacing:2px;font-family:'Sora',sans-serif}
.af-nl-r input{padding:12px 20px;border-radius:12px;border:1px solid rgba(255,255,255,.5);background:rgba(255,255,255,.3);font-family:'Sora',sans-serif;font-size:14px;outline:none;color:#4A5A8A;backdrop-filter:blur(8px)}
.af-nl-r input:focus{border-color:#9498D4}

/* FOOTER */
.af-footer{background:#3A3F5A;color:#9DA2BF;padding:0}
.af-ftgrid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;padding:48px 40px;gap:40px;max-width:1200px;margin:0 auto}
.af-ftcol .logo{font-family:'Sora',sans-serif;font-size:22px;font-weight:200;color:#C5D0EE;letter-spacing:3px;margin-bottom:8px}
.af-ftcol .logo em{font-weight:600;font-style:normal}
.af-ftcol .desc{font-size:12px;color:#6B7199;line-height:1.7;font-style:italic}
.af-ftcol h5{font-size:10px;letter-spacing:3px;color:#9498D4;margin-bottom:16px;text-transform:lowercase;font-weight:500;font-family:'Sora',sans-serif}
.af-ftcol a{display:block;color:#6B7199;font-size:12px;margin-bottom:8px;cursor:pointer;transition:color .3s;text-decoration:none}
.af-ftcol a:hover{color:#C5D0EE}
.af-ftbot{max-width:1200px;margin:0 auto;border-top:1px solid rgba(255,255,255,.08);padding:20px 40px;display:flex;justify-content:space-between;font-size:11px;color:#6B7199;font-style:italic}
.af-ftbot .sc{display:flex;gap:16px}
.af-ftbot .sc a{color:#6B7199;cursor:pointer;transition:color .3s;text-decoration:none}
.af-ftbot .sc a:hover{color:#C5D0EE}

@media(max-width:1024px){
  .af-hero-inner,.af-banner-inner,.af-nl-inner,.af-detail{grid-template-columns:1fr}
  .af-pgrid{grid-template-columns:repeat(2,1fr)}
  .af-cats{grid-template-columns:1fr}
  .af-ftgrid{grid-template-columns:1fr 1fr}
}
@media(max-width:640px){
  .af-nlinks{display:none}
  .af-hero{padding:24px 16px}
  .af-section,.af-cats,.af-banner,.af-nl,.af-related{padding-left:16px;padding-right:16px}
  .af-pgrid,.af-cats-grid{grid-template-columns:1fr;gap:16px}
  .af-ftgrid{grid-template-columns:1fr;padding:32px 16px}
  .af-detail{padding:32px 16px;gap:24px}
  .af-ftbot{flex-direction:column;gap:12px;text-align:center}
}
`

const Card = ({ p, st }) => (
  <button className="af-pcard" onClick={() => st.go('product', { id: p.id })}>
    <div className="af-pimg">
      <img src={p.img} alt={p.name} loading="lazy" />
      {p.badge && <span className="af-ptag">{p.badge}</span>}
    </div>
    <div className="af-pbody">
      <div className="af-pbrand">after. studio</div>
      <div className="af-pname">{p.name.split(' ').slice(0, 1).join(' ')} <em>{p.name.split(' ').slice(1).join(' ')}</em></div>
      <div className="af-pdesc">{p.desc.split('.')[0]}.</div>
      <div className="af-pprice">
        <span><span className="cur">${p.price}</span>{p.oldPrice && <span className="old">${p.oldPrice}</span>}</span>
        <button className="af-padd" onClick={e => e.stopPropagation()}>+ add</button>
      </div>
    </div>
  </button>
)

export default function SoftClub() {
  const nav = useNavigate()
  const st = useStore('AFTR', 1.4)
  useEffect(() => { document.body.style.background = '#E8EDF6'; return () => { document.body.style.background = '' } }, [])
  const tClass = st.transitioning ? 'af-tpage out' : 'af-tpage'

  return (
    <div className="af">
      <style>{CSS}</style>

      {/* LOADER */}
      <div className={`af-loader ${!st.loading ? 'hide' : ''}`}>
        <div className="af-loader-orb o1" />
        <div className="af-loader-orb o2" />
        <div className="af-loader-text"><em>after</em>.</div>
        <div className="af-loader-sub">wherever · whenever · forever</div>
        <div className="af-loader-dots"><span /><span /><span /></div>
      </div>

      {/* TRANSITION */}
      <div className={`af-trans ${st.transitioning ? 'active' : ''}`} />

      <button className="af-back" onClick={() => nav('/')}>← portfolio</button>

      {/* NAV */}
      <nav className="af-nav">
        <button className="af-logo" onClick={() => st.go('home')}><em>after</em>.</button>
        <div className="af-nlinks">
          {st.cats.map(c => <button key={c} className={st.cat === c && st.page === 'shop' ? 'a' : ''} onClick={() => st.go('shop', { cat: c })}>{c.toLowerCase()}</button>)}
        </div>
        <div className="af-nright">
          <button onClick={() => st.go('search')}>search</button>
          <button className="af-cart">bag (2)</button>
        </div>
      </nav>

      <div className={tClass}>
        {/* HOME */}
        {st.page === 'home' && <>
          <section className="af-hero">
            <div className="af-hero-orb o1" /><div className="af-hero-orb o2" /><div className="af-hero-orb o3" />
            <div className="af-hero-inner">
              <div className="af-hero-text">
                <p className="ep">ep.3 · spring/summer 2026</p>
                <h1><b>lead me</b><br/><span className="soft">to you.</span></h1>
                <p className="sub">wherever · whenever · forever</p>
                <p>Soft silhouettes and gentle fabrics that move with you through the quiet moments. Designed for the in-between hours.</p>
                <div className="af-hero-btns">
                  <button className="af-btn primary" onClick={() => st.go('shop', { cat: 'All' })}>explore collection</button>
                  <button className="af-btn ghost">watch film</button>
                </div>
              </div>
              <div className="af-hero-img">
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80" alt="Soft fashion" />
                <div className="af-hero-float"><div className="label">from</div><div className="val">$125</div></div>
              </div>
            </div>
          </section>

          {/* PRODUCTS */}
          <div className="af-section">
            <div className="af-sec-head"><span className="over">new arrivals · ep.3</span><h2><b>soft</b> essentials.</h2></div>
            <div className="af-pgrid">{st.products.slice(0, 8).map((p, i) => <Card key={p.id} p={p} st={st} />)}</div>
            <div style={{ textAlign: 'center', marginTop: 32 }}><button className="af-va" onClick={() => st.go('shop', { cat: 'All' })}>view all →</button></div>
          </div>

          {/* BANNER */}
          <div className="af-banner"><div className="af-banner-inner">
            <div className="af-ban-text">
              <span className="over">the journal · vol.3</span>
              <h3><b>wherever</b> you go,<br/>go <b>softly</b>.</h3>
              <p className="tag">A gentler way to dress.</p>
              <p>Our SS26 collection is an ode to quiet luxury — pieces that don't demand attention, but earn it through texture, drape, and the kind of comfort that makes you exhale.</p>
              <button className="af-btn primary" onClick={() => st.go('shop', { cat: 'All' })}>read more</button>
            </div>
            <div className="af-ban-img"><img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80" alt="" /></div>
          </div></div>

          {/* CATEGORIES */}
          <div className="af-section" style={{ padding: '0 40px 32px', maxWidth: 1200, margin: '0 auto' }}><div className="af-sec-head"><span className="over">categories</span><h2>shop by <b>mood</b>.</h2></div></div>
          <div className="af-cats">
            <button className="af-cat" onClick={() => st.go('shop', { cat: 'Outerwear' })}><img src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=600&q=80" alt="" /><div className="af-cat-ov"><h3>outerwear.</h3><span>8 pieces</span></div></button>
            <button className="af-cat" onClick={() => st.go('shop', { cat: 'Footwear' })}><img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80" alt="" /><div className="af-cat-ov"><h3>footwear.</h3><span>6 pieces</span></div></button>
            <button className="af-cat" onClick={() => st.go('shop', { cat: 'Accessories' })}><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80" alt="" /><div className="af-cat-ov"><h3>objects.</h3><span>6 pieces</span></div></button>
          </div>

          {/* NEWSLETTER */}
          <div className="af-nl"><div className="af-nl-inner">
            <div className="af-nl-l">
              <span className="over">stay close</span>
              <h3>join the <b>soft club</b>.</h3>
              <p>Early access, exclusive drops, and a 10% welcome gift. Delivered gently to your inbox.</p>
            </div>
            <div className="af-nl-r">
              <label>email</label>
              <input type="email" placeholder="you@email.com" />
              <label>name</label>
              <input type="text" placeholder="your name" />
              <button className="af-btn primary" style={{ width: '100%', textAlign: 'center' }}>subscribe</button>
            </div>
          </div></div>
        </>}

        {/* SHOP */}
        {st.page === 'shop' && <div className="af-section">
          <div className="af-sec-head"><span className="over">collection</span><h2><b>{st.cat === 'All' ? 'all' : st.cat.toLowerCase()}</b> pieces.</h2></div>
          <div className="af-filter">
            {st.cats.map(c => <button key={c} className={`af-ftag ${st.cat === c ? 'a' : ''}`} onClick={() => st.go('shop', { cat: c })}>{c.toLowerCase()}</button>)}
          </div>
          <div className="af-pgrid">{st.filtered.map((p, i) => <Card key={p.id} p={p} st={st} />)}</div>
          {st.filtered.length === 0 && <p style={{ textAlign: 'center', padding: 60, color: '#9DA2BF', fontStyle: 'italic' }}>nothing here yet...</p>}
        </div>}

        {/* PRODUCT */}
        {st.page === 'product' && st.product && <><div className="af-detail">
          <div className="af-detail-img"><img src={st.product.img} alt={st.product.name} /></div>
          <div className="af-detail-info">
            <div className="af-detail-crumb"><span onClick={() => st.go('home')}>home</span> / <span onClick={() => st.go('shop', { cat: st.product.cat })}>{st.product.cat.toLowerCase()}</span> / {st.product.name.toLowerCase()}</div>
            <div className="af-detail-ep">after. studio · ep.3</div>
            <h1 className="af-detail-name"><b>{st.product.name.split(' ')[0]}</b> {st.product.name.split(' ').slice(1).join(' ')}</h1>
            <div className="af-detail-price"><span>${st.product.price}</span>{st.product.oldPrice && <span className="old">${st.product.oldPrice}</span>}</div>
            <p className="af-detail-desc">{st.product.desc}</p>
            <div className="af-opts">
              <div><div className="af-opt-label">size</div><div className="af-sizes">{st.product.sizes.map(s => <button key={s} className={st.selSize === s ? 'sel' : ''} onClick={() => st.setSelSize(s)}>{s}</button>)}</div></div>
              <div><div className="af-opt-label">color</div><div className="af-colors">{st.product.colors.map(c => <button key={c} className={st.selColor === c ? 'sel' : ''} style={{ background: colorMap[c] || '#ddd' }} onClick={() => st.setSelColor(c)} />)}</div></div>
            </div>
            <button className="af-add-btn">add to bag</button>
          </div>
        </div>
        <div className="af-related">
          <h3>you might <b>also love</b>.</h3>
          <div className="af-pgrid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>{st.related.map((p, i) => <Card key={p.id} p={p} st={st} />)}</div>
        </div></>}

        {/* SEARCH */}
        {st.page === 'search' && <div className="af-search">
          <div className="af-sec-head" style={{ marginBottom: 24 }}><span className="over">find</span><h2><b>search</b> collection.</h2></div>
          <div className="af-search-box">
            <input value={st.search} onChange={e => st.setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && st.doSearch()} placeholder="what are you looking for?" />
            <button className="af-btn primary" onClick={st.doSearch}>search</button>
          </div>
          {st.sq && <div className="af-pgrid">{st.filtered.map((p, i) => <Card key={p.id} p={p} st={st} />)}</div>}
        </div>}
      </div>

      {/* FOOTER */}
      <footer className="af-footer">
        <div className="af-ftgrid">
          <div className="af-ftcol"><div className="logo"><em>after</em>.</div><p className="desc">Soft club for gentle souls. Wherever, whenever, forever. Est. 2024.</p></div>
          <div className="af-ftcol"><h5>shop</h5><a onClick={() => st.go('shop', { cat: 'All' })}>all</a><a onClick={() => st.go('shop', { cat: 'Outerwear' })}>outerwear</a><a onClick={() => st.go('shop', { cat: 'Footwear' })}>footwear</a><a onClick={() => st.go('shop', { cat: 'Bags' })}>bags</a></div>
          <div className="af-ftcol"><h5>world</h5><a>journal</a><a>film</a><a>about</a><a>stockists</a></div>
          <div className="af-ftcol"><h5>help</h5><a>contact</a><a>shipping</a><a>returns</a><a>sizing</a></div>
        </div>
        <div className="af-ftbot"><span>© 2026 after. all rights reserved. stay soft.</span><div className="sc"><a>ig</a><a>pin</a><a>sp</a></div></div>
      </footer>
    </div>
  )
}
