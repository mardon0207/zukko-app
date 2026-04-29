import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

export const ResultView = ({ score, streak, onRestart, onHome, onOpenChest }) => {
  const isExcellent = score >= 100;
  const location = useLocation();
  const [chestOpened, setChestOpened] = useState(false);
  const hasChest = location.state?.hasChest && !chestOpened;
  
  return (
    <div className="screen" style={{ textAlign: 'center', justifyContent: 'center' }}>
      <div className="glass-card" style={{ padding: '40px 20px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>
          {isExcellent ? '🏆' : '👏'}
        </div>
        <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>
          {isExcellent ? 'Ajoyib natija!' : 'Yomon emas!'}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
          Siz ushbu raundda bilimingizni namoyish etdingiz.
        </p>

        {hasChest && (
          <div className="glass-card animate-glow" style={{ marginBottom: '30px', background: 'rgba(255, 213, 79, 0.1)', border: '1px solid #ffd54f' }}>
             <div style={{ fontSize: '40px', marginBottom: '10px' }}>🎁</div>
             <div style={{ fontSize: '13px', fontWeight: '900', color: '#ffd54f', marginBottom: '15px' }}>SIZGA SANDIQ TUSHDI!</div>
             <button className="btn btn-primary" onClick={() => { onOpenChest(); setChestOpened(true); }} style={{ background: '#ffd54f', color: '#000', width: '100%' }}>
               SANDIQNI OCHISH
             </button>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '40px' }}>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800' }}>BALL</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--accent-primary)' }}>{score}</div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          <div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '800' }}>STREAK</div>
            <div style={{ fontSize: '36px', fontWeight: '800', color: 'var(--accent-secondary)' }}>{streak}</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button className="btn btn-primary" onClick={onRestart} style={{ width: '100%' }}>
            YANA O'YNASH
          </button>
          <button className="btn btn-outline" onClick={onHome} style={{ width: '100%' }}>
            BOSH SAHIFAGA
          </button>
        </div>
      </div>
    </div>
  );
};
