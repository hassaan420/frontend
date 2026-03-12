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
    <>
      <div className="page-header">
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <div className="breadcrumb"><Link to="/">Home</Link><span>›</span><span>Login</span></div>
          <h1>Login</h1>
        </div>
      </div>
      <div style={{maxWidth:480,margin:'3rem auto',padding:'0 2rem'}}>
        <div className="admin-card">
          <div style={{textAlign:'center',marginBottom:'2rem'}}>
            <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:28,fontWeight:700,textTransform:'uppercase'}}>Welcome Back</div>
            <div style={{fontSize:14,color:'#666',marginTop:6}}>Login to your Saad Hashim Auto Store account</div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email:e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="Your password" value={form.password} onChange={e => setForm({...form, password:e.target.value})} onKeyDown={e => e.key==='Enter' && handleSubmit()} />
          </div>
          <button className="btn-red" style={{width:'100%',justifyContent:'center',padding:14,opacity:loading?0.7:1}} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>
          <div style={{textAlign:'center',marginTop:'1.5rem',fontSize:14,color:'#666'}}>
            Don't have an account? <Link to="/register" style={{color:'#d0021b',fontWeight:600}}>Register here</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;