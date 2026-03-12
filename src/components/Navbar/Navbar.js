import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
const Navbar = () => {
  const { cartItems } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const totalItems = cartItems.reduce((a, c) => a + c.quantity, 0);
  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleSearch = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (search) q.set('search', search);
    if (category) q.set('category', category);
    const qs = q.toString();
    navigate(qs ? `/products?${qs}` : '/products');
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span>📞 <b>+92 316 0525191</b></span>
          <span>✉️ shanishakir044@gmail.com</span>
          <span>⏰ Mon–Sat: 9am–8pm</span>
        </div>
        <div className="topbar-right">
          <Link to="/orders">Track Order</Link>
          <Link to="/about">| &nbsp;About Us</Link>
          <Link to="/contact">| &nbsp;Contact</Link>
        </div>
      </div>

      <nav className="navbar">
        <div className="nav-inner">
          <Link to="/" className="logo">
            <div className="logo-badge">
              <div className="logo-badge-top">SH</div>
              <div className="logo-badge-line"></div>
            </div>
            <div className="logo-text-block">
              <span className="logo-name">Saad <span>Hashim</span></span>
              <span className="logo-tagline">Auto Store · Pakistan</span>
            </div>
          </Link>

          <form className="nav-search" onSubmit={handleSearch}>
            <select className="search-select" value={category} onChange={e => setCategory(e.target.value)}>
              <option value="">All Parts</option>
              <option value="Engine Parts">Engine Parts</option>
              <option value="Brakes & Suspension">Brakes</option>
              <option value="Electrical & Lights">Electrical</option>
              <option value="Body Parts & Panels">Body Parts</option>
              <option value="Tyres & Wheels">Tyres</option>
              <option value="Oils & Lubricants">Oils</option>
              <option value="Accessories">Accessories</option>
            </select>
            <input type="text" placeholder="Search motorcycle parts, brands..." value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit" className="search-btn">🔍</button>
          </form>

          <div className="nav-right">
            <Link to="/cart" className="nav-icon-btn">
              <span className="icon">🛒</span>
              <span className="label">Cart</span>
              {totalItems > 0 && <span className="nav-badge">{totalItems}</span>}
            </Link>
            {user ? (
              <>
                {user.isAdmin && (
                  <Link to="/admin" className="nav-icon-btn">
                    <span className="icon">⚙️</span>
                    <span className="label">Admin</span>
                  </Link>
                )}
                <button className="login-btn" onClick={logout}>Logout</button>
              </>
            ) : (
              <Link to="/login"><button className="login-btn">Login / Register</button></Link>
            )}
          </div>
        </div>

        <div className="nav-menu">
          <div className="nav-menu-inner">
            <Link to="/products" className="all-cats">☰ &nbsp;All Categories</Link>
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to={`/products?category=${encodeURIComponent('Engine Parts')}`}>Engine Parts</Link>
            <Link to={`/products?category=${encodeURIComponent('Brakes & Suspension')}`}>Brakes</Link>
            <Link to={`/products?category=${encodeURIComponent('Electrical & Lights')}`}>Electrical</Link>
            <Link to={`/products?category=${encodeURIComponent('Body Parts & Panels')}`}>Body Parts</Link>
            <Link to={`/products?category=${encodeURIComponent('Oils & Lubricants')}`}>Oils</Link>
            <Link to={`/products?category=${encodeURIComponent('Accessories')}`}>Accessories</Link>
            <Link to="/products" className="sale-link">🔥 Sale</Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;