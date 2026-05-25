import { useState } from 'react';
import './EnterprisePage.css';

const COMPANIES = [
  {
    name: '百望越南工业有限公司',
    code: 'CMP-VN-0001',
    country: '越南',
    email: 'finance.vn@baiwang.com',
    address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City, Vietnam',
    taxStatus: '已配置',
    mst: '0312345678',
    taxAddress: '123 Nguyen Hue Street, District 1, Ho Chi Minh City, Vietnam',
    phone: '+84 28 3822 8899',
    tin: '--',
    brn: '--',
    sst: '--',
    ttx: '--',
    msic: '--',
    region: '--',
    city: '--',
    addressLine1: '--',
    addressLine2: '--',
    addressLine3: '--',
    postcode: '--',
  },
  {
    name: 'Malaysia Test Branch',
    code: 'CMP-MY-0002',
    country: '马来西亚',
    email: 'ops.my.branch@baiwang.com',
    address: 'Level 20, Menara Maxis, Kuala Lumpur City Centre, 50088',
    taxStatus: '未配置',
    mst: '--',
    taxAddress: '--',
    phone: '--',
    tin: '--',
    brn: '--',
    sst: '--',
    ttx: '--',
    msic: '--',
    region: '--',
    city: '--',
    addressLine1: '--',
    addressLine2: '--',
    addressLine3: '--',
    postcode: '--',
  },
  {
    name: 'Baiwang Malaysia Services Sdn. Bhd.',
    code: 'CMP-MY-0003',
    country: '马来西亚',
    email: 'tax.my@baiwang.com',
    address: 'Persiaran KLCC, 50088 Kuala Lumpur',
    taxStatus: '已配置',
    mst: '--',
    taxAddress: '--',
    phone: '+60 3-2382 1888',
    tin: 'C25889412080',
    brn: '202201018888',
    sst: 'W10-2204-32000012',
    ttx: 'TTX-2204-00078',
    msic: '62010',
    region: 'Wilayah Persekutuan',
    city: 'Kuala Lumpur',
    addressLine1: 'Persiaran KLCC',
    addressLine2: 'Tower 3, Level 18',
    addressLine3: 'Kuala Lumpur City Centre',
    postcode: '50088',
  },
];

const TAX_CONFIG = {
  '马来西亚': {
    title: '马来西亚税务合规信息',
    description: '仅展示马来西亚企业所需的税务识别、注册地址与联系电话信息。',
    editTitle: '编辑马来西亚税务合规信息',
    editDescription: '维护 TIN、BRN、MSIC、地址、邮编与联系电话等马来西亚开票必需资料。',
    configuredNote: '当前马来西亚税务合规信息已配置完成，可按需维护更新。',
    pendingNote: '马来西亚税务合规信息尚未配置完成，请补充必填字段后再启用开票。',
    wizardTitle: '马来西亚税务合规信息',
    wizardDescription: 'TIN、BRN、MSIC、州/省、城市、地址1、邮编和联系电话为必填。SST 与 TTX 可按企业业务类型补充。',
  },
  '越南': {
    title: '越南税务合规信息',
    description: '仅展示越南企业所需的 MST、注册地址与联系电话信息。',
    editTitle: '编辑越南税务合规信息',
    editDescription: '维护 MST、地址与联系电话等越南开票所需资料。',
    configuredNote: '当前越南税务合规信息已配置完成，可按需维护更新。',
    pendingNote: '越南税务合规信息尚未配置完成，请补充 MST 与地址后再启用开票。',
    wizardTitle: '越南税务合规信息',
    wizardDescription: '越南企业需维护税务登记号（MST）和地址，联系电话可按需补充。',
  },
};

function displayValue(value) {
  return value && value !== '--' ? value : '--';
}

function isPresent(value) {
  return Boolean(value && value.trim() && value.trim() !== '--');
}

function isTaxConfigured(country, c) {
  if (country === '越南') {
    return isPresent(c.mst) && isPresent(c.taxAddress);
  }
  return [c.tin, c.brn, c.msic, c.region, c.city, c.addressLine1, c.postcode, c.phone].every(isPresent);
}

function PinIcon() {
  return (
    <span className="pin-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24">
        <path d="M12 20s6-5.7 6-10a6 6 0 1 0-12 0c0 4.3 6 10 6 10Z" />
        <circle cx="12" cy="10" r="2.2" />
      </svg>
    </span>
  );
}

export default function EnterprisePage() {
  const [companies, setCompanies] = useState(COMPANIES);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailTab, setDetailTab] = useState('basic');
  const [taxEditing, setTaxEditing] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardCountry, setWizardCountry] = useState('马来西亚');

  // Tax edit form state
  const [editForm, setEditForm] = useState({});

  const selected = selectedIdx != null ? companies[selectedIdx] : null;
  const isVietnam = selected?.country === '越南';
  const taxCfg = selected ? TAX_CONFIG[selected.country] : null;

  const openDetail = (idx, tab = 'basic', editing = false) => {
    setSelectedIdx(idx);
    setDetailTab(tab);
    setTaxEditing(editing && tab === 'tax');
    setDetailOpen(true);
    initEditForm(companies[idx]);
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setTaxEditing(false);
  };

  const initEditForm = (c) => {
    if (c.country === '越南') {
      setEditForm({
        mst: isPresent(c.mst) ? c.mst : '',
        taxAddress: isPresent(c.taxAddress) ? c.taxAddress : '',
        phone: isPresent(c.phone) ? c.phone : '',
      });
    } else {
      setEditForm({
        tin: isPresent(c.tin) ? c.tin : '',
        brn: isPresent(c.brn) ? c.brn : '',
        sst: isPresent(c.sst) ? c.sst : '',
        ttx: isPresent(c.ttx) ? c.ttx : '',
        msic: isPresent(c.msic) ? c.msic : '',
        region: isPresent(c.region) ? c.region : '',
        city: isPresent(c.city) ? c.city : '',
        addressLine1: isPresent(c.addressLine1) ? c.addressLine1 : '',
        addressLine2: isPresent(c.addressLine2) ? c.addressLine2 : '',
        addressLine3: isPresent(c.addressLine3) ? c.addressLine3 : '',
        postcode: isPresent(c.postcode) ? c.postcode : '',
        phone: isPresent(c.phone) ? c.phone : '',
      });
    }
  };

  const saveTaxEdit = () => {
    if (selectedIdx == null) return;
    const updated = [...companies];
    const c = { ...updated[selectedIdx] };

    if (c.country === '越南') {
      c.mst = editForm.mst.trim() || '--';
      c.taxAddress = editForm.taxAddress.trim() || '--';
      c.phone = editForm.phone.trim() || '--';
      c.address = c.taxAddress;
    } else {
      c.tin = editForm.tin.trim() || '--';
      c.brn = editForm.brn.trim() || '--';
      c.sst = editForm.sst.trim() || '--';
      c.ttx = editForm.ttx.trim() || '--';
      c.msic = editForm.msic.trim() || '--';
      c.region = editForm.region === '请选择州/省' ? '--' : editForm.region;
      c.city = editForm.city.trim() || '--';
      c.addressLine1 = editForm.addressLine1.trim() || '--';
      c.addressLine2 = editForm.addressLine2.trim() || '--';
      c.addressLine3 = editForm.addressLine3.trim() || '--';
      c.postcode = editForm.postcode.trim() || '--';
      c.phone = editForm.phone.trim() || '--';
      c.address = [c.addressLine1, c.addressLine2, c.addressLine3, c.postcode, c.city]
        .filter(isPresent).join(', ') || '--';
    }

    c.taxStatus = isTaxConfigured(c.country, c) ? '已配置' : '未配置';
    updated[selectedIdx] = c;
    setCompanies(updated);
    setTaxEditing(false);
  };

  const cancelTaxEdit = () => {
    if (selected) initEditForm(selected);
    setTaxEditing(false);
  };

  const openWizard = () => {
    setWizardCountry('马来西亚');
    setWizardStep(1);
    setWizardOpen(true);
  };

  const closeWizard = () => setWizardOpen(false);

  const overlayOpen = detailOpen || wizardOpen;

  return (
    <div className="enterprise-content">
      <section className="page-title">
        <h1>企业管理</h1>
        <button className="button primary add-button" type="button" onClick={openWizard}>
          <span>＋</span>
          <span>新增企业</span>
        </button>
      </section>

      <section className="panel search-panel">
        <div className="search-grid">
          <label className="field">
            <span>企业名称</span>
            <input type="text" placeholder="请输入企业名称" />
          </label>
          <label className="field">
            <span>国别</span>
            <span className="select-shell">
              <select>
                <option>全部国别</option>
              </select>
            </span>
          </label>
          <div className="search-actions">
            <button className="button primary" type="button">查询</button>
            <button className="button ghost" type="button">重置</button>
          </div>
        </div>
      </section>

      <section className="panel table-panel">
        <div className="table-header">
          <h2>企业列表</h2>
          <span>共 {companies.length} 条记录</span>
        </div>
        <div className="table-scroll">
          <div className="table-grid table-head">
            <div>企业名称</div>
            <div>国别</div>
            <div>地址</div>
            <div>税务合规信息</div>
            <div>操作</div>
          </div>

          {companies.map((c, i) => (
            <div className="table-grid row" key={i}>
              <div className="company-cell">
                <button className="company-entry" type="button" onClick={() => openDetail(i, 'basic')}>
                  {c.name}
                </button>
                <span>{c.code}</span>
              </div>
              <div className="country-cell">
                <PinIcon />
                <span>{c.country}</span>
              </div>
              <div className="address-cell">{c.address}</div>
              <div>
                <span className={`status-pill ${c.taxStatus === '已配置' ? 'configured' : 'pending'}`}>
                  {c.taxStatus}
                </span>
              </div>
              <div className="action-cell">
                <button className="action-link" type="button" onClick={() => openDetail(i, 'tax', true)}>
                  维护税务信息
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="table-footer">
          <span>显示 1-{companies.length}，共 {companies.length} 条</span>
          <div className="pagination">
            <button className="page-arrow" type="button">‹</button>
            <button className="page-number active" type="button">1</button>
            <button className="page-arrow" type="button">›</button>
          </div>
        </div>
      </section>

      {/* Overlay */}
      <div className={`drawer-overlay ${overlayOpen ? 'open' : ''}`} onClick={() => { closeDetail(); closeWizard(); }} />

      {/* Detail Drawer */}
      <aside className={`enterprise-drawer detail-drawer${detailOpen ? ' open' : ''}${taxEditing ? ' tax-editing' : ''}`} aria-hidden={!detailOpen}>
        <div className="drawer-header detail-header">
          <div>
            <h2>{selected?.name || '企业详情'}</h2>
            <p>{selected?.code || 'CMP-XXXX'}</p>
          </div>
          <button className="drawer-close" type="button" aria-label="关闭" onClick={closeDetail}>×</button>
        </div>

        <div className="detail-tabs">
          <button className={`detail-tab${detailTab === 'basic' ? ' active' : ''}`} type="button"
            onClick={() => { setDetailTab('basic'); setTaxEditing(false); }}>企业基本信息</button>
          <button className={`detail-tab${detailTab === 'tax' ? ' active' : ''}`} type="button"
            onClick={() => setDetailTab('tax')}>税务合规信息</button>
        </div>

        <div className="drawer-body detail-body">
          {/* Basic info panel */}
          <section className={`detail-panel${detailTab === 'basic' ? ' active' : ''}`} data-detail-panel="basic">
            <div className="detail-panel-head">
              <div>
                <h3>企业基本信息</h3>
                <p>查看当前企业的基础档案信息。</p>
              </div>
              <button className="button ghost detail-edit-button" type="button">编辑基础信息</button>
            </div>
            <div className="detail-grid">
              <div className="detail-item">
                <span>企业名称</span>
                <strong>{selected?.name || '--'}</strong>
              </div>
              <div className="detail-item">
                <span>企业编码</span>
                <strong>{selected?.code || '--'}</strong>
              </div>
              <div className="detail-item">
                <span>国家/地区</span>
                <strong>{selected?.country || '--'}</strong>
              </div>
              <div className="detail-item">
                <span>企业联系邮箱</span>
                <strong>{selected?.email || '--'}</strong>
              </div>
            </div>
          </section>

          {/* Tax info panel */}
          <section className={`detail-panel${detailTab === 'tax' ? ' active' : ''}`} data-detail-panel="tax">
            <div className="detail-panel-head tax-view-mode">
              <div>
                <h3>{taxCfg?.title || '税务合规信息'}</h3>
                <p>{taxCfg?.description || '查看或补充该企业开票所需的税务合规资料。'}</p>
              </div>
              <button className="button ghost detail-edit-button" type="button"
                onClick={() => { initEditForm(selected); setTaxEditing(true); }}>维护税务信息</button>
            </div>

            {/* Vietnam tax view */}
            <div className={`detail-grid tax-view-mode country-tax-section${isVietnam ? ' active' : ''}`}>
              <div className="detail-item">
                <span>税务登记号（MST）</span>
                <strong>{selected ? displayValue(selected.mst) : '--'}</strong>
              </div>
              <div className="detail-item detail-item-wide">
                <span>地址</span>
                <strong>{selected ? displayValue(selected.taxAddress) : '--'}</strong>
              </div>
              <div className="detail-item">
                <span>联系电话</span>
                <strong>{selected ? displayValue(selected.phone) : '--'}</strong>
              </div>
            </div>

            {/* Malaysia tax view */}
            <div className={`detail-grid tax-view-mode country-tax-section${!isVietnam && selected ? ' active' : ''}`}>
              <div className="detail-item">
                <span>税务登记号（TIN）</span>
                <strong>{selected ? displayValue(selected.tin) : '--'}</strong>
              </div>
              <div className="detail-item">
                <span>商业注册号（BRN）</span>
                <strong>{selected ? displayValue(selected.brn) : '--'}</strong>
              </div>
              <div className="detail-item">
                <span>销售与服务税注册号（SST）</span>
                <strong>{selected ? displayValue(selected.sst) : '--'}</strong>
              </div>
              <div className="detail-item">
                <span>旅游税注册号（TTX）</span>
                <strong>{selected ? displayValue(selected.ttx) : '--'}</strong>
              </div>
              <div className="detail-item">
                <span>行业代码（MSIC）</span>
                <strong>{selected ? displayValue(selected.msic) : '--'}</strong>
              </div>
              <div className="detail-item">
                <span>州/省</span>
                <strong>{selected ? displayValue(selected.region) : '--'}</strong>
              </div>
              <div className="detail-item">
                <span>城市</span>
                <strong>{selected ? displayValue(selected.city) : '--'}</strong>
              </div>
              <div className="detail-item">
                <span>邮编</span>
                <strong>{selected ? displayValue(selected.postcode) : '--'}</strong>
              </div>
              <div className="detail-item detail-item-wide">
                <span>地址1</span>
                <strong>{selected ? displayValue(selected.addressLine1) : '--'}</strong>
              </div>
              <div className="detail-item detail-item-wide">
                <span>地址2</span>
                <strong>{selected ? displayValue(selected.addressLine2) : '--'}</strong>
              </div>
              <div className="detail-item detail-item-wide">
                <span>地址3</span>
                <strong>{selected ? displayValue(selected.addressLine3) : '--'}</strong>
              </div>
              <div className="detail-item">
                <span>联系电话</span>
                <strong>{selected ? displayValue(selected.phone) : '--'}</strong>
              </div>
            </div>

            <div className="drawer-note tax-detail-note">
              <span className="note-icon" aria-hidden="true">⚠</span>
              <span>{selected && isTaxConfigured(selected.country, selected) ? taxCfg?.configuredNote : taxCfg?.pendingNote}</span>
            </div>

            {/* Tax edit mode */}
            <div className="tax-edit-mode">
              <div className="detail-panel-head">
                <div>
                  <h3>{taxCfg?.editTitle || '编辑税务合规信息'}</h3>
                  <p>{taxCfg?.editDescription || '维护企业开票所需的地址与税务资料。'}</p>
                </div>
              </div>

              {/* Vietnam edit fields */}
              <div className={`drawer-form-grid two-cols country-tax-section${isVietnam ? ' active' : ''}`}>
                <label className="field">
                  <span>税务登记号（MST） <em>*</em></span>
                  <input type="text" placeholder="请输入税务登记号（MST）" value={editForm.mst || ''}
                    onChange={(e) => setEditForm({ ...editForm, mst: e.target.value })} />
                </label>
                <label className="field field-span-two">
                  <span>地址 <em>*</em></span>
                  <input type="text" placeholder="请输入地址" value={editForm.taxAddress || ''}
                    onChange={(e) => setEditForm({ ...editForm, taxAddress: e.target.value })} />
                </label>
                <label className="field">
                  <span>联系电话</span>
                  <input type="text" placeholder="请输入联系电话" value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                </label>
              </div>

              {/* Malaysia edit fields */}
              <div className={`drawer-form-grid two-cols country-tax-section${!isVietnam && selected ? ' active' : ''}`}>
                <label className="field">
                  <span>税务登记号（TIN） <em>*</em></span>
                  <input type="text" placeholder="请输入税务登记号（TIN）" value={editForm.tin || ''}
                    onChange={(e) => setEditForm({ ...editForm, tin: e.target.value })} />
                </label>
                <label className="field">
                  <span>商业注册号（BRN） <em>*</em></span>
                  <input type="text" placeholder="请输入商业注册号（BRN）" value={editForm.brn || ''}
                    onChange={(e) => setEditForm({ ...editForm, brn: e.target.value })} />
                </label>
                <label className="field">
                  <span>销售与服务税注册号（SST）</span>
                  <input type="text" placeholder="请输入销售与服务税注册号（SST）" value={editForm.sst || ''}
                    onChange={(e) => setEditForm({ ...editForm, sst: e.target.value })} />
                </label>
                <label className="field">
                  <span>旅游税注册号（TTX）</span>
                  <input type="text" placeholder="请输入旅游税注册号（TTX）" value={editForm.ttx || ''}
                    onChange={(e) => setEditForm({ ...editForm, ttx: e.target.value })} />
                </label>
                <label className="field">
                  <span>行业代码（MSIC） <em>*</em></span>
                  <input type="text" placeholder="请输入行业代码（MSIC）" value={editForm.msic || ''}
                    onChange={(e) => setEditForm({ ...editForm, msic: e.target.value })} />
                </label>
                <label className="field">
                  <span>州/省 <em>*</em></span>
                  <span className="select-shell">
                    <select value={editForm.region || '请选择州/省'}
                      onChange={(e) => setEditForm({ ...editForm, region: e.target.value })}>
                      <option>请选择州/省</option>
                      <option>Wilayah Persekutuan</option>
                      <option>Selangor</option>
                      <option>Johor</option>
                    </select>
                  </span>
                </label>
                <label className="field">
                  <span>城市 <em>*</em></span>
                  <input type="text" placeholder="请输入城市" value={editForm.city || ''}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })} />
                </label>
                <label className="field field-span-two">
                  <span>地址1 <em>*</em></span>
                  <input type="text" placeholder="请输入地址1" value={editForm.addressLine1 || ''}
                    onChange={(e) => setEditForm({ ...editForm, addressLine1: e.target.value })} />
                </label>
                <label className="field field-span-two">
                  <span>地址2</span>
                  <input type="text" placeholder="补充地址，可选" value={editForm.addressLine2 || ''}
                    onChange={(e) => setEditForm({ ...editForm, addressLine2: e.target.value })} />
                </label>
                <label className="field field-span-two">
                  <span>地址3</span>
                  <input type="text" placeholder="补充地址，可选" value={editForm.addressLine3 || ''}
                    onChange={(e) => setEditForm({ ...editForm, addressLine3: e.target.value })} />
                </label>
                <label className="field">
                  <span>邮编 <em>*</em></span>
                  <input type="text" placeholder="请输入邮编" value={editForm.postcode || ''}
                    onChange={(e) => setEditForm({ ...editForm, postcode: e.target.value })} />
                </label>
                <label className="field">
                  <span>联系电话 <em>*</em></span>
                  <input type="text" placeholder="请输入联系电话" value={editForm.phone || ''}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                </label>
              </div>

              <div className="drawer-actions">
                <button className="button ghost" type="button" onClick={cancelTaxEdit}>取消</button>
                <button className="button primary" type="button" onClick={saveTaxEdit}>保存</button>
              </div>
            </div>
          </section>
        </div>
      </aside>

      {/* Wizard Drawer */}
      <aside className={`enterprise-drawer${wizardOpen ? ' open' : ''}`} aria-hidden={!wizardOpen}>
        <div className="drawer-header">
          <h2>新增企业</h2>
        </div>

        <div className="wizard-steps">
          <button className={`wizard-step${wizardStep === 1 ? ' active' : ''}${wizardStep > 1 ? ' done' : ''}`}
            type="button" onClick={() => setWizardStep(1)}>
            <span className="step-badge">1</span>
            <span>基础信息</span>
          </button>
          <button className={`wizard-step${wizardStep === 2 ? ' active' : ''}`}
            type="button" onClick={() => setWizardStep(2)}>
            <span className="step-badge">2</span>
            <span>税务合规信息</span>
          </button>
        </div>

        <div className="drawer-body">
          {/* Step 1 */}
          <section className={`drawer-panel${wizardStep === 1 ? ' active' : ''}`}>
            <div className="drawer-panel-head">
              <h3>企业基础信息</h3>
              <p>基础信息仅包含国家代码、企业名称和企业联系邮箱。</p>
            </div>
            <div className="drawer-form-grid two-cols">
              <label className="field">
                <span>国家代码 <em>*</em></span>
                <span className="select-shell">
                  <select value={wizardCountry} onChange={(e) => setWizardCountry(e.target.value)}>
                    <option>马来西亚</option>
                    <option>越南</option>
                  </select>
                </span>
              </label>
              <label className="field">
                <span>企业名称 <em>*</em></span>
                <input type="text" placeholder="例如：Baiwang Malaysia Services Sdn. Bhd." />
              </label>
            </div>
            <label className="field field-full">
              <span>企业联系邮箱 <em>*</em></span>
              <span className="input-with-icon">
                <input type="email" placeholder="请输入企业联系邮箱" />
                <span className="field-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 20s6-5.7 6-10a6 6 0 1 0-12 0c0 4.3 6 10 6 10Z" />
                    <circle cx="12" cy="10" r="2.2" />
                  </svg>
                </span>
              </span>
            </label>
            <div className="drawer-note">
              <span className="note-icon" aria-hidden="true">⚠</span>
              <span>下一步将根据国别展示税务合规字段。合规信息未配置将阻断开票。</span>
            </div>
            <div className="drawer-actions">
              <button className="button ghost" type="button" onClick={closeWizard}>取消</button>
              <button className="button primary" type="button" onClick={() => setWizardStep(2)}>下一步</button>
            </div>
          </section>

          {/* Step 2 */}
          <section className={`drawer-panel${wizardStep === 2 ? ' active' : ''}`}>
            <div className="drawer-panel-head">
              <h3>{TAX_CONFIG[wizardCountry].wizardTitle}</h3>
              <p>{TAX_CONFIG[wizardCountry].wizardDescription}</p>
            </div>

            {/* Malaysia wizard fields */}
            <div className={`drawer-form-grid two-cols country-tax-section${wizardCountry === '马来西亚' ? ' active' : ''}`}>
              <label className="field">
                <span>税务登记号（TIN） <em>*</em></span>
                <input type="text" placeholder="请输入税务登记号（TIN）" />
              </label>
              <label className="field">
                <span>商业注册号（BRN） <em>*</em></span>
                <input type="text" placeholder="请输入商业注册号（BRN）" />
              </label>
              <label className="field">
                <span>销售与服务税注册号（SST）</span>
                <input type="text" placeholder="请输入销售与服务税注册号（SST）" />
              </label>
              <label className="field">
                <span>旅游税注册号（TTX）</span>
                <input type="text" placeholder="请输入旅游税注册号（TTX）" />
              </label>
              <label className="field">
                <span>行业代码（MSIC） <em>*</em></span>
                <input type="text" placeholder="请输入行业代码（MSIC）" />
              </label>
              <label className="field">
                <span>州/省 <em>*</em></span>
                <span className="select-shell">
                  <select>
                    <option>请选择州/省</option>
                    <option>Wilayah Persekutuan</option>
                    <option>Selangor</option>
                    <option>Johor</option>
                  </select>
                </span>
              </label>
              <label className="field">
                <span>城市 <em>*</em></span>
                <input type="text" placeholder="请输入城市" />
              </label>
              <label className="field">
                <span>邮编 <em>*</em></span>
                <input type="text" placeholder="请输入邮编" />
              </label>
              <label className="field field-span-two">
                <span>地址1 <em>*</em></span>
                <span className="input-with-icon warning-icon">
                  <input type="text" placeholder="楼层、街道、楼宇名称" />
                  <span className="field-icon" aria-hidden="true">!</span>
                </span>
              </label>
              <label className="field field-span-two">
                <span>地址2</span>
                <input type="text" placeholder="区域或补充地址，可选" />
              </label>
              <label className="field field-span-two">
                <span>地址3</span>
                <input type="text" placeholder="补充地址，可选" />
              </label>
              <label className="field">
                <span>联系电话 <em>*</em></span>
                <input type="text" placeholder="请输入联系电话" />
              </label>
            </div>

            {/* Vietnam wizard fields */}
            <div className={`drawer-form-grid two-cols country-tax-section${wizardCountry === '越南' ? ' active' : ''}`}>
              <label className="field">
                <span>税务登记号（MST） <em>*</em></span>
                <input type="text" placeholder="请输入税务登记号（MST）" />
              </label>
              <label className="field">
                <span>联系电话</span>
                <input type="text" placeholder="请输入联系电话" />
              </label>
              <label className="field field-span-two">
                <span>地址 <em>*</em></span>
                <input type="text" placeholder="请输入地址" />
              </label>
            </div>

            <div className="drawer-note">
              <span className="note-icon" aria-hidden="true">⚠</span>
              <span>税务合规信息未配置，无法开票。可先跳过保存，后续在企业详情中补充。</span>
            </div>

            <div className="drawer-actions">
              <button className="button ghost" type="button" onClick={() => setWizardStep(1)}>上一步</button>
              <button className="button ghost ghost-accent" type="button" onClick={closeWizard}>跳过并保存</button>
              <button className="button primary" type="button" onClick={closeWizard}>保存并启用开票</button>
            </div>
          </section>
        </div>
      </aside>
    </div>
  );
}
