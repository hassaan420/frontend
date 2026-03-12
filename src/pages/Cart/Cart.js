import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const subtotal = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shipping;

  if (cartItems.length === 0) return (
    <div style={{textAlign:'center',padding:'100px 20px'}}>
      <div style={{fontSize:80,marginBottom:20}}>🛒</div>
      <h2 style={{fontFamily:'Rajdhani,sans-serif',fontSize:32,fontWeight:700,textTransform:'uppercase',marginBottom:12}}>Your Cart is Empty</h2>
      <p style={{color:'#666',marginBottom:24}}>Browse our products and add parts to your cart</p>
      <button className="btn-red" onClick={() => navigate('/products')}>Shop Now →</button>
    </div>
  );

  return (
    <>
      <div className="page-header">
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <div className="breadcrumb"><Link to="/">Home</Link><span>›</span><span>Cart</span></div>
          <h1>Shopping Cart</h1>
          <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div style={{maxWidth:1280,margin:'0 auto',padding:'2rem'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:'2rem',alignItems:'start'}}>
          <div className="admin-card" style={{padding:0,overflow:'hidden'}}>
            <table className="cart-table">
              <thead><tr><th>Product</th><th>Price</th><th>Quantity</th><th>Total</th><th></th></tr></thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item._id}>
                    <td>
                      <div style={{display:'flex',alignItems:'center',gap:14}}>
                        <div style={{width:60,height:60,background:'#f8f8f8',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,flexShrink:0}}>
                          {item.images?.[0] ? <img src={item.images[0]} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:8}} /> : '🔧'}
                        </div>
                        <div>
                          <div className="cart-item-brand">{item.brand}</div>
                          <div className="cart-item-name">{item.name}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{fontFamily:'Rajdhani,sans-serif',fontSize:16,fontWeight:700}}>Rs. {item.price?.toLocaleString()}</td>
                    <td>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity-1)}>−</button>
                        <span className="qty-num">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity+1)}>+</button>
                      </div>
                    </td>
                    <td style={{fontFamily:'Rajdhani,sans-serif',fontSize:18,fontWeight:700,color:'#d0021b'}}>Rs. {(item.price*item.quantity).toLocaleString()}</td>
                    <td><button className="remove-btn" onClick={() => removeFromCart(item._id)}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{padding:'16px 20px',display:'flex',justifyContent:'space-between',borderTop:'1px solid #e8e8e8'}}>
              <button className="btn-outline-red" onClick={() => navigate('/products')}>← Continue Shopping</button>
              <button onClick={clearCart} style={{background:'none',border:'none',color:'#999',fontSize:13,cursor:'pointer'}}>Clear Cart</button>
            </div>
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span>{shipping===0 ? <span style={{color:'#28a745',fontWeight:600}}>FREE</span> : `Rs. ${shipping}`}</span></div>
            {shipping > 0 && <div style={{fontSize:12,color:'#999',marginTop:-6,marginBottom:8}}>Free shipping on orders above Rs. 2,000</div>}
            <div className="summary-row total"><span>Total</span><span>Rs. {total.toLocaleString()}</span></div>
            <div style={{background:'#f8f8f8',border:'1px solid #e8e8e8',borderRadius:8,padding:'12px',marginBottom:'1.25rem',fontSize:13,color:'#666'}}>
              <div style={{fontWeight:600,color:'#1a1a1a',marginBottom:4}}>Payment Options</div>
              <div>💵 Cash on Delivery</div>
              <div>📱 EasyPaisa / JazzCash</div>
              <div>🏦 Bank Transfer</div>
            </div>
            <button className="btn-red" style={{width:'100%',justifyContent:'center',padding:'14px'}} onClick={() => navigate('/checkout')}>Proceed to Checkout →</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;