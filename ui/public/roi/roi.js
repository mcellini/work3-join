// Pure calculation module (no DOM). Usable in the browser (window.Roi) and Node (module.exports).
(function (root) {
  var clamp = function (x, lo, hi) { return Math.min(hi, Math.max(lo, x)); };
  function compute(i) {
    var S = i.S, C = i.C, O = i.O || 0, Ad = i.Ad, Aa = i.Aa, H = i.H, W = i.W, R = i.R, Wk = i.Wk;
    var cost = S * C * 12 + O;
    var vd = S * Ad * H * W * Wk * R;
    var va = S * Aa * H * W * Wk * R;
    var out = {
      cost: cost, vd: vd, va: va,
      declaredRoi: cost > 0 ? (vd - cost) / cost : null,
      realRoi: cost > 0 ? (va - cost) / cost : null,
      gapPts: (Ad - Aa) * 100,
      valueGap: vd - va,
      unused: S * (1 - Aa) * C * 12,
      costPerActive: null, breakEven: null,
      noActive: Aa <= 0 || S <= 0,
      noCost: cost <= 0,
      aaGtAd: Aa > Ad,
      illusion: Aa < Ad
    };
    if (!out.noActive) {
      out.costPerActive = cost / (S * Aa);
      var d = S * Aa * W * Wk * R;
      out.breakEven = d > 0 ? cost / d : null;
    }
    return out;
  }
  // 3x3 grid of real ROI: rows = H x0.5/1/1.5, cols = R -20pts / as entered / +20pts (clamped 0..1)
  function sensitivity(i) {
    var rows = [0.5, 1, 1.5], cols = [-0.2, 0, 0.2], grid = [];
    rows.forEach(function (hm) {
      var row = [];
      cols.forEach(function (dr) {
        var o = Object.assign({}, i, { H: i.H * hm, R: clamp(i.R + dr, 0, 1) });
        row.push({ H: o.H, R: o.R, roi: compute(o).realRoi });
      });
      grid.push(row);
    });
    return grid;
  }
  function gapBand(pts) { var a = Math.abs(pts); return a < 10 ? "<10pt" : a <= 30 ? "10-30pt" : ">30pt"; }
  var api = { compute: compute, sensitivity: sensitivity, gapBand: gapBand };
  if (typeof module !== "undefined" && module.exports) module.exports = api; else root.Roi = api;
})(typeof window !== "undefined" ? window : this);
