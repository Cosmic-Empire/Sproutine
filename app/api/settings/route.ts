import { NextRequest } from "next/server"
import { getSettings, updateSettings } from "@/lib/store"

export async function GET() {
  const settings = getSettings()
  return Response.json(settings)
}

export async function PATCH(request: NextRequest) {
  const body = await request.json()
  updateSettings(body)
  return Response.json({ ok: true })
}
