import { chromium } from "playwright";

const appUrl = process.env.APP_URL ?? "http://127.0.0.1:3000/#config";

const requiredText = [
  "国家 PROFILES",
  "Profiles",
  "越南 · VN",
  "对比",
  "提升为 ACTIVE",
  "保存草稿",
  "1 · 基本属性",
  "2 · 本地化配置",
  "3 · 字段元数据",
  "4 · 税制计税规则",
  "5 · 开票单据规则",
  "6 · 监管通道服务商",
  "7 · 运行时控制",
  "1-A",
  "国家身份",
  "1-B",
  "发布信息",
];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

try {
  await page.goto(appUrl, { waitUntil: "networkidle" });
  const text = await page.locator("body").innerText();
  const missing = requiredText.filter((item) => !text.includes(item));

  if (missing.length > 0) {
    throw new Error(`Missing expected country profile config text: ${missing.join(", ")}`);
  }

  await page.getByRole("button", { name: "保存草稿" }).waitFor();
  await page.getByText("国家代码 (ISO alpha-2)").waitFor();
  await page.getByText("国家编码").count().then((count) => {
    if (count !== 0) throw new Error("基础属性页签不应显示国家编码");
  });
  await page.getByText("地区代码").count().then((count) => {
    if (count !== 0) throw new Error("基础属性页签不应显示地区代码");
  });
  await page.getByText("购买方主体规则").count().then((count) => {
    if (count !== 0) throw new Error("不应显示购买方主体规则页签");
  });

  await page.getByRole("button", { name: "3 · 字段元数据" }).click();
  await page.getByText("发票头信息").waitFor();
  await page.getByText("销方信息").waitFor();
  await page.getByText("购方信息").waitFor();
  await page.getByText("商品明细").waitFor();
  await page.getByText("金额汇总信息").waitFor();
  await page.getByText("其他信息").waitFor();
  await page.getByText("字段英文标识").first().waitFor();
  await page.getByText("本地化名称").first().waitFor();
  await page.getByText("枚举值").first().waitFor();
  await page.getByText("invoiceForm").waitFor();
  await page.getByText("invoiceSeries").waitFor();
  await page.getByText("buyerFullName").waitFor();
  await page.getByText("filingStatus").waitFor();
  await page.getByText("越南发票序列号，通常由税局/企业开票配置确定。").waitFor();
  await page.getByText("越南购方全称。若发票用于报销，建议填写企业全称。").waitFor();
  await page.getByText("transactionUuid").count().then((count) => {
    if (count !== 0) throw new Error("字段元数据页签不应显示平台通用字段 transactionUuid");
  });

  await page.getByRole("button", { name: /马来西亚 · MY/ }).click();
  await page.getByRole("button", { name: "3 · 字段元数据" }).click();
  await page.getByText("sellerBRN").waitFor();
  await page.getByText("sellerSSTNo").waitFor();
  await page.getByText("buyerBRNNo").waitFor();
  await page.getByText("additionalDiscountAmount").waitFor();
  await page.getByText("马来西亚购方 BRN 公司注册号。buyerType=ENTERPRISE 时必填。").waitFor();
  await page.getByText("马来西亚税种代码，表示交易适用的税收类别").waitFor();
  await page.getByText("API 映射与校验").count().then((count) => {
    if (count !== 0) throw new Error("字段元数据页签不应显示 API 映射与校验");
  });

  await page.getByRole("button", { name: "4 · 税制计税规则" }).click();
  await page.getByText("税制基础").waitFor();
  await page.getByText("计算精度与允差").waitFor();
  await page.getByRole("button", { name: "6 · 监管通道服务商" }).click();
  await page.getByText("监管平台与通道").waitFor();
  await page.getByText("报文、API、回执与幂等").count().then((count) => {
    if (count !== 0) throw new Error("监管通道页签不应显示报文、API、回执与幂等分组");
  });

  await page.getByRole("button", { name: "7 · 运行时控制" }).click();
  await page.getByText("重试机制").waitFor();
  await page.getByText("状态机与补偿").count().then((count) => {
    if (count !== 0) throw new Error("运行时控制页签不应显示状态机与补偿分组");
  });

  const summaryCardCount = await page.locator(".profile-stats").count();
  if (summaryCardCount !== 0) {
    throw new Error(`Expected no tab summary cards, found ${summaryCardCount}`);
  }

  await page.screenshot({
    path: "qa-artifacts/country-profile-config-smoke.png",
    fullPage: true,
  });
} finally {
  await browser.close();
}
