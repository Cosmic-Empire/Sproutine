import { NextRequest } from "next/server"
import { getCompletions, getSettings } from "@/lib/store"
import webPush from "web-push"

export async function GET(request: NextRequest) {
  webPush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  )

  const auth = request.headers.get("authorization")
  const querySecret = request.nextUrl.searchParams.get("cron_secret")
  const expected = process.env.CRON_SECRET

  if (auth !== `Bearer ${expected}` && querySecret !== expected) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  const now = new Date()
  const formatter = new Intl.DateTimeFormat("en-CA", { timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit" })
  const parts = formatter.formatToParts(now)
  const todayDate = `${parts.find((p) => p.type === "year")!.value}-${parts.find((p) => p.type === "month")!.value}-${parts.find((p) => p.type === "day")!.value}`

  const dowFormatter = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "long" })
  const dowNames: Record<string, number> = { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 }
  const todayDow = dowNames[dowFormatter.format(now)]

  const settings = getSettings()

  if (settings.skip_days?.includes(todayDow)) {
    return Response.json({ message: "skip day, no notification sent" })
  }

  const completions = getCompletions()
  if (completions.some((c) => c.date === todayDate)) {
    return Response.json({ message: "already completed today, no notification sent" })
  }

  if (!settings.push_subscription) {
    return Response.json({ message: "no push subscription registered" })
  }

  try {
    await webPush.sendNotification(
      settings.push_subscription as unknown as webPush.PushSubscription,
      JSON.stringify({
        title: "Sproutine \uD83D\uDE80",
        body: "Time to do your Khan Academy prep!",
        icon: "/Khan%20Icon.png",
        badge: "/Khan%20Icon.png",
        data: { url: "/" },
      })
    )
    return Response.json({ message: "notification sent" })
  } catch (err: unknown) {
    if (err instanceof Error && "statusCode" in err && (err as { statusCode: number }).statusCode === 410) {
      const { updateSettings } = await import("@/lib/store")
      updateSettings({ push_subscription: null })
      return Response.json({ message: "subscription expired, cleared" })
    }
    throw err
  }
}
