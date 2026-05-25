import { useState, useRef, useEffect, useCallback } from 'react';
import './UserManagementPage.css';

const USERS = [
  {
    id: 1,
    name: '张伟 (Zhang Wei)',
    email: 'wei.zhang@enterprise.com',
    initial: '张',
    tone: 'blue',
    status: 'active',
    lastActive: '2023-11-24 14:20',
  },
  {
    id: 2,
    name: '李娜 (Li Na)',
    email: 'na.li@enterprise.com',
    initial: '李',
    tone: 'orange',
    status: 'pending',
    lastActive: '未登录',
  },
  {
    id: 3,
    name: '王芳 (Wang Fang)',
    email: 'fang.wang@enterprise.com',
    initial: '王',
    tone: 'gray',
    status: 'disabled',
    lastActive: '2023-09-12 09:15',
  },
  {
    id: 4,
    name: '陈思 (Chen Si)',
    email: 'si.chen@enterprise.com',
    initial: '陈',
    tone: 'green',
    status: 'active',
    lastActive: '1小时前',
  },
];

const TOTAL_BY_STATUS = { all: 24, active: 12, pending: 7, disabled: 5 };

const UNAVAILABLE_ROLES = [
  { title: '租户管理员', subtitle: 'Tenant Admin' },
  { title: '企业管理员（越南）', subtitle: 'Company Admin (VN)' },
  { title: '开票员（越南）', subtitle: 'Billing Clerk (VN)' },
  { title: '企业管理员（马来西亚）', subtitle: 'Company Admin (MY)' },
  { title: '开票员（马来西亚）', subtitle: 'Billing Clerk (MY)' },
];

const ASSIGNED_ROLES = [
  { title: '开票员（越南）', subtitle: 'Billing Clerk (VN)', revoke: true },
  { title: '企业管理员（马来西亚）', subtitle: 'Company Admin (MY)', revoke: true },
];

const SCOPE_COMPANIES = [
  { name: '百望越南工业有限公司', nameEn: 'Baiwang Vietnam Industrial Co., Ltd.' },
  { name: '上海分部', nameEn: 'Shanghai Branch' },
  { name: '广州办事处', nameEn: 'Guangzhou Office' },
  { name: '马来西亚服务有限公司', nameEn: 'Baiwang Malaysia Services Sdn. Bhd.' },
];

const ENTERPRISE_OPTIONS = [
  { value: '', label: '无企业归属（租户级用户）' },
  { value: 'vietnam', label: '百望越南工业有限公司' },
  { value: 'shanghai', label: '上海分部' },
  { value: 'guangzhou', label: '广州办事处' },
  { value: 'malaysia', label: '马来西亚服务有限公司' },
];

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M4.5 6.5h15v11h-15Z" />
      <path d="m5.3 7.3 6.7 5 6.7-5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle cx="10.8" cy="10.8" r="6.4" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

export default function UserManagementPage() {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [authorizeModalOpen, setAuthorizeModalOpen] = useState(false);
  const [authorizeUser, setAuthorizeUser] = useState(null);
  const [authTab, setAuthTab] = useState('unassigned');
  const [selectedRole, setSelectedRole] = useState(0);
  const [actionMenuOpen, setActionMenuOpen] = useState(null);
  const [emailChips, setEmailChips] = useState(['alice@company.com']);
  const [emailInput, setEmailInput] = useState('');
  const [selectedEnterprise, setSelectedEnterprise] = useState('');
  const [preassignedRole, setPreassignedRole] = useState('激活后再分配');
  const [scopeChecks, setScopeChecks] = useState([false, false, false, false]);
  const [allEnterprises, setAllEnterprises] = useState(false);

  const inviteModalRef = useRef(null);
  const authorizeModalRef = useRef(null);
  const actionMenuRef = useRef(null);

  const filteredUsers = USERS.filter((u) => {
    const statusMatch = filter === 'all' || u.status === filter;
    if (!statusMatch) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
  });

  const visibleCount = filteredUsers.length;
  const total = TOTAL_BY_STATUS[filter] ?? visibleCount;

  const openInviteModal = useCallback(() => {
    setInviteModalOpen(true);
  }, []);

  const closeInviteModal = useCallback(() => {
    setInviteModalOpen(false);
  }, []);

  const openAuthorizeModal = useCallback((user) => {
    setAuthorizeUser(user);
    setAuthTab('unassigned');
    setSelectedRole(0);
    setScopeChecks([false, false, false, false]);
    setAllEnterprises(false);
    setAuthorizeModalOpen(true);
  }, []);

  const closeAuthorizeModal = useCallback(() => {
    setAuthorizeModalOpen(false);
    setAuthorizeUser(null);
  }, []);

  const handleEmailKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = emailInput.trim().replace(/,$/, '');
      if (val && val.includes('@')) {
        setEmailChips((prev) => [...prev, val]);
        setEmailInput('');
      }
    }
  };

  const removeEmailChip = (idx) => {
    setEmailChips((prev) => prev.filter((_, i) => i !== idx));
  };

  // Close action menu on outside click
  useEffect(() => {
    if (actionMenuOpen == null) return;
    const handler = (e) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(e.target)) {
        setActionMenuOpen(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [actionMenuOpen]);

  // Escape key for modals
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== 'Escape') return;
      if (inviteModalOpen) closeInviteModal();
      if (authorizeModalOpen) closeAuthorizeModal();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [inviteModalOpen, authorizeModalOpen, closeInviteModal, closeAuthorizeModal]);

  // Prevent body scroll when modals open
  useEffect(() => {
    document.body.classList.toggle('modal-open', inviteModalOpen || authorizeModalOpen);
    return () => document.body.classList.remove('modal-open');
  }, [inviteModalOpen, authorizeModalOpen]);

  const statusLabel = { active: '已激活', pending: '待激活', disabled: '已禁用' };

  return (
    <div className="user-content">
      {/* Title Row */}
      <section className="title-row">
        <div className="title-copy">
          <h1>用户管理</h1>
          <p>User management</p>
        </div>
        <button className="invite-button" type="button" onClick={openInviteModal}>
          <span aria-hidden="true">＋</span>
          <span>邀请用户</span>
        </button>
      </section>

      {/* Filter Tabs */}
      <div className="tabs" role="tablist" aria-label="用户状态">
        {[
          ['all', '全部用户'],
          ['active', '已激活'],
          ['pending', '待激活'],
          ['disabled', '已禁用'],
        ].map(([key, label]) => (
          <button
            key={key}
            className={`tab${filter === key ? ' active' : ''}`}
            type="button"
            role="tab"
            aria-selected={filter === key}
            onClick={() => setFilter(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <section className="filters" aria-label="筛选用户">
        <label className="search-box">
          <span className="search-icon" aria-hidden="true">
            <SearchIcon />
          </span>
          <input
            type="search"
            placeholder="搜索姓名或邮箱搜索..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="search-tail" aria-hidden="true">
            <SearchIcon />
          </span>
        </label>
        <div className="filter-actions">
          <button className="query-button" type="button" onClick={() => {}}>查询</button>
          <button className="reset-button" type="button" onClick={() => { setSearchQuery(''); setFilter('all'); }}>重置</button>
        </div>
      </section>

      {/* User Table */}
      <section className="user-card">
        <div className="table header-row">
          <div><span className="check" aria-hidden="true" /></div>
          <div>用户</div>
          <div>状态</div>
          <div>最后活跃</div>
          <div>操作</div>
        </div>

        {filteredUsers.map((user, idx) => {
          const st = user.status;
          return (
            <div className={`table data-row${st === 'pending' || st === 'disabled' ? ' danger-zone' : ''}`} key={user.id}>
              <div><span className="check" aria-hidden="true" /></div>
              <div className="person-cell">
                <span className={`initial ${user.tone}`}>{user.initial}</span>
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                </div>
              </div>
              <div>
                {st === 'disabled' ? (
                  <span className="status disabled">已禁用</span>
                ) : st === 'pending' ? (
                  <span className="status pending"><i />待激活</span>
                ) : (
                  <span className="status active"><i />已激活</span>
                )}
              </div>
              <div className="last-cell">{user.lastActive}</div>
              <div className="action-cell">
                {st === 'active' && (
                  <>
                    <button className="action-primary authorize-trigger" type="button" onClick={() => openAuthorizeModal(user)}>授权</button>
                    <div className="action-more-wrapper" ref={actionMenuOpen === user.id ? actionMenuRef : null}>
                      <button
                        className="action-more-toggle"
                        aria-label="更多操作"
                        onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                      />
                      {actionMenuOpen === user.id && (
                        <div className="action-menu">
                          <button onClick={() => setActionMenuOpen(null)}>编辑</button>
                          <button onClick={() => setActionMenuOpen(null)}>禁用</button>
                          <button className="danger" onClick={() => setActionMenuOpen(null)}>删除</button>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {st === 'pending' && (
                  <>
                    <button className="action-primary" type="button">重发邀请</button>
                    <div className="action-more-wrapper" ref={actionMenuOpen === user.id ? actionMenuRef : null}>
                      <button
                        className="action-more-toggle"
                        aria-label="更多操作"
                        onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                      />
                      {actionMenuOpen === user.id && (
                        <div className="action-menu">
                          <button className="danger" onClick={() => setActionMenuOpen(null)}>删除</button>
                        </div>
                      )}
                    </div>
                  </>
                )}
                {st === 'disabled' && (
                  <>
                    <button className="action-primary" type="button">启用</button>
                    <div className="action-more-wrapper" ref={actionMenuOpen === user.id ? actionMenuRef : null}>
                      <button
                        className="action-more-toggle"
                        aria-label="更多操作"
                        onClick={() => setActionMenuOpen(actionMenuOpen === user.id ? null : user.id)}
                      />
                      {actionMenuOpen === user.id && (
                        <div className="action-menu">
                          <button className="danger" onClick={() => setActionMenuOpen(null)}>删除</button>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Table Footer */}
      <footer className="table-footer">
        <span>{visibleCount ? `显示 1 到 ${visibleCount}，共 ${total} 条数据` : `显示 0 到 0，共 ${total} 条数据`}</span>
        <nav className="pagination" aria-label="分页">
          <button className="page arrow" type="button" aria-label="上一页">‹</button>
          <button className="page current" type="button">1</button>
          <button className="page" type="button">2</button>
          <button className="page" type="button">3</button>
          <span>...</span>
          <button className="page" type="button">6</button>
          <button className="page arrow" type="button" aria-label="下一页">›</button>
        </nav>
      </footer>

      {/* Invite Modal */}
      <div className="modal-overlay" hidden={!inviteModalOpen} onClick={(e) => { if (e.target === e.currentTarget) closeInviteModal(); }}>
        <section className="invite-modal" role="dialog" aria-modal="true" aria-labelledby="inviteModalTitle">
          <header className="invite-modal-head">
            <h2 id="inviteModalTitle">邀请用户</h2>
            <button className="modal-close" type="button" onClick={closeInviteModal} aria-label="关闭邀请用户弹层">×</button>
          </header>

          <div className="invite-modal-body">
            <p className="invite-note">受邀者将收到一封包含激活链接的邮件。该链接将在 7 天后过期。</p>

            <label className="invite-field">
              <span>电子邮箱地址 <em>*</em></span>
              <div className="email-input-shell">
                {emailChips.map((chip, i) => (
                  <span className="email-chip" key={chip}>
                    {chip}
                    <button type="button" aria-label={`移除 ${chip}`} onClick={() => removeEmailChip(i)}>×</button>
                  </span>
                ))}
                <input
                  type="email"
                  placeholder="输入邮箱地址..."
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  onKeyDown={handleEmailKeyDown}
                />
              </div>
              <small>例如：alice@company.com, bob@company.com</small>
            </label>

            <label className="invite-field">
              <span>预分配角色</span>
              <span className="invite-select-shell">
                <select value={preassignedRole} onChange={(e) => setPreassignedRole(e.target.value)}>
                  <option>激活后再分配</option>
                  <option>管理员</option>
                  <option>开票员</option>
                  <option>财务审核</option>
                  <option>销售代表</option>
                </select>
              </span>
              <small>如果设置，用户在激活账号后将立即获得该角色</small>
            </label>

            <label className="invite-field" id="enterpriseFieldTenant">
              <span>所属企业</span>
              <span className="invite-select-shell">
                <select value={selectedEnterprise} onChange={(e) => setSelectedEnterprise(e.target.value)}>
                  {ENTERPRISE_OPTIONS.map((opt) => (
                    opt.value === '' ? (
                      <option key="" value="">无企业归属（租户级用户）</option>
                    ) : null
                  ))}
                  <option disabled>──────────────</option>
                  {ENTERPRISE_OPTIONS.filter(o => o.value !== '').map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </span>
              <small>留空则创建租户级用户，可访问租户下所有企业数据</small>
            </label>

            <label className="invite-field" id="enterpriseFieldAdmin" hidden>
              <span>所属企业</span>
              <span className="invite-enterprise-readonly">百望越南工业有限公司</span>
              <small>企业管理员仅可邀请用户加入当前企业</small>
            </label>
          </div>

          <footer className="invite-modal-footer">
            <button className="modal-cancel" type="button" onClick={closeInviteModal}>取消</button>
            <button className="modal-submit" type="button">
              <span className="mail-icon" aria-hidden="true">
                <MailIcon />
              </span>
              <span>发送邀请</span>
            </button>
          </footer>
        </section>
      </div>

      {/* Authorize Modal */}
      <div className="modal-overlay" hidden={!authorizeModalOpen} onClick={(e) => { if (e.target === e.currentTarget) closeAuthorizeModal(); }}>
        <section className="authorize-modal" role="dialog" aria-modal="true" aria-labelledby="authorizeModalTitle">
          <header className="authorize-head">
            <h2 id="authorizeModalTitle">用户授权 (Authorize Roles)</h2>
            <button className="modal-close" type="button" onClick={closeAuthorizeModal} aria-label="关闭用户授权弹层">×</button>
          </header>

          {authorizeUser && (
            <section className="authorize-user">
              <span className={`auth-avatar ${authorizeUser.tone}`}>{authorizeUser.initial}</span>
              <div>
                <strong>{authorizeUser.name}</strong>
                <span>{authorizeUser.email}</span>
              </div>
            </section>
          )}

          <div className="authorize-tabs" role="tablist" aria-label="授权角色">
            <button
              className={`auth-tab${authTab === 'unassigned' ? ' active' : ''}`}
              type="button" role="tab"
              aria-selected={authTab === 'unassigned'}
              onClick={() => setAuthTab('unassigned')}
            >
              未授权角色
            </button>
            <button
              className={`auth-tab${authTab === 'assigned' ? ' active' : ''}`}
              type="button" role="tab"
              aria-selected={authTab === 'assigned'}
              onClick={() => setAuthTab('assigned')}
            >
              已授权角色
            </button>
          </div>

          <div className="authorize-body">
            <aside className="role-pane">
              {authTab === 'unassigned' ? (
                <div className="role-list">
                  {UNAVAILABLE_ROLES.map((role, i) => (
                    <button
                      key={i}
                      className={`role-item${selectedRole === i ? ' active' : ''}`}
                      type="button"
                      onClick={() => setSelectedRole(i)}
                    >
                      <strong>{role.title}</strong>
                      <span>{role.subtitle}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="role-list assigned-list">
                  {ASSIGNED_ROLES.map((role, i) => (
                    <button
                      key={i}
                      className={`role-item${i === 0 ? ' active' : ''}`}
                      type="button"
                    >
                      <strong>{role.title}</strong>
                      <span>{role.subtitle}</span>
                      <em>取消授权</em>
                    </button>
                  ))}
                </div>
              )}
            </aside>

            <section className="scope-pane">
              <div className="scope-head">
                <div>
                  <h3>选择数据范围 <span>(SELECT DATA SCOPE)</span></h3>
                  <p>请勾选该角色适用的企业或部门</p>
                </div>
                <label className="scope-mode">
                  <span>全部企业</span>
                  <input
                    type="checkbox"
                    checked={allEnterprises}
                    onChange={(e) => {
                      setAllEnterprises(e.target.checked);
                      setScopeChecks(SCOPE_COMPANIES.map(() => e.target.checked));
                    }}
                  />
                </label>
              </div>

              <div className="scope-list">
                {SCOPE_COMPANIES.map((company, i) => (
                  <label className="scope-card" key={i}>
                    <input
                      type="checkbox"
                      checked={scopeChecks[i]}
                      onChange={(e) => {
                        const next = [...scopeChecks];
                        next[i] = e.target.checked;
                        setScopeChecks(next);
                        if (!e.target.checked) setAllEnterprises(false);
                        if (next.every(Boolean)) setAllEnterprises(true);
                      }}
                    />
                    <span>
                      <strong>{company.name}</strong>
                      <em>{company.nameEn}</em>
                    </span>
                  </label>
                ))}
              </div>
            </section>
          </div>

          <footer className="authorize-footer">
            <button className="modal-cancel" type="button" onClick={closeAuthorizeModal}>取消</button>
            <button className="auth-save" type="button" onClick={closeAuthorizeModal}>保存</button>
          </footer>
        </section>
      </div>
    </div>
  );
}
