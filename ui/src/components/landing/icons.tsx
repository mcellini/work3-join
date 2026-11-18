import { BriefcaseIcon, BuildingOfficeIcon, BrainIcon, RobotIcon, PathIcon, UserIcon, NewspaperIcon, LockKeyOpenIcon, type Icon } from "@phosphor-icons/react"
import type { Pillar } from "@/palette"

export type RowIcon = "careers" | "ai" | "office" | "ways" | "overload" | "age" | "essay" | "unlock"
export const ROW_ICONS: Record<RowIcon, Icon> = {
  careers: BriefcaseIcon,
  ai: RobotIcon,
  office: BuildingOfficeIcon,
  ways: PathIcon,
  overload: BrainIcon,
  age: UserIcon,
  essay: NewspaperIcon,
  unlock: LockKeyOpenIcon,
}
// each icon belongs to one topic, so it always carries that topic's colour
export const ROW_PILLAR: Record<RowIcon, Pillar> = {
  careers: "careers", age: "careers", ai: "ai", overload: "ai", office: "office", ways: "ways", essay: "essay", unlock: "free",
}
