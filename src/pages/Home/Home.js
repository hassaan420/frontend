import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';

const CATEGORIES = [
  { icon: '⚙️', name: 'Engine Parts', slug: 'Engine Parts' },
  { icon: '🛑', name: 'Brakes & Suspension', slug: 'Brakes & Suspension' },
  { icon: '💡', name: 'Electrical & Lights', slug: 'Electrical & Lights' },
  { icon: '🏍️', name: 'Body Parts & Panels', slug: 'Body Parts & Panels' },
  { icon: '🔘', name: 'Tyres & Wheels', slug: 'Tyres & Wheels' },
  { icon: '🛢️', name: 'Oils & Lubricants', slug: 'Oils & Lubricants' },
  { icon: '🔩', name: 'Accessories', slug: 'Accessories' },
  { icon: '🆕', name: 'New Arrivals', slug: '' },
];

const BRANDS = ['OutCron','Fixit','Atlas Honda','ISH','Suntek','Suzuki','Yamaha','United','Crown Fit','SAGA','Ravi','Super Power'];

const TESTIMONIALS = [
  { name: 'Ahmed Raza', city: 'Islamabad', rating: 5, text: 'Ordered Honda CD70 engine parts and received them the same day. Genuine quality, exactly as described. Will definitely order again!' },
  { name: 'Bilal Hussain', city: 'Lahore', rating: 5, text: 'Best online motorcycle parts store in Pakistan. WhatsApp support is amazing — they helped me find the exact part for my Yamaha YBR.' },
  { name: 'Kamran Ali', city: 'Rawalpindi', rating: 5, text: 'Cash on delivery makes it so easy. Parts arrived well-packaged within 2 days. OutCron brake pads are top quality and at a great price.' },
];

const FAQS = [
  { q: 'Do you deliver nationwide?', a: 'Yes! We deliver to all major cities across Pakistan. Same-day delivery in Islamabad, 1–2 days for Lahore, Karachi, and other major cities, 2–3 days for remote areas.' },
  { q: 'Do you offer Cash on Delivery?', a: 'Absolutely. All orders can be paid on delivery. You only pay when you receive your parts. We also accept EasyPaisa, JazzCash, and bank transfer.' },
  { q: 'Are all parts genuine/original?', a: 'Yes, 100%. We stock OEM and genuine branded parts from Atlas Honda, Yamaha, Suzuki, OutCron, ISH, Suntek, and verified aftermarket alternatives.' },
  { q: 'How do I know if a part fits my bike?', a: 'Each product lists compatible bike models. You can also WhatsApp us at +92 316 0525191 — our team knows motorcycles and will guide you to the right part.' },
  { q: 'What is your return policy?', a: 'Easy 7-day returns. Wrong part received? Just contact us and we\'ll arrange a pickup and replacement or full refund.' },
];

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
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
      {/* ── HERO ── */}
      {heroBanners.length > 0 ? (
        <section style={{ background: currentHero?.backgroundColor || '#C0001A', minHeight: 420, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', transition: 'background .5s' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 40px)' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 2rem', position: 'relative', zIndex: 2, width: '100%' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '5px 14px', borderRadius: 2, marginBottom: '1.25rem' }}>
              <span style={{ width: 6, height: 6, background: 'white', borderRadius: '50%', display: 'inline-block' }}></span>
              Saad Hashim Auto Store
            </div>
            <h1 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 68, fontWeight: 700, lineHeight: 1, textTransform: 'uppercase', color: currentHero?.textColor || 'white', marginBottom: '1rem', maxWidth: 700 }}>
              {currentHero?.title}
            </h1>
            {currentHero?.subtitle && (
              <p style={{ color: currentHero?.textColor || 'white', opacity: 0.85, fontSize: 16, marginBottom: '2rem', maxWidth: 500, lineHeight: 1.6 }}>
                {currentHero.subtitle}
              </p>
            )}
            <button className="btn-white" onClick={() => navigate(currentHero?.buttonLink || '/products')}>
              {currentHero?.buttonText || 'Shop Now'} →
            </button>
          </div>
          {heroBanners.length > 1 && <>
            <button onClick={() => setCurrentBanner(c => c === 0 ? heroBanners.length - 1 : c - 1)} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 44, height: 44, borderRadius: '50%', fontSize: 22, cursor: 'pointer', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
            <button onClick={() => setCurrentBanner(c => (c + 1) % heroBanners.length)} style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 44, height: 44, borderRadius: '50%', fontSize: 22, cursor: 'pointer', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>›</button>
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8, zIndex: 3 }}>
              {heroBanners.map((_, i) => (
                <div key={i} onClick={() => setCurrentBanner(i)} style={{ width: i === currentBanner ? 24 : 8, height: 8, borderRadius: 4, background: 'white', opacity: i === currentBanner ? 1 : 0.5, cursor: 'pointer', transition: 'all .3s' }} />
              ))}
            </div>
          </>}
        </section>
      ) : (
        /* DEFAULT HERO */
        <section style={{ background: 'linear-gradient(135deg, #111827 0%, #1F2937 50%, #111111 100%)', minHeight: 520, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 40px)' }} />
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: '#C0001A' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem 2rem', display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem', alignItems: 'center', position: 'relative', zIndex: 2, width: '100%' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(192,0,26,0.18)', border: '1px solid rgba(192,0,26,0.4)', color: '#FF667A', fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '5px 14px', borderRadius: 4, marginBottom: '1.25rem' }}>
                <span style={{ width: 6, height: 6, background: '#C0001A', borderRadius: '50%', display: 'inline-block' }}></span>
                Pakistan's #1 Motorcycle Parts Store
              </div>
              <h1 style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 70, fontWeight: 700, lineHeight: 0.95, textTransform: 'uppercase', marginBottom: '1.25rem' }}>
                <span style={{ display: 'block', color: 'white' }}>Genuine</span>
                <span style={{ display: 'block', color: '#C0001A' }}>Bike Parts</span>
                <span style={{ display: 'block', WebkitTextStroke: '1px rgba(255,255,255,0.18)', color: 'transparent' }}>Pakistan</span>
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.75, marginBottom: '2rem', maxWidth: 480 }}>
                Premium quality spare parts for Honda, Yamaha, Suzuki motorcycles. OutCron, Fixit, Atlas Honda, ISH, Suntek & more — Cash on Delivery all across Pakistan.
              </p>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
                <button className="btn-red" onClick={() => navigate('/products')}>Shop All Parts →</button>
                <button className="btn-ghost" onClick={() => navigate('/products')}>View All Brands</button>
              </div>
              <div style={{ display: 'flex', gap: '2.5rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)', flexWrap: 'wrap' }}>
                {[['5000+', 'Products'], ['15+', 'Brands'], ['COD', 'Nationwide'], ['100%', 'Genuine']].map(([num, label]) => (
                  <div key={label}>
                    <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 28, fontWeight: 700, color: '#C0001A', display: 'block', lineHeight: 1 }}>{num}</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1.5 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Product Card */}
            <div style={{ background: 'white', borderRadius: 14, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' }}>
              <div style={{ background: '#C0001A', padding: '13px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'white', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>⭐ Featured Part</span>
                <span style={{ background: 'white', color: '#C0001A', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>20% OFF</span>
              </div>
              <div style={{ background: '#F9FAFB', height: 190, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 80 }}>🏍️</div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: 10, color: '#C0001A', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>Atlas Honda</div>
                <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 19, fontWeight: 700, marginBottom: 4, color: '#111827' }}>CD70 Engine Oil Filter</div>
                <div style={{ fontSize: 12, color: '#6B7280', marginBottom: 14 }}>Fits: Honda CD70, CG125, CB125</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 10, background: '#ECFDF5', color: '#059669', fontWeight: 700, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>✅ Genuine</span>
                  <span style={{ fontSize: 10, background: '#EFF6FF', color: '#2563EB', fontWeight: 700, padding: '3px 8px', borderRadius: 4 }}>🚚 COD Available</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 24, fontWeight: 700, color: '#C0001A' }}>Rs. 360</span>
                    <span style={{ fontSize: 13, color: '#9CA3AF', textDecoration: 'line-through', marginLeft: 8 }}>Rs. 450</span>
                  </div>
                  <button className="btn-red" style={{ padding: '8px 16px', fontSize: 12 }} onClick={() => navigate('/products')}>Shop Now</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST BAR ── */}
      <div className="trust-bar">
        <div className="trust-inner">
          {[
            ['🚚', 'Fast Delivery', 'Islamabad same day · Pakistan 1–3 days'],
            ['✅', '100% Genuine', 'Verified authentic products only'],
            ['💵', 'Cash on Delivery', 'Pay when you receive your order'],
            ['🔄', 'Easy Returns', '7-day hassle-free return policy'],
            ['🛡️', 'Quality Guarantee', 'All parts tested & verified']
          ].map(([icon, title, desc]) => (
            <div className="trust-item" key={title}>
              <div className="trust-icon-box">{icon}</div>
              <div>
                <div className="trust-title">{title}</div>
                <div className="trust-desc">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SHOP BY CATEGORY ── */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Browse by Type</div>
              <h2 className="section-title">Shop <span>Categories</span></h2>
            </div>
            <Link to="/products" className="view-all-link">View All →</Link>
          </div>
          <div className="cat-grid">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.name}
                to={cat.slug ? `/products?category=${encodeURIComponent(cat.slug)}` : '/products'}
                className="cat-card"
              >
                <div className="cat-icon-wrap">{cat.icon}</div>
                <div className="cat-name">{cat.name}</div>
                <div className="cat-count">Browse products</div>
                <div className="cat-arrow">→</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BELOW CATEGORIES BANNERS */}
      {belowCatBanners.map(b => (
        <section key={b._id} style={{ background: b.backgroundColor, padding: '40px 2rem', cursor: 'pointer' }} onClick={() => navigate(b.buttonLink || '/products')}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
            <div>
              <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 36, fontWeight: 700, textTransform: 'uppercase', color: b.textColor || 'white' }}>{b.title}</div>
              {b.subtitle && <div style={{ color: b.textColor || 'white', opacity: 0.85, fontSize: 14, marginTop: 4 }}>{b.subtitle}</div>}
            </div>
            <button className="btn-white" onClick={e => { e.stopPropagation(); navigate(b.buttonLink || '/products'); }}>{b.buttonText} →</button>
          </div>
        </section>
      ))}

      {/* ── BRANDS WE CARRY ── */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Trusted Partners</div>
              <h2 className="section-title">Brands We <span>Carry</span></h2>
            </div>
          </div>
          <div className="brands-row">
            {BRANDS.map(brand => (
              <div key={brand} className="brand-pill" onClick={() => navigate(`/products?brand=${brand}`)}>
                <span className="brand-dot"></span>
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO BANNERS */}
      {promoBanners.map(b => (
        <section key={b._id} style={{ background: b.backgroundColor, padding: '50px 2rem', position: 'relative', overflow: 'hidden' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>Special Offer</div>
              <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 48, fontWeight: 700, color: b.textColor || 'white', textTransform: 'uppercase', lineHeight: 1 }}>{b.title}</div>
              {b.subtitle && <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14, marginTop: 8 }}>{b.subtitle}</p>}
            </div>
            <button className="btn-white" onClick={() => navigate(b.buttonLink || '/products')}>{b.buttonText} →</button>
          </div>
        </section>
      ))}

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Top Picks</div>
              <h2 className="section-title">Featured <span>Products</span></h2>
            </div>
            <Link to="/products" className="view-all-link">View All →</Link>
          </div>
          {loading ? (
            <div className="loader-wrap"><div className="loader"></div></div>
          ) : (
            <div className="products-grid">
              {products.slice(0, 8).map(product => (
                <div className="product-card" key={product._id}>
                  <div className="product-img-box" onClick={() => navigate(`/products/${product._id}`)}>
                    {product.images?.[0]
                      ? <img src={product.images[0]} alt={product.name} />
                      : <span style={{ fontSize: 64 }}>🔧</span>
                    }
                    {product.stock === 0 && <div className="p-badge gray">Out of Stock</div>}
                    <button className="wishlist-btn" aria-label="Add to wishlist">🤍</button>
                  </div>
                  <div className="product-body">
                    <div className="p-brand">{product.brand}</div>
                    <div className="p-name" onClick={() => navigate(`/products/${product._id}`)}>{product.name}</div>
                    {product.compatibleWith?.length > 0 && (
                      <div className="p-compat">Fits: {product.compatibleWith.slice(0, 2).join(', ')}</div>
                    )}
                    <div className="p-footer">
                      <div className="p-price">Rs. {product.price?.toLocaleString()}</div>
                      <button
                        className="add-btn"
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        aria-label="Add to cart"
                      >+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Why Us</div>
              <h2 className="section-title">Why Choose <span>Saad Hashim</span></h2>
            </div>
          </div>
          <div className="why-grid">
            {[
              ['✅', '100% Original Parts', 'Every product is verified genuine. No fake parts, no compromises. We source directly from trusted suppliers.'],
              ['🚚', 'Fast Pakistan-Wide Delivery', 'Same-day in Islamabad. All major cities 1–2 days. Remote areas 2–3 days via reliable couriers.'],
              ['💵', 'Cash on Delivery', 'No advance payment needed. Pay only when you receive and inspect your order.'],
              ['🔧', 'Expert Advice', 'Not sure which part fits? WhatsApp us — our team knows motorcycles inside out.'],
              ['🔄', 'Easy 7-Day Returns', 'Wrong part? Return within 7 days for full refund or replacement — no questions asked.'],
              ['💬', 'WhatsApp Support', 'Real human support on WhatsApp. Fast help with orders, parts identification, and queries.'],
            ].map(([icon, title, desc]) => (
              <div className="why-card" key={title}>
                <div className="why-icon">{icon}</div>
                <div className="why-title">{title}</div>
                <div className="why-desc">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="eyebrow">Customer Reviews</div>
              <h2 className="section-title">What Our <span>Customers Say</span></h2>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            {TESTIMONIALS.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">{'★'.repeat(t.rating)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-city">📍 {t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section section-alt">
        <div className="container">
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div className="eyebrow" style={{ justifyContent: 'center' }}>Got Questions?</div>
              <h2 className="section-title">Frequently Asked <span>Questions</span></h2>
            </div>
            {FAQS.map((faq, i) => (
              <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                <div className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <h4>{faq.q}</h4>
                  <div className="faq-icon">+</div>
                </div>
                {openFaq === i && (
                  <div className="faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: '1rem' }}>Still have questions?</p>
              <a href="https://wa.me/923160525191" target="_blank" rel="noreferrer">
                <button className="btn-red">💬 Ask on WhatsApp</button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;