import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from './useStore'
import { colorMap } from './data'

const CSS = `
.lx{min-height:100vh;background:#FDFBF7;color:#1A1A1A;font-family:'Josefin Sans',sans-serif;overflow-x:hidden}
.lx *{box-sizing:border-box}
.lx-back{position:fixed;top:16px;left:16px;z-index:9999;padding:8px 22px;background:rgba(26,42,27,.85);backdrop-filter:blur(10px);color:#C9B99A;font-family:'Josefin Sans',sans-serif;font-size:11px;font-weight:300;letter-spacing:3px;text-transform:uppercase;border:1px solid rgba(201,185,154,.3);cursor:pointer;transition:all .4s}
.lx-back:hover{background:#C9B99A;color:#1A2A1B}

/* LOADER */
.lx-loader{position:fixed;inset:0;z-index:10000;background:#1A2A1B;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:24px;transition:opacity .8s,visibility .8s}
.lx-loader.hide{opacity:0;visibility:hidden;pointer-events:none}
.lx-loader-logo{font-family:'Cormorant Garamond',serif;font-size:42px;font-weight:300;color:#C9B99A;letter-spacing:14px;text-transform:uppercase;opacity:0;animation:lxFadeUp 1s .3s forwards}
.lx-loader-line{width:120px;height:1px;background:#C9B99A;transform:scaleX(0);animation:lxScale 1.2s .6s forwards}
.lx-loader-sub{font-size:11px;letter-spacing:5px;color:rgba(201,185,154,.6);text-transform:uppercase;opacity:0;animation:lxFadeUp 1s .8s forwards}
@keyframes lxFadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes lxScale{from{transform:scaleX(0)}to{transform:scaleX(1)}}

/* TRANSITION */
.lx-trans-overlay{position:fixed;inset:0;z-index:9990;pointer-events:none}
.lx-trans-overlay::before,.lx-trans-overlay::after{content:'';position:absolute;left:0;right:0;height:50%;background:#1A2A1B;transition:transform .5s cubic-bezier(.86,0,.07,1)}
.lx-trans-overlay::before{top:0;transform:translateY(-100%)}
.lx-trans-overlay::after{bottom:0;transform:translateY(100%)}
.lx-trans-overlay.active::before{transform:translateY(0)}
.lx-trans-overlay.active::after{transform:translateY(0)}
.lx-trans-overlay .mid{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Cormorant Garamond',serif;font-size:28px;color:#C9B99A;letter-spacing:10px;text-transform:uppercase;opacity:0;z-index:2;transition:opacity .25s .15s}
.lx-trans-overlay.active .mid{opacity:1}
.lx-page{opacity:1;transition:opacity .35s}
.lx-page.out{opacity:0}

/* ANNOUNCEMENT */
.lx-announce{background:#1A2A1B;color:#C9B99A;text-align:center;padding:10px 20px;font-size:11px;letter-spacing:4px;text-transform:uppercase;font-weight:300}

/* NAV */
.lx-nav{position:sticky;top:0;z-index:1000;background:rgba(253,251,247,.92);backdrop-filter:blur(20px);border-bottom:1px solid rgba(185,170,140,.3);transition:all .4s}
.lx-nav-inner{max-width:1400px;margin:0 auto;padding:18px 48px;display:flex;align-items:center;justify-content:space-between}
.lx-nav-side{display:flex;align-items:center;gap:36px}
.lx-nav-side button{font-size:11px;letter-spacing:3px;text-transform:uppercase;background:none;border:none;color:#1A1A1A;font-weight:300;font-family:inherit;cursor:pointer;position:relative;transition:color .3s;padding:0}
.lx-nav-side button::after{content:'';position:absolute;bottom:-4px;left:0;width:0;height:1px;background:#B8963E;transition:width .4s}
.lx-nav-side button:hover::after{width:100%}
.lx-nav-side button:hover{color:#B8963E}
.lx-logo{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:400;letter-spacing:8px;text-transform:uppercase;color:#1A1A1A;background:none;border:none;cursor:pointer;padding:0}
.lx-logo em{font-style:italic;font-weight:300;letter-spacing:2px}
.lx-cart-count{background:#1A2A1B;color:#C9B99A;font-size:9px;padding:2px 7px;border-radius:50%;margin-left:4px;vertical-align:super}

/* HERO */
.lx-hero{height:100vh;min-height:700px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#1A2A1B}
.lx-hero-bg{position:absolute;inset:0;background:linear-gradient(135deg,#1A2A1B 0%,#1B2838 50%,#2C3E2D 100%)}
.lx-hero-pattern{position:absolute;inset:0;background-image:radial-gradient(ellipse at 20% 50%,rgba(201,185,154,.08) 0%,transparent 60%),radial-gradient(ellipse at 80% 30%,rgba(184,150,62,.06) 0%,transparent 50%)}
.lx-hero-content{position:relative;z-index:2;text-align:center;max-width:800px;padding:0 40px}
.lx-hero-label{font-size:11px;letter-spacing:6px;text-transform:uppercase;color:#C9B99A;margin-bottom:32px;font-weight:300}
.lx-hero h1{font-family:'Cormorant Garamond',serif;font-size:clamp(48px,8vw,96px);font-weight:300;line-height:1.05;color:#F5F0E8;margin-bottom:24px}
.lx-hero h1 em{font-style:italic;color:#C9B99A}
.lx-hero-div{width:60px;height:1px;background:#B8963E;margin:28px auto}
.lx-hero-sub{font-size:16px;font-weight:300;color:rgba(237,231,219,.7);line-height:1.8;max-width:480px;margin:0 auto 40px}
.lx-hero-cta{display:inline-block;padding:16px 52px;border:1px solid #C9B99A;color:#C9B99A;font-size:11px;letter-spacing:5px;text-transform:uppercase;font-weight:300;background:none;cursor:pointer;transition:all .5s;font-family:inherit}
.lx-hero-cta:hover{background:#C9B99A;color:#1A2A1B}
.lx-hero-scroll{position:absolute;bottom:40px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px}
.lx-hero-scroll span{font-size:9px;letter-spacing:4px;text-transform:uppercase;color:rgba(201,185,154,.5)}
.lx-scroll-line{width:1px;height:40px;background:linear-gradient(to bottom,#C9B99A,transparent);animation:lxPulse 2s infinite}
@keyframes lxPulse{0%,100%{opacity:.3}50%{opacity:1}}

/* SECTIONS */
.lx-sect{padding:100px 48px;max-width:1400px;margin:0 auto}
.lx-sec-label{font-size:10px;letter-spacing:5px;text-transform:uppercase;color:#6B6356;margin-bottom:16px;font-weight:300}
.lx-sec-title{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,56px);font-weight:300;line-height:1.15;margin-bottom:20px}
.lx-sec-title em{font-style:italic;color:#B8963E}

/* EDITORIAL BAND */
.lx-editorial{display:grid;grid-template-columns:1fr 1fr;min-height:500px;background:#EDE7DB}
.lx-ed-text{display:flex;flex-direction:column;justify-content:center;padding:80px 72px}
.lx-ed-quote{font-family:'Cormorant Garamond',serif;font-size:28px;font-weight:300;font-style:italic;line-height:1.6;color:#1A2A1B;margin-bottom:24px}
.lx-ed-attr{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#6B6356}
.lx-ed-img{overflow:hidden;position:relative}
.lx-ed-img img{width:100%;height:100%;object-fit:cover;transition:transform 8s}
.lx-editorial:hover .lx-ed-img img{transform:scale(1.05)}

/* PRODUCT GRID */
.lx-pgrid{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.lx-pcard{cursor:pointer;text-decoration:none;color:inherit;background:none;border:none;padding:0;text-align:left;font-family:inherit;transition:all .5s}
.lx-pcard:hover{transform:translateY(-4px)}
.lx-pimg{aspect-ratio:3/4;overflow:hidden;position:relative;background:#EDE7DB;margin-bottom:16px}
.lx-pimg img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.25,.46,.45,.94)}
.lx-pcard:hover .lx-pimg img{transform:scale(1.06)}
.lx-pbadge{position:absolute;top:14px;left:14px;font-size:9px;letter-spacing:3px;text-transform:uppercase;font-weight:300}
.lx-pbadge.new{color:#B8963E}
.lx-pbadge.sale{color:#5C1A2A}
.lx-pbadge.hot{color:#1A2A1B}
.lx-pbadge.ltd{color:#1B2838}
.lx-pbrand{font-size:10px;color:#6B6356;letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;font-weight:300}
.lx-pname{font-family:'Cormorant Garamond',serif;font-size:18px;font-weight:400;margin-bottom:8px;line-height:1.3}
.lx-pprow{display:flex;justify-content:space-between;align-items:center}
.lx-pprice{font-size:16px;font-weight:400;letter-spacing:1px}
.lx-pprice .old{font-size:12px;color:#6B6356;text-decoration:line-through;margin-left:8px;font-weight:300}

/* CATEGORIES */
.lx-catgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:48px}
.lx-catcard{position:relative;overflow:hidden;aspect-ratio:3/4;background:#EDE7DB;cursor:pointer;border:none;padding:0;font-family:inherit;display:block}
.lx-catcard img{width:100%;height:100%;object-fit:cover;transition:transform 1.2s cubic-bezier(.25,.46,.45,.94)}
.lx-catcard:hover img{transform:scale(1.06)}
.lx-catcard-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(26,42,27,.75) 0%,transparent 50%);display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding:32px;text-align:center}
.lx-catcard-ov h3{font-family:'Cormorant Garamond',serif;font-size:24px;font-weight:300;color:#F5F0E8;letter-spacing:4px;text-transform:uppercase;margin-bottom:4px}
.lx-catcard-ov span{font-size:10px;color:#C9B99A;letter-spacing:3px;font-weight:300}

/* BREADCRUMBS */
.lx-bc{padding:16px 48px;font-size:11px;color:#6B6356;letter-spacing:2px;border-bottom:1px solid rgba(185,170,140,.3);display:flex;gap:8px}
.lx-bc button{background:none;border:none;color:#6B6356;font-family:inherit;font-size:11px;cursor:pointer;letter-spacing:2px;padding:0;font-weight:300}
.lx-bc button:hover{color:#B8963E}

/* SEARCH */
.lx-search-sec{padding:100px 48px;text-align:center}
.lx-search-sec h2{font-family:'Cormorant Garamond',serif;font-size:clamp(36px,5vw,56px);font-weight:300;margin-bottom:28px}
.lx-search-sec h2 em{font-style:italic;color:#B8963E}
.lx-search-bar{display:flex;max-width:560px;margin:0 auto 48px;border-bottom:1px solid #1A1A1A}
.lx-search-bar input{flex:1;padding:16px 0;border:none;font-family:inherit;font-size:16px;background:none;outline:none;font-weight:300;letter-spacing:1px}
.lx-search-bar button{padding:16px 28px;background:none;border:none;color:#B8963E;font-family:inherit;font-size:12px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;font-weight:300;transition:color .3s}
.lx-search-bar button:hover{color:#1A1A1A}

/* PRODUCT DETAIL */
.lx-detail{display:grid;grid-template-columns:1fr 1fr;min-height:80vh}
.lx-detail-img{background:#EDE7DB;display:flex;align-items:center;justify-content:center;padding:40px}
.lx-detail-img img{max-width:90%;max-height:80vh;object-fit:contain}
.lx-detail-info{padding:80px 64px;display:flex;flex-direction:column;justify-content:center}
.lx-detail-brand{font-size:10px;color:#B8963E;letter-spacing:5px;text-transform:uppercase;margin-bottom:12px;font-weight:300}
.lx-detail-name{font-family:'Cormorant Garamond',serif;font-size:clamp(32px,4vw,48px);font-weight:300;margin-bottom:6px;line-height:1.1}
.lx-detail-cat{font-size:12px;color:#6B6356;margin-bottom:32px;letter-spacing:2px}
.lx-detail-price{font-size:28px;font-weight:400;letter-spacing:1px;margin-bottom:32px}
.lx-detail-price .old{font-size:18px;color:#6B6356;text-decoration:line-through;margin-left:10px;font-weight:300}
.lx-detail-desc{font-size:14px;color:#6B6356;line-height:1.9;margin-bottom:36px;max-width:420px;font-weight:300}
.lx-sel-label{font-size:10px;text-transform:uppercase;letter-spacing:3px;margin-bottom:10px;color:#6B6356;font-weight:300}
.lx-sel-row{display:flex;gap:8px;margin-bottom:24px}
.lx-sel-btn{padding:10px 20px;background:none;border:1px solid rgba(185,170,140,.3);font-family:inherit;font-size:12px;font-weight:300;cursor:pointer;transition:all .3s;letter-spacing:1px}
.lx-sel-btn.a{background:#1A2A1B;color:#F5F0E8;border-color:#1A2A1B}
.lx-sel-btn:hover:not(.a){border-color:#B8963E;color:#B8963E}
.lx-color-row{display:flex;gap:10px;margin-bottom:32px}
.lx-color-opt{width:24px;height:24px;border-radius:50%;border:2px solid transparent;cursor:pointer;transition:all .3s}
.lx-color-opt.a{border-color:#B8963E;transform:scale(1.15)}
.lx-color-opt:hover{transform:scale(1.1)}
.lx-add-btn{display:inline-block;padding:18px 56px;background:#1A2A1B;color:#C9B99A;border:none;font-family:inherit;font-size:11px;letter-spacing:5px;text-transform:uppercase;font-weight:300;cursor:pointer;transition:all .5s;align-self:flex-start}
.lx-add-btn:hover{background:#B8963E;color:#1A2A1B}

/* FILTER */
.lx-fbar{display:flex;gap:4px;margin-bottom:48px;flex-wrap:wrap}
.lx-fbtn{padding:10px 24px;background:none;border:1px solid rgba(185,170,140,.3);font-family:inherit;font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:300;cursor:pointer;transition:all .3s}
.lx-fbtn.a{background:#1A2A1B;color:#C9B99A;border-color:#1A2A1B}
.lx-fbtn:hover:not(.a){border-color:#B8963E;color:#B8963E}

/* NEWSLETTER */
.lx-nl{background:#1A2A1B;padding:80px 48px;text-align:center}
.lx-nl .label{font-size:10px;letter-spacing:5px;text-transform:uppercase;color:#C9B99A;margin-bottom:16px;font-weight:300}
.lx-nl h3{font-family:'Cormorant Garamond',serif;font-size:36px;font-weight:300;color:#F5F0E8;margin-bottom:12px}
.lx-nl p{font-size:14px;color:rgba(201,185,154,.6);font-weight:300;margin-bottom:32px}
.lx-nl-form{display:flex;max-width:480px;margin:0 auto;border-bottom:1px solid rgba(201,185,154,.3)}
.lx-nl-form input{flex:1;padding:14px 0;border:none;background:none;color:#F5F0E8;font-family:inherit;font-size:14px;outline:none;font-weight:300}
.lx-nl-form input::placeholder{color:rgba(201,185,154,.4)}
.lx-nl-form button{padding:14px 24px;background:none;border:none;color:#C9B99A;font-family:inherit;font-size:11px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;transition:color .3s;font-weight:300}
.lx-nl-form button:hover{color:#F5F0E8}

/* FOOTER */
.lx-footer{background:#FDFBF7;border-top:1px solid rgba(185,170,140,.3);padding:64px 48px 32px;max-width:1400px;margin:0 auto}
.lx-ftgrid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;margin-bottom:48px}
.lx-ftcol .logo{font-family:'Cormorant Garamond',serif;font-size:22px;letter-spacing:6px;text-transform:uppercase;margin-bottom:12px}
.lx-ftcol .desc{font-size:13px;color:#6B6356;line-height:1.7;font-weight:300}
.lx-ftcol h5{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:#B8963E;margin-bottom:16px;font-weight:300}
.lx-ftcol a{display:block;color:#6B6356;font-size:13px;margin-bottom:8px;cursor:pointer;transition:color .3s;text-decoration:none;font-weight:300}
.lx-ftcol a:hover{color:#B8963E}
.lx-ftbot{padding-top:24px;border-top:1px solid rgba(185,170,140,.3);display:flex;justify-content:space-between;font-size:11px;color:#6B6356;letter-spacing:1px;font-weight:300}

@media(max-width:1024px){
  .lx-hero{min-height:80vh}
  .lx-editorial,.lx-detail{grid-template-columns:1fr}
  .lx-ed-text{border-bottom:1px solid rgba(185,170,140,.3)}
  .lx-detail-img{min-height:50vh}
  .lx-pgrid{grid-template-columns:repeat(2,1fr)}
  .lx-catgrid{grid-template-columns:1fr}
  .lx-ftgrid{grid-template-columns:1fr 1fr}
}
@media(max-width:640px){
  .lx-nav-side{display:none}
  .lx-pgrid{grid-template-columns:1fr}
  .lx-sect{padding:60px 24px}
  .lx-ftgrid{grid-template-columns:1fr}
}
`

const Card = ({ p, st }) => (
  <button className="lx-pcard" onClick={() => st.go('product', { id: p.id })} style={{ color: 'inherit' }}>
    <div className="lx-pimg">
      <img src={p.img} alt={p.name} loading="lazy" />
      {p.badge && <span className={`lx-pbadge ${p.badge}`}>{p.badge === 'new' ? '● New' : p.badge === 'sale' ? '● Sale' : p.badge === 'hot' ? '● Popular' : '● Limited'}</span>}
    </div>
    <div className="lx-pbrand">Maison Dorè</div>
    <div className="lx-pname">{p.name}</div>
    <div className="lx-pprow">
      <span className="lx-pprice">${p.price}{p.orig && <span className="old">${p.orig}</span>}</span>
    </div>
  </button>
)

export default function Luxury() {
  const nav = useNavigate()
  const st = useStore('DORÈ', 2.1)
  useEffect(() => { document.body.style.background = '#FDFBF7'; return () => { document.body.style.background = '' } }, [])
  const tClass = st.transitioning ? 'lx-page out' : 'lx-page'

  return (
    <div className="lx">
      <style>{CSS}</style>

      {/* LOADER */}
      <div className={`lx-loader ${!st.loading ? 'hide' : ''}`}>
        <div className="lx-loader-logo">Dorè</div>
        <div className="lx-loader-line" />
        <div className="lx-loader-sub">Heritage Collection</div>
      </div>

      {/* TRANSITION */}
      <div className={`lx-trans-overlay ${st.transitioning ? 'active' : ''}`}>
        <span className="mid">Dorè</span>
      </div>

      <button className="lx-back" onClick={() => nav('/')}>← Portfolio</button>

      {/* ANNOUNCEMENT */}
      <div className="lx-announce">Complimentary Shipping on Orders Over $250</div>

      {/* NAV */}
      <nav className="lx-nav">
        <div className="lx-nav-inner">
          <div className="lx-nav-side">
            <button onClick={() => st.go('shop', { cat: 'All' })}>Collection</button>
            <button onClick={() => st.go('shop', { cat: 'Outerwear' })}>Heritage</button>
            <button onClick={() => st.go('shop', { cat: 'Accessories' })}>Accessories</button>
          </div>
          <button className="lx-logo" onClick={() => st.go('home')}>Maison <em>Dorè</em></button>
          <div className="lx-nav-side">
            <button onClick={() => st.go('search')}>Search</button>
            <button>Wishlist</button>
            <button>Bag<span className="lx-cart-count">0</span></button>
          </div>
        </div>
      </nav>

      <div className={tClass}>
        {/* HOME */}
        {st.page === 'home' && <>
          <div className="lx-hero">
            <div className="lx-hero-bg" />
            <div className="lx-hero-pattern" />
            <div className="lx-hero-content">
              <div className="lx-hero-label">Spring/Summer 2026</div>
              <h1>The Art of <em>Timeless</em> Elegance</h1>
              <div className="lx-hero-div" />
              <div className="lx-hero-sub">Discover our carefully curated collection — where heritage craftsmanship meets contemporary refinement.</div>
              <button className="lx-hero-cta" onClick={() => st.go('shop', { cat: 'All' })}>Explore Collection</button>
            </div>
            <div className="lx-hero-scroll"><span>Scroll</span><div className="lx-scroll-line" /></div>
          </div>

          <div className="lx-sect">
            <div className="lx-sec-label">New Arrivals</div>
            <div className="lx-sec-title">Recently <em>Added</em></div>
            <div className="lx-pgrid">
              {st.products.filter(p => p.badge === 'new').slice(0, 4).map(p => <Card key={p.id} p={p} st={st} />)}
            </div>
          </div>

          <div className="lx-editorial">
            <div className="lx-ed-text">
              <div className="lx-ed-quote">"True luxury is not about ostentation — it is about materials so fine they whisper, craftsmanship so precise it appears effortless."</div>
              <div className="lx-ed-attr">— Maison Dorè, Founding Atelier</div>
            </div>
            <div className="lx-ed-img">
              <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" alt="" />
            </div>
          </div>

          <div className="lx-sect">
            <div className="lx-sec-label">Browse</div>
            <div className="lx-sec-title">Shop by <em>Category</em></div>
            <div className="lx-catgrid">
              <button className="lx-catcard" onClick={() => st.go('shop', { cat: 'Outerwear' })}><img src="https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=700&q=80" alt="" /><div className="lx-catcard-ov"><h3>Outerwear</h3><span>8 Pieces</span></div></button>
              <button className="lx-catcard" onClick={() => st.go('shop', { cat: 'Tops' })}><img src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=700&q=80" alt="" /><div className="lx-catcard-ov"><h3>Ready to Wear</h3><span>6 Pieces</span></div></button>
              <button className="lx-catcard" onClick={() => st.go('shop', { cat: 'Accessories' })}><img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700&q=80" alt="" /><div className="lx-catcard-ov"><h3>Accessories</h3><span>6 Pieces</span></div></button>
            </div>
          </div>

          <div className="lx-sect">
            <div className="lx-sec-label">Featured</div>
            <div className="lx-sec-title">All <em>Pieces</em></div>
            <div className="lx-pgrid">
              {st.products.slice(0, 8).map(p => <Card key={p.id} p={p} st={st} />)}
            </div>
          </div>

          <div className="lx-nl">
            <div className="label">Newsletter</div>
            <h3>Stay in the World of Dorè</h3>
            <p>Receive exclusive previews, invitations to private events, and early access to new collections.</p>
            <div className="lx-nl-form">
              <input type="email" placeholder="Your email address" />
              <button>Subscribe</button>
            </div>
          </div>
        </>}

        {/* SHOP */}
        {st.page === 'shop' && <>
          <div className="lx-bc"><button onClick={() => st.go('home')}>Home</button> / Collection {st.cat !== 'All' ? `/ ${st.cat}` : ''}</div>
          <div className="lx-sect">
            <div className="lx-sec-label">Collection</div>
            <div className="lx-sec-title">All <em>Pieces</em></div>
            <div className="lx-fbar">{st.cats.map(c => <button key={c} className={`lx-fbtn ${st.cat === c ? 'a' : ''}`} onClick={() => st.go('shop', { cat: c, q: st.sq })}>{c}</button>)}</div>
            <div className="lx-pgrid">
              {st.filtered.map(p => <Card key={p.id} p={p} st={st} />)}
            </div>
          </div>
        </>}

        {/* SEARCH */}
        {st.page === 'search' && <>
          <div className="lx-search-sec">
            <h2>Search <em>Collection</em></h2>
            <div className="lx-search-bar">
              <input value={st.search} onChange={e => st.setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && st.doSearch()} placeholder="What are you looking for?" />
              <button onClick={st.doSearch}>Search</button>
            </div>
          </div>
        </>}

        {/* PRODUCT DETAIL */}
        {st.page === 'product' && st.product && <>
          <div className="lx-bc"><button onClick={() => st.go('home')}>Home</button> / <button onClick={() => st.go('shop', { cat: st.product.cat })}>{st.product.cat}</button> / {st.product.name}</div>
          <div className="lx-detail">
            <div className="lx-detail-img"><img src={st.product.img} alt={st.product.name} /></div>
            <div className="lx-detail-info">
              <div className="lx-detail-brand">Maison Dorè</div>
              <h1 className="lx-detail-name">{st.product.name}</h1>
              <div className="lx-detail-cat">{st.product.cat}</div>
              <div className="lx-detail-price">${st.product.price}{st.product.orig && <span className="old">${st.product.orig}</span>}</div>
              <p className="lx-detail-desc">Meticulously crafted from the finest materials by our master artisans. Each piece tells a story of heritage, elegance, and uncompromising quality.</p>
              <div className="lx-sel-label">Size</div>
              <div className="lx-sel-row">{['XS','S','M','L','XL'].map(s => <button key={s} className={`lx-sel-btn ${st.selSize===s?'a':''}`} onClick={() => st.setSelSize(s)}>{s}</button>)}</div>
              <div className="lx-sel-label">Color</div>
              <div className="lx-color-row">{(st.product.colors || ['#2C3E2D','#C9B99A','#1A1A1A','#F5F0E8']).map(c => <button key={c} className={`lx-color-opt ${st.selColor === c ? 'a' : ''}`} style={{ background: colorMap[c] || c }} onClick={() => st.setSelColor(c)} />)}</div>
              <button className="lx-add-btn">Add to Bag</button>
            </div>
          </div>
          {st.related.length > 0 && <div className="lx-sect">
            <div className="lx-sec-label">You May Also Like</div>
            <div className="lx-sec-title">Related <em>Pieces</em></div>
            <div className="lx-pgrid">{st.related.map(p => <Card key={p.id} p={p} st={st} />)}</div>
          </div>}
        </>}
      </div>

      {/* FOOTER */}
      <footer className="lx-footer">
        <div className="lx-ftgrid">
          <div className="lx-ftcol"><div className="logo">Maison Dorè</div><div className="desc">Heritage craftsmanship. Contemporary elegance. Since 1987.</div></div>
          <div className="lx-ftcol"><h5>Collection</h5><a onClick={() => st.go('shop', { cat: 'All' })}>View All</a><a onClick={() => st.go('shop', { cat: 'Tops' })}>Ready to Wear</a><a onClick={() => st.go('shop', { cat: 'Outerwear' })}>Heritage</a><a onClick={() => st.go('shop', { cat: 'Accessories' })}>Accessories</a></div>
          <div className="lx-ftcol"><h5>Maison</h5><a>Our Story</a><a>Atelier</a><a>Sustainability</a><a>Careers</a></div>
          <div className="lx-ftcol"><h5>Care</h5><a>Shipping</a><a>Returns</a><a>Size Guide</a><a>Contact</a></div>
        </div>
        <div className="lx-ftbot"><span>© 2026 Maison Dorè</span><span>Crafted with devotion</span></div>
      </footer>
    </div>
  )
}
