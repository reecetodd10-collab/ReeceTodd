'use client';

import { useState, useEffect, useRef } from 'react';

// --- Captain Wheel SVG Icon (inline for crisp rendering) ---
const CaptainWheel = ({ size = 28, color = '#00d9ff' }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none">
    <circle cx="256" cy="256" r="160" stroke={color} strokeWidth="10" fill="none"/>
    <circle cx="256" cy="256" r="45" stroke={color} strokeWidth="8" fill="none"/>
    <circle cx="256" cy="256" r="16" fill={color}/>
    {/* 8 spokes */}
    <line x1="256" y1="211" x2="256" y2="96" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <line x1="256" y1="301" x2="256" y2="416" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <line x1="211" y1="256" x2="96" y2="256" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <line x1="301" y1="256" x2="416" y2="256" stroke={color} strokeWidth="10" strokeLinecap="round"/>
    <line x1="224" y1="224" x2="143" y2="143" stroke={color} strokeWidth="8" strokeLinecap="round"/>
    <line x1="288" y1="288" x2="369" y2="369" stroke={color} strokeWidth="8" strokeLinecap="round"/>
    <line x1="288" y1="224" x2="369" y2="143" stroke={color} strokeWidth="8" strokeLinecap="round"/>
    <line x1="224" y1="288" x2="143" y2="369" stroke={color} strokeWidth="8" strokeLinecap="round"/>
    {/* Handle pegs */}
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

const CALENDAR_EVENTS = [
  { date: 'Today, May 23', events: [] },
  { date: 'Sat, May 24', events: [{ time: '11:00 AM', title: 'Work', duration: '1h' }] },
  { date: 'Sun, May 25', events: [{ time: '8:30 AM', title: 'Waffles at Aunt Jacquis', duration: '1h' }] },
  { date: 'Thu, May 28', events: [
    { time: '10:15 AM', title: 'Talkiatry', duration: '30m' },
    { time: '11:00 AM', title: 'Psychologist', duration: '1h' },
  ]},
  { date: 'Fri, May 29', events: [{ time: '5:00 PM', title: 'Odd Mob at Petco Park', duration: '6h', highlight: true }] },
  { date: 'Sat, May 30', events: [{ time: '10:00 AM', title: 'Rock & Roll Marathon Pop Up', duration: '1h' }] },
];

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
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/captain-sw.js');
      return reg;
    } catch (err) {
      console.error('SW registration failed:', err);
    }
  }
  return null;
}

async function subscribeToPush(reg) {
  if (!reg) return null;
  try {
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY),
    });
    // Save to backend
    await fetch('/api/command-center/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: sub.toJSON() }),
    });
    return sub;
  } catch (err) {
    console.error('Push subscription failed:', err);
    return null;
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}

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
  const inputRef = useRef(null);
  const historyRef = useRef(null);

  // Register service worker + push on mount
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);

    // PWA + Push setup
    registerServiceWorker().then(reg => {
      if (reg && 'Notification' in window) {
        setNotifStatus(Notification.permission);
      }
    });

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('captain-tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Scroll history to bottom
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  const enableNotifications = async () => {
    if (!('Notification' in window)) return;
    const perm = await Notification.requestPermission();
    setNotifStatus(perm);
    if (perm === 'granted') {
      const reg = await navigator.serviceWorker.ready;
      await subscribeToPush(reg);
    }
  };

  const sendCommand = () => {
    if (!command.trim()) return;
    setHistory(prev => [...prev, { type: 'sent', text: command, time: new Date() }]);
    setHistory(prev => [...prev, {
      type: 'response',
      text: `Copied! Paste into your Claude Code session.`,
      time: new Date()
    }]);
    navigator.clipboard?.writeText(command);
    setCommand('');
  };

  const runQuickCommand = (cmd) => {
    navigator.clipboard?.writeText(cmd);
    setHistory(prev => [...prev, { type: 'sent', text: cmd, time: new Date() }]);
    setHistory(prev => [...prev, {
      type: 'response',
      text: `Copied to clipboard!`,
      time: new Date()
    }]);
    setActiveTab('command');
  };

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(prev => [...prev, { id: Date.now(), text: newTask, done: false, priority: 'medium' }]);
    setNewTask('');
    setShowAddTask(false);
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const greeting = time.getHours() < 12 ? 'Good Morning' : time.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';
  const dateStr = time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const timeStr = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const priorityColor = (p) => p === 'high' ? '#ef4444' : p === 'medium' ? '#f59e0b' : '#10b981';
  const emailTypeColor = (t) => t === 'job' ? '#00d9ff' : t === 'finance' ? '#10b981' : '#71717a';

  const s = {
    page: {
      minHeight: '100vh', background: '#09090b', color: '#fafafa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      paddingBottom: '80px', maxWidth: '100vw', overflowX: 'hidden',
    },
    card: {
      background: '#0f0f12', border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 14, padding: '14px 16px', marginBottom: 8,
    },
    sectionLabel: {
      fontSize: 13, color: '#71717a', textTransform: 'uppercase',
      letterSpacing: '0.1em', margin: '0 0 12px 4px',
    },
    cyanBtn: {
      padding: '14px', background: 'rgba(0,217,255,0.1)',
      border: '1px solid rgba(0,217,255,0.2)', borderRadius: 14,
      color: '#00d9ff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
    },
  };

  return (
    <div style={s.page}>
      {/* --- PWA Meta (injected via Head would be better, but works inline) --- */}
      {typeof window !== 'undefined' && (
        <style>{`
          @media (display-mode: standalone) {
            body { padding-top: env(safe-area-inset-top); }
          }
        `}</style>
      )}

      {/* Status Bar */}
      <div style={{
        padding: '12px 20px 8px', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#10b981', boxShadow: '0 0 8px #10b981',
          }} />
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
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>
            {greeting}, Captain
          </h1>
          <p style={{ fontSize: 13, color: '#71717a', margin: '2px 0 0' }}>{dateStr}</p>
        </div>
      </div>

      {/* Notification Banner */}
      {notifStatus !== 'granted' && (
        <div style={{ padding: '0 16px', marginBottom: 12 }}>
          <button onClick={enableNotifications} style={{
            width: '100%', padding: '12px 16px', background: 'rgba(0,217,255,0.08)',
            border: '1px solid rgba(0,217,255,0.2)', borderRadius: 14,
            color: '#00d9ff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            🔔 Enable Push Notifications
          </button>
        </div>
      )}

      {/* ======================== HOME TAB ======================== */}
      {activeTab === 'home' && (
        <div style={{ padding: '0 16px' }}>
          {/* Stats Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Unread', value: '10', icon: '📧', tap: () => setActiveTab('email') },
              { label: 'Events', value: '6', icon: '📅', tap: () => setActiveTab('calendar') },
              { label: 'Tasks', value: tasks.filter(t => !t.done).length.toString(), icon: '✓', tap: () => setActiveTab('tasks') },
            ].map((stat, i) => (
              <button key={i} onClick={stat.tap} style={{
                background: '#0f0f12', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14, padding: '14px 12px', textAlign: 'center', cursor: 'pointer', color: '#fafafa',
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{stat.icon}</div>
                <div style={{ fontSize: 24, fontWeight: 700 }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
              </button>
            ))}
          </div>

          {/* Quick Actions */}
          <h2 style={s.sectionLabel}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
            {QUICK_COMMANDS.map((qc, i) => (
              <button key={i} onClick={() => runQuickCommand(qc.cmd)} style={{
                background: '#0f0f12', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 14, padding: '16px 14px', color: '#fafafa', fontSize: 14,
                fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center',
                gap: 10, textAlign: 'left', transition: 'transform 0.15s',
              }}>
                <span style={{ fontSize: 22 }}>{qc.icon}</span>
                <span>{qc.label}</span>
              </button>
            ))}
          </div>

          {/* Coming Up */}
          <h2 style={s.sectionLabel}>Coming Up</h2>
          {CALENDAR_EVENTS.filter(d => d.events.length > 0).slice(0, 3).map((day, i) => (
            <div key={i} style={s.card}>
              <div style={{ fontSize: 12, color: '#00d9ff', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {day.date}
              </div>
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

      {/* ======================== CALENDAR TAB ======================== */}
      {activeTab === 'calendar' && (
        <div style={{ padding: '0 16px' }}>
          <h2 style={s.sectionLabel}>This Week</h2>
          {CALENDAR_EVENTS.map((day, i) => (
            <div key={i} style={{ ...s.card, opacity: day.events.length === 0 ? 0.5 : 1 }}>
              <div style={{ fontSize: 13, color: '#00d9ff', fontWeight: 600, marginBottom: day.events.length ? 10 : 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {day.date}
              </div>
              {day.events.length === 0 && <div style={{ fontSize: 13, color: '#52525b', marginTop: 4 }}>No events</div>}
              {day.events.map((ev, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderTop: j > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div style={{ width: 4, height: 36, borderRadius: 2, background: ev.highlight ? '#00d9ff' : '#27272a' }} />
                  <div>
                    <div style={{ fontSize: 16, fontWeight: ev.highlight ? 600 : 400, color: ev.highlight ? '#00d9ff' : '#fafafa' }}>{ev.title}</div>
                    <div style={{ fontSize: 13, color: '#71717a' }}>{ev.time} · {ev.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <button onClick={() => runQuickCommand('Show me my full calendar for the next 2 weeks')} style={{ ...s.cyanBtn, width: '100%', marginTop: 8 }}>
            Load More Events
          </button>
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
            <button onClick={() => runQuickCommand('Check for any new unread emails since my last check')} style={{ ...s.cyanBtn, fontSize: 13 }}>
              Refresh Inbox
            </button>
            <button onClick={() => runQuickCommand('Help me draft a new email')} style={{ ...s.cyanBtn, fontSize: 13 }}>
              Compose Email
            </button>
          </div>
        </div>
      )}

      {/* ======================== TASKS TAB ======================== */}
      {activeTab === 'tasks' && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 4px 16px' }}>
            <h2 style={{ ...s.sectionLabel, margin: 0 }}>Priority Tasks</h2>
            <button onClick={() => setShowAddTask(!showAddTask)} style={{
              background: 'rgba(0,217,255,0.15)', border: '1px solid rgba(0,217,255,0.3)',
              borderRadius: 20, padding: '6px 14px', color: '#00d9ff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}>+ Add</button>
          </div>

          {showAddTask && (
            <div style={{ ...s.card, border: '1px solid rgba(0,217,255,0.2)', display: 'flex', gap: 8, marginBottom: 12 }}>
              <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()}
                placeholder="New task..." style={{
                  flex: 1, background: '#18181b', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, padding: '10px 12px', color: '#fafafa', fontSize: 14, outline: 'none',
                }} />
              <button onClick={addTask} style={{
                background: '#00d9ff', border: 'none', borderRadius: 10, padding: '10px 16px',
                color: '#09090b', fontWeight: 700, fontSize: 14, cursor: 'pointer',
              }}>Add</button>
            </div>
          )}

          {tasks.filter(t => !t.done).map(task => (
            <div key={task.id} style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={() => toggleTask(task.id)} style={{
                width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                border: `2px solid ${priorityColor(task.priority)}`,
                background: 'transparent', cursor: 'pointer',
              }} />
              <div style={{ flex: 1, fontSize: 14, lineHeight: 1.4 }}>{task.text}</div>
              <button onClick={() => deleteTask(task.id)} style={{
                background: 'none', border: 'none', color: '#52525b', fontSize: 18, cursor: 'pointer', padding: '4px 8px',
              }}>×</button>
            </div>
          ))}

          {tasks.filter(t => t.done).length > 0 && (
            <>
              <h3 style={{ fontSize: 12, color: '#52525b', margin: '20px 4px 10px', textTransform: 'uppercase' }}>
                Completed ({tasks.filter(t => t.done).length})
              </h3>
              {tasks.filter(t => t.done).map(task => (
                <div key={task.id} style={{ ...s.card, display: 'flex', alignItems: 'center', gap: 12, opacity: 0.5, border: '1px solid rgba(255,255,255,0.04)' }}>
                  <button onClick={() => toggleTask(task.id)} style={{
                    width: 24, height: 24, borderRadius: 8, flexShrink: 0,
                    border: '2px solid #10b981', background: 'rgba(16,185,129,0.2)',
                    cursor: 'pointer', color: '#10b981', fontSize: 14,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>✓</button>
                  <div style={{ flex: 1, fontSize: 14, textDecoration: 'line-through', color: '#71717a' }}>{task.text}</div>
                </div>
              ))}
            </>
          )}

          <button onClick={() => runQuickCommand('Review my task list and suggest what I should prioritize today')}
            style={{ ...s.cyanBtn, width: '100%', marginTop: 16 }}>
            Ask Claude to Prioritize
          </button>
        </div>
      )}

      {/* ======================== COMMAND TAB ======================== */}
      {activeTab === 'command' && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)' }}>
          <a href="https://claude.ai/code" target="_blank" rel="noopener noreferrer" style={{
            display: 'block', background: 'rgba(0,217,255,0.08)',
            border: '1px solid rgba(0,217,255,0.2)', borderRadius: 14,
            padding: '12px 16px', marginBottom: 12, textDecoration: 'none',
            textAlign: 'center', color: '#00d9ff', fontSize: 13, fontWeight: 600,
          }}>
            Open Claude Code Session ↗
          </a>

          <div ref={historyRef} style={{ flex: 1, overflowY: 'auto', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {history.length === 0 && (
              <div style={{ textAlign: 'center', color: '#52525b', fontSize: 14, padding: '40px 20px', lineHeight: 1.6 }}>
                <CaptainWheel size={48} color="#27272a" />
                <div style={{ marginTop: 16 }}>
                  Type a command or tap a Quick Action.
                  <br />Commands copy to clipboard for your Claude session.
                </div>
              </div>
            )}
            {history.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.type === 'sent' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: msg.type === 'sent' ? 'rgba(0,217,255,0.15)' : '#0f0f12',
                border: `1px solid ${msg.type === 'sent' ? 'rgba(0,217,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: 14, padding: '10px 14px', fontSize: 14,
                lineHeight: 1.5, whiteSpace: 'pre-wrap',
                color: msg.type === 'sent' ? '#00d9ff' : '#d4d4d8',
              }}>
                {msg.text}
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, padding: '8px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <input ref={inputRef} value={command} onChange={e => setCommand(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendCommand()}
              placeholder="Type a command..." style={{
                flex: 1, background: '#0f0f12', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 14, padding: '14px 16px', color: '#fafafa', fontSize: 16, outline: 'none',
              }} />
            <button onClick={sendCommand} style={{
              background: '#00d9ff', border: 'none', borderRadius: 14,
              padding: '14px 20px', color: '#09090b', fontWeight: 700, fontSize: 15,
              cursor: 'pointer', flexShrink: 0,
            }}>Send</button>
          </div>
        </div>
      )}

      {/* ======================== BOTTOM NAV ======================== */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, background: '#09090b',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', justifyContent: 'space-around',
        padding: '8px 0 env(safe-area-inset-bottom, 8px)', zIndex: 100,
      }}>
        {[
          { id: 'home', icon: '⌂', label: 'Bridge' },
          { id: 'calendar', icon: '📅', label: 'Calendar' },
          { id: 'email', icon: '📧', label: 'Email' },
          { id: 'tasks', icon: '✓', label: 'Tasks' },
          { id: 'command', icon: '⌘', label: 'Command' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: 'none', border: 'none',
            color: activeTab === tab.id ? '#00d9ff' : '#52525b',
            fontSize: 11, fontWeight: activeTab === tab.id ? 700 : 400,
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 2, padding: '6px 12px', transition: 'color 0.2s',
          }}>
            <span style={{ fontSize: 22 }}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
