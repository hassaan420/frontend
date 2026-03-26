import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import { useCart } from '../../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch {
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart! 🛒`);
  };

  if (loading) return (
    <div className="loader-wrap" style={{ minHeight: 400 }}>
      <div className="loader"></div>
    </div>
  );
  if (!product) return null;

  return (
    <>
      {/* PAGE HEADER */}
      <div className="page-header">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">›</span>
            <Link to="/products">Products</Link>
            <span className="sep">›</span>
            {product.category && (
              <>
                <Link to={`/products?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
                <span className="sep">›</span>
              </>
            )}
            <span>{product.name}</span>
          </div>
          <h1>{product.name}</h1>
          <p>{product.brand}</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '3rem', alignItems: 'start', marginBottom: '3rem' }}>

          {/* IMAGE */}
          <div>
            <div style={{ background: 'var(--bg-soft)', borderRadius: 'var(--r-xl)', overflow: 'hidden', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 380, position: 'relative' }}>
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={{ width: '100%', maxHeight: 480, objectFit: 'contain', padding: '1.5rem' }}
                />
              ) : (
                <div style={{ fontSize: 120, opacity: 0.3 }}>🔧</div>
              )}
              {product.stock === 0 && (
                <div style={{ position: 'absolute', top: 16, left: 16, background: 'var(--text-muted)', color: 'white', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--r-full)', textTransform: 'uppercase', letterSpacing: 1 }}>Out of Stock</div>
              )}
            </div>
            {/* Additional images thumbnails */}
            {product.images?.length > 1 && (
              <div style={{ display: 'flex', gap: 10, marginTop: 12, flexWrap: 'wrap' }}>
                {product.images.map((img, i) => (
                  <div key={i} style={{ width: 70, height: 70, background: 'var(--bg-soft)', borderRadius: 'var(--r-md)', border: '2px solid var(--border)', overflow: 'hidden', cursor: 'pointer' }}>
                    <img src={img} alt={`view ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PRODUCT INFO */}
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: 'var(--red)', fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>{product.brand}</span>
              {' · '}
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{product.category}</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.1 }}>
              {product.name}
            </h1>

            {/* Stock status */}
            <div style={{ marginBottom: '1.25rem', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {product.stock > 0 ? (
                <span style={{ fontSize: 12, background: 'var(--success-bg)', color: 'var(--success)', border: '1px solid var(--success-border)', fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--r-full)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  ✅ In Stock ({product.stock} available)
                </span>
              ) : (
                <span style={{ fontSize: 12, background: 'var(--error-bg)', color: 'var(--error)', border: '1px solid var(--error-border)', fontWeight: 700, padding: '4px 12px', borderRadius: 'var(--r-full)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  ❌ Out of Stock
                </span>
              )}
              <span style={{ fontSize: 12, background: 'var(--info-bg)', color: 'var(--info)', fontWeight: 600, padding: '4px 12px', borderRadius: 'var(--r-full)' }}>
                🚚 Nationwide Delivery
              </span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 38, fontWeight: 700, color: 'var(--red)', lineHeight: 1 }}>
                Rs. {product.price?.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Inclusive of all taxes</div>
            </div>

            {/* Compatible bikes */}
            {product.compatibleWith?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 8 }}>🏍️ Compatible Bikes</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {product.compatibleWith.map((bike, i) => (
                    <span key={i} style={{ background: 'var(--bg-light)', color: 'var(--text-secondary)', fontSize: 12, fontWeight: 500, padding: '4px 10px', borderRadius: 'var(--r-full)', border: '1px solid var(--border)' }}>
                      {bike}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            {product.stock > 0 && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-secondary)', marginBottom: 8 }}>Quantity</div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div className="qty-control" style={{ border: '1.5px solid var(--border)' }}>
                    <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                    <span className="qty-num">{quantity}</span>
                    <button className="qty-btn" onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}>+</button>
                  </div>
                  <button className="btn-red" style={{ flex: 1, justifyContent: 'center', minWidth: 160 }} onClick={handleAddToCart}>
                    🛒 Add to Cart
                  </button>
                </div>
              </div>
            )}

            {/* WhatsApp CTA */}
            <a href={`https://wa.me/923160525191?text=Hi! I'm interested in: ${product.name}`} target="_blank" rel="noreferrer" style={{ display: 'block', marginBottom: '1.25rem' }}>
              <button className="btn-outline-red" style={{ width: '100%', justifyContent: 'center' }}>
                💬 Ask on WhatsApp
              </button>
            </a>

            {/* Payment info */}
            <div style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '14px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--text-muted)', marginBottom: 10 }}>Payment Methods</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[['💵', 'Cash on Delivery'], ['📱', 'EasyPaisa'], ['📱', 'JazzCash'], ['🏦', 'Bank Transfer']].map(([icon, label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-secondary)', background: 'white', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 'var(--r-sm)' }}>
                    <span>{icon}</span> {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="admin-card">
          <div className="tabs">
            {[['description', 'Description'], ['compatibility', 'Compatibility'], ['shipping', 'Shipping & Returns']].map(([key, label]) => (
              <button key={key} className={`tab-btn ${activeTab === key ? 'active' : ''}`} onClick={() => setActiveTab(key)}>
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.75, maxWidth: 720 }}>
              {product.description || (
                <p style={{ color: 'var(--text-muted)' }}>No description available for this product.</p>
              )}
            </div>
          )}

          {activeTab === 'compatibility' && (
            <div>
              {product.compatibleWith?.length > 0 ? (
                <>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: '1rem' }}>This part is confirmed compatible with the following motorcycle models:</p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {product.compatibleWith.map((bike, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '8px 14px', fontSize: 13, fontWeight: 500 }}>
                        🏍️ {bike}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: '1.5rem', background: 'var(--info-bg)', border: '1px solid var(--info-border)', borderRadius: 'var(--r-md)', padding: '12px 16px', fontSize: 13, color: 'var(--info)' }}>
                    ℹ️ Not sure if it fits your bike? <a href="https://wa.me/923160525191" target="_blank" rel="noreferrer" style={{ fontWeight: 600, color: 'var(--red)' }}>WhatsApp us →</a>
                  </div>
                </>
              ) : (
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Compatibility information not listed. <a href="https://wa.me/923160525191" target="_blank" rel="noreferrer" style={{ color: 'var(--red)', fontWeight: 600 }}>Ask us on WhatsApp</a> for confirmation.</p>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
              {[
                ['🚚', 'Delivery Time', 'Islamabad: Same day. Major cities: 1–2 days. Remote areas: 2–3 days.'],
                ['💵', 'Cash on Delivery', 'Available on all orders. Pay when you receive your package.'],
                ['🔄', '7-Day Returns', 'Wrong or defective part? Contact us within 7 days for return/replacement.'],
                ['📦', 'Packaging', 'All parts are carefully packed to prevent damage during transit.'],
              ].map(([icon, title, desc]) => (
                <div key={title} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ width: 42, height: 42, background: 'var(--red-subtle)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text)', marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Back Button */}
        <div style={{ marginTop: '1.5rem' }}>
          <button className="btn-outline" onClick={() => navigate(-1)} style={{ color: 'var(--text-secondary)' }}>
            ← Back to Products
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;