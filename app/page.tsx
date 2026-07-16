"use client"

import { useEffect, useState, useCallback } from "react"
import { GearSix } from "@phosphor-icons/react"
import PlantStage from "@/components/PlantStage"
import AmbientBlob from "@/components/AmbientBlob"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

type Completion = { date: string }

const STAGE_NAMES: Record<number, string> = {
  0: "Ready when you are",
  1: "Just sprouted",
  2: "Young plant",
  3: "Growing strong",
  4: "In bloom",
  5: "Full bloom",
}

function getStage(streak: number): number {
  if (streak >= 31) return 5
  if (streak >= 15) return 4
  if (streak >= 7) return 3
  if (streak >= 3) return 2
  if (streak >= 1) return 1
  return 0
}

export default function HomePage() {
  const [completions, setCompletions] = useState<Completion[]>([])
  const [todayDone, setTodayDone] = useState(false)
  const [loading, setLoading] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [posting, setPosting] = useState(false)

  const today = new Date().toISOString().slice(0, 10)

  const fetchCompletions = useCallback(async () => {
    try {
      const res = await fetch("/api/completions")
      const data: Completion[] = await res.json()
      setCompletions(data)
      const done = data.some((c) => c.date === today)
      setTodayDone(done)
      setCompleted(done)
    } catch (e) {
      console.error("Error fetching completions:", e)
    } finally {
      setLoading(false)
    }
  }, [today])

  useEffect(() => {
    fetchCompletions()
  }, [fetchCompletions])

  async function handleComplete() {
    if (posting) return

    if (completed) {
      setPosting(true)
      try {
        await fetch(`/api/complete?date=${today}`, { method: "DELETE" })
        await fetchCompletions()
        setCompleted(false)
      } catch (e) {
        console.error("Error deleting completion:", e)
      } finally {
        setPosting(false)
      }
      return
    }

    setPosting(true)
    try {
      await fetch("/api/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: today }),
      })
      await fetchCompletions()
      setCompleted(true)
    } catch (e) {
      console.error("Error posting completion:", e)
    } finally {
      setPosting(false)
    }
  }

  const streak = (() => {
    const sorted = [...completions]
      .map((c) => c.date)
      .sort()
      .reverse()
    let count = 0
    const checkDate = new Date()
    if (!todayDone) {
      checkDate.setDate(checkDate.getDate() - 1)
    }
    for (const dateStr of sorted) {
      const expected = checkDate.toISOString().slice(0, 10)
      if (dateStr === expected) {
        count++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        if (count === 0 && !todayDone) {
          checkDate.setDate(checkDate.getDate() + 1)
          if (dateStr === checkDate.toISOString().slice(0, 10)) {
            count++
            checkDate.setDate(checkDate.getDate() - 1)
            continue
          }
        }
        break
      }
    }
    return count
  })()

  const currentMonth = new Date().getMonth() + 1

  if (loading) {
    return (
      <div className="h-dvh w-full flex items-center justify-center bg-[#08090C] safe-top safe-bottom">
        <AmbientBlob />
        <div
          className="w-8 h-8 rounded-full animate-spin"
          style={{
            border: "2px solid rgba(16, 185, 129, 0.15)",
            borderTopColor: "#10B981",
          }}
        />
      </div>
    )
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="h-dvh overflow-y-auto scrollbar-none w-full max-w-[430px] mx-auto px-6 relative z-10 bg-[#08090C] pt-page pb-nav"
      >
        <AmbientBlob />

        <div className="flex flex-col gap-5">
          {/* 1. Header Row */}
          <div className="flex items-center justify-between w-full">
            <span className="display text-2xl font-bold tracking-tight text-[#F3F4F6]">
              Sproutine
            </span>
            <Link 
              href="/settings" 
              className="relative w-10 h-10 rounded-full flex items-center justify-center glass hover:bg-white/5 active:scale-95 transition-all duration-200"
              aria-label="Settings"
            >
              <GearSix size={20} className="text-[#9CA3AF] transition-colors hover:text-white" />
            </Link>
          </div>

          {/* 2. Opal Style Dashboard Widget Card */}
          <div className="w-full glass rounded-[32px] p-6 flex flex-col items-center justify-center border border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.35)] bg-gradient-to-b from-white/[0.02] to-white/[0.005]">
            {/* Status Capsule Badge */}
            <div 
              className="relative z-10 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase mb-3 transition-colors duration-300"
              style={{
                background: completed ? "rgba(16, 185, 129, 0.1)" : "rgba(249, 115, 22, 0.08)",
                color: completed ? "#10B981" : "#F97316",
                border: completed ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid rgba(249, 115, 22, 0.15)",
              }}
            >
              {completed ? "Logged Today" : "Ready to Log"}
            </div>

            {/* Plant Stage Graphic */}
            <div className="w-full flex items-center justify-center mb-3 overflow-visible" style={{ height: `${200 + getStage(streak) * 30}px`, transition: "height 0.5s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <PlantStage streak={streak} completed={completed} month={currentMonth} />
            </div>

            {/* Streak metrics block */}
            <div className="flex flex-col items-center text-center gap-1">
              <span className="display text-6xl font-black text-[#F3F4F6] leading-none">
                {streak}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
                Day Streak
              </span>
              <span className="text-xs text-[#9CA3AF] mt-1.5 font-semibold bg-white/[0.03] px-3.5 py-1 rounded-full border border-white/5">
                {STAGE_NAMES[getStage(streak)]}
              </span>
            </div>
          </div>
        </div>

        {/* ── Buttons region (normal flow at bottom) ── */}
        <div className="w-full flex flex-col items-center gap-4 mt-6">
          {/* 3. Primary Action Button */}
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="w-full cursor-pointer relative"
          >
            <div
              onClick={handleComplete}
              className={`w-full py-4.5 px-6 rounded-full font-semibold text-base flex items-center justify-center cursor-pointer transition-all duration-300 overflow-hidden relative ${
                completed ? "btn-primary-active" : "btn-primary-inactive glass"
              }`}
            >
              <AnimatePresence>
                {completed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 animate-liquid-flow -z-10"
                  />
                )}
              </AnimatePresence>
              
              <AnimatePresence mode="wait">
                {completed ? (
                  <motion.span
                    key="logged"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center gap-2 text-white font-bold"
                  >
                    Logged for today ✓
                  </motion.span>
                ) : (
                  <motion.span
                    key="log"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center gap-2 font-bold"
                  >
                    {posting ? "..." : "Log my Khan for today"}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* 4. Secondary Action Button */}
          <motion.div
            whileTap={{ scale: 0.97 }}
            className="w-[60%] cursor-pointer flex justify-center"
          >
            <a
              href="https://www.khanacademy.org"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-full text-center text-xs font-semibold btn-secondary glass-secondary flex items-center justify-center"
            >
              Open Khan Academy
            </a>
          </motion.div>
        </div>
      </motion.div>

    </>
  )
}