import { useState, useEffect, useRef } from 'react';
import './ApiDetailPage.css';

const APPS = [
  {
    id: 'app_9f3kd72xmq',
    name: '生产系统对接',
    type: '企业内部应用',
    titleType: 'ISV 类型',
    enabled: true,
    credentials: '3',
    created: '2026-05-20 10:30:15',
    activeTime: '2026-05-20 09:48:22',
    description: '用于租户内部 ERP 系统与 Tax Swift 平台的自动化对接，支持发票自动化开具与合规校验。',
  },
  {
    id: 'app_isv_1455',
    name: 'ISV 对接应用',
    type: '外途服务应用',
    titleType: 'ISV 类型',
    enabled: true,
    credentials: '1',
    created: '2026-05-18 16:20:31',
    activeTime: '2026-05-20 08:12:06',
    description: '面向外部 ISV 服务商开放的标准对接应用，用于授权凭证、数据范围和白名单统一管理。',
  },
  {
    id: 'app_disabled_8820',
    name: '已停用应用',
    type: '外途服务应用',
    titleType: '历史应用',
    enabled: false,
    credentials: '0',
    created: '2026-04-28 14:05:18',
    activeTime: '2026-05-02 17:46:39',
    description: '该应用已停用，保留历史凭证与审计信息，不再允许新的 API 请求访问业务数据。',
  },
];

const CREDENTIALS = [
  { name: '生产环境\n主凭证', key: 'ak_live_782910', secret: '••••••••••••', created: '2023-10-01', expiry: '永久有效', expired: false },
  { name: '测试环境\n凭证', key: 'ak_test_229103', secret: '••••••••••••', created: '2023-11-15', expiry: '2024-11-15', expired: false },
  { name: '备用凭证\n_01', key: 'ak_live_110928', secret: '••••••••••••', created: '2023-08-20', expiry: '已过期', expired: true },
];

const PERMISSIONS = [
  { name: '创建发票', desc: '允许应用发起发票创建请求', authorized: true },
  { name: '提交发票', desc: '将已创建的发票提交至系统审核', authorized: true },
  { name: '撤销发票', desc: '撤销已提交或错误的申请单', authorized: true },
  { name: '查询发票列表', desc: '批量获取企业名下的发票记录', authorized: true },
  { name: '查询发票详情', desc: '查看单张发票的详细属性与状态', authorized: true },
  { name: '交付发票', desc: '执行发票的物理或电子交付动作', authorized: true },
];

const SCOPE_ROWS = [
  { company: 'Vietnam Enterprise A', country: 'VN', source: '当前租户', status: '已生效', taxStatus: '已配置', time: '2023-11-20 10:22' },
  { company: 'Partner Logistics MY', country: 'MY', source: '外部邀请', status: '审核中', taxStatus: '-', time: '2023-11-23 15:45' },
  { company: 'Singapore Retail Group', country: 'SG', source: '当前租户', status: '审核拒绝', taxStatus: '未配置', time: '2023-11-24 09:10' },
];

const INITIAL_WHITELIST = [
  { ip: '192.168.1.1', desc: '办公室出口网关', time: '2023-11-20' },
  { ip: '10.0.0.0/24', desc: '生产内网段', time: '2023-10-15' },
  { ip: '203.0.113.42', desc: '备份服务器 IP', time: '2023-11-22' },
];

const TENANT_COMPANIES = [
  { name: 'Vietnam Logistics Co., Ltd.', country: 'VN', tax: '已配置', checked: true },
  { name: 'Global Trade Singapore Branch', country: 'SG', tax: '已配置', alreadyAdded: true },
  { name: 'Malaysia Digital Services Group', country: 'MY', tax: '未配置', checked: false },
  { name: 'Stratos Tech (Thailand)', country: 'TH', tax: '未配置', checked: false },
];

function scopeTagClass(source) {
  if (source === '当前租户') return 'blue';
  if (source === '外部邀请') return 'purple';
  return 'blue';
}

function scopeStatusClass(status) {
  if (status === '已生效') return 'green';
  if (status === '审核中') return 'blue';
  if (status === '审核拒绝') return 'red';
  return 'blue';
}

function scopeTaxClass(tax) {
  if (tax === '已配置') return 'green';
  if (tax === '未配置') return 'yellow';
  return 'yellow';
}

export default function ApiDetailPage() {
  const [apps, setApps] = useState(APPS);
  const [activeAppId, setActiveAppId] = useState(APPS[0].id);
  const [activeTab, setActiveTab] = useState('basic');
  const [menuOpen, setMenuOpen] = useState(false);
  const [permEditing, setPermEditing] = useState(false);
  const [permChecks, setPermChecks] = useState(PERMISSIONS.map(() => true));
  const [whitelist, setWhitelist] = useState(INITIAL_WHITELIST);
  const [wlFormOpen, setWlFormOpen] = useState(false);
  const [wlForm, setWlForm] = useState({ ip: '', desc: '' });
  const [wlEditIdx, setWlEditIdx] = useState(null);
  const [scopeRows, setScopeRows] = useState(SCOPE_ROWS);
  const [tenantModalOpen, setTenantModalOpen] = useState(false);
  const [tenantChecks, setTenantChecks] = useState(TENANT_COMPANIES.map((c) => c.checked));
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ country: '', company: '', reason: '' });
  const [createAppOpen, setCreateAppOpen] = useState(false);
  const [createAppForm, setCreateAppForm] = useState({ name: '', desc: '', type: '内部集成应用' });
  const menuRef = useRef(null);

  const activeApp = apps.find((a) => a.id === activeAppId) || apps[0];

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const selectApp = (app) => {
    setActiveAppId(app.id);
    setMenuOpen(false);
    setActiveTab('basic');
    setPermEditing(false);
  };

  const toggleAppStatus = () => {
    setApps((prev) => prev.map((a) => (a.id === activeApp.id ? { ...a, enabled: !a.enabled } : a)));
    setMenuOpen(false);
  };

  const deleteApp = () => {
    setApps((prev) => {
      const remaining = prev.filter((a) => a.id !== activeApp.id);
      if (remaining.length === 0) return prev;
      return remaining;
    });
    if (apps.length > 1) {
      const idx = apps.findIndex((a) => a.id === activeApp.id);
      const next = apps[idx + 1] || apps[idx - 1];
      if (next) setActiveAppId(next.id);
    }
    setMenuOpen(false);
  };

  const openWlForm = (idx = null) => {
    if (idx != null) {
      setWlForm({ ip: whitelist[idx].ip, desc: whitelist[idx].desc });
      setWlEditIdx(idx);
    } else {
      setWlForm({ ip: '', desc: '' });
      setWlEditIdx(null);
    }
    setWlFormOpen(true);
  };

  const saveWl = (e) => {
    e.preventDefault();
    const entry = { ip: wlForm.ip.trim() || '0.0.0.0', desc: wlForm.desc.trim() || '未命名访问来源', time: '2026-05-20' };
    if (wlEditIdx != null) {
      setWhitelist((prev) => prev.map((w, i) => (i === wlEditIdx ? entry : w)));
    } else {
      setWhitelist((prev) => [...prev, entry]);
    }
    setWlFormOpen(false);
    setWlEditIdx(null);
  };

  const savePermissions = () => setPermEditing(false);
  const cancelPermissions = () => {
    setPermChecks(PERMISSIONS.map(() => true));
    setPermEditing(false);
  };

  const confirmTenant = () => {
    tenantChecks.forEach((checked, i) => {
      if (checked) {
        const c = TENANT_COMPANIES[i];
        setScopeRows((prev) => [...prev, {
          company: c.name, country: c.country, source: '当前租户', status: '已生效',
          taxStatus: c.tax, time: '2026-05-20 11:30',
        }]);
      }
    });
    setTenantChecks(TENANT_COMPANIES.map(() => false));
    setTenantModalOpen(false);
  };

  const submitInvite = () => {
    const company = inviteForm.company.trim() || 'External Partner Draft';
    const country = inviteForm.country || 'VN';
    setScopeRows((prev) => [...prev, {
      company, country, source: '外部邀请', status: '审核中', taxStatus: '-', time: '2026-05-20 11:30',
    }]);
    setInviteForm({ country: '', company: '', reason: '' });
    setInviteModalOpen(false);
  };

  const submitCreateApp = (e) => {
    e.preventDefault();
    const name = createAppForm.name.trim() || 'ERP 生产对接';
    const type = createAppForm.type;
    const newApp = {
      id: `app_${Date.now().toString(36)}`,
      name,
      type,
      titleType: type === '外途服务应用' ? 'ISV 类型' : '内部应用',
      enabled: true,
      credentials: '0',
      created: '2026-05-20 11:30:00',
      activeTime: '-',
      description: createAppForm.desc.trim() || '新建 API 应用，尚未补充应用用途说明。',
    };
    setApps((prev) => [...prev, newApp]);
    setActiveAppId(newApp.id);
    setCreateAppOpen(false);
    setCreateAppForm({ name: '', desc: '', type: '内部集成应用' });
  };

  return (
    <div className="api-content">
      <nav className="breadcrumb" aria-label="面包屑">
        <a className="current" href="#">API 应用管理</a>
        <span className="crumb-chevron">-›</span>
        <span>{activeApp.name}</span>
      </nav>

      <section className="master-detail">
        <aside className="app-master" aria-label="API 应用列表">
          <div className="master-head">
            <h2>API 应用</h2>
            <button className="add-app" type="button" aria-label="新增 API 应用" onClick={() => setCreateAppOpen(true)}>+</button>
          </div>

          {apps.map((app) => (
            <button
              key={app.id}
              className={`app-list-item${app.id === activeAppId ? ' active' : ''}${!app.enabled ? ' muted' : ''}`}
              type="button"
              onClick={() => selectApp(app)}
            >
              <span className="app-list-title">
                <i className={`state-dot ${app.enabled ? 'enabled' : 'disabled'}`}></i>
                {app.name}
              </span>
              <span className="app-list-meta">{app.enabled ? '已启用' : '已停用'} · {app.credentials} 个凭证</span>
            </button>
          ))}
        </aside>

        <section className="detail-pane">
          <section className="title-row">
            <div className="title-copy">
              <h1>{activeApp.name}</h1>
              <p>创建于 {activeApp.created} <span>·</span> {activeApp.titleType}</p>
            </div>
            <div className="title-actions">
              <div className="more-menu-wrap" ref={menuRef}>
                <button className="more-button" type="button" aria-label="更多操作" aria-expanded={menuOpen}
                  onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}>
                  <span></span><span></span><span></span>
                </button>
                {menuOpen && (
                  <div className="more-menu">
                    <button className="menu-item" type="button" onClick={toggleAppStatus}>
                      {activeApp.enabled ? '禁用' : '启用'}
                    </button>
                    <button className="menu-item danger" type="button" onClick={deleteApp}>删除</button>
                  </div>
                )}
              </div>
            </div>
          </section>

          <nav className="tabs" aria-label="详情页签">
            {['basic', 'credentials', 'permissions', 'scope', 'whitelist'].map((tab) => (
              <button key={tab} className={`tab${activeTab === tab ? ' active' : ''}`} type="button"
                onClick={() => { setActiveTab(tab); setPermEditing(false); }}>
                {tab === 'basic' && '基本信息'}
                {tab === 'credentials' && `API 凭证（3）`}
                {tab === 'permissions' && '权限列表'}
                {tab === 'scope' && '数据范围'}
                {tab === 'whitelist' && 'IP 白名单'}
              </button>
            ))}
          </nav>

          {/* Basic Info */}
          <section className={`info-card tab-panel${activeTab === 'basic' ? ' active' : ''}`}>
            <div className="card-head">
              <h2>基本信息</h2>
              <button className="outline-button card-edit" type="button">
                <span className="button-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>
                </span>
                <span>编辑基本信息</span>
              </button>
            </div>
            <div className="info-grid">
              <div className="info-item">
                <span>应用名称</span>
                <strong>{activeApp.name}</strong>
              </div>
              <div className="info-item">
                <span>应用 ID</span>
                <strong className="copy-value">
                  {activeApp.id}
                  <button className="copy-button" type="button" aria-label="复制应用 ID">
                    <svg viewBox="0 0 24 24"><rect x="9" y="9" width="10" height="10" rx="1.5" /><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" /></svg>
                  </button>
                </strong>
              </div>
              <div className="info-item">
                <span>应用类型</span>
                <strong>{activeApp.type}</strong>
              </div>
              <div className="info-item">
                <span>状态</span>
                <strong className={`state-value${!activeApp.enabled ? ' disabled' : ''}`}>
                  <i></i>{activeApp.enabled ? '已启用' : '已停用'}
                </strong>
              </div>
              <div className="info-item">
                <span>创建时间</span>
                <strong>{activeApp.created}</strong>
              </div>
              <div className="info-item">
                <span>最近活跃时间</span>
                <strong>{activeApp.activeTime}</strong>
              </div>
              <div className="info-item full">
                <span>应用描述</span>
                <strong>{activeApp.description}</strong>
              </div>
            </div>
          </section>

          {/* Credentials */}
          <section className={`info-card tab-panel credential-panel${activeTab === 'credentials' ? ' active' : ''}`}>
            <div className="card-head">
              <h2>API 凭证管理</h2>
              <button className="primary-button" type="button">
                <span className="button-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                </span>
                <span>新增凭证</span>
              </button>
            </div>
            <div className="credential-table" role="table">
              <div className="credential-row credential-head" role="row">
                <div role="columnheader">凭证名称</div>
                <div role="columnheader">凭证ID (App Key)</div>
                <div role="columnheader">凭证密钥 (Secret Key)</div>
                <div role="columnheader">创建时间</div>
                <div role="columnheader">过期时间</div>
                <div role="columnheader">操作</div>
              </div>
              {CREDENTIALS.map((c, i) => (
                <div className={`credential-row${c.expired ? ' expired' : ''}`} role="row" key={i}>
                  <div className="credential-name" role="cell">{c.name.split('\n').map((line, j) => <span key={j}>{line}<br /></span>)}</div>
                  <div className="mono" role="cell">{c.key}</div>
                  <div className="secret-cell" role="cell">
                    <span>{c.secret}</span>
                    <em>可选:</em>
                    <button className="copy-button" type="button" aria-label="复制密钥">
                      <svg viewBox="0 0 24 24"><rect x="9" y="9" width="10" height="10" rx="1.5" /><path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" /></svg>
                    </button>
                  </div>
                  <div role="cell">{c.created}</div>
                  <div role="cell">{c.expiry}</div>
                  <div className="credential-actions" role="cell">
                    <button type="button">{c.expired ? '启用' : '禁用'}</button>
                    <button className="danger" type="button">删除</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="security-tip">
              <span className="tip-icon" aria-hidden="true">i</span>
              <div>
                <strong>凭证安全建议</strong>
                <p>请妥善保管您的 Secret Key，一旦泄露可能导致数据风险。建议定期更换凭证，并为不同的业务场景使用独立的 API Key。</p>
              </div>
            </div>
          </section>

          {/* Permissions */}
          <section className={`info-card tab-panel permission-panel${permEditing ? ' editing' : ''}${activeTab === 'permissions' ? ' active' : ''}`}>
            <div className="card-head permission-head">
              <h2>权限列表管理</h2>
              <div className="permission-view-actions" style={{ display: permEditing ? 'none' : 'flex' }}>
                <button className="primary-button" type="button" onClick={() => setPermEditing(true)}>
                  <span className="button-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" /></svg>
                  </span>
                  <span>编辑</span>
                </button>
              </div>
              <div className="permission-edit-actions" style={{ display: permEditing ? 'flex' : 'none' }}>
                <button className="primary-button" type="button" onClick={savePermissions}>保存更改</button>
                <button className="outline-button" type="button" onClick={cancelPermissions}>取消更改</button>
              </div>
            </div>
            <div className="permission-table" role="table">
              <div className="permission-row permission-table-head" role="row">
                <div className="permission-check" role="columnheader">
                  <input type="checkbox" aria-label="全选权限" disabled />
                </div>
                <div role="columnheader">接口名称</div>
                <div role="columnheader">描述</div>
                <div role="columnheader">状态</div>
              </div>
              {PERMISSIONS.map((p, i) => (
                <div className="permission-row" role="row" key={i}>
                  <div className="permission-check" role="cell">
                    <input type="checkbox" checked={permChecks[i]} disabled={!permEditing}
                      onChange={(e) => {
                        const next = [...permChecks];
                        next[i] = e.target.checked;
                        setPermChecks(next);
                      }} />
                  </div>
                  <div className="permission-name" role="cell">{p.name}</div>
                  <div role="cell">{p.desc}</div>
                  <div role="cell"><span className="auth-pill">{permChecks[i] ? '已授权' : '未授权'}</span></div>
                </div>
              ))}
            </div>
            <p className="permission-edit-note" style={{ display: permEditing ? 'block' : 'none' }}>勾选即代表授权，点击保存后生效</p>
          </section>

          {/* Data Scope */}
          <section className={`info-card tab-panel scope-panel${activeTab === 'scope' ? ' active' : ''}`}>
            <div className="scope-head">
              <div>
                <h2>数据范围管理</h2>
                <p>配置该 API 应用可访问的企业主体范围。您可以添加当前租户下的企业，或邀请外部合作伙伴授权。</p>
              </div>
              <div className="scope-actions">
                {activeApp.type.includes('内部') ? (
                  <button className="primary-button" type="button" onClick={() => setTenantModalOpen(true)}>
                    <span className="button-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                    </span>
                    <span>添加企业</span>
                  </button>
                ) : (
                  <button className="primary-button" type="button" onClick={() => setInviteModalOpen(true)}>
                    <span className="button-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24"><path d="M4 6h16v12H4Z" /><path d="m4 7 8 6 8-6" /></svg>
                    </span>
                    <span>邀请企业</span>
                  </button>
                )}
              </div>
            </div>

            <div className="scope-filter">
              <label>
                <span>企业名称</span>
                <input type="text" placeholder="搜索名称或ID" />
              </label>
              <label>
                <span>国别</span>
                <span className="small-select">
                  <select><option>全部</option><option>VN</option><option>MY</option><option>SG</option></select>
                </span>
              </label>
              <label>
                <span>企业来源</span>
                <span className="small-select">
                  <select><option>全部</option><option>当前租户</option><option>外部邀请</option></select>
                </span>
              </label>
              <label>
                <span>授权状态</span>
                <span className="small-select">
                  <select><option>全部</option><option>已生效</option><option>审核中</option><option>审核拒绝</option></select>
                </span>
              </label>
              <div className="scope-filter-actions">
                <button className="primary-button" type="button">查询</button>
                <button className="outline-button" type="button">重置</button>
              </div>
            </div>

            <div className="scope-table" role="table">
              <div className="scope-row scope-table-head" role="row">
                <div role="columnheader">企业名称</div>
                <div role="columnheader">国别</div>
                <div role="columnheader">企业来源</div>
                <div role="columnheader">授权状态</div>
                <div role="columnheader">税务合规状态</div>
                <div role="columnheader">添加/申请时间</div>
                <div role="columnheader">操作</div>
              </div>
              {scopeRows.map((r, i) => (
                <div className="scope-row" role="row" key={i}>
                  <div className="scope-company" role="cell">{r.company}</div>
                  <div role="cell">{r.country}</div>
                  <div role="cell"><span className={`scope-tag ${scopeTagClass(r.source)}`}>{r.source}</span></div>
                  <div role="cell"><span className={`scope-tag ${scopeStatusClass(r.status)}`}>{r.status}</span></div>
                  <div role="cell">{r.taxStatus !== '-' ? <span className={`scope-tag ${scopeTaxClass(r.taxStatus)}`}>{r.taxStatus}</span> : '-'}</div>
                  <div role="cell">{r.time}</div>
                  <div className="scope-row-actions" role="cell">
                    <button className="danger" type="button" onClick={() => setScopeRows((prev) => prev.filter((_, j) => j !== i))}>删除</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="security-tip scope-tip">
              <span className="tip-icon" aria-hidden="true">i</span>
              <div>
                <strong>使用须知</strong>
                <p>API 仅能访问已通过授权审核且状态为"已生效"的企业数据。若企业税务合规信息未配置，部分敏感接口调用可能会返回 403 错误。MVP 阶段授权暂不设有效期限，所有授权默认为长期有效。</p>
              </div>
            </div>
          </section>

          {/* IP Whitelist */}
          <section className={`info-card tab-panel whitelist-panel${activeTab === 'whitelist' ? ' active' : ''}`}>
            <div className="card-head whitelist-head">
              <h2>IP 白名单管理</h2>
              <button className="primary-button" type="button" onClick={() => openWlForm()} style={{ display: wlFormOpen ? 'none' : '' }}>
                <span className="button-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
                </span>
                <span>添加 IP</span>
              </button>
            </div>

            {wlFormOpen && (
              <form className="whitelist-form" onSubmit={saveWl}>
                <label>
                  <span>IP 地址 / CIDR</span>
                  <input type="text" placeholder="例如：192.168.1.1 或 10.0.0.0/24" value={wlForm.ip}
                    onChange={(e) => setWlForm({ ...wlForm, ip: e.target.value })} />
                </label>
                <label>
                  <span>描述</span>
                  <input type="text" placeholder="请输入描述" value={wlForm.desc}
                    onChange={(e) => setWlForm({ ...wlForm, desc: e.target.value })} />
                </label>
                <div className="whitelist-form-actions">
                  <button className="primary-button" type="submit">保存</button>
                  <button className="outline-button" type="button" onClick={() => { setWlFormOpen(false); setWlEditIdx(null); }}>取消</button>
                </div>
              </form>
            )}

            <div className="whitelist-table" role="table">
              <div className="whitelist-row whitelist-table-head" role="row">
                <div role="columnheader">IP 地址 / CIDR</div>
                <div role="columnheader">描述</div>
                <div role="columnheader">添加时间</div>
                <div role="columnheader">操作</div>
              </div>
              {whitelist.map((w, i) => (
                <div className="whitelist-row" role="row" key={i}>
                  <div className="mono" role="cell">{w.ip}</div>
                  <div role="cell">{w.desc}</div>
                  <div role="cell">{w.time}</div>
                  <div className="whitelist-actions" role="cell">
                    <button type="button" onClick={() => openWlForm(i)}>编辑</button>
                    <button className="danger" type="button" onClick={() => setWhitelist((prev) => prev.filter((_, j) => j !== i))}>删除</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="security-tip whitelist-tip">
              <span className="tip-icon" aria-hidden="true">i</span>
              <div>
                <strong>IP 白名单安全建议</strong>
                <p>开启 IP 白名单后，只有来自列表中的 IP 请求才会被允许。为了提升安全性，建议您为关键业务应用配置严格的 IP 访问限制。</p>
              </div>
            </div>
          </section>
        </section>
      </section>

      {/* Tenant Company Modal */}
      {tenantModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setTenantModalOpen(false); }}>
          <section className="tenant-modal" role="dialog" aria-modal="true" aria-labelledby="tenantModalTitle">
            <div className="tenant-modal-head">
              <div>
                <h2 id="tenantModalTitle">添加当前租户企业</h2>
                <p>从当前租户下已存在的企业中选择需要加入 API 数据范围的企业。添加后立即生效。</p>
              </div>
              <button className="modal-close" type="button" aria-label="关闭" onClick={() => setTenantModalOpen(false)}>×</button>
            </div>
            <div className="tenant-modal-body">
              <div className="tenant-filter">
                <label>
                  <span>企业名称</span>
                  <span className="modal-search">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 4 4" /></svg>
                    <input type="text" placeholder="搜索企业..." />
                  </span>
                </label>
                <label>
                  <span>国别筛选</span>
                  <span className="modal-select">
                    <select><option>全部国家</option><option>VN</option><option>SG</option><option>MY</option><option>TH</option></select>
                  </span>
                </label>
                <label>
                  <span>税务合规状态</span>
                  <span className="modal-select">
                    <select><option>全部状态</option><option>已配置</option><option>未配置</option></select>
                  </span>
                </label>
              </div>
              <div className="tenant-table" role="table">
                <div className="tenant-row tenant-table-head" role="row">
                  <div role="columnheader"><input type="checkbox" aria-label="全选企业" /></div>
                  <div role="columnheader">企业名称</div>
                  <div role="columnheader">国别</div>
                  <div role="columnheader">税务合规状态</div>
                  <div role="columnheader"></div>
                </div>
                {TENANT_COMPANIES.map((c, i) => (
                  <label className={`tenant-row${c.alreadyAdded ? ' already-added' : ''}`} role="row" key={i}>
                    <div role="cell">
                      <input type="checkbox" checked={tenantChecks[i]} disabled={c.alreadyAdded}
                        onChange={(e) => {
                          const next = [...tenantChecks];
                          next[i] = e.target.checked;
                          setTenantChecks(next);
                        }} />
                    </div>
                    <div className="tenant-company-name" role="cell">{c.name}</div>
                    <div role="cell">{c.country}</div>
                    <div role="cell"><span className={`scope-tag ${c.tax === '已配置' ? 'green' : 'yellow'}`}>{c.tax}</span></div>
                    <div role="cell">{c.alreadyAdded ? <span className="already-text">已添加</span> : null}</div>
                  </label>
                ))}
              </div>
              <div className="tenant-modal-footnote">
                <span>已选择 {tenantChecks.filter(Boolean).length} 个企业</span>
                <div className="tenant-pagination">
                  <button type="button">‹</button>
                  <button className="active" type="button">1</button>
                  <button type="button">›</button>
                </div>
              </div>
            </div>
            <div className="tenant-modal-actions">
              <button className="outline-button" type="button" onClick={() => setTenantModalOpen(false)}>取消</button>
              <button className="primary-button" type="button" onClick={confirmTenant}>添加所选企业</button>
            </div>
          </section>
        </div>
      )}

      {/* External Invite Modal */}
      {inviteModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setInviteModalOpen(false); }}>
          <section className="invite-modal" role="dialog" aria-modal="true" aria-labelledby="inviteModalTitle">
            <div className="invite-modal-head">
              <h2 id="inviteModalTitle">邀请外部企业授权</h2>
              <button className="modal-close" type="button" aria-label="关闭" onClick={() => setInviteModalOpen(false)}>×</button>
            </div>
            <div className="invite-modal-body">
              <div className="invite-alert">
                <span className="tip-icon" aria-hidden="true">i</span>
                <p>提交外部企业授权申请后，需要等待运营审核。审核通过前，该企业不会生效到 API 数据范围。</p>
              </div>
              <div className="invite-form">
                <label>
                  <span>受邀企业国别 <em>*</em></span>
                  <span className="modal-select">
                    <select value={inviteForm.country} onChange={(e) => setInviteForm({ ...inviteForm, country: e.target.value })}>
                      <option value="">请选择企业所属国家</option>
                      <option value="VN">越南 / VN</option>
                      <option value="MY">马来西亚 / MY</option>
                      <option value="SG">新加坡 / SG</option>
                      <option value="TH">泰国 / TH</option>
                    </select>
                  </span>
                </label>
                <label>
                  <span>受邀企业名称 <em>*</em></span>
                  <span className="modal-search">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.5" /><path d="m15 15 4 4" /></svg>
                    <input type="text" placeholder="搜索并选择平台内已有企业" value={inviteForm.company}
                      onChange={(e) => setInviteForm({ ...inviteForm, company: e.target.value })} />
                  </span>
                </label>
                <div className="invite-field">
                  <span>授权资料</span>
                  <div className="upload-dropzone">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 15V4" /><path d="m8 8 4-4 4 4" /><path d="M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" /></svg>
                    <strong>点击上传或将文件拖拽至此</strong>
                    <p>支持 PDF, JPG, PNG 格式，单个文件不超过 10MB</p>
                  </div>
                  <div className="upload-file">
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" /><path d="M14 2v6h6" /><path d="M8 13h8M8 17h6" /></svg>
                    <div>
                      <strong>authorization_letter_v2.pdf</strong>
                      <span>1.2 MB</span>
                    </div>
                    <button type="button" aria-label="删除授权资料">
                      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v5M14 11v5" /></svg>
                    </button>
                  </div>
                </div>
                <label>
                  <span>申请说明</span>
                  <textarea placeholder="请输入申请背景或补充信息..." value={inviteForm.reason}
                    onChange={(e) => setInviteForm({ ...inviteForm, reason: e.target.value })}></textarea>
                </label>
              </div>
            </div>
            <div className="invite-modal-actions">
              <p>MVP 阶段外部企业授权不设置有效期。审核通过后授权持续有效，直到管理员主动删除。</p>
              <div>
                <button className="outline-button" type="button" onClick={() => setInviteModalOpen(false)}>取消</button>
                <button className="primary-button" type="button" onClick={submitInvite}>提交审核</button>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Create App Drawer */}
      {createAppOpen && (
        <div className="create-app-drawer-overlay" onClick={(e) => { if (e.target === e.currentTarget) setCreateAppOpen(false); }}>
          <section className="create-app-drawer" role="dialog" aria-modal="true" aria-labelledby="createAppTitle">
            <div className="create-app-head">
              <div>
                <h2 id="createAppTitle">新增应用</h2>
                <p>为当前租户创建一个新的 API 应用，用于集成外部系统。</p>
              </div>
              <button className="modal-close" type="button" aria-label="关闭" onClick={() => setCreateAppOpen(false)}>×</button>
            </div>
            <div className="create-app-body">
              <form className="create-app-form" onSubmit={submitCreateApp}>
                <label>
                  <span>应用名称 <em>*</em></span>
                  <input type="text" placeholder="请输入应用名称，例如：ERP 生产对接" value={createAppForm.name}
                    onChange={(e) => setCreateAppForm({ ...createAppForm, name: e.target.value })} />
                </label>
                <label>
                  <span>应用描述（选填）</span>
                  <textarea placeholder="请输入应用用途说明" value={createAppForm.desc}
                    onChange={(e) => setCreateAppForm({ ...createAppForm, desc: e.target.value })}></textarea>
                </label>
                <fieldset>
                  <legend>应用类型 <em>*</em></legend>
                  <label className={`app-type-option${createAppForm.type === '内部集成应用' ? ' selected' : ''}`}>
                    <input type="radio" name="createAppType" value="内部集成应用" checked={createAppForm.type === '内部集成应用'}
                      onChange={(e) => setCreateAppForm({ ...createAppForm, type: e.target.value })} />
                    <span>
                      <strong>内部集成应用</strong>
                      <small>用于 ERP、触点系统、订单系统、BI 等内部系统对接</small>
                    </span>
                  </label>
                  <label className={`app-type-option${createAppForm.type === '外途服务应用' ? ' selected' : ''}`}>
                    <input type="radio" name="createAppType" value="外途服务应用" checked={createAppForm.type === '外途服务应用'}
                      onChange={(e) => setCreateAppForm({ ...createAppForm, type: e.target.value })} />
                    <span>
                      <strong>外途服务应用</strong>
                      <small>面向 ISV、服务商、集团共享服务中心等场景</small>
                    </span>
                  </label>
                </fieldset>
              </form>
            </div>
            <div className="create-app-actions">
              <button className="outline-button" type="button" onClick={() => setCreateAppOpen(false)}>取消</button>
              <button className="primary-button" type="submit" onClick={submitCreateApp}>确定创建</button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
