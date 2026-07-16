import { getCompletions } from "@/lib/store"

const MONTH_THEMES: Record<number, { name: string; color: string; accent: string }> = {
  1:  { name: "Snowdrop",  color: "#E5E7EB", accent: "#F3F4F6" },
  2:  { name: "Violet",   color: "#8B5CF6", accent: "#A78BFA" },
  3:  { name: "Daffodil", color: "#FBBF24", accent: "#FCD34D" },
  4:  { name: "Tulip",    color: "#EC4899", accent: "#F9A8D4" },
  5:  { name: "Lily of the Valley", color: "#A78BFA", accent: "#C4B5FD" },
  6:  { name: "Rose",     color: "#EF4444", accent: "#FCA5A5" },
  7:  { name: "Lavender", color: "#C084FC", accent: "#C084FC" },
  8:  { name: "Sunflower",color: "#F59E0B", accent: "#FBBF24" },
  9:  { name: "Aster",    color: "#60A5FA", accent: "#60A5FA" },
  10: { name: "Marigold", color: "#F97316", accent: "#F97316" },
  11: { name: "Chrysanthemum", color: "#D97706", accent: "#D97706" },
  12: { name: "Poinsettia",color: "#DC2626", accent: "#FCA5A5" },
}

export async function GET() {
  const completions = getCompletions()

  const byMonth: Record<string, string[]> = {}
  for (const c of completions) {
    const key = c.date.slice(0, 7)
    if (!byMonth[key]) byMonth[key] = []
    byMonth[key].push(c.date)
  }

  const months = Object.entries(byMonth)
    .map(([key, dates]) => {
      const [year, month] = key.split("-").map(Number)
      const theme = MONTH_THEMES[month] ?? MONTH_THEMES[1]
      const daysInMonth = new Date(year, month, 0).getDate()
      return {
        year,
        month,
        name: theme.name,
        daysCompleted: dates.length,
        maxStreak: daysInMonth,
        color: theme.color,
        accent: theme.accent,
      }
    })
    .sort((a, b) => b.year - a.year || b.month - a.month)

  return Response.json(months)
}
