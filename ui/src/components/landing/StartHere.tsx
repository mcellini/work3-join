import { ArrowUpRightIcon } from "@phosphor-icons/react"
import { links, startHere } from "@/content"
import { Monogram } from "./Logo"

export function StartHere({ className = "" }: { autoplay?: boolean; initial?: "essay" | "question"; className?: string }) {
  return <div className={`overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-2xl shadow-black/20 ${className}`}>
    <div className="flex items-center gap-3 border-b bg-cream px-5 py-4"><Monogram className="size-8 shrink-0" /><div><p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">The leadership agenda</p><p className="mt-1 font-display text-lg">Five questions shaping work</p></div></div>
    <ol className="divide-y">{startHere.map((r,i)=><li key={r.slug} className="px-5 py-4">
      <div className="flex gap-3"><span className="pt-0.5 text-xs font-medium tabular-nums text-muted-foreground">0{i+1}</span><div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-wider text-forest-700">{r.topic}</p><p className="mt-1 font-display text-[16px] leading-snug">{r.question}</p><a href={links.post(r.slug)} className="mt-2 inline-flex items-start gap-1 text-xs leading-normal text-muted-foreground underline-offset-4 hover:underline focus-visible:ring-2">{r.title}<ArrowUpRightIcon className="mt-0.5 size-3 shrink-0" /></a></div></div>
    </li>)}</ol><div className="border-t bg-app-tint px-5 py-3 text-xs font-medium text-forest-700">Selected Work3 essays · all free to read</div>
  </div>
}
