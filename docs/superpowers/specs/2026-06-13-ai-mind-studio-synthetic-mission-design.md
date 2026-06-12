# AI Mind Studio Synthetic Economics Mission

## Purpose

Replace the VHLSS-branded Studio scenario with an explicitly fictional teaching dataset. The simulator should teach research control, reproducibility, and verification without implying that any displayed sample size, file, coefficient, or citation comes from a real survey analysis.

## Mission

- Dataset: `Synthetic Labor Survey 2025` (`SLS-25`).
- Disclosure: always identify it as a fictional teaching dataset.
- Question: estimate the wage difference associated with holding a vocational certificate.
- Claim boundary: associational, not causal.
- Sample: 12,000 simulated wage workers aged 18-64 with positive hourly wages.
- Files: `workers.csv`, `people.csv`, and `households.csv`.

## Simulation Mechanics

Keep the existing five control decisions:

1. Write a task contract or give a one-line prompt.
2. Scope permissions or approve everything.
3. Halt a 19.5% merge or continue with the selected sample.
4. Verify weights, clustering, and sample counts or trust the formatted table.
5. Trace citations or accept an invented reference.

The merge failure is caused by leading zeros being lost from `household_id`. A controlled run restores all 12,000 observations. All displayed estimates are simulated and internally consistent, with the controlled estimate equal to `0.041` and standard error `0.029`.

## Acceptance Checks

- No VHLSS-specific names, files, weights, or sample counts remain in Studio.
- Vietnamese and English views both disclose that the dataset is fictional.
- The complete five-decision run reaches a consistent flight record.
- The controlled-run timestamp matches a perfect user run.
- Desktop and mobile layouts render without console errors or horizontal overflow.
