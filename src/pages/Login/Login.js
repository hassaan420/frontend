import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.email || !form.password) { setError('Please fill all fields'); return; }
    setLoading(true); setError('');
    try {
      const user = await login(form.email, form.password);
      if (user?.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', alignItems: 'center', background: 'var(--bg-soft)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: 440, width: '100%', margin: '0 auto' }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: 56, height: 56, background: 'var(--red)', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', flexDirection: 'column', gap: 3 }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 22, color: 'white', lineHeight: 1 }}>SH</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 26, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text)' }}>
            Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Sign in to your Saad Hashim Auto Store account
          </p>
        </div>

        {/* Member Benefit Banner */}
        <div style={{ background: 'linear-gradient(135deg, var(--red-dark), var(--red))', borderRadius: 'var(--r-lg)', padding: '14px 18px', marginBottom: '1.5rem', color: 'white', display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>🎁</span>
          <div>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>Members-Only Discounts</div>
            <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>Login to access exclusive deals and order tracking.</div>
          </div>
        </div>

        {/* Form Card */}
        <div className="admin-card">
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          </div>
          <button className="btn-red" style={{ width: '100%', justifyContent: 'center', padding: 14, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
            {loading ? '⏳ Logging in...' : 'Login →'}
          </button>
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: 13, color: 'var(--text-muted)' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--red)', fontWeight: 600 }}>Register here</Link>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: 12, color: 'var(--text-muted)' }}>
          🛍️ Want to shop without an account? <Link to="/checkout" style={{ color: 'var(--red)', fontWeight: 600 }}>Checkout as Guest</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
