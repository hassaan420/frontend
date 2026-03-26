import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';

const CATEGORIES = ['Engine Parts', 'Brakes & Suspension', 'Electrical & Lights', 'Body Parts & Panels', 'Tyres & Wheels', 'Oils & Lubricants', 'Accessories'];
const BRANDS = ['OutCron', 'Fixit', 'Atlas Honda', 'ISH', 'Suntek', 'Suzuki', 'Yamaha', 'United', 'Crown Fit', 'SAGA', 'Ravi', 'Super Power'];
const CAT_ICONS = { 'Engine Parts': '⚙️', 'Brakes & Suspension': '🛑', 'Electrical & Lights': '💡', 'Body Parts & Panels': '🏍️', 'Tyres & Wheels': '🔘', 'Oils & Lubricants': '🛢️', 'Accessories': '🔩' };

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [sort, setSort] = useState('');

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setSearch(p.get('search') || '');
    setCategory(p.get('category') || '');
    setBrand(p.get('brand') || '');
    setSort(p.get('sort') || '');
  }, [location.search]);

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
    const q = new URLSearchParams(location.search);
    if (nextCategory) q.set('category', nextCategory); else q.delete('category');
    if (search) q.set('search', search); else q.delete('search');
    if (brand) q.set('brand', brand); else q.delete('brand');
    if (sort) q.set('sort', sort); else q.delete('sort');
    const qs = q.toString();
    navigate(qs ? `/products?${qs}` : '/products');
  };

  const clearAll = () => {
    setSearch(''); setCategory(''); setBrand(''); setSort('');
    navigate('/products');
  };

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (category) q.set('category', category);
    if (brand) q.set('brand', brand);
    if (sort) q.set('sort', sort);
    q.set('limit', 24);
    api.get(`/products?${q.toString()}`).then(res => {
      const list = res.data.products || res.data || [];
      setProducts(list);
      setTotal(Array.isArray(list) ? list.length : (res.data.total || 0));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, category, brand, sort]);

  const activeFilters = [
    category && { label: category, clear: () => handleCategoryChange('') },
    brand && { label: brand, clear: () => setBrand('') },
    search && { label: `"${search}"`, clear: () => setSearch('') },
  ].filter(Boolean);

  return (
    <>
      {/* PAGE HEADER */}
      <div className="page-header">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">›</span>
            {category ? (
              <>
                <Link to="/products">Products</Link>
                <span className="sep">›</span>
                <span>{category}</span>
              </>
            ) : (
              <span>All Products</span>
            )}
          </div>
          <h1>{category || 'All Motorcycle Parts'}</h1>
          <p>{loading ? 'Loading products...' : `${total} product${total !== 1 ? 's' : ''} available`}</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '232px 1fr', gap: '2rem' }}>

          {/* ── SIDEBAR ── */}
          <aside style={{ position: 'sticky', top: 100, height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Filters Card */}
            <div className="admin-card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: 12, borderBottom: '2px solid var(--red)' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Filters</div>
                {activeFilters.length > 0 && (
                  <button onClick={clearAll} style={{ fontSize: 11, color: 'var(--red)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>
                    Clear All
                  </button>
                )}
              </div>

              {/* Search */}
              <div className="form-group">
                <label className="form-label">Search Parts</label>
                <input
                  className="form-input"
                  placeholder="Part name or number..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={{ fontSize: 13 }}
                />
              </div>

              {/* Brand */}
              <div className="form-group">
                <label className="form-label">Brand</label>
                <select className="form-select" value={brand} onChange={e => setBrand(e.target.value)} style={{ fontSize: 13 }}>
                  <option value="">All Brands</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Sort */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Sort By</label>
                <select className="form-select" value={sort} onChange={e => setSort(e.target.value)} style={{ fontSize: 13 }}>
                  <option value="">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* Categories Card */}
            <div className="admin-card" style={{ padding: '20px' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid var(--border)', color: 'var(--text)' }}>
                Categories
              </div>
              <div
                onClick={() => handleCategoryChange('')}
                style={{
                  padding: '8px 10px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  background: !category ? 'var(--red-subtle)' : 'transparent',
                  color: !category ? 'var(--red)' : 'var(--text-secondary)',
                  borderRadius: 'var(--r-sm)', marginBottom: 2, fontWeight: !category ? 600 : 400,
                  transition: 'all 150ms',
                }}
              >
                <span>🔩</span> All Categories
              </div>
              {CATEGORIES.map(c => (
                <div
                  key={c}
                  onClick={() => handleCategoryChange(c)}
                  style={{
                    padding: '8px 10px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                    background: category === c ? 'var(--red-subtle)' : 'transparent',
                    color: category === c ? 'var(--red)' : 'var(--text-secondary)',
                    borderRadius: 'var(--r-sm)', marginBottom: 2, fontWeight: category === c ? 600 : 400,
                    transition: 'all 150ms',
                  }}
                >
                  <span>{CAT_ICONS[c] || '›'}</span> {c}
                </div>
              ))}
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div>
            {/* Toolbar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '11px 16px', background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--r-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
                  {loading ? '...' : `${total} product${total !== 1 ? 's' : ''}`}
                </span>
                {/* Active filter chips */}
                {activeFilters.map((f, i) => (
                  <div key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'var(--red-subtle)', color: 'var(--red)', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 'var(--r-full)', cursor: 'pointer' }} onClick={f.clear}>
                    {f.label} <span style={{ fontWeight: 700 }}>×</span>
                  </div>
                ))}
              </div>
              <select
                className="form-select"
                style={{ width: 'auto', fontSize: 13, padding: '7px 12px' }}
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="">Default sorting</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {/* Products or Empty State */}
            {loading ? (
              <div className="loader-wrap"><div className="loader"></div></div>
            ) : products.length === 0 ? (
              <div className="admin-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>
                  {category ? `No parts found in "${category}"` : 'No Products Found'}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>
                  Try clearing the filters or browse all categories.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button className="btn-red" onClick={clearAll}>Clear All Filters</button>
                  <a href="https://wa.me/923160525191" target="_blank" rel="noreferrer">
                    <button className="btn-outline-red">💬 Ask on WhatsApp</button>
                  </a>
                </div>
              </div>
            ) : (
              <div className="products-grid-3">
                {products.map(product => (
                  <div className="product-card" key={product._id}>
                    <div className="product-img-box" onClick={() => navigate(`/products/${product._id}`)}>
                      {product.images?.[0]
                        ? <img src={product.images[0]} alt={product.name} />
                        : <span style={{ fontSize: 60 }}>🔧</span>
                      }
                      {product.stock === 0 && <div className="p-badge gray">Out of Stock</div>}
                      {product.stock > 0 && product.stock <= 5 && <div className="p-badge gold">Low Stock</div>}
                      <button className="wishlist-btn" aria-label="Wishlist">🤍</button>
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
        </div>
      </div>
    </>
  );
};

export default Products;