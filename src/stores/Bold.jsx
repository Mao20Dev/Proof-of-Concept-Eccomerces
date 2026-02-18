import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from './useStore'
import { colorMap } from './data'

const CSS = `
.bk{min-height:100vh;background:#FFFDF5;color:#0D0D0D;font-family:'Outfit',sans-serif;overflow-x:hidden}
.bk *{box-sizing:border-box}
.bk-back{position:fixed;top:16px;left:16px;z-index:9999;padding:10px 22px;background:#FFD600;color:#0D0D0D;font-family:'Outfit',sans-serif;font-size:13px;font-weight:800;text-transform:uppercase;letter-spacing:1px;border:3px solid #0D0D0D;border-radius:100px;cursor:pointer;box-shadow:4px 4px 0 #0D0D0D;transition:all .2s}
.bk-back:hover{transform:translate(-2px,-2px);box-shadow:6px 6px 0 #0D0D0D;background:#B8FF00}

/* LOADER */
.bk-loader{position:fixed;inset:0;z-index:10000;background:#2B44FF;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;transition:clip-path .7s cubic-bezier(.77,0,.18,1);clip-path:inset(0 0 0 0)}
.bk-loader.hide{clip-path:inset(0 0 100% 0)}
.bk-loader-text{font-size:clamp(60px,15vw,140px);font-weight:900;color:white;letter-spacing:-4px;text-transform:uppercase;animation:bkBounce .6s ease infinite alternate}
.bk-loader-text .dot{color:#FFD600}
@keyframes bkBounce{from{transform:scaleY(1) scaleX(1.02)}to{transform:scaleY(1.1) scaleX(.98)}}
.bk-loader-sub{font-size:14px;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:6px;text-transform:uppercase}
.bk-loader-shapes{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.bk-loader-shapes .s{position:absolute;border-radius:50%;border:3px solid rgba(255,255,255,.15)}
.bk-loader-shapes .s1{width:200px;height:200px;top:-40px;left:10%;animation:bkFloat 3s ease-in-out infinite}
.bk-loader-shapes .s2{width:120px;height:120px;bottom:10%;right:15%;animation:bkFloat 2.5s ease-in-out infinite reverse}
.bk-loader-shapes .s3{width:80px;height:80px;top:30%;right:10%;background:rgba(255,45,138,.3);animation:bkFloat 4s ease-in-out infinite}
@keyframes bkFloat{0%,100%{transform:translate(0,0) rotate(0)}50%{transform:translate(20px,-20px) rotate(10deg)}}

/* TRANSITION - Circle wipe */
.bk-trans{position:fixed;inset:0;z-index:9990;pointer-events:none}
.bk-trans-circle{position:absolute;top:50%;left:50%;width:0;height:0;background:#FF2D8A;border-radius:50%;transform:translate(-50%,-50%);transition:width .45s cubic-bezier(.77,0,.18,1),height .45s cubic-bezier(.77,0,.18,1),opacity .2s;opacity:0}
.bk-trans.active .bk-trans-circle{width:300vmax;height:300vmax;opacity:1}
.bk-tpage{opacity:1;transform:scale(1) translateY(0);transition:opacity .35s,transform .35s;filter:none}
.bk-tpage.out{opacity:0;transform:scale(.96) translateY(10px)}

/* PROMO BAR */
.bk-promo{background:#0D0D0D;padding:10px 0;overflow:hidden}
.bk-promo-track{display:flex;gap:48px;animation:bkPromo 15s linear infinite;width:max-content}
.bk-promo-item{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;white-space:nowrap;color:white;display:flex;align-items:center;gap:48px}
.bk-promo-item .star{color:#B8FF00;font-size:10px}
@keyframes bkPromo{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* NAV */
.bk-nav{position:sticky;top:0;z-index:1000;background:#FFFDF5;padding:14px 40px;display:flex;align-items:center;justify-content:space-between;border-bottom:3px solid #0D0D0D}
.bk-logo{font-size:32px;font-weight:900;letter-spacing:-2px;text-transform:uppercase;cursor:pointer;background:none;border:none;color:#0D0D0D;font-family:'Outfit',sans-serif;padding:0;display:flex;align-items:center}
.bk-logo .dot{color:#FF2D8A;font-size:40px;line-height:0}
.bk-nlinks{display:flex;gap:8px;align-items:center}
.bk-nlinks button{text-decoration:none;color:#0D0D0D;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;padding:9px 20px;border-radius:100px;border:2px solid transparent;transition:all .25s;cursor:pointer;background:none;font-family:'Outfit',sans-serif}
.bk-nlinks button:hover{background:#0D0D0D;color:white}
.bk-nlinks button.a{background:#B8FF00;border-color:#0D0D0D;box-shadow:4px 4px 0 #0D0D0D}
.bk-nright{display:flex;gap:10px;align-items:center}
.bk-nbtn{display:flex;align-items:center;gap:6px;padding:10px 22px;border-radius:100px;border:3px solid #0D0D0D;background:white;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;cursor:pointer;transition:all .25s;color:#0D0D0D}
.bk-nbtn:hover{transform:translate(-2px,-2px);box-shadow:4px 4px 0 #0D0D0D}
.bk-nbtn.cart{background:#FF2D8A;color:white;border-color:#0D0D0D}
.bk-nbtn.cart:hover{background:#2B44FF}
.bk-badge{background:#FFD600;color:#0D0D0D;font-size:11px;font-weight:900;width:22px;height:22px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center}

/* HERO */
.bk-hero{padding:48px 40px 0}
.bk-hero-inner{background:#2B44FF;border-radius:28px;border:3px solid #0D0D0D;box-shadow:8px 8px 0 #0D0D0D;display:grid;grid-template-columns:1fr 1fr;min-height:560px;position:relative;overflow:hidden}
.bk-hero-left{padding:56px 48px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:2}
.bk-hero-sticker{display:inline-flex;align-items:center;gap:8px;background:#FFD600;color:#0D0D0D;padding:8px 20px;border-radius:100px;border:2px solid #0D0D0D;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:1px;width:fit-content;margin-bottom:20px;box-shadow:3px 3px 0 #0D0D0D;animation:bkWiggle 3s ease-in-out infinite}
@keyframes bkWiggle{0%,100%{transform:rotate(-2deg)}50%{transform:rotate(1deg)}}
.bk-hero-title{font-size:clamp(48px,7.5vw,90px);font-weight:900;line-height:.92;color:white;text-transform:uppercase;letter-spacing:-3px;margin-bottom:18px}
.bk-hero-title .stroke{-webkit-text-stroke:3px white;color:transparent}
.bk-hero-title .yellow{color:#FFD600}
.bk-hero-title .pink{color:#FF2D8A}
.bk-hero-desc{font-size:17px;font-weight:500;color:rgba(255,255,255,.75);max-width:380px;line-height:1.6;margin-bottom:32px}
.bk-hero-btns{display:flex;gap:12px;flex-wrap:wrap}
.bk-btn{display:inline-flex;align-items:center;gap:8px;padding:16px 32px;border-radius:100px;border:3px solid #0D0D0D;font-family:'Outfit',sans-serif;font-size:15px;font-weight:800;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:all .25s}
.bk-btn.primary{background:#FFD600;color:#0D0D0D;box-shadow:5px 5px 0 #0D0D0D}
.bk-btn.primary:hover{transform:translate(-3px,-3px);box-shadow:8px 8px 0 #0D0D0D}
.bk-btn.ghost{background:transparent;color:white;border-color:white}
.bk-btn.ghost:hover{background:white;color:#2B44FF}
.bk-hero-right{position:relative;overflow:hidden;display:flex;align-items:flex-end}
.bk-hero-right img{width:100%;height:100%;object-fit:cover;border-left:3px solid #0D0D0D;border-radius:0 25px 25px 0}
.bk-hero-floater{position:absolute;background:#FF2D8A;color:white;width:90px;height:90px;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-direction:column;border:3px solid #0D0D0D;box-shadow:4px 4px 0 #0D0D0D;font-weight:900;text-transform:uppercase;font-size:10px;letter-spacing:1px;top:28px;right:28px;animation:bkSpin 10s linear infinite;z-index:3}
.bk-hero-floater .big{font-size:20px;letter-spacing:-1px}
@keyframes bkSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}

/* TAG MARQUEE */
.bk-marquee{padding:20px 0;overflow:hidden;border-bottom:3px solid #0D0D0D;border-top:3px solid #0D0D0D;margin-top:48px}
.bk-mtrack{display:flex;gap:14px;animation:bkTag 25s linear infinite;width:max-content}
.bk-pill{padding:9px 24px;border-radius:100px;border:2px solid #0D0D0D;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;white-space:nowrap}
.bk-pill:nth-child(5n+1){background:#B8FF00}
.bk-pill:nth-child(5n+2){background:#FF2D8A;color:white}
.bk-pill:nth-child(5n+3){background:#FFD600}
.bk-pill:nth-child(5n+4){background:#00C2FF}
.bk-pill:nth-child(5n+5){background:#FF6B35;color:white}
@keyframes bkTag{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* SECTIONS */
.bk-section{padding:72px 40px}
.bk-sec-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:40px;flex-wrap:wrap;gap:16px}
.bk-sec-title{font-size:clamp(36px,5.5vw,64px);font-weight:900;text-transform:uppercase;letter-spacing:-3px;line-height:.95}
.bk-sec-title .c1{color:#2B44FF}
.bk-sec-title .c2{color:#FF2D8A}
.bk-sec-title .c3{color:#FF6B35}
.bk-sec-title .outline{-webkit-text-stroke:2.5px #0D0D0D;color:transparent}
.bk-va{display:inline-flex;align-items:center;gap:6px;padding:10px 24px;background:#0D0D0D;color:white;border-radius:100px;border:3px solid #0D0D0D;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:all .25s;font-family:'Outfit',sans-serif}
.bk-va:hover{transform:translate(-2px,-2px);box-shadow:4px 4px 0 #0D0D0D}

/* FILTER */
.bk-filter{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:32px}
.bk-ftag{padding:8px 20px;border-radius:100px;border:2px solid #0D0D0D;font-family:'Outfit',sans-serif;font-size:12px;font-weight:700;text-transform:uppercase;cursor:pointer;background:white;color:#0D0D0D;transition:all .2s}
.bk-ftag:hover,.bk-ftag.a{background:#0D0D0D;color:white;box-shadow:3px 3px 0 rgba(0,0,0,.15)}
.bk-ftag.a{background:#2B44FF;color:white;border-color:#0D0D0D}

/* PRODUCT GRID */
.bk-pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.bk-pcard{border-radius:20px;overflow:hidden;background:white;border:3px solid #0D0D0D;box-shadow:5px 5px 0 #0D0D0D;cursor:pointer;transition:all .3s;text-align:left;color:#0D0D0D;font-family:'Outfit',sans-serif;padding:0;width:100%}
.bk-pcard:hover{transform:translate(-4px,-4px);box-shadow:9px 9px 0 #0D0D0D}
.bk-pimg{position:relative;aspect-ratio:3/4;overflow:hidden}
.bk-pimg img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.bk-pcard:hover .bk-pimg img{transform:scale(1.06)}
.bk-ptag{position:absolute;top:12px;left:12px;padding:5px 14px;border-radius:100px;border:2px solid #0D0D0D;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.5px;box-shadow:2px 2px 0 #0D0D0D}
.bk-ptag.New{background:#B8FF00}
.bk-ptag.hot{background:#FF6B35;color:white}
.bk-ptag.sale{background:#FF2D8A;color:white}
.bk-ptag.ltd{background:#6B2FEB;color:white}
.bk-pbody{padding:16px 18px 20px}
.bk-pbrand{font-size:10px;font-weight:700;color:#999;text-transform:uppercase;letter-spacing:2px;margin-bottom:4px}
.bk-pname{font-size:16px;font-weight:800;margin-bottom:8px;line-height:1.2;letter-spacing:-.3px}
.bk-pprice{display:flex;justify-content:space-between;align-items:center}
.bk-pprice .cur{font-size:20px;font-weight:900;color:#2B44FF;letter-spacing:-1px}
.bk-pprice .old{font-size:13px;font-weight:500;text-decoration:line-through;color:#aaa;margin-left:6px}
.bk-padd{padding:8px 18px;border-radius:100px;border:2px solid #0D0D0D;background:#FFD600;font-family:'Outfit',sans-serif;font-size:11px;font-weight:800;text-transform:uppercase;cursor:pointer;transition:all .2s;box-shadow:2px 2px 0 #0D0D0D}
.bk-padd:hover{transform:translate(-1px,-1px);box-shadow:3px 3px 0 #0D0D0D}

/* CATEGORIES */
.bk-cats{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.bk-cat{border-radius:20px;overflow:hidden;position:relative;aspect-ratio:4/5;cursor:pointer;border:3px solid #0D0D0D;box-shadow:5px 5px 0 #0D0D0D;transition:all .3s;background:none;color:inherit;width:100%;padding:0;font-family:'Outfit',sans-serif}
.bk-cat:hover{transform:translate(-4px,-4px);box-shadow:9px 9px 0 #0D0D0D}
.bk-cat img{width:100%;height:100%;object-fit:cover;transition:transform .5s}
.bk-cat:hover img{transform:scale(1.06)}
.bk-cat-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.7),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:24px}
.bk-cat-ov h3{font-size:28px;font-weight:900;color:white;text-transform:uppercase;letter-spacing:-1px}
.bk-cat-ov span{font-size:13px;color:rgba(255,255,255,.6);font-weight:600}
.bk-cat-sticker{position:absolute;top:16px;right:16px;background:#FFD600;color:#0D0D0D;padding:6px 16px;border-radius:100px;border:2px solid #0D0D0D;font-size:11px;font-weight:800;text-transform:uppercase;box-shadow:2px 2px 0 #0D0D0D;transform:rotate(3deg)}

/* EDITORIAL */
.bk-editorial{display:grid;grid-template-columns:1fr 1fr;border-radius:28px;border:3px solid #0D0D0D;box-shadow:6px 6px 0 #0D0D0D;overflow:hidden;min-height:450px}
.bk-ed-text{padding:48px 40px;display:flex;flex-direction:column;justify-content:center}
.bk-ed-text .over{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:800;color:#FF2D8A;text-transform:uppercase;letter-spacing:2px;margin-bottom:12px}
.bk-ed-text h3{font-size:clamp(28px,4vw,48px);font-weight:900;line-height:.95;text-transform:uppercase;letter-spacing:-2px;margin-bottom:16px}
.bk-ed-text h3 .yellow{color:#FFD600}
.bk-ed-text p{font-size:15px;color:#555;line-height:1.7;margin-bottom:24px;max-width:380px}
.bk-ed-img{overflow:hidden}
.bk-ed-img img{width:100%;height:100%;object-fit:cover}

/* DETAIL */
.bk-detail{display:grid;grid-template-columns:1fr 1fr;gap:48px;padding:48px 40px}
.bk-detail-img{border-radius:24px;overflow:hidden;border:3px solid #0D0D0D;box-shadow:6px 6px 0 #0D0D0D;aspect-ratio:3/4}
.bk-detail-img img{width:100%;height:100%;object-fit:cover}
.bk-detail-info{padding:32px 0;display:flex;flex-direction:column;justify-content:center}
.bk-detail-crumb{font-size:12px;color:#999;margin-bottom:16px;display:flex;gap:8px;font-weight:600;text-transform:uppercase;letter-spacing:1px}
.bk-detail-name{font-size:clamp(32px,4vw,52px);font-weight:900;text-transform:uppercase;letter-spacing:-2px;line-height:.95;margin-bottom:16px}
.bk-detail-price{font-size:28px;font-weight:900;color:#2B44FF;letter-spacing:-1px;margin-bottom:20px;display:flex;align-items:center;gap:12px}
.bk-detail-price .old{font-size:18px;text-decoration:line-through;color:#aaa;font-weight:500}
.bk-detail-desc{font-size:15px;color:#555;line-height:1.7;margin-bottom:28px;padding-bottom:24px;border-bottom:2px solid #eee}
.bk-opts{display:flex;flex-direction:column;gap:20px;margin-bottom:28px}
.bk-opt-label{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px}
.bk-sizes{display:flex;gap:8px;flex-wrap:wrap}
.bk-sizes button{padding:10px 20px;border-radius:100px;border:2px solid #0D0D0D;background:white;font-family:'Outfit',sans-serif;font-size:13px;font-weight:700;cursor:pointer;transition:all .2s}
.bk-sizes button:hover,.bk-sizes button.sel{background:#0D0D0D;color:white;box-shadow:3px 3px 0 rgba(0,0,0,.15)}
.bk-sizes button.sel{background:#2B44FF;color:white;border-color:#0D0D0D}
.bk-colors{display:flex;gap:8px}
.bk-colors button{width:36px;height:36px;border-radius:50%;border:3px solid transparent;cursor:pointer;transition:all .2s;box-shadow:2px 2px 0 rgba(0,0,0,.1)}
.bk-colors button.sel{border-color:#0D0D0D;transform:scale(1.15)}
.bk-add-btn{padding:18px 40px;border-radius:100px;border:3px solid #0D0D0D;background:#FF2D8A;color:white;font-family:'Outfit',sans-serif;font-size:16px;font-weight:800;text-transform:uppercase;letter-spacing:1px;cursor:pointer;box-shadow:5px 5px 0 #0D0D0D;transition:all .25s;width:fit-content}
.bk-add-btn:hover{transform:translate(-3px,-3px);box-shadow:8px 8px 0 #0D0D0D}

/* RELATED */
.bk-related{padding:64px 40px}
.bk-related h3{font-size:32px;font-weight:900;text-transform:uppercase;letter-spacing:-2px;margin-bottom:32px}

/* SEARCH */
.bk-search{max-width:700px;margin:0 auto;padding:60px 40px}
.bk-search-box{display:flex;gap:12px;margin-bottom:40px}
.bk-search-box input{flex:1;padding:16px 24px;border-radius:100px;border:3px solid #0D0D0D;font-family:'Outfit',sans-serif;font-size:16px;font-weight:600;outline:none;box-shadow:4px 4px 0 #0D0D0D}
.bk-search-box input:focus{border-color:#2B44FF;box-shadow:4px 4px 0 #2B44FF}

/* NEWSLETTER */
.bk-nl{display:grid;grid-template-columns:1fr 1fr;border-radius:28px;border:3px solid #0D0D0D;box-shadow:6px 6px 0 #0D0D0D;overflow:hidden;margin:0 40px 48px}
.bk-nl-l{padding:48px 40px;background:#B8FF00;display:flex;flex-direction:column;justify-content:center}
.bk-nl-l .label{font-size:12px;font-weight:800;color:#0D0D0D;text-transform:uppercase;letter-spacing:3px;margin-bottom:8px;opacity:.6}
.bk-nl-l h3{font-size:clamp(28px,4vw,44px);font-weight:900;text-transform:uppercase;letter-spacing:-2px;line-height:.95;margin-bottom:12px}
.bk-nl-l p{font-size:14px;color:rgba(0,0,0,.6);line-height:1.6}
.bk-nl-r{padding:48px 40px;display:flex;flex-direction:column;gap:12px;justify-content:center;background:#FFFDF5}
.bk-nl-r label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#999}
.bk-nl-r input{padding:12px 20px;border-radius:100px;border:2px solid #0D0D0D;font-family:'Outfit',sans-serif;font-size:14px;outline:none}
.bk-nl-r input:focus{border-color:#2B44FF}
.bk-nl-r button{align-self:flex-start;margin-top:8px}

/* FOOTER */
.bk-footer{background:#0D0D0D;color:white;border-top:3px solid #0D0D0D}
.bk-ftgrid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;padding:48px 40px;gap:40px}
.bk-ftcol .logo{font-size:28px;font-weight:900;letter-spacing:-2px;margin-bottom:8px;display:flex;align-items:center}
.bk-ftcol .logo .dot{color:#FF2D8A}
.bk-ftcol .desc{font-size:12px;color:#555;line-height:1.7}
.bk-ftcol h5{font-size:11px;letter-spacing:3px;color:#FF2D8A;margin-bottom:16px;text-transform:uppercase;font-weight:800}
.bk-ftcol a{display:block;color:#666;font-size:12px;margin-bottom:8px;cursor:pointer;transition:color .2s;text-decoration:none;font-weight:500}
.bk-ftcol a:hover{color:white}
.bk-ftbot{display:flex;justify-content:space-between;padding:20px 40px;border-top:1px solid #222;font-size:11px;color:#444}
.bk-ftbot .sc{display:flex;gap:16px}
.bk-ftbot .sc a{color:#444;cursor:pointer;transition:color .2s;text-decoration:none}
.bk-ftbot .sc a:hover{color:white}

@media(max-width:1024px){
  .bk-hero-inner,.bk-editorial,.bk-nl,.bk-detail{grid-template-columns:1fr}
  .bk-hero-right{min-height:350px;border-left:none;border-top:3px solid #0D0D0D}
  .bk-hero-right img{border-radius:0 0 25px 25px}
  .bk-pgrid{grid-template-columns:repeat(2,1fr)}
  .bk-cats{grid-template-columns:1fr}
  .bk-ftgrid{grid-template-columns:1fr 1fr}
}
@media(max-width:640px){
  .bk-nlinks{display:none}
  .bk-section,.bk-related{padding:40px 16px}
  .bk-pgrid{grid-template-columns:1fr}
  .bk-hero{padding:24px 16px}
  .bk-nl{margin:0 16px 32px;grid-template-columns:1fr}
  .bk-ftgrid{grid-template-columns:1fr;padding:32px 16px}
  .bk-detail{padding:32px 16px;gap:24px}
}
`

const Card = ({ p, st, i }) => (
  <button className="bk-pcard" onClick={() => st.go('product', { id: p.id })}>
    <div className="bk-pimg">
      <img src={p.img} alt={p.name} loading="lazy" />
      {p.badge && <span className={`bk-ptag ${p.badge === 'New' ? 'New' : p.badge.includes('%') ? 'sale' : p.badge.includes('🔥') ? 'hot' : 'ltd'}`}>{p.badge}</span>}
    </div>
    <div className="bk-pbody">
      <div className="bk-pbrand">CHNK.</div>
      <div className="bk-pname">{p.name}</div>
      <div className="bk-pprice">
        <span><span className="cur">${p.price}</span>{p.oldPrice && <span className="old">${p.oldPrice}</span>}</span>
        <button className="bk-padd" onClick={e => e.stopPropagation()}>+ Add</button>
      </div>
    </div>
  </button>
)

const promoItems = ['FREE SHIPPING ON $150+','★','NEW DROPS EVERY FRIDAY','★','BOLD IS THE NEW BLACK','★','EXTRA 15% OFF FIRST ORDER','★']

export default function Bold() {
  const nav = useNavigate()
  const st = useStore('CHNK', 0.85)
  useEffect(() => { document.body.style.background = '#FFFDF5'; return () => { document.body.style.background = '' } }, [])
  const tClass = st.transitioning ? 'bk-tpage out' : 'bk-tpage'

  return (
    <div className="bk">
      <style>{CSS}</style>

      {/* LOADER */}
      <div className={`bk-loader ${!st.loading ? 'hide' : ''}`}>
        <div className="bk-loader-shapes"><div className="s s1" /><div className="s s2" /><div className="s s3" /></div>
        <div className="bk-loader-text">CHNK<span className="dot">.</span></div>
        <div className="bk-loader-sub">Loading the vibes...</div>
      </div>

      {/* TRANSITION */}
      <div className={`bk-trans ${st.transitioning ? 'active' : ''}`}>
        <div className="bk-trans-circle" />
      </div>

      <button className="bk-back" onClick={() => nav('/')}>← Portfolio</button>

      {/* PROMO */}
      <div className="bk-promo">
        <div className="bk-promo-track">
          {[...promoItems, ...promoItems].map((t, i) => <span key={i} className="bk-promo-item">{t === '★' ? <span className="star">★</span> : t}</span>)}
        </div>
      </div>

      {/* NAV */}
      <nav className="bk-nav">
        <button className="bk-logo" onClick={() => st.go('home')}>CHNK<span className="dot">.</span></button>
        <div className="bk-nlinks">
          {st.cats.map(c => <button key={c} className={st.cat === c && st.page === 'shop' ? 'a' : ''} onClick={() => st.go('shop', { cat: c })}>{c}</button>)}
        </div>
        <div className="bk-nright">
          <button className="bk-nbtn" onClick={() => st.go('search')}>Search</button>
          <button className="bk-nbtn cart">Bag <span className="bk-badge">2</span></button>
        </div>
      </nav>

      <div className={tClass}>
        {/* HOME */}
        {st.page === 'home' && <>
          <div className="bk-hero">
            <div className="bk-hero-inner" style={{ background: '#2B44FF' }}>
              <div className="bk-hero-left">
                <div className="bk-hero-sticker">🔥 New Season 2026</div>
                <h1 className="bk-hero-title">GET<br/><span className="yellow">BOLD</span><br/>OR GO<br/><span className="stroke">HOME</span></h1>
                <p className="bk-hero-desc">Fashion that screams, laughs, and refuses to whisper. For those who dress like they mean it.</p>
                <div className="bk-hero-btns">
                  <button className="bk-btn primary" onClick={() => st.go('shop', { cat: 'All' })}>Shop Now →</button>
                  <button className="bk-btn ghost">Watch Film</button>
                </div>
              </div>
              <div className="bk-hero-right">
                <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80" alt="Hero" />
                <div className="bk-hero-floater"><span className="big">NEW</span>DROP</div>
              </div>
            </div>
          </div>

          {/* MARQUEE */}
          <div className="bk-marquee">
            <div className="bk-mtrack">
              {[...Array(2)].flatMap(() => ['Streetwear','Bold','Outerwear','Chunky','Footwear','Fresh','Accessories','Electric','Bags','Iconic']).map((t, i) => <span key={i} className="bk-pill">{t}</span>)}
            </div>
          </div>

          {/* FEATURED */}
          <div className="bk-section">
            <div className="bk-sec-head">
              <h2 className="bk-sec-title"><span className="c1">FRESH</span><br/><span className="outline">DROPS</span></h2>
              <button className="bk-va" onClick={() => st.go('shop', { cat: 'All' })}>View All →</button>
            </div>
            <div className="bk-pgrid">{st.products.slice(0, 8).map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}</div>
          </div>

          {/* CATEGORIES */}
          <div className="bk-section">
            <div className="bk-sec-head"><h2 className="bk-sec-title"><span className="c2">SHOP</span> BY<br/>VIBE</h2></div>
            <div className="bk-cats">
              <button className="bk-cat" onClick={() => st.go('shop', { cat: 'Outerwear' })}><img src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=700&q=80" alt="" /><div className="bk-cat-ov"><h3>Outerwear</h3><span>8 pieces</span></div><span className="bk-cat-sticker">HOT</span></button>
              <button className="bk-cat" onClick={() => st.go('shop', { cat: 'Footwear' })}><img src="https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700&q=80" alt="" /><div className="bk-cat-ov"><h3>Footwear</h3><span>6 pieces</span></div><span className="bk-cat-sticker">NEW</span></button>
              <button className="bk-cat" onClick={() => st.go('shop', { cat: 'Accessories' })}><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80" alt="" /><div className="bk-cat-ov"><h3>Accessories</h3><span>6 pieces</span></div><span className="bk-cat-sticker">BOLD</span></button>
            </div>
          </div>

          {/* EDITORIAL */}
          <div className="bk-section">
            <div className="bk-editorial" style={{ background: '#FF6B35' }}>
              <div className="bk-ed-text" style={{ color: 'white' }}>
                <span className="over" style={{ color: '#FFD600' }}>★ The Journal</span>
                <h3 style={{ color: 'white' }}>WEAR<br/><span className="yellow">LOUD</span><br/>LIVE LOUDER</h3>
                <p style={{ color: 'rgba(255,255,255,.7)' }}>Fashion should be fun. Our SS26 collection is an explosion of color, texture, and unapologetic self-expression.</p>
                <button className="bk-btn primary" onClick={() => st.go('shop', { cat: 'All' })}>Read More</button>
              </div>
              <div className="bk-ed-img"><img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80" alt="" /></div>
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="bk-nl">
            <div className="bk-nl-l">
              <span className="label">Join the club</span>
              <h3>GET FIRST<br/>DIBS</h3>
              <p>Early access, exclusive drops, and 15% off your first order. Be bold, be first.</p>
            </div>
            <div className="bk-nl-r">
              <label>Email</label>
              <input type="email" placeholder="your@email.com" />
              <label>Name</label>
              <input type="text" placeholder="Your name" />
              <button className="bk-btn primary" style={{ fontSize: 13 }}>Subscribe →</button>
            </div>
          </div>
        </>}

        {/* SHOP */}
        {st.page === 'shop' && <div className="bk-section">
          <div className="bk-sec-head"><h2 className="bk-sec-title"><span className="c1">THE</span> <span className="outline">SHOP</span></h2></div>
          <div className="bk-filter">
            {st.cats.map(c => <button key={c} className={`bk-ftag ${st.cat === c ? 'a' : ''}`} onClick={() => st.go('shop', { cat: c })}>{c}</button>)}
          </div>
          <div className="bk-pgrid">{st.filtered.map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}</div>
          {st.filtered.length === 0 && <p style={{ textAlign: 'center', padding: 60, color: '#999', fontWeight: 600 }}>No products found :(</p>}
        </div>}

        {/* PRODUCT */}
        {st.page === 'product' && st.product && <><div className="bk-detail">
          <div className="bk-detail-img"><img src={st.product.img} alt={st.product.name} /></div>
          <div className="bk-detail-info">
            <div className="bk-detail-crumb"><span style={{ cursor: 'pointer', color: '#2B44FF' }} onClick={() => st.go('home')}>Home</span> / <span style={{ cursor: 'pointer', color: '#2B44FF' }} onClick={() => st.go('shop', { cat: st.product.cat })}>{st.product.cat}</span> / {st.product.name}</div>
            <h1 className="bk-detail-name">{st.product.name}</h1>
            <div className="bk-detail-price">
              <span>${st.product.price}</span>
              {st.product.oldPrice && <span className="old">${st.product.oldPrice}</span>}
            </div>
            <p className="bk-detail-desc">{st.product.desc}</p>
            <div className="bk-opts">
              <div><div className="bk-opt-label">Size</div><div className="bk-sizes">{st.product.sizes.map(s => <button key={s} className={st.selSize === s ? 'sel' : ''} onClick={() => st.setSelSize(s)}>{s}</button>)}</div></div>
              <div><div className="bk-opt-label">Color</div><div className="bk-colors">{st.product.colors.map(c => <button key={c} className={st.selColor === c ? 'sel' : ''} style={{ background: colorMap[c] || '#ddd' }} onClick={() => st.setSelColor(c)} />)}</div></div>
            </div>
            <button className="bk-add-btn">Add to Bag →</button>
          </div>
        </div>
        <div className="bk-related">
          <h3>YOU'LL ALSO <span style={{ color: '#FF2D8A' }}>DIG</span></h3>
          <div className="bk-pgrid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>{st.related.map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}</div>
        </div></>}

        {/* SEARCH */}
        {st.page === 'search' && <div className="bk-search">
          <h2 className="bk-sec-title" style={{ marginBottom: 24 }}><span className="c2">SEARCH</span></h2>
          <div className="bk-search-box">
            <input value={st.search} onChange={e => st.setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && st.doSearch()} placeholder="What are you looking for?" />
            <button className="bk-btn primary" onClick={st.doSearch}>Go!</button>
          </div>
          {st.sq && <div className="bk-pgrid">{st.filtered.map((p, i) => <Card key={p.id} p={p} st={st} i={i} />)}</div>}
        </div>}
      </div>

      {/* FOOTER */}
      <footer className="bk-footer">
        <div className="bk-ftgrid">
          <div className="bk-ftcol"><div className="logo">CHNK<span className="dot">.</span></div><p className="desc">Fashion that screams, laughs, and refuses to whisper. Bold since 2026.</p></div>
          <div className="bk-ftcol"><h5>Shop</h5><a onClick={() => st.go('shop', { cat: 'All' })}>All</a><a onClick={() => st.go('shop', { cat: 'Outerwear' })}>Outerwear</a><a onClick={() => st.go('shop', { cat: 'Footwear' })}>Footwear</a><a onClick={() => st.go('shop', { cat: 'Bags' })}>Bags</a></div>
          <div className="bk-ftcol"><h5>World</h5><a>Journal</a><a>Lookbook</a><a>About</a><a>Stores</a></div>
          <div className="bk-ftcol"><h5>Help</h5><a>Contact</a><a>Shipping</a><a>Returns</a><a>FAQ</a></div>
        </div>
        <div className="bk-ftbot"><span>© 2026 CHNK. All rights reserved. Be bold.</span><div className="sc"><a>IG</a><a>TW</a><a>TK</a></div></div>
      </footer>
    </div>
  )
}
