import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) { setError('Please fill all required fields'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <div className="breadcrumb"><Link to="/">Home</Link><span>›</span><span>Register</span></div>
          <h1>Create Account</h1>
        </div>
      </div>
      <div style={{maxWidth:480,margin:'3rem auto',padding:'0 2rem'}}>
        <div className="admin-card">
          <div style={{textAlign:'center',marginBottom:'2rem'}}>
            <div style={{fontFamily:'Rajdhani,sans-serif',fontSize:28,fontWeight:700,textTransform:'uppercase'}}>Create Account</div>
            <div style={{fontSize:14,color:'#666',marginTop:6}}>Join Saad Hashim Auto Store</div>
          </div>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group"><label className="form-label">Full Name *</label><input className="form-input" placeholder="Your full name" value={form.name} onChange={e => setForm({...form,name:e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Phone / WhatsApp</label><input className="form-input" placeholder="03xx xxxxxxx" value={form.phone} onChange={e => setForm({...form,phone:e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Password *</label><input className="form-input" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({...form,password:e.target.value})} /></div>
          <div className="form-group"><label className="form-label">Confirm Password *</label><input className="form-input" type="password" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setForm({...form,confirmPassword:e.target.value})} /></div>
          <button className="btn-red" style={{width:'100%',justifyContent:'center',padding:14,opacity:loading?0.7:1}} onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
          <div style={{textAlign:'center',marginTop:'1.5rem',fontSize:14,color:'#666'}}>
            Already have an account? <Link to="/login" style={{color:'#d0021b',fontWeight:600}}>Login here</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;