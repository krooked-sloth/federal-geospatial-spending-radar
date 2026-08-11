# Federal Geospatial Spending Radar

An official-source view of selected federal geospatial, range-support, installation GIS, and asset-data awards.

- [Open the public radar](https://krooked-sloth.github.io/federal-geospatial-spending-radar/)
- [Visit Falconer Operations](https://falconeroperations.com/)
- [Read the methodology](METHODOLOGY.md)

The radar uses USAspending award records and official SAM.gov notices. It is a curated research sample, not a federal market census, recompete prediction, or estimate of addressable revenue.

## Public files

- `data/awards.public.json`
- `data/awards.public.csv`
- `data/vehicles.public.json`
- `data/vehicles.public.csv`
- `data/opportunities.public.json`
- `data/profile.public.json`
- `SCHEMA.md`
- `award-record.schema.json`
- `METHODOLOGY.md`
- `DATA_QUALITY.md`
- `refresh-public.mjs`
- `index.html`, `styles.css`, and `app.js`

## Current contents

- 2,163 keyword-matched API rows retrieved across 18 query terms
- 2,114 unique award records in the raw research pull
- 45 manually reviewed award records in the publishable sample
- 10 parent contract vehicles enriched from official award detail records
- 3 official SAM.gov notices that explain recurring buying patterns
- 1 public sample profile with explicit non-market-size caveats

The 45-record set is intentionally curated. It is not a complete count of federal geospatial or range spending, and its dollar totals are not market-size estimates.

## Refresh

Refresh the published award IDs from the official USAspending detail endpoint:

```sh
node refresh-public.mjs
node validate.mjs
```

The scheduled workflow runs the same public-only refresh monthly and commits only source-record changes.

## Primary sources

- USAspending API: <https://api.usaspending.gov/>
- USAspending API endpoint documentation: <https://api.usaspending.gov/docs/endpoints>
- USAspending award pages: linked separately in every row
- SAM.gov contracting: <https://sam.gov/contracting>
- Official SAM.gov notices: linked separately in `data/opportunities.public.json`

## Important limits

- An award end date does not prove a recompete.
- An IDV potential value can be a ceiling and may be shared; it is not obligated spending.
- A prime recipient record does not prove that the company wants subcontractors.
- USAspending descriptions are often brief and can omit material scope.
- Keyword search is noisy. Broad terms such as `range support` and `LiDAR` require manual review.
- Task orders can continue beyond the ordering period shown for a parent vehicle.

## Confidentiality boundary

This repository contains no fit scoring, pursuit ranking, relationship hypotheses, private contacts, pricing, customer data, internal methods, or proprietary Range Operations and Range Master material.
