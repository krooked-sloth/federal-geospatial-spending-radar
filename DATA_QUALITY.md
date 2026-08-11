# Data Quality Check

Checked August 11, 2026.

## Selected award file

- 45 records
- 45 unique award IDs
- 35 unique recipients
- 28 awards with a reported current end date on or after the as-of date
- 36 task/order records with a reported parent award
- 9 stand-alone awards without a parent vehicle
- 0 missing award IDs
- 0 missing recipient names or UEIs
- 0 missing awarding offices
- 0 missing start or current-end dates
- 0 missing NAICS or PSC codes
- 0 zero or negative obligation values

## Expected sparse fields

- 30 award records have no reported set-aside description
- 10 award records have no reported number of offers
- 9 award records have no parent award because they are stand-alone contracts

These blanks are preserved as `null`. They are not imputed.

## Validation performed

- JSON syntax validation
- award-ID uniqueness
- required-field presence
- start/end date ordering
- official USAspending/SAM source-domain checks
- CSV row-count reconciliation
- private-field exclusion from public candidate files
- live HTTP 200 checks for all 55 USAspending API detail records and all three SAM.gov notice pages

## Remaining accuracy limits

This validation proves structural consistency and source availability. It does not independently audit the underlying federal submissions. USAspending descriptions, competition fields, amounts, and dates remain agency-reported data.

