"use client"

import { useEffect, useState } from "react"

type Props = {
  completions: string[]
}

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""]

export default function Heatmap({ completions }: Props) {
  const [skipDays, setSkipDays] = useState<number[]>([])
  const set = new Set(completions)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => setSkipDays(data.skip_days ?? []))
  }, [])

  const today = new Date()
  const cells: { date: string; dayOfWeek: number }[] = []
  const start = new Date(today)
  start.setDate(start.getDate() - 12 * 7 + 1)
  start.setDate(start.getDate() - start.getDay())

  const cursor = new Date(start)
  while (cursor <= today) {
    cells.push({
      date: cursor.toISOString().slice(0, 10),
      dayOfWeek: cursor.getDay(),
    })
    cursor.setDate(cursor.getDate() + 1)
  }

  const weeks: { date: string; dayOfWeek: number }[][] = []
  for (const cell of cells) {
    if (cell.dayOfWeek === 0) weeks.push([])
    if (weeks.length > 0) weeks[weeks.length - 1].push(cell)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--color-muted)" }}>
          Last 12 weeks
        </span>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-sm glass-inset" />
          <span className="text-[10px]" style={{ color: "var(--color-muted)" }}>Empty</span>
          <div className="w-2.5 h-2.5 rounded-sm" style={{ background: "var(--color-accent)", opacity: 0.6 }} />
          <span className="text-[10px]" style={{ color: "var(--color-muted)" }}>Done</span>
        </div>
      </div>
      <div className="flex gap-1">
        <div className="flex flex-col gap-[3px] pr-1 pt-0">
          {DAY_LABELS.map((label, i) => (
            <div key={i} className="h-3 flex items-center">
              <span className="text-[10px] leading-none" style={{ color: "var(--color-muted)", opacity: 0.4 }}>{label}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-[3px] overflow-x-auto pb-0.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => {
                const isCompleted = set.has(day.date)
                return (
                  <div
                    key={day.date}
                    className="w-3 h-3 rounded-sm"
                    style={
                      isCompleted
                        ? { background: "var(--color-accent)", opacity: 0.75 }
                        : { background: "rgba(255,255,255,0.04)" }
                    }
                    title={day.date}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
