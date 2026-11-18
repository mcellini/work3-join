// Work3 wordmark, set like the ads: "Work3" in IBM Plex Serif + "The Future of Work" in Inter.
export function Logo({ className = "", tagline = true }: { className?: string; tagline?: boolean }) {
  return (
    <span role="img" aria-label="Work3, The Future of Work" className={`inline-flex items-baseline gap-2 whitespace-nowrap ${className}`}>
      <span className="font-display text-xl leading-none">Work3</span>
      {tagline && <span className="hidden text-xs font-medium opacity-80 sm:inline">— The Future of Work</span>}
    </span>
  )
}
// Small round mark for the start-here window header.
export function Monogram({ className = "" }: { className?: string }) {
  return <span aria-hidden className={`inline-flex items-center justify-center rounded-full bg-primary font-display text-[13px] leading-none text-mint ${className}`}>W<sup className="-mt-2 text-[8px]">3</sup></span>
}
