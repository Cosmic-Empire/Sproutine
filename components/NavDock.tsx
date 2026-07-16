"use client"

import { House, Calendar, BookOpen } from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

const ITEMS = [
  { href: "/", icon: House, label: "Home" },
  { href: "/calendar", icon: Calendar, label: "Calendar" },
  { href: "/library", icon: BookOpen, label: "Library" },
]

export default function NavDock() {
  const pathname = usePathname()
  const activeIndex = ITEMS.findIndex((i) => i.href === pathname)

  return (
    <div className="fixed flex justify-center inset-x-0 bottom-6 z-20" style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}>
      <div className="glass glass-pill flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-xl border border-white/5 shadow-2xl relative overflow-hidden">
        <motion.div
          className="absolute inset-y-2 w-12 rounded-full bg-white/5 border border-white/10"
          initial={false}
          animate={{ x: activeIndex >= 0 ? activeIndex * 56 : -999 }}
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
          style={{ left: "12px" }}
        />
        {ITEMS.map(({ href, icon: Icon, label }, i) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className="relative flex items-center justify-center w-12 h-12 rounded-full active:scale-95"
              aria-label={label}
            >
              <Icon
                size={22}
                weight={active ? "fill" : "regular"}
                color={active ? "#10B981" : "#9CA3AF"}
                className="relative z-10"
              />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
