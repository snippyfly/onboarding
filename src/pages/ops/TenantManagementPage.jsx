import { useState } from 'react';
import './TenantManagementPage.css';

const TENANTS = [
  { id: 'TX-100293', name: 'Alpha Services', email: 'admin@alpha.vn', company: 'Alpha Tech Group', type: 'customer', typeLabel: '客户上户', status: 'enabled', country: '越南 VN', companyEmail: 'admin@alpha.vn', companyCode: 'ENT-VN-10001' },
  { id: 'TX-100294', name: 'Beta Logistics', email: 'contact@beta.my', company: 'Beta MY Corp', type: 'partner', typeLabel: 'ISV上户', status: 'disabled', country: '马来西亚 MY', companyEmail: 'contact@beta.my', companyCode: 'ENT-MY-10002' },
  { id: 'TX-100295', name: 'Gamma Consulting', email: 'ops@gamma.sg', company: 'Gamma Global Holdings', type: 'customer', typeLabel: '客户上户', status: 'enabled', country: '新加坡 SG', companyEmail: 'ops@gamma.sg', companyCode: 'ENT-SG-10003' },
];

const COUNTRIES = ['越南 VN', '马来西亚 MY', '新加坡 SG'];

const emptyEditData = {
  name: '',
  adminEmail: '',
  tenantType: 'customer',
  country: '越南 VN',
  company: '',
  companyEmail: '',
};

export default function TenantManagementPage() {
  /* ---- filter state ---- */
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [typeFilter, setTypeFilter] = useState('全部');

  /* ---- add-modal state ---- */
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addType, setAddType] = useState('customer');
  const [autoCreateApi, setAutoCreateApi] = useState(true);
  const [autoSendInvite, setAutoSendInvite] = useState(false);
  const [addCountry, setAddCountry] = useState('越南 VN');
  const [addCompanyCode, setAddCompanyCode] = useState('');
  const [addCompany, setAddCompany] = useState('');
  const [addCompanyEmail, setAddCompanyEmail] = useState('');

  /* ---- edit-modal state ---- */
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTenantData, setEditTenantData] = useState(emptyEditData);
  const [editCountry, setEditCountry] = useState('越南 VN');
  const [editCompany, setEditCompany] = useState('');
  const [editCompanyEmail, setEditCompanyEmail] = useState('');

  /* ---- derived data ---- */
  const filteredTenants = TENANTS.filter((t) => {
    const matchesSearch = searchQuery
      ? t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    const matchesStatus =
      statusFilter === '全部' ||
      (statusFilter === '启用' && t.status === 'enabled') ||
      (statusFilter === '禁用' && t.status === 'disabled');
    const matchesType =
      typeFilter === '全部' ||
      (typeFilter === '客户上户' && t.type === 'customer') ||
      (typeFilter === 'ISV上户' && t.type === 'partner');
    return matchesSearch && matchesStatus && matchesType;
  });

  /* ---- handlers ---- */
  function openAddModal() {
    setAddName('');
    setAddEmail('');
    setAddType('customer');
    setAutoCreateApi(true);
    setAutoSendInvite(false);
    setAddCountry('越南 VN');
    setAddCompanyCode('');
    setAddCompany('');
    setAddCompanyEmail('');
    setAddModalOpen(true);
  }

  function closeAddModal() {
    setAddModalOpen(false);
  }

  function openEditModal(tenant) {
    setEditTenantData(tenant);
    setEditCountry(tenant.country);
    setEditCompany(tenant.company);
    setEditCompanyEmail(tenant.companyEmail);
    setEditModalOpen(true);
  }

  function closeEditModal() {
    setEditModalOpen(false);
  }

  function handleReset() {
    setSearchQuery('');
    setStatusFilter('全部');
    setTypeFilter('全部');
  }

  /* ---- helper: pretty status ---- */
  function statusLabel(status) {
    return status === 'enabled' ? '启用' : '禁用';
  }

  function statusClass(status) {
    return status === 'enabled' ? 'success' : 'neutral';
  }

  function typeClass(type) {
    return type === 'customer' ? 'customer' : 'partner';
  }

  /* ---- action button text ---- */
  function toggleLabel(status) {
    return status === 'enabled' ? '禁用' : '启用';
  }

  function toggleClass(status) {
    return status === 'enabled' ? 'muted' : '';
  }

  /* ============================================================
     Render
     ============================================================ */
  return (
    <div className="tenant-content">
      {/* ---- Hero row ---- */}
      <section className="hero-row">
        <div className="page-title">
          <h1>租户管理</h1>
        </div>
        <div className="hero-actions">
          <button className="button primary add-button" type="button" onClick={openAddModal}>
            <span className="button-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
            </span>
            <span>新增租户</span>
          </button>
        </div>
      </section>

      {/* ---- Filter toolbar ---- */}
      <section className="panel toolbar" aria-label="租户筛选">
        <div className="tenant-filter-grid">
          <label className="field">
            <span>租户名称</span>
            <span className="input-shell">
              <span className="field-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <circle cx="10.7" cy="10.7" r="5.9" />
                  <path d="m15.2 15.2 4.4 4.4" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="输入租户关键字..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </span>
          </label>

          <label className="field status-field">
            <span>状态</span>
            <span className="select-shell">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option>全部</option>
                <option>启用</option>
                <option>禁用</option>
              </select>
            </span>
          </label>

          <label className="field type-field">
            <span>上户类型</span>
            <span className="select-shell">
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option>全部</option>
                <option>客户上户</option>
                <option>ISV上户</option>
              </select>
            </span>
          </label>

          <div className="filter-actions">
            <button className="button ghost" type="button" onClick={handleReset}>重置</button>
            <button className="button primary" type="button">查询</button>
          </div>
        </div>
      </section>

      {/* ---- Tenant list table ---- */}
      <section className="panel table-panel" aria-label="租户列表">
        <div className="table-scroll">
          <div className="tenant-table table-head">
            <div>租户名称</div>
            <div>租户联系人邮箱</div>
            <div>关联企业名称</div>
            <div>上户类型</div>
            <div>状态</div>
            <div>操作</div>
          </div>

          {filteredTenants.map((t) => (
            <div className="tenant-table table-row" key={t.id}>
              <div className="tenant-cell" data-label="租户名称">
                <button className="tenant-name" type="button">{t.name}</button>
                <span>ID: {t.id}</span>
              </div>
              <div className="email-cell" data-label="租户联系人邮箱">{t.email}</div>
              <div className="company-cell" data-label="关联企业名称">{t.company}</div>
              <div data-label="上户类型">
                <span className={`type-pill ${typeClass(t.type)}`}>{t.typeLabel}</span>
              </div>
              <div data-label="状态">
                <span className={`status-pill ${statusClass(t.status)}`}>{statusLabel(t.status)}</span>
              </div>
              <div className="action-cell" data-label="操作">
                <button className="action-link" type="button" onClick={() => openEditModal(t)}>编辑</button>
                <span className="action-divider" aria-hidden="true" />
                <button className="action-link" type="button">重发邀请</button>
                <span className="action-divider" aria-hidden="true" />
                <button className={`action-link ${toggleClass(t.status)}`} type="button">
                  {toggleLabel(t.status)}
                </button>
              </div>
            </div>
          ))}
        </div>

        <footer className="table-footer">
          <span>显示 1 到 {filteredTenants.length} 条，共 {TENANTS.length} 条记录</span>
          <nav className="pagination" aria-label="分页">
            <button className="page-button icon-only" type="button" aria-label="上一页">
              <svg viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button className="page-button active" type="button">1</button>
            <button className="page-button" type="button">2</button>
            <button className="page-button" type="button">3</button>
            <button className="page-button icon-only" type="button" aria-label="下一页">
              <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </nav>
        </footer>
      </section>

      {/* ================================================================
          Add Tenant Modal (fixed overlay, page level)
          ================================================================ */}
      <div className="modal-overlay" hidden={!addModalOpen} onClick={(e) => { if (e.target === e.currentTarget) closeAddModal(); }}>
        <section className="tenant-modal" role="dialog" aria-modal="true" aria-labelledby="addTenantTitle">
          <header className="modal-header">
            <h2 id="addTenantTitle">新增租户</h2>
            <button className="modal-close" type="button" aria-label="关闭新增租户弹层" onClick={closeAddModal}>
              <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </header>

          <form className="modal-body" onSubmit={(e) => e.preventDefault()}>
            <section className="modal-section" aria-labelledby="tenantInfoTitle">
              <h3 id="tenantInfoTitle">租户信息</h3>

              <label className="modal-field">
                <span>租户名称</span>
                <input type="text" placeholder="请输入租户名称" value={addName} onChange={(e) => setAddName(e.target.value)} />
              </label>

              <label className="modal-field">
                <span>租户管理员邮箱</span>
                <input type="email" placeholder="请输入管理员邮箱" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} />
              </label>

              <fieldset className="modal-field tenant-type-group">
                <legend>上户类型</legend>
                <div className="type-radio-row">
                  <label className="type-radio-card">
                    <input type="radio" name="addTenantType" value="customer" checked={addType === 'customer'} onChange={() => setAddType('customer')} />
                    <span className="type-radio-body">
                      <strong>客户上户</strong>
                      <small>企业客户直接签约上户，API 应用默认为企业应用</small>
                    </span>
                  </label>
                  <label className="type-radio-card">
                    <input type="radio" name="addTenantType" value="partner" checked={addType === 'partner'} onChange={() => setAddType('partner')} />
                    <span className="type-radio-body">
                      <strong>ISV上户</strong>
                      <small>ISV/服务商接入上户，API 应用默认为ISV应用</small>
                    </span>
                  </label>
                </div>
              </fieldset>

              <label className="invite-card">
                <span className="invite-copy">
                  <strong>是否自动创建 API 应用</strong>
                  <span>开启后将根据上户类型自动创建对应的 API 应用</span>
                </span>
                <input className="switch-input" type="checkbox" checked={autoCreateApi} onChange={(e) => setAutoCreateApi(e.target.checked)} aria-label="是否自动创建 API 应用" />
                <span className="switch-track" aria-hidden="true" onClick={() => setAutoCreateApi((v) => !v)} />
              </label>

              <label className="invite-card">
                <span className="invite-copy">
                  <strong>是否自动发送租户管理员邀请</strong>
                  <span>开启后将自动向管理员邮箱发送激活链接</span>
                </span>
                <input className="switch-input" type="checkbox" checked={autoSendInvite} onChange={(e) => setAutoSendInvite(e.target.checked)} aria-label="是否自动发送租户管理员邀请" />
                <span className="switch-track" aria-hidden="true" onClick={() => setAutoSendInvite((v) => !v)} />
              </label>
            </section>

            <section className="modal-section" aria-labelledby="enterpriseInfoTitle">
              <h3 id="enterpriseInfoTitle">关联企业信息</h3>

              <label className="modal-field">
                <span>国家/地区 <em style={{color:'#e84b4b',fontStyle:'normal'}}>*</em></span>
                <span className="modal-select">
                  <select value={addCountry} onChange={(e) => setAddCountry(e.target.value)} required>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </span>
              </label>

              <label className="modal-field">
                <span>企业编码 <em style={{color:'#e84b4b',fontStyle:'normal'}}>*</em></span>
                <input type="text" placeholder="请输入企业编码" value={addCompanyCode} onChange={(e) => setAddCompanyCode(e.target.value)} required />
              </label>

              <label className="modal-field">
                <span>企业名称 <em style={{color:'#e84b4b',fontStyle:'normal'}}>*</em></span>
                <input type="text" placeholder="请输入企业名称" value={addCompany} onChange={(e) => setAddCompany(e.target.value)} required />
              </label>

              <label className="modal-field">
                <span>企业联系邮箱 <em style={{color:'#e84b4b',fontStyle:'normal'}}>*</em></span>
                <input type="email" placeholder="请输入企业联系邮箱" value={addCompanyEmail} onChange={(e) => setAddCompanyEmail(e.target.value)} required />
              </label>
            </section>
          </form>

          <footer className="modal-footer">
            <button className="button ghost modal-action" type="button" onClick={closeAddModal}>取消</button>
            <button className="button primary modal-action" type="button">确认创建</button>
          </footer>
        </section>
      </div>

      {/* ================================================================
          Edit Tenant Modal (fixed overlay, page level)
          ================================================================ */}
      <div className="modal-overlay" hidden={!editModalOpen} onClick={(e) => { if (e.target === e.currentTarget) closeEditModal(); }}>
        <section className="tenant-modal" role="dialog" aria-modal="true" aria-labelledby="editTenantTitle">
          <header className="modal-header">
            <h2 id="editTenantTitle">编辑租户</h2>
            <button className="modal-close" type="button" aria-label="关闭编辑租户弹层" onClick={closeEditModal}>
              <svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          </header>

          <form className="modal-body" onSubmit={(e) => e.preventDefault()}>
            <section className="modal-section" aria-labelledby="editTenantInfoTitle">
              <h3 id="editTenantInfoTitle">租户信息</h3>

              <label className="modal-field">
                <span>租户名称</span>
                <input type="text" value={editTenantData.name} onChange={(e) => setEditTenantData({ ...editTenantData, name: e.target.value })} />
              </label>

              <label className="modal-field">
                <span>租户管理员邮箱</span>
                <input type="email" value={editTenantData.adminEmail || editTenantData.email} onChange={(e) => setEditTenantData({ ...editTenantData, adminEmail: e.target.value })} />
              </label>

              <label className="modal-field">
                <span>上户类型</span>
                <span className="select-shell">
                  <select value={editTenantData.tenantType || editTenantData.type} disabled>
                    <option value="customer">客户上户</option>
                    <option value="partner">ISV上户</option>
                  </select>
                </span>
                <span className="field-hint">上户类型创建后不可修改</span>
              </label>
            </section>

            <section className="modal-section" aria-labelledby="editEnterpriseInfoTitle">
              <h3 id="editEnterpriseInfoTitle">关联企业信息</h3>

              <label className="modal-field">
                <span>国家/地区</span>
                <span className="modal-select">
                  <select value={editCountry} onChange={(e) => setEditCountry(e.target.value)}>
                    {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </span>
              </label>

              <label className="modal-field">
                <span>企业名称</span>
                <input type="text" value={editCompany} onChange={(e) => setEditCompany(e.target.value)} />
              </label>

              <label className="modal-field">
                <span>企业联系邮箱</span>
                <input type="email" value={editCompanyEmail} onChange={(e) => setEditCompanyEmail(e.target.value)} />
              </label>
            </section>
          </form>

          <footer className="modal-footer">
            <button className="button ghost modal-action" type="button" onClick={closeEditModal}>取消</button>
            <button className="button primary modal-action" type="button">保存修改</button>
          </footer>
        </section>
      </div>
    </div>
  );
}
