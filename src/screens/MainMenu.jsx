import React from 'react';

const RANKS = [
  { id: 'shogird', name: 'Shogird', min: 0, icon: '🪵', color: '#8d6e63' },
  { id: 'mulla', name: 'Mulla', min: 2000, icon: '✒️', color: '#4db6ac' },
  { id: 'mirzo', name: 'Mirzo', min: 8000, icon: '📜', color: '#64b5f6' },
  { id: 'vazir', name: 'Vazir', min: 18000, icon: '🏛️', color: '#ba68c8' },
  { id: 'sohibqiron', name: 'Sohibqiron', min: 35000, icon: '🕌', color: '#ffd54f' }
];

export const MainMenu = ({ user, totalPoints, activeAvatar, subjectStats, mistakes, onStart, onStartMistakes, onShowRankMap }) => {
  const [showAchievements, setShowAchievements] = React.useState(false);
  const [showStatistics, setShowStatistics] = React.useState(false);

  const rankIndex = RANKS.slice().reverse().findIndex(r => totalPoints >= r.min);
  const currentRank = RANKS.slice().reverse()[rankIndex] || RANKS[0];
  const nextRank = RANKS[RANKS.length - 1 - rankIndex + 1] || null;
  
  const progressToNext = nextRank 
    ? ((totalPoints - currentRank.min) / (nextRank.min - currentRank.min)) * 100 
    : 100;

  // Circular Progress Calculation
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progressToNext / 100) * circumference;

  const achievements = [
    { id: 1, title: 'Ilk Qadam', icon: '🌱', req: 1000, desc: '1,000 BALL to\'plang' },
    { id: 2, title: 'Zukko', icon: '🔥', req: 5000, desc: '5,000 BALL to\'plang' },
    { id: 3, title: 'Zukkolar Sultoni', icon: '⚡', req: 15000, desc: '15,000 BALL to\'plang' },
    { id: 4, title: 'Akademik', icon: '🏛️', req: 30000, desc: '30,000 BALL to\'plang' },
    { id: 5, title: 'Dahshatli Xotira', icon: '🧠', req: 50000, desc: '50,000 BALL to\'plang' },
    { id: 6, title: 'Afsona', icon: '✨', req: 100000, desc: '100,000 BALL to\'plang' }
  ];

  return (
    <div className="screen" style={{ gap: '20px' }}>
      {/* Modals remain the same... */}
      {showAchievements && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,10,19,0.98)', zIndex: 10000, display: 'flex', flexDirection: 'column', padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800' }}>🏆 Yutuqlar</h2>
            <button onClick={() => setShowAchievements(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '28px' }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {achievements.map(a => {
                const isUnlocked = totalPoints >= a.req;
                return (
                  <div key={a.id} className="glass-card" style={{ padding: '20px', textAlign: 'center', opacity: isUnlocked ? 1 : 0.3, border: isUnlocked ? `1px solid ${currentRank.color}` : '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '40px', marginBottom: '10px' }}>{isUnlocked ? a.icon : '🔒'}</div>
                    <div style={{ fontWeight: '800', fontSize: '13px', color: isUnlocked ? 'var(--accent-primary)' : 'white' }}>{a.title}</div>
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '5px' }}>{a.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {showStatistics && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,10,19,0.98)', zIndex: 10000, display: 'flex', flexDirection: 'column', padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800' }}>📊 Statistika</h2>
            <button onClick={() => setShowStatistics(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '28px' }}>✕</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            <div className="glass-card" style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '15px', fontWeight: '800' }}>FANLAR BO'YICHA NATIJALAR</div>
              {['Matematika', 'Tarix', 'Fizika', 'Rus tili', 'Kimyo', 'Biologiya', 'Informatika'].map(s => {
                const val = subjectStats[s] || 0;
                const maxVal = Math.max(...Object.values(subjectStats), 1000);
                const perc = (val / maxVal) * 100;
                return (
                  <div key={s} style={{ marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: '600' }}>{s}</span>
                      <span style={{ fontWeight: '900', color: 'var(--accent-primary)' }}>{val} BALL</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                      <div style={{ width: `${perc}%`, height: '100%', background: `linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))`, borderRadius: '10px', boxShadow: '0 0 10px var(--accent-primary)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '30px' }}>🔥</div>
                <div className="stat-value">{totalPoints}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800' }}>UMUMIY BALL</div>
              </div>
              <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '30px' }}>📉</div>
                <div className="stat-value" style={{ background: 'linear-gradient(to bottom, #fff, var(--error-color))', WebkitBackgroundClip: 'text' }}>{mistakes.length}</div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800' }}>XATOLAR</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- New Hero Profile Card --- */}
      <div className="glass-card glow-border animate-glow" style={{ padding: '25px', display: 'flex', alignItems: 'center', gap: '25px' }}>
        <div style={{ position: 'relative', width: '90px', height: '90px' }}>
          <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
             <circle cx="45" cy="45" r={radius} fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
             <circle 
                cx="45" cy="45" r={radius} fill="transparent" 
                stroke={currentRank.color} strokeWidth="6" 
                strokeDasharray={circumference} 
                strokeDashoffset={offset} 
                strokeLinecap="round"
                className="progress-ring-circle"
             />
          </svg>
          <div style={{ 
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }} className="mascot-bounce">
            <img src={activeAvatar.img} alt="mascot" style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
          </div>
          <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: currentRank.color, color: '#020a13', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '900', border: '3px solid #020a13' }}>
            {rankIndex + 1}
          </div>
        </div>
        
        <div style={{ flex: 1 }}>
           <h2 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '-0.5px' }}>{user}</h2>
           <div onClick={onShowRankMap} style={{ color: currentRank.color, fontSize: '12px', fontWeight: '800', letterSpacing: '1px', cursor: 'pointer' }}>
             {currentRank.name.toUpperCase()} <span style={{ opacity: 0.5 }}>ⓘ</span>
           </div>
           <div style={{ marginTop: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: '900', color: 'var(--accent-primary)' }}>{totalPoints}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: '5px', fontWeight: '800' }}>BALL</span>
           </div>
        </div>
      </div>

      {/* --- Bento Layout Grid --- */}
      <div className="bento-grid">
         {/* Main Play Card */}
         <div 
          className="glass-card bento-item glow-border animate-glow" 
          style={{ gridColumn: 'span 2', padding: '40px 30px', background: 'linear-gradient(135deg, rgba(64, 206, 243, 0.1), rgba(38, 254, 220, 0.05))', cursor: 'pointer', textAlign: 'center' }}
          onClick={onStart}
         >
            <div style={{ fontSize: '80px', marginBottom: '15px', filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.3))' }}>📖</div>
            <div style={{ fontSize: '26px', fontWeight: '900', letterSpacing: '1px' }}>BILIMINGIZNI SINANG</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', opacity: 0.8 }}>O'z bilim darajangizni oshiring</div>
         </div>

         {/* Achievements Tile */}
         <div className="glass-card bento-item overlap-card" style={{ cursor: 'pointer' }} onClick={() => setShowAchievements(true)}>
            <div className="floating-icon">🏅</div>
            <div style={{ marginTop: '20px' }}>
               <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--accent-primary)' }}>YUTUQLAR</div>
               <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>6 tadan {achievements.filter(a => totalPoints >= a.req).length} tasi ochiq</div>
            </div>
         </div>

         {/* Statistics Tile */}
         <div className="glass-card bento-item overlap-card" style={{ cursor: 'pointer' }} onClick={() => setShowStatistics(true)}>
            <div className="floating-icon">📊</div>
            <div style={{ marginTop: '20px' }}>
               <div style={{ fontSize: '13px', fontWeight: '900', color: 'var(--accent-secondary)' }}>STATISTIKA</div>
               <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>O'sish sur'atini ko'ring</div>
            </div>
         </div>
      </div>

      {/* Mistakes Alert */}
      {mistakes.length > 0 && (
        <div 
          onClick={onStartMistakes}
          className="glass-card bento-item glow-border" 
          style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '18px 24px', border: '1px solid var(--error-color)', background: 'rgba(255, 77, 109, 0.05)', cursor: 'pointer' }}
        >
          <div style={{ fontSize: '40px' }}>📦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '15px', fontWeight: '900', color: 'var(--error-color)' }}>XATOLAR USTIDA ISHLASH</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{mistakes.length} ta xato to'g'irlashni kutmoqda</div>
          </div>
          <div style={{ fontSize: '24px', color: 'var(--error-color)' }}>→</div>
        </div>
      )}
    </div>
  );
};
