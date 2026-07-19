import "./style.css";
import {
  VENUE_NAME, VENUE_META, RENTAL, TAX, DEFAULT_GRAT, GRAT_TAXABLE,
  GUEST_MIN, GUEST_MAX, GUEST_STEP, GUEST_DEFAULT, FOODS, BARS, VENDORS, BYOB_DEFAULT,
} from "./config.js";
import { receptionCost, receptionCostByob } from "./model.js";

const fmt = (n) => "$" + Math.round(n).toLocaleString();
const $ = (id) => document.getElementById(id);

$("venue-name").textContent = VENUE_NAME;
$("venue-meta").textContent = VENUE_META;
$("grat").value = DEFAULT_GRAT;
$("tax").value = (TAX * 100).toFixed(2);

const gSel = $("guests");
for (let g = GUEST_MIN; g <= GUEST_MAX; g += GUEST_STEP) {
  const o = document.createElement("option");
  o.value = g; o.textContent = g;
  if (g === GUEST_DEFAULT) o.selected = true;
  gSel.appendChild(o);
}

const plateSel = $("plate");
FOODS.forEach(([label], i) => {
  const o = document.createElement("option");
  o.value = i; o.textContent = label;
  if (i === FOODS.length - 1) o.selected = true;
  plateSel.appendChild(o);
});

const barSel = $("barsel");
BARS.forEach(([label], i) => {
  const o = document.createElement("option");
  o.value = i; o.textContent = label;
  if (i === Math.min(3, BARS.length - 1)) o.selected = true;
  barSel.appendChild(o);
});
const byoOpt = document.createElement("option");
byoOpt.value = "byob";
byoOpt.textContent = "BYOB (bring your own)";
barSel.appendChild(byoOpt);

const vgrid = $("vgrid");
VENDORS.forEach(([id, label, def, hint]) => {
  const d = document.createElement("div");
  d.className = "vitem";
  d.innerHTML = `<label for="v-${id}">${label}</label>
    <div class="inwrap"><span class="dollar">$</span><input type="number" id="v-${id}" value="${def}" min="0" step="50"></div>
    <div class="hint">${hint}</div>`;
  vgrid.appendChild(d);
});

$("notes").innerHTML = `<b>Assumptions baked in:</b> Dallas sales tax 8.25%
  (state 6.25% + local 2%, verified 2026 — editable above) · mandatory service charge is
  ${GRAT_TAXABLE ? "taxed" : "not taxed"} (Texas taxes it) · rental ${fmt(RENTAL)} flat.<br>
  <b>Plate rates and bar tiers are placeholders</b> — edit
  <code>src/config.js</code> when real quotes arrive.
  <b>BYOB rows</b> add retail alcohol as a flat line — gratuity and tax apply to food only,
  so those columns are lower on BYOB rows (correct, not a bug). Confirm the venue charges
  no corkage/BYO fee before trusting BYOB savings.<br>
  <b>To confirm with the venue:</b> exact gratuity %, whether the guest/bar minimums are
  enforced (and lower on Fri/Sun), what's excluded (linens, coordinator, security,
  cake-cutting, overtime), and corkage policy.`;

$("byobamt").value = BYOB_DEFAULT;

const gratVal = () => {
  const x = parseFloat($("grat").value);
  return (isNaN(x) || x < 0 ? 0 : x) / 100;
};
const taxVal = () => {
  const x = parseFloat($("tax").value);
  return (isNaN(x) || x < 0 ? 0 : x) / 100;
};
const vendorsTotal = () =>
  VENDORS.reduce((s, [id]) => {
    const v = parseFloat($("v-" + id).value);
    return s + (isNaN(v) ? 0 : v);
  }, 0);

function render() {
  const guests = +gSel.value;
  const gratuity = gratVal();
  const tax = taxVal();
  const base = { guests, gratuity, tax, gratTaxable: GRAT_TAXABLE, rental: RENTAL };

  let byobAmt = parseFloat($("byobamt").value);
  if (isNaN(byobAmt) || byobAmt < 0) byobAmt = 0;

  const rows = [];
  for (const [plateName, plateRate] of FOODS) {
    for (const [barName, barRate] of BARS) {
      const c = receptionCost({ ...base, plateRate, barRate });
      rows.push({ plateName, barName, ...c, pg: c.total / guests, byob: false });
    }
    const c = receptionCostByob({ ...base, plateRate, alcohol: byobAmt });
    rows.push({ plateName, barName: "BYOB", ...c, pg: c.total / guests, byob: true });
  }
  rows.sort((a, b) => a.total - b.total);

  const tb = $("rows");
  tb.innerHTML = "";
  rows.forEach((r, i) => {
    const cls = i === 0 ? "low" : i === rows.length - 1 ? "high" : "";
    let tag = i === 0 ? '<span class="tag low">Lowest</span>'
      : i === rows.length - 1 ? '<span class="tag high">Highest</span>' : "";
    if (r.byob) tag += '<span class="tag byob">BYOB</span>';
    const tr = document.createElement("tr");
    if (cls) tr.className = cls;
    tr.innerHTML = `<td class="l plate">${r.plateName}</td><td class="l bar">${r.barName}${tag}</td>
      <td>${fmt(r.food)}</td><td class="hide">${fmt(r.bar)}</td><td class="hide">${fmt(r.grat)}</td>
      <td class="hide">${fmt(r.tax)}</td><td class="hide">${fmt(RENTAL)}</td>
      <td class="grand">${fmt(r.total)}</td><td class="pg">${fmt(r.pg)}</td>`;
    tb.appendChild(tr);
  });
  $("s-low").textContent = fmt(rows[0].total);
  $("s-low-cap").textContent = `${rows[0].plateName} · ${rows[0].barName}`;
  $("s-high").textContent = fmt(rows[rows.length - 1].total);
  $("s-high-cap").textContent = `${rows[rows.length - 1].plateName} · ${rows[rows.length - 1].barName}`;

  const vt = vendorsTotal();
  $("vsubtotal").textContent = fmt(vt);

  const plateRate = FOODS[+plateSel.value][1];
  const byobMode = barSel.value === "byob";
  $("byobwrap").style.display = byobMode ? "flex" : "none";
  let recep, barLabel;
  if (byobMode) {
    recep = receptionCostByob({ ...base, plateRate, alcohol: byobAmt }).total;
    barLabel = "BYOB " + fmt(byobAmt) + " (flat, no grat/tax)";
  } else {
    recep = receptionCost({ ...base, plateRate, barRate: BARS[+barSel.value][1] }).total;
    barLabel = BARS[+barSel.value][0] + " bar";
  }
  const total = recep + vt;
  $("grandtotal").textContent = fmt(total);
  $("grandpg").textContent = fmt(total / guests) + " per guest";
  $("bd-recep").textContent = fmt(recep) + " (" + barLabel + ")";
  $("bd-vend").textContent = fmt(vt);
  $("bd-total").textContent = fmt(total);
}

document.querySelectorAll("select,input").forEach((el) => {
  el.addEventListener("change", render);
  el.addEventListener("input", render);
});
render();
