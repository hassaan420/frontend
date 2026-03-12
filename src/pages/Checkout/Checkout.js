import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    paymentMethod: 'Cash on Delivery',
    walletSender: '',
    walletTxnId: '',
    bankDetails: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shipping;

  const handleSubmit = async () => {
    if (!form.fullName || !form.phone || !form.address || !form.city || !form.email) {
      setError('Please fill in all required fields including email');
      return;
    }

    // Basic validation for online payment methods
    if (form.paymentMethod === 'EasyPaisa' || form.paymentMethod === 'JazzCash') {
      if (!form.walletSender || !form.walletTxnId) {
        setError(`Please enter your ${form.paymentMethod} number and transaction ID after sending payment.`);
        return;
      }
    }
    if (form.paymentMethod === 'Bank Transfer' && !form.bankDetails) {
      setError('Please enter your bank transfer transaction reference.');
      return;
    }
    setLoading(true); setError('');
    try {
      const res = await api.post('/orders', {
        items: cartItems.map(i => ({ product: i._id, name: i.name, price: i.price, quantity: i.quantity })),
        shippingAddress: { fullName: form.fullName, phone: form.phone, address: form.address, city: form.city },
        paymentMethod: form.paymentMethod,
        paymentDetails:
          form.paymentMethod === 'Cash on Delivery'
            ? ''
            : form.paymentMethod === 'Bank Transfer'
              ? `Bank Transfer | Ref: ${form.bankDetails}`
              : `${form.paymentMethod} | From: ${form.walletSender} | Txn: ${form.walletTxnId}`,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        totalPrice: total,
        userEmail: form.email,
      });
      clearCart();
      navigate(`/orders/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setLoading(false);
    }
  };

  if (cartItems.length === 0) return (
    <div style={{textAlign:'center',padding:'80px 20px'}}>
      <h2 style={{fontFamily:'Rajdhani,sans-serif',fontSize:28,fontWeight:700}}>Cart is empty</h2>
      <button className="btn-red" style={{marginTop:16}} onClick={() => navigate('/products')}>Shop Now</button>
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <div className="breadcrumb"><Link to="/">Home</Link><span>›</span><Link to="/cart">Cart</Link><span>›</span><span>Checkout</span></div>
          <h1>Checkout</h1>
        </div>
      </div>

      <div style={{maxWidth:1280,margin:'0 auto',padding:'2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 380px',gap:'2rem',alignItems:'start'}}>
          <div>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="admin-card" style={{marginBottom:'1.5rem'}}>
              <div className="admin-card-title">Shipping Information</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={form.fullName} onChange={e => setForm({...form,fullName:e.target.value})} placeholder="Your full name" />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone / WhatsApp *</label>
                  <input className="form-input" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} placeholder="03xx xxxxxxx" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address * (for order updates)</label>
                <input className="form-input" type="email" value={form.email} onChange={e => setForm({...form,email:e.target.value})} placeholder="your@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Full Address *</label>
                <input className="form-input" value={form.address} onChange={e => setForm({...form,address:e.target.value})} placeholder="House #, Street, Area" />
              </div>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input className="form-input" value={form.city} onChange={e => setForm({...form,city:e.target.value})} placeholder="Islamabad, Lahore, Karachi..." />
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-title">Payment Method</div>
              {[
                {value:'Cash on Delivery',icon:'💵',desc:'Pay when your order arrives'},
                {value:'EasyPaisa',icon:'📱',desc:'Send online to our EasyPaisa number'},
                {value:'JazzCash',icon:'📱',desc:'Send online to our JazzCash number'},
                {value:'Bank Transfer',icon:'🏦',desc:'Transfer to our bank account'}
              ].map(opt => (
                <div key={opt.value} onClick={() => setForm({...form,paymentMethod:opt.value})} style={{border:`2px solid ${form.paymentMethod===opt.value?'#d0021b':'#e8e8e8'}`,borderRadius:8,padding:'14px 16px',marginBottom:'0.75rem',cursor:'pointer',background:form.paymentMethod===opt.value?'#fff0f2':'white',display:'flex',alignItems:'center',gap:12,transition:'all .2s'}}>
                  <span style={{fontSize:24}}>{opt.icon}</span>
                  <div><div style={{fontWeight:600,fontSize:14}}>{opt.value}</div><div style={{fontSize:12,color:'#666'}}>{opt.desc}</div></div>
                  <div style={{marginLeft:'auto',width:18,height:18,borderRadius:'50%',border:'2px solid #d0021b',background:form.paymentMethod===opt.value?'#d0021b':'white'}}></div>
                </div>
              ))}
              {form.paymentMethod==='EasyPaisa' && (
                <div className="form-group" style={{marginTop:'1rem'}}>
                  <label className="form-label">Step 1 — Send Payment</label>
                  <div style={{background:'#f8f8f8',padding:'10px 12px',borderRadius:8,fontSize:13,marginBottom:8}}>
                    Send the total amount to our EasyPaisa account:<br />
                    <strong>0300 7892478</strong> (Saad Hashim)
                  </div>
                  <label className="form-label">Step 2 — Your EasyPaisa Details</label>
                  <input className="form-input" value={form.walletSender} onChange={e => setForm({...form,walletSender:e.target.value})} placeholder="Your EasyPaisa number (03xx xxxxxxx)" />
                  <input className="form-input" style={{marginTop:8}} value={form.walletTxnId} onChange={e => setForm({...form,walletTxnId:e.target.value})} placeholder="Transaction ID" />
                </div>
              )}
              {form.paymentMethod==='JazzCash' && (
                <div className="form-group" style={{marginTop:'1rem'}}>
                  <label className="form-label">Step 1 — Send Payment</label>
                  <div style={{background:'#f8f8f8',padding:'10px 12px',borderRadius:8,fontSize:13,marginBottom:8}}>
                    Send the total amount to our JazzCash account:<br />
                    <strong>0300 7892478</strong> (Saad Hashim)
                  </div>
                  <label className="form-label">Step 2 — Your JazzCash Details</label>
                  <input className="form-input" value={form.walletSender} onChange={e => setForm({...form,walletSender:e.target.value})} placeholder="Your JazzCash number (03xx xxxxxxx)" />
                  <input className="form-input" style={{marginTop:8}} value={form.walletTxnId} onChange={e => setForm({...form,walletTxnId:e.target.value})} placeholder="Transaction ID" />
                </div>
              )}
              {form.paymentMethod==='Bank Transfer' && (
                <div className="form-group" style={{marginTop:'1rem'}}>
                  <div style={{background:'#f8f8f8',padding:'12px',borderRadius:8,marginBottom:'0.75rem',fontSize:13}}>
                    <div style={{fontWeight:600,marginBottom:4}}>Bank Details</div>
                    <div>Account Title: <strong>Saad Hashim</strong></div>
                    <div>Contact WhatsApp for account number: <strong>+92 316 0525191</strong></div>
                  </div>
                  <label className="form-label">Transaction Reference</label>
                  <input className="form-input" value={form.bankDetails} onChange={e => setForm({...form,bankDetails:e.target.value})} placeholder="Transaction ID" />
                </div>
              )}
            </div>
          </div>

          <div className="cart-summary" style={{position:'sticky',top:100}}>
            <h3>Order Summary</h3>
            {cartItems.map(item => (
              <div key={item._id} style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:10,paddingBottom:10,borderBottom:'1px solid #f1f1f1'}}>
                <div><div style={{fontWeight:600}}>{item.name}</div><div style={{color:'#999',fontSize:12}}>Qty: {item.quantity}</div></div>
                <span style={{fontWeight:700,fontFamily:'Rajdhani,sans-serif'}}>Rs. {(item.price*item.quantity).toLocaleString()}</span>
              </div>
            ))}
            <div className="summary-row"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping===0?<span style={{color:'#28a745',fontWeight:600}}>FREE</span>:`Rs. ${shipping}`}</span></div>
            <div className="summary-row total"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
            <button className="btn-red" style={{width:'100%',justifyContent:'center',padding:14,marginTop:8,opacity:loading?0.7:1}} onClick={handleSubmit} disabled={loading}>
              {loading ? 'Placing Order...' : 'Place Order →'}
            </button>
            <div style={{fontSize:12,color:'#999',textAlign:'center',marginTop:12}}>🔒 Safe & Secure · Genuine Parts Guaranteed</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;