import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const htmlPath = process.argv[2]
  ? path.resolve(repoRoot, process.argv[2])
  : path.join(repoRoot, "artifacts", "documentos", "seguridad-iso25010", "seguridad_iso25010_kinesys_explicado.html");
const pdfPath = process.argv[3]
  ? path.resolve(repoRoot, process.argv[3])
  : path.join(repoRoot, "artifacts", "documentos", "seguridad-iso25010", "seguridad_iso25010_kinesys_explicado.pdf");

const browser = await chromium.launch();
const page = await browser.newPage();

await page.goto(`file://${htmlPath.replace(/\\/g, "/")}`, { waitUntil: "networkidle" });
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
  margin: {
    top: "0",
    right: "0",
    bottom: "0",
    left: "0",
  },
});

await browser.close();
console.log(pdfPath);
