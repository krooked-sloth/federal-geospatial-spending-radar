# Methodology

## Objective

Identify source-backed federal award patterns related to:

- range operations and range-control support
- RFMSS, RMTK, weapons-danger-zone, and surface-danger-zone work
- installation GIS and geospatial data maintenance
- utility and infrastructure GIS field collection
- geospatial production, quality assurance, imagery, and LiDAR
- real-property and facility-asset inventory
- field-to-system data reconciliation

## Source rules

Only official public sources were accepted:

1. USAspending API award search and award-detail endpoints
2. Human-readable USAspending award pages
3. SAM.gov notices

No broker database, reseller list, scraped contact list, or commercial market estimate was used.

## Search coverage

The initial API pull covered federal contract award activity from October 1, 2021 through August 11, 2026. Eighteen text queries were used, including `RFMSS`, `RMTK`, `surface danger zone`, `range operations`, `range safety`, `range management`, `installation geospatial`, `IGI&S`, `geospatial data`, `asset inventory`, `LiDAR`, `aerial imagery`, `remote sensing`, and `field data collection`.

The API returned 2,163 query matches representing 2,114 unique awards. Search results were manually screened because phrase matching produces false positives and because contract descriptions vary widely.

## Enrichment

Each selected award was re-fetched from:

`GET https://api.usaspending.gov/api/v2/awards/{generated_award_id}/`

The final public row preserves official award facts including the prime recipient, agency and office, reported amounts, period of performance, parent award, NAICS, PSC, competition fields, and official source URLs.

## Amount definitions

- `obligated_amount`: award-level obligations reported by USAspending
- `current_and_exercised_options`: USAspending's base-and-exercised-options value
- `potential_total_value`: USAspending's base-and-all-options value

These values are not interchangeable. Vehicle ceilings and potential values must never be added together and presented as addressable market size.

## Time and relationship rules

Public data contains reported dates and parent relationships only. It does not predict a recompete.

The private analyst layer assigns a low-confidence monitoring window based solely on the reported current period end date. That layer also distinguishes the factual prime/parent relationship from the unverified possibility of teaming. Neither private field belongs in a public release.

## Selection bias

The sample intentionally emphasizes recurring, clearly described award patterns rather than attempting a census. It therefore cannot support claims about total federal market share, average award size, or the overall growth rate of geospatial procurement.
