(function () {
  "use strict";
  // ---- Config -------------------------------------------------------------
  var CONFIG = {
    PIXEL_ID: "1473589161254534",
    SUBSTACK: "https://wrk3.substack.com/subscribe",
    CONTENT_NAME: "adoption_roi_calculator",
    // EU/UK consent banner switch. false = pixel loads for everyone (current default, pending Matteo's decision).
    // true  = EU/UK visitors (detected by browser timezone) get the pixel only after clicking Accept.
    CONSENT_BANNER_ENABLED: true
  };

  var $ = function (id) { return document.getElementById(id); };
  var ss = (function () { try { sessionStorage.setItem("t", "1"); sessionStorage.removeItem("t"); return sessionStorage; } catch (e) { var m = {}; return { getItem: function (k) { return m[k] || null; }, setItem: function (k, v) { m[k] = String(v); } }; } })();
  var ls = (function () { try { localStorage.setItem("t", "1"); localStorage.removeItem("t"); return localStorage; } catch (e) { return { getItem: function () { return null; }, setItem: function () {} }; } })();

  // ---- URL params: store on first load, pass every one through to Substack ----
  (function storeParams() {
    var prev = {}; try { prev = JSON.parse(ss.getItem("roi_params") || "{}"); } catch (e) {}
    var q = new URLSearchParams(location.search), has = false;
    q.forEach(function (v, k) { if (k !== "email") { prev[k] = v; has = true; } });
    if (has) ss.setItem("roi_params", JSON.stringify(prev));
  })();
  function substackUrl(email) {
    var p = {}; try { p = JSON.parse(ss.getItem("roi_params") || "{}"); } catch (e) {}
    var u = new URLSearchParams();
    u.set("email", email);
    Object.keys(p).forEach(function (k) { u.set(k, p[k]); });
    if (!u.has("utm_content")) u.set("utm_content", CONFIG.CONTENT_NAME);
    return CONFIG.SUBSTACK + "?" + u.toString();
  }

  // ---- Consent + Meta pixel ----------------------------------------------
  function isEuUk() {
    var tz = ""; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ""; } catch (e) {}
    return /^Europe\//.test(tz) || /^Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe)$/.test(tz);
  }
  var pixelLoaded = false;
  function loadPixel() {
    if (pixelLoaded) return; pixelLoaded = true;
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    fbq("init", CONFIG.PIXEL_ID); // no advanced matching
    fbq("track", "PageView");
  }
  function track(name, params, opts, custom) {
    if (!pixelLoaded) return;
    var flag = "roi_ev_" + name;
    if (ss.getItem(flag)) return; ss.setItem(flag, "1");
    if (name === "CompleteRegistration") return; // never fired from our domain (Substack does it)
    var fn = custom ? "trackCustom" : "track";
    if (opts) fbq(fn, name, params || {}, opts); else fbq(fn, name, params || {});
  }
  function uuid() { return (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === "x" ? r : (r & 3 | 8)).toString(16); }); }

  (function initConsent() {
    if (!CONFIG.CONSENT_BANNER_ENABLED || !isEuUk()) { loadPixel(); return; }
    var c = ls.getItem("roi_consent");
    if (c === "yes") { loadPixel(); return; }
    if (c === "no") return;
    $("banner").classList.remove("hidden");
    $("consent-yes").onclick = function () { ls.setItem("roi_consent", "yes"); $("banner").classList.add("hidden"); loadPixel(); };
    $("consent-no").onclick = function () { ls.setItem("roi_consent", "no"); $("banner").classList.add("hidden"); };
  })();

  // ---- Form handling -----------------------------------------------------
  var copy = null;
  fetch("copy.json").then(function (r) { return r.json(); }).then(function (j) { copy = j; if (pending) pending(); }).catch(function () {});
  var pending = null;

  var FIELDS = { S: "n", C: "n", O: "n", Ad: "p", Aa: "p", H: "n", W: "n", R: "p", Wk: "n" };
  var REQUIRED = { S: 1, C: 1, Aa: 1, W: 1 };
  function num(s) { s = String(s).replace(/[\s,%$€]/g, ""); if (s === "") return NaN; return Number(s); }
  var inputs = null; // validated inputs (fractions for percentages)

  function readForm() {
    var vals = {}, ok = true, firstBad = null;
    Object.keys(FIELDS).forEach(function (k) {
      var el = $(k), e = $(k + "-e"), raw = el.value.trim(), msg = "";
      var v = num(raw);
      if (raw === "" && REQUIRED[k]) msg = "Required.";
      else if (raw === "" ) { v = k === "O" ? 0 : NaN; if (k !== "O") msg = "Required."; }
      else if (!isFinite(v) || v < 0) msg = "Enter a number, 0 or more.";
      else if (FIELDS[k] === "p" && v > 100) msg = "Enter a percentage between 0 and 100.";
      else if (k === "S" && v <= 0) msg = "Enter at least 1 seat.";
      else if (k === "Wk" && v > 52) msg = "Enter 52 or fewer weeks.";
      e.textContent = msg; el.setAttribute("aria-invalid", msg ? "true" : "false");
      if (msg) { ok = false; if (!firstBad) firstBad = el; }
      vals[k] = FIELDS[k] === "p" ? v / 100 : v;
    });
    vals.cur = $("cur").value;
    if (!ok) { firstBad.focus(); return null; }
    return vals;
  }
  function fill(v) {
    Object.keys(FIELDS).forEach(function (k) { if (v[k] != null) $(k).value = FIELDS[k] === "p" ? Math.round(v[k] * 10000) / 100 : v[k]; });
    if (v.cur) $("cur").value = v.cur;
  }
  function warn() {
    var Ad = num($("Ad").value), Aa = num($("Aa").value), w = $("warn");
    if (isFinite(Ad) && isFinite(Aa) && Aa > Ad) { w.textContent = (copy && copy.aaGtAd) || "Actual adoption is higher than declared."; w.classList.remove("hidden"); } else w.classList.add("hidden");
  }
  ["Ad", "Aa"].forEach(function (k) { $(k).addEventListener("input", warn); });

  // ViewContent: first interaction with form or CTA click
  function viewContent() { track("ViewContent", { content_name: CONFIG.CONTENT_NAME, content_category: "calculator" }); }
  $("cta-start").addEventListener("click", viewContent);
  $("roi-form").addEventListener("focusin", viewContent);

  $("roi-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var v = readForm(); if (!v) return;
    inputs = v;
    var res = Roi.compute(v);
    track("RoiComplete", { currency: v.cur === "€" ? "EUR" : "USD", adoption_gap_band: Roi.gapBand(res.gapPts) }, null, true);
    $("results").classList.add("hidden");
    $("gate").classList.remove("hidden"); $("gate").focus();
  });

  $("skip").addEventListener("click", function () { showResults(); });

  $("gate-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var email = $("email").value.trim(), e = $("email-e");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) { e.textContent = "Enter a valid email address."; $("email").setAttribute("aria-invalid", "true"); $("email").focus(); return; }
    e.textContent = ""; $("email").setAttribute("aria-invalid", "false");
    // Same click handler: Lead -> results -> open Substack. Results never depend on Substack.
    track("Lead", { content_name: CONFIG.CONTENT_NAME }, { eventID: uuid() });
    showResults();
    var url = substackUrl(email), w = null;
    try { w = window.open(url, "_blank"); if (w) w.opener = null; } catch (x) {}
    var fb = $("subscribe-fallback"); $("confirm-link").href = url;
    if (!w) fb.classList.remove("hidden"); else fb.classList.add("hidden");
  });

  // ---- Results -----------------------------------------------------------
  function money(x, cur) { var s = Math.abs(Math.round(x)).toLocaleString("en-US"); return (x < 0 ? "-" : "") + cur + s; }
  function pct(x) { return Math.round(x * 100) + "%"; }
  function tpl(s, m) { return s.replace(/\{(\w+)\}/g, function (_, k) { return m[k]; }); }

  function showResults() {
    var render = function () {
      var v = inputs, r = Roi.compute(v), cur = v.cur, sign = function (x) { return x == null ? "" : x >= 0 ? "pos" : "neg"; };
      var dr = $("r-droi"), rr = $("r-rroi");
      dr.textContent = r.declaredRoi == null ? "n/a" : pct(r.declaredRoi); dr.className = "big " + sign(r.declaredRoi);
      rr.textContent = r.realRoi == null ? "n/a" : pct(r.realRoi); rr.className = "big " + sign(r.realRoi);
      $("r-dval").textContent = "Value: " + money(r.vd, cur) + " a year at " + pct(v.Ad) + " adoption";
      $("r-rval").textContent = "Value: " + money(r.va, cur) + " a year at " + pct(v.Aa) + " adoption";
      var html = "", m = { declaredRoi: r.declaredRoi == null ? "" : pct(r.declaredRoi), realRoi: r.realRoi == null ? "" : pct(r.realRoi), valueGap: money(r.valueGap, cur), unused: money(r.unused, cur), breakEven: r.breakEven == null ? "" : r.breakEven.toFixed(2), vd: money(r.vd, cur), va: money(r.va, cur) };
      if (r.noCost) html = tpl(copy.onPaperNoCost, m);
      else if (r.noActive) html = copy.noActive + " The gap is <b>" + m.valueGap + "</b> a year, and <b>" + m.unused + "</b> goes on seats nobody uses weekly.";
      else html = tpl(r.valueGap < 0 ? copy.onPaperNoGap : copy.onPaper, m);
      if (r.illusion) html += " " + copy.illusion;
      $("r-copy").innerHTML = html;
      var gap = (r.gapPts >= 0 ? "" : "-") + Math.abs(Math.round(r.gapPts)) + " pts";
      var stats = [["Adoption gap", gap], ["Value gap", money(r.valueGap, cur) + " / yr"], ["Unused licence spend", money(r.unused, cur) + " / yr"],
        ["Break-even hours / active user / week", r.noActive || r.breakEven == null ? "n/a" : r.breakEven.toFixed(2) + " h"]];
      if (!r.noActive) stats.push(["Cost per active user / year", money(r.costPerActive, cur)]);
      $("r-stats").innerHTML = stats.map(function (s) { return '<div class="stat"><span class="note">' + s[0] + "</span><b>" + s[1] + "</b></div>"; }).join("");
      // sensitivity
      var g = Roi.sensitivity(v), t = "<tr><th>Hours saved \\ Redeployed</th>";
      g[0].forEach(function (c) { t += "<th>" + pct(c.R) + "</th>"; }); t += "</tr>";
      g.forEach(function (row) { t += "<tr><th>" + (Math.round(row[0].H * 100) / 100) + " h/wk</th>"; row.forEach(function (c) { t += "<td>" + (c.roi == null ? "n/a" : pct(c.roi)) + "</td>"; }); t += "</tr>"; });
      $("sens-table").innerHTML = t; $("sens-cap").textContent = copy.sensCaption;
      $("q-list").innerHTML = copy.questions.map(function (q) { return "<li>" + q.replace(/&/g, "&amp;").replace(/</g, "&lt;") + "</li>"; }).join("");
      $("gate").classList.add("hidden"); $("results").classList.remove("hidden"); $("results").focus();
      $("results").scrollIntoView();
    };
    if (copy) render(); else pending = render;
  }

  $("print").addEventListener("click", function () { window.print(); });
  $("edit").addEventListener("click", function () { $("results").classList.add("hidden"); $("form-section").scrollIntoView(); $("S").focus(); });
  function b64u(s) { return btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function unb64u(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; return decodeURIComponent(escape(atob(s))); }
  $("save").addEventListener("click", function () {
    var link = location.origin + location.pathname + "#r=" + b64u(JSON.stringify(inputs)); // hash only: never sent to servers
    history.replaceState(null, "", "#r=" + b64u(JSON.stringify(inputs)));
    var out = $("save-out"); out.textContent = "Bookmark or copy this link: " + link;
    if (navigator.clipboard) navigator.clipboard.writeText(link).catch(function () {});
  });
  // Returning with #r= : skip straight to results (no gate, no events)
  (function fromHash() {
    var m = /^#r=([\w-]+)$/.exec(location.hash); if (!m) return;
    try { var v = JSON.parse(unb64u(m[1])); fill(v); var ok = readForm(); if (ok) { inputs = ok; showResults(); } } catch (e) {}
  })();
})();
