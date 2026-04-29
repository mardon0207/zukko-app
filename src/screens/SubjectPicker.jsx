import React from 'react';

const SUBJECTS = [
  { id: 'Matematika', name: 'Matematika', icon: '📐', color: '#40cef3', desc: 'Sonlar va mantiq olami' },
  { id: 'Tarix', name: 'Tarix', icon: '⚔️', color: '#ff716c', desc: 'O\'tmishning buyuk saboqlari' },
  { id: 'Fizika', name: 'Fizika', icon: '⚛️', color: '#26fedc', desc: 'Koinot qonuniyatlari' },
  { id: 'Rus tili', name: 'Rus tili', icon: '🇷🇺', color: '#7ca0ff', desc: 'Muloqot va adabiyot' },
  { id: 'Kimyo', name: 'Kimyo', icon: '🧪', color: '#ffd54f', desc: 'Moddalar va reaksiyalar' },
  { id: 'Biologiya', name: 'Biologiya', icon: '🧬', color: '#aed581', desc: 'Hayot va tabiat sirlari', isNew: true },
  { id: 'Informatika', name: 'Informatika', icon: '💻', color: '#ce93d8', desc: 'Algoritmlar va raqamli dunyo', isNew: true }
];

export const SubjectPicker = ({ stats, onSelect, onBack }) => {
  
  const getRank = (pts) => {
    const ranks = [
      { id: 'student', name: 'O\'quvchi', min: 0, level: 1, color: '#8d6e63' },
      { id: 'undergrad', name: 'Talaba', min: 2000, level: 2, color: '#4db6ac' },
      { id: 'master', name: 'Magistr', min: 8000, level: 3, color: '#64b5f6' },
      { id: 'aspirant', name: 'Aspirant', min: 18000, level: 4, color: '#ba68c8' },
      { id: 'doctor', name: 'Doktor', min: 35000, level: 5, color: '#ff716c' },
      { id: 'professor', name: 'Professor', min: 60000, level: 5, color: '#ffd54f' }
    ];
    return [...ranks].reverse().find(r => pts >= r.min) || ranks[0];
  };

  return (
    <div className="screen">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', padding: '10px 0' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '15px', width: '45px', height: '45px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>←</button>
        <h1 style={{ fontSize: '24px', margin: 0, fontWeight: '900' }}>📚 Fanlar</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '40px' }}>
        {SUBJECTS.map(s => {
          const points = stats[s.id] || 0;
          const rank = getRank(points);
          
          return (
            <div 
              key={s.id} 
              onClick={() => onSelect(s.id)}
              className="glass-card" 
              style={{ 
                display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', 
                cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)', 
                border: `1px solid ${s.color}33`,
                background: `linear-gradient(135deg, ${s.color}08, rgba(255,255,255,0.02))`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                e.currentTarget.style.borderColor = s.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = `${s.color}33`;
              }}
            >
              <div style={{ fontSize: '42px', filter: `drop-shadow(0 0 15px ${s.color}66)` }}>{s.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ fontSize: '19px', fontWeight: '900', letterSpacing: '-0.3px' }}>{s.name}</div>
                    {s.isNew && (
                      <span className="pulse-primary" style={{ fontSize: '8px', background: 'var(--accent-secondary)', color: 'black', padding: '2px 6px', borderRadius: '6px', fontWeight: '900' }}>YANGI</span>
                    )}
                  </div>
                  <div style={{ fontSize: '9px', color: rank.color, fontWeight: '900', background: `${rank.color}15`, padding: '3px 10px', borderRadius: '12px', border: `1px solid ${rank.color}33` }}>
                    LVL {rank.level}
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>{s.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

