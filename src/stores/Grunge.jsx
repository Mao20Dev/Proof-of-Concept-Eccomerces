import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from './useStore'
import { colorMap } from './data'

const CSS = `
.g{min-height:100vh;background:#F5EFE4;color:#0A0808;font-family:'IBM Plex Mono',monospace;position:relative}
.g::after{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");pointer-events:none;z-index:9998}
.g ::selection{background:#39FF14;color:#0A0808}
.g-back{position:fixed;top:12px;left:12px;z-index:9999;padding:8px 18px;background:rgba(10,8,8,.9);color:#E8541A;font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:3px;text-transform:uppercase;border:2px solid #E8541A;cursor:pointer;transition:all .2s;transform:rotate(-1deg)}

/* LOADER */
.g-loader{position:fixed;inset:0;z-index:10000;background:#E8541A;display:flex;align-items:center;justify-content:center;flex-direction:column;transition:opacity .3s}
.g-loader.hide{opacity:0;pointer-events:none}
.g-loader-title{font-family:'Permanent Marker',cursive;font-size:clamp(60px,16vw,160px);color:#0A0808;transform:rotate(-3deg);text-shadow:4px 4px 0 rgba(0,0,0,.15);line-height:.85;text-align:center}
.g-loader-sub{font-family:'IBM Plex Mono',monospace;font-size:14px;color:rgba(0,0,0,.5);margin-top:16px;transform:rotate(1deg)}

/* TRANSITION */
.g-trans{position:fixed;inset:0;z-index:9990;pointer-events:none;overflow:hidden}
.g-trans-tear{position:absolute;inset:0;background:#0A0808;transform:translateX(-101%);transition:transform .42s cubic-bezier(.77,0,.18,1)}
.g-trans.active .g-trans-tear{transform:translateX(0) rotate(-1deg) scale(1.1)}
.g-tpage{opacity:1;transform:translateY(0);transition:opacity .3s,transform .3s}
.g-tpage.out{opacity:0;transform:translateY(15px) rotate(-0.5deg)}

.g-back:hover{background:#39FF14;color:#0A0808;border-color:#0A0808;transform:rotate(1deg)}
.g-nav{position:sticky;top:0;z-index:1000;background:#0A0808;border-bottom:4px solid #E8541A}
.g-nav-inner{display:flex;align-items:stretch;justify-content:space-between}
.g-logo{font-family:'Permanent Marker',cursive;font-size:34px;color:#E8541A;padding:12px 24px;display:flex;align-items:center;border-right:2px solid #1E1A16;cursor:pointer;transition:all .2s;transform:rotate(-1deg);background:none;border-top:0;border-bottom:0;border-left:0}
.g-logo:hover{color:#39FF14}
.g-logo .dot{color:#C9A815;font-size:22px;margin-left:2px}
.g-links{display:flex;align-items:stretch;flex:1}
.g-links button{display:flex;align-items:center;padding:0 18px;font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:3px;text-transform:uppercase;color:#D4C8B8;border:none;border-right:1px solid #1E1A16;background:none;cursor:pointer;transition:all .15s}
.g-links button:hover,.g-links button.a{background:#E8541A;color:#0A0808}
.g-links .sl{color:#3D342C;margin-right:6px;font-family:'IBM Plex Mono',monospace;font-size:9px}
.g-right{display:flex;align-items:stretch;border-left:2px solid #1E1A16}
.g-right button{display:flex;align-items:center;padding:0 18px;font-family:'Bebas Neue',sans-serif;font-size:14px;letter-spacing:2px;text-transform:uppercase;color:#D4C8B8;border:none;border-right:1px solid #1E1A16;background:none;cursor:pointer;transition:all .15s}
.g-right button:hover{background:#E8541A;color:#0A0808}
.g-hero{min-height:92vh;background:#E8541A;position:relative;overflow:hidden;display:grid;grid-template-columns:1.1fr .9fr;border-bottom:4px solid #0A0808}
.g-hero-left{padding:56px 48px;display:flex;flex-direction:column;justify-content:space-between;position:relative;z-index:2}
.g-hero-meta{font-family:'Special Elite',cursive;font-size:12px;color:rgba(0,0,0,.45);transform:rotate(-.5deg)}
.g-hero h1{font-family:'Permanent Marker',cursive;font-size:clamp(52px,8vw,110px);line-height:.9;color:#0A0808;transform:rotate(-2deg);text-shadow:3px 3px 0 rgba(0,0,0,.1)}
.g-hero h1 .scrawl{font-family:'Abril Fatface',serif;font-style:italic;display:inline-block;transform:rotate(3deg);color:#1E1A16}
.g-hero h1 .strike{text-decoration:line-through;text-decoration-color:#39FF14;text-decoration-thickness:5px}
.g-hero h1 .green{color:#39FF14;text-shadow:2px 2px 8px rgba(57,255,20,.3)}
.g-hero-sticker{display:inline-block;background:#C9A815;color:#0A0808;font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:3px;padding:7px 18px;transform:rotate(4deg);border:2px solid #0A0808;margin-top:20px;width:fit-content;box-shadow:3px 3px 0 rgba(0,0,0,.2)}
.g-hero-desc{font-family:'Special Elite',cursive;font-size:14px;color:rgba(0,0,0,.55);max-width:370px;line-height:1.8;margin-top:24px;transform:rotate(.5deg)}
.g-hero-btns{display:flex;gap:14px;flex-wrap:wrap;margin-top:auto;padding-top:24px}
.g-btn{display:inline-block;padding:14px 36px;background:#0A0808;color:#E8541A;font-family:'Bebas Neue',sans-serif;font-size:17px;letter-spacing:4px;text-transform:uppercase;border:3px solid #0A0808;cursor:pointer;transform:rotate(-1deg);transition:all .2s}
.g-btn:hover{background:#39FF14;color:#0A0808;transform:rotate(1deg) scale(1.03)}
.g-btn-ghost{display:inline-block;padding:14px 36px;background:transparent;color:#0A0808;font-family:'Bebas Neue',sans-serif;font-size:17px;letter-spacing:4px;text-transform:uppercase;border:3px solid #0A0808;cursor:pointer;transform:rotate(1deg);transition:all .2s}
.g-btn-ghost:hover{background:#0A0808;color:#E8541A;transform:rotate(-1deg)}
.g-hero-right{position:relative;overflow:hidden;border-left:4px solid #0A0808}
.g-hero-right img{width:100%;height:100%;object-fit:cover;filter:grayscale(60%) contrast(1.3) saturate(.7);mix-blend-mode:multiply}
.g-hero-bigtext{position:absolute;font-family:'Permanent Marker',cursive;color:#F0E8DA;font-size:clamp(60px,10vw,130px);bottom:-10px;left:-10px;line-height:.85;text-transform:uppercase;mix-blend-mode:difference;pointer-events:none;transform:rotate(-3deg)}
.g-hero-torn{position:absolute;bottom:-2px;left:0;right:0;height:40px;background:#F5EFE4;clip-path:polygon(0% 60%,3% 45%,6% 70%,9% 30%,12% 55%,15% 20%,18% 65%,21% 35%,24% 75%,27% 25%,30% 60%,33% 40%,36% 80%,39% 20%,42% 50%,45% 30%,48% 70%,51% 15%,54% 55%,57% 35%,60% 65%,63% 25%,66% 70%,69% 40%,72% 80%,75% 20%,78% 55%,81% 35%,84% 75%,87% 15%,90% 50%,93% 30%,96% 65%,100% 45%,100% 100%,0% 100%);z-index:10}
.g-marquee{padding:18px 0;overflow:hidden;background:#0A0808;border-bottom:3px solid #39FF14}
.g-marquee-track{display:flex;gap:36px;animation:gMarq 18s linear infinite;width:max-content}
.g-marquee-item{font-family:'Permanent Marker',cursive;font-size:20px;color:#39FF14;text-transform:uppercase;white-space:nowrap;display:flex;align-items:center;gap:36px;text-shadow:0 0 10px rgba(57,255,20,.3)}
.g-marquee-item::after{content:'✕';color:#E8541A;font-size:13px}
@keyframes gMarq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.g-sec-head{padding:44px 40px 20px;position:relative}
.g-sec-head h2{font-family:'Permanent Marker',cursive;font-size:clamp(32px,5vw,56px);transform:rotate(-1.5deg);display:inline-block;position:relative}
.g-sec-head h2 .uline{position:absolute;bottom:-4px;left:-4px;right:-4px;height:8px;background:#E8541A;transform:rotate(.5deg);z-index:-1}
.g-sec-head .sub{font-family:'Special Elite',cursive;font-size:12px;color:#A89880;margin-top:8px;transform:rotate(.3deg)}
.g-products{padding:0 40px 48px}
.g-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.g-card{cursor:pointer;position:relative;transition:transform .3s;background:none;border:none;text-align:left;color:inherit;width:100%}
.g-card:nth-child(odd){transform:rotate(-1deg)}.g-card:nth-child(even){transform:rotate(.8deg)}
.g-card:hover{transform:rotate(0) scale(1.03)!important;z-index:10}
.g-card-img{position:relative;overflow:hidden;aspect-ratio:3/4;border:3px solid #0A0808;background:#E8DDD0}
.g-card-img img{width:100%;height:100%;object-fit:cover;filter:grayscale(40%) contrast(1.2) saturate(.8);transition:all .4s}
.g-card:hover .g-card-img img{filter:grayscale(0%) contrast(1.1) saturate(1.2);transform:scale(1.06)}
.g-card-img::before{content:'';position:absolute;top:-2px;left:0;right:0;height:12px;background:#F5EFE4;clip-path:polygon(0% 100%,5% 40%,10% 80%,15% 20%,20% 70%,25% 30%,30% 90%,35% 10%,40% 60%,45% 30%,50% 80%,55% 20%,60% 70%,65% 40%,70% 90%,75% 10%,80% 50%,85% 25%,90% 75%,95% 15%,100% 60%,100% 0%,0% 0%);z-index:3}
.g-card-tape{position:absolute;top:-8px;width:55px;height:20px;background:rgba(200,180,140,.5);z-index:5}
.g-card-badge{position:absolute;top:18px;right:-6px;font-family:'Permanent Marker',cursive;font-size:12px;padding:3px 12px;transform:rotate(3deg);z-index:5;box-shadow:2px 2px 0 rgba(0,0,0,.3)}
.g-card-badge.new{background:#39FF14;color:#0A0808}
.g-card-badge.sale{background:#D41920;color:#F0E8DA}
.g-card-badge.hot{background:#C9A815;color:#0A0808}
.g-card-badge.ltd{background:#E8541A;color:#0A0808}
.g-card-info{padding:12px 4px 0}
.g-card-brand{font-family:'Special Elite',cursive;font-size:10px;color:#A89880;text-transform:uppercase;letter-spacing:1px;margin-bottom:2px}
.g-card-name{font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;line-height:1.1}
.g-card-bottom{display:flex;justify-content:space-between;align-items:center}
.g-card-price{font-family:'Permanent Marker',cursive;font-size:20px;color:#C73E0D}
.g-card-price .old{font-family:'IBM Plex Mono',monospace;font-size:11px;text-decoration:line-through;color:#A89880;margin-left:6px}
.g-add{font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding:7px 16px;border:2px solid #0A0808;background:none;cursor:pointer;transition:all .15s;transform:rotate(1deg)}
.g-add:hover{background:#39FF14;transform:rotate(-1deg)}
.g-cats{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;padding:0 40px 48px}
.g-cat{cursor:pointer;position:relative;overflow:hidden;aspect-ratio:3/4;border:3px solid #0A0808;transition:transform .3s;background:none;width:100%}
.g-cat:nth-child(1){transform:rotate(-1.5deg)}.g-cat:nth-child(2){transform:rotate(1deg)}.g-cat:nth-child(3){transform:rotate(-.5deg)}
.g-cat:hover{transform:rotate(0) scale(1.02)!important;z-index:5}
.g-cat img{width:100%;height:100%;object-fit:cover;filter:grayscale(50%) contrast(1.3);transition:all .5s}
.g-cat:hover img{filter:grayscale(20%) contrast(1.2);transform:scale(1.05)}
.g-cat-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(10,8,8,.9),transparent 50%);display:flex;flex-direction:column;justify-content:flex-end;padding:24px}
.g-cat-ov h3{font-family:'Permanent Marker',cursive;font-size:32px;color:#F0E8DA;transform:rotate(-2deg);text-shadow:2px 2px 0 rgba(0,0,0,.5)}
.g-cat-ov span{font-family:'Special Elite',cursive;font-size:11px;color:#39FF14;text-transform:uppercase;letter-spacing:2px;margin-top:4px}
.g-cat-sticker{position:absolute;top:14px;right:14px;font-family:'Bebas Neue',sans-serif;font-size:11px;letter-spacing:3px;background:#E8541A;color:#0A0808;padding:5px 14px;transform:rotate(5deg);border:2px solid #0A0808}
.g-editorial{padding:70px 40px;text-align:center;position:relative;overflow:hidden;background:#E8DDD0;border-top:4px solid #0A0808;border-bottom:4px solid #0A0808}
.g-editorial .big{font-family:'Permanent Marker',cursive;font-size:clamp(40px,8vw,100px);line-height:.9;transform:rotate(-1deg);display:inline-block}
.g-editorial .orange{color:#E8541A}.g-editorial .green{color:#39FF14;text-shadow:0 0 20px rgba(57,255,20,.3)}
.g-editorial .struck{text-decoration:line-through;text-decoration-color:#D41920;text-decoration-thickness:5px;color:#A89880}
.g-editorial .tape{position:absolute;width:80px;height:22px;background:rgba(200,180,140,.4)}
.g-editorial .tape-tl{top:18px;left:28px;transform:rotate(-15deg)}.g-editorial .tape-br{bottom:18px;right:28px;transform:rotate(20deg)}
.g-editorial .credit{font-family:'Special Elite',cursive;font-size:11px;color:#A89880;margin-top:24px;transform:rotate(.8deg)}
.g-collage{position:relative;min-height:450px;background:#E8541A;border-top:4px solid #0A0808;border-bottom:4px solid #0A0808;display:grid;grid-template-columns:1fr 1fr}
.g-collage-text{padding:56px 48px;display:flex;flex-direction:column;justify-content:center;position:relative;z-index:2}
.g-collage-text .stamp{font-family:'Special Elite',cursive;font-size:11px;color:rgba(0,0,0,.4);text-transform:uppercase;letter-spacing:3px;margin-bottom:14px}
.g-collage-text h2{font-family:'Permanent Marker',cursive;font-size:clamp(36px,5vw,64px);line-height:.9;color:#0A0808;transform:rotate(-2deg);text-shadow:3px 3px 0 rgba(0,0,0,.1);margin-bottom:16px}
.g-collage-text h2 .green{color:#39FF14;text-shadow:0 0 15px rgba(57,255,20,.4)}
.g-collage-text p{font-family:'Special Elite',cursive;font-size:13px;color:rgba(0,0,0,.5);max-width:350px;line-height:1.8;margin-bottom:24px}
.g-collage-img{position:relative;overflow:hidden;border-left:4px solid #0A0808}
.g-collage-img img{width:100%;height:100%;object-fit:cover;filter:grayscale(50%) contrast(1.3) saturate(.7);mix-blend-mode:multiply}
.g-collage-img .overlay{position:absolute;bottom:16px;right:16px;font-family:'Permanent Marker',cursive;font-size:72px;color:rgba(255,255,255,.1);transform:rotate(-5deg);pointer-events:none}
.g-torn{height:28px;background:#0A0808;position:relative}
.g-torn::after{content:'';position:absolute;bottom:-14px;left:0;right:0;height:18px;background:#0A0808;clip-path:polygon(0% 0%,2% 60%,5% 20%,8% 70%,11% 30%,14% 80%,17% 10%,20% 60%,23% 25%,26% 75%,29% 15%,32% 55%,35% 35%,38% 80%,41% 20%,44% 65%,47% 10%,50% 50%,53% 30%,56% 75%,59% 15%,62% 60%,65% 25%,68% 70%,71% 20%,74% 80%,77% 35%,80% 60%,83% 10%,86% 55%,89% 30%,92% 70%,95% 15%,98% 50%,100% 0%)}
.g-newsletter{display:grid;grid-template-columns:1fr 1fr;border-bottom:4px solid #0A0808}
.g-nl-left{background:#0A0808;padding:56px 44px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden;border-right:4px solid #E8541A}
.g-nl-left .bg-spray{position:absolute;font-family:'Permanent Marker',cursive;font-size:180px;color:#1E1A16;bottom:-35px;right:-15px;transform:rotate(-8deg);line-height:1;pointer-events:none}
.g-nl-left h2{font-family:'Permanent Marker',cursive;font-size:clamp(30px,4vw,48px);color:#39FF14;transform:rotate(-2deg);text-shadow:0 0 15px rgba(57,255,20,.3);line-height:.95;margin-bottom:14px;position:relative;z-index:1}
.g-nl-left p{font-family:'Special Elite',cursive;font-size:12px;color:#A89880;line-height:1.8;max-width:350px;transform:rotate(.3deg);position:relative;z-index:1}
.g-nl-right{background:#E8541A;padding:56px 44px;display:flex;flex-direction:column;justify-content:center;gap:14px}
.g-nl-right label{font-family:'Special Elite',cursive;font-size:10px;color:rgba(0,0,0,.45);text-transform:uppercase}
.g-nl-right input{padding:12px;border:3px solid #0A0808;background:rgba(255,255,255,.15);font-family:'Special Elite',cursive;font-size:14px;color:#0A0808;outline:none;transition:background .2s}
.g-nl-right input::placeholder{color:rgba(0,0,0,.3)}
.g-nl-right input:focus{background:rgba(255,255,255,.4)}
.g-nl-right button{margin-top:6px;padding:14px 32px;border:3px solid #0A0808;background:#0A0808;color:#39FF14;font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:4px;text-transform:uppercase;cursor:pointer;transition:all .2s;transform:rotate(-1deg);align-self:flex-start}
.g-nl-right button:hover{background:#39FF14;color:#0A0808;transform:rotate(1deg)}
.g-footer{background:#0A0808;color:#D4C8B8}
.g-footer-top{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:0;border-bottom:1px solid #1E1A16}
.g-fcol{padding:40px 28px;border-right:1px solid #1E1A16}
.g-fcol:last-child{border-right:none}
.g-fcol .flogo{font-family:'Permanent Marker',cursive;font-size:32px;color:#E8541A;margin-bottom:14px;transform:rotate(-1deg);display:inline-block}
.g-fcol .fdesc{font-family:'Special Elite',cursive;font-size:11px;color:#3D342C;line-height:1.8;max-width:250px}
.g-fcol h5{font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#E8541A;margin-bottom:16px}
.g-fcol a{display:block;text-decoration:none;color:#3D342C;font-family:'Special Elite',cursive;font-size:11px;margin-bottom:8px;cursor:pointer;transition:color .15s}
.g-fcol a:hover{color:#39FF14}
.g-footer-bot{display:flex;justify-content:space-between;align-items:center;padding:16px 28px}
.g-footer-bot p{font-family:'Special Elite',cursive;font-size:10px;color:#1E1A16}
.g-footer-social{display:flex;gap:18px}
.g-footer-social a{font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:2px;color:#3D342C;text-decoration:none;text-transform:uppercase;cursor:pointer;transition:color .15s}
.g-footer-social a:hover{color:#39FF14}
.g-fbar{display:flex;gap:0;flex-wrap:wrap;margin-bottom:24px;border:3px solid #0A0808}
.g-fbtn{padding:10px 18px;border:none;border-right:2px solid #0A0808;background:none;font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#A89880;cursor:pointer;transition:all .15s}
.g-fbtn:hover,.g-fbtn.a{background:#0A0808;color:#39FF14}
.g-sbar{display:flex;margin-bottom:24px;border:3px solid #0A0808}
.g-sbar input{flex:1;padding:10px 14px;border:none;background:rgba(255,255,255,.2);font-family:'Special Elite',cursive;font-size:13px;color:#0A0808;outline:none}
.g-sbar input::placeholder{color:#A89880}
.g-sbar button{padding:10px 20px;background:#0A0808;color:#39FF14;border:none;border-left:2px solid #0A0808;font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .15s}
.g-sbar button:hover{background:#E8541A;color:#0A0808}
.g-bc{padding:14px 40px;font-family:'Special Elite',cursive;font-size:11px;color:#A89880}
.g-bc button{background:none;border:none;color:#E8541A;cursor:pointer;font-family:'Special Elite',cursive;font-size:11px;text-decoration:underline}
.g-detail{max-width:1100px;margin:0 auto;padding:24px 40px 60px;display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:start}
.g-detail-img{border:3px solid #0A0808;position:relative;overflow:hidden}
.g-detail-img img{width:100%;display:block;filter:grayscale(30%) contrast(1.2) saturate(.8)}
.g-detail-img::before{content:'';position:absolute;top:-2px;left:0;right:0;height:12px;background:#F5EFE4;clip-path:polygon(0% 100%,5% 40%,10% 80%,15% 20%,20% 70%,25% 30%,30% 90%,35% 10%,40% 60%,45% 30%,50% 80%,55% 20%,60% 70%,65% 40%,70% 90%,75% 10%,80% 50%,85% 25%,90% 75%,95% 15%,100% 60%,100% 0%,0% 0%);z-index:3}
.g-dinfo .brand{font-family:'Special Elite',cursive;font-size:10px;color:#A89880;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px}
.g-dinfo h1{font-family:'Permanent Marker',cursive;font-size:clamp(28px,4vw,44px);color:#0A0808;transform:rotate(-1deg);margin-bottom:12px}
.g-dinfo .dprice{font-family:'Permanent Marker',cursive;font-size:28px;color:#C73E0D;margin-bottom:16px}
.g-dinfo .dprice .old{font-family:'IBM Plex Mono',monospace;font-size:14px;text-decoration:line-through;color:#A89880;margin-left:10px}
.g-dinfo .ddesc{font-family:'Special Elite',cursive;font-size:14px;color:rgba(10,8,8,.6);line-height:1.8;margin-bottom:24px;transform:rotate(.3deg)}
.g-dinfo label{font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#A89880;display:block;margin-bottom:6px}
.g-sizes,.g-colors{display:flex;gap:0;margin-bottom:16px;border:2px solid #0A0808;flex-wrap:wrap}
.g-sz{padding:8px 14px;border:none;border-right:2px solid #0A0808;background:none;font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:1px;color:#0A0808;cursor:pointer;transition:all .15s}
.g-sz:hover,.g-sz.sel{background:#0A0808;color:#39FF14}
.g-cl{width:28px;height:28px;border:2px solid #0A0808;cursor:pointer;transition:all .2s;border-radius:0}
.g-cl:hover,.g-cl.sel{outline:3px solid #39FF14;outline-offset:2px;transform:scale(1.1)}
.g-empty{text-align:center;padding:48px;font-family:'Special Elite',cursive;color:#A89880}
@media(max-width:1024px){.g-grid{grid-template-columns:repeat(2,1fr)}.g-hero,.g-detail,.g-collage,.g-newsletter{grid-template-columns:1fr}.g-hero-right{min-height:350px;border-left:none;border-top:4px solid #0A0808}.g-cats{grid-template-columns:1fr}.g-cat{aspect-ratio:16/9;transform:rotate(0)!important}.g-collage-img{min-height:300px;border-left:none;border-top:4px solid #0A0808}.g-nl-left{border-right:none;border-bottom:4px solid #E8541A}.g-footer-top{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.g-links{display:none}.g-hero-left{padding:28px 16px}.g-products,.g-cats,.g-sec-head{padding-left:16px;padding-right:16px}.g-grid{grid-template-columns:1fr;gap:20px}.g-card{transform:rotate(0)!important}.g-collage-text{padding:32px 16px}.g-nl-left,.g-nl-right{padding:32px 16px}.g-fcol{padding:28px 16px}.g-footer-top{grid-template-columns:1fr}.g-footer-bot{flex-direction:column;gap:10px}.g-detail{padding:16px;gap:24px}}
`

function getBadgeClass(badge) {
  if (!badge) return ''
  if (badge.includes('%')) return 'sale'
  if (badge.includes('🔥') || badge.includes('Hot')) return 'hot'
  if (badge.includes('Last') || badge.includes('Limited')) return 'ltd'
  return 'new'
}

export default function Grunge() {
  const st = useStore('RVLT.', 1)
  const nav = useNavigate()

  useEffect(() => {
    document.body.style.cssText = "background:#F5EFE4;font-family:'IBM Plex Mono',monospace;margin:0;overflow-x:hidden;"
    return () => { document.body.style.cssText = '' }
  }, [])

  const ProductCard = ({ p, rotate }) => (
    <button className="g-card" onClick={() => st.go('product', { id: p.id })} style={rotate ? { transform: `rotate(${rotate}deg)` } : {}}>
      <div className="g-card-img">
        <div className="g-card-tape" style={{ left: `${12 + Math.random() * 25}px`, transform: `rotate(${(Math.random() * 14 - 7).toFixed(1)}deg)` }} />
        {p.badge && <div className={`g-card-badge ${getBadgeClass(p.badge)}`}>{p.badge}</div>}
        <img src={p.img} alt={p.name} />
      </div>
      <div className="g-card-info">
        <p className="g-card-brand">{st.products[0]?.brand || 'RVLT.'}</p>
        <p className="g-card-name">{p.name}</p>
        <div className="g-card-bottom">
          <span className="g-card-price">${p.price}{p.oldPrice && <span className="old">${p.oldPrice}</span>}</span>
          <span className="g-add" onClick={e => { e.stopPropagation(); e.currentTarget.textContent = '✓ Added'; setTimeout(() => { e.currentTarget.textContent = '+ Add' }, 1500) }}>+ Add</span>
        </div>
      </div>
    </button>
  )

  const tClass = st.transitioning ? 'g-tpage out' : 'g-tpage'

  return (
    <div className="g">
      <style>{CSS}</style>

      <div className={`g-loader ${!st.loading ? 'hide' : ''}`}>
        <div className="g-loader-title">RVLT.</div>
        <div className="g-loader-sub">loading raw content...</div>
      </div>
      <div className={`g-trans ${st.transitioning ? 'active' : ''}`}><div className="g-trans-tear" /></div>

      <button className="g-back" onClick={() => nav('/')}>← Portfolio</button>

      <nav className="g-nav"><div className="g-nav-inner">
        <button className="g-logo" onClick={() => st.go('home')}>RVLT<span className="dot">.</span></button>
        <div className="g-links">
          <button onClick={() => st.go('shop', { cat: 'All' })} className={st.page === 'shop' ? 'a' : ''}><span className="sl">//</span>Drops</button>
          <button onClick={() => st.go('shop', { cat: 'Outerwear' })}><span className="sl">//</span>Outerwear</button>
          <button onClick={() => st.go('shop', { cat: 'Tops' })}><span className="sl">//</span>Tops</button>
          <button onClick={() => st.go('shop', { cat: 'Accessories' })}><span className="sl">//</span>Objetos</button>
          <button onClick={() => st.go('search')}><span className="sl">//</span>Zine</button>
        </div>
        <div className="g-right">
          <button onClick={() => st.go('search')}>Buscar</button>
          <button>Bolsa <span style={{ color: '#39FF14', fontFamily: "'Permanent Marker',cursive", marginLeft: 4 }}>2</span></button>
        </div>
      </div></nav>

      <div className={tClass}>
      {/* HOME */}
      {st.page === 'home' && <>
        <section className="g-hero">
          <div className="g-hero-left">
            <div className="g-hero-meta">Colección N°017 — Primavera/Verano 2026 — Edición Limitada</div>
            <div>
              <h1>Wear<br /><span className="scrawl">The</span><br /><span className="strike">Noise</span><br /><span className="green">Chaos.</span></h1>
              <div className="g-hero-sticker">DROP SS26 — YA DISPONIBLE</div>
              <p className="g-hero-desc">Ropa que no le pide permiso a nadie. Construida con lo que sobró del sistema. Anti-moda para los que nunca encajaron.</p>
            </div>
            <div className="g-hero-btns">
              <button className="g-btn" onClick={() => st.go('shop', { cat: 'All' })}>Entrar →</button>
              <button className="g-btn-ghost">Ver Zine</button>
            </div>
          </div>
          <div className="g-hero-right">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80" alt="Grunge fashion" />
            <div className="g-hero-bigtext">RVLT</div>
          </div>
          <div className="g-hero-torn" />
        </section>

        <div className="g-marquee"><div className="g-marquee-track">
          {['Anti-Moda','Edición Limitada','Hecho a Mano','No Rules','Underground','Destroy & Create','Anti-Moda','Edición Limitada','Hecho a Mano','No Rules','Underground','Destroy & Create'].map((t, i) => <span key={i} className="g-marquee-item">{t}</span>)}
        </div></div>

        <div className="g-sec-head"><h2>Nuevos Drops<span className="uline" /></h2><p className="sub">16 piezas — edición limitada — no se repite</p></div>
        <div className="g-products"><div className="g-grid">{st.products.slice(0, 8).map(p => <ProductCard key={p.id} p={p} />)}</div></div>

        <div className="g-collage">
          <div className="g-collage-text">
            <p className="stamp">Manifiesto / Volumen 001</p>
            <h2>Destroy<br />What Was.<br />Build<br /><span className="green">What's Next.</span></h2>
            <p>No seguimos tendencias, las rompemos. Cada pieza es un manifiesto contra lo predecible. Materiales reciclados, procesos crudos, resultados honestos.</p>
            <button className="g-btn" onClick={() => st.go('shop', { cat: 'All' })}>Leer Manifiesto →</button>
          </div>
          <div className="g-collage-img">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" alt="" />
            <div className="overlay">RVLT</div>
          </div>
        </div>

        <div className="g-torn" />

        <div className="g-sec-head"><h2>Categorías<span className="uline" /></h2><p className="sub">Elige tu ruido</p></div>
        <div className="g-cats">
          <button className="g-cat" onClick={() => st.go('shop', { cat: 'Outerwear' })}><span className="g-cat-sticker">OUTERWEAR</span><img src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=700&q=80" alt="" /><div className="g-cat-ov"><h3>Outerwear</h3><span>8 piezas</span></div></button>
          <button className="g-cat" onClick={() => st.go('shop', { cat: 'Tops' })}><span className="g-cat-sticker">TOPS</span><img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80" alt="" /><div className="g-cat-ov"><h3>Tops</h3><span>6 piezas</span></div></button>
          <button className="g-cat" onClick={() => st.go('shop', { cat: 'Accessories' })}><span className="g-cat-sticker">OBJETOS</span><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80" alt="" /><div className="g-cat-ov"><h3>Objetos</h3><span>6 piezas</span></div></button>
        </div>

        <div className="g-editorial">
          <div className="tape tape-tl" /><div className="tape tape-br" />
          <div className="big">If Everyone<br /><span className="struck">Else</span> Is<br /><span className="orange">Doing It,</span><br /><span className="green">Don't.</span></div>
          <p className="credit">— RVLT. Zine, Vol. 3, Pág. 47</p>
        </div>

        <div className="g-sec-head"><h2>Best Sellers<span className="uline" /></h2><p className="sub">Lo que más ruido hizo esta temporada</p></div>
        <div className="g-products"><div className="g-grid">{st.products.slice(8, 12).map(p => <ProductCard key={p.id} p={p} />)}</div></div>

        <div className="g-newsletter">
          <div className="g-nl-left"><span className="bg-spray">RVLT</span><h2>Únete<br />Al Ruido.</h2><p>Drops exclusivos, contenido del zine, y acceso antes que nadie. Sin spam. Solo caos controlado y un 10% off en tu primera compra.</p></div>
          <div className="g-nl-right"><label>Email *</label><input placeholder="tu@correo.com" /><label>Nombre (o alias)</label><input placeholder="—" /><button>Suscribirse →</button></div>
        </div>
      </>}

      {/* SHOP / CATEGORY */}
      {st.page === 'shop' && <>
        <div className="g-bc"><button onClick={() => st.go('home')}>Home</button> / Drops {st.cat !== 'All' ? `/ ${st.cat}` : ''}</div>
        <div className="g-sec-head"><h2>{st.cat === 'All' ? 'All Drops' : st.cat}<span className="uline" /></h2><p className="sub">{st.filtered.length} piezas disponibles</p></div>
        <div className="g-products">
          <div className="g-sbar"><input value={st.search} onChange={e => st.setSearch(e.target.value)} placeholder="Buscar en la colección..." onKeyDown={e => e.key === 'Enter' && st.doSearch()} /><button onClick={st.doSearch}>Buscar</button></div>
          <div className="g-fbar">{st.cats.map(c => <button key={c} className={`g-fbtn ${st.cat === c ? 'a' : ''}`} onClick={() => st.go('shop', { cat: c, q: st.sq })}>{c}</button>)}</div>
          <div className="g-grid">{st.filtered.map(p => <ProductCard key={p.id} p={p} />)}</div>
          {st.filtered.length === 0 && <p className="g-empty">No se encontraron piezas. Intenta otra búsqueda.</p>}
        </div>
      </>}

      {/* SEARCH */}
      {st.page === 'search' && <>
        <div className="g-sec-head" style={{ paddingTop: 48 }}><h2>Buscar<span className="uline" /></h2><p className="sub">Encuentra tu ruido</p></div>
        <div className="g-products">
          <div className="g-sbar"><input value={st.search} onChange={e => st.setSearch(e.target.value)} placeholder="¿Qué buscas?" onKeyDown={e => e.key === 'Enter' && st.doSearch()} autoFocus /><button onClick={st.doSearch}>Buscar</button></div>
          <div className="g-grid">{st.products.slice(0, 8).map(p => <ProductCard key={p.id} p={p} />)}</div>
        </div>
      </>}

      {/* PRODUCT DETAIL */}
      {st.page === 'product' && st.product && <>
        <div className="g-bc"><button onClick={() => st.go('home')}>Home</button> / <button onClick={() => st.go('shop', { cat: st.product.cat })}>{st.product.cat}</button> / {st.product.name}</div>
        <div className="g-detail">
          <div className="g-detail-img"><img src={st.product.img} alt={st.product.name} /></div>
          <div className="g-dinfo">
            <div className="brand">RVLT. Studio</div>
            <h1>{st.product.name}</h1>
            <div className="dprice">${st.product.price}{st.product.oldPrice && <span className="old">${st.product.oldPrice}</span>}</div>
            <p className="ddesc">{st.product.desc}</p>
            {st.product.sizes.length > 0 && <><label>Talla</label><div className="g-sizes">{st.product.sizes.map(s => <button key={s} className={`g-sz ${st.selSize === s ? 'sel' : ''}`} onClick={() => st.setSelSize(s)}>{s}</button>)}</div></>}
            {st.product.colors.length > 0 && <><label>Color</label><div className="g-colors" style={{ display: 'flex', gap: 6 }}>{st.product.colors.map(c => <button key={c} className={`g-cl ${st.selColor === c ? 'sel' : ''}`} onClick={() => st.setSelColor(c)} title={c} style={{ background: colorMap[c] || '#999' }} />)}</div></>}
            <button className="g-btn" style={{ width: '100%', textAlign: 'center', marginTop: 16 }}>Añadir a la bolsa →</button>
            <div style={{ marginTop: 20, padding: '16px 0', borderTop: '2px dashed #A89880', fontFamily: "'Special Elite',cursive", fontSize: 11, color: '#A89880', lineHeight: 1.8, transform: 'rotate(.3deg)' }}>
              ✕ Envío gratis en pedidos +$200<br />✕ Devoluciones en 30 días<br />✕ Edición limitada — no se repite
            </div>
          </div>
        </div>
        <div className="g-sec-head"><h2>También te puede gustar<span className="uline" /></h2><p className="sub">Más ruido de la misma frecuencia</p></div>
        <div className="g-products"><div className="g-grid">{st.related.map(p => <ProductCard key={p.id} p={p} />)}</div></div>
      </>}

      </div>

      {/* FOOTER */}
      <footer className="g-footer">
        <div className="g-footer-top">
          <div className="g-fcol"><div className="flogo">RVLT.</div><p className="fdesc">Anti-moda para los que nunca encajaron. Ropa construida con ruido, materiales reales y cero pretensiones. Desde 2024.</p></div>
          <div className="g-fcol"><h5>Tienda</h5><a onClick={() => st.go('shop', { cat: 'All' })}>Drops</a><a onClick={() => st.go('shop', { cat: 'Outerwear' })}>Outerwear</a><a onClick={() => st.go('shop', { cat: 'Tops' })}>Tops</a><a onClick={() => st.go('shop', { cat: 'Accessories' })}>Objetos</a></div>
          <div className="g-fcol"><h5>Zine</h5><a>Manifiesto</a><a>Volumen 1</a><a>Volumen 2</a><a>Volumen 3</a></div>
          <div className="g-fcol"><h5>Info</h5><a>Contacto</a><a>Envíos</a><a>Devoluciones</a><a>FAQ</a></div>
        </div>
        <div className="g-footer-bot"><p>© 2026 RVLT. All rights destroyed. Stay loud.</p><div className="g-footer-social"><a>IG</a><a>TK</a><a>YT</a><a>SndCld</a></div></div>
      </footer>
    </div>
  )
}
