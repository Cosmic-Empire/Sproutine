"use client"

import { useEffect, useState } from "react"
import { registerServiceWorker, subscribeToPush, sendSubscriptionToServer, unsubscribeFromPush } from "@/lib/push"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft } from "@phosphor-icons/react"
import AmbientBlob from "@/components/AmbientBlob"

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function SettingsPage() {
  const [skipDays, setSkipDays] = useState<number[]>([])
  const [subscribed, setSubscribed] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSkipDays(data.skip_days ?? [])
        setSubscribed(!!data.push_subscription)
      })
  }, [])

  function toggleDay(d: number) {
    setSkipDays((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]))
  }

  async function handleSave() {
    setSaving(true)
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skip_days: skipDays }),
    })
    setSaving(false)
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  async function handleEnablePush() {
    try {
      const reg = await registerServiceWorker()
      const sub = await subscribeToPush(reg)
      await sendSubscriptionToServer(sub)
      setSubscribed(true)
    } catch (err) {
      alert("Failed to enable notifications: " + (err instanceof Error ? err.message : "unknown error"))
    }
  }

  async function handleDisablePush() {
    try {
      const reg = await navigator.serviceWorker.ready
      await unsubscribeFromPush(reg)
      setSubscribed(false)
    } catch (err) {
      alert("Failed to disable notifications: " + (err instanceof Error ? err.message : "unknown error"))
    }
  }

  return (
    <div className="h-dvh overflow-y-auto scrollbar-none w-full max-w-[430px] mx-auto px-6 relative z-10 bg-[#08090C] pt-page pb-nav">
      <AmbientBlob />

      <div className="flex flex-col gap-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-full flex items-center justify-center glass hover:bg-white/5 active:scale-95 transition-all duration-200"
            >
              <ArrowLeft size={18} className="text-[#9CA3AF]" />
            </Link>
            <span className="display text-2xl font-bold tracking-tight text-[#F3F4F6]">
              Settings
            </span>
          </div>
          <div className="w-10 h-10" />
        </motion.div>

        {/* Skip days */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="glass rounded-[24px] p-5 flex flex-col gap-4 border border-white/5 bg-gradient-to-b from-white/[0.02] to-white/[0.005]"
        >
          <div>
            <h2 className="text-sm font-bold tracking-wider uppercase text-[#9CA3AF]">
              Skip days
            </h2>
            <p className="text-xs mt-1 text-[#6B7280]">
              No notifications on these days
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {DAY_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => toggleDay(i)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 min-h-[44px] min-w-[48px] ${
                  skipDays.includes(i) ? "text-white font-semibold" : ""
                }`}
                style={{
                  background: skipDays.includes(i) ? "#10B981" : "rgba(255,255,255,0.03)",
                  border: skipDays.includes(i) ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(255,255,255,0.05)",
                  color: skipDays.includes(i) ? "#FFFFFF" : "#D1D5DB",
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>



        {/* Push subscription */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.16 }}
          className="glass rounded-[24px] p-5 flex flex-col gap-4 border border-white/5 bg-gradient-to-b from-white/[0.02] to-white/[0.005]"
        >
          <div>
            <h2 className="text-sm font-bold tracking-wider uppercase text-[#9CA3AF]">
              Notifications
            </h2>
            <p className="text-xs mt-1 text-[#6B7280]">
              Browser push reminders
            </p>
          </div>
          {subscribed ? (
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-sm text-[#F3F4F6]">Subscribed</span>
              </div>
              <button
                onClick={handleDisablePush}
                className="text-sm text-[#9CA3AF] transition-colors hover:text-white"
              >
                Disable
              </button>
            </div>
          ) : (
            <button
              onClick={handleEnablePush}
              className="w-full py-4 rounded-xl text-base font-semibold transition-all active:scale-[0.98] min-h-[56px]"
              style={{
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.2)",
                color: "#34D399",
              }}
            >
              Enable notifications
            </button>
          )}
        </motion.div>

        {/* Save */}
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.24 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full py-4 rounded-full text-base font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50 mt-1"
          style={{
            minHeight: 56,
            background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
            boxShadow: "0 0 24px rgba(16, 185, 129, 0.25)",
          }}
        >
          {saving ? "Saving..." : saved ? "✓ Saved" : "Save preferences"}
        </motion.button>
      </div>

      <div className="h-6" />
    </div>
  )
}
