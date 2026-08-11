import fs from "node:fs";

const AS_OF = new Date().toISOString().slice(0, 10);
const RETRIEVED_AT = new Date().toISOString();
const awardIds = JSON.parse(fs.readFileSync("data/awards.public.json", "utf8")).records.map(row => row.generated_award_id);
const vehicleIds = JSON.parse(fs.readFileSync("data/vehicles.public.json", "utf8")).records.map(row => row.generated_award_id);

function value(item) {
  return item === null || item === undefined ? null : String(item);
}

async function getDetail(generatedId) {
  const url = `https://api.usaspending.gov/api/v2/awards/${encodeURIComponent(generatedId)}/`;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const response = await fetch(url);
    if (response.ok) return response.json();
    if (attempt === 4) throw new Error(`${generatedId}: ${response.status}`);
    await new Promise(resolve => setTimeout(resolve, attempt * 500));
  }
}

function normalize(detail) {
  const contract = detail.latest_transaction_contract_data ?? {};
  const recipient = detail.recipient ?? {};
  const pop = detail.period_of_performance ?? {};
  const awarding = detail.awarding_agency ?? {};
  const funding = detail.funding_agency ?? {};
  const parent = detail.parent_award ?? {};
  const naics = detail.naics_hierarchy?.base_code ?? {};
  const psc = detail.psc_hierarchy?.base_code ?? {};
  const place = detail.place_of_performance ?? {};
  return {
    award_id: value(detail.piid),
    generated_award_id: value(detail.generated_unique_award_id),
    award_type: value(detail.type_description),
    description: value(detail.description),
    recipient_name: value(recipient.recipient_name),
    recipient_uei: value(recipient.recipient_uei),
    awarding_agency: value(awarding.toptier_agency?.name),
    awarding_subagency: value(awarding.subtier_agency?.name),
    awarding_office: value(awarding.office_agency_name),
    funding_agency: value(funding.toptier_agency?.name),
    funding_subagency: value(funding.subtier_agency?.name),
    funding_office: value(funding.office_agency_name),
    obligated_amount: detail.total_obligation ?? null,
    current_and_exercised_options: detail.base_exercised_options ?? null,
    potential_total_value: detail.base_and_all_options ?? null,
    date_signed: value(detail.date_signed),
    period_start: value(pop.start_date),
    current_period_end: value(pop.end_date),
    potential_period_end: value(pop.potential_end_date)?.slice(0, 10) ?? null,
    record_last_modified: value(pop.last_modified_date),
    parent_award_id: value(parent.piid),
    parent_generated_award_id: value(parent.generated_unique_award_id),
    parent_vehicle_type: value(parent.type_of_idc_description ?? parent.idv_type_description),
    parent_vehicle_award_structure: value(parent.multiple_or_single_aw_desc),
    naics_code: value(contract.naics ?? naics.code),
    naics_description: value(contract.naics_description ?? naics.description),
    psc_code: value(contract.product_or_service_code ?? psc.code),
    psc_description: value(contract.product_or_service_description ?? psc.description),
    set_aside: value(contract.type_set_aside_description),
    competition: value(contract.extent_competed_description),
    offers_received: value(contract.number_of_offers_received),
    pricing_type: value(contract.type_of_contract_pricing_description),
    place_of_performance_state: value(place.state_name),
    place_of_performance_city: value(place.city_name),
    source_url: `https://www.usaspending.gov/award/${encodeURIComponent(detail.generated_unique_award_id)}/`,
    source_api_url: `https://api.usaspending.gov/api/v2/awards/${encodeURIComponent(detail.generated_unique_award_id)}/`,
    retrieved_at: RETRIEVED_AT
  };
}

function csv(rows) {
  const columns = Object.keys(rows[0]);
  const escape = item => {
    if (item === null || item === undefined) return "";
    const string = String(item);
    return /[",\n\r]/.test(string) ? `"${string.replaceAll('"', '""')}"` : string;
  };
  return [columns.join(","), ...rows.map(row => columns.map(column => escape(row[column])).join(","))].join("\n") + "\n";
}

function grouped(rows, field) {
  const groups = new Map();
  for (const row of rows) {
    const key = row[field] ?? "Unknown";
    const item = groups.get(key) ?? { value: key, award_count: 0, reported_obligations: 0 };
    item.award_count++;
    item.reported_obligations += row.obligated_amount ?? 0;
    groups.set(key, item);
  }
  return [...groups.values()].sort((a, b) => b.reported_obligations - a.reported_obligations || a.value.localeCompare(b.value));
}

const awards = (await Promise.all(awardIds.map(getDetail))).map(normalize).sort((a, b) => a.current_period_end.localeCompare(b.current_period_end) || a.award_id.localeCompare(b.award_id));
const vehicles = (await Promise.all(vehicleIds.map(getDetail))).map(detail => {
  const row = normalize(detail);
  return {
    vehicle_award_id: row.award_id,
    generated_award_id: row.generated_award_id,
    recipient_name: row.recipient_name,
    recipient_uei: row.recipient_uei,
    description: row.description,
    awarding_agency: row.awarding_agency,
    awarding_subagency: row.awarding_subagency,
    awarding_office: row.awarding_office,
    obligated_amount: row.obligated_amount,
    potential_total_value: row.potential_total_value,
    period_start: row.period_start,
    current_period_end: row.current_period_end,
    naics_code: row.naics_code,
    naics_description: row.naics_description,
    psc_code: row.psc_code,
    psc_description: row.psc_description,
    set_aside: row.set_aside,
    competition: row.competition,
    source_url: row.source_url,
    source_api_url: row.source_api_url,
    retrieved_at: row.retrieved_at,
    value_caveat: "Potential total value is the value reported for this IDV record. It may be a ceiling, may be shared across related awards, and is not the same as obligated spending."
  };
});

fs.writeFileSync("data/awards.public.json", JSON.stringify({
  title: "Selected Federal Geospatial, Range, and Asset-Data Awards",
  description: "Official award facts retrieved from the USAspending API. Selection is illustrative and not a complete market census.",
  as_of: AS_OF,
  retrieved_at: RETRIEVED_AT,
  source: "https://api.usaspending.gov/",
  methodology: "Each row is an award-level USAspending record. Amounts are award-level reported values, not addressable market estimates. End dates are reported periods of performance and are not procurement forecasts.",
  record_count: awards.length,
  records: awards
}, null, 2) + "\n");
fs.writeFileSync("data/awards.public.csv", csv(awards));
fs.writeFileSync("data/vehicles.public.json", JSON.stringify({
  title: "Selected Parent Contract Vehicles",
  description: "Official USAspending facts for parent vehicles referenced by the selected award records.",
  as_of: AS_OF,
  retrieved_at: RETRIEVED_AT,
  record_count: vehicles.length,
  records: vehicles
}, null, 2) + "\n");
fs.writeFileSync("data/vehicles.public.csv", csv(vehicles));
fs.writeFileSync("data/profile.public.json", JSON.stringify({
  title: "Profile of the Selected Award Sample",
  as_of: AS_OF,
  caveat: "These aggregates describe the curated sample only. They are not federal market totals or addressable-market estimates.",
  award_count: awards.length,
  unique_recipient_count: new Set(awards.map(row => row.recipient_uei ?? row.recipient_name)).size,
  parent_order_count: awards.filter(row => row.parent_award_id).length,
  standalone_award_count: awards.filter(row => !row.parent_award_id).length,
  active_on_as_of_date: awards.filter(row => row.current_period_end >= AS_OF).length,
  reported_obligations_in_sample: awards.reduce((sum, row) => sum + (row.obligated_amount ?? 0), 0),
  period_start_min: awards.map(row => row.period_start).sort()[0],
  period_end_max: awards.map(row => row.current_period_end).sort().at(-1),
  by_awarding_agency: grouped(awards, "awarding_agency"),
  by_recipient: grouped(awards, "recipient_name"),
  by_naics: grouped(awards, "naics_code"),
  by_award_type: grouped(awards, "award_type")
}, null, 2) + "\n");

console.log(JSON.stringify({ refreshed_at: RETRIEVED_AT, awards: awards.length, vehicles: vehicles.length }, null, 2));
