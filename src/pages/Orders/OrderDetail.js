import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/api';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/orders/${id}`).then(res => { setOrder(res.data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  const statusClass = s => ({ pending:'status-pending', processing:'status-processing', dispatched:'status-dispatched', delivered:'status-delivered', cancelled:'status-cancelled' }[s] || 'status-pending');

  if (loading) return <div className="loader-wrap"><div className="loader"></div></div>;
  if (!order) return <div style={{padding:60,textAlign:'center'}}>Order not found</div>;

  return (
    <>
      <div className="page-header">
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <div className="breadcrumb"><Link to="/">Home</Link><span>›</span><Link to="/orders">Orders</Link><span>›</span><span>#{order._id.slice(-8).toUpperCase()}</span></div>
          <h1>Order Details</h1>
        </div>
      </div>
      <div style={{maxWidth:1280,margin:'0 auto',padding:'2rem'}}>
        <div style={{background:'#fff3cd',border:'1px solid #ffeeba',borderRadius:8,padding:'16px 20px',marginBottom:'1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:20,fontWeight:700}}>Order #{order._id.slice(-8).toUpperCase()}</div>
            <div style={{fontSize:13,marginTop:2}}>{order.paymentMethod} · {order.isPaid?'✅ Paid':'⏳ Pending'}</div>
          </div>
          <span className={`status-badge ${statusClass(order.status)}`} style={{fontSize:13,padding:'6px 16px'}}>{order.status?.toUpperCase()}</span>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:'1.5rem',alignItems:'start'}}>
          <div>
            <div className="admin-card" style={{marginBottom:'1.5rem'}}>
              <div className="admin-card-title">Items Ordered</div>
              {order.items?.map((item, i) => (
                <div key={i} style={{display:'flex',justifyContent:'space-between',alignItems:'center',paddingBottom:14,marginBottom:14,borderBottom:'1px solid #f1f1f1'}}>
                  <div style={{display:'flex',gap:12,alignItems:'center'}}>
                    <div style={{width:50,height:50,background:'#f8f8f8',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',fontSize:22}}>🔧</div>
                    <div>
                      <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:16,fontWeight:700,textTransform:'uppercase'}}>{item.name}</div>
                      <div style={{fontSize:12,color:'#999'}}>Qty: {item.quantity} × Rs. {item.price?.toLocaleString()}</div>
                    </div>
                  </div>
                  <span style={{fontFamily:'Rajdhani,sans-serif',fontSize:16,fontWeight:700,color:'#d0021b'}}>Rs. {(item.price*item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="admin-card">
              <div className="admin-card-title">Shipping Address</div>
              <div style={{fontSize:14,lineHeight:1.8,color:'#555'}}>
                <div style={{fontWeight:600,color:'#1a1a1a'}}>{order.shippingAddress?.fullName}</div>
                <div>{order.shippingAddress?.phone}</div>
                <div>{order.shippingAddress?.address}</div>
                <div>{order.shippingAddress?.city}, Pakistan</div>
              </div>
            </div>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>Rs. {order.itemsPrice?.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{order.shippingPrice===0?<span style={{color:'#28a745'}}>FREE</span>:`Rs. ${order.shippingPrice}`}</span></div>
            <div className="summary-row total"><span>Total</span><span>Rs. {order.totalPrice?.toLocaleString()}</span></div>
            <div style={{marginTop:'1.5rem',padding:'12px',background:'#f8f8f8',borderRadius:8,fontSize:13,textAlign:'center',color:'#666'}}>
              Questions? WhatsApp:<br/>
              <a href="https://wa.me/923160525191" style={{color:'#d0021b',fontWeight:600,fontSize:14}}>+92 316 0525191</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;