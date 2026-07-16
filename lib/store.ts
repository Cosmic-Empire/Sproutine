import fs from "node:fs"
import path from "node:path"

const DATA_DIR = path.join(process.cwd(), ".data")

function filePath(name: string) {
  return path.join(DATA_DIR, `${name}.json`)
}

function readJson<T>(name: string): T {
  const fp = filePath(name)
  if (!fs.existsSync(fp)) return [] as unknown as T
  return JSON.parse(fs.readFileSync(fp, "utf-8"))
}

function writeJson(name: string, data: unknown) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2))
}

export type Completion = {
  date: string
  completed_at: string
}

export type Settings = {
  id: number
  skip_days: number[]
  push_subscription: Record<string, unknown> | null
  notify_times: string[]
}

const DEFAULT_SETTINGS: Settings = {
  id: 1,
  skip_days: [],
  push_subscription: null,
  notify_times: ["16:00", "18:00", "20:00", "21:30"],
}

export function getCompletions(): Completion[] {
  return readJson<Completion[]>("completions")
}

export function addCompletion(date: string) {
  const all = getCompletions()
  if (all.some((c) => c.date === date)) return
  all.push({ date, completed_at: new Date().toISOString() })
  writeJson("completions", all)
}

export function getSettings(): Settings {
  const data = readJson<Settings | null>("settings")
  return data ?? DEFAULT_SETTINGS
}

export function writeCompletions(completions: Completion[]) {
  writeJson("completions", completions)
}

export function updateSettings(partial: Partial<Settings>) {
  const current = getSettings()
  writeJson("settings", { ...current, ...partial })
}
