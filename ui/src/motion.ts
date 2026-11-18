// Scroll motion without scroll listeners (one IntersectionObserver system):
// - .reveal rises in once ([data-shown]), then drops its stagger delay ([data-done]) so hovers aren't delayed
// - .loop plays only while on screen ([data-play]); offscreen it pauses where it is
export function startMotion(root: ParentNode = document) {
  // a fully clipped element never intersects, so doodles (.draw) are watched through their parent
  const proxy = new Map<Element, HTMLElement[]>()
  const reveal = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue
      for (const el of proxy.get(e.target) ?? [e.target as HTMLElement]) {
        el.dataset.shown = ""
        setTimeout(() => { el.dataset.done = "" }, 1100)
      }
      reveal.unobserve(e.target)
    }
  }, { rootMargin: "0px 0px -48px 0px", threshold: 0.01 })
  root.querySelectorAll<HTMLElement>(".reveal, .note").forEach((el) => reveal.observe(el))
  root.querySelectorAll<HTMLElement>(".draw").forEach((el) => {
    const host = el.parentElement ?? el
    proxy.set(host, [...(proxy.get(host) ?? []), el])
    reveal.observe(host)
  })

  const loop = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const el = e.target as HTMLElement
      if (e.isIntersecting) el.dataset.play = ""
      else delete el.dataset.play
    }
  }, { threshold: 0.25 })
  root.querySelectorAll<HTMLElement>(".loop").forEach((el) => loop.observe(el))
  return () => { reveal.disconnect(); loop.disconnect() }
}

// one-off reveal for elements that mount later (lazy faces)
export function revealWhenSeen(el: HTMLElement) {
  const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.dataset.shown = ""; io.disconnect() } }, { rootMargin: "0px 0px -48px 0px", threshold: 0.01 })
  io.observe(el)
  return () => io.disconnect()
}

export const reducedMotion = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches
