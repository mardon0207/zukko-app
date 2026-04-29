import React from 'react';
import { ARTIFACTS } from '../constants/artifacts';

export const CollectionView = ({ collection = [], onBack, onPlaySFX }) => {
  const foundCount = collection.length;
  const totalCount = ARTIFACTS.length;

  return (
    <div className="screen" style={{ paddingBottom: '100px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', padding: '10px 0' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '15px', width: '45px', height: '45px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>←</button>
        <div>
          <h1 style={{ fontSize: '24px', margin: 0, fontWeight: '900' }}>🏺 Mening Xazinam</h1>
          <div style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: '800' }}>
            {foundCount} / {totalCount} ARTEFAKT TOPILDI
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        {ARTIFACTS.map(art => {
          const isFound = collection.includes(art.id);
          
          return (
            <div 
              key={art.id}
              className={`glass-card ${isFound && art.rarity === 'Afsonaviy' ? 'rarity-legendary' : ''}`}
              style={{ 
                padding: '20px', 
                textAlign: 'center', 
                opacity: isFound ? 1 : 0.4,
                border: isFound ? `1px solid ${art.color}55` : '1px solid rgba(255,255,255,0.05)',
                background: isFound ? `linear-gradient(135deg, ${art.color}11, transparent)` : 'rgba(255,255,255,0.02)',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ 
                fontSize: '50px', 
                marginBottom: '10px', 
                filter: isFound ? `drop-shadow(0 0 10px ${art.color}44)` : 'grayscale(1) blur(2px)' 
              }}>
                {isFound ? art.icon : '❓'}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '900', color: isFound ? 'white' : 'var(--text-muted)' }}>
                {isFound ? art.name : 'Noma\'lum'}
              </div>
              <div style={{ fontSize: '9px', color: art.color, fontWeight: '800', marginTop: '4px', textTransform: 'uppercase' }}>
                {art.rarity}
              </div>
              {isFound && (
                <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.4' }}>
                  {art.desc}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="glass-card" style={{ marginTop: '30px', textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, rgba(64, 206, 243, 0.1), transparent)' }}>
        <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-primary)', marginBottom: '5px' }}>MAQSAD</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          Barcha artefaktlarni to'plang va "Buyuk Tarixchi" unvoniga ega bo'ling!
        </div>
      </div>
    </div>
  );
};
