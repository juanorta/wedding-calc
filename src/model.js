// Pure cost-model functions. Order of operations matters: gratuity is applied
// to food+bar first, and in Texas a mandatory service charge is itself taxable,
// so tax is computed on food + bar + gratuity.

export function receptionCost({ plateRate, barRate, guests, gratuity, tax, gratTaxable, rental }) {
  const food = plateRate * guests;
  const bar = barRate * guests;
  const grat = (food + bar) * gratuity;
  const taxAmt = (food + bar + (gratTaxable ? grat : 0)) * tax;
  return { food, bar, grat, tax: taxAmt, total: food + bar + grat + taxAmt + rental };
}

// BYOB: retail alcohol is a flat line that bypasses venue gratuity and tax —
// only the food (and rental) pass through them.
export function receptionCostByob({ plateRate, guests, gratuity, tax, gratTaxable, rental, alcohol }) {
  const food = plateRate * guests;
  const grat = food * gratuity;
  const taxAmt = (food + (gratTaxable ? grat : 0)) * tax;
  return { food, bar: alcohol, grat, tax: taxAmt, total: food + grat + taxAmt + rental + alcohol };
}

// 1 drink per guest per hour + 15% buffer, split by mix, converted to bottles
// at standard yields (wine 5 glasses/750ml, liquor ~17 cocktails/750ml, beer 24/case).
export function byobEstimate(guests, byob) {
  const drinks = guests * byob.hours * 1.15;
  const wineBottles = Math.ceil((drinks * byob.mix.wine) / 5);
  const liquorBottles = Math.ceil((drinks * byob.mix.liquor) / 17);
  const beerCases = Math.ceil((drinks * byob.mix.beer) / 24);
  const total =
    wineBottles * byob.winePerBottle +
    liquorBottles * byob.liquorPerBottle +
    beerCases * byob.beerPerCase +
    byob.extras;
  return { drinks, wineBottles, liquorBottles, beerCases, total };
}
