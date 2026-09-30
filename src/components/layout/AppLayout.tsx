import { NavLink, Outlet } from 'react-router-dom'
import { Activity, ArrowUpRight, BookOpen, GraduationCap, LineChart, Menu, Newspaper, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { formatToday } from '../../lib/format'

const navigation = [
  { to: '/', label: 'Visão geral', icon: Activity, end: true },
  { to: '/noticias', label: 'Notícias e agenda', icon: Newspaper },
  { to: '/academia', label: 'Academia MT5', icon: GraduationCap },
]

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  return <div className="app-shell min-h-screen bg-neutral-50 text-neutral-900">
    {menuOpen && <button className="mobile-scrim" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}
    <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
      <NavLink className="brand" to="/" onClick={() => setMenuOpen(false)}>
        <span className="brand-symbol"><Sparkles size={18} strokeWidth={1.8} /></span>
        <span><b>GOLD SCHOOL</b><small>XAU/USD · ACADEMY</small></span>
      </NavLink>
      <div className="side-label">ESPAÇO DE APRENDIZADO</div>
      <nav className="primary-nav" aria-label="Navegação principal">
        {navigation.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
          <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{to === '/academia' && <span className="nav-meta">11 aulas</span>}
        </NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note"><span className="sidebar-note-icon"><BookOpen size={16}/></span><b>Aprenda antes de operar</b><p>Comece pelos fundamentos e pratique em uma conta demo.</p><NavLink to="/academia" onClick={() => setMenuOpen(false)}>Abrir trilha <ArrowUpRight size={14}/></NavLink></div>
        <div className="sidebar-footer"><span className="avatar">GS</span><span><b>Gold School</b><small>Guia para iniciantes</small></span></div>
      </div>
    </aside>
    <main className="main-area">
      <header className="topbar">
        <button className="menu-toggle" aria-label="Abrir navegação" onClick={() => setMenuOpen(true)}><Menu size={20}/></button>
        <div className="breadcrumb"><span>Mercados</span><span className="breadcrumb-separator">/</span><b>XAU/USD</b></div>
        <div className="topbar-right"><span className="market-status"><i/> Monitoramento informativo</span><span className="avatar top-avatar">GS</span></div>
      </header>
      <div className="page-container"><Outlet/><footer className="site-footer"><span>© {new Date().getFullYear()} Gold School</span><span>Conteúdo educativo para decisões conscientes</span><a href="https://github.com/bininpython/yasmim" target="_blank" rel="noreferrer"><LineChart size={13}/> Projeto open source</a></footer></div>
    </main>
  </div>
}

export function PageIntro({ eyebrow, title, accent, description }: { eyebrow: string; title: string; accent?: string; description: string }) {
  return <header className="page-intro"><div className="eyebrow"><span className="eyebrow-mark"/>{eyebrow}</div><h1>{title}{accent && <> <span>{accent}</span></>}</h1><p>{description}</p></header>
}

export function TodayLabel() { return <div className="today-label"><span>{formatToday()}</span></div> }
