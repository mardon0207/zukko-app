import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const AVATARS = [
  { id: "owl", img: "https://api.dicebear.com/7.x/bottts/svg?seed=owl", name: "Donishmand Boyo'g'li", price: 0 },
  { id: "fox", img: "https://api.dicebear.com/7.x/bottts/svg?seed=fox", name: "Aqlvoy Tulki", price: 500 },
  { id: "bear", img: "https://api.dicebear.com/7.x/bottts/svg?seed=bear", name: "Polvon Ayiq", price: 1200 },
  { id: "cat", img: "https://api.dicebear.com/7.x/bottts/svg?seed=cat", name: "Ziyorak Mushuk", price: 2500 },
  { id: "robot", img: "https://api.dicebear.com/7.x/bottts/svg?seed=robot", name: "Bilimdon Robot", price: 5000 },
  { id: "dragon", img: "https://api.dicebear.com/7.x/bottts/svg?seed=dragon", name: "Olovli Ajdar", price: 10000 }
];

const RANKS = [
  { name: 'O\'quvchi', min: 0 },
  { name: 'Bilim izlovchi', min: 2000 },
  { name: 'Magistr', min: 8000 },
  { name: 'Professor', min: 18000 },
  { name: 'Akademik', min: 35000 },
  { name: 'Bilimdon', min: 60000 }
];

export const LeaderboardView = ({ currentUser, onBack }) => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, total_points, active_avatar')
        .order('total_points', { ascending: false })
        .limit(10);

      if (data) setLeaders(data);
      setLoading(false);
    };
    fetchLeaders();
  }, []);

  const getRankIcon = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `#${index + 1}`;
  };

  const getUserRank = (points) => {
    return [...RANKS].reverse().find(r => points >= r.min)?.name || RANKS[0].name;
  };

  return (
    <div className="screen" style={{ paddingBottom: '120px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', padding: '10px 0' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '12px', width: '40px', height: '40px', color: 'white' }}>←</button>
        <h1 style={{ fontSize: '22px', margin: 0 }}>📊 Peshqadamlar</h1>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1,2,3,4,5].map(i => (
            <div key={i} className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px', opacity: 1 - (i*0.15) }}>
              <div className="skeleton" style={{ width: '30px', height: '20px' }} />
              <div className="skeleton" style={{ width: '45px', height: '45px', borderRadius: '12px' }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ width: '60%', height: '16px', marginBottom: '8px' }} />
                <div className="skeleton" style={{ width: '40%', height: '12px' }} />
              </div>
              <div className="skeleton" style={{ width: '50px', height: '24px' }} />
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {leaders.map((leader, index) => {
            // Исправленная логика поиска аватара
            let avatarImg = AVATARS[0].img;
            try {
              if (leader.active_avatar) {
                const avData = typeof leader.active_avatar === 'string' ? JSON.parse(leader.active_avatar) : leader.active_avatar;
                const avatarId = typeof avData === 'object' ? avData.id : avData;
                const found = AVATARS.find(a => a.id === avatarId);
                if (found) avatarImg = found.img;
              }
            } catch(e) {}

            const isMe = leader.display_name === currentUser;

            return (
              <div key={index} className="glass-card" style={{ 
                display: 'flex', alignItems: 'center', gap: '15px', padding: '15px 20px',
                border: isMe ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)',
                background: isMe ? 'rgba(64, 206, 243, 0.08)' : 'rgba(255,255,255,0.03)',
                boxShadow: isMe ? '0 0 20px rgba(64, 206, 243, 0.15)' : 'none'
              }}>
                <div style={{ fontSize: '18px', fontWeight: '900', width: '30px', color: index < 3 ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                  {getRankIcon(index)}
                </div>
                <img src={avatarImg} style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} alt="avatar" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '800', fontSize: '16px', color: isMe ? 'var(--accent-primary)' : 'white', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {leader.display_name} 
                    {isMe && <span style={{ fontSize: '9px', background: 'var(--accent-primary)', color: 'black', padding: '2px 6px', borderRadius: '6px', fontWeight: '900' }}>SIZ</span>}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>
                    {getUserRank(leader.total_points)}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '900', color: 'var(--accent-secondary)', fontSize: '16px' }}>{(leader.total_points || 0).toLocaleString()}</div>
                  <div style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '0.5px' }}>BALL</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
