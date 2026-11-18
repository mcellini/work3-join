import type { CSSProperties, ReactNode } from "react"
import arrowCurve from "@/assets/doodles/arrow-curve.svg?raw"
import arrowDown from "@/assets/doodles/arrow-down.svg?raw"
import underline from "@/assets/doodles/underline.svg?raw"

// Hand-drawn strokes (ink = currentColor), drawn on with the motion system's clip-path wipe.
const stretch = (svg: string) => svg.replace("<svg ", '<svg preserveAspectRatio="none" ')
const SVG = { "arrow-curve": arrowCurve, "arrow-down": arrowDown, underline: stretch(underline) }
export type DoodleName = keyof typeof SVG

export function Doodle({ name, className = "", dir = "x", delay = 0, onLoad = false, style }: {
  name: DoodleName; className?: string; dir?: "x" | "y" | "r"; delay?: number; onLoad?: boolean; style?: CSSProperties
}) {
  return (
    <span aria-hidden className={`doodle ${onLoad ? "draw-load" : "draw"} draw-${dir} pointer-events-none block [&>svg]:block [&>svg]:size-full ${className}`}
      style={{ ["--d" as string]: `${delay}ms`, ...style }} dangerouslySetInnerHTML={{ __html: SVG[name] }} />
  )
}

// A word with a hand-drawn underline, drawn on when the heading arrives.
export function Underlined({ children, className = "text-mint", delay = 450 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      <span className="relative z-10">{children}</span>
      <Doodle name="underline" delay={delay} className={`absolute -right-[3%] -bottom-[0.18em] -left-[3%] z-0 h-[0.3em] [&>svg]:h-full [&>svg]:w-full ${className}`} />
    </span>
  )
}

// A short handwritten note (Caveat).
export function HandNote({ children, className = "", delay = 0, onLoad = false }: { children: ReactNode; className?: string; delay?: number; onLoad?: boolean }) {
  return <span className={`hand-note ${onLoad ? "note-load" : "note"} font-hand block text-2xl leading-none ${className}`} style={{ ["--d" as string]: `${delay}ms` }}>{children}</span>
}
