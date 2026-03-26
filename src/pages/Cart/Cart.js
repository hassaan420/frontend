import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const subtotal = cartItems.reduce((a, c) => a + c.price * c.quantity, 0);
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shipping;

  if (cartItems.length === 0) return (
    <>
      <div className="page-header">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">›</span>
            <span>Shopping Cart</span>
          </div>
          <h1>Shopping Cart</h1>
          <p>Your cart is empty</p>
        </div>
      </div>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '3rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <div style={{ fontSize: 80, marginBottom: 20, opacity: 0.6 }}>🛒</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 30, fontWeight: 700, textTransform: 'uppercase', marginBottom: 10, color: 'var(--text)' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.6 }}>
            Browse our collection of genuine motorcycle parts and add what you need. Cash on delivery available nationwide.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
            <button className="btn-red" onClick={() => navigate('/products')}>Shop All Parts →</button>
            <a href="https://wa.me/923160525191" target="_blank" rel="noreferrer">
              <button className="btn-outline-red">💬 Ask on WhatsApp</button>
            </a>
          </div>
          {/* Trust badges */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', padding: '1.5rem', background: 'var(--bg-soft)', borderRadius: 'var(--r-lg)', border: '1px solid var(--border)' }}>
            {[['✅', '100% Genuine'], ['💵', 'Cash on Delivery'], ['🚚', 'Fast Delivery'], ['🔄', 'Easy Returns']].map(([icon, label]) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* PAGE HEADER */}
      <div className="page-header">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span className="sep">›</span>
            <span>Shopping Cart</span>
          </div>
          <h1>Shopping Cart</h1>
          <p>{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

          {/* CART TABLE */}
          <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 64, height: 64, background: 'var(--bg-soft)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
                          {item.images?.[0]
                            ? <img src={item.images[0]} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : '🔧'
                          }
                        </div>
                        <div>
                          <div className="cart-item-brand">{item.brand}</div>
                          <div className="cart-item-name">{item.name}</div>
                          {item.compatibleWith?.length > 0 && (
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                              Fits: {item.compatibleWith.slice(0, 2).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-heading)', fontSize: 16, fontWeight: 700, color: 'var(--text)', whiteSpace: 'nowrap' }}>
                      Rs. {item.price?.toLocaleString()}
                    </td>
                    <td>
                      <div className="qty-control">
                        <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
                        <span className="qty-num">{item.quantity}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-heading)', fontSize: 18, fontWeight: 700, color: 'var(--red)', whiteSpace: 'nowrap' }}>
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </td>
                    <td>
                      <button className="remove-btn" onClick={() => removeFromCart(item._id)} aria-label="Remove item">✕</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', background: 'var(--bg-soft)' }}>
              <button className="btn-outline" onClick={() => navigate('/products')}>← Continue Shopping</button>
              <button onClick={clearCart} style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Clear Cart
              </button>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div className="cart-summary">
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>
                {shipping === 0
                  ? <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
                  : `Rs. ${shipping}`
                }
              </span>
            </div>

            {shipping > 0 && (
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: -6, marginBottom: 10, background: 'var(--warning-bg)', padding: '6px 10px', borderRadius: 'var(--r-sm)', border: '1px solid var(--warning-border)' }}>
                ⚡ Add Rs. {(2000 - subtotal).toLocaleString()} more for FREE shipping!
              </div>
            )}

            <div className="summary-row total">
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>

            {/* Payment options */}
            <div style={{ background: 'var(--bg-soft)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', padding: '12px 14px', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 600, color: 'var(--text)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Payment Options</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[['💵', 'Cash on Delivery'], ['📱', 'EasyPaisa / JazzCash'], ['🏦', 'Bank Transfer']].map(([icon, label]) => (
                  <div key={label} style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span>{icon}</span> {label}
                  </div>
                ))}
              </div>
            </div>

            <button
              className="btn-red"
              style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>

            {/* Trust badges */}
            <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[['✅', 'Genuine Parts'], ['🔄', '7-Day Return'], ['🛡️', 'Quality Checked'], ['💵', 'COD Available']].map(([icon, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-muted)", background: "var(--bg-soft)', padding: '6px 8px', borderRadius: 'var(--r-sm)', border: '1px solid var(--border)' }}>
                  <span>{icon}</span> {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;