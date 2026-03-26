import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Engine Parts', brand: '', stock: '', compatibleWith: '' });
  const [msg, setMsg] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [editMsg, setEditMsg] = useState('');
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState('');
  const [editImageUploading, setEditImageUploading] = useState(false);
  const [banners, setBanners] = useState([]);
  const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', buttonText: 'Shop Now', buttonLink: '/products', backgroundColor: '#d0021b', textColor: '#ffffff', order: 0, position: 'hero' });
  const [bannerMsg, setBannerMsg] = useState('');

  useEffect(() => {
    if (!user?.isAdmin) { navigate('/'); return; }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, oRes, bRes, uRes] = await Promise.all([
        api.get('/products?limit=100'),
        api.get('/orders'),
        api.get('/banners/all'),
        api.get('/auth/users'),
      ]);
      setProducts(pRes.data.products || pRes.data || []);
      setOrders(oRes.data || []);
      setBanners(bRes.data || []);
      setUsers(uRes.data || []);
    } catch (err) {
      console.log('Admin fetch error:', err.response?.data?.message || err.message);
    }
    setLoading(false);
  };

  // Image handlers
  const handleImageChange = (e, isEdit = false) => {
    const file = e.target.files[0];
    if (!file) return;
    if (isEdit) { setEditImageFile(file); setEditImagePreview(URL.createObjectURL(file)); }
    else { setImageFile(file); setImagePreview(URL.createObjectURL(file)); }
  };

  const handleImageUpload = async (isEdit = false) => {
    const file = isEdit ? editImageFile : imageFile;
    if (!file) return null;
    const formData = new FormData();
    formData.append('image', file);
    if (isEdit) setEditImageUploading(true); else setImageUploading(true);
    try {
      const res = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (isEdit) setEditImageUploading(false); else setImageUploading(false);
      return res.data.url;
    } catch {
      if (isEdit) setEditImageUploading(false); else setImageUploading(false);
      return null;
    }
  };

  const handleAddProduct = async () => {
    if (!form.name || !form.price || !form.brand) { setMsg('❌ Name, price and brand are required'); return; }
    try {
      let images = [];
      if (imageFile) { const url = await handleImageUpload(false); if (url) images = [url]; }
      await api.post('/products', {
        ...form, price: Number(form.price), stock: Number(form.stock) || 0,
        compatibleWith: form.compatibleWith.split(',').map(s => s.trim()).filter(Boolean),
        images
      });
      setMsg('✅ Product added!');
      setForm({ name: '', description: '', price: '', category: 'Engine Parts', brand: '', stock: '', compatibleWith: '' });
      setImageFile(null); setImagePreview('');
      fetchData();
    } catch (err) { setMsg('❌ ' + (err.response?.data?.message || 'Failed')); }
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name, description: product.description || '',
      price: product.price, category: product.category, brand: product.brand,
      stock: product.stock, compatibleWith: product.compatibleWith?.join(', ') || '',
      images: product.images || []
    });
    setEditImagePreview(''); setEditImageFile(null); setEditMsg('');
    setTab('edit_product');
  };

  const handleUpdateProduct = async () => {
    if (!editForm.name || !editForm.price || !editForm.brand) { setEditMsg('❌ Name, price and brand are required'); return; }
    try {
      let images = editForm.images || [];
      if (editImageFile) { const url = await handleImageUpload(true); if (url) images = [url, ...images]; }
      await api.put(`/products/${editProduct._id}`, {
        ...editForm, price: Number(editForm.price), stock: Number(editForm.stock) || 0,
        compatibleWith: editForm.compatibleWith.split(',').map(s => s.trim()).filter(Boolean),
        images
      });
      setEditMsg('✅ Product updated!');
      fetchData();
      setTimeout(() => setTab('products'), 1500);
    } catch (err) { setEditMsg('❌ ' + (err.response?.data?.message || 'Failed')); }
  };

  const handleRemoveEditImage = (idx) => {
    setEditForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try { await api.delete(`/products/${id}`); fetchData(); } catch { }
  };

  const handleStatus = async (orderId, status) => {
    try { await api.put(`/orders/${orderId}/status`, { status }); fetchData(); } catch { }
  };

  const handleAddBanner = async () => {
    if (!bannerForm.title) { setBannerMsg('❌ Title is required'); return; }
    try {
      await api.post('/banners', bannerForm);
      setBannerMsg('✅ Banner added!');
      setBannerForm({ title: '', subtitle: '', buttonText: 'Shop Now', buttonLink: '/products', backgroundColor: '#d0021b', textColor: '#ffffff', order: 0, position: 'hero' });
      fetchData();
    } catch (err) { setBannerMsg('❌ Failed to add banner'); }
  };

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try { await api.delete(`/banners/${id}`); fetchData(); } catch { }
  };

  const handleToggleBanner = async (id, isActive) => {
    try { await api.put(`/banners/${id}`, { isActive: !isActive }); fetchData(); } catch { }
  };

  const statusClass = s => ({ pending: 'status-pending', approved: 'status-processing', processing: 'status-processing', dispatched: 'status-dispatched', delivered: 'status-delivered', cancelled: 'status-cancelled' }[s] || 'status-pending');
  const positionLabel = p => ({ hero: '🏠 Hero (Top)', promo_strip: '🔥 Promo Strip (Middle)', below_categories: '📦 Below Categories' }[p] || p);

  // ANALYTICS
  const activeOrders = orders.filter(o => o.status !== 'cancelled');
  const totalRevenue = activeOrders.reduce((a, o) => a + (o.totalPrice || 0), 0);
  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');
  const revenueByPayment = activeOrders.reduce((acc, o) => { const m = o.paymentMethod || 'Unknown'; acc[m] = (acc[m] || 0) + (o.totalPrice || 0); return acc; }, {});
  const ordersByStatus = ['pending', 'approved', 'processing', 'dispatched', 'delivered', 'cancelled'].map(s => ({ status: s, count: orders.filter(o => o.status === s).length }));
  const productSales = {};
  activeOrders.forEach(order => { order.items?.forEach(item => { if (!productSales[item.name]) productSales[item.name] = { name: item.name, qty: 0, revenue: 0 }; productSales[item.name].qty += item.quantity; productSales[item.name].revenue += item.price * item.quantity; }); });
  const topProducts = Object.values(productSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const cityRevenue = {};
  activeOrders.forEach(o => { const c = o.shippingAddress?.city || 'Unknown'; cityRevenue[c] = (cityRevenue[c] || 0) + (o.totalPrice || 0); });
  const topCities = Object.entries(cityRevenue).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const monthlyData = {};
  activeOrders.forEach(o => { const d = new Date(o.createdAt); const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; const label = d.toLocaleDateString('en-PK', { month: 'short', year: 'numeric' }); if (!monthlyData[key]) monthlyData[key] = { label, revenue: 0, orders: 0 }; monthlyData[key].revenue += o.totalPrice || 0; monthlyData[key].orders += 1; });
  const monthlyRevenue = Object.entries(monthlyData).sort((a, b) => a[0].localeCompare(b[0])).slice(-6).map(([, v]) => v);
  const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1);
  const lowStock = products.filter(p => p.stock <= 5).sort((a, b) => a.stock - b.stock);

  // Image Upload Box Component
  const ImageUploadBox = ({ preview, onChange, uploading, label = 'Product Image' }) => (
    <div className="form-group" style={{ gridColumn: '1/-1' }}>
      <label className="form-label">{label}</label>
      <div style={{ border: '2px dashed #e8e8e8', borderRadius: 8, padding: '20px', textAlign: 'center', background: '#fafafa', cursor: 'pointer', position: 'relative' }}>
        {preview ? (
          <div>
            <img src={preview} alt="preview" style={{ maxHeight: 200, maxWidth: '100%', borderRadius: 8, marginBottom: 10 }} />
            <div style={{ fontSize: 12, color: '#28a745', fontWeight: 600 }}>✅ Image ready to upload</div>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📸</div>
            <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>Click to select image</div>
            <div style={{ fontSize: 11, color: '#999' }}>JPG, PNG, WEBP — max 5MB</div>
          </div>
        )}
        <input type="file" accept="image/*" onChange={onChange} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
      </div>
      {uploading && <div style={{ marginTop: 8, fontSize: 13, color: '#d0021b', fontWeight: 600 }}>⏳ Uploading image to Cloudinary...</div>}
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}><h1>Admin Panel</h1><p>Manage products, orders & store</p></div>
      </div>

      <div className="admin-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-title">Main</div>
          {[
            ['dashboard', '📊', 'Dashboard'],
            ['analytics', '📈', 'Analytics'],
            ['orders', '📦', 'Orders'],
            ['products', '🔧', 'Products'],
            ['add_product', '➕', 'Add Product'],
            ['banners', '🖼️', 'Banners'],
            ['users', '👥', 'Users'],
          ].map(([key, icon, label]) => (
            <button key={key} className={`admin-nav-link ${tab === key ? 'active' : ''}`} onClick={() => setTab(key)}>
              <span>{icon}</span> {label}
            </button>
          ))}
          <div className="admin-sidebar-title" style={{ marginTop: '2rem' }}>Store</div>
          <button className="admin-nav-link" onClick={() => navigate('/')}>🏠 View Store</button>
        </aside>

        <main className="admin-content">

          {/* DASHBOARD */}
          {tab === 'dashboard' && (
            <div>
              <div className="stat-cards">
                {[
                  { icon: '🔧', num: products.length, label: 'Total Products', color: '#2563EB', bg: '#EFF6FF' },
                  { icon: '📦', num: orders.length, label: 'Total Orders', color: '#7C3AED', bg: '#F5F3FF' },
                  { icon: '⏳', num: pendingOrders.length, label: 'Pending Orders', color: '#D97706', bg: '#FFFBEB' },
                  { icon: '💰', num: `Rs. ${(totalRevenue/1000).toFixed(1)}k`, label: 'Total Revenue', color: '#C0001A', bg: 'rgba(192,0,26,0.07)' },
                  { icon: '👥', num: users.length, label: 'Registered Users', color: '#059669', bg: '#ECFDF5', onClick: () => setTab('users') },
                ].map(({ icon, num, label, color, bg, onClick }) => (
                  <div className="stat-card" key={label} style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={onClick}>
                    <div className="stat-card-accent" style={{ background: color }}></div>
                    <div className="stat-card-icon" style={{ background: bg }}>{icon}</div>
                    <div className="stat-card-num" style={{ color }}>{num}</div>
                    <div className="stat-card-label">{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 'var(--r-lg)', padding: '16px 20px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--success)', marginBottom: 4 }}>✅ Delivered</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: 'var(--success)' }}>{deliveredOrders.length}</div>
                </div>
                <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', borderRadius: 'var(--r-lg)', padding: '16px 20px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--warning)', marginBottom: 4 }}>⏳ Pending</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: 'var(--warning)' }}>{pendingOrders.length}</div>
                </div>
                <div style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', borderRadius: 'var(--r-lg)', padding: '16px 20px' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'var(--error)', marginBottom: 4 }}>❌ Cancelled</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: 'var(--error)' }}>{cancelledOrders.length}</div>
                </div>
              </div>
              <div className="admin-card">
                <div className="admin-card-title">Recent Orders</div>
                {loading ? <div className="loader-wrap"><div className="loader"></div></div> : (
                  <table className="data-table">
                    <thead><tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th><th>Update</th></tr></thead>
                    <tbody>
                      {orders.slice(0, 10).map(order => (
                        <tr key={order._id}>
                          <td style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700 }}>#{order._id.slice(-8).toUpperCase()}</td>
                          <td>{order.shippingAddress?.fullName || order.user?.name}</td>
                          <td style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, color: '#d0021b' }}>Rs. {order.totalPrice?.toLocaleString()}</td>
                          <td>{order.paymentMethod}</td>
                          <td><span className={`status-badge ${statusClass(order.status)}`}>{order.status}</span></td>
                          <td>
                            <select value={order.status} onChange={e => handleStatus(order._id, e.target.value)} style={{ border: '1px solid #e8e8e8', borderRadius: 4, padding: '4px 8px', fontSize: 12, cursor: 'pointer' }}>
                              {['pending', 'approved', 'processing', 'dispatched', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {tab === 'analytics' && (
            <div>
              <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 26, fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem', paddingBottom: 12, borderBottom: '2px solid #d0021b' }}>📈 Sales Analytics & Reports</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  ['💰', 'Total Revenue', `Rs. ${totalRevenue.toLocaleString()}`, 'var(--red)'],
                  ['📦', 'Total Orders', orders.length, 'var(--info)'],
                  ['✅', 'Delivered', deliveredOrders.length, 'var(--success)'],
                  ['📊', 'Avg Order Value', `Rs. ${orders.length ? Math.round(totalRevenue / orders.length).toLocaleString() : 0}`, 'var(--warning)']
                ].map(([icon, label, value, color]) => (
                  <div key={label} className="admin-card" style={{ textAlign: 'center', borderTop: `3px solid ${color}`, paddingTop: 20 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, color }}>{value}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <div className="admin-card-title">Monthly Revenue (Last 6 Months)</div>
                {monthlyRevenue.length === 0 ? <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No data yet — place some orders first!</div> : (
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: 200, padding: '0 1rem', justifyContent: 'center' }}>
                    {monthlyRevenue.map((m, i) => (
                      <div key={i} style={{ width: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: '#d0021b' }}>Rs. {(m.revenue / 1000).toFixed(1)}k</div>
                        <div style={{ width: '100%', background: '#d0021b', borderRadius: '4px 4px 0 0', height: `${(m.revenue / maxRevenue) * 160}px`, minHeight: 4, transition: 'height .5s', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: -20, width: '100%', textAlign: 'center', fontSize: 10, color: '#666' }}>{m.orders} orders</div>
                        </div>
                        <div style={{ fontSize: 11, color: '#666', textAlign: 'center' }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="admin-card">
                  <div className="admin-card-title">Orders by Status</div>
                  {ordersByStatus.map(({ status, count }) => (
                    <div key={status} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span className={`status-badge ${statusClass(status)}`}>{status}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, marginLeft: 12 }}>
                        <div style={{ flex: 1, height: 8, background: '#f1f1f1', borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: '#d0021b', borderRadius: 4, width: `${orders.length ? (count / orders.length) * 100 : 0}%`, transition: 'width .5s' }}></div>
                        </div>
                        <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 16, minWidth: 20 }}>{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="admin-card">
                  <div className="admin-card-title">Revenue by Payment Method</div>
                  {Object.entries(revenueByPayment).length === 0 ? <div style={{ color: '#999', fontSize: 13 }}>No data yet</div> : Object.entries(revenueByPayment).map(([method, revenue]) => (
                    <div key={method} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{method}</span>
                        <span style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, color: '#d0021b' }}>Rs. {revenue.toLocaleString()}</span>
                      </div>
                      <div style={{ height: 8, background: '#f1f1f1', borderRadius: 4, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#d0021b', borderRadius: 4, width: `${(revenue / totalRevenue) * 100}%` }}></div>
                      </div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{((revenue / totalRevenue) * 100).toFixed(1)}% of total</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="admin-card">
                  <div className="admin-card-title">Top Selling Products</div>
                  {topProducts.length === 0 ? <div style={{ color: '#999', fontSize: 13 }}>No sales data yet</div> : topProducts.map((p, i) => (
                    <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #f1f1f1' }}>
                      <div style={{ width: 28, height: 28, background: i === 0 ? '#ffd700' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : '#f1f1f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 14, textTransform: 'uppercase' }}>{p.name}</div>
                        <div style={{ fontSize: 11, color: '#999' }}>{p.qty} units sold</div>
                      </div>
                      <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, color: '#d0021b', fontSize: 15 }}>Rs. {p.revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
                <div className="admin-card">
                  <div className="admin-card-title">Top Cities by Revenue</div>
                  {topCities.length === 0 ? <div style={{ color: '#999', fontSize: 13 }}>No data yet</div> : topCities.map(([city, revenue], i) => (
                    <div key={city} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid #f1f1f1' }}>
                      <div style={{ width: 28, height: 28, background: '#d0021b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{i + 1}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 15 }}>📍 {city}</div>
                        <div style={{ height: 6, background: '#f1f1f1', borderRadius: 4, marginTop: 4, overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: '#d0021b', borderRadius: 4, width: `${(revenue / topCities[0][1]) * 100}%` }}></div>
                        </div>
                      </div>
                      <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, color: '#d0021b' }}>Rs. {revenue.toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="admin-card" style={{ marginBottom: '1.5rem' }}>
                <div className="admin-card-title">⚠️ Low Stock Alert</div>
                {lowStock.length === 0 ? <div style={{ color: '#28a745', fontWeight: 600, fontSize: 14 }}>✅ All products are well stocked!</div> : (
                  <table className="data-table">
                    <thead><tr><th>Product</th><th>Brand</th><th>Category</th><th>Stock</th><th>Action</th></tr></thead>
                    <tbody>
                      {lowStock.map(p => (
                        <tr key={p._id}>
                          <td style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>{p.name}</td>
                          <td style={{ color: '#d0021b', fontWeight: 600, fontSize: 12 }}>{p.brand}</td>
                          <td style={{ fontSize: 12 }}>{p.category}</td>
                          <td><span style={{ padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 700, background: p.stock === 0 ? '#f8d7da' : '#fff3cd', color: p.stock === 0 ? '#721c24' : '#856404' }}>{p.stock === 0 ? '❌ Out of Stock' : `⚠️ ${p.stock} left`}</span></td>
                          <td><button onClick={() => setTab('products')} style={{ background: 'none', border: '1px solid #d0021b', color: '#d0021b', padding: '4px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>Manage →</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="admin-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: 12, borderBottom: '2px solid #d0021b' }}>
                  <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 20, fontWeight: 700, textTransform: 'uppercase' }}>Full Orders Report</div>
                  <div style={{ fontSize: 13, color: '#666' }}>{orders.length} orders · Rs. {totalRevenue.toLocaleString()}</div>
                </div>
                <table className="data-table">
                  <thead><tr><th>Order ID</th><th>Date</th><th>Customer</th><th>City</th><th>Payment</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, fontSize: 13 }}>#{order._id.slice(-8).toUpperCase()}</td>
                        <td style={{ fontSize: 12, color: '#666' }}>{new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td><div style={{ fontWeight: 600, fontSize: 13 }}>{order.shippingAddress?.fullName}</div><div style={{ fontSize: 11, color: '#999' }}>{order.shippingAddress?.phone}</div></td>
                        <td style={{ fontSize: 13 }}>{order.shippingAddress?.city}</td>
                        <td style={{ fontSize: 12 }}>{order.paymentMethod}</td>
                        <td style={{ fontSize: 12, color: '#666' }}>{order.items?.length} item(s)</td>
                        <td style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, color: '#d0021b' }}>Rs. {order.totalPrice?.toLocaleString()}</td>
                        <td><span className={`status-badge ${statusClass(order.status)}`}>{order.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {tab === 'orders' && (
            <div className="admin-card">
              <div className="admin-card-title">All Orders ({orders.length})</div>
              {loading ? <div className="loader-wrap"><div className="loader"></div></div> : (
                <table className="data-table">
                  <thead><tr><th>Order ID</th><th>Date</th><th>Customer</th><th>Phone</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700 }}>#{order._id.slice(-8).toUpperCase()}</td>
                        <td style={{ fontSize: 12 }}>{new Date(order.createdAt).toLocaleDateString('en-PK')}</td>
                        <td>{order.shippingAddress?.fullName}</td>
                        <td>{order.shippingAddress?.phone}</td>
                        <td style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, color: '#d0021b' }}>Rs. {order.totalPrice?.toLocaleString()}</td>
                        <td>{order.paymentMethod}</td>
                        <td>
                          <select value={order.status} onChange={e => handleStatus(order._id, e.target.value)} style={{ border: '1px solid #e8e8e8', borderRadius: 4, padding: '4px 8px', fontSize: 12 }}>
                            {['pending', 'approved', 'processing', 'dispatched', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* PRODUCTS */}
          {tab === 'products' && (
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: 12, borderBottom: '2px solid #d0021b' }}>
                <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 22, fontWeight: 700, textTransform: 'uppercase' }}>Products ({products.length})</div>
                <button className="btn-red" onClick={() => setTab('add_product')}>+ Add Product</button>
              </div>
              {loading ? <div className="loader-wrap"><div className="loader"></div></div> : (
                <table className="data-table">
                  <thead><tr><th>Image</th><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td>
                          {p.images?.[0]
                            ? <img src={p.images[0]} alt={p.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6, border: '1px solid #e8e8e8' }} />
                            : <div style={{ width: 48, height: 48, background: '#f1f1f1', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🔧</div>}
                        </td>
                        <td>
                          <div style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, textTransform: 'uppercase' }}>{p.name}</div>
                          {p.compatibleWith?.length > 0 && <div style={{ fontSize: 11, color: '#999' }}>{p.compatibleWith.slice(0, 2).join(', ')}</div>}
                        </td>
                        <td style={{ fontSize: 12, color: '#d0021b', fontWeight: 600 }}>{p.brand}</td>
                        <td style={{ fontSize: 12 }}>{p.category}</td>
                        <td style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700, color: '#d0021b' }}>Rs. {p.price?.toLocaleString()}</td>
                        <td><span style={{ padding: '3px 10px', borderRadius: 4, fontSize: 12, fontWeight: 600, background: p.stock > 5 ? '#d4edda' : p.stock > 0 ? '#fff3cd' : '#f8d7da', color: p.stock > 5 ? '#155724' : p.stock > 0 ? '#856404' : '#721c24' }}>{p.stock}</span></td>
                        <td style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => handleEditClick(p)} style={{ background: 'none', border: '1px solid #007bff', color: '#007bff', padding: '4px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>✏️ Edit</button>
                          <button onClick={() => handleDelete(p._id)} style={{ background: 'none', border: '1px solid #ffcccc', color: '#d0021b', padding: '4px 12px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {/* DANGER ZONE */}
          <div className="admin-card" style={{ borderTop: '3px solid #d0021b', marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', color: '#d0021b' }}>⚠️ Danger Zone</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>Permanently delete all orders from database. Products and users will NOT be affected.</div>
              </div>
              <button
                onClick={async () => {
                  if (!window.confirm('⚠️ Are you sure? This will permanently delete ALL orders and cannot be undone!')) return;
                  if (!window.confirm('🚨 FINAL WARNING — Delete all orders forever?')) return;
                  try {
                    await api.delete('/orders/clear/all');
                    alert('✅ All orders cleared successfully!');
                    fetchData();
                  } catch (err) {
                    alert('❌ Failed: ' + (err.response?.data?.message || err.message));
                  }
                }}
                style={{ background: '#d0021b', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                🗑️ Clear All Orders
              </button>
            </div>
          </div>
          {/* ADD PRODUCT */}
          {tab === 'add_product' && (
            <div className="admin-card" style={{ maxWidth: 700 }}>
              <div className="admin-card-title">Add New Product</div>
              {msg && <div className={`alert ${msg.includes('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Product Name *</label><input className="form-input" placeholder="e.g. Honda CD70 Engine Oil Filter" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Brand *</label><input className="form-input" placeholder="e.g. Atlas Honda" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Category *</label>
                  <select className="form-select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {['Engine Parts', 'Brakes & Suspension', 'Electrical & Lights', 'Body Parts & Panels', 'Tyres & Wheels', 'Oils & Lubricants', 'Accessories'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Price (Rs.) *</label><input className="form-input" type="number" placeholder="450" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Stock Quantity</label><input className="form-input" type="number" placeholder="50" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} /></div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Compatible With (comma separated)</label><input className="form-input" placeholder="Honda CD70, Honda CG125, Yamaha YBR" value={form.compatibleWith} onChange={e => setForm({ ...form, compatibleWith: e.target.value })} /></div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Description</label><textarea className="form-input" rows={3} placeholder="Product description..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                <ImageUploadBox preview={imagePreview} onChange={e => handleImageChange(e, false)} uploading={imageUploading} label="Product Image (optional)" />
              </div>
              <button className="btn-red" onClick={handleAddProduct} disabled={imageUploading} style={{ marginTop: '1rem', opacity: imageUploading ? 0.7 : 1 }}>
                {imageUploading ? '⏳ Uploading...' : '+ Add Product'}
              </button>
            </div>
          )}

          {/* EDIT PRODUCT */}
          {tab === 'edit_product' && editProduct && (
            <div className="admin-card" style={{ maxWidth: 700 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: 12, borderBottom: '2px solid #d0021b' }}>
                <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 22, fontWeight: 700, textTransform: 'uppercase' }}>✏️ Edit Product</div>
                <button onClick={() => setTab('products')} style={{ background: 'none', border: '1px solid #e8e8e8', padding: '6px 14px', borderRadius: 4, fontSize: 13, cursor: 'pointer' }}>← Back</button>
              </div>
              {editMsg && <div className={`alert ${editMsg.includes('✅') ? 'alert-success' : 'alert-error'}`}>{editMsg}</div>}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Product Name *</label><input className="form-input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Brand *</label><input className="form-input" value={editForm.brand} onChange={e => setEditForm({ ...editForm, brand: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Category *</label>
                  <select className="form-select" value={editForm.category} onChange={e => setEditForm({ ...editForm, category: e.target.value })}>
                    {['Engine Parts', 'Brakes & Suspension', 'Electrical & Lights', 'Body Parts & Panels', 'Tyres & Wheels', 'Oils & Lubricants', 'Accessories'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Price (Rs.) *</label><input className="form-input" type="number" value={editForm.price} onChange={e => setEditForm({ ...editForm, price: e.target.value })} /></div>
                <div className="form-group"><label className="form-label">Stock Quantity</label><input className="form-input" type="number" value={editForm.stock} onChange={e => setEditForm({ ...editForm, stock: e.target.value })} /></div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Compatible With (comma separated)</label><input className="form-input" value={editForm.compatibleWith} onChange={e => setEditForm({ ...editForm, compatibleWith: e.target.value })} /></div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Description</label><textarea className="form-input" rows={3} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} /></div>
                {editForm.images?.length > 0 && (
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Current Images</label>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {editForm.images.map((img, idx) => (
                        <div key={idx} style={{ position: 'relative' }}>
                          <img src={img} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid #e8e8e8' }} />
                          <button onClick={() => handleRemoveEditImage(idx)} style={{ position: 'absolute', top: -6, right: -6, background: '#d0021b', border: 'none', color: 'white', width: 20, height: 20, borderRadius: '50%', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <ImageUploadBox preview={editImagePreview} onChange={e => handleImageChange(e, true)} uploading={editImageUploading} label="Add New Image" />
              </div>
              <button className="btn-red" onClick={handleUpdateProduct} disabled={editImageUploading} style={{ marginTop: '1rem', opacity: editImageUploading ? 0.7 : 1 }}>
                {editImageUploading ? '⏳ Uploading...' : '💾 Save Changes'}
              </button>
            </div>
          )}

          {/* BANNERS */}
          {tab === 'banners' && (
            <div>
              <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 26, fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem', paddingBottom: 12, borderBottom: '2px solid #d0021b' }}>🖼️ Banner Management</div>
              <div className="admin-card" style={{ marginBottom: '1.5rem', maxWidth: 700 }}>
                <div className="admin-card-title">Add New Banner</div>
                {bannerMsg && <div className={`alert ${bannerMsg.includes('✅') ? 'alert-success' : 'alert-error'}`}>{bannerMsg}</div>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Banner Title *</label><input className="form-input" placeholder="e.g. Eid Sale — 20% Off All Parts" value={bannerForm.title} onChange={e => setBannerForm({ ...bannerForm, title: e.target.value })} /></div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}><label className="form-label">Subtitle</label><input className="form-input" placeholder="e.g. Genuine parts for Honda, Yamaha & more" value={bannerForm.subtitle} onChange={e => setBannerForm({ ...bannerForm, subtitle: e.target.value })} /></div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label">Where to display this banner? *</label>
                    <select className="form-select" value={bannerForm.position} onChange={e => setBannerForm({ ...bannerForm, position: e.target.value })}>
                      <option value="hero">🏠 Hero Section — Top of homepage (full width slideshow)</option>
                      <option value="promo_strip">🔥 Promo Strip — Middle of homepage (between brands & products)</option>
                      <option value="below_categories">📦 Below Categories — After category grid</option>
                    </select>
                  </div>
                  <div className="form-group"><label className="form-label">Button Text</label><input className="form-input" placeholder="Shop Now" value={bannerForm.buttonText} onChange={e => setBannerForm({ ...bannerForm, buttonText: e.target.value })} /></div>
                  <div className="form-group"><label className="form-label">Button Link</label><input className="form-input" placeholder="/products" value={bannerForm.buttonLink} onChange={e => setBannerForm({ ...bannerForm, buttonLink: e.target.value })} /></div>
                  <div className="form-group">
                    <label className="form-label">Background Color</label>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input type="color" value={bannerForm.backgroundColor} onChange={e => setBannerForm({ ...bannerForm, backgroundColor: e.target.value })} style={{ width: 50, height: 38, border: '1px solid #e8e8e8', borderRadius: 6, cursor: 'pointer', padding: 2 }} />
                      <input className="form-input" value={bannerForm.backgroundColor} onChange={e => setBannerForm({ ...bannerForm, backgroundColor: e.target.value })} style={{ flex: 1 }} />
                    </div>
                  </div>
                  <div className="form-group"><label className="form-label">Display Order</label><input className="form-input" type="number" placeholder="0" value={bannerForm.order} onChange={e => setBannerForm({ ...bannerForm, order: Number(e.target.value) })} /></div>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Live Preview</label>
                  <div style={{ background: bannerForm.backgroundColor, borderRadius: 8, padding: '24px 32px', color: bannerForm.textColor }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7, marginBottom: 6 }}>{bannerForm.position === 'hero' ? '🏠 HERO SECTION' : bannerForm.position === 'promo_strip' ? '🔥 PROMO STRIP' : '📦 BELOW CATEGORIES'}</div>
                    <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 28, fontWeight: 700, textTransform: 'uppercase' }}>{bannerForm.title || 'Banner Title'}</div>
                    <div style={{ fontSize: 14, opacity: 0.85, marginTop: 6, marginBottom: 16 }}>{bannerForm.subtitle || 'Banner subtitle goes here'}</div>
                    <div style={{ display: 'inline-block', background: 'white', color: bannerForm.backgroundColor, padding: '8px 20px', borderRadius: 5, fontWeight: 700, fontSize: 13 }}>{bannerForm.buttonText}</div>
                  </div>
                </div>
                <button className="btn-red" onClick={handleAddBanner}>+ Add Banner</button>
              </div>
              <div className="admin-card">
                <div className="admin-card-title">All Banners ({banners.length})</div>
                {banners.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}><div style={{ fontSize: 40, marginBottom: 12 }}>🖼️</div><div>No banners yet. Add your first banner above!</div></div>
                ) : banners.map(b => (
                  <div key={b._id} style={{ border: '1px solid #e8e8e8', borderRadius: 8, marginBottom: '1rem', overflow: 'hidden' }}>
                    <div style={{ background: b.backgroundColor, padding: '20px 24px', color: b.textColor }}>
                      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.7, marginBottom: 4 }}>{positionLabel(b.position)}</div>
                      <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 22, fontWeight: 700, textTransform: 'uppercase' }}>{b.title}</div>
                      {b.subtitle && <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>{b.subtitle}</div>}
                      <div style={{ display: 'inline-block', background: 'white', color: b.backgroundColor, padding: '5px 14px', borderRadius: 4, fontWeight: 700, fontSize: 12, marginTop: 10 }}>{b.buttonText}</div>
                    </div>
                    <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f8f8' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, color: '#666' }}>Order: {b.order}</span>
                        <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: b.isActive ? '#d4edda' : '#f8d7da', color: b.isActive ? '#155724' : '#721c24' }}>{b.isActive ? '✅ Active' : '❌ Hidden'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => handleToggleBanner(b._id, b.isActive)} style={{ background: 'none', border: '1px solid #007bff', color: '#007bff', padding: '5px 14px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>{b.isActive ? 'Hide' : 'Show'}</button>
                        <button onClick={() => handleDeleteBanner(b._id)} style={{ background: 'none', border: '1px solid #ffcccc', color: '#d0021b', padding: '5px 14px', borderRadius: 4, fontSize: 12, cursor: 'pointer' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* USERS */}
          {tab === 'users' && (
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: 12, borderBottom: '2px solid #d0021b' }}>
                <div style={{ fontFamily: 'Rajdhani,sans-serif', fontSize: 22, fontWeight: 700, textTransform: 'uppercase' }}>👥 Registered Users ({users.length})</div>
                <div style={{ fontSize: 13, color: '#666' }}>{users.filter(u => u.isAdmin).length} admin(s)</div>
              </div>
              {loading ? <div className="loader-wrap"><div className="loader"></div></div> : (
                <table className="data-table">
                  <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th></tr></thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td style={{ fontFamily: 'Rajdhani,sans-serif', fontWeight: 700 }}>{u.name}</td>
                        <td style={{ fontSize: 13, color: '#444' }}>{u.email}</td>
                        <td style={{ fontSize: 13 }}>{u.phone || '—'}</td>
                        <td><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, background: u.isAdmin ? '#d4edda' : '#f1f1f1', color: u.isAdmin ? '#155724' : '#666' }}>{u.isAdmin ? '🔑 Admin' : '👤 Customer'}</span></td>
                        <td style={{ fontSize: 12, color: '#999' }}>{new Date(u.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

        </main>
      </div>
    </>
  );
};

export default Admin;