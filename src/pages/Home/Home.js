import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';

const CATEGORIES = [
  { emoji: '⚙️', name: 'Engine Parts', slug: 'Engine Parts' },
  { emoji: '🛑', name: 'Brakes & Suspension', slug: 'Brakes & Suspension' },
  { emoji: '💡', name: 'Electrical & Lights', slug: 'Electrical & Lights' },
  { emoji: '🏍️', name: 'Body Parts & Panels', slug: 'Body Parts & Panels' },
  { emoji: '🔘', name: 'Tyres & Wheels', slug: 'Tyres & Wheels' },
  { emoji: '🛢️', name: 'Oils & Lubricants', slug: 'Oils & Lubricants' },
  { emoji: '🔩', name: 'Accessories', slug: 'Accessories' },
  { emoji: '🆕', name: 'New Arrivals', slug: '' },
];

const BRANDS = ['OutCron','Fixit','Atlas Honda','ISH','Suntek','Suzuki','Yamaha','United','Crown Fit','SAGA','Ravi','Super Power'];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/products?limit=8').then(res => {
      setProducts(res.data.products || res.data || []);
      setLoading(false);
    }).catch(() => setLoading(false));
    api.get('/banners').then(res => setBanners(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const heroBanners = banners.filter(b => b.position === 'hero');
    if (heroBanners.length <= 1) return;
    const timer = setInterval(() => setCurrentBanner(c => (c + 1) % heroBanners.length), 5000);
    return () => clearInterval(timer);
  }, [banners]);

  const heroBanners = banners.filter(b => b.position === 'hero');
  const promoBanners = banners.filter(b => b.position === 'promo_strip');
  const belowCatBanners = banners.filter(b => b.position === 'below_categories');
  const currentHero = heroBanners[currentBanner];

  return (
    <>
      {/* HERO — only shows admin banners with position=hero, otherwise default */}
      {heroBanners.length > 0 ? (
        <section style={{background:currentHero?.backgroundColor||'#d0021b',minHeight:'420px',display:'flex',alignItems:'center',position:'relative',overflow:'hidden',transition:'background .5s'}}>
          <div style={{position:'absolute',inset:0,backgroundImage:'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 40px)'}} />
          <div style={{maxWidth:1280,margin:'0 auto',padding:'4rem 2rem',position:'relative',zIndex:2,width:'100%'}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',color:'white',fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'5px 14px',borderRadius:2,marginBottom:'1.25rem'}}>
              <span style={{width:6,height:6,background:'white',borderRadius:'50%',display:'inline-block'}}></span>
              Saad Hashim Auto Store
            </div>
            <h1 style={{fontFamily:'Rajdhani,sans-serif',fontSize:68,fontWeight:700,lineHeight:1,textTransform:'uppercase',color:currentHero?.textColor||'white',marginBottom:'1rem',maxWidth:700}}>
              {currentHero?.title}
            </h1>
            {currentHero?.subtitle && (
              <p style={{color:currentHero?.textColor||'white',opacity:0.85,fontSize:16,marginBottom:'2rem',maxWidth:500,lineHeight:1.6}}>
                {currentHero.subtitle}
              </p>
            )}
            <button className="btn-white" onClick={() => navigate(currentHero?.buttonLink||'/products')}>
              {currentHero?.buttonText||'Shop Now'} →
            </button>
          </div>
          {heroBanners.length > 1 && <>
            <button onClick={() => setCurrentBanner(c => c===0?heroBanners.length-1:c-1)} style={{position:'absolute',left:20,top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.2)',border:'none',color:'white',width:44,height:44,borderRadius:'50%',fontSize:22,cursor:'pointer',zIndex:3,display:'flex',alignItems:'center',justifyContent:'center'}}>‹</button>
            <button onClick={() => setCurrentBanner(c => (c+1)%heroBanners.length)} style={{position:'absolute',right:20,top:'50%',transform:'translateY(-50%)',background:'rgba(255,255,255,0.2)',border:'none',color:'white',width:44,height:44,borderRadius:'50%',fontSize:22,cursor:'pointer',zIndex:3,display:'flex',alignItems:'center',justifyContent:'center'}}>›</button>
            <div style={{position:'absolute',bottom:20,left:'50%',transform:'translateX(-50%)',display:'flex',gap:8,zIndex:3}}>
              {heroBanners.map((_,i) => (
                <div key={i} onClick={() => setCurrentBanner(i)} style={{width:i===currentBanner?24:8,height:8,borderRadius:4,background:'white',opacity:i===currentBanner?1:0.5,cursor:'pointer',transition:'all .3s'}} />
              ))}
            </div>
          </>}
        </section>
      ) : (
        /* DEFAULT HERO — shown only when admin has no hero banners */
        <section style={{background:'linear-gradient(135deg, #1a1a1a 0%, #2d0008 40%, #1a0004 100%)',minHeight:'520px',display:'flex',alignItems:'center',position:'relative',overflow:'hidden'}}>
          <div style={{position:'absolute',inset:0,backgroundImage:'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 40px)'}} />
          <div style={{position:'absolute',left:0,top:0,bottom:0,width:5,background:'#d0021b'}} />
          <div style={{maxWidth:1280,margin:'0 auto',padding:'4rem 2rem',display:'grid',gridTemplateColumns:'1fr 400px',gap:'4rem',alignItems:'center',position:'relative',zIndex:2,width:'100%'}}>
            <div>
              <div style={{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(208,2,27,0.2)',border:'1px solid rgba(208,2,27,0.5)',color:'#ff6677',fontSize:11,fontWeight:700,letterSpacing:2,textTransform:'uppercase',padding:'5px 14px',borderRadius:2,marginBottom:'1.25rem'}}>
                <span style={{width:6,height:6,background:'#d0021b',borderRadius:'50%',display:'inline-block'}}></span>
                Pakistan's #1 Motorcycle Parts Store
              </div>
              <h1 style={{fontFamily:'Rajdhani,sans-serif',fontSize:72,fontWeight:700,lineHeight:0.95,textTransform:'uppercase',marginBottom:'1.25rem'}}>
                <span style={{display:'block',color:'white'}}>Genuine</span>
                <span style={{display:'block',color:'#d0021b'}}>Bike Parts</span>
                <span style={{display:'block',WebkitTextStroke:'1px rgba(255,255,255,0.2)',color:'transparent'}}>Pakistan</span>
              </h1>
              <p style={{color:'rgba(255,255,255,0.65)',fontSize:15,lineHeight:1.7,marginBottom:'2rem',maxWidth:480}}>
                Premium quality spare parts for Honda, Yamaha, Suzuki motorcycles. OutCron, Fixit, Atlas Honda, ISH, Suntek & more — Cash on Delivery all across Pakistan.
              </p>
              <div style={{display:'flex',gap:'1rem',marginBottom:'2.5rem'}}>
                <button className="btn-red" onClick={() => navigate('/products')}>Shop Now →</button>
                <button className="btn-ghost" onClick={() => navigate('/products')}>View All Brands</button>
              </div>
              <div style={{display:'flex',gap:'2rem',paddingTop:'2rem',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
                {[['5000+','Products'],['15+','Brands'],['COD','Nationwide'],['100%','Genuine']].map(([num,label]) => (
                  <div key={label}>
                    <span style={{fontFamily:'Rajdhani,sans-serif',fontSize:30,fontWeight:700,color:'#d0021b',display:'block',lineHeight:1}}>{num}</span>
                    <span style={{fontSize:11,color:'rgba(255,255,255,0.5)',textTransform:'uppercase',letterSpacing:1}}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{background:'white',borderRadius:12,overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,0.4)'}}>
              <div style={{background:'#d0021b',padding:'14px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <span style={{color:'white',fontSize:12,fontWeight:600,textTransform:'uppercase',letterSpacing:1}}>⭐ Featured Product</span>
                <span style={{background:'white',color:'#d0021b',fontSize:12,fontWeight:700,padding:'3px 10px',borderRadius:20}}>20% OFF</span>
              </div>
              <div style={{background:'#f8f8f8',height:200,display:'flex',alignItems:'center',justifyContent:'center',fontSize:80}}>🏍️</div>
              <div style={{padding:'18px 20px'}}>
                <div style={{fontSize:10,color:'#d0021b',fontWeight:700,letterSpacing:2,textTransform:'uppercase',marginBottom:4}}>Atlas Honda</div>
                <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:20,fontWeight:700,marginBottom:4}}>CD70 Engine Oil Filter</div>
                <div style={{fontSize:12,color:'#666',marginBottom:14}}>Fits: Honda CD70, CG125, CB125</div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <div>
                    <span style={{fontFamily:'Rajdhani,sans-serif',fontSize:26,fontWeight:700,color:'#d0021b'}}>Rs. 360</span>
                    <span style={{fontSize:13,color:'#999',textDecoration:'line-through',marginLeft:8}}>Rs. 450</span>
                  </div>
                  <button className="btn-red" style={{padding:'9px 18px',fontSize:13}} onClick={() => navigate('/products')}>Shop Now</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-inner">
          {[['🚚','Fast Delivery','Islamabad same day · Pakistan 1–3 days'],['✅','100% Genuine','Verified & authentic products only'],['💵','Cash on Delivery','Pay when you receive your order'],['🔄','Easy Returns','7-day hassle-free return policy'],['🛡️','Quality Guarantee','All parts tested & verified']].map(([icon,title,desc]) => (
            <div className="trust-item" key={title}>
              <div className="trust-icon-box">{icon}</div>
              <div><div className="trust-title">{title}</div><div className="trust-desc">{desc}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><div className="eyebrow">Browse by Type</div><h2 className="section-title">Shop <span>Categories</span></h2></div>
            <Link to="/products" className="view-all-link">View All →</Link>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.name} to={cat.slug ? `/products?category=${encodeURIComponent(cat.slug)}` : '/products'} className="cat-card">
                <div className="cat-emoji">{cat.emoji}</div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">Browse products</div>
                <div className="cat-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER — below categories position */}
      {belowCatBanners.map(b => (
        <section key={b._id} style={{background:b.backgroundColor,padding:'40px 2rem',cursor:'pointer'}} onClick={() => navigate(b.buttonLink||'/products')}>
          <div style={{maxWidth:1280,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',gap:'2rem'}}>
            <div>
              <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:36,fontWeight:700,textTransform:'uppercase',color:b.textColor||'white'}}>{b.title}</div>
              {b.subtitle && <div style={{color:b.textColor||'white',opacity:0.85,fontSize:14,marginTop:4}}>{b.subtitle}</div>}
            </div>
            <button className="btn-white" onClick={e=>{e.stopPropagation();navigate(b.buttonLink||'/products')}}>{b.buttonText} →</button>
          </div>
        </section>
      ))}

      {/* BRANDS */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div><div className="eyebrow">Trusted Brands</div><h2 className="section-title">Brands We <span>Carry</span></h2></div>
          </div>
          <div className="brands-row">
            {BRANDS.map(brand => (
              <div key={brand} className="brand-pill" onClick={() => navigate(`/products?brand=${brand}`)}>
                <span className="brand-dot"></span>{brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BANNER — promo strip position */}
      {promoBanners.map(b => (
        <section key={b._id} style={{background:b.backgroundColor,padding:'50px 2rem',position:'relative',overflow:'hidden'}}>
          <div style={{maxWidth:1280,margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between',gap:'2rem'}}>
            <div>
              <div style={{fontSize:11,fontWeight:700,letterSpacing:3,textTransform:'uppercase',color:'rgba(255,255,255,0.7)',marginBottom:8}}>Special Offer</div>
              <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:48,fontWeight:700,color:b.textColor||'white',textTransform:'uppercase',lineHeight:1}}>{b.title}</div>
              {b.subtitle && <p style={{color:'rgba(255,255,255,0.8)',fontSize:14,marginTop:8}}>{b.subtitle}</p>}
            </div>
            <button className="btn-white" onClick={() => navigate(b.buttonLink||'/products')}>{b.buttonText} →</button>
          </div>
        </section>
      ))}

      {/* FEATURED PRODUCTS */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><div className="eyebrow">Top Picks</div><h2 className="section-title">Featured <span>Products</span></h2></div>
            <Link to="/products" className="view-all-link">View All →</Link>
          </div>
          {loading ? <div className="loader-wrap"><div className="loader"></div></div> : (
            <div className="products-grid">
              {products.slice(0,8).map(product => (
                <div className="product-card" key={product._id}>
                  <div className="product-img-box" onClick={() => navigate(`/products/${product._id}`)}>
                    {product.images?.[0] ? <img src={product.images[0]} alt={product.name} style={{width:'100%',height:'100%',objectFit:'cover'}} /> : <span style={{fontSize:64}}>🔧</span>}
                    {product.stock === 0 && <div className="p-badge" style={{background:'#666'}}>Out of Stock</div>}
                    <button className="wishlist-btn">🤍</button>
                  </div>
                  <div className="product-body">
                    <div className="p-brand">{product.brand}</div>
                    <div className="p-name" onClick={() => navigate(`/products/${product._id}`)}>{product.name}</div>
                    {product.compatibleWith?.length > 0 && <div className="p-compat">Fits: {product.compatibleWith.slice(0,2).join(', ')}</div>}
                    <div className="p-footer">
                      <div className="p-price">Rs. {product.price?.toLocaleString()}</div>
                      <button className="add-btn" onClick={() => addToCart(product)} disabled={product.stock===0} style={product.stock===0?{background:'#ccc',cursor:'not-allowed'}:{}}>+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY US */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div><div className="eyebrow">Why Us</div><h2 className="section-title">Why Choose <span>Saad Hashim</span></h2></div>
          </div>
          <div className="why-grid">
            {[
              ['✅','100% Original Parts','Every product is verified genuine. No fake parts, no compromises.'],
              ['🚚','Fast Pakistan-Wide Delivery','Same-day in Islamabad. All major cities 1–2 days. Remote areas 2–3 days.'],
              ['💵','Cash on Delivery','No advance payment. Pay when you receive your order.'],
              ['🔧','Expert Advice','Not sure which part fits? WhatsApp us — we know motorcycles.'],
              ['🔄','Easy 7-Day Returns','Wrong part? Return within 7 days for full refund or replacement.'],
              ['💬','WhatsApp Support','Real human support on WhatsApp. Fast help with orders & parts.'],
            ].map(([icon,title,desc]) => (
              <div className="why-card" key={title}>
                <div className="why-icon">{icon}</div>
                <div className="why-title">{title}</div>
                <div className="why-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;