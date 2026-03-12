import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferred: 'WhatsApp',
    message: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.name || !form.message) {
      setError('Please enter your name and message.');
      return;
    }
    if (form.preferred === 'WhatsApp' && !form.phone) {
      setError('Please enter your WhatsApp number so we can reply there.');
      return;
    }
    if (form.preferred === 'Email' && !form.email) {
      setError('Please enter your email address so we can reply there.');
      return;
    }

    // For now we just show a confirmation message.
    setSuccess(`Thank you ${form.name}, we will contact you via ${form.preferred} soon.`);
  };

  return (
    <>
      <div className="page-header">
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <span>›</span>
            <span>Contact</span>
          </div>
          <h1>Contact Us</h1>
          <p>Get in touch via WhatsApp or Email for orders, fitment help or any questions.</p>
        </div>
      </div>

      <div className="contact-page">
        <div className="contact-container">

          <div className="contact-grid">
            <section className="contact-info">
              <div className="eyebrow">Direct Contact</div>
              <h2>We&apos;re here to help you find the right part</h2>
              <p>
                Have a question about fitment, availability or your order? You can reach us quickly on
                WhatsApp or send us an email and we&apos;ll reply as soon as possible.
              </p>

              <div className="contact-cards">
                <div className="contact-card">
                  <div className="contact-card-icon">📱</div>
                  <div className="contact-card-title">WhatsApp</div>
                  <div className="contact-card-text">
                    Chat with us on WhatsApp for quick help and pictures of parts.
                  </div>
                  <a
                    href="https://wa.me/923160525191"
                    target="_blank"
                    rel="noreferrer"
                    className="contact-card-link"
                  >
                    Message on WhatsApp (0316 0525191)
                  </a>
                </div>

                <div className="contact-card">
                  <div className="contact-card-icon">✉️</div>
                  <div className="contact-card-title">Email</div>
                  <div className="contact-card-text">
                    Share detailed requirements, bulk orders or workshop enquiries.
                  </div>
                  <a
                    href="mailto:shanishakir044@gmail.com"
                    className="contact-card-link"
                  >
                    Email us at shanishakir044@gmail.com
                  </a>
                </div>
              </div>
            </section>

            <section className="contact-form-card">
              <h3>Send us a message</h3>
              <p style={{ fontSize: 13, color: '#666', marginBottom: '1rem' }}>
                Fill this short form and we&apos;ll contact you back on your preferred channel.
              </p>

              {error && <div className="alert alert-error" style={{ marginBottom: '0.75rem' }}>{error}</div>}
              {success && <div className="alert alert-success" style={{ marginBottom: '0.75rem' }}>{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    className="form-input"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    className="form-input"
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp Number</label>
                  <input
                    className="form-input"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="03xx xxxxxxx"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Preferred Contact Method *</label>
                  <select
                    className="form-select"
                    value={form.preferred}
                    onChange={e => setForm({ ...form, preferred: e.target.value })}
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="form-input"
                    rows={4}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us what part you need, bike model, or your question..."
                  />
                </div>
                <button type="submit" className="btn-red">
                  Send Message
                </button>
              </form>
            </section>
          </div>

        </div>
      </div>
    </>
  );
};

export default Contact;

