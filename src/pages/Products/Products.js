import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';

const CATEGORIES = ['Engine Parts','Brakes & Suspension','Electrical & Lights','Body Parts & Panels','Tyres & Wheels','Oils & Lubricants','Accessories'];
const BRANDS = ['OutCron','Fixit','Atlas Honda','ISH','Suntek','Suzuki','Yamaha','United','Crown Fit','SAGA','Ravi','Super Power'];

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

  // Keep local filter state in sync when the URL query changes
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setSearch(p.get('search') || '');
    setCategory(p.get('category') || '');
    setBrand(p.get('brand') || '');
    setSort(p.get('sort') || '');
  }, [location.search]);

  // Helper to change category from either the dropdown or side list
  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);

    const q = new URLSearchParams(location.search);
    if (nextCategory) q.set('category', nextCategory);
    else q.delete('category');

    if (search) q.set('search', search); else q.delete('search');
    if (brand) q.set('brand', brand); else q.delete('brand');
    if (sort) q.set('sort', sort); else q.delete('sort');

    const queryString = q.toString();
    navigate(queryString ? `/products?${queryString}` : '/products');
  };

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (category) q.set('category', category);
    if (brand) q.set('brand', brand);
    if (sort) q.set('sort', sort);
    q.set('limit', 12);
    api.get(`/products?${q.toString()}`).then(res => {
      const list = res.data.products || res.data || [];
      setProducts(list);
      setTotal(Array.isArray(list) ? list.length : (res.data.total || 0));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search, category, brand, sort]);

  return (
    <>
      <div className="page-header">
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <div className="breadcrumb"><Link to="/">Home</Link><span>›</span><span>Products</span></div>
          <h1>{category || 'All Products'}</h1>
          <p>{total} products found</p>
        </div>
      </div>

      <div style={{maxWidth:1280,margin:'0 auto',padding:'2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'240px 1fr',gap:'2rem'}}>

          <aside>
            <div className="admin-card" style={{marginBottom:'1rem'}}>
              <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:18,fontWeight:700,textTransform:'uppercase',marginBottom:'1rem',paddingBottom:10,borderBottom:'2px solid #d0021b'}}>Filters</div>
              <div className="form-group">
                <label className="form-label">Search</label>
                <input className="form-input" placeholder="Part name..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={category} onChange={e => handleCategoryChange(e.target.value)}>
                  <option value="">All Categories</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <select className="form-select" value={brand} onChange={e => setBrand(e.target.value)}>
                  <option value="">All Brands</option>
                  {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Sort By</label>
                <select className="form-select" value={sort} onChange={e => setSort(e.target.value)}>
                  <option value="">Default</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
              <button className="btn-outline-red" style={{width:'100%'}} onClick={() => { setSearch(''); setCategory(''); setBrand(''); setSort(''); }}>Clear Filters</button>
            </div>

              <div className="admin-card">
              <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:16,fontWeight:700,textTransform:'uppercase',marginBottom:'1rem',paddingBottom:8,borderBottom:'1px solid #e8e8e8'}}>Categories</div>
              {CATEGORIES.map(c => (
                <div
                  key={c}
                  onClick={() => handleCategoryChange(c)}
                  style={{padding:'8px 0',fontSize:13,cursor:'pointer',color:category===c?'#d0021b':'#666',fontWeight:category===c?600:400,borderBottom:'1px solid #f1f1f1',display:'flex',alignItems:'center',gap:6}}
                >
                  <span style={{color:'#d0021b'}}>›</span> {c}
                </div>
              ))}
            </div>
          </aside>

          <div>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',padding:'12px 16px',background:'white',border:'1px solid #e8e8e8',borderRadius:8}}>
              <span style={{fontSize:14,color:'#666'}}>{total} products</span>
              <select className="form-select" style={{width:'auto'}} value={sort} onChange={e => setSort(e.target.value)}>
                <option value="">Default sorting</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>

            {loading ? <div className="loader-wrap"><div className="loader"></div></div> : products.length === 0 ? (
              <div style={{textAlign:'center',padding:'60px 20px',color:'#999'}}>
                <div style={{fontSize:60,marginBottom:16}}>🔍</div>
                <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:24,fontWeight:700,color:'#1a1a1a',marginBottom:8}}>
                  {category
                    ? `No products available in "${category}" right now.`
                    : 'No Products Found'}
                </div>
                <button className="btn-red" style={{marginTop:16}} onClick={() => { setSearch(''); setCategory(''); setBrand(''); }}>Clear Filters</button>
              </div>
            ) : (
              <div className="products-grid-3">
                {products.map(product => (
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
        </div>
      </div>
    </>
  );
};

export default Products;