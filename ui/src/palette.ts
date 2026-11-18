// One colour per Work3 topic, used everywhere that topic appears (start-here window, "what you get", FAQ icons).
// Tailwind needs literal class names, so every combination is spelled out. Tiles: soft 100 tint + 700 ink; text: 700/800.
export type Tone = "amber" | "violet" | "rose" | "sky" | "emerald" | "teal" | "lime" | "forest"

export const TONE: Record<Tone, { tile: string; icon: string; text: string; tint: string }> = {
  amber:   { tile: "bg-amber-100",   icon: "text-amber-700",   text: "text-amber-800",   tint: "bg-amber-50" },
  violet:  { tile: "bg-violet-100",  icon: "text-violet-700",  text: "text-violet-800",  tint: "bg-violet-50" },
  rose:    { tile: "bg-rose-100",    icon: "text-rose-700",    text: "text-rose-800",    tint: "bg-rose-50" },
  sky:     { tile: "bg-sky-100",     icon: "text-sky-700",     text: "text-sky-800",     tint: "bg-sky-50" },
  emerald: { tile: "bg-emerald-100", icon: "text-emerald-700", text: "text-emerald-800", tint: "bg-emerald-50" },
  teal:    { tile: "bg-teal-100",    icon: "text-teal-700",    text: "text-teal-800",    tint: "bg-teal-50" },
  lime:    { tile: "bg-lime-100",    icon: "text-lime-700",    text: "text-lime-800",    tint: "bg-lime-50" },
  forest:  { tile: "bg-mint-soft",   icon: "text-forest-700",  text: "text-forest-700",  tint: "bg-forest-50" },
}

// Neutral topic roles. Internal names retained from the first prototype; not marketing-ad angles.
export const PILLAR = {
  careers: "forest", ai: "forest", office: "forest", ways: "forest",
  essay: "forest", readers: "forest", free: "forest",
} as const satisfies Record<string, Tone>
export type Pillar = keyof typeof PILLAR
export const tone = (p: Pillar) => TONE[PILLAR[p]]
