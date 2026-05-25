import './DashboardPage.css';

const KPI_CARDS = [
  { icon: 'blue', label: '覆盖国家数', value: '14', trend: 'positive', trendVal: '↑ 2', trendLabel: '比上月' },
  { icon: 'green', label: '已接入公司数', value: '1,248', trend: 'positive', trendVal: '↑ 18', trendLabel: '比上月' },
  { icon: 'sky', label: '今日开票量', value: '82,401', trend: 'positive', trendVal: '↑ 12.5%', trendLabel: '比昨日' },
  { icon: 'mint', label: '提交成功率', value: '99.8%', trend: 'positive', trendVal: '↑ 0.6%', trendLabel: '比上月' },
  { icon: 'amber', label: '异常发票数', value: '142', trend: 'warning', trendVal: '↑ 8', trendLabel: '比上月' },
];

const COUNTRIES = [
  { flag: 'vn', name: '越南', state: 'ok', stateLabel: '合规正常', rate: '99.9%' },
  { flag: 'sg', name: '新加坡', state: 'ok', stateLabel: '合规正常', rate: '100%' },
  { flag: 'my', name: '马来西亚', state: 'warn', stateLabel: '需处理', rate: '96.1%' },
  { flag: 'de', name: '德国', state: 'run', stateLabel: '运营中', rate: '99.2%' },
];

const ALERTS = [
  { icon: 'critical', flag: 'vn', country: '越南', text: 'XML签名验证失败', severity: 'severe', severityLabel: '严重', time: '2 分钟前' },
  { icon: 'warning', flag: 'my', country: '马来西亚', text: '纳税人验证失败', severity: 'high', severityLabel: '高', time: '15 分钟前' },
  { icon: 'warning', flag: 'sg', country: '新加坡', text: '发票格式不符合规范', severity: 'high', severityLabel: '高', time: '30 分钟前' },
  { icon: 'warning', flag: 'th', country: '泰国', text: '税局响应超时', severity: 'medium', severityLabel: '中', time: '1 小时前' },
  { icon: 'info', flag: 'de', country: '德国', text: '税率配置即将更新', severity: 'low', severityLabel: '低', time: '2 小时前' },
];

const FLOW_STEPS = [
  { icon: 'blue', name: '草稿', count: '12,348', pct: '15.0%', bar: 'green' },
  { icon: 'green', name: '已提交', count: '32,146', pct: '39.2%', bar: 'green' },
  { icon: 'blue', name: '处理中', count: '8,732', pct: '10.6%', bar: 'green' },
  { icon: 'mint', name: '已成功', count: '27,856', pct: '33.9%', bar: 'green' },
  { icon: 'red', name: '已拒绝', count: '1,319', pct: '1.6%', bar: 'red' },
];

const ACTIVITIES = [
  { icon: 'green', title: '越南税局已成功接收发票 INV-20240528-001', desc: '越南子公司 · 2 分钟前' },
  { icon: 'blue', title: 'API Key 已创建：Production Key', desc: 'System Admin · 15 分钟前' },
  { icon: 'orange', title: '更新马来西亚税务队员验证规则', desc: 'Tax Admin · 30 分钟前' },
  { icon: 'red', title: '发票 INV-20240528-156 被拒绝', desc: '马来西亚子公司 · 1 小时前' },
  { icon: 'blue', title: '用户权限已更新：John Doe', desc: 'Admin User · 2 小时前' },
];

const KPI_ICONS = {
  blue: <svg viewBox="0 0 24 24"><path d="M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17Z" /><path d="M3.7 12h16.6M12 4c2 2.1 3.2 5 3.2 8s-1.2 5.9-3.2 8c-2-2.1-3.2-5-3.2-8S10 6.1 12 4Z" /></svg>,
  green: <svg viewBox="0 0 24 24"><path d="M5.5 4.5h13v15h-13Z" /><path d="M9 8.2h6M9 12h6M9 15.8h6" /></svg>,
  sky: <svg viewBox="0 0 24 24"><path d="M6 4.5h12v15H6Z" /><path d="M9 8h6M9 12h6M9 16h4" /></svg>,
  mint: <svg viewBox="0 0 24 24"><path d="M12 2.8 5.3 5.8v5.1c0 4 2.8 7.7 6.7 8.7 3.9-1 6.7-4.7 6.7-8.7V5.8Z" /><path d="m8.8 11.8 2 2 4.5-4.6" /></svg>,
  amber: <svg viewBox="0 0 24 24"><path d="M12 4.2 20 18H4Z" /><path d="M12 9v4.8M12 17h0" /></svg>,
};

export default function DashboardPage() {
  return (
    <div className="dashboard-content">
      <section className="page-title">
        <h1>全球合规看板</h1>
        <p>监控全部国家和企业的电子发票合规状态</p>
      </section>

      <section className="kpi-row">
        {KPI_CARDS.map((card, i) => (
          <article className="kpi-card" key={i}>
            <div className="kpi-head">
              <span className={`metric-icon ${card.icon}`}>{KPI_ICONS[card.icon]}</span>
              <span className="metric-label">{card.label}</span>
            </div>
            <div className="metric-value">{card.value}</div>
            <div className={`metric-trend ${card.trend}`}>
              <strong>{card.trendVal}</strong><span>{card.trendLabel}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="content-grid">
        <article className="panel world-panel">
          <div className="panel-head">
            <h2>全球税局运营状态</h2>
            <span className="info-dot">i</span>
          </div>
          <div className="legend-row">
            <span><i className="dot green"></i>合规正常</span>
            <span><i className="dot orange"></i>需要处理</span>
            <span><i className="dot red"></i>行动必要</span>
            <span><i className="dot gray"></i>维护中</span>
            <span><i className="dot blue"></i>运营中</span>
          </div>
          <div className="world-body">
            <div className="world-map">
              <div className="map-shape"></div>
              <span className="map-marker marker-blue"></span>
              <span className="map-marker marker-green"></span>
              <span className="map-marker marker-orange"></span>
              <span className="map-marker marker-red"></span>
            </div>
            <div className="country-list">
              {COUNTRIES.map((c, i) => (
                <div className="country-item" key={i}>
                  <span className={`flag ${c.flag}`}></span>
                  <span className="country-name">{c.name}</span>
                  <span className={`state-pill ${c.state}`}>{c.stateLabel}</span>
                  <strong>{c.rate}</strong>
                </div>
              ))}
              <a className="link-more" href="#">查看全部国家</a>
            </div>
          </div>
        </article>

        <article className="panel alert-panel">
          <div className="panel-head split">
            <h2>合规预警中心</h2>
            <a href="#">查看全部</a>
          </div>
          <div className="alert-list">
            {ALERTS.map((a, i) => (
              <div className="alert-item" key={i}>
                <span className={`alert-icon ${a.icon}`}></span>
                <span className={`flag ${a.flag}`}></span>
                <span className="alert-country">{a.country}</span>
                <span className="alert-text">{a.text}</span>
                <span className={`severity ${a.severity}`}>{a.severityLabel}</span>
                <span className="alert-time">{a.time}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel flow-panel">
          <div className="panel-head">
            <h2>发票处理流转总览</h2>
          </div>
          <div className="flow-row">
            {FLOW_STEPS.map((step, i) => (
              <div key={i} style={{ display: 'contents' }}>
                {i > 0 && <span className="step-arrow">&rarr;</span>}
                <div className="flow-step">
                  <span className={`step-icon ${step.icon}`}></span>
                  <span className="step-name">{step.name}</span>
                  <strong>{step.count}</strong>
                  <small>{step.pct}</small>
                  <i className={`flow-bar ${step.bar}`}></i>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel trend-panel">
          <div className="panel-head split">
            <h2>发票趋势（按金额）</h2>
            <button className="month-switch" type="button">本月</button>
          </div>
          <div className="chart-wrap">
            <div className="chart-axis-left">
              <span>金额 (USD)</span>
              <span>150K</span>
              <span>100K</span>
              <span>50K</span>
              <span>0</span>
            </div>
            <div className="chart-area">
              <svg viewBox="0 0 460 205" preserveAspectRatio="none">
                <path d="M0 28h460M0 86h460M0 144h460M0 202h460" className="grid-line" />
                <path d="M18 118 35 121 52 98 69 86 86 92 103 116 120 128 137 109 154 124 171 118 188 110 205 95 222 104 239 117 256 91 273 102 290 76 307 61 324 18 341 8 358 39 375 28 392 46 409 53 426 74 443 75 460 68" className="trend-line" />
              </svg>
              <div className="chart-labels">
                <span>05-01</span><span>05-07</span><span>05-14</span><span>05-21</span><span>05-28</span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="panel activity-panel">
        <div className="panel-head split">
          <h2>最近活动</h2>
          <a href="#">查看全部</a>
        </div>
        <div className="activity-row">
          {ACTIVITIES.map((a, i) => (
            <div className="activity-item" key={i}>
              <span className={`activity-icon ${a.icon}`}></span>
              <div>
                <strong>{a.title}</strong>
                <span>{a.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
