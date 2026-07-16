import { NextRequest } from "next/server"
import { addCompletion, getCompletions } from "@/lib/store"

export async function POST(request: NextRequest) {
  const body = await request.json()
  const date = body.date

  if (!date) {
    return Response.json({ error: "date is required" }, { status: 400 })
  }

  addCompletion(date)
  return Response.json({ ok: true })
}

export async function DELETE(request: NextRequest) {
  const url = new URL(request.url)
  const date = url.searchParams.get("date") || new Date().toISOString().slice(0, 10)

  const all = getCompletions()
  const filtered = all.filter((c) => c.date !== date)

  const { writeCompletions } = await import("@/lib/store")
  writeCompletions(filtered)

  return Response.json({ ok: true })
}
