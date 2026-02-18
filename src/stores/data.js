export const images = {
  overcoat: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80',
  bag: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
  shoes: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80',
  shirt: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
  watch: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80',
  jacket: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
  fragrance: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80',
  trousers: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&q=80',
  hoodie: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
  sneakers2: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
  tshirt: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80',
  jeans: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
  boots: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80',
  hat: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=600&q=80',
  scarf: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&q=80',
  blazer: 'https://images.unsplash.com/photo-1507679799987-c73b1c7e2682?w=600&q=80',
  leather: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80',
  knit: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80',
  accessory: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80',
  coat2: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=600&q=80',
}

export const colorMap = { White:'#fff', Black:'#111', Navy:'#1a2744', Camel:'#c4a882', Tan:'#d2b48c', Cognac:'#9a4e2e', Grey:'#888', Blue:'#3a5a8a', Pink:'#d4a5a5', Silver:'#c0c0c0', Gold:'#d4af37', Olive:'#556b2f', Charcoal:'#36454f', Khaki:'#c3b091', Cream:'#fffdd0', Forest:'#228b22', Indigo:'#3f51b5', Brown:'#6b4226', Red:'#cc2222' }

export function makeProducts(brand, m = 1) {
  return [
    { id:1, name:'Destroyed Wool Overcoat', cat:'Outerwear', price:Math.round(580*m), img:images.overcoat, desc:'Premium wool-cashmere blend with raw-edge construction. Anti-fashion that lasts forever.', sizes:['S','M','L','XL'], colors:['Black','Navy','Camel'], badge:'New' },
    { id:2, name:'Distressed Runner', cat:'Footwear', price:Math.round(180*m), oldPrice:Math.round(300*m), img:images.shoes, desc:'Deconstructed sole with exposed stitching. Comfort meets chaos.', sizes:['7','8','9','10','11','12'], colors:['White','Black','Grey'], badge:'-40%' },
    { id:3, name:'Patchwork Leather Tote', cat:'Bags', price:Math.round(340*m), img:images.bag, desc:'Reclaimed leather panels hand-stitched into a unique carryall. No two are alike.', sizes:['One Size'], colors:['Tan','Black','Cognac'], badge:'🔥 Hot' },
    { id:4, name:'Ripped Graphic Tee', cat:'Tops', price:Math.round(85*m), img:images.shirt, desc:'Oversized fit with screen-printed graphics and raw-cut hems. 100% organic cotton.', sizes:['XS','S','M','L','XL','XXL'], colors:['White','Black','Grey'] },
    { id:5, name:'Industrial Chain Watch', cat:'Accessories', price:Math.round(720*m), img:images.watch, desc:'Brushed steel case with exposed mechanism. Chain-link bracelet. Swiss movement.', sizes:['One Size'], colors:['Silver','Black','Gold'] },
    { id:6, name:'Spray Paint Bomber', cat:'Outerwear', price:Math.round(460*m), img:images.jacket, desc:'Nylon bomber with hand-applied spray paint detail. Each jacket is one-of-a-kind.', sizes:['S','M','L','XL'], colors:['Black','Olive','Navy'], badge:'Last One' },
    { id:7, name:'Cargo Deconstructed', cat:'Bottoms', price:Math.round(265*m), img:images.trousers, desc:'Relaxed cargo with exposed seams and asymmetric pockets. Washed cotton drill.', sizes:['28','30','32','34','36'], colors:['Charcoal','Khaki','Black'] },
    { id:8, name:'Gasoline EDP 100ml', cat:'Accessories', price:Math.round(120*m), oldPrice:Math.round(160*m), img:images.fragrance, desc:'Notes of burnt rubber, ozone, and wild lavender. Not for the faint-hearted.', sizes:['50ml','100ml'], colors:[], badge:'-25%' },
    { id:9, name:'Washed Basic Crew', cat:'Tops', price:Math.round(75*m), img:images.tshirt, desc:'Enzyme-washed heavyweight cotton. The foundation of every outfit.', sizes:['XS','S','M','L','XL','XXL'], colors:['White','Black','Grey','Navy'] },
    { id:10, name:'Acid Wash Straight', cat:'Bottoms', price:Math.round(225*m), img:images.jeans, desc:'14oz Japanese denim with acid wash treatment. Straight leg, mid-rise.', sizes:['28','30','32','34','36'], colors:['Indigo','Black'] },
    { id:11, name:'Combat Boot Raw', cat:'Footwear', price:Math.round(380*m), img:images.boots, desc:'Full-grain leather with Vibram sole. Goodyear welted for life.', sizes:['7','8','9','10','11','12'], colors:['Black','Brown'], badge:'Limited' },
    { id:12, name:'Duct Tape Messenger', cat:'Bags', price:Math.round(195*m), img:images.accessory, desc:'Reinforced canvas with signature duct tape detail. Water-resistant.', sizes:['One Size'], colors:['Black','Grey'] },
    { id:13, name:'Oversized Hoodie', cat:'Tops', price:Math.round(165*m), img:images.hoodie, desc:'480gsm organic cotton french terry. Dropped shoulders, kangaroo pocket.', sizes:['S','M','L','XL','XXL'], colors:['Black','Grey','Navy'] },
    { id:14, name:'Voltage Bomber', cat:'Outerwear', price:Math.round(540*m), img:images.leather, desc:'Vegetable-tanned lambskin with electric color-blocked panels.', sizes:['S','M','L','XL'], colors:['Black','Brown'] },
    { id:15, name:'Signal Knit', cat:'Tops', price:Math.round(175*m), img:images.knit, desc:'Mohair-wool blend with high-contrast graphic intarsia pattern.', sizes:['S','M','L','XL'], colors:['Cream','Black'] },
    { id:16, name:'Retro Runner V2', cat:'Footwear', price:Math.round(225*m), img:images.sneakers2, desc:'Chunky sole with suede and mesh upper. 90s-inspired silhouette.', sizes:['7','8','9','10','11'], colors:['White','Black'] },
    { id:17, name:'Wool Beanie', cat:'Accessories', price:Math.round(55*m), img:images.hat, desc:'Merino wool ribbed beanie. Unisex. One size fits all.', sizes:['One Size'], colors:['Black','Grey','Navy'] },
    { id:18, name:'Cashmere Scarf', cat:'Accessories', price:Math.round(195*m), img:images.scarf, desc:'Pure cashmere with frayed edges. A study in controlled imperfection.', sizes:['One Size'], colors:['Camel','Grey','Black'] },
    { id:19, name:'Deconstructed Blazer', cat:'Outerwear', price:Math.round(480*m), img:images.blazer, desc:'Italian wool with raw-edge lapels and exposed construction. Half-lined.', sizes:['36','38','40','42','44'], colors:['Charcoal','Navy','Black'] },
    { id:20, name:'Trench Coat Raw', cat:'Outerwear', price:Math.round(620*m), img:images.coat2, desc:'Gabardine trench with deconstructed collar and asymmetric belt.', sizes:['S','M','L','XL'], colors:['Khaki','Navy','Black'] },
  ]
}

export const cats = ['All','Outerwear','Tops','Bottoms','Footwear','Accessories','Bags']
