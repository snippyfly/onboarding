import { useState } from 'react';
import './OpsEnterprisePage.css';

/* ── Data ── */
const ENTERPRISES = [
  {
    code: 'ENT-MY-10086',
    name: 'Baiwang Malaysia Services Sdn. Bhd.',
    tenant: 'TENANT-SEA-023',
    tenantName: 'SEA Commerce ISV',
    country: '马来西亚',
    owner: 'SEA Commerce ISV',
    mode: 'ISV 代运营',
    modeTag: 'purple',
    status: '已配置',
    risk: '无阻断',
    taxId: 'TIN C25889412080',
    secondaryId: 'BRN 202201018888',
    address:
      'Tower 3, Level 18, Persiaran KLCC, Kuala Lumpur City Centre, 50088 Kuala Lumpur',
    contact: 'tax.my@baiwang.com / +60 3-2382 1888',
    updated: '2026-05-20 16:42',
    updatedNote: '运营复核通过',
  },
  {
    code: 'ENT-MY-10093',
    name: 'Malaysia Test Branch',
    tenant: 'TENANT-ALPHA-018',
    tenantName: 'Alpha ERP',
    country: '马来西亚',
    owner: 'Alpha ERP',
    mode: 'ISV 代运营',
    modeTag: 'purple',
    status: '未配置',
    risk: 'BRN、MSIC 缺失',
    taxId: 'TIN C78220091810',
    secondaryId: 'BRN 未填写',
    address: 'Level 20, Menara Maxis, Kuala Lumpur City Centre, 50088',
    contact: 'ops.my.branch@alpha-erp.com / 未填写联系电话',
    updated: '2026-05-20 11:18',
    updatedNote: 'ISV 提交基础资料',
  },
  {
    code: 'ENT-VN-20017',
    name: '百望越南工业有限公司',
    tenant: 'TENANT-DIRECT-006',
    tenantName: '直营客户',
    country: '越南',
    owner: '直营客户',
    mode: '百望运营',
    modeTag: '',
    status: '已配置',
    risk: '无阻断',
    taxId: 'MST 0312345678',
    secondaryId: 'E-invoice provider approved',
    address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City, Vietnam',
    contact: 'finance.vn@baiwang.com / +84 28 3822 8899',
    updated: '2026-05-19 18:06',
    updatedNote: '地址信息更新',
  },
  {
    code: 'ENT-VN-20042',
    name: 'VN Retail Connect Co., Ltd.',
    tenant: 'TENANT-SEA-041',
    tenantName: 'SEA Commerce ISV',
    country: '越南',
    owner: 'SEA Commerce ISV',
    mode: 'ISV 代运营',
    modeTag: 'purple',
    status: '未配置',
    risk: 'MST 与税局登记名称不一致',
    taxId: 'MST 0109988776',
    secondaryId: '税局名称校验失败',
    address: '72 Le Loi Street, District 1, Ho Chi Minh City',
    contact: 'billing@vn-retail.example / +84 28 3900 2000',
    updated: '2026-05-18 09:24',
    updatedNote: '税号校验失败',
  },
];

/* ── Helpers ── */
function statusPillClass(value) {
  if (value.includes('阻断') || value.includes('暂停')) return 'danger';
  if (value.includes('未配置') || value.includes('待') || value.includes('沙箱'))
    return 'warning';
  return 'success';
}

function stripTaxPrefix(value, prefixes) {
  let output = value || '';
  prefixes.forEach((prefix) => {
    output = output.replace(new RegExp(`^${prefix}\\s*`, 'i'), '');
  });
  return output.trim();
}

function splitContact(contact) {
  const [email = '', phone = ''] = (contact || '')
    .split('/')
    .map((item) => item.trim());
  return { email, phone };
}

/* ── Inline SVGs ── */
function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 20s6-5.7 6-10a6 6 0 1 0-12 0c0 4.3 6 10 6 10Z" />
      <circle cx="12" cy="10" r="2.2" />
    </svg>
  );
}

function BarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 19.5V11m5 8.5v-15m5 15V7.5m5 12v-10" />
      <path d="M3.5 19.5h17" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 12.5l4 4 8-8" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M12 7.5v5" />
      <circle cx="12" cy="16" r="0.8" />
    </svg>
  );
}

function BlockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" />
      <path d="M7.5 7.5l9 9" />
    </svg>
  );
}

export default function OpsEnterprisePage() {
  /* ── State ── */
  const [filterCountry, setFilterCountry] = useState('');
  const [filterName, setFilterName] = useState('');
  const [filterTenant, setFilterTenant] = useState('');
  const [filterCompliance, setFilterCompliance] = useState('');
  const [enterprises] = useState(ENTERPRISES);

  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailTab, setDetailTab] = useState('basic');

  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editCountry, setEditCountry] = useState('');

  /* ── Handlers ── */
  function openDetail(ent) {
    setDetailData(ent);
    setDetailTab('basic');
    setDetailDrawerOpen(true);
  }

  function closeDetail() {
    setDetailDrawerOpen(false);
  }

  function openEdit(ent) {
    setEditData(ent);
    setEditCountry(ent.country);
    setEditDrawerOpen(true);
  }

  function closeEdit() {
    setEditDrawerOpen(false);
  }

  function closeAll() {
    closeDetail();
    closeEdit();
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') closeAll();
  }

  return (
    <div
      className={
        'ops-enterprise-content' +
        (detailDrawerOpen || editDrawerOpen ? ' drawer-open' : '')
      }
      onKeyDown={handleKeyDown}
    >
      {/* ── Main Content ── */}
      <div className="content">
        {/* Hero */}
        <div className="hero-row">
          <div className="page-title">
            <h1>企业管理</h1>
            <p>
              统一管理所有国家/地区的企业税务档案，维护开票所需的合规字段与运营配置。
            </p>
          </div>
          <div className="hero-actions">
            <button className="button primary" type="button">
              + 新建企业
            </button>
            <button className="button ghost" type="button">
              批量导入
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="metric-row">
          <div className="metric-card">
            <div className="metric-head">
              <span className="metric-icon">
                <BarIcon />
              </span>
              企业总数
            </div>
            <div className="metric-value">128</div>
            <div className="metric-note">覆盖 6 个国家/地区</div>
          </div>
          <div className="metric-card">
            <div className="metric-head">
              <span className="metric-icon green">
                <CheckIcon />
              </span>
              税务已配置
            </div>
            <div className="metric-value">76</div>
            <div className="metric-note">开票能力正常</div>
          </div>
          <div className="metric-card">
            <div className="metric-head">
              <span className="metric-icon orange">
                <AlertIcon />
              </span>
              待补全资料
            </div>
            <div className="metric-value">34</div>
            <div className="metric-note">缺失必填税务字段</div>
          </div>
          <div className="metric-card">
            <div className="metric-head">
              <span className="metric-icon red">
                <BlockIcon />
              </span>
              合规阻断
            </div>
            <div className="metric-value">18</div>
            <div className="metric-note">需运营人工复核</div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <section className="panel toolbar" aria-label="企业筛选">
          <div className="filter-grid">
            <label className="field">
              <span>国家/地区</span>
              <span className="select-shell">
                <select
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                >
                  <option value="">全部国家/地区</option>
                  <option value="马来西亚">马来西亚</option>
                  <option value="越南">越南</option>
                  <option value="新加坡">新加坡</option>
                  <option value="印度尼西亚">印度尼西亚</option>
                </select>
              </span>
            </label>
            <label className="field">
              <span>企业名称</span>
              <input
                type="text"
                placeholder="请输入企业名称"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
              />
            </label>
            <label className="field">
              <span>所属租户</span>
              <input
                type="text"
                placeholder="请输入所属租户"
                value={filterTenant}
                onChange={(e) => setFilterTenant(e.target.value)}
              />
            </label>
            <label className="field">
              <span>税务合规信息</span>
              <span className="select-shell">
                <select
                  value={filterCompliance}
                  onChange={(e) => setFilterCompliance(e.target.value)}
                >
                  <option value="">全部</option>
                  <option value="已配置">已配置</option>
                  <option value="未配置">未配置</option>
                </select>
              </span>
            </label>
            <div className="filter-actions">
              <button className="button primary" type="button">
                查询
              </button>
              <button
                className="button ghost"
                type="button"
                onClick={() => {
                  setFilterCountry('');
                  setFilterName('');
                  setFilterTenant('');
                  setFilterCompliance('');
                }}
              >
                重置
              </button>
            </div>
          </div>
        </section>

        {/* Table */}
        <section className="panel table-panel">
          <div className="table-header">
            <div className="table-title">
              <h2>企业档案列表</h2>
              <span>共 128 条记录，当前显示最近更新的 {enterprises.length} 条</span>
            </div>
          </div>

          <div className="table-scroll">
            {/* Table Head */}
            <div className="table-grid table-head">
              <div>企业主体</div>
              <div>国家</div>
              <div>所属租户</div>
              <div>税务合规信息</div>
              <div>最近更新</div>
              <div>操作</div>
            </div>

            {/* Table Rows */}
            {enterprises.map((ent) => (
              <div className="table-grid table-row" key={ent.code}>
                <div className="enterprise-cell">
                  <button
                    className="enterprise-name"
                    type="button"
                    onClick={() => openDetail(ent)}
                  >
                    {ent.name}
                  </button>
                  <div className="meta-line">
                    <span>{ent.code}</span>
                    {ent.modeTag === 'purple' ? (
                      <span className="tag purple">{ent.mode}</span>
                    ) : (
                      ent.mode && <span className="tag">{ent.mode}</span>
                    )}
                    <span className="tag">{ent.tenant}</span>
                  </div>
                </div>
                <div className="country-cell">
                  <span className="inline-icon">
                    <MapPinIcon />
                  </span>
                  <span>{ent.country}</span>
                </div>
                <div className="stack">
                  <strong>{ent.tenant}</strong>
                  <span>{ent.tenantName}</span>
                </div>
                <div className="stack">
                  <span className={'status-pill ' + statusPillClass(ent.status)}>
                    {ent.status}
                  </span>
                  <span>{ent.secondaryId}</span>
                </div>
                <div className="stack">
                  <strong>{ent.updated}</strong>
                  <span>{ent.updatedNote}</span>
                </div>
                <div className="action-cell">
                  <button
                    className="action-link"
                    type="button"
                    onClick={() => openEdit(ent)}
                  >
                    编辑
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Table Footer */}
          <div className="table-footer">
            <span>
              显示 1-{enterprises.length}，共 128 条
            </span>
            <div className="pagination">
              <button className="page-button" type="button">
                &lsaquo;
              </button>
              <button className="page-button active" type="button">
                1
              </button>
              <button className="page-button" type="button">
                2
              </button>
              <button className="page-button" type="button">
                3
              </button>
              <button className="page-button" type="button">
                &rsaquo;
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* ── Overlay ── */}
      <div
        className={
          'drawer-overlay' +
          (detailDrawerOpen || editDrawerOpen ? ' open' : '')
        }
        onClick={closeAll}
      />

      {/* ── Detail Drawer ── */}
      <aside
        className={'drawer' + (detailDrawerOpen ? ' open' : '')}
        aria-hidden={!detailDrawerOpen}
        role="dialog"
        aria-label="企业详情"
      >
        {detailData && (
          <>
            <div className="drawer-header">
              <div>
                <p className="drawer-kicker">企业详情</p>
                <h2>{detailData.name}</h2>
                <p>
                  {detailData.code} / {detailData.tenant}
                </p>
              </div>
              <button
                className="drawer-close"
                type="button"
                aria-label="关闭"
                onClick={closeDetail}
              >
                &times;
              </button>
            </div>

            <div className="drawer-tabs" role="tablist" aria-label="企业详情">
              {['基本信息', '税务合规', '操作记录'].map((label) => {
                const tabValue =
                  label === '基本信息'
                    ? 'basic'
                    : label === '税务合规'
                      ? 'tax'
                      : 'logs';
                return (
                  <button
                    key={tabValue}
                    className={
                      'drawer-tab' + (detailTab === tabValue ? ' active' : '')
                    }
                    type="button"
                    onClick={() => setDetailTab(tabValue)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Panel: 基本信息 */}
            <section
              className={
                'drawer-panel' + (detailTab === 'basic' ? ' active' : '')
              }
            >
              <div className="drawer-section">
                <div className="drawer-section-head">
                  <div>
                    <h3>企业基础档案</h3>
                    <p>
                      运营人员可核对企业主体、租户、伙伴归属和联系信息。
                    </p>
                  </div>
                  <span
                    className={'status-pill ' + statusPillClass(detailData.status)}
                  >
                    {detailData.status}
                  </span>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <span>企业编码</span>
                    <strong>{detailData.code}</strong>
                  </div>
                  <div className="info-item">
                    <span>租户编码</span>
                    <strong>{detailData.tenant}</strong>
                  </div>
                  <div className="info-item">
                    <span>国家/地区</span>
                    <strong>{detailData.country}</strong>
                  </div>
                  <div className="info-item">
                    <span>归属伙伴</span>
                    <strong>{detailData.owner}</strong>
                  </div>
                  <div className="info-item">
                    <span>管理模式</span>
                    <strong>{detailData.mode}</strong>
                  </div>
                  <div className="info-item">
                    <span>联系方式</span>
                    <strong>{detailData.contact}</strong>
                  </div>
                  <div className="info-item wide">
                    <span>注册地址</span>
                    <strong>{detailData.address}</strong>
                  </div>
                </div>
                <div className="drawer-actions">
                  <button className="button primary" type="button">
                    编辑基础信息
                  </button>
                  <button className="button ghost" type="button">
                    变更伙伴归属
                  </button>
                </div>
              </div>
            </section>

            {/* Panel: 税务合规 */}
            <section
              className={
                'drawer-panel' + (detailTab === 'tax' ? ' active' : '')
              }
            >
              <div className="drawer-section">
                <div className="drawer-section-head">
                  <div>
                    <h3>税务合规资料</h3>
                    <p>
                      按国家展示开票前置字段、校验结果和阻断原因。
                    </p>
                  </div>
                  <span
                    className={'status-pill ' + statusPillClass(detailData.status)}
                  >
                    {detailData.status}
                  </span>
                </div>
                <div className="info-grid">
                  <div className="info-item">
                    <span>主税务识别号</span>
                    <strong>{detailData.taxId}</strong>
                  </div>
                  <div className="info-item">
                    <span>辅助登记信息</span>
                    <strong>{detailData.secondaryId}</strong>
                  </div>
                  <div className="info-item">
                    <span>合规风险</span>
                    <strong>{detailData.risk}</strong>
                  </div>
                  <div className="info-item">
                    <span>最近更新时间</span>
                    <strong>{detailData.updated}</strong>
                  </div>
                </div>
              </div>
              <div className="drawer-section">
                <div className="drawer-section-head">
                  <div>
                    <h3>合规处理路径</h3>
                    <p>从资料提交到开票启用的运营节点。</p>
                  </div>
                </div>
                <div className="compliance-path">
                  <div className="path-step">
                    <strong>资料提交</strong>
                    <span>
                      企业或 ISV 提交基础字段、税号和注册地址。
                    </span>
                  </div>
                  <div className="path-step">
                    <strong>字段校验</strong>
                    <span>
                      按国家规则检查必填项、格式和登记号一致性。
                    </span>
                  </div>
                  <div className="path-step">
                    <strong>运营复核</strong>
                    <span>高风险或阻断项进入运营人工复核。</span>
                  </div>
                  <div className="path-step">
                    <strong>启用开票</strong>
                    <span>通过后同步生产能力和税局回执配置。</span>
                  </div>
                </div>
                <div className="drawer-actions">
                  <button className="button primary" type="button">
                    维护税务信息
                  </button>
                  <button className="button ghost" type="button">
                    发起资料复核
                  </button>
                  <button className="button subtle" type="button">
                    通知 ISV 补件
                  </button>
                </div>
              </div>
            </section>

            {/* Panel: 操作记录 */}
            <section
              className={
                'drawer-panel' + (detailTab === 'logs' ? ' active' : '')
              }
            >
              <div className="drawer-section">
                <div className="drawer-section-head">
                  <div>
                    <h3>操作记录</h3>
                    <p>展示运营、ISV 与系统校验产生的关键事件。</p>
                  </div>
                </div>
                <div className="timeline">
                  <div className="timeline-item">
                    <time>05-20 16:42</time>
                    <div className="timeline-copy">
                      <strong>运营复核通过</strong>
                      <span>
                        Ops Admin
                        完成企业税务资料复核，开票能力保持启用。
                      </span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <time>05-20 15:38</time>
                    <div className="timeline-copy">
                      <strong>ISV 更新资料</strong>
                      <span>
                        伙伴提交注册地址和联系人信息，系统完成字段格式校验。
                      </span>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <time>05-19 18:06</time>
                    <div className="timeline-copy">
                      <strong>系统同步税局状态</strong>
                      <span>生产回执同步成功，未发现阻断项。</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </aside>

      {/* ── Edit Drawer ── */}
      <aside
        className={
          'drawer edit-drawer' + (editDrawerOpen ? ' open' : '')
        }
        aria-hidden={!editDrawerOpen}
        role="dialog"
        aria-label="编辑企业信息"
      >
        {editData && (() => {
          const isVietnam = editCountry === '越南';
          const { email, phone } = splitContact(editData.contact);

          return (
            <>
              <div className="drawer-header">
                <div>
                  <p className="drawer-kicker">编辑企业信息</p>
                  <h2>{editData.name}</h2>
                  <p>
                    {editData.code} / {editData.tenant}
                  </p>
                </div>
                <button
                  className="drawer-close"
                  type="button"
                  aria-label="关闭"
                  onClick={closeEdit}
                >
                  &times;
                </button>
              </div>

              <form className="edit-form">
                {/* Basic Info Section */}
                <section className="edit-form-section">
                  <div className="edit-form-head">
                    <div>
                      <h3>企业基本信息</h3>
                      <p>维护企业主体、所属租户、国家和运营归属信息。</p>
                    </div>
                    <span className="status-pill neutral">基础档案</span>
                  </div>
                  <div className="form-grid">
                    <label className="field">
                      <span>企业编码</span>
                      <input
                        type="text"
                        readOnly
                        defaultValue={editData.code}
                      />
                    </label>
                    <label className="field">
                      <span>
                        所属租户 <em>*</em>
                      </span>
                      <input
                        type="text"
                        placeholder="请输入所属租户"
                        defaultValue={editData.tenant}
                      />
                    </label>
                    <label className="field field-wide">
                      <span>
                        企业名称 <em>*</em>
                      </span>
                      <input
                        type="text"
                        placeholder="请输入企业名称"
                        defaultValue={editData.name}
                      />
                    </label>
                    <label className="field">
                      <span>
                        国家/地区 <em>*</em>
                      </span>
                      <span className="select-shell">
                        <select
                          value={editCountry}
                          onChange={(e) => setEditCountry(e.target.value)}
                        >
                          <option value="马来西亚">马来西亚</option>
                          <option value="越南">越南</option>
                        </select>
                      </span>
                    </label>
                    <label className="field">
                      <span>企业联系邮箱</span>
                      <input
                        type="email"
                        placeholder="请输入企业联系邮箱"
                        defaultValue={
                          email === '未填写联系电话' ? '' : email
                        }
                      />
                    </label>
                  </div>
                </section>

                {/* Tax Info Section */}
                <section className="edit-form-section">
                  <div className="edit-form-head">
                    <div>
                      <h3>税务合规信息</h3>
                      <p id="editTaxDescription">
                        {isVietnam
                          ? '越南企业需维护 MST、税局登记名称、税务注册地址和联系电话。'
                          : '马来西亚企业需维护 TIN、BRN、MSIC、州/省、城市、邮编和税务注册地址。'}
                      </p>
                    </div>
                  </div>

                  <div className="form-grid">
                    {/* Malaysia tax fields */}
                    <div
                      className={
                        'country-tax-fields' +
                        (!isVietnam ? ' active' : '')
                      }
                    >
                      <label className="field">
                        <span>
                          税务登记号（TIN） <em>*</em>
                        </span>
                        <input
                          type="text"
                          placeholder="请输入 TIN"
                          defaultValue={
                            !isVietnam
                              ? stripTaxPrefix(editData.taxId, ['TIN'])
                              : ''
                          }
                        />
                      </label>
                      <label className="field">
                        <span>
                          商业注册号（BRN） <em>*</em>
                        </span>
                        <input
                          type="text"
                          placeholder="请输入 BRN"
                          defaultValue={
                            !isVietnam
                              ? stripTaxPrefix(editData.secondaryId, [
                                  'BRN',
                                ])
                              : ''
                          }
                        />
                      </label>
                      <label className="field">
                        <span>销售与服务税注册号（SST）</span>
                        <input
                          type="text"
                          placeholder="请输入 SST，可选"
                        />
                      </label>
                      <label className="field">
                        <span>旅游税注册号（TTX）</span>
                        <input
                          type="text"
                          placeholder="请输入 TTX，可选"
                        />
                      </label>
                      <label className="field">
                        <span>
                          行业代码（MSIC） <em>*</em>
                        </span>
                        <input
                          type="text"
                          placeholder="请输入 MSIC"
                          defaultValue={
                            !isVietnam && editData.status === '已配置'
                              ? '62010'
                              : ''
                          }
                        />
                      </label>
                      <label className="field">
                        <span>州/省</span>
                        <span className="select-shell">
                          <select defaultValue="Wilayah Persekutuan">
                            <option>Wilayah Persekutuan</option>
                            <option>Selangor</option>
                            <option>Johor</option>
                            <option>Penang</option>
                          </select>
                        </span>
                      </label>
                      <label className="field">
                        <span>城市</span>
                        <input
                          type="text"
                          placeholder="请输入城市"
                          defaultValue={
                            !isVietnam ? 'Kuala Lumpur' : ''
                          }
                        />
                      </label>
                      <label className="field">
                        <span>邮编</span>
                        <input
                          type="text"
                          placeholder="请输入邮编"
                          defaultValue={!isVietnam ? '50088' : ''}
                        />
                      </label>
                      <label className="field field-wide">
                        <span>税务注册地址</span>
                        <textarea
                          placeholder="请输入税务注册地址"
                          defaultValue={
                            !isVietnam ? editData.address : ''
                          }
                        />
                      </label>
                    </div>

                    {/* Vietnam tax fields */}
                    <div
                      className={
                        'country-tax-fields' +
                        (isVietnam ? ' active' : '')
                      }
                    >
                      <label className="field">
                        <span>
                          税务登记号（MST） <em>*</em>
                        </span>
                        <input
                          type="text"
                          placeholder="请输入 MST"
                          defaultValue={
                            isVietnam
                              ? stripTaxPrefix(editData.taxId, ['MST'])
                              : ''
                          }
                        />
                      </label>
                      <label className="field">
                        <span>税局登记名称</span>
                        <input
                          type="text"
                          placeholder="请输入税局登记名称"
                          defaultValue={isVietnam ? editData.name : ''}
                        />
                      </label>
                      <label className="field">
                        <span>联系电话</span>
                        <input
                          type="text"
                          placeholder="请输入联系电话"
                          defaultValue={isVietnam ? phone : ''}
                        />
                      </label>
                      <label className="field">
                        <span>电子发票服务商状态</span>
                        <span className="select-shell">
                          <select
                            defaultValue={
                              editData.status === '已配置'
                                ? '已备案'
                                : '待备案'
                            }
                          >
                            <option>已备案</option>
                            <option>待备案</option>
                            <option>不适用</option>
                          </select>
                        </span>
                      </label>
                      <label className="field field-wide">
                        <span>
                          税务注册地址 <em>*</em>
                        </span>
                        <textarea
                          placeholder="请输入税务注册地址"
                          defaultValue={
                            isVietnam ? editData.address : ''
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="edit-note">
                    <span aria-hidden="true">!</span>
                    <span>
                      税务合规信息为&ldquo;未配置&rdquo;时，企业档案可保存，但开票前仍需补全国家要求的必填税务字段。
                    </span>
                  </div>
                </section>

                <div className="edit-actions">
                  <button
                    className="button ghost"
                    type="button"
                    onClick={closeEdit}
                  >
                    取消
                  </button>
                  <button className="button primary" type="button">
                    保存
                  </button>
                </div>
              </form>
            </>
          );
        })()}
      </aside>
    </div>
  );
}
