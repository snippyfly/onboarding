import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './CustomerShell.css';

const NAV_GROUPS = [
  {
    heading: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: '全球合规看板', path: '/dashboard' },
    ],
  },
  {
    heading: 'DATA CENTER',
    items: [
      { id: 'enterprise', label: '企业管理', path: '/enterprise' },
    ],
  },
  {
    heading: 'OPEN PLATFORM',
    items: [
      { id: 'api', label: 'API 应用管理', path: '/api' },
    ],
  },
  {
    heading: 'SECURITY & ACCESS',
    items: [
      { id: 'users', label: '用户管理', path: '/users' },
      { id: 'audit', label: '审计日志', path: '/dashboard' },
    ],
  },
];

// Inline SVG icon components
function GlobeIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.6" />
      <path d="M3.7 12h16.6M12 3.8c2.2 2.2 3.5 5.1 3.5 8.2s-1.3 6-3.5 8.2c-2.2-2.2-3.5-5.1-3.5-8.2s1.3-6 3.5-8.2Z" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg viewBox="0 0 16 16"><path d="m4 6 4 4 4-4" /></svg>
  );
}

const NAV_ICONS = {
  dashboard: (
    <svg viewBox="0 0 24 24"><path d="M4.5 4.5h6v6h-6Zm9 0h6v6h-6Zm-9 9h6v6h-6Zm9 0h6v6h-6Z" /></svg>
  ),
  enterprise: (
    <svg viewBox="0 0 24 24"><path d="M5 5.5h14v13H5Z" /><path d="M5 10h14M10 5.5v13M14 10v8" /></svg>
  ),
  api: (
    <svg viewBox="0 0 24 24"><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" /><path d="M4.5 18.5c1.5-2.9 4.2-4.5 7.5-4.5s6 1.6 7.5 4.5" /><path d="M18.8 7.4h1.7m-1.7 3.3h1.7m-3.4-1.7h5.1" /></svg>
  ),
  users: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2" /><path d="M5.5 18c1.4-2.8 3.9-4.2 6.5-4.2s5.1 1.4 6.5 4.2" /></svg>
  ),
  audit: (
    <svg viewBox="0 0 24 24"><path d="M7.5 10V8.7a4.5 4.5 0 1 1 9 0V10" /><rect x="5" y="10" width="14" height="10.5" rx="2" /><path d="M12 14v2.8" /></svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24"><path d="M12 3.8 8.4 5.2 5.8 7.8 4.4 11.4l1.4 3.6 2.6 2.6 3.6 1.4 3.6-1.4 2.6-2.6 1.4-3.6-1.4-3.6-2.6-2.6Z" /></svg>
  ),
  help: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8" /><path d="M9.3 9.5a2.8 2.8 0 1 1 5.1 1.6c-.8 1-1.6 1.4-1.6 2.7M12 16.9h0" /></svg>
  ),
};

export default function CustomerShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const menuRef = useRef(null);

  // Page title mapping
  const pageTitles = {};
  NAV_GROUPS.forEach(g => g.items.forEach(i => { pageTitles[i.path] = i.label; }));

  const currentTitle = pageTitles[location.pathname] || '全球合规看板';

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape' && passwordOpen) setPasswordOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [passwordOpen]);

  return (
    <div className="platform-page">
      {/* ====== Sidebar ====== */}
      <aside className="sidebar" aria-label="主导航">
        {/* Brand */}
        <div className="brand-panel">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 56 56">
              <defs>
                <linearGradient id="brandBg" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2d85ff" />
                  <stop offset="100%" stopColor="#1352e8" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="56" height="56" rx="14" fill="url(#brandBg)" />
              <path d="M14 20h28M18 20v16M38 20v16M12 36h32M21 17l7-6 7 6" />
            </svg>
          </div>
          <div className="brand-copy">
            <strong>Tax-Swift</strong>
            <span>全球智能税务合规平台</span>
          </div>
        </div>

        {/* Scope switch */}
        <button className="scope-switch" type="button">
          <span className="scope-icon" aria-hidden="true"><GlobeIcon /></span>
          <span>全球视角</span>
          <span className="scope-chevron" aria-hidden="true"><ChevronDown /></span>
        </button>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {NAV_GROUPS.map(group => (
            <section className="nav-group" key={group.heading}>
              <h2>{group.heading}</h2>
              {group.items.map(item => (
                <button
                  key={item.id}
                  className={`nav-item${location.pathname === item.path ? ' active' : ''}`}
                  type="button"
                  onClick={() => navigate(item.path)}
                >
                  <span className="nav-icon" aria-hidden="true">
                    {NAV_ICONS[item.id]}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </section>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="sidebar-footer">
          <button className="nav-item" type="button">
            <span className="nav-icon" aria-hidden="true">{NAV_ICONS.settings}</span>
            <span>设置</span>
          </button>
          <button className="nav-item" type="button">
            <span className="nav-icon" aria-hidden="true">{NAV_ICONS.help}</span>
            <span>帮助与支持</span>
          </button>
        </div>
      </aside>

      {/* ====== Main Shell ====== */}
      <div className="main-shell">
        {/* Topbar */}
        <header className="topbar">
          <div className="breadcrumb">
            <span>运营平台</span>
            <span>/</span>
            <strong>{currentTitle}</strong>
          </div>
          <div className="topbar-right">
            <div className="topbar-actions">
              <button className="top-action" type="button">
                <span className="top-action-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M5 5.5h14v13H5Z" /><path d="M8 3.8V7M16 3.8V7M8.2 11h7.6" /></svg>
                </span>
                <span>任务中心</span>
                <span className="badge-dot">6</span>
              </button>
              <button className="top-action" type="button">
                <span className="top-action-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 4.5a4.5 4.5 0 0 1 4.5 4.5v2.2l1.5 3v1.3h-12v-1.3l1.5-3V9A4.5 4.5 0 0 1 12 4.5Z" /><path d="M10 18a2 2 0 0 0 4 0" /></svg>
                </span>
                <span>消息中心</span>
                <span className="badge-dot">3</span>
              </button>
            </div>
            <div className="user-summary" ref={menuRef} onClick={() => setMenuOpen(!menuOpen)}>
              <div className="user-text">
                <strong>{user?.name || 'Admin User'}</strong>
                <span>{user?.title || 'Global Controller'}</span>
              </div>
              <div className="avatar-wrap">
                <div className="avatar">{user?.initial || 'A'}</div>
                <span className="scope-chevron" aria-hidden="true"><ChevronDown /></span>
              </div>
              <div className={`user-menu${menuOpen ? ' open' : ''}`}>
                <div className="user-menu-head">
                  <div className="avatar avatar-large">{user?.initial || 'A'}</div>
                  <div className="user-menu-copy">
                    <strong>{user?.name || 'Admin User'}</strong>
                    <span>{user?.title || 'Global Controller'}</span>
                  </div>
                </div>
                <button className="user-menu-item" type="button" onClick={(e) => { e.stopPropagation(); setMenuOpen(false); setPasswordOpen(true); }}>
                  <span className="menu-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M7.5 10V8.7a4.5 4.5 0 1 1 9 0V10" /><rect x="5" y="10" width="14" height="10.5" rx="2" /></svg>
                  </span>
                  <span>修改密码</span>
                </button>
                <button className="user-menu-item logout" type="button" onClick={(e) => { e.stopPropagation(); logout(); }}>
                  <span className="menu-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M10 5H6v14h4" /><path d="M13 8.2 18 12l-5 3.8M18 12H9" /></svg>
                  </span>
                  <span>退出登录</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <div className="content-area">
          <Outlet />
        </div>
      </div>

      {/* ====== Password Modal ====== */}
      <div className={`password-modal-overlay${passwordOpen ? ' open' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) setPasswordOpen(false); }}>
        <section className="password-modal" role="dialog" aria-modal="true">
          <header className="password-modal-head">
            <h2>修改密码</h2>
            <button className="password-close" type="button" onClick={() => setPasswordOpen(false)}>&times;</button>
          </header>
          <div className="password-modal-body">
            <p className="password-note">为了保障账号安全，修改密码后需要重新登录。</p>
            <PasswordField label="当前密码" />
            <PasswordField label="新密码" />
            <PasswordField label="确认新密码" />
            <section className="password-rules">
              <h3>密码要求</h3>
              <ul>
                <li>至少 8 个字符</li>
                <li>包含大小写字母</li>
                <li>包含数字或特殊字符</li>
                <li>不能与当前密码相同</li>
              </ul>
            </section>
          </div>
          <footer className="password-modal-footer">
            <button className="password-cancel" type="button" onClick={() => setPasswordOpen(false)}>取消</button>
            <button className="password-submit" type="button">确认修改</button>
          </footer>
        </section>
      </div>
    </div>
  );
}

function PasswordField({ label }) {
  const [show, setShow] = useState(false);
  return (
    <label className="password-field">
      <span>{label} <em>*</em></span>
      <span className="password-input-shell">
        <input type={show ? 'text' : 'password'} placeholder={`请输入${label}`} />
        <button type="button" className="password-eye" onClick={() => setShow(!show)}>
          <svg viewBox="0 0 24 24">
            <path d="M3.5 12s3-5.5 8.5-5.5S20.5 12 20.5 12s-3 5.5-8.5 5.5S3.5 12 3.5 12Z" />
            <circle cx="12" cy="12" r="2.4" />
          </svg>
        </button>
      </span>
    </label>
  );
}
