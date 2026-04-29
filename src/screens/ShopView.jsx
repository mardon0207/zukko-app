import React from 'react';
import { supabase } from '../utils/supabase';

const AVATARS = [
  { id: "owl", img: "https://api.dicebear.com/7.x/bottts/svg?seed=owl", name: "Donishmand Boyo'g'li", price: 0 },
  { id: "fox", img: "https://api.dicebear.com/7.x/bottts/svg?seed=fox", name: "Aqlvoy Tulki", price: 500 },
  { id: "bear", img: "https://api.dicebear.com/7.x/bottts/svg?seed=bear", name: "Polvon Ayiq", price: 1200 },
  { id: "cat", img: "https://api.dicebear.com/7.x/bottts/svg?seed=cat", name: "Ziyorak Mushuk", price: 2500 },
  { id: "robot", img: "https://api.dicebear.com/7.x/bottts/svg?seed=robot", name: "Bilimdon Robot", price: 5000 },
  { id: "dragon", img: "https://api.dicebear.com/7.x/bottts/svg?seed=dragon", name: "Olovli Ajdar", price: 10000 }
];

export const ShopView = ({ points, inventory, unlocked, activeAvatar, onUpdatePoints, onUpdateInventory, onUpdateUnlocked, onUpdateAvatar, session, onBack }) => {
  
  const handleBuyItem = async (type, price) => {
    if (points >= price) {
      const newInventory = { ...inventory, [type]: inventory[type] + 1 };
      const newPoints = points - price;
      
      onUpdatePoints(newPoints);
      onUpdateInventory(newInventory);

      if (session?.user) {
        await supabase.from('profiles').update({ 
          inventory: newInventory,
          total_points: newPoints
        }).eq('id', session.user.id);
      }
    }
  };

  const handleBuyAvatar = async (avatar) => {
    if (unlocked.includes(avatar.id)) {
      onUpdateAvatar(avatar);
      if (session?.user) {
        await supabase.from('profiles').update({ active_avatar: JSON.stringify(avatar) }).eq('id', session.user.id);
      }
      return;
    }

    if (points >= avatar.price) {
      const newUnlocked = [...unlocked, avatar.id];
      const newPoints = points - avatar.price;
      
      onUpdatePoints(newPoints);
      onUpdateUnlocked(newUnlocked);
      onUpdateAvatar(avatar);

      if (session?.user) {
        await supabase.from('profiles').update({ 
          unlocked_avatars: newUnlocked,
          total_points: newPoints,
          active_avatar: JSON.stringify(avatar)
        }).eq('id', session.user.id);
      }
    }
  };

  return (
    <div className="screen" style={{ paddingBottom: '120px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '12px', width: '40px', height: '40px', color: 'white' }}>←</button>
          <h1 style={{ fontSize: '22px', margin: 0 }}>🛒 Bozor</h1>
        </div>
        <div className="stat-badge" style={{ background: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', border: '1px solid rgba(255, 215, 0, 0.2)' }}>
          🪙 {points.toLocaleString()}
        </div>
      </div>

      <h3 style={{ marginBottom: '15px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '800' }}>YORDAMCHI KUCHLAR</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>❤️</div>
          <div style={{ fontWeight: '800', marginBottom: '5px' }}>Qo'shimcha Hayot</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '15px' }}>O'yinni davom ettirish uchun</div>
          <button onClick={() => handleBuyItem('hearts', 500)} className="btn btn-primary" style={{ width: '100%', fontSize: '14px', padding: '10px' }}>
            500 🪙
          </button>
        </div>
        <div className="glass-card" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>❄️</div>
          <div style={{ fontWeight: '800', marginBottom: '5px' }}>Muzlatish</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '15px' }}>Vaqtni to'xtatib turadi</div>
          <button onClick={() => handleBuyItem('freeze', 300)} className="btn btn-primary" style={{ width: '100%', fontSize: '14px', padding: '10px' }}>
            300 🪙
          </button>
        </div>
      </div>

      <h3 style={{ marginBottom: '15px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: '800' }}>AVATARLAR</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {AVATARS.map(avatar => {
          const isUnlocked = unlocked.includes(avatar.id);
          const isActive = activeAvatar.id === avatar.id;
          
          return (
            <div key={avatar.id} className="glass-card" style={{ 
              padding: '15px', textAlign: 'center',
              border: isActive ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.05)',
              background: isActive ? 'rgba(64, 206, 243, 0.05)' : 'rgba(255,255,255,0.03)'
            }}>
              <img src={avatar.img} style={{ width: '60px', height: '60px', marginBottom: '10px', borderRadius: '15px' }} alt={avatar.name} />
              <div style={{ fontWeight: '800', fontSize: '13px', marginBottom: '10px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{avatar.name}</div>
              <button 
                onClick={() => handleBuyAvatar(avatar)}
                className={isUnlocked ? "btn btn-outline" : "btn btn-primary"}
                style={{ 
                  width: '100%', fontSize: '12px', padding: '8px',
                  background: isActive ? 'var(--accent-primary)' : (isUnlocked ? 'transparent' : 'var(--accent-secondary)'),
                  color: isActive ? 'black' : (isUnlocked ? 'white' : 'black'),
                  borderColor: isActive ? 'var(--accent-primary)' : (isUnlocked ? 'var(--accent-primary)' : 'transparent')
                }}
              >
                {isActive ? "TANLANGAN" : (isUnlocked ? "ALMASHTIRISH" : `${avatar.price} 🪙`)}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
