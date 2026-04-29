import React, { useState, useEffect } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';

export const GameView = ({ subject, activeAvatar, mistakes, subjectStats, onUpdateMistakes, onGameOver, onBack }) => {
  const { 
    currentQuestion, currentQuestionIndex, totalQuestions, 
    score, streak, lives, timeLeft, mascotState, 
    isGameOver, handleAnswer, useLifeline, usedLifelines, hiddenOptions,
    isFrozen, activateFreeze, setLives, isShaking, isLoading, results
  } = useGameLogic(subject, mistakes, subjectStats, onUpdateMistakes, onGameOver);

  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [inventory, setInventory] = useState(JSON.parse(localStorage.getItem('quiz_inventory') || '{"hearts":0, "freeze":0}'));
  const [bubbleText, setBubbleText] = useState(null);

  const mascotEmoji = {
    neutral: '🦉', happy: '🥳', sad: '😢', panic: '😰'
  };

  const onOptionClick = (optionText, index) => {
    if (isAnswering || isGameOver) return;
    setSelectedOption(index);
    setIsAnswering(true);
    
    const isCorrect = handleAnswer(optionText);
    if (isCorrect) {
      if (subject === 'mistakes') {
        setBubbleText("Zo'r! Bu xatoni o'zlashtirdingiz! 🚀");
      } else {
        setBubbleText("Barakalla! To'g'ri javob! ✨");
      }
    } else {
      setBubbleText("Afsus, adashdingiz... 😔");
    }

    setTimeout(() => {
      setSelectedOption(null);
      setIsAnswering(false);
      setBubbleText(null);
    }, 1200);
  };

  const useBooster = (type) => {
    if (inventory[type] <= 0) return;
    const newInv = { ...inventory, [type]: inventory[type] - 1 };
    setInventory(newInv);
    localStorage.setItem('quiz_inventory', JSON.stringify(newInv));
    if (type === 'freeze') activateFreeze();
    if (type === 'hearts') setLives(l => l + 1);
  };

  const [genIndices, setGenIndices] = useState([]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setGenIndices(prev => {
          const next = [...prev, Math.floor(Math.random() * 100) + 1];
          return next.slice(-5);
        });
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="screen" style={{ justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)' }}>
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>🎲</div>
          <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>Generator ishlamoqda...</h2>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', height: '30px' }}>
            {genIndices.map((idx, i) => (
              <span key={i} style={{ 
                color: i === genIndices.length - 1 ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
                fontWeight: '800',
                fontSize: i === genIndices.length - 1 ? '18px' : '14px',
                transition: 'all 0.2s'
              }}>#{idx}</span>
            ))}
          </div>
          <p style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>Tasodifiy savollar tanlanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion && !isGameOver) {
    return (
      <div className="screen" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: '60px' }}>🤷‍♂️</div>
        <h2 style={{ marginTop: '20px' }}>Hozircha savollar yo'q</h2>
        <button className="btn btn-primary" onClick={onBack} style={{ marginTop: '20px' }}>QAYTISH</button>
      </div>
    );
  }

  return (
    <div className={`screen ${isShaking ? 'shake' : ''}`} style={{ paddingBottom: '120px' }}>
      {/* Exit Confirm Modal */}
      {showExitConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,15,30,0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ textAlign: 'center', maxWidth: '300px' }}>
            <h3 style={{ marginBottom: '15px' }}>Chiqmoqchimisiz?</h3>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '20px' }}>Hozir chiqib ketsangiz, to'plangan ballaringiz saqlanmaydi!</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowExitConfirm(false)}>YO'Q</button>
              <button className="btn btn-primary" style={{ flex: 1, background: 'var(--error-color)' }} onClick={onBack}>HA, CHIQISH</button>
            </div>
          </div>
        </div>
      )}

      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setShowExitConfirm(true)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '10px', width: '35px', height: '35px', color: 'white', fontSize: '18px' }}>✕</button>
          <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--accent-primary)', textTransform: 'uppercase' }}>{subject}</span>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', padding: '5px 12px', borderRadius: '40px', border: '1px solid var(--glass-border)', display: 'flex', gap: '4px' }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} style={{ color: i < lives ? '#ff4d6d' : 'rgba(255,255,255,0.1)', fontSize: '14px' }}>❤️</span>
            ))}
          </div>
          <div style={{ position: 'relative', width: '35px', height: '35px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="35" height="35" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="17.5" cy="17.5" r="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
              <circle cx="17.5" cy="17.5" r="15" fill="none" stroke={isFrozen ? 'var(--accent-secondary)' : 'var(--accent-primary)'} strokeWidth="2" strokeDasharray="94" strokeDashoffset={94 - (94 * timeLeft) / 15} style={{ transition: isFrozen ? 'none' : 'stroke-dashoffset 1s linear' }} />
            </svg>
            <span style={{ position: 'absolute', fontWeight: '800', fontSize: '11px', color: timeLeft <= 5 ? 'var(--error-color)' : 'white' }}>{timeLeft}</span>
          </div>
        </div>
      </div>

      {/* Progress Dots & Question Number */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)' }}>SAVOL <span style={{ color: 'white' }}>{currentQuestionIndex + 1} / {totalQuestions}</span></span>
          <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-secondary)' }}>SCORE: {score}</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {results.map((res, i) => (
            <div key={i} className={`progress-dot ${res === true ? 'correct' : res === false ? 'wrong' : i === currentQuestionIndex ? 'active' : ''}`} />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div style={{ position: 'relative', marginTop: '20px' }}>
        <div className="mascot-bounce" style={{ 
          position: 'absolute', top: '-35px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 10, width: '64px', height: '64px', borderRadius: '50%',
          background: 'var(--surface-high)', border: '2px solid var(--accent-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px'
        }}>
          {mascotEmoji[mascotState]}
          {bubbleText && <div className="mascot-bubble">{bubbleText}</div>}
        </div>
        <div className="glass-card" style={{ paddingTop: '45px', textAlign: 'center', minHeight: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: isFrozen ? '2px solid var(--accent-secondary)' : '1px solid var(--glass-border)' }}>
          <h2 style={{ fontSize: '19px', lineHeight: '1.5', fontWeight: '800' }}>{currentQuestion.question}</h2>
        </div>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '25px' }}>
        {currentQuestion.options.map((option, index) => {
          let statusClass = '';
          const isCorrectAnswer = option === currentQuestion.answer;
          
          if (isAnswering) {
            if (isCorrectAnswer) statusClass = 'btn-correct';
            else if (index === selectedOption) statusClass = 'btn-wrong';
          }
          if (hiddenOptions.includes(index)) statusClass = 'btn-hidden';

          return (
            <button key={index} className={`btn btn-outline ${statusClass}`} style={{ justifyContent: 'flex-start', padding: '15px 20px', borderRadius: '22px' }} onClick={() => onOptionClick(option, index)}>
              <div className="option-letter">{String.fromCharCode(65 + index)}</div>
              <span style={{ fontSize: '15px', fontWeight: '700' }}>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Lifeline & Boosters */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '25px' }}>
        <button className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '12px', borderRadius: '40px', opacity: usedLifelines.half ? 0.3 : 1 }} onClick={() => useLifeline('half')} disabled={usedLifelines.half || isAnswering}>🌓 50/50</button>
        {inventory.freeze > 0 && <button className="btn btn-outline" style={{ padding: '10px 20px', fontSize: '12px', borderRadius: '40px', background: isFrozen ? 'rgba(64,206,243,0.3)' : 'transparent' }} onClick={() => useBooster('freeze')}>❄️ Muzlatish</button>}
      </div>
    </div>
  );
};
