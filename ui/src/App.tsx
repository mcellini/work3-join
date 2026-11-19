import { useEffect, type ReactNode } from "react"
import { ConsentBanner } from "@/components/landing/ConsentBanner"
import {
  ArrowRightIcon, ArrowUpRightIcon, BrainIcon, CheckCircleIcon, EnvelopeSimpleIcon, LockKeyOpenIcon, NewspaperIcon, QuotesIcon,
  SealQuestionIcon, ShieldCheckIcon, SignOutIcon, UserCircleIcon, UsersIcon, UsersThreeIcon, type Icon,
} from "@phosphor-icons/react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { StartHere } from "@/components/landing/StartHere"
import { ROW_ICONS, ROW_PILLAR } from "@/components/landing/icons"
import { Underlined } from "@/components/landing/Doodle"
import { tone, type Pillar } from "@/palette"
import { Logo } from "@/components/landing/Logo"
import * as C from "@/content"
import { startMotion } from "@/motion"

const wrap = "mx-auto w-full max-w-6xl px-5 sm:px-8"

function Eyebrow({ children, pillar = "essay", dark = false }: { children: ReactNode; pillar?: Pillar; dark?: boolean }) {
  return <p className={`text-sm font-semibold ${dark ? "text-mint" : tone(pillar).text}`}>{children}</p>
}
function Tile({ icon: I, pillar, size = "md" }: { icon: Icon; pillar: Pillar; size?: "sm" | "md" }) {
  const t = tone(pillar)
  return <span className={`grid shrink-0 place-items-center ${size === "md" ? "size-10 rounded-xl" : "size-8 rounded-lg"} ${t.tile} ${t.icon}`}><I weight="fill" className={size === "md" ? "size-5" : "size-4"} /></span>
}
function H2({ id, children, className = "" }: { id: string; children: ReactNode; className?: string }) {
  return <h2 id={id} className={`mt-3 font-display text-4xl leading-[1.1] tracking-[-0.015em] text-balance lg:text-5xl ${className}`}>{children}</h2>
}
// Splits a title around the word that gets the hand-drawn underline.
function WithUnderline({ text, word, className }: { text: string; word: string; className?: string }) {
  const i = text.lastIndexOf(word)
  if (i < 0) return <>{text}</>
  return <>{text.slice(0, i)}<Underlined className={className}>{word}</Underlined>{text.slice(i + word.length)}</>
}

function CtaButton({ tone: t = "mint", size = "lg", label = C.CTA.main }: { tone?: "mint" | "primary" | "outline"; size?: "lg" | "md"; label?: string }) {
  const tones = {
    mint: "bg-mint text-forest-900 shadow-lg shadow-black/25 hover:bg-white",
    primary: "bg-primary text-primary-foreground shadow-md shadow-black/15 hover:bg-forest-800",
    outline: "border bg-background text-foreground hover:bg-muted",
  }
  const sizes = { lg: "h-12 px-6 text-base", md: "h-11 px-5 text-sm" }
  return (
    <a href={C.links.subscribe()} className={`lift press inline-flex items-center justify-center gap-2 rounded-xl font-semibold outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/60 ${tones[t]} ${sizes[size]}`}>
      {label}
      <ArrowRightIcon weight="bold" className="size-4" />
    </a>
  )
}

function Nav() {
  return (
    <header className="pointer-events-none sticky top-3 z-50 mt-3 -mb-[68px] px-3">
      <nav aria-label="Main" className="pointer-events-auto mx-auto flex h-14 max-w-3xl items-center justify-between gap-2 rounded-2xl border bg-background/85 px-3 shadow-sm backdrop-blur-md">
        <a href="#top" className="press rounded-lg px-2 py-2 text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50" aria-label="Work3, back to top">
          <Logo />
        </a>
        <div className="hidden items-center gap-1 md:flex">
          {[["What you get", "#what"], ["Subscribe", "#subscribe"], ["FAQ", "#faq"]].map(([l, h]) => (
            <a key={h} href={h} className="rounded-lg px-3 py-2 text-sm font-medium text-foreground/80 outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50">{l}</a>
          ))}
        </div>
        <a href={C.links.subscribe()} className="press inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground outline-none transition-colors hover:bg-forest-800 focus-visible:ring-3 focus-visible:ring-ring/50">
          <span className="sm:hidden">{C.CTA.short}</span><span className="hidden sm:inline">{C.CTA.main}</span>
        </a>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="bg-primary text-primary-foreground">
      <div className={`${wrap} grid gap-12 pt-32 pb-16 lg:grid-cols-12 lg:gap-10 lg:pt-40 lg:pb-28`}>
        <div className="lg:col-span-6 lg:pt-4">
          <p className="rise inline-flex h-8 items-center rounded-full bg-mint px-3 text-sm font-semibold text-forest-900" style={{ ["--i" as string]: 0 }}>{C.hero.pill}</p>
          <h1 id="hero-title" className="mt-6 font-display text-5xl leading-[1.04] tracking-[-0.02em] sm:text-6xl">
            {C.hero.h1.map((line, l) => (
              <span key={l} className="line-mask"><span className={`line-up ${l === 2 ? "italic text-mint" : ""}`} style={{ ["--l" as string]: l }}>{line}</span></span>
            ))}
          </h1>
          <p className="rise mt-6 max-w-xl text-lg leading-relaxed text-white/85 sm:text-xl" style={{ ["--i" as string]: 2 }}>{C.hero.sub}</p>
          <div className="rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-4" style={{ ["--i" as string]: 3 }}>
            <CtaButton />
            <a href="#start" className="rounded text-sm font-medium text-white/90 underline decoration-white/40 underline-offset-4 outline-none transition-colors hover:decoration-white focus-visible:ring-3 focus-visible:ring-white/60">{C.CTA.secondary}</a>
          </div>
          <ul className="rise mt-8 flex flex-col gap-2 text-sm text-white/85" style={{ ["--i" as string]: 4 }}>
            <li className="flex items-center gap-2"><UsersIcon weight="fill" className="size-4 text-mint" />{C.hero.proof}</li>
            <li className="flex items-center gap-2"><ShieldCheckIcon weight="fill" className="size-4 text-mint" />{C.hero.free}</li>
          </ul>
        </div>
        <div id="start" className="rise relative z-10 mt-10 lg:col-span-6 lg:mt-0 lg:-mb-24 lg:self-end" style={{ ["--i" as string]: 2 }}>
          <div className="relative mx-auto max-w-[34rem] lg:mr-0">
            <StartHere />
          </div>
        </div>
      </div>
    </section>
  )
}

function Recent() {
  const row = C.recent
  return (
    <section aria-labelledby="recent-title" className="border-b pt-12 pb-12 lg:pt-36">
      <div className={wrap}>
        <p id="recent-title" className={`reveal flex items-center justify-center gap-2 text-sm font-semibold lg:justify-start ${tone("essay").text}`}><NewspaperIcon weight="fill" className="size-4" />Recently in Work3</p>
      </div>
      <div className="marquee-wrap loop reveal mt-6 overflow-hidden" style={{ ["--i" as string]: 1 }}>
        <ul className="marquee flex w-max gap-3 motion-reduce:mx-auto motion-reduce:w-auto motion-reduce:max-w-6xl motion-reduce:flex-wrap motion-reduce:justify-center motion-reduce:px-5">
          {[...row, ...row].map((g, i) => (
            <li key={i} aria-hidden={i >= row.length || undefined} className={`flex shrink-0 items-baseline gap-2 rounded-full border bg-card px-4 py-2 ${i >= row.length ? "motion-reduce:hidden" : ""}`}>
              <span className="font-display text-[15px]">{g.title}</span>
              <span className="text-sm text-muted-foreground">{g.when}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function BigQuote() {
  const q = C.bigQuote
  return (
    <section aria-label="A perspective from Work3" className="py-20 lg:py-28">
      <figure className={`${wrap} reveal max-w-4xl text-center`}>
        <QuotesIcon weight="fill" className={`mx-auto size-10 ${tone("readers").icon}`} />
        <blockquote className="mt-6 font-display text-3xl leading-tight text-balance sm:text-5xl">“{q.quote}”</blockquote>
        <figcaption className="mt-6 text-base"><span className="font-semibold">{q.name}</span> <span className="text-muted-foreground">· {q.role}</span></figcaption>
      </figure>
    </section>
  )
}

function Problem() {
  return (
    <section aria-labelledby="problem-title" className="bg-cream py-20 lg:py-28">
      <div className={`${wrap} grid gap-8 lg:grid-cols-12 lg:gap-10`}>
        <div className="reveal lg:col-span-5">
          <Eyebrow pillar="office">{C.problem.eyebrow}</Eyebrow>
          <H2 id="problem-title"><WithUnderline text={C.problem.title} word={C.problem.underline} className="text-rose-400" /></H2>
        </div>
        <div className="reveal space-y-5 text-lg leading-relaxed text-foreground/80 lg:col-span-6 lg:col-start-7 lg:pt-10" style={{ ["--i" as string]: 1 }}>
          {C.problem.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      </div>
    </section>
  )
}

function What() {
  const m = C.what
  return (
    <section id="what" aria-labelledby="what-title" className="py-20 lg:py-28">
      <div className={wrap}>
        <div className="reveal max-w-3xl">
          <Eyebrow>{m.eyebrow}</Eyebrow>
          <H2 id="what-title"><WithUnderline text={m.title} word={m.underline} /></H2>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-12">
          <div className="reveal rounded-2xl border bg-muted/50 p-6 sm:p-8 lg:col-span-4">
            <p className="text-sm font-semibold text-muted-foreground">{m.inbox.label}</p>
            <ul className="mt-6 space-y-6">
              {m.inbox.items.map((it) => {
                const p = ROW_PILLAR[it.icon]
                return (
                  <li key={it.title} className="flex gap-4">
                    <Tile icon={ROW_ICONS[it.icon]} pillar={p} />
                    <div>
                      <h3 className="font-heading text-lg font-semibold">{it.title}</h3>
                      <p className="mt-1 text-base text-muted-foreground">{it.detail}</p>
                      <p className={`mt-2 flex items-start gap-2 text-sm font-semibold ${tone(p).text}`}><ArrowRightIcon weight="bold" className="mt-0.5 size-4 shrink-0" />{it.benefit}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
            <p className="mt-8 border-t pt-4 text-sm text-muted-foreground">{m.inbox.note}</p>
          </div>
          <div className="reveal rounded-2xl border-2 border-primary bg-card p-6 shadow-xl shadow-black/5 sm:p-8 lg:col-span-8" style={{ ["--i" as string]: 1 }}>
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-app-ink">{m.topics.label}</p>
              <span className="hidden text-sm text-muted-foreground sm:block">Free with your subscription</span>
            </div>
            <ul className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {m.topics.items.map((it) => {
                const p = ROW_PILLAR[it.icon]
                return (
                  <li key={it.title}>
                    <Tile icon={ROW_ICONS[it.icon]} pillar={p} />
                    <h3 className="mt-4 font-heading text-lg font-semibold">{it.title}</h3>
                    <p className="mt-1 text-base text-muted-foreground">{it.detail}</p>
                    <p className={`mt-3 flex items-start gap-2 text-sm font-semibold ${tone(p).text}`}><ArrowRightIcon weight="bold" className="mt-0.5 size-4 shrink-0" />{it.benefit}</p>
                  </li>
                )
              })}
            </ul>
            <p className="mt-8 border-t pt-4 text-sm text-muted-foreground">{m.topics.note} <a href={C.links.archive} className="font-medium text-app-ink underline underline-offset-4">Browse the archive</a></p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Excerpt() {
  const e = C.excerpt
  return (
    <section aria-labelledby="try-title" className="bg-muted/50 py-20 lg:py-28">
      <div className={wrap}>
        <div className="reveal mx-auto max-w-3xl text-center">
          <Eyebrow>{e.eyebrow}</Eyebrow>
          <H2 id="try-title">{e.title}</H2>
        </div>
        <article className="reveal mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl border bg-card shadow-xl shadow-black/5" style={{ ["--i" as string]: 1 }} aria-label={`Excerpt from ${e.essay}`}>
          <div className="px-6 pt-8 sm:px-12 sm:pt-12">
            <p className="text-sm font-medium text-muted-foreground">{e.meta}</p>
            <h3 className="mt-2 font-display text-3xl leading-tight sm:text-4xl">{e.essay}</h3>
            <div className="fade-out mt-6 max-h-[28rem] space-y-4 overflow-hidden text-lg leading-relaxed text-foreground/85 sm:max-h-none" aria-describedby="locked-note">
              {e.paras.map((p, i) => <p key={i} className={i === 0 ? "font-display text-xl" : ""}>{p}</p>)}
              <p>{e.tail}</p>
              <ul className="space-y-3 pl-1">
                {e.bullets.map(([b, t]) => <li key={b}><b className="font-semibold">📊 {b}:</b> {t}</li>)}
              </ul>
            </div>
          </div>
          <div className="border-t bg-app-tint px-6 py-6 sm:px-12">
            <p id="locked-note" className="flex items-start gap-2 text-base font-medium"><LockKeyOpenIcon weight="fill" className="mt-1 size-4 shrink-0 text-app-ink" />{e.locked}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
              <CtaButton tone="primary" size="md" />
              <a href={C.links.post(e.slug)} className="rounded text-sm font-medium text-app-ink underline underline-offset-4 outline-none focus-visible:ring-3 focus-visible:ring-ring/50">Read the full essay on Substack</a>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

function Initials({ name }: { name: string }) {
  const i = name.split(" ").map((w) => w[0]).slice(0, 2).join("")
  const t = tone("readers")
  return <span aria-hidden className={`grid size-10 shrink-0 place-items-center rounded-full text-sm font-semibold ${t.tile} ${t.text}`}>{i}</span>
}

function Readers() {
  return (
    <section aria-labelledby="readers-title" className="py-20 lg:py-28">
      <div className={wrap}>
        <div className="reveal max-w-3xl">
          <Eyebrow pillar="readers">{C.readers.eyebrow}</Eyebrow>
          <H2 id="readers-title">{C.readers.title}</H2>
        </div>
        <div className="-mx-5 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:block sm:columns-2 sm:overflow-visible sm:px-0 sm:pb-0" aria-label="Public recommendations" tabIndex={0}>
          {C.quotes.map((q, i) => (
            <figure key={q.name} className="reveal w-[82%] shrink-0 snap-start break-inside-avoid rounded-2xl border bg-card p-6 sm:mb-4 sm:w-auto" style={{ ["--i" as string]: i % 2 }}>
              <blockquote className="text-base leading-relaxed">“{q.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <Initials name={q.name} />
                <span className="min-w-0"><span className="block text-sm font-semibold">{q.name}</span><span className="block text-sm text-muted-foreground">{q.role}</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="reveal mt-6 text-sm text-muted-foreground">Quotes as printed on the <a className="underline underline-offset-4" href={C.links.about}>Work3 About page</a>.</p>
      </div>
    </section>
  )
}

// Replaces the template's pricing with the free subscription and how it works.
function Subscribe() {
  const s = C.subscribe
  return (
    <section id="subscribe" aria-labelledby="subscribe-title" className="bg-app-tint py-20 lg:py-28">
      <div className={wrap}>
        <div className="reveal mx-auto max-w-3xl text-center">
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <H2 id="subscribe-title">{s.title}</H2>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl items-stretch gap-4 md:mt-12 md:grid-cols-12">
          <div className="reveal relative flex flex-col rounded-2xl border-2 border-primary bg-card p-6 shadow-xl shadow-black/10 sm:p-8 md:col-span-7">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-heading text-xl font-semibold">{s.card.name}</h3>
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">{C.SUBSCRIBERS} readers</span>
            </div>
            <p className="mt-6 font-display text-6xl">{s.card.price}</p>
            <p className="mt-2 text-base font-medium text-app-ink">{s.card.sub}</p>
            <ul className="mt-6 space-y-3">
              {s.includes.map((x) => <li key={x.text} className="flex items-start gap-3 text-base"><CheckCircleIcon weight="fill" className={`mt-0.5 size-5 shrink-0 ${tone(x.pillar).icon}`} />{x.text}</li>)}
            </ul>
            
            <div className="mt-8 grid"><CtaButton tone="primary" label="Subscribe free on Substack" /></div>
          </div>
          <div className="reveal flex flex-col rounded-2xl border bg-card p-6 sm:p-8 md:col-span-5" style={{ ["--i" as string]: 1 }}>
            <h3 className="font-heading text-xl font-semibold">How it works</h3>
            <ol className="mt-6 space-y-6">
              {s.steps.map(([t, d], i) => (
                <li key={t} className="flex gap-4">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-mint-soft font-display text-lg text-forest-900">{i + 1}</span>
                  <div><p className="font-semibold">{t}</p><p className="mt-1 text-base text-muted-foreground">{d}</p></div>
                </li>
              ))}
            </ol>
            <div className="mt-auto flex flex-col gap-3 pt-8 text-sm">
              <a href={C.links.archive} className="inline-flex items-center gap-2 rounded font-medium text-app-ink underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"><NewspaperIcon weight="fill" className="size-4" />{s.links.archive}<ArrowUpRightIcon className="size-3.5" /></a>
              <a href={C.SUBSTACK} className="inline-flex items-center gap-2 rounded font-medium text-app-ink underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"><UserCircleIcon weight="fill" className="size-4" />{s.links.signin}<ArrowUpRightIcon className="size-3.5" /></a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// Replaces the template's money-back seal: the free-subscription promise.
function Seal() {
  return (
    <div className="loop relative size-40 shrink-0 sm:size-44" aria-hidden>
      <svg viewBox="0 0 160 160" className="seal-ring absolute inset-0 size-full text-forest-700">
        <defs><path id="seal-path" d="M80,80 m-62,0 a62,62 0 1,1 124,0 a62,62 0 1,1 -124,0" /></defs>
        <text className="fill-current text-[11.5px] font-semibold"><textPath href="#seal-path" textLength="386" lengthAdjust="spacing">{C.promise.ring}</textPath></text>
      </svg>
      <span className="absolute inset-7 grid place-items-center rounded-full bg-primary text-mint shadow-lg shadow-black/20 sm:inset-8">
        <span className="text-center leading-none"><span className="block font-display text-3xl">$0</span><span className="block text-xs font-semibold text-white">free</span></span>
      </span>
    </div>
  )
}

function NoCatch() {
  return (
    <section aria-labelledby="promise-title" className="py-20 lg:py-24">
      <div className={`${wrap} reveal flex max-w-4xl flex-col items-center gap-8 text-center sm:flex-row sm:text-left`}>
        <Seal />
        <div>
          <h2 id="promise-title" className="font-display text-3xl leading-tight sm:text-4xl">{C.promise.title}</h2>
          <p className="mt-3 text-lg leading-relaxed text-foreground/80">{C.promise.body}</p>
        </div>
      </div>
    </section>
  )
}

function About() {
  const a = C.about
  return (
    <section aria-labelledby="about-title" className="border-t py-20 lg:py-28">
      <div className={`${wrap} grid items-center gap-10 lg:grid-cols-12`}>
        <div className="reveal relative lg:col-span-5">
          <span aria-hidden className="absolute inset-0 translate-x-3 translate-y-3 -rotate-2 rounded-2xl bg-mint" />
          <div className="relative grid grid-cols-2 gap-3 rounded-2xl border bg-primary p-3 shadow-xl shadow-black/10">
            {[["/media/matteo.jpg", "Matteo Cellini", "Matteo"], ["/media/andy.jpg", "Andy Spence", "Andy"]].map(([src, alt, n]) => (
              <figure key={n}>
                <img src={src} alt={`${alt}, co-author of Work3`} width={400} height={400} loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
                <figcaption className="mt-2 text-center text-sm font-semibold text-white">{alt}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="reveal lg:col-span-6 lg:col-start-7" style={{ ["--i" as string]: 1 }}>
          <Eyebrow pillar="careers">{a.eyebrow}</Eyebrow>
          <H2 id="about-title">{a.title}</H2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-foreground/80">{a.body.map((p, i) => <p key={i}>{p}</p>)}</div>
          <p className="mt-6 text-sm font-semibold">{a.sign}</p>
        </div>
      </div>
    </section>
  )
}

const FAQ_ICON: [Icon, Pillar][] = [
  [SealQuestionIcon, "free"], [EnvelopeSimpleIcon, "essay"], [UsersThreeIcon, "careers"], [BrainIcon, "ai"],
  [UserCircleIcon, "ways"], [SignOutIcon, "free"], [ShieldCheckIcon, "free"],
]
function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-muted/50 py-20 lg:py-28">
      <div className={`${wrap} grid gap-10 lg:grid-cols-12`}>
        <div className="reveal lg:col-span-4">
          <Eyebrow>FAQ</Eyebrow>
          <H2 id="faq-title">Questions, answered</H2>
        </div>
        <div className="reveal lg:col-span-8" style={{ ["--i" as string]: 1 }}>
          <Accordion className="rounded-2xl border bg-card px-5 sm:px-6">
            {C.faq.map((f, i) => (
              <AccordionItem key={i} value={String(i)} className="border-b last:border-b-0">
                <AccordionTrigger className="items-center gap-4 py-4 text-left font-heading text-base font-semibold hover:no-underline sm:text-lg">
                  <span className="flex items-center gap-4"><Tile icon={FAQ_ICON[i][0]} pillar={FAQ_ICON[i][1]} size="sm" />{f.q}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-5 pl-12 text-base leading-relaxed text-muted-foreground">
                  {f.a}
                  {i === 6 && <> <a className="font-medium text-app-ink underline underline-offset-4" href={C.links.privacy}>Substack's privacy policy</a>.</>}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

function Final() {
  return (
    <section aria-labelledby="final-title" className="bg-primary text-primary-foreground">
      <div className={`${wrap} grid items-center gap-12 py-20 lg:grid-cols-12 lg:py-28`}>
        <div className="reveal lg:col-span-6">
          <h2 id="final-title" className="font-display text-4xl leading-[1.08] text-balance sm:text-5xl lg:text-6xl"><WithUnderline text={C.final.title} word="change" /></h2>
          <p className="mt-5 max-w-lg text-lg text-white/85">{C.final.sub}</p>
          
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <CtaButton />
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-white/85"><ShieldCheckIcon weight="fill" className="size-4 text-mint" />{C.hero.free}</p>
        </div>
        <div className="reveal lg:col-span-6" style={{ ["--i" as string]: 1 }}>
          <StartHere autoplay={false} initial="essay" className="mx-auto max-w-[34rem] lg:mr-0" />
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-background py-10">
      <div className={`${wrap} flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row`}>
        <Logo className="text-foreground" />
        <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          <a className="hover:text-foreground" href={C.links.about}>About</a>
          <a className="hover:text-foreground" href={C.links.archive}>Archive</a>
          <a className="hover:text-foreground" href={C.links.subscribe()}>Subscribe</a>
        </nav>
        <p>© 2026 Work3</p>
      </div>
    </footer>
  )
}

export default function App() {
  useEffect(() => startMotion(), [])
  return (
    <>
      <a href="#main" className="sr-only z-[60] rounded-lg bg-background px-4 py-2 text-sm font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:ring-3 focus:ring-ring/50">Skip to content</a>
      <Nav />
      <main id="main">
        <Hero />
        <Recent />
        <BigQuote />
        <Problem />
        <What />
        <Excerpt />
        <Readers />
        <Subscribe />
        <NoCatch />
        <About />
        <Faq />
        <Final />
      </main>
      <Footer />
      <ConsentBanner />
    </>
  )
}
