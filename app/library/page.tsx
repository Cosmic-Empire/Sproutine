"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { GearSix } from "@phosphor-icons/react"
import Link from "next/link"
import AmbientBlob from "@/components/AmbientBlob"

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"]

type ArchiveEntry = {
  year: number
  month: number
  name: string
  daysCompleted: number
  maxStreak: number
  color: string
  accent: string
}

export default function LibraryPage() {
  const [archives, setArchives] = useState<ArchiveEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/archive")
      .then((r) => r.json())
      .then((data) => {
        setArchives(data)
        setLoading(false)
      })
  }, [])

  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

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
            Archive
          </span>
          <Link 
            href="/settings" 
            className="relative w-10 h-10 rounded-full flex items-center justify-center glass hover:bg-white/5 active:scale-95 transition-all duration-200"
            aria-label="Settings"
          >
            <GearSix size={20} className="text-[#9CA3AF] transition-colors hover:text-white" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="w-6 h-6 rounded-full animate-spin border-2 border-[#10B981]/20 border-t-[#10B981]" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Current month */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-[24px] p-5 border border-white/5 bg-gradient-to-b from-white/[0.02] to-white/[0.005] relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[24px]" style={{ background: "#10B981" }} />
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#10B981]">In progress</span>
                  <p className="text-lg font-bold text-[#F3F4F6] mt-0.5">{MONTHS[currentMonth - 1]} {currentYear}</p>
                  <p className="text-sm text-[#9CA3AF]">Current month</p>
                </div>
                <div className="relative w-14 h-14">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.5" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeDasharray="97.4" strokeDashoffset="97.4" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#F3F4F6]">?</span>
                </div>
              </div>
            </motion.div>

            {/* Past months */}
            {archives.filter((a) => !(a.year === currentYear && a.month === currentMonth)).length === 0 && !loading && (
              <div className="flex items-center justify-center min-h-[20vh]">
                <p className="text-sm text-[#6B7280]">Complete your first month to see it here</p>
              </div>
            )}

            {archives
              .filter((a) => !(a.year === currentYear && a.month === currentMonth))
              .map((entry, i) => {
                const fraction = entry.daysCompleted / entry.maxStreak
                const circumference = 97.4
                const dashOffset = circumference * (1 - fraction)

                return (
                  <motion.div
                    key={`${entry.year}-${entry.month}`}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    className="glass rounded-[24px] p-5 border border-white/5 bg-gradient-to-b from-white/[0.02] to-white/[0.005] relative overflow-hidden"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-[24px]" style={{ background: entry.accent }} />
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: entry.color }}>
                          {entry.daysCompleted}/{entry.maxStreak}
                        </span>
                        <p className="text-lg font-bold text-[#F3F4F6] mt-0.5">{MONTHS[entry.month - 1]} {entry.year}</p>
                        <p className="text-sm text-[#9CA3AF]">{entry.name}</p>
                      </div>
                      <div className="relative w-14 h-14">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <circle cx="18" cy="18" r="15.5" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
                          <circle
                            cx="18" cy="18" r="15.5"
                            fill="none"
                            stroke={entry.color}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                            style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#F3F4F6]">{entry.daysCompleted}</span>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
          </div>
        )}
      </motion.div>

      <div className="h-6" />
    </div>
  )
}
