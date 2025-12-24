const fs = require('fs');
const path = require('path');

const reportPath = path.resolve(
  __dirname,
  '../reports/firefox/report.json'
);

if (!fs.existsSync(reportPath)) {
  console.error('❌ report.json not found:', reportPath);
  process.exit(1);
}

const report = JSON.parse(
  fs.readFileSync(reportPath, 'utf-8')
);

let passed = 0;
let failed = 0;
let skipped = 0;

report.forEach((feature) => {
  (feature.elements || []).forEach((scenario) => {
    const steps = scenario.steps || [];
    const statuses = steps.map((s) => s.result?.status).filter(Boolean);

    // Rule sederhana:
    // - kalau ada failed step => scenario failed
    // - kalau ada skipped/pending/undefined dan tidak ada failed => skipped
    // - selain itu => passed
    if (statuses.includes("failed")) failed++;
    else if (
      statuses.includes("skipped") ||
      statuses.includes("pending") ||
      statuses.includes("undefined")
    )
      skipped++;
    else passed++;
  });
});

const total = passed + failed + skipped;

const summary = {
  browser,
  total,
  passed,
  failed,
  skipped,
  generatedAt: new Date().toISOString(),
  reportJson: `reports/${browser}/report.json`,
  reportHtml: `reports/${browser}/report.html`,
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(summary, null, 2), "utf-8");

console.log("✅ Summary written:", outPath);
console.log(summary);
console.log(`Total: ${total}`);

console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);

// optional: export buat dipakai script lain
module.exports = { passed, failed };
