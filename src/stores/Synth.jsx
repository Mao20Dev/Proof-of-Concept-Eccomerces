import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from './useStore'
import { colorMap } from './data'

const CSS = `
.sy{min-height:100vh;background:#0d0221;color:#f0e6ff;font-family:'Inter',sans-serif;overflow-x:hidden;position:relative}
.sy::after{content:'';position:fixed;bottom:0;left:0;right:0;height:40%;background:linear-gradient(0deg,rgba(13,2,33,.2),transparent);pointer-events:none;z-index:0}
.sy>*{position:relative;z-index:1}
.sy-back{position:fixed;top:12px;left:12px;z-index:9999;padding:7px 18px;background:rgba(13,2,33,.85);border:1px solid rgba(255,0,128,.4);color:#ff0080;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:all .3s;backdrop-filter:blur(8px)}

/* LOADER */
.sy-loader{position:fixed;inset:0;z-index:10000;background:#0D0221;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:16px;transition:opacity .5s}
.sy-loader.hide{opacity:0;pointer-events:none}
.sy-loader-sun{width:80px;height:80px;border-radius:50%;background:linear-gradient(180deg,#FFBE00 0%,#FF0080 100%);filter:blur(2px);box-shadow:0 0 60px rgba(255,0,128,.4),0 0 120px rgba(255,190,0,.2);animation:syPulse 1.5s ease infinite}
@keyframes syPulse{0%,100%{transform:scale(1);box-shadow:0 0 60px rgba(255,0,128,.4)}50%{transform:scale(1.1);box-shadow:0 0 80px rgba(255,0,128,.6),0 0 140px rgba(255,190,0,.3)}}
.sy-loader-name{font-family:'Bebas Neue',sans-serif;font-size:48px;letter-spacing:8px;background:linear-gradient(180deg,#FFBE00,#FF0080);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-shadow:none}
.sy-loader-sub{font-family:'Space Mono',monospace;font-size:10px;color:rgba(0,212,255,.5);letter-spacing:4px}

/* TRANSITION */
.sy-trans{position:fixed;inset:0;z-index:9990;pointer-events:none}
.sy-trans-scanlines{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,0,128,.1) 2px,rgba(255,0,128,.1) 4px);opacity:0;transition:opacity .35s}
.sy-trans.active .sy-trans-scanlines{opacity:1;animation:syScanFlash .42s ease}
@keyframes syScanFlash{0%{opacity:1}20%{opacity:0}40%{opacity:1}60%{opacity:0}80%{opacity:.8}100%{opacity:0}}
.sy-tpage{opacity:1;transition:opacity .3s,transform .3s;transform:translateY(0)}
.sy-tpage.out{opacity:0;transform:translateY(8px)}

.sy-back:hover{background:#ff0080;color:white;box-shadow:0 0 20px rgba(255,0,128,.4)}
.sy-nav{position:sticky;top:0;z-index:1000;background:rgba(13,2,33,.9);backdrop-filter:blur(16px);border-bottom:1px solid rgba(255,0,128,.2);display:flex;align-items:center;padding:0}
.sy-logo{padding:14px 22px;font-family:'Space Mono',monospace;font-size:20px;font-weight:700;letter-spacing:3px;cursor:pointer;border:none;border-right:1px solid rgba(255,0,128,.2);background:none;background:linear-gradient(180deg,#ff0080,#7928ca);-webkit-background-clip:text;-webkit-text-fill-color:transparent;transition:all .3s}
.sy-logo:hover{filter:brightness(1.3)}
.sy-nlinks{display:flex;align-items:center;flex:1;padding:0 8px}
.sy-nlinks button{padding:14px 16px;border:none;background:none;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;cursor:pointer;transition:all .25s;position:relative}
.sy-nlinks button:nth-child(1){color:#ff0080}.sy-nlinks button:nth-child(2){color:#00d4ff}.sy-nlinks button:nth-child(3){color:#ff6b00}.sy-nlinks button:nth-child(4){color:#7928ca}
.sy-nlinks button:hover,.sy-nlinks button.a{text-shadow:0 0 12px currentColor}
.sy-nlinks button::after{content:'';position:absolute;bottom:8px;left:50%;transform:translateX(-50%);width:0;height:2px;background:currentColor;transition:width .25s;box-shadow:0 0 6px currentColor}
.sy-nlinks button:hover::after,.sy-nlinks button.a::after{width:60%}
.sy-nright{display:flex;align-items:center;margin-left:auto}
.sy-nright button{padding:14px 20px;border:none;background:none;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;cursor:pointer;transition:all .25s;color:#f0e6ff}
.sy-nright button:hover{color:#ff0080;text-shadow:0 0 10px rgba(255,0,128,.5)}
.sy-nright button:last-child{background:linear-gradient(135deg,#ff0080,#7928ca);color:white;border-left:1px solid rgba(255,0,128,.2)}
.sy-nright button:last-child:hover{box-shadow:0 0 20px rgba(255,0,128,.3)}
.sy-hero{min-height:92vh;display:flex;align-items:center;position:relative;overflow:hidden;padding:48px}
.sy-hero-grid{position:absolute;bottom:0;left:0;right:0;height:45%;background:linear-gradient(0deg,rgba(255,0,128,.08),transparent);perspective:400px}
.sy-hero-grid::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,0,128,.06) 0,rgba(255,0,128,.06) 1px,transparent 1px,transparent 80px),repeating-linear-gradient(0deg,rgba(255,0,128,.06) 0,rgba(255,0,128,.06) 1px,transparent 1px,transparent 80px);transform:rotateX(55deg);transform-origin:top}
.sy-hero-sun{position:absolute;top:18%;right:12%;width:250px;height:250px;border-radius:50%;background:linear-gradient(180deg,#ff0080,#ff6b00,#ffbe00);opacity:.15;filter:blur(40px)}
.sy-hero-content{position:relative;z-index:5;max-width:700px}
.sy-hero-badge{display:inline-block;padding:5px 16px;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:#ff0080;border:1px solid rgba(255,0,128,.3);margin-bottom:22px}
.sy-hero h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(56px,10vw,140px);line-height:.88;letter-spacing:2px;text-transform:uppercase;margin-bottom:16px}
.sy-hero h1 .chrome{background:linear-gradient(180deg,#fff 0%,#d4d4d4 30%,#fff 50%,#a0a0a0 70%,#fff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 2px 4px rgba(0,0,0,.5));display:block}
.sy-hero h1 .neon{color:#ff0080;text-shadow:0 0 10px rgba(255,0,128,.6),0 0 30px rgba(255,0,128,.3),0 0 60px rgba(255,0,128,.1);-webkit-text-fill-color:#ff0080;display:block}
.sy-hero h1 .cyan{color:#00d4ff;text-shadow:0 0 10px rgba(0,212,255,.6),0 0 30px rgba(0,212,255,.3);-webkit-text-fill-color:#00d4ff;display:block}
.sy-hero-sub{font-size:16px;color:rgba(255,255,255,.4);line-height:1.7;margin-bottom:28px;max-width:480px;font-weight:300}
.sy-hero-btns{display:flex;gap:12px;flex-wrap:wrap}
.sy-btn{padding:12px 28px;font-family:'Space Mono',monospace;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:2px;cursor:pointer;transition:all .3s;border:none}
.sy-btn.pri{background:linear-gradient(135deg,#ff0080,#7928ca);color:white;box-shadow:0 4px 20px rgba(255,0,128,.3)}
.sy-btn.pri:hover{box-shadow:0 6px 30px rgba(255,0,128,.5);transform:translateY(-2px)}
.sy-btn.out{background:transparent;color:#00d4ff;border:1px solid rgba(0,212,255,.3)}
.sy-btn.out:hover{background:rgba(0,212,255,.1);box-shadow:0 0 20px rgba(0,212,255,.15)}
.sy-marquee{overflow:hidden;border-top:1px solid rgba(255,0,128,.15);border-bottom:1px solid rgba(255,0,128,.15)}
.sy-marquee .track{display:flex;animation:symq 18s linear infinite;width:max-content}
.sy-marquee .item{padding:14px 0;font-family:'Bebas Neue',sans-serif;font-size:36px;letter-spacing:4px;text-transform:uppercase;white-space:nowrap;display:flex;align-items:center;gap:8px}
.sy-marquee .item::after{content:'◆';font-size:12px;margin:0 18px;opacity:.4}
.sy-marquee .item:nth-child(6n+1){color:#ff0080}.sy-marquee .item:nth-child(6n+2){color:#00d4ff}.sy-marquee .item:nth-child(6n+3){color:#ff6b00}.sy-marquee .item:nth-child(6n+4){color:#7928ca}.sy-marquee .item:nth-child(6n+5){color:#ffbe00}.sy-marquee .item:nth-child(6n+6){color:#00ff88}
@keyframes symq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.sy-section{padding:48px 36px}
.sy-sec-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;flex-wrap:wrap;gap:12px}
.sy-sec-head h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,4vw,46px);letter-spacing:3px;text-transform:uppercase}
.sy-sec-head h2 .neon{color:#ff0080;text-shadow:0 0 8px rgba(255,0,128,.4)}
.sy-sec-head h2 .cyan{color:#00d4ff;text-shadow:0 0 8px rgba(0,212,255,.4)}
.sy-sec-head .va{padding:8px 20px;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#ff0080;border:1px solid rgba(255,0,128,.3);background:none;cursor:pointer;transition:all .25s}
.sy-sec-head .va:hover{background:rgba(255,0,128,.1);box-shadow:0 0 12px rgba(255,0,128,.2)}
.sy-pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.sy-pcard{cursor:pointer;transition:all .4s;position:relative;overflow:hidden;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.06);padding:0;text-align:left;font-family:'Inter',sans-serif;color:#f0e6ff;width:100%}
.sy-pcard:hover{border-color:rgba(255,0,128,.3);box-shadow:0 0 30px rgba(255,0,128,.08);transform:translateY(-4px)}
.sy-pcard::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#ff0080,#00d4ff,transparent);opacity:0;transition:opacity .3s;z-index:3}
.sy-pcard:hover::before{opacity:1}
.sy-pimg{aspect-ratio:1;overflow:hidden;position:relative}
.sy-pimg img{width:100%;height:100%;object-fit:cover;filter:saturate(.85) contrast(1.05);transition:all .5s}
.sy-pcard:hover .sy-pimg img{filter:saturate(1.1) contrast(1.15);transform:scale(1.05)}
.sy-pimg::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(13,2,33,.7),transparent 50%);pointer-events:none}
.sy-pbadge{position:absolute;top:8px;left:8px;padding:3px 10px;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;z-index:3}
.sy-pbadge.new{background:#ff0080;color:white;box-shadow:0 0 10px rgba(255,0,128,.4)}
.sy-pbadge.sale{background:#7928ca;color:white;box-shadow:0 0 10px rgba(121,40,202,.4)}
.sy-pbadge.hot{background:#ff6b00;color:white;box-shadow:0 0 10px rgba(255,107,0,.4)}
.sy-pbadge.ltd{background:#00d4ff;color:#0d0221;box-shadow:0 0 10px rgba(0,212,255,.4)}
.sy-pbody{padding:14px}
.sy-pbrand{font-family:'Space Mono',monospace;font-size:9px;color:rgba(255,255,255,.2);letter-spacing:2px;text-transform:uppercase;margin-bottom:3px}
.sy-pname{font-size:14px;font-weight:600;letter-spacing:-.3px;margin-bottom:8px;line-height:1.2}
.sy-prow{display:flex;justify-content:space-between;align-items:center}
.sy-pprice{font-family:'Space Mono',monospace;font-size:16px;font-weight:700;letter-spacing:-1px;color:#ff0080;text-shadow:0 0 6px rgba(255,0,128,.3)}
.sy-pprice .old{font-size:10px;font-weight:400;text-decoration:line-through;color:rgba(255,255,255,.25);text-shadow:none;margin-left:4px}
.sy-padd{padding:5px 12px;border:1px solid rgba(255,0,128,.3);background:none;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:all .25s;color:#ff0080}
.sy-padd:hover{background:rgba(255,0,128,.15);box-shadow:0 0 10px rgba(255,0,128,.2)}
.sy-banner{margin:0 36px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;min-height:380px;border:1px solid rgba(255,0,128,.15);position:relative}
.sy-banner::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,0,128,.05),rgba(0,212,255,.05));pointer-events:none;z-index:1}
.sy-banner-text{padding:48px 40px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:2}
.sy-banner-text .label{font-family:'Space Mono',monospace;font-size:10px;color:#00d4ff;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px;text-shadow:0 0 6px rgba(0,212,255,.3)}
.sy-banner-text h3{font-family:'Bebas Neue',sans-serif;font-size:clamp(28px,4vw,48px);letter-spacing:2px;text-transform:uppercase;line-height:.95;margin-bottom:12px}
.sy-banner-text h3 .neon{color:#ff0080;text-shadow:0 0 8px rgba(255,0,128,.4)}
.sy-banner-text p{font-size:14px;color:rgba(255,255,255,.35);line-height:1.7;margin-bottom:22px;max-width:380px}
.sy-banner-img{overflow:hidden;position:relative;border-left:1px solid rgba(255,0,128,.15)}
.sy-banner-img img{width:100%;height:100%;object-fit:cover;filter:saturate(.8) contrast(1.1);opacity:.7}
.sy-banner-img::after{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,0,128,.15),rgba(121,40,202,.1))}
.sy-cats{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;padding:0 36px 48px}
.sy-cat{position:relative;overflow:hidden;aspect-ratio:3/4;cursor:pointer;transition:all .4s;border:1px solid rgba(255,255,255,.06);background:none;color:inherit;width:100%}
.sy-cat:hover{border-color:rgba(255,0,128,.3);box-shadow:0 0 30px rgba(255,0,128,.08)}
.sy-cat img{width:100%;height:100%;object-fit:cover;filter:saturate(.6) contrast(1.1);transition:all .5s}
.sy-cat:hover img{filter:saturate(.9) contrast(1.2);transform:scale(1.05)}
.sy-cat::after{content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(13,2,33,.9),transparent 60%)}
.sy-cat-info{position:absolute;bottom:24px;left:24px;z-index:2}
.sy-cat-info h3{font-family:'Bebas Neue',sans-serif;font-size:28px;letter-spacing:3px;text-transform:uppercase}
.sy-cat:nth-child(1) .sy-cat-info h3{color:#ff0080;text-shadow:0 0 10px rgba(255,0,128,.4)}
.sy-cat:nth-child(2) .sy-cat-info h3{color:#00d4ff;text-shadow:0 0 10px rgba(0,212,255,.4)}
.sy-cat:nth-child(3) .sy-cat-info h3{color:#ffbe00;text-shadow:0 0 10px rgba(255,190,0,.4)}
.sy-cat-info span{font-family:'Space Mono',monospace;font-size:9px;color:rgba(255,255,255,.3);letter-spacing:2px;text-transform:uppercase}
.sy-bigquote{padding:72px 36px;text-align:center;border-top:1px solid rgba(255,0,128,.1);border-bottom:1px solid rgba(255,0,128,.1)}
.sy-bigquote h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(34px,7vw,80px);letter-spacing:4px;text-transform:uppercase;line-height:.92}
.sy-bigquote h2 .chrome{background:linear-gradient(180deg,#fff 0%,#d4d4d4 30%,#fff 50%,#a0a0a0 70%,#fff 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;display:block}
.sy-bigquote h2 .neon{color:#ff0080;text-shadow:0 0 10px rgba(255,0,128,.6),0 0 40px rgba(255,0,128,.2);-webkit-text-fill-color:#ff0080;display:block}
.sy-bigquote .credit{font-family:'Space Mono',monospace;font-size:10px;color:rgba(255,255,255,.2);letter-spacing:3px;text-transform:uppercase;margin-top:18px}
.sy-nl{margin:0 36px 48px;overflow:hidden;display:grid;grid-template-columns:1fr 1fr;border:1px solid rgba(255,0,128,.15);position:relative}
.sy-nl::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,0,128,.06),rgba(0,212,255,.04));pointer-events:none}
.sy-nl-l{padding:44px 36px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:1}
.sy-nl-l h2{font-family:'Bebas Neue',sans-serif;font-size:32px;letter-spacing:3px;text-transform:uppercase;margin-bottom:8px}
.sy-nl-l h2 .neon{color:#ff0080;text-shadow:0 0 8px rgba(255,0,128,.4)}
.sy-nl-l p{font-size:13px;color:rgba(255,255,255,.3);line-height:1.6}
.sy-nl-r{padding:44px 36px;display:flex;flex-direction:column;gap:10px;justify-content:center;position:relative;z-index:1}
.sy-nl-r label{font-family:'Space Mono',monospace;font-size:9px;color:rgba(255,255,255,.2);letter-spacing:2px;text-transform:uppercase}
.sy-nl-r input{padding:10px 14px;border:1px solid rgba(255,0,128,.2);background:rgba(255,255,255,.03);font-family:'Space Mono',monospace;font-size:12px;color:#f0e6ff;outline:none;transition:all .25s}
.sy-nl-r input:focus{border-color:#ff0080;box-shadow:0 0 10px rgba(255,0,128,.15)}
.sy-nl-r input::placeholder{color:rgba(255,255,255,.1)}
.sy-footer{padding:48px 36px 18px;border-top:1px solid rgba(255,0,128,.1)}
.sy-ftgrid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:36px;margin-bottom:36px}
.sy-ftbrand .fl{font-family:'Space Mono',monospace;font-size:18px;font-weight:700;letter-spacing:3px;margin-bottom:10px;background:linear-gradient(135deg,#ff0080,#7928ca);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sy-ftbrand p{font-size:12px;color:rgba(255,255,255,.2);line-height:1.7;max-width:250px}
.sy-ftcol h5{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px}
.sy-ftcol:nth-child(2) h5{color:#ff0080}.sy-ftcol:nth-child(3) h5{color:#00d4ff}.sy-ftcol:nth-child(4) h5{color:#ffbe00}
.sy-ftcol a{display:block;color:rgba(255,255,255,.2);font-size:12px;margin-bottom:7px;cursor:pointer;transition:color .2s;text-decoration:none}
.sy-ftcol a:hover{color:#f0e6ff}
.sy-ftbot{border-top:1px solid rgba(255,0,128,.1);padding-top:16px;display:flex;justify-content:space-between;font-family:'Space Mono',monospace;font-size:10px;color:rgba(255,255,255,.1);letter-spacing:1px}
.sy-ftbot .sc{display:flex;gap:14px}
.sy-ftbot .sc a{color:rgba(255,255,255,.1);cursor:pointer;transition:color .2s;text-decoration:none;letter-spacing:2px;text-transform:uppercase}
.sy-ftbot .sc a:hover{color:#ff0080}
.sy-fbar{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px}
.sy-fbtn{padding:7px 16px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);font-family:'Space Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,.35);cursor:pointer;transition:all .25s}
.sy-fbtn:hover{border-color:rgba(255,0,128,.3);color:#f0e6ff;background:rgba(255,0,128,.08)}
.sy-fbtn.a{background:linear-gradient(135deg,rgba(255,0,128,.2),rgba(121,40,202,.2));color:#ff0080;border-color:rgba(255,0,128,.3)}
.sy-sbar{display:flex;margin-bottom:20px;border:1px solid rgba(255,0,128,.2);overflow:hidden}
.sy-sbar input{flex:1;padding:10px 14px;border:none;background:rgba(255,255,255,.03);font-family:'Space Mono',monospace;font-size:12px;color:#f0e6ff;outline:none}
.sy-sbar input::placeholder{color:rgba(255,255,255,.1)}
.sy-sbar button{padding:10px 22px;background:linear-gradient(135deg,#ff0080,#7928ca);color:white;border:none;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .25s}
.sy-sbar button:hover{filter:brightness(1.2)}
.sy-bc{padding:12px 36px;font-family:'Space Mono',monospace;font-size:11px;color:rgba(255,255,255,.2)}
.sy-bc button{background:none;border:none;color:#ff0080;cursor:pointer;font-family:'Space Mono',monospace;font-size:11px;font-weight:700}
.sy-bc button:hover{text-shadow:0 0 8px rgba(255,0,128,.4)}
.sy-detail{max-width:1050px;margin:0 auto;padding:20px 36px 48px;display:grid;grid-template-columns:1fr 1fr;gap:36px;align-items:start}
.sy-detail-img{overflow:hidden;aspect-ratio:1;border:1px solid rgba(255,0,128,.15);position:relative}
.sy-detail-img img{width:100%;height:100%;object-fit:cover;filter:saturate(.85) contrast(1.05)}
.sy-detail-img::after{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#ff0080,#00d4ff,#ffbe00)}
.sy-dinfo .brand{font-family:'Space Mono',monospace;font-size:10px;color:rgba(255,255,255,.2);letter-spacing:2px;text-transform:uppercase;margin-bottom:8px}
.sy-dinfo h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(26px,4vw,42px);letter-spacing:2px;text-transform:uppercase;margin-bottom:12px;line-height:.95}
.sy-dinfo .dprice{font-family:'Space Mono',monospace;font-size:24px;font-weight:700;letter-spacing:-1px;color:#ff0080;text-shadow:0 0 8px rgba(255,0,128,.3);margin-bottom:16px}
.sy-dinfo .dprice .old{font-size:13px;font-weight:400;text-decoration:line-through;color:rgba(255,255,255,.2);text-shadow:none;margin-left:6px}
.sy-dinfo .ddesc{font-size:14px;color:rgba(255,255,255,.35);line-height:1.7;margin-bottom:22px}
.sy-dinfo label{font-family:'Space Mono',monospace;font-size:10px;color:rgba(255,255,255,.2);letter-spacing:2px;text-transform:uppercase;display:block;margin-bottom:6px}
.sy-sizes{display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap}
.sy-sz{padding:8px 14px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);font-family:'Space Mono',monospace;font-size:11px;font-weight:700;color:rgba(255,255,255,.4);cursor:pointer;transition:all .25s}
.sy-sz:hover,.sy-sz.sel{background:rgba(255,0,128,.15);color:#ff0080;border-color:rgba(255,0,128,.3)}
.sy-colors{display:flex;gap:6px;margin-bottom:18px}
.sy-cl{width:28px;height:28px;border:2px solid rgba(255,255,255,.15);cursor:pointer;transition:all .25s}
.sy-cl:hover,.sy-cl.sel{box-shadow:0 0 10px rgba(255,0,128,.4);outline:2px solid #ff0080;outline-offset:2px;transform:scale(1.1)}
.sy-empty{text-align:center;padding:48px;color:rgba(255,255,255,.2);font-size:13px}
.sy-meta{margin-top:16px;padding-top:14px;border-top:1px solid rgba(255,255,255,.06);display:flex;gap:20px;font-family:'Space Mono',monospace;font-size:10px;color:rgba(255,255,255,.15);letter-spacing:1px;text-transform:uppercase}
@media(max-width:1024px){.sy-pgrid{grid-template-columns:repeat(2,1fr)}.sy-banner,.sy-nl,.sy-detail{grid-template-columns:1fr}.sy-banner-img{border-left:none;border-top:1px solid rgba(255,0,128,.15);min-height:280px}.sy-cats{grid-template-columns:1fr;gap:12px}.sy-cat{aspect-ratio:16/9}.sy-ftgrid{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.sy-nlinks{display:none}.sy-pgrid{grid-template-columns:1fr}.sy-section{padding:28px 16px}.sy-banner{margin:0 16px}.sy-cats{padding:0 16px 28px}.sy-nl{margin:0 16px 28px}.sy-nl-l,.sy-nl-r{padding:28px 18px}.sy-hero{padding:28px 16px;min-height:80vh}.sy-footer{padding:28px 16px 12px}.sy-ftgrid{grid-template-columns:1fr}.sy-ftbot{flex-direction:column;gap:6px}.sy-detail{padding:14px;gap:20px}.sy-bc{padding:10px 16px}.sy-bigquote{padding:44px 16px}}
`

function getBadge(b) {
  if (!b) return ''
  if (b.includes('%')) return 'sale'
  if (b.includes('🔥') || b.includes('Hot')) return 'hot'
  if (b.includes('Last') || b.includes('Limited')) return 'ltd'
  return 'new'
}

export default function Synth() {
  const st = useStore('SNTH.', 1.3)
  const nav = useNavigate()

  useEffect(() => {
    document.body.style.cssText = "background:#0d0221;font-family:'Inter',sans-serif;margin:0;overflow-x:hidden;-webkit-font-smoothing:antialiased;"
    return () => { document.body.style.cssText = '' }
  }, [])

  const PCard = ({ p, i }) => (
    <button className="sy-pcard" onClick={() => st.go('product', { id: p.id })}>
      <div className="sy-pimg">
        {p.badge && <div className={`sy-pbadge ${getBadge(p.badge)}`}>{p.badge}</div>}
        <img src={p.img} alt={p.name} />
      </div>
      <div className="sy-pbody">
        <p className="sy-pbrand">SNTH. Lab</p>
        <p className="sy-pname">{p.name}</p>
        <div className="sy-prow">
          <span className="sy-pprice">${p.price}{p.oldPrice && <span className="old">${p.oldPrice}</span>}</span>
          <span className="sy-padd" onClick={e => { e.stopPropagation(); const t = e.currentTarget; t.textContent = '✓'; t.style.background = 'rgba(255,0,128,.2)'; t.style.color = '#ff0080'; setTimeout(() => { t.textContent = '+ Add'; t.style.background = ''; t.style.color = '' }, 1200) }}>+ Add</span>
        </div>
      </div>
    </button>
  )

  const tClass = st.transitioning ? 'sy-tpage out' : 'sy-tpage'

  return (
    <div className="sy">
      <style>{CSS}</style>

      <div className={`sy-loader ${!st.loading ? 'hide' : ''}`}>
        <div className="sy-loader-sun" />
        <div className="sy-loader-name">SNTH.</div>
        <div className="sy-loader-sub">Booting retro-future...</div>
      </div>
      <div className={`sy-trans ${st.transitioning ? 'active' : ''}`}><div className="sy-trans-scanlines" /></div>

      <button className="sy-back" onClick={() => nav('/')}>← Portfolio</button>

      <nav className="sy-nav">
        <button className="sy-logo" onClick={() => st.go('home')}>SNTH.</button>
        <div className="sy-nlinks">
          <button onClick={() => st.go('shop', { cat: 'All' })} className={st.page === 'shop' ? 'a' : ''}>Drops</button>
          <button onClick={() => st.go('shop', { cat: 'Tops' })}>Apparel</button>
          <button onClick={() => st.go('shop', { cat: 'Footwear' })}>Kicks</button>
          <button onClick={() => st.go('shop', { cat: 'Accessories' })}>Gear</button>
        </div>
        <div className="sy-nright">
          <button onClick={() => st.go('search')}>Search</button>
          <button>Cart (1)</button>
        </div>
      </nav>

      <div className={tClass}>
      {st.page === 'home' && <>
        <section className="sy-hero">
          <div className="sy-hero-grid" />
          <div className="sy-hero-sun" />
          <div className="sy-hero-content">
            <div className="sy-hero-badge">SS26 · Retrowave Collection</div>
            <h1><span className="chrome">Rewind</span><span className="neon">The Future.</span><span className="cyan">Wear It Now.</span></h1>
            <p className="sy-hero-sub">Fashion from a future that never happened. Neon-drenched, chrome-plated essentials for the midnight drive through the digital highway.</p>
            <div className="sy-hero-btns">
              <button className="sy-btn pri" onClick={() => st.go('shop', { cat: 'All' })}>Enter The Grid →</button>
              <button className="sy-btn out">Watch Trailer</button>
            </div>
          </div>
        </section>

        <div className="sy-marquee"><div className="track">
          {['Retrowave','Neon Nights','Chrome','Synthwave','Digital','Future Retro','Retrowave','Neon Nights','Chrome','Synthwave','Digital','Future Retro'].map((t, i) => <span key={i} className="item">{t}</span>)}
        </div></div>

        <div className="sy-section">
          <div className="sy-sec-head"><h2>Latest <span className="neon">Drops</span></h2><button className="va" onClick={() => st.go('shop', { cat: 'All' })}>View All →</button></div>
          <div className="sy-pgrid">{st.products.slice(0, 8).map((p, i) => <PCard key={p.id} p={p} i={i} />)}</div>
        </div>

        <div className="sy-banner">
          <div className="sy-banner-text">
            <p className="label">The Vision</p>
            <h3>Built For The <span className="neon">Night</span></h3>
            <p>Every piece in this collection is designed to glow under neon. Reflective details, phosphorescent threads, and cuts that move with the city.</p>
            <button className="sy-btn pri" style={{ alignSelf: 'flex-start' }} onClick={() => st.go('shop', { cat: 'All' })}>Explore →</button>
          </div>
          <div className="sy-banner-img"><img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" alt="" /></div>
        </div>

        <div className="sy-section">
          <div className="sy-sec-head"><h2>Shop by <span className="cyan">Category</span></h2></div>
          <div className="sy-cats">
            <button className="sy-cat" onClick={() => st.go('shop', { cat: 'Outerwear' })}>
              <img src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=700&q=80" alt="" />
              <div className="sy-cat-info"><h3>Outerwear</h3><span>Night layers</span></div>
            </button>
            <button className="sy-cat" onClick={() => st.go('shop', { cat: 'Tops' })}>
              <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80" alt="" />
              <div className="sy-cat-info"><h3>Apparel</h3><span>Core pieces</span></div>
            </button>
            <button className="sy-cat" onClick={() => st.go('shop', { cat: 'Accessories' })}>
              <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80" alt="" />
              <div className="sy-cat-info"><h3>Gear</h3><span>Tech accessories</span></div>
            </button>
          </div>
        </div>

        <div className="sy-bigquote">
          <h2><span className="chrome">The Future Was</span><span className="neon">Already Here.</span></h2>
          <p className="credit">— SNTH. Archives, 2026</p>
        </div>

        <div className="sy-section">
          <div className="sy-sec-head"><h2>Best <span className="neon">Sellers</span></h2></div>
          <div className="sy-pgrid">{st.products.slice(8, 12).map((p, i) => <PCard key={p.id} p={p} i={i + 8} />)}</div>
        </div>

        <div className="sy-nl">
          <div className="sy-nl-l"><h2>Join The <span className="neon">Grid</span></h2><p>New drops, exclusive access, and transmissions from the neon underground. Plus 10% off your first order.</p></div>
          <div className="sy-nl-r"><label>Email</label><input placeholder="you@email.com" /><label>Handle</label><input placeholder="@" /><button className="sy-btn pri" style={{ alignSelf: 'flex-start', marginTop: 6 }}>Subscribe →</button></div>
        </div>
      </>}

      {st.page === 'shop' && <>
        <div className="sy-bc"><button onClick={() => st.go('home')}>Home</button> / Drops {st.cat !== 'All' ? `/ ${st.cat}` : ''}</div>
        <div className="sy-section">
          <div className="sy-sec-head"><h2>{st.cat === 'All' ? 'All' : st.cat} <span className="neon">Drops</span></h2><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: 'rgba(255,255,255,.2)', letterSpacing: 2 }}>{st.filtered.length} ITEMS</span></div>
          <div className="sy-sbar"><input value={st.search} onChange={e => st.setSearch(e.target.value)} placeholder="Search the grid..." onKeyDown={e => e.key === 'Enter' && st.doSearch()} /><button onClick={st.doSearch}>Search</button></div>
          <div className="sy-fbar">{st.cats.map(c => <button key={c} className={`sy-fbtn ${st.cat === c ? 'a' : ''}`} onClick={() => st.go('shop', { cat: c, q: st.sq })}>{c}</button>)}</div>
          <div className="sy-pgrid">{st.filtered.map((p, i) => <PCard key={p.id} p={p} i={i} />)}</div>
          {st.filtered.length === 0 && <p className="sy-empty">Signal lost. Try a different frequency.</p>}
        </div>
      </>}

      {st.page === 'search' && <>
        <div className="sy-section" style={{ paddingTop: 44 }}>
          <div className="sy-sec-head"><h2><span className="neon">Search</span></h2></div>
          <div className="sy-sbar"><input value={st.search} onChange={e => st.setSearch(e.target.value)} placeholder="Scan the grid..." onKeyDown={e => e.key === 'Enter' && st.doSearch()} autoFocus /><button onClick={st.doSearch}>Search</button></div>
          <div className="sy-pgrid">{st.products.slice(0, 8).map((p, i) => <PCard key={p.id} p={p} i={i} />)}</div>
        </div>
      </>}

      {st.page === 'product' && st.product && <>
        <div className="sy-bc"><button onClick={() => st.go('home')}>Home</button> / <button onClick={() => st.go('shop', { cat: st.product.cat })}>{st.product.cat}</button> / {st.product.name}</div>
        <div className="sy-detail">
          <div className="sy-detail-img"><img src={st.product.img} alt={st.product.name} /></div>
          <div className="sy-dinfo">
            <div className="brand">SNTH. Lab</div>
            <h1>{st.product.name}</h1>
            <div className="dprice">${st.product.price}{st.product.oldPrice && <span className="old">${st.product.oldPrice}</span>}</div>
            <p className="ddesc">{st.product.desc}</p>
            {st.product.sizes.length > 0 && <><label>Size</label><div className="sy-sizes">{st.product.sizes.map(s => <button key={s} className={`sy-sz ${st.selSize === s ? 'sel' : ''}`} onClick={() => st.setSelSize(s)}>{s}</button>)}</div></>}
            {st.product.colors.length > 0 && <><label>Color</label><div className="sy-colors">{st.product.colors.map(c => <button key={c} className={`sy-cl ${st.selColor === c ? 'sel' : ''}`} onClick={() => st.setSelColor(c)} title={c} style={{ background: colorMap[c] || '#999' }} />)}</div></>}
            <button className="sy-btn pri" style={{ width: '100%', textAlign: 'center', marginTop: 8 }}>Add to Cart →</button>
            <div className="sy-meta"><span>Free Ship +$200</span><span>30-Day Returns</span><span>Limited Run</span></div>
          </div>
        </div>
        <div className="sy-section">
          <div className="sy-sec-head"><h2>More From <span className="neon">The Grid</span></h2></div>
          <div className="sy-pgrid">{st.related.map((p, i) => <PCard key={p.id} p={p} i={i + 10} />)}</div>
        </div>
      </>}

      </div>

      <footer className="sy-footer">
        <div className="sy-ftgrid">
          <div className="sy-ftbrand"><div className="fl">SNTH.</div><p>Fashion from a future that never happened. Neon-drenched, chrome-plated essentials for those who live after dark.</p></div>
          <div className="sy-ftcol"><h5>Shop</h5><a onClick={() => st.go('shop', { cat: 'All' })}>All Drops</a><a onClick={() => st.go('shop', { cat: 'Tops' })}>Apparel</a><a onClick={() => st.go('shop', { cat: 'Footwear' })}>Kicks</a><a onClick={() => st.go('shop', { cat: 'Accessories' })}>Gear</a></div>
          <div className="sy-ftcol"><h5>World</h5><a>Archives</a><a>Transmissions</a><a>Lookbook</a><a>Film</a></div>
          <div className="sy-ftcol"><h5>Info</h5><a>Contact</a><a>Shipping</a><a>Returns</a><a>FAQ</a></div>
        </div>
        <div className="sy-ftbot"><span>© 2026 SNTH. All frequencies reserved.</span><div className="sc"><a>IG</a><a>TK</a><a>YT</a><a>DC</a></div></div>
      </footer>
    </div>
  )
}
