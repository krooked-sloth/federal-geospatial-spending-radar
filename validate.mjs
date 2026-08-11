import fs from "node:fs";

const awards = JSON.parse(fs.readFileSync("data/awards.public.json", "utf8"));
const vehicles = JSON.parse(fs.readFileSync("data/vehicles.public.json", "utf8"));
const opportunities = JSON.parse(fs.readFileSync("data/opportunities.public.json", "utf8"));
const profile = JSON.parse(fs.readFileSync("data/profile.public.json", "utf8"));
const publicFiles = [
  "data/awards.public.json",
  "data/awards.public.csv",
  "data/vehicles.public.json",
  "data/vehicles.public.csv",
  "data/opportunities.public.json",
  "data/profile.public.json",
  "award-record.schema.json",
  "SCHEMA.md",
  "METHODOLOGY.md",
  "DATA_QUALITY.md",
  "refresh-public.mjs"
];

const errors = [];
const required = [
  "award_id",
  "generated_award_id",
  "recipient_name",
  "awarding_agency",
  "awarding_office",
  "obligated_amount",
  "period_start",
  "current_period_end",
  "source_url",
  "source_api_url"
];

if (awards.record_count !== awards.records.length) errors.push("award record_count mismatch");
if (vehicles.record_count !== vehicles.records.length) errors.push("vehicle record_count mismatch");
if (opportunities.record_count !== opportunities.records.length) errors.push("opportunity record_count mismatch");
if (profile.award_count !== awards.records.length) errors.push("profile award_count mismatch");
if (profile.parent_order_count + profile.standalone_award_count !== awards.records.length) errors.push("profile parent/standalone mismatch");

const ids = new Set();
for (const row of awards.records) {
  for (const field of required) {
    if (row[field] === null || row[field] === undefined || row[field] === "") {
      errors.push(`${row.award_id ?? "unknown"}: missing ${field}`);
    }
  }
  if (ids.has(row.award_id)) errors.push(`duplicate award_id: ${row.award_id}`);
  ids.add(row.award_id);
  if (!row.source_url.startsWith("https://www.usaspending.gov/award/")) errors.push(`${row.award_id}: invalid source_url`);
  if (!row.source_api_url.startsWith("https://api.usaspending.gov/api/v2/awards/")) errors.push(`${row.award_id}: invalid source_api_url`);
  if (row.current_period_end < row.period_start) errors.push(`${row.award_id}: end before start`);
}

for (const row of opportunities.records) {
  if (!row.source_url.startsWith("https://sam.gov/")) errors.push(`${row.notice_id}: non-SAM source`);
}

const forbiddenPublicFields = [
  "fit_tag",
  "private_note",
  "relationship_inference",
  "recompete_monitor_window",
  "inference_confidence",
  "targeting",
  "Falconer-fit",
  "Falconer"
];
for (const file of publicFiles) {
  const contents = fs.readFileSync(file, "utf8");
  for (const token of forbiddenPublicFields) {
    if (contents.includes(token)) errors.push(`${file}: contains private token ${token}`);
  }
}

const csvLines = fs.readFileSync("data/awards.public.csv", "utf8").trimEnd().split("\n");
if (csvLines.length !== awards.records.length + 1) errors.push("award CSV row count mismatch");

if (errors.length) {
  console.error(JSON.stringify({ valid: false, errors }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  valid: true,
  awards: awards.records.length,
  vehicles: vehicles.records.length,
  opportunities: opportunities.records.length,
  unique_awards: ids.size
}, null, 2));
