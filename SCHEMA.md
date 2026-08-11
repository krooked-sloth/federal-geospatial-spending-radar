# Proposed Public Schema

The public release contains official facts only. Targeting logic, scoring, relationship hypotheses, contacts, pricing, and private notes are excluded.

## Award record

| Field | Type | Meaning |
|---|---|---|
| `award_id` | string | Federal award identifier / PIID |
| `generated_award_id` | string | USAspending generated award identifier |
| `award_type` | string | USAspending award type description |
| `description` | string | Official award description |
| `recipient_name` | string | Reported prime recipient |
| `recipient_uei` | string/null | Reported recipient UEI |
| `awarding_agency` | string | Awarding top-tier agency |
| `awarding_subagency` | string | Awarding subagency |
| `awarding_office` | string | Awarding office |
| `funding_agency` | string | Funding top-tier agency |
| `funding_subagency` | string | Funding subagency |
| `funding_office` | string | Funding office |
| `obligated_amount` | number/null | Award-level obligations reported by USAspending |
| `current_and_exercised_options` | number/null | Base and exercised options value |
| `potential_total_value` | number/null | Base and all options value |
| `date_signed` | date/null | Award signed date |
| `period_start` | date/null | Performance start |
| `current_period_end` | date/null | Reported current end |
| `potential_period_end` | date/null | Reported potential end |
| `record_last_modified` | date/null | USAspending last-modified value |
| `parent_award_id` | string/null | Parent vehicle PIID |
| `parent_generated_award_id` | string/null | USAspending parent identifier |
| `parent_vehicle_type` | string/null | IDV type description |
| `parent_vehicle_award_structure` | string/null | Single/multiple award description |
| `naics_code` | string/null | Reported NAICS |
| `naics_description` | string/null | Reported NAICS description |
| `psc_code` | string/null | Reported PSC |
| `psc_description` | string/null | Reported PSC description |
| `set_aside` | string/null | Reported set-aside description |
| `competition` | string/null | Reported competition description |
| `offers_received` | string/null | Reported number of offers |
| `pricing_type` | string/null | Reported contract pricing type |
| `place_of_performance_state` | string/null | Reported state |
| `place_of_performance_city` | string/null | Reported city |
| `source_url` | URL | Human-readable USAspending award page |
| `source_api_url` | URL | USAspending detail endpoint |
| `retrieved_at` | datetime | Retrieval timestamp |
