import { chromium } from "playwright";
import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";

const outDir = new URL("./", import.meta.url);
const filePath = (relativePath) => fileURLToPath(new URL(relativePath, outDir));
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const log = [];
const errors = [];

page.on("console", (msg) => {
  if (msg.type() === "error") {
    errors.push(`console:${msg.text()}`);
  }
});

page.on("pageerror", (err) => {
  errors.push(`pageerror:${err.message}`);
});

await page.goto("http://127.0.0.1:4174/", { waitUntil: "networkidle" });
log.push(`title:${await page.title()}`);
await page.screenshot({ path: filePath("./01-home.png"), fullPage: true });

await page.fill('input[placeholder*="Search customers"]', "Acme");
await page.screenshot({ path: filePath("./02-search.png"), fullPage: true });
const rowCountAfterSearch = await page.locator(".table-row.table-six").count();
log.push(`search_rows:${rowCountAfterSearch}`);
await page.fill('input[placeholder*="Search customers"]', "");

await page.getByRole("button", { name: "New customer" }).first().click();
await page.waitForSelector("h2");
await page.fill('input[name="title"]', "Gamma Test Customer");
await page.fill('input[name="legal"]', "Gamma Test Customer Ltd.");
await page.fill('input[name="code"]', "GAMMA-001");
await page.fill('input[name="trade"]', "Gamma");
await page.click('button:has-text("Establishments")');
await page.fill('input[name="establishment"]', "Shanghai Branch");
await page.fill('input[name="countriesText"]', "VN, MY");
await page.fill('input[name="incorporation"]', "Singapore");
await page.fill('input[name="relationships"]', "1 active");
await page.click('button:has-text("Delivery")');
await page.fill('input[name="delivery"]', "gamma@example.com");
await page.fill('input[name="primaryContact"]', "Jade Lin");
await page.fill('input[name="taxContact"]', "tax@gamma.example");
await page.fill('input[name="opsContact"]', "ops@gamma.example");
await page.fill('input[name="phone"]', "+65 6000 1000");
await page.screenshot({ path: filePath("./03-create-filled.png"), fullPage: true });
await page.getByRole("button", { name: "Save customer" }).click();
await page.waitForSelector(".detail-title");
log.push(`detail_title_after_create:${await page.locator(".detail-title").textContent()}`);
await page.screenshot({ path: filePath("./04-created-detail.png"), fullPage: true });

await page.getByRole("button", { name: "Edit customer" }).click();
await page.fill('input[name="title"]', "Gamma Edited Customer");
await page.click('button:has-text("Delivery")');
await page.fill('input[name="phone"]', "+65 6000 2000");
await page.getByRole("button", { name: "Save customer" }).click();
await page.waitForSelector(".toast");
log.push(`detail_title_after_edit:${await page.locator(".detail-title").textContent()}`);
await page.screenshot({ path: filePath("./05-edited-detail.png"), fullPage: true });

await page.getByRole("link", { name: "Customers" }).click();
await page.fill('input[placeholder*="Search customers"]', "Gamma Edited");
const gammaVisible = await page.locator(".table-row.table-six .primary-cell").first().textContent();
log.push(`search_gamma:${gammaVisible}`);
await page.screenshot({ path: filePath("./06-search-edited.png"), fullPage: true });

await page.locator(".table-row.table-six").first().click();
await page.getByRole("button", { name: "Delete" }).click();
await page.getByRole("button", { name: "Delete customer" }).click();
await page.waitForSelector(".toast");
await page.getByRole("link", { name: "Customers" }).click();
await page.fill('input[placeholder*="Search customers"]', "Gamma Edited");
const remainingRows = await page.locator(".table-row.table-six").count();
log.push(`rows_after_delete_search:${remainingRows}`);
await page.screenshot({ path: filePath("./07-after-delete.png"), fullPage: true });

await browser.close();
await fs.writeFile(filePath("./qa-log.json"), JSON.stringify({ log, errors }, null, 2));
console.log(JSON.stringify({ log, errors }, null, 2));
