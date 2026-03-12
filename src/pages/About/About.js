import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <>
      <div className="page-header">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>About Us</span>
          </div>
          <h1>About Saad Hashim Auto Store</h1>
          <p>25+ years of experience in genuine motorcycle parts across Pakistan.</p>
        </div>
      </div>

      <div className="about-page">
        <div className="about-container">

          <section className="about-hero">
            <div className="about-hero-text">
              <div className="eyebrow">Who We Are</div>
              <h2>Pakistan&apos;s Trusted Genuine Bike Parts Store</h2>
              <p>
                Saad Hashim Auto Store is built on one simple promise: deliver <strong>original, genuine
                motorcycle parts</strong> at fair prices, with honest service you can trust.
                We have been helping riders, mechanics and workshops for more than <strong>25 years</strong>.
              </p>
            </div>
            <div className="about-hero-badge">
              <div className="about-badge-main">25+</div>
              <div className="about-badge-label">Years of Parts Experience</div>
            </div>
          </section>

          <section className="about-grid">
            <div className="about-card">
              <h3>Our Purpose</h3>
              <p>
                Our purpose is to make it easy for every rider in Pakistan to find the <strong>right, genuine
                part</strong> for their motorcycle without any tension. No counterfeits, no guess work –
                only parts we would install on our own bikes.
              </p>
            </div>

            <div className="about-card">
              <h3>Why Customers Trust Us</h3>
              <ul>
                <li>🔧 <strong>100% Genuine Parts Only</strong> – carefully sourced from trusted brands and suppliers.</li>
                <li>📦 <strong>Secure Packaging & Fast Delivery</strong> – nationwide COD with care in every parcel.</li>
                <li>💬 <strong>Honest Advice</strong> – if a part is not right for your bike, we will tell you.</li>
                <li>🔄 <strong>Easy Returns</strong> – simple policies if you receive the wrong or faulty part.</li>
              </ul>
            </div>

            <div className="about-card">
              <h3>What We Are Good At</h3>
              <ul>
                <li>✅ Supplying <strong>original & genuine spare parts</strong> for Honda, Yamaha, Suzuki and more.</li>
                <li>🧠 Helping you choose the <strong>correct part</strong> for your exact model.</li>
                <li>🤝 Building long–term relationships with mechanics, workshops and riders.</li>
              </ul>
            </div>
          </section>

          <section className="about-trust-strip">
            <div className="about-trust-item">
              <span className="about-trust-icon">🛡️</span>
              <div>
                <div className="about-trust-title">Genuine &amp; Verified</div>
                <div className="about-trust-text">Every part is checked and verified before we put it on the shelf.</div>
              </div>
            </div>
            <div className="about-trust-item">
              <span className="about-trust-icon">🚚</span>
              <div>
                <div className="about-trust-title">Nationwide Delivery</div>
                <div className="about-trust-text">From Islamabad to Karachi, Lahore, Peshawar &amp; more – we deliver.</div>
              </div>
            </div>
            <div className="about-trust-item">
              <span className="about-trust-icon">💵</span>
              <div>
                <div className="about-trust-title">Cash on Delivery</div>
                <div className="about-trust-text">Pay when your genuine part reaches your doorstep.</div>
              </div>
            </div>
            <div className="about-trust-item">
              <span className="about-trust-icon">💬</span>
              <div>
                <div className="about-trust-title">Real Support</div>
                <div className="about-trust-text">Have a question about fitment? Message us and talk to a real expert.</div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default About;

