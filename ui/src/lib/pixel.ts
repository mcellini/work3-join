// Meta pixel + consent + URL param passthrough for the landing page.
// Mirrors public/roi/app.js and shares its storage keys: a consent choice on one page applies to the other.
// Never put inputs/emails in pixel params. CompleteRegistration is never fired from this domain (Substack does it).
export const PIXEL_ID = "1473589161254534"
export const CONSENT_BANNER_ENABLED = true
const CONSENT_KEY = "roi_consent" // shared with /roi/
const PARAMS_KEY = "roi_params" // shared with /roi/
const LEAD_FLAG = "lp_ev_Lead" // once per session on the landing

type Store = { getItem(k: string): string | null; setItem(k: string, v: string): void }
function safe(kind: "sessionStorage" | "localStorage"): Store {
  try {
    const s = window[kind]
    s.setItem("t", "1"); s.removeItem("t")
    return s
  } catch {
    const m: Record<string, string> = {}
    return { getItem: (k) => m[k] ?? null, setItem: (k, v) => { m[k] = String(v) } }
  }
}
const ss = typeof window !== "undefined" ? safe("sessionStorage") : null
const ls = typeof window !== "undefined" ? safe("localStorage") : null

/** Store every incoming URL param (except email) on first load; merged with any stored earlier in the session. */
export function storeParams() {
  if (!ss) return
  let prev: Record<string, string> = {}
  try { prev = JSON.parse(ss.getItem(PARAMS_KEY) || "{}") } catch { /* ignore */ }
  let has = false
  new URLSearchParams(location.search).forEach((v, k) => { if (k !== "email") { prev[k] = v; has = true } })
  if (has) ss.setItem(PARAMS_KEY, JSON.stringify(prev))
}
export function storedParams(): Record<string, string> {
  if (!ss) return {}
  try { return JSON.parse(ss.getItem(PARAMS_KEY) || "{}") } catch { return {} }
}

export function isEuUk() {
  let tz = ""
  try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "" } catch { /* ignore */ }
  return /^Europe\//.test(tz) || /^Atlantic\/(Reykjavik|Canary|Madeira|Azores|Faroe)$/.test(tz)
}

type Fbq = (...a: unknown[]) => void
declare global { interface Window { fbq?: Fbq; _fbq?: Fbq } }

let pixelLoaded = false
export function loadPixel() {
  if (pixelLoaded || typeof window === "undefined") return
  pixelLoaded = true
  // Standard Meta base code
  /* eslint-disable */
  ;(function (f: any, b: Document, e: string, v: string) {
    if (f.fbq) return
    const n: any = (f.fbq = function (...args: unknown[]) { n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args) })
    if (!f._fbq) f._fbq = n
    n.push = n; n.loaded = true; n.version = "2.0"; n.queue = []
    const t = b.createElement(e) as HTMLScriptElement
    t.async = true; t.src = v
    const s = b.getElementsByTagName(e)[0]
    s.parentNode!.insertBefore(t, s)
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js")
  /* eslint-enable */
  window.fbq!("init", PIXEL_ID) // no advanced matching
  window.fbq!("track", "PageView")
}

export type ConsentState = "granted" | "denied" | "ask"
export function initialConsent(): ConsentState {
  if (!CONSENT_BANNER_ENABLED || !isEuUk()) { loadPixel(); return "granted" }
  const c = ls!.getItem(CONSENT_KEY)
  if (c === "yes") { loadPixel(); return "granted" }
  if (c === "no") return "denied"
  return "ask"
}
export function setConsent(yes: boolean) {
  ls!.setItem(CONSENT_KEY, yes ? "yes" : "no")
  if (yes) loadPixel()
}

function uuid() {
  if (window.crypto && typeof crypto.randomUUID === "function") return crypto.randomUUID()
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => { const r = (Math.random() * 16) | 0; return (c === "x" ? r : (r & 3) | 8).toString(16) })
}

/** Generic guarded tracker. CompleteRegistration is blocked unconditionally. */
export function track(name: string, params: Record<string, unknown> = {}, opts?: Record<string, unknown>) {
  if (name === "CompleteRegistration") return
  if (!pixelLoaded || !window.fbq) return
  if (opts) window.fbq("track", name, params, opts); else window.fbq("track", name, params)
}

/** Lead on a Subscribe click, once per session. No params carry user data. */
export function trackLead() {
  if (!pixelLoaded || ss!.getItem(LEAD_FLAG)) return
  ss!.setItem(LEAD_FLAG, "1")
  track("Lead", {}, { eventID: uuid() })
}

/** Delegated click handler: any link to the Substack subscribe page fires Lead before the browser navigates. */
export function installSubscribeTracking() {
  document.addEventListener("click", (ev) => {
    const a = (ev.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null
    if (!a) return
    try {
      const u = new URL(a.href, location.href)
      if (u.hostname === "wrk3.substack.com" && u.pathname === "/subscribe") trackLead()
    } catch { /* ignore */ }
  }, true)
}
