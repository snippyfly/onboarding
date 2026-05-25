import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './OpsShell.css';

const NAV_GROUPS = [
  {
    heading: 'OPERATIONS',
    items: [
      { id: 'tenants', label: '租户管理', path: '/ops/tenants' },
      { id: 'enterprises', label: '企业管理', path: '/ops/enterprises' },
      { id: 'isv', label: 'ISV授权管理', path: '/ops/isv' },
    ],
  },
];

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
  tenants: (
    <svg viewBox="0 0 24 24">
      <path d="M5.4 19.5v-10a2 2 0 0 1 2-2h2.5v12M14.1 19.5V5.8a2 2 0 0 1 2-2h.6a2 2 0 0 1 2 2v13.7" />
      <path d="M3.8 19.5h16.4M7.8 10.8h.1M7.8 14h.1M16.5 7.1h.1M16.5 10.4h.1M16.5 13.7h.1" />
    </svg>
  ),
  enterprises: (
    <svg viewBox="0 0 24 24">
      <path d="M5 5.5h14v13H5Z" />
      <path d="M5 10h14M10 5.5v13M14 10v8" />
    </svg>
  ),
  isv: (
    <svg viewBox="0 0 24 24">
      <path d="M5 5.5h14v13H5Z" />
      <path d="M8 9h8M8 13h5M8 16h7" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 24 24">
      <path d="M12 3.7 8.6 5.1 6.1 7.6l-1.4 3.4 1.4 3.4 2.5 2.5 3.4 1.4 3.4-1.4 2.5-2.5 1.4-3.4-1.4-3.4-2.5-2.5Z" />
      <circle cx="12" cy="11" r="2.4" />
    </svg>
  ),
};

export default function OpsShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const menuRef = useRef(null);

  const pageTitles = {};
  NAV_GROUPS.forEach(g => g.items.forEach(i => { pageTitles[i.path] = i.label; }));

  const currentTitle = pageTitles[location.pathname] || '租户管理';

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
    <div className="ops-page">
      {/* ====== Sidebar ====== */}
      <aside className="sidebar" aria-label="运营后台导航">
        {/* Brand */}
        <div className="brand-panel">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M4.8 7.5 12 3.5l7.2 4v8.8L12 20.5l-7.2-4.2Z" />
              <path d="M8 9.4h8M8 12.3h8M8 15.2h5" />
            </svg>
          </div>
          <div className="brand-copy">
            <strong>Tax-Swift</strong>
            <span>运营管理后台</span>
          </div>
        </div>

        {/* Scope switch */}
        <button className="scope-switch" type="button">
          <span className="scope-icon" aria-hidden="true"><GlobeIcon /></span>
          <span>运营全局视角</span>
          <span className="chevron" aria-hidden="true"><ChevronDown /></span>
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
            <span>后台设置</span>
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
                <span>待办</span>
                <span className="badge-dot">9</span>
              </button>
              <button className="top-action" type="button">
                <span className="top-action-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 4.5a4.5 4.5 0 0 1 4.5 4.5v2.2l1.5 3v1.3h-12v-1.3l1.5-3V9A4.5 4.5 0 0 1 12 4.5Z" /><path d="M10 18a2 2 0 0 0 4 0" /></svg>
                </span>
                <span>消息</span>
                <span className="badge-dot">4</span>
              </button>
            </div>
            <div className="user-summary" ref={menuRef} onClick={() => setMenuOpen(!menuOpen)}>
              <div className="user-text">
                <strong>{user?.name || 'Ops Admin'}</strong>
                <span>{user?.title || '运营管理员'}</span>
              </div>
              <div className="avatar-wrap">
                <div className="avatar">{user?.initial || 'O'}</div>
                <span className="chevron" aria-hidden="true"><ChevronDown /></span>
              </div>
              <div className={`user-menu${menuOpen ? ' open' : ''}`}>
                <div className="user-menu-head">
                  <div className="avatar avatar-large">{user?.initial || 'O'}</div>
                  <div className="user-menu-copy">
                    <strong>{user?.name || 'Ops Admin'}</strong>
                    <span>{user?.title || '运营管理员'}</span>
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
