import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-grid">
        {/* Brand Column */}
        <div className="footer-brand-col">
          <Link to="/" className="logo">
            <div className="logo-badge">
              <div className="logo-badge-top">SH</div>
              <div className="logo-badge-line"></div>
            </div>
            <div className="logo-text-block">
              <span className="logo-name" style={{ color: 'white' }}>Saad <span>Hashim</span></span>
              <span className="logo-tagline" style={{ color: 'rgba(255,255,255,0.35)' }}>Auto Store · Pakistan</span>
            </div>
          </Link>
          <p className="footer-desc">
            Pakistan's trusted motorcycle parts store. Genuine spare parts for Honda, Yamaha, Suzuki and more. OutCron, Fixit, Atlas Honda, ISH, Suntek — all brands, nationwide delivery with Cash on Delivery.
          </p>
          <div className="footer-socials">
            <a className="fsocial" href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
            <a className="fsocial" href="https://wa.me/923160525191" target="_blank" rel="noreferrer" aria-label="WhatsApp">wa</a>
            <a className="fsocial" href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">in</a>
            <a className="fsocial" href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">yt</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact</Link></li>
            <li><Link to="/products">All Products</Link></li>
            <li><Link to="/orders">Track Order</Link></li>
            <li><Link to="/login">My Account</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/products?category=Engine%20Parts">Engine Parts</Link></li>
            <li><Link to="/products?category=Brakes%20%26%20Suspension">Brakes & Suspension</Link></li>
            <li><Link to="/products?category=Electrical%20%26%20Lights">Electrical & Lights</Link></li>
            <li><Link to="/products?category=Body%20Parts%20%26%20Panels">Body Parts</Link></li>
            <li><Link to="/products?category=Tyres%20%26%20Wheels">Tyres & Wheels</Link></li>
            <li><Link to="/products?category=Oils%20%26%20Lubricants">Oils & Lubricants</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-col">
          <h4>Contact Us</h4>
          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div>
              <b>Our Location</b>
              Pakistan Town Phase 2, Opposite Lahore Hotel, Islamabad
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <div>
              <b>Phone / WhatsApp</b>
              +92 316 0525191
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">✉️</div>
            <div>
              <b>Email</b>
              shanishakir044@gmail.com
            </div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">⏰</div>
            <div>
              <b>Hours</b>
              Mon–Sat: 9:00am – 8:00pm
            </div>
          </div>
        </div>
      </div>

      {/* Trust + Payment Strip */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[['🚚', 'Nationwide Delivery'], ['✅', '100% Genuine Parts'], ['💵', 'Cash on Delivery'], ['🔄', '7-Day Returns']].map(([icon, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="payment-badges">
            <span className="pay-badge">💵 COD</span>
            <span className="pay-badge">EasyPaisa</span>
            <span className="pay-badge">JazzCash</span>
            <span className="pay-badge">Bank Transfer</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© 2025 Saad Hashim Auto Store. All rights reserved. Made with ❤️ in Pakistan.</p>
        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: 11 }}>
          Genuine motorcycle parts · Islamabad · Nationwide delivery
        </p>
      </div>
    </footer>
  );
};

export default Footer;