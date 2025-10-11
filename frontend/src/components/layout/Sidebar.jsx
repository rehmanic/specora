"use client"

import { cn } from "../../lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  CalendarDays,
  MessageCircleQuestion,
  Users,
  Settings,
} from "lucide-react"

const items = [
  { name: "Dashboard", href: "#", icon: LayoutDashboard },
  { name: "Chat", href: "#", icon: MessageSquare },
  { name: "SpecBot", href: "#", icon: Bot },
  { name: "Meetings", href: "#", icon: CalendarDays },
  { name: "Feedback", href: "/feedback", icon: MessageCircleQuestion },
  { name: "Users", href: "#", icon: Users },
  { name: "Settings", href: "#", icon: Settings },
]

export default function Sidebar({ active }) {
  const pathname = usePathname()

  return (
    <aside
      className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border w-64 shrink-0 h-dvh sticky top-0 hidden md:flex flex-col"
      aria-label="Primary"
    >
      <div className="flex items-center gap-2 p-4">
        <div className="size-9 rounded-lg bg-sidebar-accent grid place-items-center border border-sidebar-border">
          <span className="sr-only">App logo</span>
          <span aria-hidden className="text-sm font-semibold">S</span>
        </div>
        <span className="font-semibold">Specora</span>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon
            const isActive =
              active === item.name ||
              (item.href !== "#" && pathname?.startsWith(item.href))

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    "hover:bg-sidebar-accent",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground"
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" />
                  <span className="text-pretty">{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-muted border border-border" />
          <div className="min-w-0">
            <p className="text-sm font-medium leading-tight truncate">John Doe</p>
            <p className="text-xs text-muted-foreground truncate">john.doe@gmail.com</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
