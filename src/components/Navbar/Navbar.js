import { useState, useRef, useEffect } from 'react';
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef(null);

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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <>
      {/* TOP UTILITY BAR */}
      <div className="topbar">
        <div className="topbar-left">
          <span>📞 <b>+92 316 0525191</b></span>
          <span className="topbar-divider">|</span>
          <span>✉️ shanishakir044@gmail.com</span>
          <span className="topbar-divider">|</span>
          <span>⏰ Mon–Sat: 9am–8pm PKT</span>
        </div>
        <div className="topbar-right">
          <Link to="/orders">Track Order</Link>
          <span className="topbar-divider">|</span>
          <Link to="/about">About Us</Link>
          <span className="topbar-divider">|</span>
          <Link to="/contact">Contact</Link>
        </div>
      </div>

      {/* MAIN HEADER */}
      <nav className="navbar">
        <div className="nav-inner">
          {/* Logo */}
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

          {/* Search Bar */}
          <form className="nav-search" onSubmit={handleSearch}>
            <select
              className="search-select"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="">All Parts</option>
              <option value="Engine Parts">Engine Parts</option>
              <option value="Brakes & Suspension">Brakes</option>
              <option value="Electrical & Lights">Electrical</option>
              <option value="Body Parts & Panels">Body Parts</option>
              <option value="Tyres & Wheels">Tyres</option>
              <option value="Oils & Lubricants">Oils</option>
              <option value="Accessories">Accessories</option>
            </select>
            <input
              type="text"
              placeholder="Search motorcycle parts, brands..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button type="submit" className="search-btn" aria-label="Search">
              🔍
            </button>
          </form>

          {/* Right Actions */}
          <div className="nav-right">
            {/* Cart */}
            <Link to="/cart" className="nav-icon-btn" aria-label="Shopping cart">
              <span className="icon">🛒</span>
              <span className="label">Cart</span>
              {totalItems > 0 && <span className="nav-badge">{totalItems}</span>}
            </Link>

            {user ? (
              <>
                {/* Admin shortcut */}
                {user.isAdmin && (
                  <Link to="/admin" className="nav-icon-btn" aria-label="Admin panel">
                    <span className="icon">⚙️</span>
                    <span className="label">Admin</span>
                  </Link>
                )}

                {/* User dropdown */}
                <div className="user-menu" ref={menuRef}>
                  <button
                    className="user-menu-btn"
                    onClick={() => setUserMenuOpen(o => !o)}
                    aria-expanded={userMenuOpen}
                  >
                    <div className="user-avatar">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.name?.split(' ')[0]}
                    </span>
                    <span style={{ fontSize: 10, transition: 'transform 200ms', transform: userMenuOpen ? 'rotate(180deg)' : 'none' }}>▾</span>
                  </button>

                  {userMenuOpen && (
                    <div className="user-dropdown">
                      <div className="user-dropdown-header">
                        <div className="user-dropdown-name">{user.name}</div>
                        <div className="user-dropdown-email">{user.email}</div>
                      </div>
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)}>📦 My Orders</Link>
                      <Link to="/orders" onClick={() => setUserMenuOpen(false)}>👤 My Profile</Link>
                      {user.isAdmin && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)}>⚙️ Admin Panel</Link>
                      )}
                      <button
                        className="logout-item"
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                      >
                        🚪 Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login">
                <button className="login-btn">Login / Register</button>
              </Link>
            )}
          </div>
        </div>

        {/* CATEGORY NAV */}
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