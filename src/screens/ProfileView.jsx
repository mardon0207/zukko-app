import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ARTIFACTS } from '../constants/artifacts';

const RANKS = [
  { id: 'student', name: 'Talaba', min: 0, icon: '👨‍🎓' },
  { id: 'undergrad', name: 'Bakalavr', min: 2000, icon: '📜' },
  { id: 'master', name: 'Magistr', min: 8000, icon: '🎩' },
  { id: 'aspirant', name: 'Aspirant', min: 18000, icon: '🔬' },
  { id: 'doctor', name: 'Doktor', min: 35000, icon: '🧬' },
  { id: 'professor', name: 'Professor', min: 60000, icon: '👑' }
];

export const ProfileView = ({ user, points, stats, activeAvatar, onLogout, collection = [], isAdmin, loading }) => {
  const navigate = useNavigate();
  const currentRank = [...RANKS].reverse().find(r => points >= r.min) || RANKS[0];

  if (loading) {
    return (
      <div className="screen" style={{ paddingBottom: '120px' }}>
        <div style={{ textAlign: 'center', padding: '30px 0' }}>
          <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '40px', margin: '0 auto 20px' }} />
          <div className="skeleton" style={{ width: '150px', height: '28px', margin: '0 auto 10px' }} />
          <div className="skeleton" style={{ width: '100px', height: '14px', margin: '0 auto' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
          <div className="glass-card skeleton" style={{ height: '100px' }} />
          <div className="glass-card skeleton" style={{ height: '100px' }} />
        </div>
        <div className="glass-card skeleton" style={{ height: '200px' }} />
      </div>
    );
  }

  // Обработка аватара
  let avatarUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=owl";
  try {
    const avData = typeof activeAvatar === 'string' ? JSON.parse(activeAvatar) : activeAvatar;
    const avatarId = typeof avData === 'object' ? avData.id : avData;
    
    const AVATARS = [
      { id: "owl", img: "https://api.dicebear.com/7.x/bottts/svg?seed=owl" },
      { id: "fox", img: "https://api.dicebear.com/7.x/bottts/svg?seed=fox" },
      { id: "bear", img: "https://api.dicebear.com/7.x/bottts/svg?seed=bear" },
      { id: "cat", img: "https://api.dicebear.com/7.x/bottts/svg?seed=cat" },
      { id: "robot", img: "https://api.dicebear.com/7.x/bottts/svg?seed=robot" },
      { id: "dragon", img: "https://api.dicebear.com/7.x/bottts/svg?seed=dragon" }
    ];
    
    const found = AVATARS.find(a => a.id === avatarId);
    if (found) avatarUrl = found.img;
    else if (avData && avData.img) avatarUrl = avData.img;
  } catch (e) {}

  return (
    <div className="screen" style={{ paddingBottom: '120px' }}>
      <div style={{ textAlign: 'center', padding: '30px 0' }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '40px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <img src={avatarUrl} style={{ width: '80px', height: '80px' }} alt="profile" />
          </div>
          <div style={{ position: 'absolute', bottom: '15px', right: '-10px', width: '40px', height: '40px', borderRadius: '15px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '4px solid var(--bg-dark)' }}>
            {currentRank.icon}
          </div>
        </div>
        <h1 style={{ fontSize: '28px', marginBottom: '5px' }}>{user}</h1>
        <div style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '14px', letterSpacing: '2px' }}>{currentRank.name.toUpperCase()}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: '800' }}>BALLARIM</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--accent-secondary)' }}>{points.toLocaleString()}</div>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px', fontWeight: '800' }}>FANLAR</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--accent-primary)' }}>{Object.keys(stats).length}</div>
        </div>
      </div>

      <div 
        className="glass-card animate-glow pulse-hover" 
        onClick={() => navigate('/collection')}
        style={{ 
          padding: '25px', 
          marginBottom: '30px', 
          cursor: 'pointer',
          background: 'linear-gradient(135deg, rgba(255, 213, 79, 0.1), transparent)',
          border: '1px solid rgba(255, 213, 79, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}
      >
        <div style={{ fontSize: '50px' }}>🏺</div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: '900' }}>Mening Xazinam</div>
          <div style={{ fontSize: '12px', color: '#ffd54f', fontWeight: '800' }}>{collection.length} / {ARTIFACTS.length} ARTEFAKT</div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: '20px', opacity: 0.5 }}>→</div>
      </div>

      {isAdmin && (
        <button 
          onClick={() => navigate('/admin')} 
          className="btn btn-outline" 
          style={{ width: '100%', marginBottom: '15px', borderColor: 'var(--accent-tertiary)', color: 'var(--accent-tertiary)' }}
        >
          ⚙️ BOSHQARUV (ADMIN)
        </button>
      )}

      <div className="glass-card" style={{ padding: '20px', marginBottom: '30px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '15px', color: 'var(--text-muted)' }}>FANLAR BO'YICHA NATIJALAR</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(stats).map(([subj, val]) => (
            <div key={subj} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: '700' }}>{subj}</div>
              <div style={{ color: 'var(--accent-primary)', fontWeight: '800' }}>{val} BALL</div>
            </div>
          ))}
          {Object.keys(stats).length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>Hali natijalar yo'q.</div>
          )}
        </div>
      </div>

      <button onClick={onLogout} className="btn btn-outline" style={{ width: '100%', color: 'var(--error-color)', borderRadius: '24px', justifyContent: 'center', border: '1px solid rgba(255, 94, 125, 0.2)' }}>CHIQISH</button>
    </div>
  );
};
