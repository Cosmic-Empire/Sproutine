"use client"

import { useRef, useEffect } from "react"

type Props = {
  streak: number
  animKey: number
}

function getPlantStage(streak: number): number {
  if (streak >= 30) return 5
  if (streak >= 14) return 4
  if (streak >= 7) return 3
  if (streak >= 3) return 2
  if (streak >= 1) return 1
  return 0
}

const STAGE_NAMES: Record<number, string> = {
  0: "Ready when you are",
  1: "Just sprouted",
  2: "Young plant",
  3: "Growing strong",
  4: "In bloom",
  5: "Thriving",
}

function Pot() {
  return (
    <g>
      <defs>
        <linearGradient id="potGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4885C" />
          <stop offset="100%" stopColor="#B8704A" />
        </linearGradient>
        <linearGradient id="potRimGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#DC9268" />
          <stop offset="100%" stopColor="#C07850" />
        </linearGradient>
      </defs>
      <ellipse cx="100" cy="244" rx="42" ry="5" fill="rgba(0,0,0,0.35)" />
      <path d="M64,188 L68,238 Q100,242 132,238 L136,188 Z" fill="url(#potGrad)" />
      <rect x="59" y="180" width="82" height="10" rx="3" fill="url(#potRimGrad)" />
      <ellipse cx="100" cy="187" rx="36" ry="4" fill="var(--color-soil)" />
    </g>
  )
}

function makeLeafGrad(id: string, from: string, to: string) {
  return (
    <linearGradient key={id} id={id} x1="0" y1="1" x2="0.8" y2="0">
      <stop offset="0%" stopColor={from} />
      <stop offset="100%" stopColor={to} />
    </linearGradient>
  )
}

function Leaf({
  gradId,
  tipX,
  tipY,
  baseX,
  baseY,
  midX,
  midY,
  curveDir,
}: {
  gradId: string
  tipX: number; tipY: number
  baseX: number; baseY: number
  midX: number; midY: number
  curveDir: 1 | -1
}) {
  const w = Math.abs(tipX - baseX) * 0.5
  const h = Math.abs(tipY - baseY) * 0.35
  const sign = curveDir
  const c1x = baseX + sign * w * 0.6
  const c1y = baseY - h * 0.5
  const c2x = tipX - sign * w * 0.3
  const c2y = tipY + h * 0.3
  const c3x = tipX - sign * w * 0.2
  const c3y = tipY + h * 0.5
  const c4x = baseX + sign * w * 0.4
  const c4y = baseY - h * 0.6

  return (
    <g>
      <path
        d={`M ${baseX},${baseY} C ${c1x},${c1y} ${c2x},${c2y} ${tipX},${tipY} C ${c3x},${c3y} ${c4x},${c4y} ${baseX},${baseY} Z`}
        fill={`url(#${gradId})`}
      />
      <path
        d={`M ${baseX},${baseY} Q ${midX},${midY} ${tipX},${tipY}`}
        stroke="rgba(0,0,0,0.15)"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  )
}

function Flower({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const petalR = r * 0.7
  return (
    <g>
      {[0, 1, 2, 3, 4].map((i) => {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2
        const px = cx + Math.cos(angle) * petalR * 0.6
        const py = cy + Math.sin(angle) * petalR * 0.6
        const pr = petalR * (0.6 + Math.random() * 0.2)
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx={pr}
            ry={pr * 0.8}
            fill="var(--color-nag)"
            opacity="0.85"
            transform={`rotate(${angle * (180 / Math.PI)} ${px} ${py})`}
          />
        )
      })}
      <circle cx={cx} cy={cy} r={r * 0.3} fill="var(--color-nag-light)" />
    </g>
  )
}

function Stage0() {
  return (
    <g>
      <ellipse cx="100" cy="186" rx="8" ry="1.5" fill="var(--color-accent-dim)" opacity="0.15" />
    </g>
  )
}

function Stage1() {
  return (
    <g>
      <defs>
        {makeLeafGrad("s1l1", "#8FCFA8", "#6FB88A")}
        {makeLeafGrad("s1l2", "#8FCFA8", "#6FB88A")}
      </defs>
      <path d="M100,186 C98,172 104,158 100,144" stroke="#6FB88A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Leaf gradId="s1l1" tipX={88} tipY={142} baseX={98} baseY={150} midX={93} midY={144} curveDir={-1} />
      <Leaf gradId="s1l2" tipX={112} tipY={144} baseX={102} baseY={152} midX={107} midY={146} curveDir={1} />
    </g>
  )
}

function Stage2() {
  return (
    <g>
      <defs>
        {makeLeafGrad("s2l1", "#6FB88A", "#3D8B5F")}
        {makeLeafGrad("s2l2", "#6FB88A", "#3D8B5F")}
        {makeLeafGrad("s2l3", "#8FCFA8", "#6FB88A")}
      </defs>
      <path d="M100,186 C96,168 104,148 100,128" stroke="#3D8B5F" strokeWidth="3" fill="none" strokeLinecap="round" />
      <Leaf gradId="s2l1" tipX={82} tipY={150} baseX={98} baseY={160} midX={89} midY={153} curveDir={-1} />
      <Leaf gradId="s2l2" tipX={118} tipY={138} baseX={102} baseY={148} midX={111} midY={141} curveDir={1} />
      <Leaf gradId="s2l3" tipX={86} tipY={126} baseX={99} baseY={136} midX={92} midY={129} curveDir={-1} />
    </g>
  )
}

function Stage3() {
  return (
    <g>
      <defs>
        {makeLeafGrad("s3l1", "#6FB88A", "#3D8B5F")}
        {makeLeafGrad("s3l2", "#6FB88A", "#3D8B5F")}
        {makeLeafGrad("s3l3", "#8FCFA8", "#6FB88A")}
        {makeLeafGrad("s3l4", "#8FCFA8", "#6FB88A")}
        {makeLeafGrad("s3l5", "#A8D5B8", "#8FCFA8")}
      </defs>
      <path d="M100,186 C98,158 104,124 100,88" stroke="#3D8B5F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <Leaf gradId="s3l1" tipX={80} tipY={158} baseX={98} baseY={168} midX={88} midY={161} curveDir={-1} />
      <Leaf gradId="s3l2" tipX={122} tipY={144} baseX={102} baseY={155} midX={113} midY={148} curveDir={1} />
      <Leaf gradId="s3l3" tipX={84} tipY={128} baseX={99} baseY={138} midX={91} midY={131} curveDir={-1} />
      <Leaf gradId="s3l4" tipX={118} tipY={108} baseX={101} baseY={120} midX={110} midY={112} curveDir={1} />
      <Leaf gradId="s3l5" tipX={88} tipY={92} baseX={100} baseY={102} midX={94} midY={95} curveDir={-1} />
    </g>
  )
}

function Stage4() {
  return (
    <g>
      <defs>
        {makeLeafGrad("s4l1", "#6FB88A", "#3D8B5F")}
        {makeLeafGrad("s4l2", "#6FB88A", "#3D8B5F")}
        {makeLeafGrad("s4l3", "#8FCFA8", "#6FB88A")}
        {makeLeafGrad("s4l4", "#8FCFA8", "#6FB88A")}
        {makeLeafGrad("s4l5", "#A8D5B8", "#8FCFA8")}
        {makeLeafGrad("s4l6", "#A8D5B8", "#8FCFA8")}
      </defs>
      <path d="M100,186 C98,156 104,120 100,82" stroke="#3D8B5F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <Leaf gradId="s4l1" tipX={80} tipY={158} baseX={98} baseY={168} midX={88} midY={161} curveDir={-1} />
      <Leaf gradId="s4l2" tipX={122} tipY={144} baseX={102} baseY={155} midX={113} midY={148} curveDir={1} />
      <Leaf gradId="s4l3" tipX={84} tipY={126} baseX={99} baseY={136} midX={91} midY={129} curveDir={-1} />
      <Leaf gradId="s4l4" tipX={120} tipY={108} baseX={101} baseY={120} midX={111} midY={112} curveDir={1} />
      <Leaf gradId="s4l5" tipX={86} tipY={94} baseX={100} baseY={104} midX={93} midY={97} curveDir={-1} />
      <Leaf gradId="s4l6" tipX={114} tipY={84} baseX={101} baseY={94} midX={108} midY={87} curveDir={1} />
      <Flower cx={80} cy={122} r={7} />
      <Flower cx={118} cy={100} r={6} />
    </g>
  )
}

function Stage5() {
  return (
    <g>
      <defs>
        {makeLeafGrad("s5l1", "#6FB88A", "#3D8B5F")}
        {makeLeafGrad("s5l2", "#6FB88A", "#3D8B5F")}
        {makeLeafGrad("s5l3", "#8FCFA8", "#6FB88A")}
        {makeLeafGrad("s5l4", "#8FCFA8", "#6FB88A")}
        {makeLeafGrad("s5l5", "#A8D5B8", "#8FCFA8")}
        {makeLeafGrad("s5l6", "#A8D5B8", "#8FCFA8")}
        {makeLeafGrad("s5l7", "#A8D5B8", "#6FB88A")}
        {makeLeafGrad("s5l8", "#A8D5B8", "#6FB88A")}
      </defs>
      <path d="M100,186 C98,150 104,108 98,64" stroke="#3D8B5F" strokeWidth="4" fill="none" strokeLinecap="round" />
      <Leaf gradId="s5l1" tipX={78} tipY={162} baseX={98} baseY={172} midX={87} midY={165} curveDir={-1} />
      <Leaf gradId="s5l2" tipX={124} tipY={148} baseX={102} baseY={160} midX={114} midY={152} curveDir={1} />
      <Leaf gradId="s5l3" tipX={82} tipY={132} baseX={99} baseY={142} midX={90} midY={135} curveDir={-1} />
      <Leaf gradId="s5l4" tipX={122} tipY={114} baseX={101} baseY={126} midX={112} midY={118} curveDir={1} />
      <Leaf gradId="s5l5" tipX={84} tipY={98} baseX={99} baseY={108} midX={91} midY={101} curveDir={-1} />
      <Leaf gradId="s5l6" tipX={118} tipY={84} baseX={101} baseY={94} midX={110} midY={87} curveDir={1} />
      <Leaf gradId="s5l7" tipX={88} tipY={74} baseX={99} baseY={84} midX={93} midY={77} curveDir={-1} />
      <Leaf gradId="s5l8" tipX={112} tipY={66} baseX={101} baseY={76} midX={107} midY={69} curveDir={1} />
      <Flower cx={78} cy={128} r={7} />
      <Flower cx={120} cy={108} r={7} />
      <Flower cx={92} cy={68} r={6} />
    </g>
  )
}

const STAGE_COMPONENTS = [Stage0, Stage1, Stage2, Stage3, Stage4, Stage5]

export default function Plant({ streak, animKey }: Props) {
  const stage = getPlantStage(streak)
  const StageComponent = STAGE_COMPONENTS[stage]
  const containerRef = useRef<HTMLDivElement>(null)
  const prevStreakRef = useRef(streak)

  useEffect(() => {
    if (prevStreakRef.current === streak) return

    const el = containerRef.current
    if (!el) return

    const cls = streak > prevStreakRef.current ? "animate-grow" : "animate-wilt"
    prevStreakRef.current = streak

    el.classList.remove("animate-grow", "animate-wilt")
    void el.offsetWidth
    el.classList.add(cls)

    const timer = setTimeout(() => {
      el?.classList.remove("animate-grow", "animate-wilt")
    }, 1500)
    return () => clearTimeout(timer)
  }, [streak])

  return (
    <div className="relative w-full flex flex-col items-center gap-4">
      <div
        ref={containerRef}
        className="relative w-56 h-64"
        style={{ transformOrigin: "bottom center" }}
      >
        <svg viewBox="0 0 200 248" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <Pot />
          <StageComponent key={animKey} />
        </svg>
      </div>
      <div className="flex flex-col items-center gap-1 relative z-10">
        <span
          className="display"
          style={{
            fontSize: "96px",
            lineHeight: "0.9",
            color: streak >= 3 ? "var(--color-accent)" : "var(--color-text)",
          }}
        >
          {streak}
        </span>
        <span className="text-xs font-medium tracking-[0.08em] uppercase" style={{ color: "var(--color-muted)" }}>
          Day streak
        </span>
        <span className="text-sm" style={{ color: "var(--color-muted)" }}>
          {STAGE_NAMES[stage]}
        </span>
      </div>
    </div>
  )
}
