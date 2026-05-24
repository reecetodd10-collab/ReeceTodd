'use client';

import { useState, useEffect, useRef } from 'react';

// --- Captain Wheel SVG Icon ---
const CaptainWheel = ({ size = 28, color = '#00d9ff' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none">
    <circle cx="256" cy="256" r="160" stroke={color} strokeWidth="10" fill="none"/>
    <circle cx="256" cy="256" r="45" stroke={color} strokeWidth="8" fill="none"/>
    <circle cx="256" cy="256" r="16" fill={color}/>
    <line x1="256" y1="211" x2="256" y2="96" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <line x1="256" y1="301" x2="256" y2="416" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <line x1="211" y1="256" x2="96" y2="256" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <line x1="301" y1="256" x2="416" y2="256" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <line x1="224" y1="224" x2="143" y2="143" stroke={color} strokeWidth="8" strokeLinecap="round"/>
    <line x1="288" y1="288" x2="369" y2="369" stroke={color} strokeWidth="8" strokeLinecap="round"/>
    <line x1="288" y1="224" x2="369" y2="143" stroke={color} strokeWidth="8" strokeLinecap="round"/>
    <line x1="224" y1="288" x2="143" y2="369" stroke={color} strokeWidth="8" strokeLinecap="round"/>
    <circle cx="256" cy="96" r="16" fill={color}/>
    <circle cx="256" cy="416" r="16" fill={color}/>
    <circle cx="96" cy="256" r="16" fill={color}/>
    <circle cx="416" cy="256" r="16" fill={color}/>
    <circle cx="143" cy="143" r="13" fill={color}/>
    <circle cx="369" cy="369" r="13" fill={color}/>
    <circle cx="369" cy="143" r="13" fill={color}/>
    <circle cx="143" cy="369" r="13" fill={color}/>
  </svg>
);

const QUICK_COMMANDS = [
  { label: 'Check Email', icon: '📧', cmd: 'Check my latest unread emails and summarize them' },
  { label: 'Calendar Today', icon: '📅', cmd: "What's on my calendar today?" },
  { label: 'Calendar Week', icon: '🗓', cmd: 'Show me my calendar for the rest of this week' },
  { label: 'Deploy Site', icon: '🚀', cmd: 'Deploy the Aviera site to Vercel' },
  { label: 'Git Status', icon: '🔀', cmd: 'Show me git status and recent commits' },
  { label: 'Draft Email', icon: '✉️', cmd: 'Help me draft an email' },
  { label: 'Job Alerts', icon: '💼', cmd: 'Check my latest job alert emails and summarize the best ones' },
  { label: 'Site Status', icon: '🌐', cmd: 'Check if avierafit.com is up and running' },
  { label: 'Apply Jobs', icon: '📝', cmd: 'Find the best job listings from my recent emails and help me apply' },
  { label: 'Send Notif', icon: '🔔', cmd: 'Send me a test push notification to my phone' },
];

const PRIORITY_TASKS = [
  { id: 1, text: 'Apply Supabase migration (newsletter categories)', done: false, priority: 'high' },
  { id: 2, text: 'Build newsletter send API with Resend', done: false, priority: 'high' },
  { id: 3, text: 'Clerk → Supabase Auth swap (11 files)', done: false, priority: 'medium' },
  { id: 4, text: 'Make /home the root page', done: false, priority: 'medium' },
  { id: 5, text: 'Fix EmailCapture.jsx', done: false, priority: 'low' },
];

// Calendar events are now fetched from Supabase via API

const RECENT_EMAILS = [
  { sender: 'Indeed', subject: 'Junior Business Data Analyst @ Asset Capital Market', time: '4:57 PM', type: 'job' },
  { sender: 'LinkedIn', subject: 'Business Analyst at Amtex Systems', time: '6:21 PM', type: 'job' },
  { sender: 'LinkedIn', subject: 'Data Scientist I - Remote at Velera', time: '4:21 PM', type: 'job' },
  { sender: 'LinkedIn', subject: 'Data Analyst at Cobalt', time: '2:21 PM', type: 'job' },
  { sender: 'Venmo', subject: 'You paid Grace Jonas $20.00', time: '5:50 PM', type: 'finance' },
  { sender: 'Dice', subject: 'Account Executive at Accede Solutions', time: '1:59 PM', type: 'job' },
  { sender: 'Padres', subject: 'Naruto & Filipino Heritage Theme Games', time: '2:03 PM', type: 'promo' },
];

// --- Push notification helpers ---
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

async function ensurePushSubscription() {
  if (!('serviceWorker' in navigator) || !('Notification' in window)) return;
  try {
    // Force update service worker
    const reg = await navigator.serviceWorker.register('/captain-sw.js', { updateViaCache: 'none' });
    await reg.update().catch(() => {});
    await navigator.serviceWorker.ready;

    if (Notification.permission !== 'granted') {
      console.log('[Captain Seat] Notification permission:', Notification.permission);
      return;
    }

    // Unsubscribe old and create fresh subscription
    const existingSub = await reg.pushManager.getSubscription();
    if (existingSub) await existingSub.unsubscribe();

    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
    });

    const subJSON = sub.toJSON();
    console.log('[Captain Seat] Subscribing with keys:', !!subJSON.keys?.p256dh, !!subJSON.keys?.auth);

    const res = await fetch('/api/command-center/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: subJSON }),
    });
    const data = await res.json();
    console.log('[Captain Seat] Push subscription result:', data);
    return data;
  } catch (err) {
    console.error('[Captain Seat] Push setup error:', err);
  }
}

// --- Calendar helpers ---
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}
function toDateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CaptainSeat() {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([]);
  const [tasks, setTasks] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('captain-tasks');
      return saved ? JSON.parse(saved) : PRIORITY_TASKS;
    }
    return PRIORITY_TASKS;
  });
  const [activeTab, setActiveTab] = useState('home');
  const [newTask, setNewTask] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);
  const [time, setTime] = useState(new Date());
  const [notifStatus, setNotifStatus] = useState('default');

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(null);
  const [calEvents, setCalEvents] = useState({});
  const [calLoading, setCalLoading] = useState(true);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('12:00 PM');

  const inputRef = useRef(null);
  const historyRef = useRef(null);

  // Register SW + auto-subscribe on mount
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    if ('Notification' in window) {
      setNotifStatus(Notification.permission);
    }
    // Always try to sync subscription on load
    ensurePushSubscription();
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('captain-tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Fetch calendar from API on mount
  useEffect(() => {
    fetch('/api/command-center/calendar').then(r => r.json()).then(data => {
      if (data.events) {
        // Transform API format to local format
        const formatted = {};
        for (const [dateKey, events] of Object.entries(data.events)) {
          formatted[dateKey] = events.map(ev => ({
            id: ev.id, time: ev.start_time, title: ev.title,
            duration: ev.duration, highlight: ev.highlight, location: ev.location, source: ev.source,
          }));
        }
        setCalEvents(formatted);
      }
      setCalLoading(false);
    }).catch(() => setCalLoading(false));
  }, []);

  useEffect(() => {
    if (historyRef.current) historyRef.current.scrollTop = historyRef.current.scrollHeight;
  }, [history]);

  const enableNotifications = async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    setNotifStatus(perm);
    if (perm === 'granted') await ensurePushSubscription();
  };

  const sendCommand = () => {
    if (!command.trim()) return;
    setHistory(prev => [...prev, { type: 'sent', text: command, time: new Date() }]);
    setHistory(prev => [...prev, { type: 'response', text: 'Copied! Paste into your Claude Code session.', time: new Date() }]);
    navigator.clipboard?.writeText(command);
    setCommand('');
  };

  const runQuickCommand = (cmd) => {
    navigator.clipboard?.writeText(cmd);
    setHistory(prev => [...prev, { type: 'sent', text: cmd, time: new Date() }]);
    setHistory(prev => [...prev, { type: 'response', text: 'Copied to clipboard!', time: new Date() }]);
    setActiveTab('coms');
  };

  const toggleTask = (id) => setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTask, done: false, priority: 'medium' }]);
    setNewTask(''); setShowAddTask(false);
  };
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));

  // Calendar actions
  const prevMonth = () => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); setSelectedDate(null); };
  const nextMonth = () => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); setSelectedDate(null); };

  const addCalEvent = async () => {
    if (!newEventTitle.trim() || !selectedDate) return;
    const key = selectedDate;
    const ev = { id: 'temp_' + Date.now(), time: newEventTime, title: newEventTitle, duration: '1h' };
    setCalEvents(prev => ({ ...prev, [key]: [...(prev[key] || []), ev] }));
    setNewEventTitle(''); setNewEventTime('12:00 PM'); setShowAddEvent(false);
    // Save to API
    const res = await fetch('/api/command-center/calendar', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date_key: key, title: ev.title, start_time: ev.time, duration: '1h' }),
    }).then(r => r.json());
    if (res.id) {
      setCalEvents(prev => {
        const updated = { ...prev };
        updated[key] = (updated[key] || []).map(e => e.id === ev.id ? { ...e, id: res.id } : e);
        return updated;
      });
    }
  };

  const deleteCalEvent = async (dateKey, eventId) => {
    setCalEvents(prev => {
      const updated = { ...prev };
      updated[dateKey] = (updated[dateKey] || []).filter(e => e.id !== eventId);
      if (updated[dateKey].length === 0) delete updated[dateKey];
      return updated;
    });
    await fetch('/api/command-center/calendar', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: eventId }),
    });
  };

  const greeting = time.getHours() < 12 ? 'Good Morning' : time.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const priorityColor = (p) => p === 'high' ? '#ef4444' : p === 'medium' ? '#f59e0b' : '#10b981';
  const emailTypeColor = (t) => t === 'job' ? '#00d9ff' : t === 'finance' ? '#10b981' : '#71717a';

  // Calendar grid
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfWeek(calYear, calMonth);
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  // Upcoming events for home tab
  const upcomingEvents = [];
  const sortedKeys = Object.keys(calEvents).sort();
  for (const key of sortedKeys) {
    if (key >= todayKey && upcomingEvents.length < 4) {
      const [y, m, d] = key.split('-').map(Number);
      const dayDate = new Date(y, m - 1, d);
      const label = key === todayKey ? 'Today' : dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      upcomingEvents.push({ dateLabel: label, events: calEvents[key] });
    }
  }

  const s = {
    page: { minHeight: '100vh', background: '#09090b', color: '#fafafa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', paddingBottom: '80px', maxWidth: '100vw', overflowX: 'hidden' },
    card: { background: '#0f0f12', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 16px', marginBottom: 8 },
    sectionLabel: { fontSize: 13, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 12px 4px' },
    cyanBtn: { padding: '14px', background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.2)', borderRadius: 14, color: '#00d9ff', fontSize: 14, fontWeight: 600, cursor: 'pointer' },
  };

  return (
    <div style={s.page}>
      {typeof window !== 'undefined' && <style>{`@media(display-mode:standalone){body{padding-top:env(safe-area-inset-top)}}`}</style>}

      {/* Status Bar */}
      <div style={{ padding: '12px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <span style={{ fontSize: 12, color: '#71717a' }}>ONLINE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <CaptainWheel size={16} color="#00d9ff" />
          <span style={{ fontSize: 12, color: '#71717a', letterSpacing: '0.05em', fontWeight: 600 }}>CAPTAIN SEAT</span>
        </div>
        <span style={{ fontSize: 12, color: '#71717a' }}>{timeStr}</span>
      </div>

      {/* Header */}
      <div style={{ padding: '20px 20px 12px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <CaptainWheel size={38} color="#00d9ff" />
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>{greeting}, Captain</h1>
          <p style={{ fontSize: 13, color: '#71717a', margin: '2px 0 0' }}>{dateStr}</p>
        </div>
      </div>

      {/* Notification Banner */}
      {notifStatus !== 'granted' && (
        <div style={{ padding: '0 16px', marginBottom: 12 }}>
          <button onClick={enableNotifications} style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,217,255,0.08)', border: '1px solid rgba(0,217,255,0.2)', borderRadius: 14, color: '#00d9ff', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            🔔 Enable Push Notifications
          </button>
        </div>
      )}

      {/* ======================== HOME TAB ======================== */}
      {activeTab === 'home' && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Unread', value: '10', icon: '📧', tap: () => setActiveTab('email') },
              { label: 'Events', value: Object.values(calEvents).flat().length.toString(), icon: '📅', tap: () => setActiveTab('calendar') },
              { label: 'Tasks', value: tasks.filter(t => !t.done).length.toString(), icon: '✓', tap: () => setActiveTab('tasks') },
            ].map((stat, i) => (
              <button key={i} onClick={stat.tap} style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 12px', textAlign: 'center', cursor: 'pointer', color: '#fafafa' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              </button>
            ))}
          </div>

          <h2 style={s.sectionLabel}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {QUICK_COMMANDS.map((qc, i) => (
              <button key={i} onClick={() => runQuickCommand(qc.cmd)} style={{ background: '#0f0f12', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '16px 14px', color: '#fafafa', fontSize: 14, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                <span style={{ fontSize: 22 }}>{qc.icon}</span>
                <span>{qc.label}</span>
              </button>
            ))}
          </div>

          <h2 style={s.sectionLabel}>Coming Up</h2>
          {upcomingEvents.length === 0 && <div style={{ ...s.card, color: '#52525b', fontSize: 14 }}>No upcoming events</div>}
          {upcomingEvents.map((day, i) => (
            <div key={i} style={s.card}>
              <div style={{ fontSize: 12, color: '#00d9ff', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{day.dateLabel}</div>
              {day.events.map((ev, j) => (
                <div key={j} style={{ padding: '6px 0', borderTop: j > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{ fontSize: 15, fontWeight: ev.highlight ? 600 : 400, color: ev.highlight ? '#00d9ff' : '#fafafa' }}>{ev.title}</div>
                  <div style={{ fontSize: 12, color: '#71717a' }}>{ev.time} · {ev.duration}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ======================== CALENDAR TAB — FULL MONTH GRID ======================== */}
      {activeTab === 'calendar' && (
        <div style={{ padding: '0 16px' }}>
          {/* Month nav */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: '#00d9ff', fontSize: 24, cursor: 'pointer', padding: '8px 12px' }}>‹</button>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{MONTH_NAMES[calMonth]} {calYear}</h2>
            <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: '#00d9ff', fontSize: 24, cursor: 'pointer', padding: '8px 12px' }}>›</button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 4 }}>
            {DAY_LABELS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, color: '#52525b', fontWeight: 600, padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 16 }}>
            {calendarCells.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;
              const key = toDateKey(calYear, calMonth, day);
              const isToday = key === todayKey;
              const isSelected = key === selectedDate;
              const hasEvents = calEvents[key]?.length > 0;
              return (
                <button key={key} onClick={() => setSelectedDate(isSelected ? null : key)} style={{
                  background: isSelected ? 'rgba(0,217,255,0.15)' : isToday ? 'rgba(0,217,255,0.06)' : 'transparent',
                  border: isSelected ? '1px solid rgba(0,217,255,0.4)' : isToday ? '1px solid rgba(0,217,255,0.2)' : '1px solid transparent',
                  borderRadius: 10, padding: '8px 2px', cursor: 'pointer', color: isToday ? '#00d9ff' : '#fafafa',
                  fontWeight: isToday ? 700 : 400, fontSize: 14, position: 'relative', minHeight: 44,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                }}>
                  <span>{day}</span>
                  {hasEvents && (
                    <div style={{ display: 'flex', gap: 2 }}>
                      {calEvents[key].slice(0, 3).map((_, j) => (
                        <div key={j} style={{ width: 4, height: 4, borderRadius: '50%', background: '#00d9ff' }} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected date detail */}
          {selectedDate && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: '#00d9ff' }}>
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </h3>
                <button onClick={() => setShowAddEvent(!showAddEvent)} style={{
                  background: 'rgba(0,217,255,0.15)', border: '1px solid rgba(0,217,255,0.3)',
                  borderRadius: 20, padding: '5px 12px', color: '#00d9ff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                }}>+ Add</button>
              </div>

              {showAddEvent && (
                <div style={{ ...s.card, border: '1px solid rgba(0,217,255,0.2)', marginBottom: 10 }}>
                  <input value={newEventTitle} onChange={e => setNewEventTitle(e.target.value)} placeholder="Event name..."
                    onKeyDown={e => e.key === 'Enter' && addCalEvent()}
                    style={{ width: '100%', background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 12px', color: '#fafafa', fontSize: 14, outline: 'none', marginBottom: 8, boxSizing: 'border-box' }} />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <select value={newEventTime} onChange={e => setNewEventTime(e.target.value)}
                      style={{ flex: 1, background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 12px', color: '#fafafa', fontSize: 14, outline: 'none' }}>
                      {['6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM','7:00 PM','8:00 PM','9:00 PM','10:00 PM'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <button onClick={addCalEvent} style={{ background: '#00d9ff', border: 'none', borderRadius: 10, padding: '10px 16px', color: '#09090b', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Add</button>
                  </div>
                </div>
              )}

              {calLoading && <div style={{ ...s.card, color: '#52525b', fontSize: 14 }}>Loading events...</div>}
              {!calLoading && (!calEvents[selectedDate] || calEvents[selectedDate].length === 0) && (
                <div style={{ ...s.card, color: '#52525b', fontSize: 14 }}>No events this day</div>
              )}
              {(calEvents[selectedDate] || []).map(ev => (
                <div key={ev.id} style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 4, height: 36, borderRadius: 2, background: ev.highlight ? '#00d9ff' : '#27272a', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: ev.highlight ? 600 : 400, color: ev.highlight ? '#00d9ff' : '#fafafa' }}>{ev.title}</div>
                    <div style={{ fontSize: 12, color: '#71717a' }}>
                      {ev.time} · {ev.duration}
                      {ev.source === 'google' && <span style={{ marginLeft: 6, color: '#0ea5e9', fontSize: 10, fontWeight: 600 }}>GOOGLE</span>}
                      {ev.location && <span style={{ marginLeft: 6, color: '#52525b' }}>📍 {ev.location}</span>}
                    </div>
                  </div>
                  <button onClick={() => deleteCalEvent(selectedDate, ev.id)} style={{ background: 'none', border: 'none', color: '#52525b', fontSize: 18, cursor: 'pointer', padding: '4px 8px' }}>×</button>
                </div>
              ))}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={() => runQuickCommand('Show me my full Google Calendar for the next 2 weeks and update my Captain Seat calendar')} style={{ ...s.cyanBtn, fontSize: 13 }}>
              Sync Google Cal
            </button>
            <button onClick={() => runQuickCommand('Add a new event to my Google Calendar')} style={{ ...s.cyanBtn, fontSize: 13 }}>
              Add to Google Cal
            </button>
          </div>
        </div>
      )}

      {/* ======================== EMAIL TAB ======================== */}
      {activeTab === 'email' && (
        <div style={{ padding: '0 16px' }}>
          <h2 style={s.sectionLabel}>Unread Inbox</h2>
          {RECENT_EMAILS.map((email, i) => (
            <div key={i} style={s.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: emailTypeColor(email.type) }} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{email.sender}</span>
                </div>
                <span style={{ fontSize: 11, color: '#52525b' }}>{email.time}</span>
              </div>
              <div style={{ fontSize: 13, color: '#d4d4d8', lineHeight: 1.4 }}>{email.subject}</div>
            </div>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
            <button onClick={() => runQuickCommand('Check for any new unread emails since my last check')} style={{ ...s.cyanBtn, fontSize: 13 }}>Refresh Inbox</button>
            <button onClick={() => runQuickCommand('Help me draft a new email')} style={{ ...s.cyanBtn, fontSize: 13 }}>Compose Email</button>
          </div>
        </div>
      )}

      {/* ======================== TASKS TAB ======================== */}
      {activeTab === 'tasks' && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 4px 16px' }}>
            <h2 style={{ ...s.sectionLabel, margin: 0 }}>Priority Tasks</h2>
            <button onClick={() => setShowAddTask(!showAddTask)} style={{ background: 'rgba(0,217,255,0.15)', border: '1px solid rgba(0,217,255,0.3)', borderRadius: 20, padding: '6px 14px', color: '#00d9ff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>+ Add</button>
          </div>
          {showAddTask && (
            <div style={{ ...s.card, border: '1px solid rgba(0,217,255,0.2)', display: 'flex', gap: 8, marginBottom: 12 }}>
              <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} placeholder="New task..." style={{ flex: 1, background: '#18181b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 12px', color: '#fafafa', fontSize: 14, outline: 'none' }} />
              <button onClick={addTask} style={{ background: '#00d9ff', border: 'none', borderRadius: 10, padding: '10px 16px', color: '#09090b', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Add</button>
            </div>
          )}
          {tasks.filter(t => !t.done).map(task => (
            <div key={task.id} style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => toggleTask(task.id)} style={{ width: 24, height: 24, borderRadius: 8, flexShrink: 0, border: `2px solid ${priorityColor(task.priority)}`, background: 'transparent', cursor: 'pointer' }} />
              <div style={{ flex: 1, fontSize: 14, lineHeight: 1.4 }}>{task.text}</div>
              <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', color: '#52525b', fontSize: 18, cursor: 'pointer', padding: '4px 8px' }}>×</button>
            </div>
          ))}
          {tasks.filter(t => t.done).length > 0 && (
            <>
              <h3 style={{ fontSize: 12, color: '#52525b', margin: '20px 4px 10px', textTransform: 'uppercase' }}>Completed ({tasks.filter(t => t.done).length})</h3>
              {tasks.filter(t => t.done).map(task => (
                <div key={task.id} style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 12, opacity: 0.5, border: '1px solid rgba(255,255,255,0.04)' }}>
                  <button onClick={() => toggleTask(task.id)} style={{ width: 24, height: 24, borderRadius: 8, flexShrink: 0, border: '2px solid #10b981', background: 'rgba(16,185,129,0.2)', cursor: 'pointer', color: '#10b981', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</button>
                  <div style={{ flex: 1, fontSize: 14, textDecoration: 'line-through', color: '#71717a' }}>{task.text}</div>
                </div>
              ))}
            </>
          )}
          <button onClick={() => runQuickCommand('Review my task list and suggest what I should prioritize today')} style={{ ...s.cyanBtn, width: '100%', marginTop: 16 }}>Ask Claude to Prioritize</button>
        </div>
      )}

      {/* ======================== COMS TAB — Command Center ======================== */}
      {activeTab === 'coms' && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
          {/* Open Session Link */}
          <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'rgba(0,217,255,0.1)', border: '1px solid rgba(0,217,255,0.25)',
            borderRadius: 14, padding: '14px 16px', marginBottom: 10, textDecoration: 'none',
            color: '#00d9ff', fontSize: 14, fontWeight: 700,
          }}>
            <CaptainWheel size={18} color="#00d9ff" /> Open Claude Code Session
          </a>

          {/* Quick command chips */}
          <div style={{ display: 'flex', gap: 6, overflowX: 'auto', marginBottom: 12, paddingBottom: 4 }}>
            {[
              { label: '📧 Email', cmd: 'Check my latest unread emails and summarize them' },
              { label: '📅 Today', cmd: "What's on my calendar today?" },
              { label: '🚀 Deploy', cmd: 'Deploy the Aviera site to Vercel' },
              { label: '🔔 Notif', cmd: 'Send me a test push notification' },
              { label: '💼 Jobs', cmd: 'Check my latest job alert emails and summarize the best ones' },
              { label: '🔄 Sync Cal', cmd: 'Sync my Google Calendar to the Captain Seat' },
            ].map((qc, i) => (
              <button key={i} onClick={() => {
                navigator.clipboard?.writeText(qc.cmd);
                setHistory(prev => [...prev, { type: 'sent', text: qc.cmd, time: new Date() }, { type: 'response', text: 'Copied!', time: new Date() }]);
              }} style={{
                flexShrink: 0, background: '#0f0f12', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: '8px 14px', color: '#d4d4d8', fontSize: 12,
                fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap',
              }}>
                {qc.label}
              </button>
            ))}
          </div>

          {/* Message history */}
          <div ref={historyRef} style={{ flex: 1, overflowY: 'auto', marginBottom: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.length === 0 && (
              <div style={{ textAlign: 'center', color: '#52525b', fontSize: 14, padding: '30px 20px', lineHeight: 1.6 }}>
                <CaptainWheel size={48} color="#27272a" />
                <div style={{ marginTop: 12 }}>
                  Type a command below or tap a chip above.
                  <br />Commands copy to clipboard — paste in your Claude session.
                  <br /><br />
                  <span style={{ color: '#00d9ff', fontSize: 12 }}>Tap "Open Claude Code Session" to connect.</span>
                </div>
              </div>
            )}
            {history.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.type === 'sent' ? 'flex-end' : 'flex-start', maxWidth: '85%',
                background: msg.type === 'sent' ? 'rgba(0,217,255,0.15)' : '#0f0f12',
                border: `1px solid ${msg.type === 'sent' ? 'rgba(0,217,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 14, padding: '10px 14px', fontSize: 14, lineHeight: 1.5,
                whiteSpace: 'pre-wrap', color: msg.type === 'sent' ? '#00d9ff' : '#d4d4d8',
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ display: 'flex', gap: 8, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <input ref={inputRef} value={command} onChange={e => setCommand(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendCommand()}
              placeholder="Type a command..." style={{
                flex: 1, background: '#0f0f12', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14, padding: '14px 16px', color: '#fafafa', fontSize: 16, outline: 'none',
              }} />
            <button onClick={sendCommand} style={{
              background: '#00d9ff', border: 'none', borderRadius: 14, padding: '14px 20px',
              color: '#09090b', fontWeight: 700, fontSize: 15, cursor: 'pointer', flexShrink: 0,
            }}>Send</button>
          </div>
        </div>
      )}

      {/* ======================== BOTTOM NAV ======================== */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#09090b', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-around', padding: '8px 0 env(safe-area-inset-bottom, 8px)', zIndex: 100 }}>
        {[
          { id: 'home', icon: '⌂', label: 'Bridge' },
          { id: 'calendar', icon: '📅', label: 'Calendar' },
          { id: 'email', icon: '📧', label: 'Email' },
          { id: 'tasks', icon: '✓', label: 'Tasks' },
          { id: 'coms', icon: '⌘', label: 'Coms' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ background: 'none', border: 'none', color: activeTab === tab.id ? '#00d9ff' : '#52525b', fontSize: 11, fontWeight: activeTab === tab.id ? 700 : 400, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '6px 12px', transition: 'color 0.2s' }}>
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
