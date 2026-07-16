"use client"

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CaretLeft, CaretRight, GearSix } from "@phosphor-icons/react"
import Link from "next/link"
import AmbientBlob from "@/components/AmbientBlob"

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

type Completion = { date: string }

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function CalendarPage() {
  const today = useMemo(() => new Date(), [])
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [completions, setCompletions] = useState<Completion[]>([])

  useEffect(() => {
    fetch("/api/completions")
      .then((r) => r.json())
      .then((data) => setCompletions(data))
  }, [])

  const completedDates = useMemo(() => {
    const set = new Set(completions.map((c) => c.date))
    return set
  }, [completions])

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`

  const isCurrentMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth()

  const weeks = useMemo(() => {
    const cells: (number | null)[][] = []
    let week: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) {
      week.push(null)
    }
    for (let d = 1; d <= daysInMonth; d++) {
      week.push(d)
      if (week.length === 7) {
        cells.push(week)
        week = []
      }
    }
    if (week.length > 0) {
      while (week.length < 7) week.push(null)
      cells.push(week)
    }
    return cells
  }, [daysInMonth, firstDay])

  function prevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="h-dvh overflow-y-auto scrollbar-none w-full max-w-[430px] mx-auto px-6 relative z-10 bg-[#08090C] pt-page pb-nav">
      <AmbientBlob />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-col gap-5"
      >
        <div className="flex items-center justify-between w-full">
          <span className="display text-2xl font-bold tracking-tight text-[#F3F4F6]">
            Calendar
          </span>
          <Link 
            href="/settings" 
            className="relative w-10 h-10 rounded-full flex items-center justify-center glass hover:bg-white/5 active:scale-95 transition-all duration-200"
            aria-label="Settings"
          >
            <GearSix size={20} className="text-[#9CA3AF] transition-colors hover:text-white" />
          </Link>
        </div>

        {/* Calendar card */}
        <div className="glass rounded-[24px] p-5 border border-white/5 bg-gradient-to-b from-white/[0.02] to-white/[0.005]">
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={prevMonth}
              className="w-10 h-10 rounded-full flex items-center justify-center glass hover:bg-white/5 active:scale-90 transition-all"
              aria-label="Previous month"
            >
              <CaretLeft size={18} className="text-[#9CA3AF]" />
            </button>
            <AnimatePresence mode="wait">
              <motion.span
                key={`${viewYear}-${viewMonth}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.2 }}
                className="text-base font-bold text-[#F3F4F6]"
              >
                {monthLabel}
              </motion.span>
            </AnimatePresence>
            <button
              onClick={nextMonth}
              className="w-10 h-10 rounded-full flex items-center justify-center glass hover:bg-white/5 active:scale-90 transition-all"
              aria-label="Next month"
            >
              <CaretRight size={18} className="text-[#9CA3AF]" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-2">
            {DAY_NAMES.map((name) => (
              <div
                key={name}
                className="text-center text-[10px] font-bold uppercase tracking-wider text-[#6B7280] py-1"
              >
                {name}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${viewYear}-${viewMonth}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="grid grid-cols-7 gap-1"
            >
              {weeks.flat().map((day, i) => {
                if (day === null) {
                  return <div key={`e-${i}`} className="aspect-square" />
                }
                const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                const isToday = dateStr === todayStr
                const isCompleted = completedDates.has(dateStr)

                return (
                  <div
                    key={dateStr}
                    className={`aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all ${
                      isToday
                        ? isCompleted
                          ? "bg-[#10B981]/25 text-[#10B981] border border-[#10B981]/40 font-bold"
                          : "bg-white/5 text-[#F3F4F6] border border-white/10 font-bold"
                        : isCompleted
                          ? "bg-[#10B981]/15 text-[#10B981]"
                          : "text-[#4B5563]"
                    }`}
                  >
                    {day}
                  </div>
                )
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Summary */}
        <div className="glass rounded-[24px] p-5 border border-white/5 bg-gradient-to-b from-white/[0.02] to-white/[0.005] flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#F3F4F6]">This month</p>
            <p className="text-xs text-[#6B7280] mt-0.5">
              {completions.filter((c) => c.date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`)).length} / {daysInMonth} days
            </p>
          </div>
          <div className="w-1 h-1 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        </div>
      </motion.div>

      <div className="h-6" />
    </div>
  )
}
