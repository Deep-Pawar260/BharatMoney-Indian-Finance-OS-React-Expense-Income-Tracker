import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Activity, ArrowDownLeft, ArrowUpRight, BarChart3, Bell, CalendarDays,
  ChevronRight, CircleDollarSign, CreditCard, Download, IndianRupee,
  LayoutDashboard, LogOut, Menu, PieChart, Plus, ReceiptIndianRupee,
  Search, Settings, ShieldCheck, Sparkles, Target, TrendingDown,
  TrendingUp, Wallet, X, Zap
} from 'lucide-react';
import './App.css';

const initialTransactions = [
  { id: 1, title: 'Salary Credit', category: 'Salary', amount: 65000, type: 'income', date: '2026-09-01', note: 'Monthly salary' },
  { id: 2, title: 'UPI - Groceries', category: 'Food & Grocery', amount: 2850, type: 'expense', date: '2026-09-03', note: 'Monthly groceries' },
  { id: 3, title: 'Rent', category: 'Home', amount: 14500, type: 'expense', date: '2026-09-04', note: 'September rent' },
  { id: 4, title: 'Metro Recharge', category: 'Travel', amount: 1200, type: 'expense', date: '2026-09-06', note: 'Metro card' },
  { id: 5, title: 'Freelance Project', category: 'Freelance', amount: 12000, type: 'income', date: '2026-09-08', note: 'UI project' },
  { id: 6, title: 'Electricity Bill', category: 'Bills', amount: 1980, type: 'expense', date: '2026-09-10', note: 'MSEDCL' },
  { id: 7, title: 'SIP Investment', category: 'Investment', amount: 5000, type: 'expense', date: '2026-09-12', note: 'Index fund SIP' },
  { id: 8, title: 'Cafe & Snacks', category: 'Food & Grocery', amount: 740, type: 'expense', date: '2026-09-14', note: 'Weekend' },
  { id: 9, title: 'Fuel', category: 'Travel', amount: 2400, type: 'expense', date: '2026-09-16', note: 'Petrol' }
];

const categories = ['Food & Grocery', 'Home', 'Travel', 'Bills', 'Investment', 'Shopping', 'Health', 'Entertainment', 'Education', 'Other'];
const navItems = [
  ['Overview', LayoutDashboard], ['Transactions', ReceiptIndianRupee], ['Analytics', BarChart3],
  ['Goals', Target], ['Calendar', CalendarDays], ['Settings', Settings]
];

const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const today = () => new Date().toISOString().slice(0, 10);

function App() {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem('bm_logged') === '1');
  const [profile, setProfile] = useState(() => JSON.parse(localStorage.getItem('bm_profile') || '{"name":"Riya","email":"riya@bharatmoney.app"}'));
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('bm_transactions') || 'null') || initialTransactions);
  const [salary, setSalary] = useState(() => Number(localStorage.getItem('bm_salary') || 65000));
  const [page, setPage] = useState('Overview');
  const [sidebar, setSidebar] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState('');
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => localStorage.setItem('bm_transactions', JSON.stringify(transactions)), [transactions]);
  useEffect(() => localStorage.setItem('bm_salary', String(salary)), [salary]);
  useEffect(() => localStorage.setItem('bm_profile', JSON.stringify(profile)), [profile]);

  const income = useMemo(() => transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0), [transactions]);
  const expense = useMemo(() => transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0), [transactions]);
  const balance = income - expense;
  const savingsRate = income ? Math.max(0, Math.round((balance / income) * 100)) : 0;
  const health = Math.min(100, Math.max(35, 54 + Math.min(22, savingsRate / 2) + (transactions.length > 7 ? 8 : 0)));
  const filtered = transactions.filter(t => `${t.title} ${t.category} ${t.note}`.toLowerCase().includes(search.toLowerCase()));

  const flash = message => { setToast(message); window.setTimeout(() => setToast(''), 2200); };
  const logout = () => { localStorage.removeItem('bm_logged'); setLoggedIn(false); };

  if (!loggedIn) return <Login onLogin={(name, email) => { setProfile({ name, email }); localStorage.setItem('bm_logged', '1'); setLoggedIn(true); }} />;

  return (
    <div className="app-shell">
      <div className={`mobile-overlay ${sidebar ? 'show' : ''}`} onClick={() => setSidebar(false)} />
      <aside className={`sidebar ${sidebar ? 'open' : ''}`}>
        <div className="brand" onClick={() => setPage('Overview')}>
          <div className="brand-logo"><span>B</span><b>M</b></div>
          <div><strong>Bharat<span>Money</span></strong><small>FINANCE OS</small></div>
        </div>
        <div className="workspace"><span className="dot" /> Personal Workspace <ChevronRight size={14} /></div>
        <nav>
          <p className="nav-label">COMMAND CENTER</p>
          {navItems.map(([label, Icon]) => (
            <button key={label} className={page === label ? 'nav-item active' : 'nav-item'} onClick={() => { setPage(label); setSidebar(false); }}>
              <Icon size={18} /><span>{label}</span>{label === 'Analytics' && <em>NEW</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="security"><ShieldCheck size={18} /><div><b>Local & Private</b><small>Your data stays in browser</small></div></div>
          <button className="logout" onClick={logout}><LogOut size={17} /> Sign out</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setSidebar(true)}><Menu size={21} /></button>
          <div className="search"><Search size={17} /><input placeholder="Search transactions, categories..." value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && setSearch(query)} /><kbd>⌘ K</kbd></div>
          <div className="top-actions">
            <button className="icon-btn" onClick={() => flash('You are all caught up!')}><Bell size={18} /><i /></button>
            <button className="profile-chip" onClick={() => setPage('Settings')}><span>{profile.name?.[0] || 'R'}</span><div><b>{profile.name}</b><small>Personal</small></div></button>
          </div>
        </header>

        <section className="content">
          {page === 'Overview' && <Overview income={income} expense={expense} balance={balance} health={health} savingsRate={savingsRate} salary={salary} setSalary={setSalary} transactions={transactions} setPage={setPage} setShowAdd={setShowAdd} flash={flash} />}
          {page === 'Transactions' && <Transactions transactions={filtered} search={search} setSearch={setSearch} onAdd={() => setShowAdd(true)} />}
          {page === 'Analytics' && <Analytics transactions={transactions} income={income} expense={expense} />}
          {page === 'Goals' && <Goals balance={balance} flash={flash} />}
          {page === 'Calendar' && <Calendar transactions={transactions} />}
          {page === 'Settings' && <SettingsPage profile={profile} setProfile={setProfile} salary={salary} setSalary={setSalary} flash={flash} />}
        </section>
      </main>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} onSave={t => { setTransactions(prev => [{ ...t, id: Date.now() }, ...prev]); setShowAdd(false); flash('Transaction added successfully'); }} />}
      {toast && <div className="toast"><Zap size={17} /> {toast}</div>}
    </div>
  );
}

function Login({ onLogin }) {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [pass, setPass] = useState('');
  const submit = e => { e.preventDefault(); onLogin(name.trim() || 'Riya', email.trim() || 'you@bharatmoney.app'); };
  return <div className="login-page">
    <div className="login-orb orb-one" /><div className="login-orb orb-two" />
    <div className="login-copy"><div className="brand-logo big"><span>B</span><b>M</b></div><p className="eyebrow">INDIA'S PERSONAL FINANCE OS</p><h1>Make every<br /><span>rupee count.</span></h1><p className="muted">Track cash flow, salary, UPI spends, investments and goals in one beautifully simple command center.</p><div className="login-stats"><span><b>₹1.2L+</b><small>tracked monthly</small></span><span><b>24/7</b><small>local privacy</small></span><span><b>100%</b><small>frontend app</small></span></div></div>
    <form className="login-card" onSubmit={submit}><div className="mini-brand">Bharat<span>Money</span></div><h2>Welcome back</h2><p>Start with your personal finance workspace.</p><label>Your name<input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" /></label><label>Email address<input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label><label>Password<input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" /></label><button className="primary full" type="submit"><Sparkles size={17} /> Enter Finance OS</button><small className="login-note">Demo login • no server • no account is created</small></form>
  </div>;
}

function Overview({ income, expense, balance, health, savingsRate, salary, setSalary, transactions, setPage, setShowAdd, flash }) {
  const expenseByCat = categories.map(c => ({ c, v: transactions.filter(t => t.type === 'expense' && t.category === c).reduce((a, t) => a + t.amount, 0) })).filter(x => x.v).sort((a,b) => b.v-a.v);
  const max = Math.max(...expenseByCat.map(x => x.v), 1);
  return <>
    <div className="welcome-row"><div><p className="eyebrow">MONDAY • 28 SEPTEMBER 2026</p><h1>Good morning, <span>Riya.</span> <span className="wave">✦</span></h1><p className="muted">Here is your money snapshot for this month.</p></div><button className="primary" onClick={() => setShowAdd(true)}><Plus size={18} /> Add transaction</button></div>
    <div className="hero-grid">
      <div className="balance-card panel"><div className="balance-top"><div><span className="label">AVAILABLE BALANCE</span><h2>{money(balance)}</h2></div><div className="balance-icon"><Wallet size={22} /></div></div><div className="balance-meta"><span><ArrowUpRight size={15} /> {money(income)} income</span><span><ArrowDownLeft size={15} /> {money(expense)} spent</span><span className="trend">↑ {savingsRate}% saved</span></div><div className="mini-bars">{[38,62,48,72,54,82,66,90,75,92,68,84].map((h,i)=><i key={i} style={{height:`${h}%`}} />)}</div></div>
      <div className="health-card panel"><div className="card-title"><div><span className="label">FINANCIAL HEALTH</span><h3>Score <b>{Math.round(health)}</b><small>/100</small></h3></div><Activity size={20} /></div><div className="score-ring" style={{'--score': `${health * 3.6}deg`}}><div><b>{Math.round(health)}</b><small>HEALTH</small></div></div><p><strong>Good momentum.</strong> Your savings pattern is moving in the right direction.</p></div>
    </div>
    <div className="metric-grid">
      <Metric title="Monthly salary" value={money(salary)} sub="Optional income source" icon={IndianRupee} color="orange" action={<button onClick={() => { const n = prompt('Enter monthly salary', salary); if (n !== null && !Number.isNaN(Number(n))) { setSalary(Number(n)); flash('Salary updated'); } }}>Edit</button>} />
      <Metric title="30-day forecast" value={money(Math.max(0, balance - expense * .35))} sub="Estimated end balance" icon={TrendingUp} color="green" action={<span className="pill green">+8.4%</span>} />
      <Metric title="Active goals" value="3 goals" sub="₹2.4L target remaining" icon={Target} color="blue" action={<button onClick={() => setPage('Goals')}>View</button>} />
      <Metric title="Recurring spends" value="₹8,940" sub="5 subscriptions & bills" icon={CreditCard} color="gold" action={<span className="pill orange">Review</span>} />
    </div>
    <div className="section-grid">
      <div className="panel spend-panel"><div className="section-head"><div><span className="label">SPENDING RADAR</span><h3>Where your money goes</h3></div><button className="ghost" onClick={() => setPage('Analytics')}>Full analytics <ChevronRight size={15} /></button></div><div className="radar-list">{expenseByCat.slice(0,6).map((x,i)=><div className="radar-item" key={x.c}><div className="radar-name"><span className={`cat-dot c${i}`} />{x.c}<b>{money(x.v)}</b></div><div className="progress"><i style={{width:`${(x.v/max)*100}%`}} /></div></div>)}</div></div>
      <div className="panel insight-panel"><div className="insight-head"><div className="insight-icon"><Sparkles size={19}/></div><div><span className="label">SMART INSIGHT</span><h3>One move for this week</h3></div></div><p>Your food & grocery spending is your largest flexible category. A <b>10% reduction</b> could free around <strong>{money((expenseByCat.find(x=>x.c==='Food & Grocery')?.v || 0)*.1)}</strong> this month.</p><div className="insight-actions"><button className="primary small" onClick={() => flash('Budget tip saved')}>Save tip</button><button className="ghost" onClick={() => setPage('Analytics')}>Explore</button></div></div>
    </div>
    <div className="panel transactions-panel"><div className="section-head"><div><span className="label">LATEST ACTIVITY</span><h3>Recent transactions</h3></div><button className="ghost" onClick={() => setPage('Transactions')}>See all <ChevronRight size={15}/></button></div><TransactionRows transactions={transactions.slice(0,5)} /></div>
  </>;
}

function Metric({title,value,sub,icon:Icon,color,action}) { return <div className="metric panel"><div className={`metric-icon ${color}`}><Icon size={18}/></div><div className="metric-copy"><span>{title}</span><strong>{value}</strong><small>{sub}</small></div>{action}</div>; }

function TransactionRows({transactions}) { return <div className="rows">{transactions.map(t=><div className="transaction" key={t.id}><div className={`tx-icon ${t.type}`} >{t.type==='income'?<ArrowDownLeft size={17}/>:<ArrowUpRight size={17}/>}</div><div className="tx-main"><b>{t.title}</b><span>{t.category} • {t.date}</span></div><strong className={t.type}>{t.type==='income'?'+':'−'}{money(t.amount)}</strong></div>)}</div>; }

function Transactions({transactions, search, setSearch, onAdd}) { return <div><div className="page-head"><div><p className="eyebrow">MONEY LEDGER</p><h1>Transactions</h1><p className="muted">Every rupee, organized.</p></div><button className="primary" onClick={onAdd}><Plus size={18}/> Add transaction</button></div><div className="panel filter-panel"><div className="search large"><Search size={17}/><input placeholder="Search transactions..." value={search} onChange={e=>setSearch(e.target.value)} /></div><button className="filter-chip">This month ▾</button><button className="filter-chip">All types ▾</button><button className="filter-chip">All categories ▾</button></div><div className="panel transactions-panel"><TransactionRows transactions={transactions}/>{transactions.length===0 && <div className="empty">No transactions match your search.</div>}</div></div>; }

function Analytics({transactions,income,expense}) { const cats=categories.map(c=>({c,v:transactions.filter(t=>t.type==='expense'&&t.category===c).reduce((a,t)=>a+t.amount,0)})).filter(x=>x.v).sort((a,b)=>b.v-a.v); const max=Math.max(...cats.map(x=>x.v),1); return <div><div className="page-head"><div><p className="eyebrow">MONEY INTELLIGENCE</p><h1>Analytics</h1><p className="muted">A clearer view of your financial patterns.</p></div><button className="ghost" onClick={()=>alert('CSV export is simulated in this frontend demo.') }><Download size={17}/> Export CSV</button></div><div className="analytics-cards"><Metric title="Income" value={money(income)} sub="All recorded income" icon={TrendingUp} color="green"/><Metric title="Expenses" value={money(expense)} sub="All recorded spends" icon={TrendingDown} color="orange"/><Metric title="Savings" value={money(income-expense)} sub="Income minus expenses" icon={PieChart} color="blue"/></div><div className="panel chart-panel"><div className="section-head"><div><span className="label">CATEGORY MIX</span><h3>Monthly spending distribution</h3></div></div><div className="bars-chart">{cats.map((x,i)=><div className="bar-col" key={x.c}><div className="bar-value">{money(x.v)}</div><div className={`bar c${i}`} style={{height:`${Math.max(8,(x.v/max)*100)}%`}}/><span>{x.c.replace(' & ',' &\n')}</span></div>)}</div></div></div>; }

function Goals({balance,flash}) { const goals=[['Emergency Fund',75000,150000,'62%','orange'],['Goa Trip 2027',32000,80000,'40%','blue'],['New Laptop',54000,90000,'60%','green']]; return <div><div className="page-head"><div><p className="eyebrow">FUTURE MONEY</p><h1>Goals</h1><p className="muted">Turn plans into visible progress.</p></div><button className="primary" onClick={()=>flash('Goal creation is ready for your next target') }><Plus size={18}/> New goal</button></div><div className="goal-grid">{goals.map(g=><div className="panel goal-card" key={g[0]}><div className={`goal-icon ${g[4]}`}><Target size={19}/></div><div className="goal-title"><b>{g[0]}</b><span>{money(g[1])} saved of {money(g[2])}</span></div><div className="goal-progress"><i style={{width:g[3]}} /></div><div className="goal-foot"><strong>{g[3]}</strong><small>Target remaining {money(g[2]-g[1])}</small></div></div>)}</div><div className="panel runway"><span className="label">SAVINGS RUNWAY</span><h3>Your current balance can cover <b>{Math.max(1,Math.round(balance/15000))} months</b> of a ₹15k baseline.</h3><p>Keep an emergency reserve separate from daily spending to protect your goals.</p></div></div>; }

function Calendar({transactions}) { const days=Array.from({length:30},(_,i)=>i+1); const spendDays=new Set(transactions.filter(t=>t.type==='expense').map(t=>Number(t.date.slice(-2)))); return <div><div className="page-head"><div><p className="eyebrow">FINANCIAL CALENDAR</p><h1>September 2026</h1><p className="muted">Bills, income and spending at a glance.</p></div></div><div className="panel calendar-panel"><div className="weekdays">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d=><b key={d}>{d}</b>)}</div><div className="calendar-grid">{Array.from({length:1}).map((_,i)=><span key={i}/>) }{days.map(d=><div className={`day ${spendDays.has(d)?'has-spend':''}`} key={d}><b>{d}</b>{spendDays.has(d)&&<i/>}</div>)}</div></div></div>; }

function SettingsPage({profile,setProfile,salary,setSalary,flash}) { const save=()=>{localStorage.setItem('bm_profile',JSON.stringify(profile)); flash('Profile settings saved');}; return <div><div className="page-head"><div><p className="eyebrow">PERSONAL CONTROL</p><h1>Settings</h1><p className="muted">Tune your BharatMoney workspace.</p></div></div><div className="settings-grid"><div className="panel form-panel"><h3>Profile</h3><label>Display name<input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})}/></label><label>Email<input value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})}/></label><label>Monthly salary (optional)<input type="number" value={salary} onChange={e=>setSalary(Number(e.target.value))}/></label><button className="primary" onClick={save}>Save changes</button></div><div className="panel privacy-panel"><div className="security large"><ShieldCheck size={24}/><div><b>Privacy first</b><p>This version stores your demo data in browser localStorage. No backend, API or remote database is required.</p></div></div><div className="setting-line"><span>Currency</span><b>₹ INR</b></div><div className="setting-line"><span>Theme</span><b>Indian Color Mix</b></div><div className="setting-line"><span>Data mode</span><b>Local only</b></div></div></div></div>; }

function AddModal({onClose,onSave}) { const [form,setForm]=useState({title:'',amount:'',category:'Food & Grocery',type:'expense',date:today(),note:''}); const change=e=>setForm({...form,[e.target.name]:e.target.value}); return <div className="modal-backdrop"><form className="modal" onSubmit={e=>{e.preventDefault(); if(!form.title||!form.amount)return; onSave({...form,amount:Number(form.amount)})}}><div className="modal-head"><div><span className="label">QUICK ENTRY</span><h2>Add transaction</h2></div><button type="button" className="icon-btn" onClick={onClose}><X size={19}/></button></div><div className="type-toggle"><button type="button" className={form.type==='expense'?'selected expense':''} onClick={()=>setForm({...form,type:'expense'})}>Expense</button><button type="button" className={form.type==='income'?'selected income':''} onClick={()=>setForm({...form,type:'income'})}>Income</button></div><label>Title<input name="title" value={form.title} onChange={change} placeholder="e.g. UPI groceries" autoFocus/></label><div className="two-col"><label>Amount<input name="amount" type="number" min="1" value={form.amount} onChange={change} placeholder="₹ 0"/></label><label>Date<input name="date" type="date" value={form.date} onChange={change}/></label></div><label>Category<select name="category" value={form.category} onChange={change}>{['Salary',...categories].map(c=><option key={c}>{c}</option>)}</select></label><label>Note (optional)<input name="note" value={form.note} onChange={change} placeholder="Add a short note"/></label><button className="primary full" type="submit"><Plus size={17}/> Save transaction</button></form></div>; }

createRoot(document.getElementById('root')).render(<App />);
