// ============================================================================
// EDIT THIS FILE as real quotes arrive — everything else is generic logic.
//
// PLACEHOLDER STATUS (2026-07): venue rental, plate rates, and bar tiers are
// placeholder numbers, NOT quotes. Vendor defaults are 2026 DFW researched
// ranges (see README). Tax is verified for Dallas & Fort Worth proper;
// re-check if the venue sits in a special taxing district.
// ============================================================================

export const VENUE_NAME = "The Room on Main";
export const VENUE_META = "Downtown Dallas, TX · Friday, April 30, 2027";

export const RENTAL = 6495; // flat venue rental fee
export const TAX = 0.0825; // Dallas & Fort Worth combined sales tax, verified 2026
export const DEFAULT_GRAT = 20; // typical 20–24%; get the venue's exact rate in writing
export const GRAT_TAXABLE = true; // mandatory service charges are taxable in TX

export const GUEST_MIN = 60;
export const GUEST_MAX = 160;
export const GUEST_STEP = 5;
export const GUEST_DEFAULT = 110;

// [label, per-plate price] — PLACEHOLDER caterer tiers
export const FOODS = [
  ["Disposable plateware", 56.95],
  ["China plateware", 67.95],
];

// [label, per-person price] — PLACEHOLDER open-bar tiers (first = no bar)
export const BARS = [
  ["None", 0],
  ["Beer + Wine", 15],
  ["Beer + Wine + Signature", 18],
  ["Call", 22],
  ["Premium", 27],
  ["Top Shelf", 37],
];

// [id, label, default $, hint] — defaults are 2026 DFW range midpoints
export const VENDORS = [
  ["photo", "Photography", 4000, "DFW $3,000–$5,500"],
  ["coord", "Day-of coordinator", 1500, "DFW $800–$2,500"],
  ["floral", "Florals & decor", 3800, "DFW $2,500–$5,000"],
  ["dj", "DJ", 1400, "DFW $1,050–$1,700"],
  ["cake", "Cake", 650, "DFW $500–$800"],
];

export const BYOB_DEFAULT = 2000; // starting flat alcohol estimate

// BYOB auto-estimate inputs: 1 drink/guest/hour + 15% buffer, retail-priced.
export const BYOB = {
  hours: 5,
  mix: { wine: 0.5, beer: 0.25, liquor: 0.25 },
  winePerBottle: 13, // 750 ml = 5 glasses
  liquorPerBottle: 22, // 750 ml = ~17 cocktails
  beerPerCase: 30, // 24 cans
  extras: 0, // mixers/ice/cups — add ~$100 if caterer doesn't include them
};
