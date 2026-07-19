# Wedding Budget Planner

Interactive wedding cost calculator for The Room on Main in downtown Dallas, TX
(April 30, 2027, 75–125 guests). Turns per-plate quotes into true all-in totals —
service charge, tax-on-gratuity, minimums, and BYOB math included.

```sh
npm install
npm run dev      # local dev server
npm run build    # static build in dist/ (shareable anywhere)
```

## Where the numbers live

All pricing is in **`src/config.js`**. Edit it as real quotes arrive; the UI and
math (`src/model.js`) never need to change.

## Assumption status

| Number | Status |
|---|---|
| Sales tax 8.25% | **Verified** for Dallas & Fort Worth proper, 2026 ([Avalara Dallas](https://www.avalara.com/us/en/taxrates/state-rates/texas/cities/dallas.html), [Avalara Fort Worth](https://www.avalara.com/taxrates/en/state-rates/texas/cities/fort-worth.html)). Re-check if the venue is in a special taxing district — the tax field in the UI is editable. |
| Gratuity 20% | **Assumption.** Venues typically charge 20–24%; the UI field is editable. Texas taxes mandatory service charges, so tax is computed on food + bar + gratuity. |
| Venue rental $6,495, plate rates, bar tiers | Replace in `src/config.js` as quotes are updated. |
| Vendor defaults (photography $4,000, coordinator $1,500, florals $3,800, DJ $1,400, cake $650) | 2026 DFW researched range midpoints; every field is editable in the UI. |
| BYOB alcohol | Defaults to a flat $2,000, editable in the UI. `byobEstimate()` in `src/model.js` can compute a quantity-based figure (1 drink/guest/hour + 15% buffer at retail midpoints) if you want to derive your own number. |

## To confirm with the venue (get it in writing)

- Exact service-charge/gratuity rate, and whether it's taxed.
- Whether the guest-count minimum is **enforced** (billed for N even below N guests)
  and whether it drops on Friday/Sunday.
- Whether open-bar packages carry their own headcount minimum.
- Corkage / BYO fee — this makes or breaks BYOB savings.
- What's **not** included: linens, chargers, coordinator, security, valet,
  cake-cutting, overtime rate.

When comparing venues, duplicate `src/config.js` per venue and run each through
the identical model so the comparison is apples-to-apples.
