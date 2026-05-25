import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, USERS } from '../context/AuthContext';
import './LoginPage.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleQuickLogin = (role) => {
    login(role);
    navigate(USERS[role].defaultPath, { replace: true });
  };

  return (
    <div className="login-page">
      <header className="topbar">
        <a className="brand" href="#" aria-label="BAIWANG 百望">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 64 64" role="img">
              <defs>
                <linearGradient id="brandGradientA" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#43c8ff" />
                  <stop offset="55%" stopColor="#2458ff" />
                  <stop offset="100%" stopColor="#1f39d5" />
                </linearGradient>
              </defs>
              <path
                d="M17 7.5 32 0l15 7.5v18.1L32 33 17 25.6Zm8.4 6.4v8l6.6 3.4 6.6-3.4v-8L32 10.4Z"
                fill="url(#brandGradientA)"
              />
              <path
                d="M17 38.4 32 31l15 7.4V56L32 64 17 56Z"
                fill="url(#brandGradientA)"
                opacity=".96"
              />
              <path
                d="M8 12.2 17 7.5v18.1L32 33v10.1L8 30.9Zm39 13.4V7.5l9 4.7v18.7L32 43.1V33Z"
                fill="#1a6bff"
                opacity=".22"
              />
            </svg>
          </span>
          <span className="brand-copy">
            <strong>BAIWANG 百望</strong>
            <span>Tax-Swift Compliance Engine</span>
          </span>
        </a>

        <div className="topbar-actions">
          <label className="lang-switch" aria-label="选择界面语言">
            <span className="icon globe-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Z" />
                <path d="M2.8 12h18.4M12 2.8c2.5 2.4 4 5.7 4 9.2s-1.5 6.8-4 9.2c-2.5-2.4-4-5.7-4-9.2s1.5-6.8 4-9.2Z" />
              </svg>
            </span>
            <select name="language" aria-label="界面语言" defaultValue="zh-CN">
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
              <option value="vi-VN">Tiếng Việt</option>
              <option value="ms-MY">Bahasa Melayu</option>
            </select>
            <span className="icon chevron-icon" aria-hidden="true">
              <svg viewBox="0 0 16 16">
                <path d="m4 6 4 4 4-4" />
              </svg>
            </span>
          </label>

          <span className="divider" aria-hidden="true"></span>

          <button className="theme-switch" type="button" aria-label="主题模式">
            <svg viewBox="0 0 28 28" aria-hidden="true">
              <path d="M14 5.25V3m0 22v-2.25M7.81 7.81 6.2 6.2m15.6 15.6-1.61-1.61M5.25 14H3m22 0h-2.25M7.81 20.19 6.2 21.8m15.6-15.6-1.61 1.61M18.5 14A4.5 4.5 0 1 1 14 9.5a4.5 4.5 0 0 1 4.5 4.5Z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="hero-layout">
        <section className="hero-panel" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-badge">
              <span className="hero-badge-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 2.4 5 5.5v5.3c0 4.3 3 8.2 7 9.2 4-1 7-4.9 7-9.2V5.5Z" />
                  <path d="m8.5 11.9 2.1 2.1 4.9-5" />
                </svg>
              </span>
              <span>全球智能税务合规平台</span>
            </div>

            <h1 id="hero-title">
              <span className="wordmark-dark">Tax-</span><span className="wordmark-blue">Swift</span>
            </h1>
            <h2>连接全球 · 合规无界</h2>
            <p>
              覆盖多国家、多税制的电子发票与税务合规解决方案，<br />
              助力企业全球化经营更高效、更可信。
            </p>

            <div className="feature-pills" aria-label="产品能力">
              <div className="feature-pill">
                <span className="pill-icon pill-icon-blue" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 3.5A8.5 8.5 0 1 0 20.5 12 8.5 8.5 0 0 0 12 3.5Z" />
                    <path d="M3.7 12h16.6M12 3.8c2 2.2 3.1 5.1 3.1 8.2S14 18 12 20.2c-2-2.2-3.1-5.1-3.1-8.2S10 6 12 3.8Z" />
                  </svg>
                </span>
                <span>全球覆盖</span>
              </div>
              <div className="feature-pill">
                <span className="pill-icon pill-icon-green" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2.7 5.2 5.8v5.1c0 4.1 2.9 7.8 6.8 8.8 3.9-1 6.8-4.7 6.8-8.8V5.8Z" />
                    <path d="m8.8 11.9 2 2 4.5-4.6" />
                  </svg>
                </span>
                <span>合规可靠</span>
              </div>
              <div className="feature-pill">
                <span className="pill-icon pill-icon-blue" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M10.2 13.8a3.9 3.9 0 0 1 0-5.6l1.5-1.5a3.9 3.9 0 0 1 5.6 5.6l-1.2 1.2" />
                    <path d="M13.8 10.2a3.9 3.9 0 0 1 0 5.6l-1.5 1.5a3.9 3.9 0 0 1-5.6-5.6l1.2-1.2" />
                  </svg>
                </span>
                <span>高效连接</span>
              </div>
              <div className="feature-pill">
                <span className="pill-icon pill-icon-blue" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 18.5h16M6.5 16V9.2M12 16V6.4M17.5 16v-4.8" />
                  </svg>
                </span>
                <span>智能分析</span>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="globe-orbit orbit-a"></div>
            <div className="globe-orbit orbit-b"></div>
            <div className="globe-surface"></div>
            <div className="city-cluster">
              <span className="tower tower-a"></span>
              <span className="tower tower-b"></span>
              <span className="tower tower-c"></span>
              <span className="tower tower-d"></span>
            </div>
            <div className="signal-card signal-top">
              <svg viewBox="0 0 24 24">
                <path d="M4 18.5h16M6.5 16V9.2M12 16V6.4M17.5 16v-4.8" />
              </svg>
            </div>
            <div className="signal-card signal-bottom">
              <svg viewBox="0 0 24 24">
                <path d="M5.2 5.5h13.6A1.7 1.7 0 0 1 20.5 7.2v9.6a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7V7.2a1.7 1.7 0 0 1 1.7-1.7Z" />
                <path d="m6.8 10.3 3.4 3 6-5.1" />
              </svg>
            </div>
            <div className="shield-scene">
              <div className="ring ring-a"></div>
              <div className="ring ring-b"></div>
              <div className="shield-badge">
                <svg viewBox="0 0 72 88">
                  <defs>
                    <linearGradient id="shieldFill" x1="15%" y1="5%" x2="85%" y2="95%">
                      <stop offset="0%" stopColor="#57d2ff" />
                      <stop offset="45%" stopColor="#2668ff" />
                      <stop offset="100%" stopColor="#123cd6" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M36 3 61 12v27.7c0 18-10.8 34-25 45.3C21.8 73.7 11 57.7 11 39.7V12Z"
                    fill="url(#shieldFill)"
                  />
                  <path d="m25 42.4 8.2 8.1L49 34.8" fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="6" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        <section className="login-card" aria-labelledby="login-title">
          <div className="login-card-header">
            <div>
              <h3 id="login-title">欢迎登录 Tax-Swift</h3>
              <p>全球智能税务合规平台</p>
            </div>
            <div className="login-header-visual" aria-hidden="true">
              <span className="header-orbit orbit-left"></span>
              <span className="header-orbit orbit-right"></span>
              <span className="header-particle particle-a"></span>
              <span className="header-particle particle-b"></span>
              <span className="header-particle particle-c"></span>
              <span className="header-glow"></span>
              <span className="header-shield">
                <svg viewBox="0 0 72 88">
                  <defs>
                    <linearGradient id="headerShieldGradient" x1="18%" y1="8%" x2="82%" y2="92%">
                      <stop offset="0%" stopColor="#62d3ff" />
                      <stop offset="46%" stopColor="#2f73ff" />
                      <stop offset="100%" stopColor="#173fd7" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M36 3 61 12v27.7c0 18-10.8 34-25 45.3C21.8 73.7 11 57.7 11 39.7V12Z"
                    fill="url(#headerShieldGradient)"
                    stroke="rgba(255,255,255,.28)"
                    strokeWidth="1"
                  />
                  <path
                    d="m25 42.4 8.2 8.1L49 34.8"
                    fill="none"
                    stroke="#fff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="6"
                  />
                </svg>
              </span>
            </div>
          </div>

          <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleQuickLogin('customer'); }}>
            <label className="field">
              <span className="field-label">邮箱账号</span>
              <span className="input-shell">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M4.5 6.8h15a1.5 1.5 0 0 1 1.5 1.5v7.4a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 15.7V8.3a1.5 1.5 0 0 1 1.5-1.5Z" />
                    <path d="m5.7 8 6.3 5.2L18.3 8" />
                  </svg>
                </span>
                <input type="email" placeholder="请输入工作邮箱" />
              </span>
            </label>

            <label className="field">
              <span className="field-label">密码</span>
              <span className="input-shell">
                <span className="input-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M7.5 10.5V8.7a4.5 4.5 0 1 1 9 0v1.8" />
                    <rect x="5" y="10.5" width="14" height="10.5" rx="1.8" />
                    <path d="M12 14.2v3.1" />
                  </svg>
                </span>
                <input type={showPassword ? 'text' : 'password'} placeholder="请输入密码" />
                <button className="eye-button" type="button" aria-label="显示密码" onClick={() => setShowPassword(!showPassword)}>
                  <svg viewBox="0 0 24 24">
                    <path d="M2.8 12s3.4-5.5 9.2-5.5 9.2 5.5 9.2 5.5-3.4 5.5-9.2 5.5S2.8 12 2.8 12Z" />
                    <circle cx="12" cy="12" r="2.8" />
                  </svg>
                </button>
              </span>
            </label>

            <div className="form-meta">
              <label className="remember-me">
                <input type="checkbox" defaultChecked />
                <span>记住我</span>
              </label>
              <a href="#">忘记密码?</a>
            </div>

            <button className="submit-button" type="submit">登录</button>

            <div className="login-divider-text">快速登录</div>

            <div className="quick-login-group">
              <button className="quick-login-btn customer" type="button" onClick={() => handleQuickLogin('customer')}>
                <span className="quick-login-icon">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2" /><path d="M5.5 18c1.4-2.8 3.9-4.2 6.5-4.2s5.1 1.4 6.5 4.2" /></svg>
                </span>
                <span>企业用户登录</span>
              </button>
              <button className="quick-login-btn admin" type="button" onClick={() => handleQuickLogin('admin')}>
                <span className="quick-login-icon">
                  <svg viewBox="0 0 24 24"><path d="M12 3.7 8.6 5.1 6.1 7.6l-1.4 3.4 1.4 3.4 2.5 2.5 3.4 1.4 3.4-1.4 2.5-2.5 1.4-3.4-1.4-3.4-2.5-2.5Z" /><circle cx="12" cy="11" r="2.4" /></svg>
                </span>
                <span>运营管理员登录</span>
              </button>
            </div>
          </form>

          <div className="security-note">
            <span className="security-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M7.5 10.5V8.7a4.5 4.5 0 1 1 9 0v1.8" />
                <rect x="5" y="10.5" width="14" height="10.5" rx="1.8" />
                <path d="M12 14.2v3.1" />
              </svg>
            </span>
            <span>安全登录 · SSL 加密保护 · 保障您的数据安全</span>
          </div>
        </section>
      </main>

      <footer className="page-footer">
        <div className="footer-cta">
          <span>还没有账号？</span>
          <a href="#">申请开通企业服务</a>
        </div>
        <nav className="footer-links" aria-label="底部链接">
          <a href="#">帮助中心</a>
          <span className="footer-divider" aria-hidden="true">|</span>
          <a href="#">隐私政策</a>
          <span className="footer-divider" aria-hidden="true">|</span>
          <a href="#">服务条款</a>
          <span className="footer-divider" aria-hidden="true">|</span>
          <a href="#">安全声明</a>
        </nav>
      </footer>
    </div>
  );
}
