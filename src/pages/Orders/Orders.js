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
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg('❌ Passwords do not match'); return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordMsg('❌ Password must be at least 6 characters'); return;
    }
    setPasswordMsg('');
    try {
      await api.put('/auth/profile', { password: passwordForm.newPassword });
      setPasswordMsg('✅ Password updated successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMsg('❌ ' + (err.response?.data?.message || 'Failed to update password'));
    }
  };

  return (
    <>
      <div className="page-header">
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <div className="breadcrumb"><Link to="/">Home</Link><span>›</span><span>My Dashboard</span></div>
          <h1>My Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>
      </div>

      <div style={{maxWidth:1280,margin:'0 auto',padding:'2rem',display:'grid',gridTemplateColumns:'240px 1fr',gap:'2rem',alignItems:'start'}}>

        {/* SIDEBAR */}
        <div>
          {/* Profile Card */}
          <div className="admin-card" style={{textAlign:'center',marginBottom:'1rem',padding:'24px 16px'}}>
            <div style={{width:70,height:70,background:'#d0021b',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,color:'white',fontFamily:'Rajdhani,sans-serif',fontWeight:700,margin:'0 auto 12px'}}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:18,fontWeight:700,textTransform:'uppercase'}}>{user?.name}</div>
            <div style={{fontSize:12,color:'#999',marginTop:4}}>{user?.email}</div>
            <div style={{marginTop:12,padding:'6px 12px',background:'#f0fff4',border:'1px solid #c3e6cb',borderRadius:4,fontSize:12,color:'#155724',fontWeight:600}}>
              ✅ Active Customer
            </div>
          </div>

          {/* Nav */}
          <div className="admin-card" style={{padding:0,overflow:'hidden'}}>
            {[
              ['orders','📦','My Orders'],
              ['tracking','🚚','Track Orders'],
              ['profile','👤','My Profile'],
              ['password','🔒','Change Password'],
            ].map(([key,icon,label]) => (
              <button key={key} onClick={() => setTab(key)} style={{display:'flex',alignItems:'center',gap:10,padding:'13px 18px',background:tab===key?'#d0021b':'white',color:tab===key?'white':'#444',border:'none',borderBottom:'1px solid #f1f1f1',width:'100%',textAlign:'left',fontSize:14,fontWeight:tab===key?600:400,cursor:'pointer',transition:'all .2s'}}>
                <span>{icon}</span> {label}
              </button>
            ))}
            <button onClick={() => navigate('/')} style={{display:'flex',alignItems:'center',gap:10,padding:'13px 18px',background:'white',color:'#444',border:'none',width:'100%',textAlign:'left',fontSize:14,cursor:'pointer'}}>
              🛒 Continue Shopping
            </button>
          </div>

          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem',marginTop:'1rem'}}>
            <div className="admin-card" style={{textAlign:'center',padding:'16px 10px'}}>
              <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:28,fontWeight:700,color:'#d0021b'}}>{orders.length}</div>
              <div style={{fontSize:11,color:'#999',textTransform:'uppercase',letterSpacing:1}}>Orders</div>
            </div>
            <div className="admin-card" style={{textAlign:'center',padding:'16px 10px'}}>
              <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:28,fontWeight:700,color:'#d0021b'}}>
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div style={{fontSize:11,color:'#999',textTransform:'uppercase',letterSpacing:1}}>Delivered</div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div>

          {/* MY ORDERS TAB */}
          {tab === 'orders' && (
            <div>
              <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:24,fontWeight:700,textTransform:'uppercase',marginBottom:'1.5rem',paddingBottom:12,borderBottom:'2px solid #d0021b'}}>
                My Orders ({orders.length})
              </div>
              {loading ? <div className="loader-wrap"><div className="loader"></div></div> :
               orders.length === 0 ? (
                <div style={{textAlign:'center',padding:'60px 20px'}}>
                  <div style={{fontSize:60,marginBottom:16}}>📦</div>
                  <h2 style={{fontFamily:'Rajdhani,sans-serif',fontSize:28,fontWeight:700}}>No Orders Yet</h2>
                  <button className="btn-red" style={{marginTop:16}} onClick={() => navigate('/products')}>Shop Now →</button>
                </div>
              ) : orders.map(order => (
                <div key={order._id} className="admin-card" style={{marginBottom:'1rem',padding:0,overflow:'hidden'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'14px 20px',background:'#f8f8f8',borderBottom:'1px solid #e8e8e8'}}>
                    <div>
                      <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:16,fontWeight:700}}>
                        Order #{order._id.slice(-8).toUpperCase()}
                      </div>
                      <div style={{fontSize:12,color:'#999',marginTop:2}}>
                        {new Date(order.createdAt).toLocaleDateString('en-PK',{day:'numeric',month:'long',year:'numeric'})}
                      </div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                      <span className={`status-badge ${statusClass(order.status)}`}>{order.status}</span>
                      <span style={{fontFamily:'Rajdhani,sans-serif',fontSize:18,fontWeight:700,color:'#d0021b'}}>
                        Rs. {order.totalPrice?.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div style={{padding:'12px 20px',borderBottom:'1px solid #f1f1f1'}}>
                    {order.items?.slice(0,2).map((item,i) => (
                      <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:13,color:'#555',marginBottom:4}}>
                        <span>🔧 {item.name} × {item.quantity}</span>
                        <span style={{fontWeight:600}}>Rs. {(item.price*item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    {order.items?.length > 2 && <div style={{fontSize:12,color:'#999'}}>+{order.items.length-2} more items</div>}
                  </div>

                  <div style={{padding:'12px 20px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontSize:13,color:'#666'}}>{order.paymentMethod} · {order.shippingAddress?.city}</div>
                    <div style={{display:'flex',gap:'0.75rem'}}>
                      <button className="btn-outline-red" style={{padding:'7px 16px',fontSize:13}} onClick={() => { setTab('tracking'); }}>
                        Track →
                      </button>
                      <button className="btn-red" style={{padding:'7px 16px',fontSize:13}} onClick={() => navigate(`/orders/${order._id}`)}>
                        Details →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TRACKING TAB */}
          {tab === 'tracking' && (
            <div>
              <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:24,fontWeight:700,textTransform:'uppercase',marginBottom:'1.5rem',paddingBottom:12,borderBottom:'2px solid #d0021b'}}>
                Track Your Orders
              </div>
              {loading ? <div className="loader-wrap"><div className="loader"></div></div> :
               orders.length === 0 ? (
                <div style={{textAlign:'center',padding:'60px'}}>
                  <div style={{fontSize:60}}>📦</div>
                  <p style={{color:'#999',marginTop:16}}>No orders to track</p>
                </div>
              ) : orders.map(order => (
                <div key={order._id} className="admin-card" style={{marginBottom:'1.5rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem'}}>
                    <div>
                      <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:18,fontWeight:700}}>Order #{order._id.slice(-8).toUpperCase()}</div>
                      <div style={{fontSize:12,color:'#999'}}>{new Date(order.createdAt).toLocaleDateString('en-PK',{day:'numeric',month:'long',year:'numeric'})}</div>
                    </div>
                    <span className={`status-badge ${statusClass(order.status)}`} style={{fontSize:13,padding:'6px 14px'}}>{order.status?.toUpperCase()}</span>
                  </div>

                  {/* Progress Bar */}
                  {order.status !== 'cancelled' ? (
                    <div style={{position:'relative',marginBottom:'1rem'}}>
                      {/* Line */}
                      <div style={{position:'absolute',top:16,left:'10%',right:'10%',height:3,background:'#e8e8e8',zIndex:0}}></div>
                      <div style={{position:'absolute',top:16,left:'10%',height:3,background:'#d0021b',zIndex:1,width:`${Math.max(0,(getStepIndex(order.status)/(statusSteps.length-1))*80)}%`,transition:'width .5s'}}></div>

                      {/* Steps */}
                      <div style={{display:'flex',justifyContent:'space-between',position:'relative',zIndex:2}}>
                        {[
                          ['📋','Pending'],
                          ['✅','Approved'],
                          ['⚙️','Processing'],
                          ['🚚','Dispatched'],
                          ['📦','Delivered'],
                        ].map(([icon,label],i) => {
                          const done = getStepIndex(order.status) >= i;
                          return (
                            <div key={label} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
                              <div style={{width:34,height:34,borderRadius:'50%',background:done?'#d0021b':'#e8e8e8',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,border:`3px solid ${done?'#d0021b':'#e8e8e8'}`,transition:'all .3s'}}>
                                {done ? '✓' : icon}
                              </div>
                              <div style={{fontSize:10,fontWeight:600,textTransform:'uppercase',letterSpacing:0.5,color:done?'#d0021b':'#999',textAlign:'center'}}>{label}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div style={{background:'#f8d7da',border:'1px solid #f5c6cb',borderRadius:8,padding:'12px 16px',color:'#721c24',fontSize:14}}>
                      ❌ This order was cancelled.
                    </div>
                  )}

                  <div style={{marginTop:'1rem',fontSize:13,color:'#666',display:'flex',justifyContent:'space-between'}}>
                    <span>📍 {order.shippingAddress?.address}, {order.shippingAddress?.city}</span>
                    <span style={{fontFamily:'Rajdhani,sans-serif',fontWeight:700,color:'#d0021b'}}>Rs. {order.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROFILE TAB */}
          {tab === 'profile' && (
            <div className="admin-card" style={{maxWidth:600}}>
              <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:22,fontWeight:700,textTransform:'uppercase',marginBottom:'1.5rem',paddingBottom:12,borderBottom:'2px solid #d0021b'}}>
                My Profile
              </div>
              {profileMsg && <div className={`alert ${profileMsg.includes('✅')?'alert-success':'alert-error'}`}>{profileMsg}</div>}
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-input" value={profile.name} onChange={e => setProfile({...profile,name:e.target.value})} placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" value={profile.email} onChange={e => setProfile({...profile,email:e.target.value})} placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone / WhatsApp</label>
                <input className="form-input" value={profile.phone} onChange={e => setProfile({...profile,phone:e.target.value})} placeholder="03xx xxxxxxx" />
              </div>
              <button className="btn-red" onClick={handleProfileSave} disabled={profileLoading} style={{opacity:profileLoading?0.7:1}}>
                {profileLoading ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          )}

          {/* PASSWORD TAB */}
          {tab === 'password' && (
            <div className="admin-card" style={{maxWidth:600}}>
              <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:22,fontWeight:700,textTransform:'uppercase',marginBottom:'1.5rem',paddingBottom:12,borderBottom:'2px solid #d0021b'}}>
                Change Password
              </div>
              {passwordMsg && <div className={`alert ${passwordMsg.includes('✅')?'alert-success':'alert-error'}`}>{passwordMsg}</div>}
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({...passwordForm,newPassword:e.target.value})} placeholder="Min 6 characters" />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input className="form-input" type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({...passwordForm,confirmPassword:e.target.value})} placeholder="Repeat new password" />
              </div>
              <button className="btn-red" onClick={handlePasswordSave}>
                Update Password
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Orders;