import { useState, useEffect } from 'react';
import './IsvAuthorizationPage.css';

const AUTH_REQUESTS = [
  {
    authCode: 'AUTH-2026-00824',
    applicant: 'Alpha ISV Services',
    applicantEmail: 'alpha@isv.com',
    applicantLetter: 'A',
    letterClass: 'a',
    api: 'ERP Production API',
    apiId: 'API-ERP-PROD-001',
    enterprise: 'Vietnam Manufacturing Ltd.',
    enterpriseId: 'VN-MANU-001',
    time: '2026-05-20 10:24',
    status: 'pending',
    statusText: '待审核',
    note: 'Integration for real-time invoice synchronization.',
  },
  {
    authCode: 'AUTH-2026-00795',
    applicant: 'Global Tax Connector',
    applicantEmail: 'contact@gtc.com',
    applicantLetter: 'G',
    letterClass: 'g',
    api: 'POS Sandbox API',
    apiId: 'API-POS-SBX-002',
    enterprise: 'Masan Group',
    enterpriseId: 'MASAN-001',
    time: '2026-05-19 16:08',
    status: 'approved',
    statusText: '已通过',
    note: 'Approved after compliance review.',
  },
  {
    authCode: 'AUTH-2026-00642',
    applicant: 'Fintech Integration Co.',
    applicantEmail: 'service@fintech.com',
    applicantLetter: 'F',
    letterClass: 'f',
    api: 'Reporting Export API',
    apiId: 'API-REP-EXP-003',
    enterprise: 'Demo Trading Sdn. Bhd.',
    enterpriseId: 'DEMO-TRD-001',
    time: '2026-05-18 09:40',
    status: 'rejected',
    statusText: '已拒绝',
    note: 'Insufficient documentation.',
  },
];

function statusLabel(status) {
  switch (status) {
    case 'approved':
      return '已通过 (Approved)';
    case 'rejected':
      return '已拒绝 (Rejected)';
    default:
      return '待审核 (Pending Review)';
  }
}

const ICONS = {
  search: (
    <svg className="icon" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  ),
  chevronDown: (
    <svg className="icon-sm" style={{ marginLeft: 'auto' }} viewBox="0 0 24 24">
      <path d="m6 9 6 6 6-6" />
    </svg>
  ),
  calendar: (
    <svg className="cal icon" viewBox="0 0 24 24">
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M3 10h18" />
    </svg>
  ),
  refresh: (
    <svg className="icon" viewBox="0 0 24 24">
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  ),
  close: (
    <svg className="icon" viewBox="0 0 24 24">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
};

export default function IsvAuthorizationPage() {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewMode, setReviewMode] = useState('review'); // 'review' | 'view'
  const [reviewData, setReviewData] = useState(null);

  /* Close on Escape key */
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && reviewOpen) {
        closeReview();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [reviewOpen]);

  function openReview(mode, item) {
    setReviewData(item);
    setReviewMode(mode);
    setReviewOpen(true);
    document.body.style.overflow = 'hidden';
  }

  function closeReview() {
    setReviewOpen(false);
    setReviewData(null);
    document.body.style.overflow = '';
  }

  function handleMaskClick(e) {
    if (e.target.classList.contains('review-mask')) {
      closeReview();
    }
  }

  return (
    <div className="isv-content">
      {/* ---- Title ---- */}
      <h1>ISV 授权审批</h1>
      <p className="subtitle">
        管理 ISV 提交的授权申请，查看授权状态、受邀企业及 API 应用信息。
      </p>

      {/* ---- Filter card ---- */}
      <section className="filter-card">
        <div className="field">
          <label>搜索</label>
          <div className="control search-control">
            {ICONS.search}
            <span>搜索申请企业、受邀企业或 API 应用名称/ID</span>
          </div>
        </div>
        <div className="field">
          <label>状态</label>
          <div className="control select-control">
            <span>全部</span>
            {ICONS.chevronDown}
          </div>
        </div>
        <div className="field">
          <label>创建时间范围</label>
          <div className="control date-control">
            <span>年/月/日</span>
            <span>~</span>
            <span>年/月/日</span>
            {ICONS.calendar}
          </div>
        </div>
        <div className="filter-buttons">
          <div className="btn primary">
            {ICONS.search}
            <span>查询</span>
          </div>
          <div className="btn ghost">
            {ICONS.refresh}
            <span>重置</span>
          </div>
        </div>
      </section>

      {/* ---- Table ---- */}
      <section className="table-card">
        <table>
          <colgroup>
            <col style={{ width: '21%' }} />
            <col style={{ width: '23%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '19%' }} />
            <col style={{ width: '10%' }} />
            <col style={{ width: '5%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>申请企业</th>
              <th>API 应用</th>
              <th>受邀企业</th>
              <th>
                创建时间{' '}
                <svg
                  className="icon-sm"
                  style={{ display: 'inline-block', verticalAlign: -5, marginLeft: 4 }}
                  viewBox="0 0 24 24"
                >
                  <path d="m8 15 4 4 4-4" />
                  <path d="m16 9-4-4-4 4" />
                </svg>
              </th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {AUTH_REQUESTS.map((item) => (
              <tr key={item.authCode}>
                <td>
                  <div className="company-cell">
                    <div className={`letter ${item.letterClass}`}>
                      {item.applicantLetter}
                    </div>
                    <div>
                      <span className="main-line">{item.applicant}</span>
                      <span className="sub-line">{item.applicantEmail}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="main-line">{item.api}</span>
                  <span className="sub-line">{item.apiId}</span>
                </td>
                <td>
                  <span className="main-line">{item.enterprise}</span>
                  <span className="sub-line">{item.enterpriseId}</span>
                </td>
                <td>{item.time}</td>
                <td>
                  <span className={`status ${item.status}`}>{item.statusText}</span>
                </td>
                <td>
                  <div className="action">
                    <button
                      className={`action-button ${item.status === 'pending' ? 'review' : 'view'}`}
                      type="button"
                      onClick={() =>
                        openReview(
                          item.status === 'pending' ? 'review' : 'view',
                          item
                        )
                      }
                    >
                      {item.status === 'pending' ? '审核' : '查看'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination">
          <span>共 1,340 条记录，当前显示第 1 ~ 3 条</span>
          <div className="pager">
            <div className="page-size">
              10 条/页
              <svg className="icon-sm" viewBox="0 0 24 24">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
            <div className="page-btn disabled">
              <svg className="icon-sm" viewBox="0 0 24 24">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </div>
            <div className="page-btn active">1</div>
            <div className="page-btn">2</div>
            <div className="page-btn">3</div>
            <div className="dots">...</div>
            <div className="page-btn">45</div>
            <div className="page-btn">
              <svg className="icon-sm" viewBox="0 0 24 24">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Footer ---- */}
      <footer className="footer">
        <span>&copy; 2026 Baiwang. All rights reserved.</span>
        <div className="footer-links">
          <span>文档中心</span>
          <span>隐私政策</span>
          <span>
            API 状态 <i className="api-dot" />
          </span>
        </div>
      </footer>

      {/* ---- Review drawer ---- */}
      <div
        className={`review-layer${reviewOpen ? ' open' : ''}${reviewMode === 'view' ? ' view-mode' : ''}`}
        aria-hidden={!reviewOpen}
      >
        <div
          className="review-mask"
          data-close-review
          onClick={handleMaskClick}
        />
        <aside
          className="review-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reviewDialogTitle"
        >
          {/* Header */}
          <header className="review-head">
            <div>
              <div className="review-title" id="reviewDialogTitle">
                {reviewMode === 'review' ? '授权申请审核' : '授权详情'}
              </div>
              <div className="review-code" id="reviewAuthCode">
                {reviewData?.authCode || ''}
              </div>
            </div>
            <button
              className="review-close"
              type="button"
              aria-label="关闭审核弹层"
              data-close-review
              onClick={closeReview}
            >
              {ICONS.close}
            </button>
          </header>

          {/* Body */}
          <div className="review-body">
            {/* Status banner */}
            <section className="status-banner">
              <div className="info-dot">i</div>
              <div>
                <strong>当前状态</strong>
                <span id="reviewStatusText">
                  {reviewData ? statusLabel(reviewData.status) : ''}
                </span>
              </div>
            </section>

            {/* Entity details */}
            <section className="review-section">
              <h2>实体详情</h2>
              <div className="detail-box">
                <div className="detail-row">
                  <span className="detail-label">申请企业</span>
                  <span className="detail-value" id="reviewApplicant">
                    {reviewData?.applicant || ''}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">API应用</span>
                  <span className="detail-value api-value" id="reviewApi">
                    <i className="api-diamond" />
                    {reviewData?.api || ''}{' '}
                    <small style={{ color: '#667896', fontSize: 14 }}>
                      {reviewData?.apiId || ''}
                    </small>
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">受邀企业</span>
                  <span className="detail-value" id="reviewEnterprise">
                    {reviewData?.enterprise || ''}{' '}
                    <small style={{ color: '#667896', fontSize: 14 }}>
                      {reviewData?.enterpriseId || ''}
                    </small>
                  </span>
                </div>
              </div>
            </section>

            {/* Metadata */}
            <section className="review-section">
              <h2>申请元数据</h2>
              <div className="meta-box">
                <span className="label">创建时间</span>
                <span id="reviewTime">{reviewData?.time || ''}</span>
              </div>
            </section>

            {/* Notes */}
            <section className="review-section">
              <h2>申请说明</h2>
              <div className="note-box" id="reviewNote">
                &ldquo;{reviewData?.note || ''}&rdquo;
              </div>
            </section>

            {/* Attachments */}
            <section className="review-section">
              <h2>附件信息</h2>
              <div className="attachment-list">
                <div className="attachment-row">
                  <svg className="icon-sm" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <path d="M8 13h2" />
                    <path d="M8 17h8" />
                    <path d="M12 13h4" />
                  </svg>
                  <span>营业执照.pdf</span>
                  <div className="links">
                    <span>下载</span>
                  </div>
                </div>
                <div className="attachment-row">
                  <svg className="icon-sm" viewBox="0 0 24 24">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <circle cx="8.5" cy="10.5" r="1.5" />
                    <path d="m21 15-5-5L5 19" />
                  </svg>
                  <span>授权委托书.jpg</span>
                  <div className="links">
                    <span>预览</span>
                    <span>下载</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Footer actions (hidden in view-mode via CSS) */}
          <footer className="review-footer">
            <button className="reject-btn" type="button">
              <svg className="icon-sm" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="m4.9 4.9 14.2 14.2" />
              </svg>
              <span>拒绝</span>
            </button>
            <button className="approve-btn" type="button">
              <svg className="icon-sm" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>通过审核</span>
            </button>
          </footer>
        </aside>
      </div>
    </div>
  );
}
