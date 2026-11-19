// All copy, numbers and links for the Work3 landing page live here, so a decision from Matteo is a one-line change.
// Every claim is public on wrk3.substack.com (About page + posts, checked 6 Nov 2026).
// Sources and publication checks: ../../SOURCES.md and ../../PENDING.md.
import { storedParams } from "@/lib/pixel"
import type { RowIcon } from "@/components/landing/icons"

export const SUBSTACK = "https://wrk3.substack.com"

// Matteo confirmed 30,000+ subscribers on 6 Nov 2026.
export const SUBSCRIBERS = "30,000+"

// Every CTA goes to Substack's free subscribe page. EVERY incoming URL param (fbclid, utm_*, anything else) is forwarded,
// persisted in sessionStorage (shared with /roi/), so Substack's pixel can credit the ad. Fallback utm only if no utm_* at all.
// The Meta pixel loads behind the EU/UK consent banner: see src/lib/pixel.ts.
const DEFAULT_UTM: Record<string, string> = { utm_source: "work3-landing", utm_medium: "landing-page" }
function utm() {
  const out = new URLSearchParams()
  if (typeof location !== "undefined") {
    const all = { ...storedParams() }
    new URLSearchParams(location.search).forEach((v, k) => { if (k !== "email") all[k] = v })
    for (const [k, v] of Object.entries(all)) out.set(k, v)
  }
  if (![...out.keys()].some((k) => k.startsWith("utm_"))) for (const [k, v] of Object.entries(DEFAULT_UTM)) out.set(k, v)
  return out.toString()
}
export const links = {
  subscribe: () => `${SUBSTACK}/subscribe?${utm()}`,
  about: `${SUBSTACK}/about`,
  archive: `${SUBSTACK}/archive`,
  post: (slug: string) => `${SUBSTACK}/p/${slug}`,
  privacy: "https://substack.com/privacy",
}

export const CTA = {
  main: "Subscribe free",
  short: "Subscribe",
  secondary: "Explore selected free essays",
}

export const hero = {
  pill: "The future of work · free newsletter",
  note: "Questions for your leadership team",
  h1: ["AI changes work.", "Leadership decides", "how."],
  sub: "Work3 examines the decisions behind organizational change: how to implement AI, redesign work and build accountable systems. Research, frameworks and practical analysis for CEOs, CFOs, CHROs and the leaders responsible for making change work.",
  proof: `Read by ${SUBSCRIBERS} subscribers`,
  free: "Free to subscribe. Unsubscribe anytime.",
}

// Executive questions drawn from the articles themselves. No paid-ad angles.
export type StartRow = { topic: string; question: string; title: string; slug: string; icon: RowIcon }
export const startHere: StartRow[] = [
  { topic: "Business value", question: "Are we measuring AI usage, or a change in business performance?", title: "The AI Adoption Illusion", slug: "the-ai-adoption-illusion", icon: "ai" },
  { topic: "Implementation", question: "What turns an AI experiment into a reliable production system?", title: "Beyond the Agent Graveyard: AI Production Lifecycles", slug: "beyond-the-agent-graveyard-ai-production", icon: "ways" },
  { topic: "Accountability", question: "Who owns the outcome when people and agents work together?", title: "Managing AI Employees", slug: "managing-ai-employees", icon: "office" },
  { topic: "Organization design", question: "Which capabilities does our organization need to succeed?", title: "Rebuilding the People Function", slug: "rebuilding-the-people-function", icon: "careers" },
  { topic: "Workforce strategy", question: "What changes when AI handles a chain of work, not just a task?", title: "Jobs and AI: Chains of work", slug: "jobs-and-ai-chains-of-work", icon: "overload" },
]

// Recent Work3 essays (archive, Sep–Oct 2026). Titles as published.
export const recent: { title: string; when: string }[] = [
  { title: "A Share of the Rent", when: "Oct 2026" },
  { title: "My year with agents", when: "Oct 2026" },
  { title: "The Punk Playbook", when: "Oct 2026" },
  { title: "Managing AI Employees", when: "Sep 2026" },
  { title: "AI Land Reform", when: "Sep 2026" },
  { title: "What Comes After the Job?", when: "Jul 2026" },
  { title: "Beyond the Agent Graveyard", when: "May 2026" },
  { title: "From Class War to Generational Divide", when: "Apr 2026" },
  { title: "The AI Adoption Illusion", when: "Mar 2026" },
  { title: "Jobs and AI: Chains of work", when: "Feb 2026" },
  { title: "Where Is My Mind?", when: "Feb 2026" },
  { title: "You Are Training AI: Who Gets Paid for It?", when: "Jan 2026" },
]

// Public recommendations from the Work3 About page, not claims about measured business outcomes.
export type Quote = { quote: string; name: string; role: string }
export const bigQuote: Quote = {
  quote: "AI adoption is an activity metric. It tells us people are interacting with a tool. It does not tell us whether anything meaningful is changing.",
  name: "Andy Spence", role: "The AI Adoption Illusion · Work3, March 2026",
}
export const quotes: Quote[] = [
  { quote: "I like this publication's angle on the future of work.", name: "Stowe Boyd", role: "Work Futures" },
  { quote: "A deep dive into the future of work and web3 and our new ways of living, working and playing.", name: "Nika Talbot", role: "The Shift" },
]

export const problem = {
  eyebrow: "The leadership challenge",
  title: "Deploying technology is not the same as redesigning work.",
  underline: "redesigning work.",
  body: [
    "An adoption dashboard can show how much AI an organization uses. It cannot tell you whether a process creates more value, whether review work has shifted onto managers, or who is accountable when an agent fails. These are management questions, not software features.",
    "Work3 examines those questions through organizational design, change management and enterprise AI implementation. The aim is to help leaders distinguish activity from outcomes, establish ownership and rethink how people and technology work together.",
  ],
}

export const what = {
  eyebrow: "What you get",
  title: "Analysis for the decisions that shape your organization.",
  underline: "decisions",
  inbox: {
    label: "The free subscription",
    items: [
      { icon: "essay" as RowIcon, title: "Research and analysis", detail: "Essays on the future of work, organizational change and AI implementation.", benefit: "A considered perspective beyond the rollout announcement" },
      { icon: "unlock" as RowIcon, title: "Practical frameworks", detail: "Explore agent lifecycles, business-owner scorecards and evidence-based work design in the free essays.", benefit: "Questions to take into your next leadership discussion" },
    ],
    note: "Some posts and live Brains Trust sessions require a paid subscription. The free subscription is the offer on this page.",
  },
  topics: {
    label: "The questions we examine",
    items: [
      { icon: "ai" as RowIcon, title: "Value, not adoption", detail: "The AI Adoption Illusion asks why tool usage is not evidence of transformation.", benefit: "Distinguish consumption from business performance" },
      { icon: "ways" as RowIcon, title: "From experiments to systems", detail: "Beyond the Agent Graveyard examines context, adoption, ownership, governance and measurement.", benefit: "Consider the operating model before scaling agents" },
      { icon: "office" as RowIcon, title: "Accountability for AI", detail: "Managing AI Employees defines a lifecycle from hiring and onboarding through restriction and retirement.", benefit: "Clarify the business owner's responsibility" },
      { icon: "careers" as RowIcon, title: "The people function, redesigned", detail: "Rebuilding the People Function starts with capabilities, evidence and the business context rather than inherited structures.", benefit: "Design change with the people doing the work" },
    ],
    note: "Start with the selected free essays above, or explore the full archive.",
  },
}

// Exact passage from Managing AI Employees, Matteo Cellini, 23 Sep 2026. All paragraphs below are contiguous.
export const excerpt = {
  eyebrow: "Read a sample",
  title: "A management question, not another dashboard",
  meta: "Matteo Cellini · September 2026 · free essay",
  essay: "Managing AI Employees",
  slug: "managing-ai-employees",
  paras: [
    "But an ownerless agent and an unaccountable one are not the same problem. Agent 365 can tell you a name isn’t attached to an agent’s identity record and it can’t tell you whether a business leader would put their name on what that agent is producing.",
    "It has nothing to say about whether the agent is worth what it costs once you count the review time, or whether it’s helping a team or quietly becoming their second job. Those are management questions and no platform vendor is going to answer them for you, because the answer is specific to what the agent was hired to do.",
    "That’s the gap the scorecard we built below is built for, which aims at giving operating questions a business owner should answer regardless of what the platform reports:",
  ],
  bullets: [] as string[][],
  tail: "",
  locked: "The full essay examines agent lifecycles, accountability, organization design and the hidden burden of human review. Read it free on Substack.",
}

export const readers = { eyebrow: "Public recommendations", title: "Perspectives on Work3" }

export const subscribe = {
  eyebrow: "Subscribe",
  title: `Join ${SUBSCRIBERS} readers. It's free.`,
  note: "No payment required",
  card: { name: "Free newsletter", price: "Free", sub: "No card, no trial. Just your email." },
  includes: [
    { pillar: "essay", text: "New free Work3 essays in your inbox" },
    { pillar: "free", text: "Selected subscriber-only essays" },
    { pillar: "careers", text: "Selected free essays on AI and organizational change" },
    { pillar: "free", text: "Unsubscribe from any email" },
  ] as const,
  steps: [
    ["Subscribe on Substack", "Subscribe securely on Substack."],
    ["Choose the free option", "Choose the free subscription and follow Substack’s confirmation instructions."],
    ["Read the next issue", "In your inbox, on the web, or in the Substack app."],
  ],
  links: { archive: "Browse the archive first", signin: "Already subscribed? Read on Substack" },
}

export const promise = {
  title: "Free to subscribe. No payment required.",
  body: "Work3 is free to subscribe and you don't need a card. You can unsubscribe from any email or manage your preferences on Substack.",
  ring: "Free to subscribe · no card needed · unsubscribe anytime ·",
}

export const about = {
  eyebrow: "Who writes it",
  title: "Written by Matteo Cellini and Andy Spence",
  body: [
    "Matteo is Italian born and bred, and has lived a long time in London too. He has been head of digital marketing at brands like Yahoo! and Expedia, ran growth at startups, and now leads digital marketing for a consultancy firm.",
    "Andy is a Workforce Futurist and management consultant who has worked on more than 30 global transformation programmes over 20+ years. He is a global keynote speaker, an advisor to large employers, charities and universities, and recognised by Onalytica as a key opinion leader on the future of work.",
    "In March 2025 Andy's Workforce Futurist newsletter merged with Work3. Together we examine how organizations can build a better future of work.",
  ],
  sign: "Matteo Cellini & Andy Spence, Work3",
}

export const faq: { q: string; a: string }[] = [
  { q: "Is the newsletter free?", a: "Yes. You can subscribe to Work3 for free. Some articles and the live Brains Trust sessions are paid-only; the selected essays on this page are free to read." },
  { q: "How often is it published?", a: "Work3 describes itself as a weekly newsletter. Publication dates vary, so expect essays rather than a daily news feed." },
  { q: "Who is it for?", a: "This page is for CEOs, CFOs, CHROs and senior leaders responsible for organizational change, workforce strategy and AI implementation. The essays connect business outcomes, governance and the practical design of work." },
  { q: "Is it about AI tools or organizational change?", a: "Both, but the starting point is the organization. Recent essays examine why adoption metrics can mislead, how agents become production systems, and who owns outcomes when people and AI work together." },
  { q: "Who writes it?", a: "Matteo Cellini and Andy Spence, with occasional guest contributors. Andy’s Workforce Futurist newsletter merged into Work3 in March 2025." },
  { q: "How do I unsubscribe?", a: "Use the unsubscribe link in any Work3 email or manage the subscription in your Substack account." },
  { q: "How is my subscription managed?", a: "Work3 is published on Substack. Substack manages the signup, subscription and email preferences under its privacy policy." },
]

export const final = {
  title: "Lead the change in how work gets done.",
  sub: `Join ${SUBSCRIBERS} subscribers. Read Work3’s analysis of the future of work, organizational change and AI implementation.`,
}
