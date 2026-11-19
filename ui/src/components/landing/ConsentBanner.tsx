import { useState } from "react"
import { initialConsent, setConsent } from "@/lib/pixel"

// EU/UK visitors only (timezone-based). Same wording and storage key as /roi/.
export function ConsentBanner() {
  const [state, setState] = useState(initialConsent)
  if (state !== "ask") return null
  const choose = (yes: boolean) => { setConsent(yes); setState(yes ? "granted" : "denied") }
  return (
    <div id="banner" role="dialog" aria-label="Cookie consent" className="fixed inset-x-0 bottom-0 z-[70] flex flex-wrap items-center justify-center gap-3 bg-[#111827] px-4 py-3.5 text-white">
      <p className="m-0 max-w-[560px] text-sm">We use the Meta pixel to measure our ads. It loads only if you accept. The page works either way.</p>
      <button id="consent-yes" type="button" onClick={() => choose(true)} className="min-h-11 rounded-lg bg-white px-5 text-sm font-semibold text-[#111827]">Accept</button>
      <button id="consent-no" type="button" onClick={() => choose(false)} className="min-h-11 rounded-lg border border-white px-5 text-sm font-semibold text-white">Decline</button>
    </div>
  )
}
