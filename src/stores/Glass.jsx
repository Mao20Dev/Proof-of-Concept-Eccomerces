import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from './useStore'
import { colorMap } from './data'

const CSS = `
.gl{min-height:100vh;background:#0c0a1a;color:#f0eef6;font-family:'Inter',sans-serif;position:relative;overflow-x:hidden}
.gl::before{content:'';position:fixed;top:-30%;left:-20%;width:70%;height:70%;background:radial-gradient(circle,rgba(139,92,246,.2),transparent 60%);pointer-events:none;z-index:0}
.gl::after{content:'';position:fixed;bottom:-30%;right:-20%;width:70%;height:70%;background:radial-gradient(circle,rgba(56,189,248,.15),transparent 60%);pointer-events:none;z-index:0}
.gl>*{position:relative;z-index:1}
.gl-back{position:fixed;top:16px;left:16px;z-index:9999;padding:8px 20px;background:rgba(255,255,255,.08);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.12);border-radius:100px;color:#c4b5fd;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .3s;letter-spacing:.5px}

/* LOADER */
.gl-loader{position:fixed;inset:0;z-index:10000;background:#0c0a1a;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:20px;transition:opacity .5s,visibility .5s}
.gl-loader.hide{opacity:0;visibility:hidden;pointer-events:none}
.gl-loader-orb{width:120px;height:120px;border-radius:50%;background:radial-gradient(circle,rgba(139,92,246,.6),rgba(56,189,248,.3),transparent);filter:blur(20px);animation:glOrbPulse 1.5s ease infinite}
@keyframes glOrbPulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.2);opacity:1}}
.gl-loader-name{font-family:'Inter',sans-serif;font-size:28px;font-weight:800;letter-spacing:-1px;background:linear-gradient(135deg,#c4b5fd,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.gl-loader-sub{font-family:'Space Mono',monospace;font-size:11px;color:rgba(255,255,255,.3);letter-spacing:3px}

/* TRANSITION */
.gl-trans{position:fixed;inset:0;z-index:9990;pointer-events:none;backdrop-filter:blur(0px);transition:backdrop-filter .4s}
.gl-trans.active{backdrop-filter:blur(30px)}
.gl-tpage{opacity:1;transform:translateY(0);transition:opacity .35s,transform .35s,filter .35s;filter:blur(0px)}
.gl-tpage.out{opacity:0;transform:translateY(10px);filter:blur(8px)}

.gl-back:hover{background:rgba(139,92,246,.25);border-color:rgba(139,92,246,.4)}
.gl-glass{background:rgba(255,255,255,.04);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.08);border-radius:20px}
.gl-glass2{background:rgba(255,255,255,.06);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.1);border-radius:16px}
.gl-nav{position:sticky;top:0;z-index:1000;display:flex;align-items:center;justify-content:space-between;padding:14px 36px;background:rgba(12,10,26,.75);backdrop-filter:blur(20px);border-bottom:1px solid rgba(255,255,255,.06)}
.gl-logo{font-size:22px;font-weight:800;letter-spacing:-1px;cursor:pointer;background:linear-gradient(135deg,#c4b5fd,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;border:none}
.gl-nlinks{display:flex;gap:4px}
.gl-nlinks button{padding:7px 16px;border:none;background:none;color:rgba(255,255,255,.45);font-family:'Inter',sans-serif;font-size:12px;font-weight:500;cursor:pointer;border-radius:100px;transition:all .25s;letter-spacing:.3px}
.gl-nlinks button:hover,.gl-nlinks button.a{color:#f0eef6;background:rgba(255,255,255,.08)}
.gl-nright{display:flex;gap:6px}
.gl-nright button{padding:7px 18px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#c4b5fd;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;border-radius:100px;cursor:pointer;transition:all .25s}
.gl-nright button:hover{background:rgba(139,92,246,.2);border-color:rgba(139,92,246,.3)}
.gl-nright button:last-child{background:linear-gradient(135deg,rgba(139,92,246,.3),rgba(56,189,248,.3));border:1px solid rgba(139,92,246,.3)}
.gl-hero{min-height:90vh;display:flex;align-items:center;justify-content:center;text-align:center;padding:60px 28px;position:relative}
.gl-hero-orbs{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.gl-hero-orbs .orb{position:absolute;border-radius:50%;filter:blur(80px)}
.gl-hero-orbs .orb:nth-child(1){top:15%;left:20%;width:300px;height:300px;background:rgba(139,92,246,.25)}
.gl-hero-orbs .orb:nth-child(2){bottom:20%;right:15%;width:350px;height:350px;background:rgba(56,189,248,.2)}
.gl-hero-orbs .orb:nth-child(3){top:50%;left:55%;width:200px;height:200px;background:rgba(236,72,153,.15)}
.gl-hero-c{position:relative;z-index:2;max-width:700px}
.gl-hero-badge{display:inline-block;padding:6px 18px;border-radius:100px;font-size:11px;font-weight:600;letter-spacing:2px;text-transform:uppercase;background:rgba(255,255,255,.06);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.1);color:#c4b5fd;margin-bottom:24px}
.gl-hero h1{font-size:clamp(44px,8vw,88px);font-weight:800;line-height:.95;letter-spacing:-3px;margin-bottom:18px;background:linear-gradient(135deg,#f0eef6,#c4b5fd,#38bdf8,#f0eef6);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-size:200% 200%;animation:glShine 6s ease infinite}
@keyframes glShine{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
.gl-hero p{font-size:17px;color:rgba(255,255,255,.45);line-height:1.7;margin-bottom:32px;font-weight:300}
.gl-hero-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.gl-btn{padding:12px 28px;border-radius:100px;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;cursor:pointer;transition:all .3s;letter-spacing:.3px}
.gl-btn.pri{background:linear-gradient(135deg,#8b5cf6,#6366f1);color:white;border:none;box-shadow:0 4px 20px rgba(139,92,246,.3)}
.gl-btn.pri:hover{box-shadow:0 6px 30px rgba(139,92,246,.5);transform:translateY(-2px)}
.gl-btn.out{background:rgba(255,255,255,.06);color:#f0eef6;border:1px solid rgba(255,255,255,.15);backdrop-filter:blur(10px)}
.gl-btn.out:hover{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.25)}
.gl-section{padding:48px 36px}
.gl-sec-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;flex-wrap:wrap;gap:12px}
.gl-sec-head h2{font-size:clamp(24px,3.5vw,36px);font-weight:700;letter-spacing:-1px}
.gl-sec-head h2 .grad{background:linear-gradient(135deg,#c4b5fd,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.gl-sec-head .va{padding:8px 20px;border-radius:100px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);color:#c4b5fd;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .25s}
.gl-sec-head .va:hover{background:rgba(139,92,246,.15);border-color:rgba(139,92,246,.3)}
.gl-pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.gl-pcard{border-radius:16px;overflow:hidden;background:rgba(255,255,255,.04);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.08);cursor:pointer;transition:all .4s cubic-bezier(.22,1,.36,1);padding:0}
.gl-pcard:hover{border-color:rgba(139,92,246,.3);transform:translateY(-6px);box-shadow:0 16px 40px rgba(139,92,246,.12);background:rgba(255,255,255,.06)}
.gl-pimg{aspect-ratio:1;overflow:hidden;border-radius:12px;margin:10px;position:relative}
.gl-pimg img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.gl-pcard:hover .gl-pimg img{transform:scale(1.06)}
.gl-pbadge{position:absolute;top:8px;left:8px;padding:4px 12px;border-radius:100px;font-size:10px;font-weight:700;letter-spacing:1px;backdrop-filter:blur(12px)}
.gl-pbadge.new{background:rgba(139,92,246,.6);color:white}
.gl-pbadge.sale{background:rgba(236,72,153,.6);color:white}
.gl-pbadge.hot{background:rgba(251,146,60,.6);color:white}
.gl-pbadge.ltd{background:rgba(56,189,248,.6);color:white}
.gl-pbody{padding:6px 14px 16px}
.gl-pbrand{font-size:10px;color:rgba(255,255,255,.3);letter-spacing:1.5px;text-transform:uppercase;margin-bottom:3px;font-weight:500}
.gl-pname{font-size:14px;font-weight:600;letter-spacing:-.3px;margin-bottom:8px;line-height:1.2}
.gl-prow{display:flex;justify-content:space-between;align-items:center}
.gl-pprice{font-size:18px;font-weight:700;letter-spacing:-.5px;background:linear-gradient(135deg,#c4b5fd,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.gl-pprice .old{font-size:11px;font-weight:400;text-decoration:line-through;-webkit-text-fill-color:rgba(255,255,255,.3);margin-left:4px}
.gl-padd{padding:6px 14px;border-radius:100px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:#c4b5fd;font-size:10px;font-weight:600;cursor:pointer;transition:all .25s;font-family:'Inter',sans-serif}
.gl-padd:hover{background:rgba(139,92,246,.2);border-color:rgba(139,92,246,.3)}
.gl-marquee{overflow:hidden;padding:18px 0;border-top:1px solid rgba(255,255,255,.06);border-bottom:1px solid rgba(255,255,255,.06)}
.gl-marquee .track{display:flex;animation:glmq 20s linear infinite;width:max-content}
.gl-marquee .item{font-size:32px;font-weight:700;letter-spacing:-1px;white-space:nowrap;padding:0 16px;background:linear-gradient(135deg,rgba(255,255,255,.08),rgba(255,255,255,.02));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.gl-marquee .item::after{content:'·';margin-left:16px;-webkit-text-fill-color:rgba(139,92,246,.3)}
@keyframes glmq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.gl-banner{margin:0 36px;border-radius:24px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;min-height:400px;background:rgba(255,255,255,.03);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.08)}
.gl-banner-text{padding:52px 44px;display:flex;flex-direction:column;justify-content:center}
.gl-banner-text .label{font-size:11px;color:#c4b5fd;letter-spacing:2px;text-transform:uppercase;margin-bottom:14px;font-weight:600}
.gl-banner-text h3{font-size:clamp(28px,4vw,44px);font-weight:700;letter-spacing:-1.5px;line-height:1.05;margin-bottom:14px}
.gl-banner-text h3 .grad{background:linear-gradient(135deg,#c4b5fd,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.gl-banner-text p{font-size:14px;color:rgba(255,255,255,.4);line-height:1.7;margin-bottom:24px;max-width:380px}
.gl-banner-img{overflow:hidden;position:relative}
.gl-banner-img img{width:100%;height:100%;object-fit:cover;opacity:.7}
.gl-banner-img::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(139,92,246,.2),rgba(56,189,248,.15))}
.gl-cats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:0 36px 48px}
.gl-cat{border-radius:20px;overflow:hidden;position:relative;aspect-ratio:3/4;cursor:pointer;transition:all .4s;border:1px solid rgba(255,255,255,.06);background:none;color:inherit;width:100%}
.gl-cat:hover{border-color:rgba(139,92,246,.3);transform:translateY(-4px);box-shadow:0 12px 40px rgba(139,92,246,.1)}
.gl-cat img{width:100%;height:100%;object-fit:cover;opacity:.5;transition:all .5s}
.gl-cat:hover img{opacity:.65;transform:scale(1.05)}
.gl-cat-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(12,10,26,.95),transparent 70%);display:flex;align-items:flex-end;padding:28px}
.gl-cat-ov .inner{display:flex;flex-direction:column;gap:4px}
.gl-cat-ov h3{font-size:24px;font-weight:700;letter-spacing:-.5px}
.gl-cat-ov span{font-size:11px;color:rgba(255,255,255,.3);letter-spacing:1px;font-weight:500}
.gl-bigquote{padding:72px 36px;text-align:center}
.gl-bigquote .glass-card{max-width:800px;margin:0 auto;padding:48px;border-radius:24px;background:rgba(255,255,255,.04);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.08)}
.gl-bigquote h2{font-size:clamp(26px,5vw,48px);font-weight:700;letter-spacing:-1.5px;line-height:1.1;margin-bottom:16px;background:linear-gradient(135deg,#f0eef6,#c4b5fd,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.gl-bigquote p{font-size:12px;color:rgba(255,255,255,.25);letter-spacing:2px;text-transform:uppercase}
.gl-nl{margin:0 36px 48px;border-radius:24px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;background:linear-gradient(135deg,rgba(139,92,246,.15),rgba(56,189,248,.1));border:1px solid rgba(255,255,255,.08)}
.gl-nl-l{padding:48px 40px;display:flex;flex-direction:column;justify-content:center}
.gl-nl-l h2{font-size:28px;font-weight:700;letter-spacing:-1px;margin-bottom:8px}
.gl-nl-l h2 .grad{background:linear-gradient(135deg,#c4b5fd,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.gl-nl-l p{font-size:13px;color:rgba(255,255,255,.4);line-height:1.6}
.gl-nl-r{padding:48px 40px;display:flex;flex-direction:column;gap:10px;justify-content:center}
.gl-nl-r label{font-size:11px;color:rgba(255,255,255,.3);letter-spacing:1px;font-weight:500}
.gl-nl-r input{padding:11px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);color:#f0eef6;font-family:'Inter',sans-serif;font-size:13px;outline:none;transition:border-color .25s}
.gl-nl-r input:focus{border-color:rgba(139,92,246,.5)}
.gl-nl-r input::placeholder{color:rgba(255,255,255,.15)}
.gl-footer{padding:48px 36px 20px;border-top:1px solid rgba(255,255,255,.06)}
.gl-ftgrid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:36px;margin-bottom:36px}
.gl-ftbrand .fl{font-size:20px;font-weight:800;letter-spacing:-1px;margin-bottom:10px;background:linear-gradient(135deg,#c4b5fd,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.gl-ftbrand p{font-size:12px;color:rgba(255,255,255,.25);line-height:1.7;max-width:250px}
.gl-ftcol h5{font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#c4b5fd;margin-bottom:12px}
.gl-ftcol a{display:block;color:rgba(255,255,255,.3);font-size:12px;margin-bottom:7px;cursor:pointer;transition:color .2s;text-decoration:none}
.gl-ftcol a:hover{color:#f0eef6}
.gl-ftbot{border-top:1px solid rgba(255,255,255,.06);padding-top:18px;display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,.15)}
.gl-ftbot .sc{display:flex;gap:14px}
.gl-ftbot .sc a{color:rgba(255,255,255,.15);cursor:pointer;transition:color .2s;text-decoration:none;letter-spacing:1px}
.gl-ftbot .sc a:hover{color:#c4b5fd}
.gl-fbar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px}
.gl-fbtn{padding:7px 16px;border-radius:100px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);font-family:'Inter',sans-serif;font-size:11px;font-weight:500;color:rgba(255,255,255,.4);cursor:pointer;transition:all .25s}
.gl-fbtn:hover{background:rgba(255,255,255,.08);color:#f0eef6}
.gl-fbtn.a{background:rgba(139,92,246,.2);color:#c4b5fd;border-color:rgba(139,92,246,.3)}
.gl-sbar{display:flex;margin-bottom:20px;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.1)}
.gl-sbar input{flex:1;padding:11px 16px;border:none;background:rgba(255,255,255,.04);color:#f0eef6;font-family:'Inter',sans-serif;font-size:13px;outline:none}
.gl-sbar input::placeholder{color:rgba(255,255,255,.15)}
.gl-sbar button{padding:11px 22px;background:linear-gradient(135deg,#8b5cf6,#6366f1);color:white;border:none;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:opacity .2s}
.gl-sbar button:hover{opacity:.85}
.gl-bc{padding:14px 36px;font-size:12px;color:rgba(255,255,255,.25)}
.gl-bc button{background:none;border:none;color:#c4b5fd;cursor:pointer;font-family:'Inter',sans-serif;font-size:12px}
.gl-bc button:hover{color:#38bdf8}
.gl-detail{max-width:1050px;margin:0 auto;padding:24px 36px 56px;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start}
.gl-detail-img{border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,.08);aspect-ratio:1}
.gl-detail-img img{width:100%;height:100%;object-fit:cover}
.gl-dinfo .brand{font-size:11px;color:rgba(255,255,255,.25);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;font-weight:500}
.gl-dinfo h1{font-size:clamp(26px,3.5vw,38px);font-weight:700;letter-spacing:-1.5px;margin-bottom:14px;line-height:1}
.gl-dinfo .dprice{font-size:26px;font-weight:700;letter-spacing:-1px;margin-bottom:16px;background:linear-gradient(135deg,#c4b5fd,#38bdf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.gl-dinfo .dprice .old{font-size:13px;font-weight:400;text-decoration:line-through;-webkit-text-fill-color:rgba(255,255,255,.3);margin-left:6px}
.gl-dinfo .ddesc{font-size:14px;color:rgba(255,255,255,.4);line-height:1.7;margin-bottom:24px}
.gl-dinfo label{font-size:11px;color:rgba(255,255,255,.25);letter-spacing:1.5px;text-transform:uppercase;display:block;margin-bottom:6px;font-weight:500}
.gl-sizes{display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap}
.gl-sz{padding:8px 16px;border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);font-family:'Inter',sans-serif;font-size:12px;font-weight:500;color:rgba(255,255,255,.5);cursor:pointer;transition:all .2s}
.gl-sz:hover,.gl-sz.sel{background:rgba(139,92,246,.2);color:#c4b5fd;border-color:rgba(139,92,246,.3)}
.gl-colors{display:flex;gap:6px;margin-bottom:18px}
.gl-cl{width:28px;height:28px;border-radius:50%;border:2px solid rgba(255,255,255,.15);cursor:pointer;transition:all .25s}
.gl-cl:hover,.gl-cl.sel{outline:2px solid #c4b5fd;outline-offset:2px;transform:scale(1.1)}
.gl-empty{text-align:center;padding:48px;color:rgba(255,255,255,.25);font-size:14px}
.gl-meta{margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.06);display:flex;gap:20px;font-size:11px;color:rgba(255,255,255,.2);letter-spacing:.5px}
@media(max-width:1024px){.gl-pgrid{grid-template-columns:repeat(2,1fr)}.gl-banner,.gl-nl,.gl-detail{grid-template-columns:1fr}.gl-banner-img{min-height:280px}.gl-nl-l{border-bottom:1px solid rgba(255,255,255,.06)}.gl-cats{grid-template-columns:1fr;gap:12px}.gl-cat{aspect-ratio:16/9}.gl-ftgrid{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.gl-nlinks{display:none}.gl-pgrid{grid-template-columns:1fr}.gl-section{padding:28px 16px}.gl-banner{margin:0 16px;border-radius:16px}.gl-cats{padding:0 16px 32px}.gl-nl{margin:0 16px 32px}.gl-nl-l,.gl-nl-r{padding:28px 20px}.gl-footer{padding:28px 16px 14px}.gl-ftgrid{grid-template-columns:1fr}.gl-ftbot{flex-direction:column;gap:8px}.gl-detail{padding:16px;gap:22px}.gl-bc{padding:12px 16px}.gl-hero{padding:40px 16px;min-height:80vh}}
`

function getBadge(b) {
  if (!b) return ''
  if (b.includes('%')) return 'sale'
  if (b.includes('🔥') || b.includes('Hot')) return 'hot'
  if (b.includes('Last') || b.includes('Limited')) return 'ltd'
  return 'new'
}

export default function Glass() {
  const st = useStore('GLSS.', 1.5)
  const nav = useNavigate()

  useEffect(() => {
    document.body.style.cssText = "background:#0c0a1a;font-family:'Inter',sans-serif;margin:0;overflow-x:hidden;-webkit-font-smoothing:antialiased;"
    return () => { document.body.style.cssText = '' }
  }, [])

  const PCard = ({ p, i }) => (
    <button className="gl-pcard" onClick={() => st.go('product', { id: p.id })} style={{border: 'none', fontFamily: 'inherit', textAlign: 'left'}}>
      <div className="gl-pimg">
        {p.badge && <div className={`gl-pbadge ${getBadge(p.badge)}`}>{p.badge}</div>}
        <img src={p.img} alt={p.name} />
      </div>
      <div className="gl-pbody">
        <p className="gl-pbrand">GLSS. Atelier</p>
        <p className="gl-pname">{p.name}</p>
        <div className="gl-prow">
          <span className="gl-pprice">${p.price}{p.oldPrice && <span className="old">${p.oldPrice}</span>}</span>
          <span className="gl-padd" onClick={e => { e.stopPropagation(); const t = e.currentTarget; t.textContent = '✓ Added'; t.style.background = 'rgba(139,92,246,.3)'; t.style.borderColor = 'rgba(139,92,246,.4)'; setTimeout(() => { t.textContent = 'Add'; t.style.background = ''; t.style.borderColor = '' }, 1200) }}>Add</span>
        </div>
      </div>
    </button>
  )

  const tClass = st.transitioning ? 'gl-tpage out' : 'gl-tpage'

  return (
    <div className="gl">
      <style>{CSS}</style>

      <div className={`gl-loader ${!st.loading ? 'hide' : ''}`}>
        <div className="gl-loader-orb" />
        <div className="gl-loader-name">GLSS.</div>
        <div className="gl-loader-sub">Loading experience...</div>
      </div>
      <div className={`gl-trans ${st.transitioning ? 'active' : ''}`} />

      <button className="gl-back" onClick={() => nav('/')}>← Portfolio</button>

      <nav className="gl-nav">
        <button className="gl-logo" style={{border:'none',background:'none',cursor:'pointer'}} onClick={() => st.go('home')}>GLSS.</button>
        <div className="gl-nlinks">
          <button onClick={() => st.go('shop', { cat: 'All' })} className={st.page === 'shop' ? 'a' : ''}>Collection</button>
          <button onClick={() => st.go('shop', { cat: 'Tops' })}>Women</button>
          <button onClick={() => st.go('shop', { cat: 'Outerwear' })}>Men</button>
          <button onClick={() => st.go('shop', { cat: 'Accessories' })}>Accessories</button>
        </div>
        <div className="gl-nright">
          <button onClick={() => st.go('search')}>Search</button>
          <button>Bag (2)</button>
        </div>
      </nav>

      <div className={tClass}>
      {st.page === 'home' && <>
        <section className="gl-hero">
          <div className="gl-hero-orbs"><div className="orb" /><div className="orb" /><div className="orb" /></div>
          <div className="gl-hero-c">
            <div className="gl-hero-badge">SS26 Collection · Now Live</div>
            <h1>Clarity Through Design</h1>
            <p>Elevated essentials designed with transparency in mind. Clean lines, premium materials, and a commitment to letting the craft speak for itself.</p>
            <div className="gl-hero-btns">
              <button className="gl-btn pri" onClick={() => st.go('shop', { cat: 'All' })}>Explore Collection</button>
              <button className="gl-btn out">Our Story</button>
            </div>
          </div>
        </section>

        <div className="gl-marquee"><div className="track">
          {['Clarity','Design','Craft','Elevated','Essentials','Premium','Clarity','Design','Craft','Elevated','Essentials','Premium'].map((t, i) => <span key={i} className="item">{t}</span>)}
        </div></div>

        <div className="gl-section">
          <div className="gl-sec-head"><h2>New <span className="grad">Arrivals</span></h2><button className="va" onClick={() => st.go('shop', { cat: 'All' })}>View All →</button></div>
          <div className="gl-pgrid">{st.products.slice(0, 8).map((p, i) => <PCard key={p.id} p={p} i={i} />)}</div>
        </div>

        <div className="gl-banner">
          <div className="gl-banner-text">
            <p className="label">The Process</p>
            <h3>Made With <span className="grad">Intention</span></h3>
            <p>Every piece in our collection goes through 12 stages of refinement. From concept to your closet, quality is never compromised.</p>
            <button className="gl-btn pri" style={{ alignSelf: 'flex-start' }} onClick={() => st.go('shop', { cat: 'All' })}>Shop Now</button>
          </div>
          <div className="gl-banner-img"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" alt="" /></div>
        </div>

        <div className="gl-section">
          <div className="gl-sec-head"><h2>Shop by <span className="grad">Category</span></h2></div>
          <div className="gl-cats">
            <button className="gl-cat" onClick={() => st.go('shop', { cat: 'Outerwear' })}>
              <img src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=700&q=80" alt="" />
              <div className="gl-cat-ov"><div className="inner"><h3>Outerwear</h3><span>Premium layers</span></div></div>
            </button>
            <button className="gl-cat" onClick={() => st.go('shop', { cat: 'Tops' })}>
              <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80" alt="" />
              <div className="gl-cat-ov"><div className="inner"><h3>Tops</h3><span>Elevated basics</span></div></div>
            </button>
            <button className="gl-cat" onClick={() => st.go('shop', { cat: 'Accessories' })}>
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80" alt="" />
              <div className="gl-cat-ov"><div className="inner"><h3>Accessories</h3><span>Finishing touches</span></div></div>
            </button>
          </div>
        </div>

        <div className="gl-bigquote">
          <div className="glass-card">
            <h2>"Design is not just what it looks like. Design is how it works."</h2>
            <p>— The GLSS. Philosophy</p>
          </div>
        </div>

        <div className="gl-section">
          <div className="gl-sec-head"><h2>Best <span className="grad">Sellers</span></h2></div>
          <div className="gl-pgrid">{st.products.slice(8, 12).map((p, i) => <PCard key={p.id} p={p} i={i + 8} />)}</div>
        </div>

        <div className="gl-nl">
          <div className="gl-nl-l"><h2>Stay <span className="grad">Updated</span></h2><p>Get first access to new drops, exclusive offers, and 10% off your first order.</p></div>
          <div className="gl-nl-r"><label>Email</label><input placeholder="your@email.com" /><button className="gl-btn pri" style={{ alignSelf: 'flex-start', marginTop: 4 }}>Subscribe</button></div>
        </div>
      </>}

      {st.page === 'shop' && <>
        <div className="gl-bc"><button onClick={() => st.go('home')}>Home</button> / Collection {st.cat !== 'All' ? `/ ${st.cat}` : ''}</div>
        <div className="gl-section">
          <div className="gl-sec-head"><h2>{st.cat === 'All' ? 'All' : st.cat} <span className="grad">Collection</span></h2><span style={{ fontSize: 12, color: 'rgba(255,255,255,.25)' }}>{st.filtered.length} pieces</span></div>
          <div className="gl-sbar"><input value={st.search} onChange={e => st.setSearch(e.target.value)} placeholder="Search collection..." onKeyDown={e => e.key === 'Enter' && st.doSearch()} /><button onClick={st.doSearch}>Search</button></div>
          <div className="gl-fbar">{st.cats.map(c => <button key={c} className={`gl-fbtn ${st.cat === c ? 'a' : ''}`} onClick={() => st.go('shop', { cat: c, q: st.sq })}>{c}</button>)}</div>
          <div className="gl-pgrid">{st.filtered.map((p, i) => <PCard key={p.id} p={p} i={i} />)}</div>
          {st.filtered.length === 0 && <p className="gl-empty">No results found.</p>}
        </div>
      </>}

      {st.page === 'search' && <>
        <div className="gl-section" style={{ paddingTop: 44 }}>
          <div className="gl-sec-head"><h2><span className="grad">Search</span></h2></div>
          <div className="gl-sbar"><input value={st.search} onChange={e => st.setSearch(e.target.value)} placeholder="What are you looking for?" onKeyDown={e => e.key === 'Enter' && st.doSearch()} autoFocus /><button onClick={st.doSearch}>Search</button></div>
          <div className="gl-pgrid">{st.products.slice(0, 8).map((p, i) => <PCard key={p.id} p={p} i={i} />)}</div>
        </div>
      </>}

      {st.page === 'product' && st.product && <>
        <div className="gl-bc"><button onClick={() => st.go('home')}>Home</button> / <button onClick={() => st.go('shop', { cat: st.product.cat })}>{st.product.cat}</button> / {st.product.name}</div>
        <div className="gl-detail">
          <div className="gl-detail-img"><img src={st.product.img} alt={st.product.name} /></div>
          <div className="gl-dinfo">
            <div className="brand">GLSS. Atelier</div>
            <h1>{st.product.name}</h1>
            <div className="dprice">${st.product.price}{st.product.oldPrice && <span className="old">${st.product.oldPrice}</span>}</div>
            <p className="ddesc">{st.product.desc}</p>
            {st.product.sizes.length > 0 && <><label>Size</label><div className="gl-sizes">{st.product.sizes.map(s => <button key={s} className={`gl-sz ${st.selSize === s ? 'sel' : ''}`} onClick={() => st.setSelSize(s)}>{s}</button>)}</div></>}
            {st.product.colors.length > 0 && <><label>Color</label><div className="gl-colors">{st.product.colors.map(c => <button key={c} className={`gl-cl ${st.selColor === c ? 'sel' : ''}`} onClick={() => st.setSelColor(c)} title={c} style={{ background: colorMap[c] || '#999' }} />)}</div></>}
            <button className="gl-btn pri" style={{ width: '100%', textAlign: 'center', marginTop: 8 }}>Add to Bag</button>
            <div className="gl-meta"><span>Free shipping +$200</span><span>30-day returns</span><span>Ethically made</span></div>
          </div>
        </div>
        <div className="gl-section">
          <div className="gl-sec-head"><h2>You May <span className="grad">Like</span></h2></div>
          <div className="gl-pgrid">{st.related.map((p, i) => <PCard key={p.id} p={p} i={i + 10} />)}</div>
        </div>
      </>}
      </div>

      <footer className="gl-footer">
        <div className="gl-ftgrid">
          <div className="gl-ftbrand"><div className="fl">GLSS.</div><p>Clarity through design. Premium essentials crafted with intention and transparency. Every detail, considered.</p></div>
          <div className="gl-ftcol"><h5>Shop</h5><a onClick={() => st.go('shop', { cat: 'All' })}>All</a><a onClick={() => st.go('shop', { cat: 'Tops' })}>Women</a><a onClick={() => st.go('shop', { cat: 'Outerwear' })}>Men</a><a onClick={() => st.go('shop', { cat: 'Accessories' })}>Accessories</a></div>
          <div className="gl-ftcol"><h5>Brand</h5><a>About</a><a>Process</a><a>Sustainability</a><a>Journal</a></div>
          <div className="gl-ftcol"><h5>Help</h5><a>Contact</a><a>Shipping</a><a>Returns</a><a>FAQ</a></div>
        </div>
        <div className="gl-ftbot"><span>© 2026 GLSS. All rights reserved.</span><div className="sc"><a>IG</a><a>TW</a><a>PT</a></div></div>
      </footer>
    </div>
  )
}
