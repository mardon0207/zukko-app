import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './utils/supabase';

// Screens
import { AuthView } from './screens/AuthView';
import { MainMenu } from './screens/MainMenu';
import { SubjectPicker } from './screens/SubjectPicker';
import { GameView } from './screens/GameView';
import { ResultView } from './screens/ResultView';
import { AdminView } from './screens/AdminView';
import { ShopView } from './screens/ShopView';
import { LeaderboardView } from './screens/LeaderboardView';
import { ProfileView } from './screens/ProfileView';
import { CollectionView } from './screens/CollectionView';

// Constants
import { ARTIFACTS } from './constants/artifacts';

const AVATARS = [
  { id: "owl", img: "https://api.dicebear.com/7.x/bottts/svg?seed=owl", name: "Donishmand Boyo'g'li", price: 0 },
  { id: "fox", img: "https://api.dicebear.com/7.x/bottts/svg?seed=fox", name: "Aqlvoy Tulki", price: 500 },
  { id: "bear", img: "https://api.dicebear.com/7.x/bottts/svg?seed=bear", name: "Polvon Ayiq", price: 1200 },
  { id: "cat", img: "https://api.dicebear.com/7.x/bottts/svg?seed=cat", name: "Ziyorak Mushuk", price: 2500 },
  { id: "robot", img: "https://api.dicebear.com/7.x/bottts/svg?seed=robot", name: "Bilimdon Robot", price: 5000 },
  { id: "dragon", img: "https://api.dicebear.com/7.x/bottts/svg?seed=dragon", name: "Olovli Ajdar", price: 10000 }
];

const playSFX = (type) => {
  const sounds = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    correct: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
    wrong: 'https://assets.mixkit.co/active_storage/sfx/951/951-preview.mp3',
    win: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
    buy: 'https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3'
  };
  if (sounds[type]) {
    const audio = new Audio(sounds[type]);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }
};

function App() {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSubject, setSelectedSubject] = useState(null);
  const [lastResult, setLastResult] = useState({ score: 0, streak: 0 });
  const [points, setPoints] = useState(0);
  
  const [subjectStats, setSubjectStats] = useState({});
  const [unlockedAvatars, setUnlockedAvatars] = useState(["owl"]);
  const [inventory, setInventory] = useState({ hearts: 0, freeze: 0 });
  const [activeAvatar, setActiveAvatar] = useState(AVATARS[0]);
  const [mistakes, setMistakes] = useState([]);
  const [collection, setCollection] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showRankMap, setShowRankMap] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState(null);
  const [chestToOpen, setChestToOpen] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  const fetchUserData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('total_points, subject_stats, unlocked_avatars, inventory, active_avatar, mistakes, is_admin, collection')
        .eq('id', userId)
        .single();
        
      if (data) {
        setPoints(data.total_points || 0);
        setSubjectStats(data.subject_stats || {});
        setUnlockedAvatars(data.unlocked_avatars || ["owl"]);
        setInventory(data.inventory || { hearts: 0, freeze: 0 });
        setMistakes(data.mistakes || []);
        setCollection(data.collection || []);
        setIsAdmin(data.is_admin || false);
        try {
          if (data.active_avatar) {
            const avData = typeof data.active_avatar === 'string' ? JSON.parse(data.active_avatar) : data.active_avatar;
            const avatarId = typeof avData === 'object' ? avData.id : avData;
            const found = AVATARS.find(a => a.id === avatarId);
            if (found) setActiveAvatar(found);
            else if (avData && avData.img) setActiveAvatar(avData);
          }
        } catch (e) {}
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user?.user_metadata?.display_name || null);
      if (session?.user) fetchUserData(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user?.user_metadata?.display_name || null);
      if (session?.user) fetchUserData(session.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const goHome = () => { navigate('/'); playSFX('click'); };

  const handleUpdateMistakes = async (newMistakes) => {
    setMistakes(newMistakes);
    if (session?.user) {
      await supabase.from('profiles').update({ mistakes: newMistakes }).eq('id', session.user.id);
    }
  };

  const handleGameOver = async (score, streak, masteryAdded) => {
    setLastResult({ score, streak });
    const oldPoints = points;
    const newPoints = points + score;
    setPoints(newPoints);
    
    const newStats = { ...subjectStats };
    if (selectedSubject !== 'mistakes') {
      newStats[selectedSubject] = (newStats[selectedSubject] || 0) + score;
      setSubjectStats(newStats);
    }

    // Collection Drop Logic: 20% chance if score > 50
    let earnedChest = null;
    if (score > 50 && Math.random() < 0.25) {
      earnedChest = true;
    }

    if (session?.user) {
      const { error } = await supabase.rpc('add_points_secure', {
        points_to_add: score,
        subject_name: selectedSubject
      });
      
      if (error) {
        console.error("Xatolik: Ballarni saqlab bo'lmadi", error);
      }
    }
    
    if (masteryAdded > 0) {
      setBubbleMessage(`BARAKALLA! ${masteryAdded} ta xatoni tuzatdingiz! ✨`);
      setTimeout(() => setBubbleMessage(null), 4000);
    }
    
    navigate('/result', { state: { hasChest: earnedChest } });
  };

  const openChest = async () => {
    playSFX('win');
    const uncollected = ARTIFACTS.filter(a => !collection.includes(a.id));
    if (uncollected.length === 0) {
      setBubbleMessage("Siz barcha artefaktlarni to'plab bo'ldingiz! 🎉");
      return;
    }
    
    const newItem = uncollected[Math.floor(Math.random() * uncollected.length)];
    const newCollection = [...collection, newItem.id];
    setCollection(newCollection);
    setChestToOpen(newItem);

    if (session?.user) {
      await supabase.from('profiles').update({ collection: newCollection }).eq('id', session.user.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) return <div className="loading-screen">Yuklanmoqda...</div>;
  if (!session) return <AuthView onAuthSuccess={() => {}} />;

  const isGameOrResult = location.pathname === '/game' || location.pathname === '/result';

  return (
    <>
      {bubbleMessage && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent-primary)', color: 'black', padding: '12px 24px', borderRadius: '20px', fontWeight: '800', zIndex: 9999, boxShadow: '0 10px 25px rgba(64, 206, 243, 0.4)', fontSize: '14px', textAlign: 'center', width: '80%' }}>
          {bubbleMessage}
        </div>
      )}

      {/* Chest Opening Modal */}
      {chestToOpen && (
        <div className="screen" style={{ position: 'fixed', inset: 0, zIndex: 10001, background: 'rgba(2,10,19,0.95)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px' }}>
           <div className="animate-glow" style={{ fontSize: '120px', marginBottom: '20px' }}>{chestToOpen.icon}</div>
           <h2 style={{ fontSize: '14px', color: chestToOpen.color, fontWeight: '900', letterSpacing: '2px' }}>YANGI ARTEFAKT!</h2>
           <h1 style={{ fontSize: '32px', fontWeight: '900', margin: '10px 0' }}>{chestToOpen.name}</h1>
           <p style={{ color: 'var(--text-muted)', marginBottom: '30px', maxWidth: '280px' }}>{chestToOpen.desc}</p>
           <button className="btn btn-primary" onClick={() => setChestToOpen(null)} style={{ padding: '15px 40px' }}>AJOYIB!</button>
        </div>
      )}

      <div style={{ flex: 1, paddingBottom: !isGameOrResult ? '100px' : '0' }}>
        <Routes>
          <Route path="/" element={<MainMenu user={user || 'Zukko'} totalPoints={points} activeAvatar={activeAvatar} subjectStats={subjectStats} mistakes={mistakes} onStart={() => { playSFX('click'); navigate('/subject'); }} onStartMistakes={() => { playSFX('click'); setSelectedSubject('mistakes'); navigate('/game'); }} onShowRankMap={() => { playSFX('click'); setShowRankMap(true); }} />} />
          <Route path="/subject" element={<SubjectPicker stats={subjectStats} onSelect={(s) => { playSFX('click'); setSelectedSubject(s); navigate('/game'); }} onBack={() => { playSFX('click'); navigate(-1); }} />} />
          <Route path="/game" element={<GameView subject={selectedSubject} activeAvatar={activeAvatar} mistakes={mistakes} subjectStats={subjectStats} onUpdateMistakes={handleUpdateMistakes} onGameOver={handleGameOver} onBack={goHome} onPlaySFX={playSFX} />} />
          <Route path="/result" element={<ResultView score={lastResult.score} streak={lastResult.streak} onRestart={() => { playSFX('click'); navigate('/game'); }} onHome={goHome} onPlaySFX={playSFX} onOpenChest={openChest} />} />
          <Route path="/shop" element={<ShopView points={points} inventory={inventory} unlocked={unlockedAvatars} activeAvatar={activeAvatar} onUpdatePoints={setPoints} onUpdateInventory={setInventory} onUpdateUnlocked={setUnlockedAvatars} onUpdateAvatar={setActiveAvatar} session={session} onBack={goHome} onPlaySFX={playSFX} />} />
          <Route path="/leaderboard" element={<LeaderboardView currentUser={user} onBack={goHome} onPlaySFX={playSFX} />} />
          <Route path="/collection" element={<CollectionView collection={collection} onBack={goHome} onPlaySFX={playSFX} />} />
          <Route path="/profile" element={<ProfileView user={user} points={points} stats={subjectStats} activeAvatar={activeAvatar} onLogout={handleLogout} collection={collection} isAdmin={isAdmin} loading={loading} onPlaySFX={playSFX} />} />
          {isAdmin && <Route path="/admin" element={<AdminView onBack={goHome} onPlaySFX={playSFX} />} />}
        </Routes>
      </div>

      {!isGameOrResult && (
        <div className="nav-bar">
          <TabItem active={location.pathname === '/'} icon="🏠" label="ASOSIY" onClick={() => { playSFX('click'); navigate('/'); }} />
          <TabItem active={location.pathname === '/leaderboard'} icon="📊" label="REYTING" onClick={() => { playSFX('click'); navigate('/leaderboard'); }} />
          <TabItem active={location.pathname === '/shop'} icon="🛒" label="BOZOR" onClick={() => { playSFX('click'); navigate('/shop'); }} />
          <TabItem active={location.pathname === '/profile'} icon={String(activeAvatar?.img || "👤")} label="PROFIL" onClick={() => { playSFX('click'); navigate('/profile'); }} />
        </div>
      )}
    </>
  );
}

const TabItem = ({ active, icon, label, onClick }) => {
  const isImage = typeof icon === 'string' && (icon.includes('http') || icon.includes('dicebear') || icon.includes('.svg') || icon.includes('.png'));
  
  return (
    <button onClick={onClick} className={`tab-item ${active ? 'active' : ''}`}>
      <span style={{ 
        filter: active ? 'none' : 'grayscale(1)', 
        opacity: active ? 1 : 0.6, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        transition: 'all 0.3s'
      }}>
        {isImage ? (
          <img 
            src={icon} 
            alt={label} 
            style={{ 
              width: '24px', 
              height: '24px', 
              borderRadius: '8px', 
              objectFit: 'cover',
              border: active ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)'
            }} 
          />
        ) : icon}
      </span>
      <span style={{ color: active ? 'var(--accent-primary)' : 'var(--text-muted)' }}>{label}</span>
    </button>
  );
};

export default App;
