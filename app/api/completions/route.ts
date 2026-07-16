import { getCompletions } from "@/lib/store"

export async function GET() {
  const all = getCompletions()
  const dates = all.map((c) => ({ date: c.date }))
  return Response.json(dates)
}
