// node tests/roi.test.cjs
const assert = require("assert"), fs = require("fs"), vm = require("vm");
// roi.js is a browser/UMD file; load it in a sandbox so package "type": "module" does not matter.
const ctx = { window: {} }; vm.runInNewContext(fs.readFileSync(__dirname + "/../public/roi/roi.js", "utf8"), ctx);
const Roi = ctx.window.Roi;
const base = { S: 100, C: 30, O: 0, Ad: .8, Aa: .4, H: 2, W: 60, R: .5, Wk: 46 };
const r = Roi.compute(base);
assert.strictEqual(r.cost, 36000); assert.strictEqual(r.vd, 220800); assert.strictEqual(r.va, 110400);
assert.strictEqual(Math.round(r.declaredRoi * 100), 513); assert.strictEqual(Math.round(r.realRoi * 100), 207);
assert.strictEqual(Math.round(r.unused), 21600); assert.strictEqual(Math.round(r.costPerActive), 900);
assert.strictEqual(r.breakEven.toFixed(2), "0.65"); assert.strictEqual(Math.round(r.gapPts), 40); assert.ok(r.illusion);
// Aa = 0
const z = Roi.compute({ ...base, Aa: 0 }); assert.ok(z.noActive); assert.strictEqual(z.costPerActive, null); assert.strictEqual(z.breakEven, null);
// Cost = 0
const c0 = Roi.compute({ ...base, C: 0, O: 0 }); assert.ok(c0.noCost); assert.strictEqual(c0.realRoi, null);
// Aa > Ad
const g = Roi.compute({ ...base, Aa: .9 }); assert.ok(g.aaGtAd); assert.ok(!g.illusion);
// sensitivity: centre cell = real ROI; clamp
const s = Roi.sensitivity(base); assert.ok(Math.abs(s[1][1].roi - r.realRoi) < 1e-9);
const sc = Roi.sensitivity({ ...base, R: .9 }); assert.strictEqual(sc[0][2].R, 1); assert.strictEqual(Roi.sensitivity({ ...base, R: .1 })[0][0].R, 0);
console.log("roi tests passed");
