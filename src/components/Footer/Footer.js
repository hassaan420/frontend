import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <Link to="/" className="logo">
            <div className="logo-badge">
              <div className="logo-badge-top">SH</div>
              <div className="logo-badge-line"></div>
            </div>
            <div className="logo-text-block">
              <span className="logo-name" style={{color:'white'}}>Saad <span>Hashim</span></span>
              <span className="logo-tagline" style={{color:'rgba(255,255,255,0.4)'}}>Auto Store · Pakistan</span>
            </div>
          </Link>
          <p className="footer-desc">Pakistan's trusted motorcycle parts store. Genuine spare parts for Honda, Yamaha, Suzuki and more. OutCron, Fixit, Atlas Honda, ISH, Suntek — all brands, nationwide delivery.</p>
          <div className="footer-socials">
            <a className="fsocial" href="https://facebook.com" target="_blank" rel="noreferrer">f</a>
            <a className="fsocial" href="https://wa.me/923160525191" target="_blank" rel="noreferrer">wa</a>
            <a className="fsocial" href="https://instagram.com" target="_blank" rel="noreferrer">in</a>
            <a className="fsocial" href="https://youtube.com" target="_blank" rel="noreferrer">yt</a>
          </div>
        </div>

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

        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li><Link to="/products?category=Engine Parts">Engine Parts</Link></li>
            <li><Link to="/products?category=Brakes & Suspension">Brakes & Suspension</Link></li>
            <li><Link to="/products?category=Electrical & Lights">Electrical & Lights</Link></li>
            <li><Link to="/products?category=Body Parts & Panels">Body Parts</Link></li>
            <li><Link to="/products?category=Tyres & Wheels">Tyres & Wheels</Link></li>
            <li><Link to="/products?category=Oils & Lubricants">Oils & Lubricants</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact Us</h4>
          <div className="contact-item">
            <div className="contact-icon">📍</div>
            <div><b>Our Location</b>Pakistan Town Phase 2, Opposite Lahore Hotel, Islamabad</div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">📞</div>
            <div><b>Phone / WhatsApp</b>+92 316 0525191</div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">✉️</div>
            <div><b>Email</b>shanishakir044@gmail.com</div>
          </div>
          <div className="contact-item">
            <div className="contact-icon">⏰</div>
            <div><b>Hours</b>Mon–Sat: 9:00am – 8:00pm</div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Saad Hashim Auto Store. All rights reserved. Made with ❤️ in Pakistan.</p>
        <div className="payment-badges">
          <span className="pay-badge">💵 COD</span>
          <span className="pay-badge">EasyPaisa</span>
          <span className="pay-badge">JazzCash</span>
          <span className="pay-badge">Bank Transfer</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;