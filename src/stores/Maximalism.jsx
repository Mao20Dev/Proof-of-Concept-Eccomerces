import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from './useStore'
import { colorMap } from './data'

const accentColors = ['#0057FF','#FF0066','#E8FF00','#00FF66','#FF6B00','#8B00FF','#00E5FF']
const getAccent = i => accentColors[i % accentColors.length]

const CSS = `
.m{min-height:100vh;background:#0A0A0A;color:#FAFAFA;font-family:'Inter',sans-serif;position:relative}
.m::after{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,.01) 3px,rgba(255,255,255,.01) 4px);pointer-events:none;z-index:9998}
.m ::selection{background:#FF0066;color:white}
.m-back{position:fixed;top:12px;left:12px;z-index:9999;padding:8px 18px;background:rgba(10,10,10,.92);color:#E8FF00;font-family:'Unbounded',sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;border:2px solid #E8FF00;cursor:pointer;transition:all .2s}
.m-back:hover{background:#FF0066;color:#fff;border-color:#FF0066}
.m-nav{position:sticky;top:0;z-index:1000;background:#0A0A0A;border-bottom:3px solid #FAFAFA;display:flex;align-items:stretch}
.m-logo{font-family:'Unbounded',sans-serif;font-size:22px;font-weight:900;padding:13px 22px;border-right:2px solid #FAFAFA;display:flex;align-items:center;gap:3px;letter-spacing:-2px;cursor:pointer;background:none;border-top:0;border-bottom:0;border-left:0;color:#FAFAFA;transition:all .15s}
.m-logo:hover{background:#FF0066}
.m-logo .lam{color:#E8FF00}
.m-nlinks{display:flex;align-items:stretch;flex:1}
.m-nlinks button{display:flex;align-items:center;padding:0 15px;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border:none;border-right:1px solid rgba(255,255,255,.15);background:none;cursor:pointer;transition:all .12s}
.m-nlinks button:nth-child(1){color:#0057FF}.m-nlinks button:nth-child(2){color:#FF0066}.m-nlinks button:nth-child(3){color:#E8FF00}.m-nlinks button:nth-child(4){color:#00FF66}.m-nlinks button:nth-child(5){color:#00E5FF}
.m-nlinks button:hover,.m-nlinks button.a{background:currentColor;color:#0A0A0A}
.m-nright{display:flex;align-items:stretch;border-left:2px solid #FAFAFA}
.m-nright button{display:flex;align-items:center;padding:0 18px;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;color:#FAFAFA;letter-spacing:2px;border:none;border-right:1px solid rgba(255,255,255,.15);background:none;cursor:pointer;transition:all .12s}
.m-nright button:last-child{border-right:none;background:#FF0066}
.m-nright button:hover{background:#E8FF00;color:#0A0A0A}
.m-hero{min-height:100vh;position:relative;overflow:hidden;display:flex;align-items:center;border-bottom:3px solid #FAFAFA}
.m-hero-bg{position:absolute;inset:0}
.m-hero-bg .bl{position:absolute}
.m-hero-bg .bl:nth-child(1){top:0;left:0;width:55%;height:60%;background:#0057FF;clip-path:polygon(0 0,100% 0,80% 100%,0 100%)}
.m-hero-bg .bl:nth-child(2){bottom:0;right:0;width:50%;height:55%;background:#FF0066;clip-path:polygon(20% 0,100% 0,100% 100%,0 100%)}
.m-hero-bg .bl:nth-child(3){top:15%;right:10%;width:35%;height:40%;background:#E8FF00;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%)}
.m-hero-imglay{position:absolute;top:10%;right:5%;width:40%;height:75%;overflow:hidden;mix-blend-mode:luminosity;opacity:.4}
.m-hero-imglay img{width:100%;height:100%;object-fit:cover;filter:contrast(1.6) grayscale(50%)}
.m-hero-content{position:relative;z-index:5;padding:48px;width:100%}
.m-hero-topbar{display:flex;justify-content:space-between;font-family:'Space Mono',monospace;font-size:10px;color:rgba(255,255,255,.5);letter-spacing:2px;margin-bottom:22px}
.m-hero h1{font-family:'Unbounded',sans-serif;font-size:clamp(46px,9vw,125px);font-weight:900;line-height:.85;letter-spacing:-5px;text-transform:uppercase;margin-bottom:18px}
.m-hero h1 .l1{color:#FAFAFA;display:block}
.m-hero h1 .l2{display:block;-webkit-text-stroke:2px #E8FF00;-webkit-text-fill-color:transparent}
.m-hero h1 .l3{color:#FF0066;display:block}
.m-hero .glitch{position:absolute;top:3px;left:3px;font-family:'Unbounded',sans-serif;font-size:clamp(46px,9vw,125px);font-weight:900;line-height:.85;letter-spacing:-5px;text-transform:uppercase;color:#00E5FF;opacity:.2;pointer-events:none;z-index:-1}
.m-hero-sub{font-family:'Instrument Serif',serif;font-size:clamp(18px,3vw,32px);font-style:italic;color:rgba(255,255,255,.6);margin-bottom:24px;max-width:480px;line-height:1.3}
.m-hero-tags{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:28px}
.m-hero-tags span{padding:5px 14px;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border:2px solid}
.m-hero-tags span:nth-child(1){border-color:#0057FF;color:#0057FF}
.m-hero-tags span:nth-child(2){border-color:#FF0066;color:#FF0066}
.m-hero-tags span:nth-child(3){border-color:#E8FF00;color:#E8FF00}
.m-hero-tags span:nth-child(4){border-color:#00FF66;color:#00FF66}
.m-hero-btns{display:flex;gap:10px;flex-wrap:wrap}
.m-btn{padding:14px 32px;font-family:'Unbounded',sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:2px;cursor:pointer;transition:all .15s;border:3px solid}
.m-btn.pri{background:#E8FF00;color:#0A0A0A;border-color:#0A0A0A}
.m-btn.pri:hover{background:#FF0066;color:#FAFAFA;border-color:#FAFAFA}
.m-btn.out{background:transparent;color:#FAFAFA;border-color:#FAFAFA}
.m-btn.out:hover{background:#FAFAFA;color:#0A0A0A}
.m-hero-bignum{position:absolute;bottom:16px;right:36px;font-family:'Unbounded',sans-serif;font-size:clamp(90px,18vw,260px);font-weight:900;color:rgba(255,255,255,.03);line-height:1;letter-spacing:-8px;pointer-events:none}
.m-marquee{border-bottom:3px solid #FAFAFA;overflow:hidden;position:relative}
.m-marquee .track{display:flex;animation:mMarq 18s linear infinite;width:max-content}
.m-marquee .item{padding:13px 0;font-family:'Unbounded',sans-serif;font-size:38px;font-weight:900;text-transform:uppercase;letter-spacing:-2px;white-space:nowrap;display:flex;align-items:center;gap:10px}
.m-marquee .item::after{content:'★';font-size:20px;margin:0 20px}
.m-marquee .item:nth-child(6n+1){color:#0057FF}.m-marquee .item:nth-child(6n+2){color:#FF0066}.m-marquee .item:nth-child(6n+3){color:#E8FF00}.m-marquee .item:nth-child(6n+4){color:#00FF66}.m-marquee .item:nth-child(6n+5){color:#00E5FF}.m-marquee .item:nth-child(6n+6){color:#FF6B00}
@keyframes mMarq{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
.m-products{padding:44px 28px;border-bottom:3px solid #FAFAFA}
.m-sec-head{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:36px;flex-wrap:wrap;gap:14px}
.m-sec-head h2{font-family:'Unbounded',sans-serif;font-size:clamp(26px,4vw,48px);font-weight:900;letter-spacing:-2px;text-transform:uppercase;line-height:.9}
.m-sec-head h2 .c1{color:#0057FF}.m-sec-head h2 .c2{color:#FF0066}
.m-sec-head .vall{padding:9px 22px;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:2px;border:2px solid #FAFAFA;color:#FAFAFA;background:none;cursor:pointer;transition:all .15s}
.m-sec-head .vall:hover{background:#E8FF00;color:#0A0A0A;border-color:#E8FF00}
.m-pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:2px solid #FAFAFA}
.m-pcard{cursor:pointer;border-right:2px solid #FAFAFA;border-bottom:2px solid #FAFAFA;transition:all .2s;position:relative;overflow:hidden;background:none;color:inherit;text-align:left;width:100%}
.m-pcard:nth-child(4n){border-right:none}
.m-pcard::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;z-index:3;transition:height .3s}
.m-pcard:nth-child(6n+1)::before{background:#0057FF}.m-pcard:nth-child(6n+2)::before{background:#FF0066}.m-pcard:nth-child(6n+3)::before{background:#E8FF00}.m-pcard:nth-child(6n+4)::before{background:#00FF66}.m-pcard:nth-child(6n+5)::before{background:#00E5FF}.m-pcard:nth-child(6n+6)::before{background:#FF6B00}
.m-pcard:hover::before{height:100%;opacity:.15}
.m-pcard:hover{z-index:5}
.m-pimg{aspect-ratio:1;overflow:hidden;border-bottom:2px solid #FAFAFA;position:relative}
.m-pimg img{width:100%;height:100%;object-fit:cover;filter:contrast(1.1);transition:all .4s}
.m-pcard:hover .m-pimg img{filter:contrast(1.2) saturate(1.3);transform:scale(1.06)}
.m-pbadge{position:absolute;top:8px;left:8px;padding:3px 10px;font-family:'Space Mono',monospace;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:2px;z-index:3}
.m-pbadge.new{background:#E8FF00;color:#0A0A0A}.m-pbadge.sale{background:#FF0066;color:#fff}.m-pbadge.hot{background:#FF6B00;color:#fff}.m-pbadge.ltd{background:#8B00FF;color:#fff}
.m-pidx{position:absolute;bottom:6px;right:8px;font-family:'Unbounded',sans-serif;font-size:44px;font-weight:900;color:rgba(255,255,255,.06);letter-spacing:-2px;z-index:1}
.m-pbody{padding:14px;position:relative;z-index:2}
.m-pbrand{font-family:'Space Mono',monospace;font-size:8px;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:3px}
.m-pname{font-family:'Unbounded',sans-serif;font-size:13px;font-weight:700;letter-spacing:-.5px;text-transform:uppercase;margin-bottom:7px;line-height:1.1}
.m-prow{display:flex;justify-content:space-between;align-items:center}
.m-pprice{font-family:'Unbounded',sans-serif;font-size:18px;font-weight:900;letter-spacing:-1px}
.m-pprice .old{font-size:11px;font-weight:400;text-decoration:line-through;color:#888;margin-left:4px}
.m-padd{font-family:'Space Mono',monospace;font-size:8px;font-weight:700;text-transform:uppercase;letter-spacing:2px;padding:5px 12px;border:2px solid #FAFAFA;background:none;color:#FAFAFA;cursor:pointer;transition:all .15s}
.m-padd:hover{background:#E8FF00;color:#0A0A0A;border-color:#E8FF00}
.m-split{display:grid;grid-template-columns:1fr 1fr;border-bottom:3px solid #FAFAFA;min-height:420px}
.m-split-text{padding:52px 44px;display:flex;flex-direction:column;justify-content:center;position:relative;overflow:hidden}
.m-split-text.bg-blue{background:#0057FF}.m-split-text.bg-pink{background:#FF0066}
.m-split-text .bgword{position:absolute;font-family:'Unbounded',sans-serif;font-size:clamp(70px,11vw,170px);font-weight:900;color:rgba(0,0,0,.08);letter-spacing:-5px;bottom:-18px;right:-8px;text-transform:uppercase;pointer-events:none;line-height:.8}
.m-split-text .label{font-family:'Space Mono',monospace;font-size:9px;letter-spacing:3px;text-transform:uppercase;color:rgba(0,0,0,.4);margin-bottom:14px}
.m-split-text h3{font-family:'Unbounded',sans-serif;font-size:clamp(26px,4vw,48px);font-weight:900;color:#0A0A0A;letter-spacing:-2px;line-height:.9;text-transform:uppercase;margin-bottom:10px}
.m-split-text p{font-family:'Inter',sans-serif;font-size:14px;color:rgba(0,0,0,.5);line-height:1.7;max-width:360px;margin-bottom:24px}
.m-split-img{overflow:hidden;border-left:3px solid #FAFAFA;position:relative}
.m-split-img img{width:100%;height:100%;object-fit:cover;filter:contrast(1.2) saturate(1.1)}
.m-split-img .ovtxt{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:'Unbounded',sans-serif;font-size:clamp(56px,10vw,110px);font-weight:900;color:rgba(255,255,255,.08);letter-spacing:-4px;text-transform:uppercase;mix-blend-mode:overlay;pointer-events:none}
.m-cats{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:3px solid #FAFAFA}
.m-cat{position:relative;overflow:hidden;border-right:3px solid #FAFAFA;aspect-ratio:3/4;cursor:pointer;transition:all .3s;background:none;color:inherit;width:100%}
.m-cat:last-child{border-right:none}
.m-cat img{width:100%;height:100%;object-fit:cover;filter:grayscale(40%) contrast(1.2);transition:all .5s}
.m-cat:hover img{filter:grayscale(0%) contrast(1.3) saturate(1.3);transform:scale(1.04)}
.m-cat-ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column}
.m-cat-ov::before{content:'';position:absolute;inset:0;background:rgba(10,10,10,.5);transition:background .3s}
.m-cat:hover .m-cat-ov::before{background:rgba(10,10,10,.3)}
.m-cat-ov h3{font-family:'Unbounded',sans-serif;font-size:clamp(32px,5vw,58px);font-weight:900;text-transform:uppercase;letter-spacing:-3px;position:relative;z-index:1;text-align:center}
.m-cat:nth-child(1) .m-cat-ov h3{color:#0057FF}.m-cat:nth-child(2) .m-cat-ov h3{color:#FF0066}.m-cat:nth-child(3) .m-cat-ov h3{color:#E8FF00}
.m-cat-ov span{font-family:'Space Mono',monospace;font-size:9px;color:#888;letter-spacing:3px;text-transform:uppercase;position:relative;z-index:1;margin-top:4px}
.m-bigtext{padding:72px 28px;text-align:center;border-bottom:3px solid #FAFAFA;position:relative;overflow:hidden}
.m-bigtext h2{font-family:'Unbounded',sans-serif;font-size:clamp(34px,8vw,100px);font-weight:900;text-transform:uppercase;letter-spacing:-4px;line-height:.88}
.m-bigtext h2 .w1{color:#0057FF;display:block}.m-bigtext h2 .w2{-webkit-text-stroke:2px #FF0066;-webkit-text-fill-color:transparent;display:block}.m-bigtext h2 .w3{color:#E8FF00;display:block}.m-bigtext h2 .w4{color:#00FF66;display:block}
.m-bigtext .credit{font-family:'Space Mono',monospace;font-size:9px;color:#888;letter-spacing:3px;margin-top:22px;text-transform:uppercase}
.m-nl{display:grid;grid-template-columns:1fr 1fr;border-bottom:3px solid #FAFAFA}
.m-nl-l{padding:52px 44px;background:#E8FF00;display:flex;flex-direction:column;justify-content:center;border-right:3px solid #0A0A0A}
.m-nl-l h2{font-family:'Unbounded',sans-serif;font-size:32px;font-weight:900;color:#0A0A0A;letter-spacing:-2px;text-transform:uppercase;line-height:.9;margin-bottom:10px}
.m-nl-l p{font-family:'Inter',sans-serif;font-size:13px;color:rgba(0,0,0,.5);line-height:1.6}
.m-nl-r{padding:52px 44px;display:flex;flex-direction:column;justify-content:center;gap:12px}
.m-nl-r label{font-family:'Space Mono',monospace;font-size:8px;color:#888;letter-spacing:2px;text-transform:uppercase}
.m-nl-r input{padding:12px;border:2px solid rgba(255,255,255,.2);background:rgba(255,255,255,.05);font-family:'Space Mono',monospace;font-size:12px;color:#FAFAFA;outline:none;transition:border-color .2s}
.m-nl-r input:focus{border-color:#FF0066}
.m-nl-r input::placeholder{color:rgba(255,255,255,.2)}
.m-footer{background:#0A0A0A;padding:44px 28px 20px;border-top:3px solid #FAFAFA}
.m-ftgrid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:36px;margin-bottom:36px}
.m-ftbrand .fl{font-family:'Unbounded',sans-serif;font-size:20px;font-weight:900;letter-spacing:-2px;margin-bottom:10px;text-transform:uppercase}
.m-ftbrand .fl .c1{color:#0057FF}.m-ftbrand .fl .c2{color:#FF0066}.m-ftbrand .fl .c3{color:#E8FF00}
.m-ftbrand p{font-size:12px;color:#888;line-height:1.6;max-width:250px}
.m-ftcol h5{font-family:'Space Mono',monospace;font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin-bottom:14px}
.m-ftcol:nth-child(2) h5{color:#0057FF}.m-ftcol:nth-child(3) h5{color:#FF0066}.m-ftcol:nth-child(4) h5{color:#E8FF00}
.m-ftcol a{display:block;color:#888;font-size:12px;margin-bottom:7px;cursor:pointer;transition:color .15s;text-decoration:none}
.m-ftcol a:hover{color:#FAFAFA}
.m-ftbot{border-top:2px solid rgba(255,255,255,.1);padding-top:18px;display:flex;justify-content:space-between;font-family:'Space Mono',monospace;font-size:9px;color:rgba(255,255,255,.2);letter-spacing:1px}
.m-ftbot .sc{display:flex;gap:14px}
.m-ftbot .sc a{color:rgba(255,255,255,.2);text-decoration:none;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:color .15s}
.m-ftbot .sc a:hover{color:#FF0066}
.m-fbar{display:flex;gap:0;flex-wrap:wrap;margin-bottom:24px;border:2px solid #FAFAFA}
.m-fbtn{padding:9px 16px;border:none;border-right:2px solid rgba(255,255,255,.15);background:none;font-family:'Space Mono',monospace;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#888;cursor:pointer;transition:all .15s}
.m-fbtn:hover{background:rgba(255,255,255,.1);color:#FAFAFA}
.m-fbtn.a{background:#E8FF00;color:#0A0A0A}
.m-sbar{display:flex;margin-bottom:24px;border:2px solid #FAFAFA}
.m-sbar input{flex:1;padding:10px 14px;border:none;background:rgba(255,255,255,.05);font-family:'Space Mono',monospace;font-size:11px;color:#FAFAFA;outline:none}
.m-sbar input::placeholder{color:rgba(255,255,255,.2)}
.m-sbar button{padding:10px 18px;background:#FF0066;color:#fff;border:none;border-left:2px solid #FAFAFA;font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;cursor:pointer;transition:all .15s}
.m-sbar button:hover{background:#E8FF00;color:#0A0A0A}
.m-bc{padding:12px 28px;font-family:'Space Mono',monospace;font-size:10px;color:#888;letter-spacing:1px}
.m-bc button{background:none;border:none;color:#0057FF;cursor:pointer;font-family:'Space Mono',monospace;font-size:10px;letter-spacing:1px}
.m-bc button:hover{color:#E8FF00}
.m-detail{max-width:1100px;margin:0 auto;padding:24px 28px 56px;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start}
.m-detail-img{border:2px solid #FAFAFA;position:relative;overflow:hidden;aspect-ratio:1}
.m-detail-img img{width:100%;height:100%;object-fit:cover;filter:contrast(1.1)}
.m-detail-img .idx{position:absolute;bottom:8px;right:10px;font-family:'Unbounded',sans-serif;font-size:100px;font-weight:900;color:rgba(255,255,255,.04);letter-spacing:-4px}
.m-dinfo .brand{font-family:'Space Mono',monospace;font-size:9px;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px}
.m-dinfo h1{font-family:'Unbounded',sans-serif;font-size:clamp(24px,3.5vw,40px);font-weight:900;letter-spacing:-2px;text-transform:uppercase;margin-bottom:14px;line-height:.95}
.m-dinfo .dprice{font-family:'Unbounded',sans-serif;font-size:28px;font-weight:900;letter-spacing:-1px;margin-bottom:16px}
.m-dinfo .dprice .old{font-size:14px;font-weight:400;text-decoration:line-through;color:#888;margin-left:8px}
.m-dinfo .ddesc{font-family:'Inter',sans-serif;font-size:14px;color:rgba(255,255,255,.5);line-height:1.7;margin-bottom:24px}
.m-dinfo label{font-family:'Space Mono',monospace;font-size:9px;color:#888;letter-spacing:2px;text-transform:uppercase;display:block;margin-bottom:6px}
.m-sizes{display:flex;gap:0;margin-bottom:16px;border:2px solid #FAFAFA;flex-wrap:wrap}
.m-sz{padding:8px 14px;border:none;border-right:2px solid rgba(255,255,255,.15);background:none;font-family:'Space Mono',monospace;font-size:11px;font-weight:700;color:#FAFAFA;cursor:pointer;transition:all .15s}
.m-sz:hover,.m-sz.sel{background:#E8FF00;color:#0A0A0A}
.m-colors{display:flex;gap:6px;margin-bottom:16px}
.m-cl{width:28px;height:28px;border:2px solid rgba(255,255,255,.3);cursor:pointer;transition:all .2s}
.m-cl:hover,.m-cl.sel{outline:3px solid #FF0066;outline-offset:2px;transform:scale(1.1)}
.m-empty{text-align:center;padding:44px;font-family:'Space Mono',monospace;color:#888}
@media(max-width:1024px){.m-pgrid{grid-template-columns:repeat(2,1fr)}.m-hero-bg .bl:nth-child(3),.m-hero-imglay{display:none}.m-split,.m-nl,.m-detail{grid-template-columns:1fr}.m-split-img{border-left:none;border-top:3px solid #FAFAFA;min-height:320px}.m-nl-l{border-right:none;border-bottom:3px solid #0A0A0A}.m-cats{grid-template-columns:1fr}.m-cat{border-right:none;border-bottom:3px solid #FAFAFA;aspect-ratio:16/9}.m-ftgrid{grid-template-columns:1fr 1fr}}
@media(max-width:640px){.m-nlinks{display:none}.m-pgrid{grid-template-columns:1fr}.m-hero-content{padding:22px 14px}.m-products{padding:28px 14px}.m-bigtext{padding:44px 14px}.m-split-text{padding:28px 16px}.m-nl-l,.m-nl-r{padding:28px 16px}.m-ftgrid{grid-template-columns:1fr}.m-ftbot{flex-direction:column;gap:8px;text-align:center}.m-detail{padding:14px;gap:22px}.m-bc{padding:10px 14px}}
`

function getBadge(b) {
  if (!b) return ''
  if (b.includes('%')) return 'sale'
  if (b.includes('🔥') || b.includes('Hot')) return 'hot'
  if (b.includes('Last') || b.includes('Limited')) return 'ltd'
  return 'new'
}

export default function Maximalism() {
  const st = useStore('FRMΛT.', 1.2)
  const nav = useNavigate()

  useEffect(() => {
    document.body.style.cssText = "background:#0A0A0A;font-family:'Inter',sans-serif;margin:0;overflow-x:hidden;-webkit-font-smoothing:antialiased;"
    return () => { document.body.style.cssText = '' }
  }, [])

  const PCard = ({ p, i }) => (
    <button className="m-pcard" onClick={() => st.go('product', { id: p.id })}>
      <div className="m-pimg">
        {p.badge && <div className={`m-pbadge ${getBadge(p.badge)}`}>{p.badge}</div>}
        <div className="m-pidx">{String(i + 1).padStart(2, '0')}</div>
        <img src={p.img} alt={p.name} />
      </div>
      <div className="m-pbody">
        <p className="m-pbrand">FRMΛT. Studio</p>
        <p className="m-pname">{p.name}</p>
        <div className="m-prow">
          <span className="m-pprice" style={{ color: getAccent(i) }}>${p.price}{p.oldPrice && <span className="old">${p.oldPrice}</span>}</span>
          <span className="m-padd" onClick={e => { e.stopPropagation(); e.currentTarget.textContent = '✓ OK'; e.currentTarget.style.background = '#E8FF00'; e.currentTarget.style.color = '#0A0A0A'; e.currentTarget.style.borderColor = '#E8FF00'; setTimeout(() => { e.currentTarget.textContent = '+ Add'; e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = '' }, 1200) }}>+ Add</span>
        </div>
      </div>
    </button>
  )

  return (
    <div className="m">
      <style>{CSS}</style>
      <button className="m-back" onClick={() => nav('/')}>← Portfolio</button>

      <nav className="m-nav">
        <button className="m-logo" onClick={() => st.go('home')}>FRM<span className="lam">Λ</span>T.</button>
        <div className="m-nlinks">
          <button onClick={() => st.go('shop', { cat: 'All' })} className={st.page === 'shop' ? 'a' : ''}>Drops</button>
          <button onClick={() => st.go('shop', { cat: 'Tops' })}>Women</button>
          <button onClick={() => st.go('shop', { cat: 'Outerwear' })}>Men</button>
          <button onClick={() => st.go('shop', { cat: 'Accessories' })}>Objects</button>
          <button onClick={() => st.go('search')}>Zine</button>
        </div>
        <div className="m-nright">
          <button onClick={() => st.go('search')}>Search</button>
          <button>Bag (3)</button>
        </div>
      </nav>

      {/* HOME */}
      <div className={tClass}>
      {st.page === 'home' && <>
        <section className="m-hero">
          <div className="m-hero-bg"><div className="bl" /><div className="bl" /><div className="bl" /></div>
          <div className="m-hero-imglay"><img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&q=80" alt="" /></div>
          <div className="m-hero-content">
            <div className="m-hero-topbar"><span>FRMΛT. // SS26 // VOL.07</span><span>FEB.18.2026 // LIVE</span></div>
            <div style={{ position: 'relative' }}>
              <h1><span className="l1">We Said</span><span className="l2">No To</span><span className="l3">Boring.</span></h1>
              <div className="glitch" aria-hidden="true">We Said<br />No To<br />Boring.</div>
            </div>
            <p className="m-hero-sub">Because we want to open up a discussion about how we can work together, rather than against each other.</p>
            <div className="m-hero-tags"><span>Streetwear</span><span>Art</span><span>Unisex</span><span>Limited</span></div>
            <div className="m-hero-btns">
              <button className="m-btn pri" onClick={() => st.go('shop', { cat: 'All' })}>Shop Now →</button>
              <button className="m-btn out">Watch Film</button>
            </div>
          </div>
          <div className="m-hero-bignum">07</div>
        </section>

        <div className="m-marquee"><div className="track">
          {['Format','Design','Festival','Together','Create','Maximum','Format','Design','Festival','Together','Create','Maximum'].map((t, i) => <span key={i} className="item">{t}</span>)}
        </div></div>

        <div className="m-products">
          <div className="m-sec-head"><h2>New <span className="c1">Drops</span> <span className="c2">!</span></h2><button className="vall" onClick={() => st.go('shop', { cat: 'All' })}>View All →</button></div>
          <div className="m-pgrid">{st.products.slice(0, 8).map((p, i) => <PCard key={p.id} p={p} i={i} />)}</div>
        </div>

        <div className="m-split">
          <div className="m-split-text bg-blue">
            <span className="bgword">ART</span>
            <p className="label">Manifesto // Vol.07</p>
            <h3>And Designing Together Is Fun.</h3>
            <p>We don't compete against each other. We work together. Every piece in this collection is a collaboration between artists, engineers, and dreamers who refuse to be limited by convention.</p>
            <button className="m-btn pri" onClick={() => st.go('shop', { cat: 'All' })}>Read More →</button>
          </div>
          <div className="m-split-img">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" alt="" />
            <div className="ovtxt">FRMΛT</div>
          </div>
        </div>

        <div className="m-cats">
          <button className="m-cat" onClick={() => st.go('shop', { cat: 'Outerwear' })}>
            <img src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=700&q=80" alt="" />
            <div className="m-cat-ov"><h3>Women</h3><span>44 pieces</span></div>
          </button>
          <button className="m-cat" onClick={() => st.go('shop', { cat: 'Tops' })}>
            <img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80" alt="" />
            <div className="m-cat-ov"><h3>Men</h3><span>38 pieces</span></div>
          </button>
          <button className="m-cat" onClick={() => st.go('shop', { cat: 'Accessories' })}>
            <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80" alt="" />
            <div className="m-cat-ov"><h3>Objects</h3><span>16 pieces</span></div>
          </button>
        </div>

        <div className="m-bigtext">
          <h2><span className="w1">More Is</span><span className="w2">More.</span><span className="w3">Less Is</span><span className="w4">A Bore.</span></h2>
          <p className="credit">— FRMΛT. Manifesto, Volume VII</p>
        </div>

        <div className="m-products">
          <div className="m-sec-head"><h2>Best <span className="c1">Sellers</span></h2></div>
          <div className="m-pgrid">{st.products.slice(8, 12).map((p, i) => <PCard key={p.id} p={p} i={i + 8} />)}</div>
        </div>

        <div className="m-split">
          <div className="m-split-text bg-pink">
            <span className="bgword">NOW</span>
            <p className="label">Behind The Scenes // SS26</p>
            <h3>Color Has No Rules.</h3>
            <p>We shot this collection in an abandoned warehouse in Tokyo. No scripts, no mood boards — just creative energy and a box of spray paint.</p>
            <button className="m-btn pri" onClick={() => st.go('shop', { cat: 'All' })}>See Collection →</button>
          </div>
          <div className="m-split-img">
            <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80" alt="" />
            <div className="ovtxt">SS26</div>
          </div>
        </div>

        <div className="m-nl">
          <div className="m-nl-l"><h2>Stay In<br />The Loop.</h2><p>Exclusive drops, behind-the-scenes content, and early access. No spam. Just maximum energy and 10% off your first order.</p></div>
          <div className="m-nl-r"><label>Email *</label><input placeholder="you@email.com" /><label>Name</label><input placeholder="—" /><button className="m-btn pri" style={{ alignSelf: 'flex-start', marginTop: 6 }}>Subscribe →</button></div>
        </div>
      </>}

      {/* SHOP / CATEGORY */}
      {st.page === 'shop' && <>
        <div className="m-bc"><button onClick={() => st.go('home')}>Home</button> / Drops {st.cat !== 'All' ? `/ ${st.cat}` : ''}</div>
        <div className="m-products">
          <div className="m-sec-head"><h2>{st.cat === 'All' ? 'All' : st.cat} <span className="c1">Drops</span> <span className="c2">!</span></h2><span style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: '#888', letterSpacing: 2 }}>{st.filtered.length} PIECES</span></div>
          <div className="m-sbar"><input value={st.search} onChange={e => st.setSearch(e.target.value)} placeholder="Search the collection..." onKeyDown={e => e.key === 'Enter' && st.doSearch()} /><button onClick={st.doSearch}>Search</button></div>
          <div className="m-fbar">{st.cats.map(c => <button key={c} className={`m-fbtn ${st.cat === c ? 'a' : ''}`} onClick={() => st.go('shop', { cat: c, q: st.sq })}>{c}</button>)}</div>
          <div className="m-pgrid">{st.filtered.map((p, i) => <PCard key={p.id} p={p} i={i} />)}</div>
          {st.filtered.length === 0 && <p className="m-empty">No pieces found. Try a different search.</p>}
        </div>
      </>}

      {/* SEARCH */}
      {st.page === 'search' && <>
        <div className="m-products" style={{ paddingTop: 44 }}>
          <div className="m-sec-head"><h2><span className="c1">Search</span> <span className="c2">!</span></h2></div>
          <div className="m-sbar"><input value={st.search} onChange={e => st.setSearch(e.target.value)} placeholder="What are you looking for?" onKeyDown={e => e.key === 'Enter' && st.doSearch()} autoFocus /><button onClick={st.doSearch}>Search</button></div>
          <div className="m-pgrid">{st.products.slice(0, 8).map((p, i) => <PCard key={p.id} p={p} i={i} />)}</div>
        </div>
      </>}

      {/* PRODUCT DETAIL */}
      {st.page === 'product' && st.product && <>
        <div className="m-bc"><button onClick={() => st.go('home')}>Home</button> / <button onClick={() => st.go('shop', { cat: st.product.cat })}>{st.product.cat}</button> / {st.product.name}</div>
        <div className="m-detail">
          <div className="m-detail-img">
            <img src={st.product.img} alt={st.product.name} />
            <div className="idx">{String(st.product.id).padStart(2, '0')}</div>
          </div>
          <div className="m-dinfo">
            <div className="brand">FRMΛT. Studio</div>
            <h1>{st.product.name}</h1>
            <div className="dprice" style={{ color: getAccent(st.product.id) }}>${st.product.price}{st.product.oldPrice && <span className="old">${st.product.oldPrice}</span>}</div>
            <p className="ddesc">{st.product.desc}</p>
            {st.product.sizes.length > 0 && <><label>Size</label><div className="m-sizes">{st.product.sizes.map(s => <button key={s} className={`m-sz ${st.selSize === s ? 'sel' : ''}`} onClick={() => st.setSelSize(s)}>{s}</button>)}</div></>}
            {st.product.colors.length > 0 && <><label>Color</label><div className="m-colors">{st.product.colors.map(c => <button key={c} className={`m-cl ${st.selColor === c ? 'sel' : ''}`} onClick={() => st.setSelColor(c)} title={c} style={{ background: colorMap[c] || '#999' }} />)}</div></>}
            <button className="m-btn pri" style={{ width: '100%', textAlign: 'center', marginTop: 8 }}>Add to Bag →</button>
            <div style={{ marginTop: 18, padding: '14px 0', borderTop: '2px solid rgba(255,255,255,.1)', display: 'flex', gap: 20, fontFamily: "'Space Mono',monospace", fontSize: 9, color: '#888', letterSpacing: 2, textTransform: 'uppercase' }}>
              <span>Free Shipping +$200</span><span>30 Day Returns</span><span>Limited Edition</span>
            </div>
          </div>
        </div>
        <div className="m-products">
          <div className="m-sec-head"><h2>You Might <span className="c1">Like</span></h2></div>
          <div className="m-pgrid">{st.related.map((p, i) => <PCard key={p.id} p={p} i={i + 10} />)}</div>
        </div>
      </>}

      </div>

      {/* FOOTER */}
      <footer className="m-footer">
        <div className="m-ftgrid">
          <div className="m-ftbrand"><div className="fl">FRM<span className="c1">Λ</span>T<span className="c2">.</span></div><p>Maximum expression. Minimum compromise. Fashion as art, art as fashion. Every piece tells a story louder than the last.</p></div>
          <div className="m-ftcol"><h5>Shop</h5><a onClick={() => st.go('shop', { cat: 'All' })}>All Drops</a><a onClick={() => st.go('shop', { cat: 'Tops' })}>Women</a><a onClick={() => st.go('shop', { cat: 'Outerwear' })}>Men</a><a onClick={() => st.go('shop', { cat: 'Accessories' })}>Objects</a></div>
          <div className="m-ftcol"><h5>World</h5><a>Manifesto</a><a>Zine</a><a>Lookbook</a><a>Film</a></div>
          <div className="m-ftcol"><h5>Help</h5><a>Contact</a><a>Shipping</a><a>Returns</a><a>FAQ</a></div>
        </div>
        <div className="m-ftbot"><span>© 2026 FRMΛT. MORE IS MORE.</span><div className="sc"><a>IG</a><a>TK</a><a>YT</a><a>PIN</a></div></div>
      </footer>
    </div>
  )
}
