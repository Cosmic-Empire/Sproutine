"use client"

import { ReactNode, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"

const PAGES = ["/", "/calendar", "/library", "/settings"]

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const pageIndex = PAGES.indexOf(pathname)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return
      const dx = e.changedTouches[0].clientX - touchStart.current.x
      const dy = e.changedTouches[0].clientY - touchStart.current.y
      touchStart.current = null

      if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return

      const next = pageIndex + (dx < 0 ? 1 : -1)
      if (next >= 0 && next < PAGES.length) {
        router.push(PAGES[next])
      }
    },
    [pageIndex, router]
  )

  return (
    <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} className="overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
