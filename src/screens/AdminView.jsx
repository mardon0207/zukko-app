import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

const SUBJECTS = ['Matematika', 'Tarix', 'Fizika', 'Rus tili', 'Kimyo', 'Biologiya', 'Informatika'];
const LEVELS = [1, 2, 3, 4, 5];

const EMPTY_FORM = { subject: 'Matematika', level: 1, question: '', options: ['', '', '', ''], answer: '' };

export const AdminView = ({ onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('Matematika');
  const [filterLevel, setFilterLevel] = useState(1);
  const [counts, setCounts] = useState({});

  // Form
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  
  // Delete confirm
  const [deleteId, setDeleteId] = useState(null);

  // Search
  const [search, setSearch] = useState('');

  const fetchCounts = async () => {
    const { data } = await supabase.from('questions').select('subject, level');
    if (data) {
      const c = {};
      data.forEach(q => {
        const key = `${q.subject}_${q.level}`;
        c[key] = (c[key] || 0) + 1;
      });
      setCounts(c);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    let query = supabase.from('questions')
      .select('*')
      .eq('subject', filterSubject)
      .eq('level', filterLevel)
      .order('id', { ascending: true });
    
    const { data, error } = await query;
    if (data) setQuestions(data);
    setLoading(false);
  };

  useEffect(() => { fetchQuestions(); }, [filterSubject, filterLevel]);
  useEffect(() => { fetchCounts(); }, []);

  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, subject: filterSubject, level: filterLevel });
    setShowForm(true);
  };

  const openEditForm = (q) => {
    setEditingId(q.id);
    setForm({
      subject: q.subject,
      level: q.level,
      question: q.question,
      options: [...q.options],
      answer: q.answer
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.question.trim() || form.options.some(o => !o.trim()) || !form.answer.trim()) {
      alert("Barcha maydonlarni to'ldiring!");
      return;
    }
    setSaving(true);
    
    const payload = {
      subject: form.subject,
      level: form.level,
      question: form.question.trim(),
      options: form.options.map(o => o.trim()),
      answer: form.answer.trim()
    };

    if (editingId) {
      await supabase.from('questions').update(payload).eq('id', editingId);
    } else {
      await supabase.from('questions').insert(payload);
    }
    
    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    fetchQuestions();
    fetchCounts();
  };

  const handleDelete = async (id) => {
    await supabase.from('questions').delete().eq('id', id);
    setDeleteId(null);
    fetchQuestions();
    fetchCounts();
  };

  const updateOption = (index, value) => {
    const newOpts = [...form.options];
    newOpts[index] = value;
    setForm({ ...form, options: newOpts });
  };

  const filtered = search
    ? questions.filter(q => q.question.toLowerCase().includes(search.toLowerCase()))
    : questions;

  return (
    <div className="screen" style={{ paddingBottom: '120px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px', padding: '10px 0' }}>
        <button onClick={onBack} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '12px', width: '40px', height: '40px', color: 'white' }}>←</button>
        <h1 style={{ fontSize: '22px', margin: 0 }}>⚙️ Admin Panel</h1>
      </div>

      {/* Subject Filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '15px' }}>
        {SUBJECTS.map(s => (
          <button key={s} onClick={() => setFilterSubject(s)}
            style={{
              padding: '6px 14px', borderRadius: '20px', border: 'none', fontSize: '12px', fontWeight: '800',
              background: filterSubject === s ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
              color: filterSubject === s ? '#000' : 'var(--text-muted)',
              cursor: 'pointer'
            }}>
            {s}
          </button>
        ))}
      </div>

      {/* Level Filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {LEVELS.map(lv => {
          const cnt = counts[`${filterSubject}_${lv}`] || 0;
          return (
            <button key={lv} onClick={() => setFilterLevel(lv)}
              style={{
                padding: '8px 16px', borderRadius: '14px', border: 'none', fontSize: '12px', fontWeight: '800',
                background: filterLevel === lv ? 'var(--accent-secondary)' : 'rgba(255,255,255,0.05)',
                color: filterLevel === lv ? '#000' : 'var(--text-muted)',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px'
              }}>
              <span>Daraja {lv}</span>
              <span style={{ fontSize: '10px', opacity: 0.7 }}>{cnt} ta</span>
            </button>
          );
        })}
      </div>

      {/* Search & Add */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text" placeholder="🔍 Savol qidirish..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, padding: '12px 18px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', outline: 'none'
          }}
        />
        <button onClick={openAddForm} style={{
          padding: '12px 20px', borderRadius: '16px', border: 'none', fontWeight: '900', fontSize: '14px',
          background: 'var(--accent-primary)', color: '#000', cursor: 'pointer', whiteSpace: 'nowrap'
        }}>
          + QO'SHISH
        </button>
      </div>

      {/* Questions List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card" style={{ padding: '20px' }}>
              <div className="skeleton" style={{ width: '80%', height: '20px', marginBottom: '15px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="skeleton" style={{ height: '35px' }} />
                <div className="skeleton" style={{ height: '35px' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '32px', marginBottom: '10px' }}>📭</div>
          <div style={{ color: 'var(--text-muted)' }}>Bu darajada savollar yo'q</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filtered.map((q, i) => (
            <div key={q.id} className="glass-card" style={{ padding: '14px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>#{q.id}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '8px', lineHeight: '1.4' }}>{q.question}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {q.options.map((opt, oi) => (
                      <span key={oi} style={{
                        padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '700',
                        background: opt === q.answer ? 'rgba(38,254,220,0.15)' : 'rgba(255,255,255,0.05)',
                        color: opt === q.answer ? 'var(--accent-secondary)' : 'var(--text-muted)',
                        border: opt === q.answer ? '1px solid var(--accent-secondary)' : '1px solid transparent'
                      }}>
                        {opt === q.answer && '✓ '}{opt}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button onClick={() => openEditForm(q)} style={{ background: 'rgba(64,206,243,0.1)', border: 'none', borderRadius: '10px', width: '34px', height: '34px', color: 'var(--accent-primary)', cursor: 'pointer', fontSize: '14px' }}>✏️</button>
                  <button onClick={() => setDeleteId(q.id)} style={{ background: 'rgba(255,77,109,0.1)', border: 'none', borderRadius: '10px', width: '34px', height: '34px', color: 'var(--error-color)', cursor: 'pointer', fontSize: '14px' }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,15,30,0.95)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass-card" style={{ textAlign: 'center', maxWidth: '320px', padding: '30px' }}>
            <div style={{ fontSize: '40px', marginBottom: '15px' }}>⚠️</div>
            <h3 style={{ marginBottom: '10px' }}>O'chirishni tasdiqlang</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>Bu savolni o'chirib bo'lmaydi. Davom etasizmi?</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setDeleteId(null)} className="btn btn-outline" style={{ flex: 1 }}>BEKOR</button>
              <button onClick={() => handleDelete(deleteId)} className="btn btn-primary" style={{ flex: 1, background: 'var(--error-color)' }}>O'CHIRISH</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,15,30,0.98)', zIndex: 10000, display: 'flex', flexDirection: 'column', padding: '20px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ fontSize: '20px' }}>{editingId ? '✏️ Tahrirlash' : '➕ Yangi savol'}</h2>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}>✕</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
            {/* Subject */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>FAN</label>
              <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
                style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px' }}>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Level */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>DARAJA</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {LEVELS.map(lv => (
                  <button key={lv} onClick={() => setForm({ ...form, level: lv })}
                    style={{
                      flex: 1, padding: '10px', borderRadius: '12px', border: 'none', fontWeight: '800',
                      background: form.level === lv ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                      color: form.level === lv ? '#000' : 'var(--text-muted)', cursor: 'pointer'
                    }}>{lv}</button>
                ))}
              </div>
            </div>

            {/* Question */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>SAVOL MATNI</label>
              <textarea value={form.question} onChange={e => setForm({ ...form, question: e.target.value })}
                rows={3}
                style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' }}
                placeholder="Savol matnini kiriting..." />
            </div>

            {/* Options */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '6px', display: 'block' }}>VARIANTLAR (4 ta)</label>
              {form.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <span style={{ minWidth: '24px', height: '24px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900', color: 'var(--text-muted)' }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <input
                    type="text" value={opt}
                    onChange={e => updateOption(i, e.target.value)}
                    style={{ flex: 1, padding: '10px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', fontSize: '14px', outline: 'none' }}
                    placeholder={`Variant ${String.fromCharCode(65 + i)}`}
                  />
                  <button onClick={() => setForm({ ...form, answer: opt })}
                    style={{
                      padding: '8px 12px', borderRadius: '10px', border: 'none', fontSize: '11px', fontWeight: '800', cursor: 'pointer',
                      background: form.answer === opt && opt ? 'rgba(38,254,220,0.2)' : 'rgba(255,255,255,0.05)',
                      color: form.answer === opt && opt ? 'var(--accent-secondary)' : 'var(--text-muted)'
                    }}>
                    {form.answer === opt && opt ? '✓ TO\'G\'RI' : 'Belgilash'}
                  </button>
                </div>
              ))}
            </div>

            {/* Answer display */}
            {form.answer && (
              <div style={{ padding: '10px 16px', borderRadius: '12px', background: 'rgba(38,254,220,0.08)', border: '1px solid rgba(38,254,220,0.2)', fontSize: '13px' }}>
                ✅ To'g'ri javob: <strong style={{ color: 'var(--accent-secondary)' }}>{form.answer}</strong>
              </div>
            )}

            {/* Save Button */}
            <button onClick={handleSave} disabled={saving}
              className="btn btn-primary"
              style={{ width: '100%', padding: '14px', borderRadius: '16px', fontSize: '16px', fontWeight: '900', marginTop: '10px' }}>
              {saving ? 'Saqlanmoqda...' : (editingId ? 'YANGILASH' : 'SAQLASH')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
