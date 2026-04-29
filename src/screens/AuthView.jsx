import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

export const AuthView = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        if (username.length < 3) throw new Error("Ism kamida 3 ta belgi bo'lishi kerak");
        
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: username,
              total_points: 0,
              avatar: '{"icon": "🦉"}'
            }
          }
        });
        if (signUpError) throw signUpError;
        alert("Ro'yxatdan muvaffaqiyatli o'tdingiz! Endi tizimga kiring.");
        setIsRegister(false);
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        // App.jsx will automatically detect the session change
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen auth-screen" style={{ justifyContent: 'center', padding: '30px' }}>
      {/* Decorative Background Blobs */}
      <div className="auth-blob auth-blob-1"></div>
      <div className="auth-blob auth-blob-2"></div>
      
      <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 1 }}>
        <div className="mascot-bounce" style={{ 
          fontSize: '80px', marginBottom: '15px', 
          filter: 'drop-shadow(0 0 30px var(--accent-primary))' 
        }}>🦉</div>
        <h1 style={{ fontSize: '42px', fontWeight: '900', letterSpacing: '-1.5px', background: 'linear-gradient(to bottom, #fff, var(--accent-primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BILIMDON</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: '600', opacity: 0.8 }}>Zukkolar olamiga xush kelibsiz!</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px', position: 'relative', zIndex: 1 }}>
        <div className="glass-card auth-card" style={{ padding: '35px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', textAlign: 'center', marginBottom: '10px' }}>
            {isRegister ? 'Ro\'yxatdan o\'tish' : 'Xush kelibsiz'}
          </h2>
          
          {error && (
            <div style={{ 
              color: 'var(--error-color)', fontSize: '13px', textAlign: 'center', 
              background: 'rgba(255, 94, 125, 0.1)', padding: '12px', borderRadius: '14px',
              border: '1px solid rgba(255, 94, 125, 0.2)', animation: 'shake 0.5s'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {isRegister && (
              <div className="input-group">
                <label>ISMINGIZ</label>
                <input 
                  type="text" 
                  placeholder="Ismingizni kiriting"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="input-group">
              <label>EMAIL MANZILI</label>
              <input 
                type="email" 
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <label>PAROL</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
          </div>

          <button disabled={loading} className="btn btn-primary pulse-hover" style={{ width: '100%', height: '60px', justifyContent: 'center', fontSize: '18px', marginTop: '10px' }}>
            {loading ? <div className="spinner"></div> : (isRegister ? 'BIRGALIKDA BOSHLAYMIZ' : 'TIZIMGA KIRISH')}
          </button>
        </div>

        <button 
          type="button"
          onClick={() => { setIsRegister(!isRegister); setError(null); }}
          className="auth-switch-btn"
        >
          {isRegister ? (
            <>Akkauntingiz bormi? <span style={{ color: 'var(--accent-primary)' }}>Kirish</span></>
          ) : (
            <>Yangi foydalanuvchimisiz? <span style={{ color: 'var(--accent-primary)' }}>Ro'yxatdan o'tish</span></>
          )}
        </button>
      </form>
    </div>
  );
};
