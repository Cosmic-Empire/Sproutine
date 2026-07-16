import { NextRequest } from "next/server"
import { updateSettings } from "@/lib/store"

export async function POST(request: NextRequest) {
  const subscription = await request.json()
  updateSettings({ push_subscription: subscription })
  return Response.json({ ok: true })
}

export async function DELETE() {
  updateSettings({ push_subscription: null })
  return Response.json({ ok: true })
}
