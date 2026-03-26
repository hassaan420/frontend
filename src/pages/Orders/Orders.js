import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('orders');
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordMsg, setPasswordMsg] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    setProfile({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
    api.get('/orders/myorders')
      .then(res => { setOrders(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user, navigate]);

  const statusClass = s => ({
    pending: 'status-pending',
    approved: 'status-processing',
    processing: 'status-processing',
    dispatched: 'status-dispatched',
    delivered: 'status-delivered',
    cancelled: 'status-cancelled'
  }[s] || 'status-pending');

  const statusSteps = ['pending', 'approved', 'processing', 'dispatched', 'delivered'];
  const getStepIndex = (status) => statusSteps.indexOf(status);

  const handleProfileSave = async () => {
    setProfileLoading(true); setProfileMsg('');
    try {
      await api.put('/auth/profile', profile);
      setProfileMsg('✅ Profile updated successfully!');
    } catch (err) {
      setProfileMsg('❌ ' + (err.response?.data?.message || 'Failed to update'));
    }
    setProfileLoading(false);
  };

  const handlePasswordSave = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPasswordMsg('❌ Passwords do not match'); return; }
    if (passwordForm.newPassword.length < 6) { setPasswordMsg('❌ Password must be at least 6 characters'); return; }
    setPasswordMsg('');
    try {
      await api.put('/auth/profile', { password: passwordForm.newPassword });
      setPasswordMsg('✅ Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg('❌ ' + (err.response?.data?.message || 'Failed to update password'));
    }
  };

  const navItems = [
    ['orders', '📦', 'My Orders'],
    ['tracking', '🚚', 'Track Orders'],
    ['profile', '👤', 'My Profile'],
    ['password', '🔒', 'Change Password'],
  ];

  return (
    <>
      <div className="page-header">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link><span className="sep">›</span><span>My Dashboard</span>
          </div>
          <h1>My Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem', alignItems: 'start' }}>

        {/* ── SIDEBAR ── */}
        <div>
          {/* Profile Card */}
          <div className="admin-card" style={{ textAlign: 'center', marginBottom: '1rem', padding: '24px 16px' }}>
            <div style={{ width: 64, height: 64, background: 'var(--red)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, color: 'white', fontFamily: 'var(--font-heading)', fontWeight: 700, margin: '0 auto 12px' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 17, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>{user?.name}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{user?.email}</div>
            <div style={{ marginTop: 12, display: 'inline-block', padding: '4px 12px', background: 'var(--success-bg)', border: '1px solid var(--success-border)', borderRadius: 'var(--r-full)', fontSize: 11, color: 'var(--success)', fontWeight: 700 }}>
              ✅ Active Customer
            </div>
          </div>

          {/* Nav */}
          <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            {navItems.map(([key, icon, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: tab === key ? 'var(--red-subtle)' : 'white', color: tab === key ? 'var(--red)' : 'var(--text-secondary)', border: 'none', borderBottom: '1px solid var(--border)', borderLeft: `3px solid ${tab === key ? 'var(--red)' : 'transparent'}`, width: '100%', textAlign: 'left', fontSize: 13, fontWeight: tab === key ? 600 : 400, cursor: 'pointer', transition: 'all .2s' }}>
                <span>{icon}</span> {label}
              </button>
            ))}
            <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', background: 'white', color: 'var(--text-muted)', border: 'none', width: '100%', textAlign: 'left', fontSize: 13, cursor: 'pointer', transition: 'background .2s' }}>
              🛒 Continue Shopping
            </button>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
            {[
              ['📦', orders.length, 'Orders'],
              ['✅', orders.filter(o => o.status === 'delivered').length, 'Delivered'],
            ].map(([icon, num, label]) => (
              <div key={label} className="admin-card" style={{ textAlign: 'center', padding: '14px 10px' }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700, color: 'var(--red)', lineHeight: 1 }}>{num}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 3 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div>

          {/* ORDERS TAB */}
          {tab === 'orders' && (
            <div>
              <div className="admin-card-title" style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem', paddingBottom: 12, borderBottom: '2px solid var(--red)', color: 'var(--text)' }}>
                My Orders ({orders.length})
              </div>
              {loading ? (
                <div className="loader-wrap"><div className="loader"></div></div>
              ) : orders.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
                  <div style={{ fontSize: 56, marginBottom: 16 }}>📦</div>
                  <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 28, fontWeight: 700 }}>No Orders Yet</h2>
                  <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px' }}>Browse our products and place your first order.</p>
                  <button className="btn-red" onClick={() => navigate('/products')}>Shop Now →</button>
                </div>
              ) : orders.map(order => (
                <div key={order._id} className="admin-card" style={{ marginBottom: '1rem', padding: 0, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', background: 'var(--bg-soft)', borderBottom: '1px solid var(--border)' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700 }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className={`status-badge ${statusClass(order.status)}`}>{order.status}</span>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--red)' }}>
                        Rs. {order.totalPrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
                    {order.items?.slice(0, 2).map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 4 }}>
                        <span>🔧 {item.name} × {item.quantity}</span>
                        <span style={{ fontWeight: 600 }}>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    {order.items?.length > 2 && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>+{order.items.length - 2} more items</div>}
                  </div>
                  <div style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{order.paymentMethod} · {order.shippingAddress?.city}</div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button className="btn-outline-red" style={{ padding: '7px 16px', fontSize: 12 }} onClick={() => setTab('tracking')}>Track →</button>
                      <button className="btn-red" style={{ padding: '7px 16px', fontSize: 12 }} onClick={() => navigate(`/orders/${order._id}`)}>Details →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TRACKING TAB */}
          {tab === 'tracking' && (
            <div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: 24, fontWeight: 700, textTransform: 'uppercase', marginBottom: '1.5rem', paddingBottom: 12, borderBottom: '2px solid var(--red)' }}>
                Track Your Orders
              </div>
              {loading ? <div className="loader-wrap"><div className="loader"></div></div> :
               orders.length === 0 ? (
                <div className="admin-card" style={{ textAlign: 'center', padding: 60 }}>
                  <div style={{ fontSize: 56 }}>📦</div>
                  <p style={{ color: 'var(--text-muted)', marginTop: 16 }}>No orders to track</p>
                </div>
              ) : orders.map(order => (
                <div key={order._id} className="admin-card" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700 }}>Order #{order._id.slice(-8).toUpperCase()}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </div>
                    <span className={`status-badge ${statusClass(order.status)}`}>{order.status?.toUpperCase()}</span>
                  </div>

                  {order.status !== 'cancelled' ? (
                    <div style={{ position: 'relative', marginBottom: '1rem', paddingTop: '0.5rem' }}>
                      <div style={{ position: 'absolute', top: 22, left: '10%', right: '10%', height: 3, background: 'var(--border)', zIndex: 0 }}></div>
                      <div style={{ position: 'absolute', top: 22, left: '10%', height: 3, background: 'var(--red)', zIndex: 1, width: `${Math.max(0, (getStepIndex(order.status) / (statusSteps.length - 1)) * 80)}%`, transition: 'width .5s' }}></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                        {[['📋', 'Pending'], ['✅', 'Approved'], ['⚙️', 'Processing'], ['🚚', 'Dispatched'], ['📦', 'Delivered']].map(([icon, label], i) => {
                          const done = getStepIndex(order.status) >= i;
                          return (
                            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                              <div style={{ width: 36, height: 36, borderRadius: '50%', background: done ? 'var(--red)' : 'var(--border)', color: done ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, border: `3px solid ${done ? 'var(--red)' : 'var(--border)'}`, transition: 'all .3s' }}>
                                {done ? '✓' : icon}
                              </div>
                              <div style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: done ? 'var(--red)' : 'var(--text-muted)', textAlign: 'center' }}>{label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="alert alert-error">❌ This order was cancelled.</div>
                  )}

                  <div style={{ marginTop: '1rem', fontSize: 13, color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                    <span>📍 {order.shippingAddress?.address}, {order.shippingAddress?.city}</span>
                    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--red)' }}>Rs. {order.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROFILE TAB */}
          {tab === 'profile' && (
            <div className="admin-card" style={{ maxWidth: 600 }}>
              <div className="admin-card-title">My Profile</div>
              {profileMsg && <div className={`alert ${profileMsg.includes('✅') ? 'alert-success' : 'alert-error'}`}>{profileMsg}</div>}
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone / WhatsApp</label>
                <input className="form-input" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="03xx xxxxxxx" />
              </div>
              <button className="btn-red" onClick={handleProfileSave} disabled={profileLoading} style={{ opacity: profileLoading ? 0.7 : 1 }}>
                {profileLoading ? '⏳ Saving...' : 'Save Profile'}
              </button>
            </div>
          )}

          {/* PASSWORD TAB */}
          {tab === 'password' && (
            <div className="admin-card" style={{ maxWidth: 600 }}>
              <div className="admin-card-title">Change Password</div>
              {passwordMsg && <div className={`alert ${passwordMsg.includes('✅') ? 'alert-success' : 'alert-error'}`}>{passwordMsg}</div>}
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="Min 6 characters" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input className="form-input" type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} placeholder="Repeat new password" />
              </div>
              <button className="btn-red" onClick={handlePasswordSave}>Update Password</button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;