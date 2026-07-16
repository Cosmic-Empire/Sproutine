"use client"

import { useEffect, useRef, useMemo } from "react"
import gsap from "gsap"

type Props = {
  streak: number
  completed: boolean
  month?: number
}

// Exact Phosphor Icon SVG Path data
const LEAF_PATH = "M223.45,40.07a8,8,0,0,0-7.52-7.52C139.8,28.08,78.82,51,52.82,94a87.09,87.09,0,0,0-12.76,49A101.72,101.72,0,0,0,46.7,175.2a4,4,0,0,0,6.61,1.43l85-86.3a8,8,0,0,1,11.32,11.32L56.74,195.94,42.55,210.13a8.2,8.2,0,0,0-.6,11.1,8,8,0,0,0,11.71.43l16.79-16.79c14.14,6.84,28.41,10.57,42.56,11.07q1.67.06,3.33.06A86.93,86.93,0,0,0,162,203.18C205,177.18,227.93,116.21,223.45,40.07Z"

const PLANT_PATH = "M205.41,159.07a60.9,60.9,0,0,1-31.83,8.86,71.71,71.71,0,0,1-27.36-5.66A55.55,55.55,0,0,0,136,194.51V224a8,8,0,0,1-8.53,8,8.18,8.18,0,0,1-7.47-8.25V211.31L81.38,172.69A52.5,52.5,0,0,1,63.44,176a45.82,45.82,0,0,1-23.92-6.67C17.73,156.09,6,125.62,8.27,87.79a8,8,0,0,1,7.52-7.52c37.83-2.23,68.3,9.46,81.5,31.25A46,46,0,0,1,103.74,140a4,4,0,0,1-6.89,2.43l-19.2-20.1a8,8,0,0,0-11.31,11.31l53.88,55.25c.06-.78.13-1.56.21-2.33a68.56,68.56,0,0,1,18.64-39.46l50.59-53.46a8,8,0,0,0-11.31-11.32l-49,51.82a4,4,0,0,1-6.78-1.74c-4.74-17.48-2.65-34.88,6.4-49.82,17.86-29.48,59.42-45.26,111.18-42.22a8,8,0,0,1,7.52,7.52C250.67,99.65,234.89,141.21,205.41,159.07Z"

const FLOWER_PATH = "M208,48a87.48,87.48,0,0,0-35.36,7.43c-15.1-25.37-39.92-38-41.06-38.59a8,8,0,0,0-7.16,0c-1.14.58-26,13.22-41.06,38.59A87.48,87.48,0,0,0,48,48a8,8,0,0,0-8,8V96a88.11,88.11,0,0,0,80,87.63v35.43L83.58,200.84a8,8,0,1,0-7.16,14.32l48,24a8,8,0,0,0,7.16,0l48-24a8,8,0,0,0-7.16-14.32L136,219.06V183.63A88.11,88.11,0,0,0,216,96V56A8,8,0,0,0,208,48ZM56,96V64.44A72.1,72.1,0,0,1,120,136v31.56A72.1,72.1,0,0,1,56,96Zm144,0a72.1,72.1,0,0,1-64,71.56V136a72.1,72.1,0,0,1,64-71.56Z"

const ACORN_PATH = "M232,104a56.06,56.06,0,0,0-56-56H136a24,24,0,0,1,24-24,8,8,0,0,0,0-16,40,40,0,0,0-40,40H80a56.06,56.06,0,0,0-56,56,16,16,0,0,0,8,13.84V128c0,35.53,33.12,62.12,59.74,83.49C103.66,221.07,120,234.18,120,240a8,8,0,0,0,16,0c0-5.82,16.34-18.93,28.26-28.51C190.88,190.12,224,163.53,224,128V117.84A16,16,0,0,0,232,104Zm-77.75,95c-10.62,8.52-20,16-26.25,23.37-6.25-7.32-15.63-14.85-26.25-23.37C77.8,179.79,48,155.86,48,128v-8H208v8C208,155.86,178.2,179.79,154.25,199Z"

function getStage(streak: number): number {
  if (streak >= 31) return 5
  if (streak >= 15) return 4
  if (streak >= 7) return 3
  if (streak >= 3) return 2
  if (streak >= 1) return 1
  return 0
}

const MONTH_THEMES: Record<number, { name: string; leaf: [string, string]; flower: string; pot: [string, string]; accent: string }> = {
  1:  { name: "Snowdrop",  leaf: ["#6EE7B7", "#34D399"], flower: "#E5E7EB", pot: ["#6B7280", "#4B5563"], accent: "#E5E7EB" },
  2:  { name: "Violet",   leaf: ["#C4B5FD", "#8B5CF6"], flower: "#8B5CF6", pot: ["#8B5CF6", "#7C3AED"], accent: "#A78BFA" },
  3:  { name: "Daffodil", leaf: ["#86EFAC", "#22C55E"], flower: "#FBBF24", pot: ["#FBBF24", "#D97706"], accent: "#FBBF24" },
  4:  { name: "Tulip",    leaf: ["#6EE7B7", "#10B981"], flower: "#F472B6", pot: ["#F472B6", "#DB2777"], accent: "#F472B6" },
  5:  { name: "Lily of the Valley", leaf: ["#5EEAD4", "#14B8A6"], flower: "#A78BFA", pot: ["#A78BFA", "#7C3AED"], accent: "#A78BFA" },
  6:  { name: "Rose",     leaf: ["#6EE7B7", "#10B981"], flower: "#EF4444", pot: ["#EF4444", "#DC2626"], accent: "#EF4444" },
  7:  { name: "Lavender", leaf: ["#A7F3D0", "#34D399"], flower: "#C084FC", pot: ["#C084FC", "#9333EA"], accent: "#C084FC" },
  8:  { name: "Sunflower",leaf: ["#86EFAC", "#22C55E"], flower: "#F59E0B", pot: ["#F59E0B", "#D97706"], accent: "#FBBF24" },
  9:  { name: "Aster",    leaf: ["#5EEAD4", "#14B8A6"], flower: "#60A5FA", pot: ["#60A5FA", "#2563EB"], accent: "#60A5FA" },
  10: { name: "Marigold", leaf: ["#86EFAC", "#22C55E"], flower: "#F97316", pot: ["#F97316", "#EA580C"], accent: "#F97316" },
  11: { name: "Chrysanthemum", leaf: ["#6EE7B7", "#10B981"], flower: "#D97706", pot: ["#D97706", "#B45309"], accent: "#D97706" },
  12: { name: "Poinsettia",leaf: ["#34D399", "#059669"], flower: "#DC2626", pot: ["#DC2626", "#B91C1C"], accent: "#DC2626" },
}

export default function PlantStage({ streak, completed, month }: Props) {
  const stage = getStage(streak)
  const plantContainerRef = useRef<SVGSVGElement>(null)
  const plantGroupRef = useRef<SVGGElement>(null)
  const rootAnimRef = useRef<SVGGElement>(null)
  const potRef = useRef<SVGGElement>(null)
  const prevStreakRef = useRef(streak)

  const theme = MONTH_THEMES[month ?? new Date().getMonth() + 1] ?? MONTH_THEMES[1]

  const circumference = 282.74
  const progressPercent = Math.min(streak, 31) / 31
  const dashOffset = circumference - (circumference * progressPercent)

  const stageBounds = [{s:0,e:1},{s:1,e:3},{s:3,e:7},{s:7,e:15},{s:15,e:31},{s:31,e:31}]
  const { s: stageStart, e: stageEnd } = stageBounds[stage]
  const range = stageEnd - stageStart
  const stageProgress = range === 0 ? 1 : Math.min((streak - stageStart) / range, 1)

  const dailyScale = 1 + stageProgress * 0.06

  const particleRefs = useRef<(HTMLDivElement | null)[]>([])

  const particleCounts = [0, 0, 0, 2, 4, 6]
  const particlePositions = useMemo(() => {
    const count = particleCounts[stage]
    return Array.from({ length: count }, () => ({
      left: `${28 + Math.random() * 44}%`,
      delay: Math.random() * 2,
      driftX: (Math.random() - 0.5) * 50,
      rise: 80 + Math.random() * 60,
      duration: 2 + Math.random() * 1.5,
    }))
  }, [stage])

  // 1. Squash-and-grow pulse or wilt transitions on state change
  useEffect(() => {
    if (!plantContainerRef.current) return
    const ctx = gsap.context(() => {
      if (streak === 0) {
        gsap.to(plantContainerRef.current, {
          scaleY: 0.82,
          scaleX: 0.9,
          rotate: -10,
          y: 12,
          duration: 1.2,
          ease: "power2.inOut",
          transformOrigin: "bottom center",
        })
      } else {
        const isGrowth = streak > prevStreakRef.current
        if (isGrowth) {
          const tl = gsap.timeline()
          tl.to(plantContainerRef.current, {
            scaleX: 1.15,
            scaleY: 0.85,
            y: 6,
            duration: 0.1,
            ease: "power1.out",
            transformOrigin: "bottom center",
          })
          .to(plantContainerRef.current, {
            scaleX: 0.88,
            scaleY: 1.12,
            y: -8,
            duration: 0.12,
            ease: "power1.inOut",
          })
          .to(plantContainerRef.current, {
            scaleX: 1.0,
            scaleY: 1.0,
            y: 0,
            duration: 0.15,
            ease: "back.out(1.7)",
          })
        } else {
          gsap.to(plantContainerRef.current, {
            scaleY: 1.0,
            scaleX: 1.0,
            rotate: 0,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            transformOrigin: "bottom center",
          })
        }
      }
    })
    prevStreakRef.current = streak
    return () => ctx.revert()
  }, [streak])

  // 2. Idle hop/peek animation — the whole unit jumps around the card in 3D-like space.
  //    Each hop picks a varied direction (not just left/right) with depth (scale changes).
  useEffect(() => {
    const root = rootAnimRef.current
    const group = plantGroupRef.current
    const svg = plantContainerRef.current
    if (!root || !group || !svg) return

    gsap.killTweensOf(root)
    gsap.killTweensOf(group)
    gsap.killTweensOf(svg)

    if (stage === 0) return

    // Direction pairs: [dx, dy, angleSign, depthScale]
    const dirs = [
      [[-1, -0.6, -1, 1.04], [1, -0.3, 1, 0.96]],
      [[-1, -0.7, -1, 1.05], [0.8, -0.5, 0.6, 0.97], [-0.6, -0.8, -0.5, 1.03]],
      [[-1, -0.6, -1, 1.06], [0.7, -0.7, 0.8, 0.95], [-0.8, -0.4, -0.6, 1.04], [1, -0.5, 0.5, 0.96]],
      [[-1, -0.5, -1, 1.07], [0.9, -0.8, 0.7, 0.94], [-0.7, -0.6, -0.8, 1.05], [0.6, -0.9, 0.6, 0.95], [-0.9, -0.3, -0.5, 1.03]],
      [[-1, -0.7, -1, 1.08], [0.8, -0.6, 0.6, 0.93], [-0.6, -0.8, -0.7, 1.06], [1, -0.4, 0.8, 0.94], [-0.8, -0.9, -0.6, 1.05], [0.7, -0.5, 0.5, 0.95]],
    ]

    const config = [
      null,
      { angle: 8,  hopSpeed: 0.32, dwell: 3.2, hopCount: 1, breatheAmp: 0.003, jump: 6 },
      { angle: 16, hopSpeed: 0.26, dwell: 2.2, hopCount: 2, breatheAmp: 0.005, jump: 8 },
      { angle: 24, hopSpeed: 0.2,  dwell: 1.5, hopCount: 3, breatheAmp: 0.008, jump: 10 },
      { angle: 32, hopSpeed: 0.15, dwell: 1.0, hopCount: 4, breatheAmp: 0.012, jump: 12 },
      { angle: 40, hopSpeed: 0.12, dwell: 0.7, hopCount: 5, breatheAmp: 0.015, jump: 15 },
    ][stage]

    gsap.set(root, { x: 0, y: 0, rotation: 0, scaleX: 1, scaleY: 1 })
    gsap.set(group, { scaleX: 1, scaleY: 1 })
    if (!config) return

    const tl = gsap.timeline({ repeat: -1 })
    const directions = dirs[config.hopCount - 1] || dirs[0]

    for (let i = 0; i < config.hopCount; i++) {
      const [dx, dy, angleSign, depth] = directions[i % directions.length]
      const jump = config.jump
      const targetAngle = angleSign * config.angle * (0.6 + Math.random() * 0.4)
      const overshootAngle = targetAngle * 1.2
      const xTarget = dx * jump
      const yTarget = dy * jump

      // Hop TO (overshoot with depth)
      tl.to(root, {
        x: xTarget * 1.1,
        y: yTarget * 1.15,
        rotation: overshootAngle,
        scaleX: 1 + (depth - 1) * 0.3,
        scaleY: 1 + (depth - 1) * 0.3,
        duration: config.hopSpeed,
        ease: "power2.out",
        transformOrigin: "60px 56px",
        force3D: true,
      }, 0)
      tl.to(group, {
        scaleY: 0.84,
        scaleX: 1.08,
        duration: config.hopSpeed,
        ease: "power2.out",
        transformOrigin: "60px 56px",
        force3D: true,
      }, 0)
      // Settle into peek (with depth settled)
      tl.to(root, {
        x: xTarget * 0.55,
        y: yTarget * 0.6,
        rotation: targetAngle,
        scaleX: depth,
        scaleY: depth,
        duration: config.hopSpeed * 0.3,
        ease: "power1.out",
      })
      tl.to(group, {
        scaleY: 1,
        scaleX: 1,
        duration: config.hopSpeed * 0.3,
        ease: "power1.out",
      }, "<")
      // Dwell peeking
      tl.to({}, { duration: config.dwell * 0.3 })

      // Hop BACK (overshoot opposite)
      const backAt = tl.totalDuration()
      tl.to(root, {
        x: -xTarget * 0.2,
        y: 0,
        rotation: -targetAngle * 0.15,
        scaleX: 1 + (1 - depth) * 0.2,
        scaleY: 1 + (1 - depth) * 0.2,
        duration: config.hopSpeed * 0.7,
        ease: "power2.out",
      }, backAt)
      tl.to(group, {
        scaleY: 0.86,
        scaleX: 1.06,
        duration: config.hopSpeed * 0.7,
        ease: "power2.out",
      }, backAt)
      // Settle center
      const settleAt = tl.totalDuration()
      tl.to(root, {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        duration: config.hopSpeed * 0.35,
        ease: "back.out(1.6)",
      }, settleAt)
      tl.to(group, {
        scaleY: 1,
        scaleX: 1,
        duration: config.hopSpeed * 0.35,
        ease: "back.out(1.6)",
      }, settleAt)
      // Dwell at center
      tl.to({}, { duration: config.dwell })
    }

    gsap.to(svg, {
      scaleY: 1 - config.breatheAmp,
      scaleX: 1 + config.breatheAmp * 0.5,
      duration: 3 - stage * 0.25,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      transformOrigin: "bottom center",
      force3D: true,
    })

    return () => {
      tl.kill()
      gsap.killTweensOf(root)
      gsap.killTweensOf(group)
      gsap.killTweensOf(svg)
    }
  }, [stage])

  // 3. Periodic bounce hop (stages 2+) — dramatic spring with depth.
  useEffect(() => {
    const root = rootAnimRef.current
    const group = plantGroupRef.current
    if (!root || !group || stage < 2) return

    const intervals = [0, 0, 4.5, 3.5, 2.5, 1.8]
    const bAmp = [6, 9, 12, 16][stage - 2]
    const rng = () => (Math.random() > 0.5 ? 1 : -1) * (0.3 + Math.random() * 0.7)

    const hop = () => {
      const tl = gsap.timeline()
      const dirX = rng()
      const dirY = -(0.5 + Math.random() * 0.5)
      const depth = 0.92 + Math.random() * 0.12

      tl.to(root, {
        x: dirX * bAmp * 0.3,
        y: 0,
        rotation: dirX * -4,
        scaleX: 1.02,
        scaleY: 0.98,
        duration: 0.08,
        ease: "power2.in",
        transformOrigin: "60px 56px",
      })
      tl.to(group, {
        scaleY: 0.82,
        scaleX: 1.12,
        duration: 0.08,
        ease: "power2.in",
        transformOrigin: "60px 56px",
      }, "<")
      const fwd = tl.totalDuration()
      tl.to(root, {
        x: dirX * bAmp * 0.9,
        y: dirY * bAmp * 0.8,
        rotation: dirX * 12,
        scaleX: depth * 1.04,
        scaleY: depth * 0.96,
        duration: 0.1,
        ease: "power2.out",
      }, fwd)
      tl.to(group, {
        scaleY: 1.2,
        scaleX: 0.88,
        duration: 0.1,
        ease: "power2.out",
      }, fwd)
      const peak = tl.totalDuration()
      tl.to(root, {
        x: dirX * bAmp * 0.5,
        y: dirY * bAmp * 0.4,
        rotation: dirX * 7,
        scaleX: depth,
        scaleY: depth,
        duration: 0.1,
        ease: "power1.out",
      }, peak)
      tl.to(group, {
        scaleY: 1.08,
        scaleX: 0.94,
        duration: 0.1,
        ease: "power1.out",
      }, peak)
      const end = tl.totalDuration()
      tl.to(root, {
        x: 0,
        y: 0,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.18,
        ease: "back.out(1.6)",
      }, end)
      tl.to(group, {
        scaleY: 1,
        scaleX: 1,
        duration: 0.18,
        ease: "back.out(1.6)",
      }, end)
    }

    hop()
    const id = setInterval(hop, intervals[stage] * 1000)

    return () => clearInterval(id)
  }, [stage])

  // 5. Pot idle animation — gentle float, tilt, and bounce
  useEffect(() => {
    const pot = potRef.current
    if (!pot || stage === 0) return

    gsap.killTweensOf(pot)

    const amp = [0, 0.3, 0.5, 0.8, 1.2, 1.6][stage]
    const speed = [0, 3, 2.5, 2, 1.5, 1.2][stage]

    gsap.to(pot, {
      y: -amp,
      rotation: amp * 0.6,
      duration: speed,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      transformOrigin: "60px 106px",
      force3D: true,
    })

    return () => gsap.killTweensOf(pot)
  }, [stage])

  // 6. Root group overall wobble — keeps everything connected
  useEffect(() => {
    const root = rootAnimRef.current
    if (!root || stage === 0) return

    gsap.killTweensOf(root)

    const amp = [0, 0.5, 1, 1.5, 2, 3][stage]
    const speed = [0, 4, 3.2, 2.5, 2, 1.5][stage]

    gsap.to(root, {
      rotation: amp,
      duration: speed,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      transformOrigin: "60px 106px",
      force3D: true,
    })

    return () => gsap.killTweensOf(root)
  }, [stage])

  // 7. Floating energy motes (stages 3+)
  useEffect(() => {
    if (stage < 3) return

    const particles = particleRefs.current.filter(Boolean) as HTMLDivElement[]

    particles.forEach((p, i) => {
      const pos = particlePositions[i]
      if (!pos) return
      const driftX = pos.driftX
      const rise = pos.rise
      const duration = pos.duration
      const startDelay = pos.delay

      const tl = gsap.timeline({ repeat: -1 })
      tl.set(p, { y: 0, x: 0, opacity: 0, scale: 0.4 })
      tl.to(p, {
        opacity: 0.65,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
      })
      tl.to(p, {
        y: -rise,
        x: driftX,
        opacity: 0,
        scale: 0.3,
        duration,
        ease: "power1.in",
      }, `>-0.05`)
      tl.to(p, {
        y: 0,
        x: 0,
        duration: 0.1,
      })

      if (startDelay > 0) {
        tl.delay(startDelay)
      }
    })

    return () => {
      particles.forEach((p) => gsap.killTweensOf(p))
    }
  }, [stage, particlePositions])

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-visible">
      {/* ── Outer Glowing Halo ── */}
      <div
        className="absolute w-[280px] h-[280px] rounded-full filter blur-[40px] opacity-15 pointer-events-none -z-10 animate-pulse"
        style={{
          background: streak === 0
            ? "radial-gradient(circle, #F97316 0%, transparent 70%)"
            : "radial-gradient(circle, #10B981 0%, transparent 70%)",
          transition: "background 0.5s ease"
        }}
      />

      {/* ── Plant Graphic SVG ── */}
      <svg
        ref={plantContainerRef}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ transformOrigin: "bottom center", overflow: "visible" }}
      >
        <defs>
          <linearGradient id="leafGrad" x1="0" y1="1" x2="0.8" y2="0">
            <stop offset="0%" stopColor={theme.leaf[0]} />
            <stop offset="100%" stopColor={theme.leaf[1]} />
          </linearGradient>
          <linearGradient id="potGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={theme.pot[0]} />
            <stop offset="100%" stopColor={theme.pot[1]} />
          </linearGradient>
          <linearGradient id="flowerGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={theme.flower} />
            <stop offset="100%" stopColor={theme.accent} />
          </linearGradient>
          <linearGradient id="acornGrad" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#78350F" />
            <stop offset="100%" stopColor="#A16207" />
          </linearGradient>
          <linearGradient id="opalRingGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>
        </defs>

        {/* ── Progress Ring ── */}
        <circle
          cx="60"
          cy="60"
          r="45"
          stroke={streak === 0 ? "rgba(249, 115, 22, 0.08)" : "rgba(255,255,255,0.04)"}
          strokeWidth="3.5"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r="45"
          stroke={streak === 0 ? "rgba(249, 115, 22, 0.2)" : theme.accent}
          strokeOpacity="0.5"
          strokeWidth="3.5"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          fill="none"
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.16, 1, 0.3, 1), stroke-opacity 0.4s ease" }}
        />

        {/* ── Root animation group (pot + plant move together) ── */}
        <g ref={rootAnimRef}>
          {/* ── Pot & Soil ── */}
          <g ref={potRef}>
            <ellipse cx="60" cy="106" rx="36" ry="5" fill="rgba(0,0,0,0.4)" />
            <path d="M34,56 L38,100 Q60,103 82,100 L86,56 Z" fill="url(#potGrad)" />
            <rect x="30" y="50" width="60" height="8" rx="2" fill={theme.pot[0]} />
            <ellipse cx="60" cy="56" rx="26" ry="3" fill="#451A03" />
          </g>

          {/* ── Playful Mascot Face on Pot ── */}
          <g className="pointer-events-none select-none">
            {completed ? (
              <>
                <path d="M43,76 L48,72 L53,76" stroke="#08090C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M67,76 L72,72 L77,76" stroke="#08090C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M55,80 C55,86 65,86 65,80 Z" fill="#991B1B" />
                <path d="M56,82 C58,85 62,85 64,82" fill="#F87171" />
              </>
            ) : streak === 0 ? (
              <>
                <path d="M43,75 Q48,79 53,75" stroke="rgba(8, 9, 12, 0.65)" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M67,75 Q72,79 77,75" stroke="rgba(8, 9, 12, 0.65)" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="60" cy="80.5" r="1.5" fill="rgba(8, 9, 12, 0.65)" />
              </>
            ) : (
              <>
                <circle cx="48" cy="74" r="3.5" fill="#08090C" />
                <circle cx="49.5" cy="72.5" r="1.2" fill="#FFFFFF" />
                <circle cx="72" cy="74" r="3.5" fill="#08090C" />
                <circle cx="73.5" cy="72.5" r="1.2" fill="#FFFFFF" />
                <path d="M57,80 Q60,83 63,80" stroke="#08090C" strokeWidth="2" strokeLinecap="round" fill="none" />
                <circle cx="42" cy="78" r="2.2" fill="#EF4444" opacity="0.35" />
                <circle cx="78" cy="78" r="2.2" fill="#EF4444" opacity="0.35" />
              </>
            )}
          </g>

          {/* ── Plant Group ── */}
          <g style={{ transform: `scale(${dailyScale})`, transformOrigin: "60px 56px", transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
          <g ref={plantGroupRef}>
            {stage === 0 && (
              <g transform="translate(60, 54) scale(0.08) rotate(15) translate(-128, -240)">
                <path d={ACORN_PATH} fill="url(#acornGrad)" />
                <path d={ACORN_PATH} stroke="rgba(255,255,255,0.15)" strokeWidth="6" fill="none" />
              </g>
            )}

            {stage === 1 && (
              <g>
                <path d="M60,56 Q58,48 60,43" stroke={theme.leaf[1]} strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <g transform="translate(60, 43) scale(0.08) rotate(-40) translate(-42.55, -210.13)">
                  <path d={LEAF_PATH} fill="url(#leafGrad)" />
                  <path d={LEAF_PATH} stroke={theme.leaf[1]} strokeWidth="6" fill="none" opacity="0.35" />
                  <path d="M56.74,195.94 L153.75,110.94" stroke="rgba(255,255,255,0.4)" strokeWidth="10" strokeLinecap="round" fill="none" />
                </g>
              </g>
            )}

            {stage === 2 && (
              <g>
                <path d="M60,56 Q62,44 59,34" stroke={theme.leaf[1]} strokeWidth="3" strokeLinecap="round" fill="none" />
                <g transform="translate(60, 44) scale(0.08) rotate(-110) translate(-42.55, -210.13)">
                  <path d={LEAF_PATH} fill="url(#leafGrad)" />
                  <path d={LEAF_PATH} stroke={theme.leaf[1]} strokeWidth="6" fill="none" opacity="0.35" />
                  <path d="M56.74,195.94 L153.75,110.94" stroke="rgba(255,255,255,0.4)" strokeWidth="10" strokeLinecap="round" fill="none" />
                </g>
                <g transform="translate(59, 34) scale(0.1) rotate(-10) translate(-42.55, -210.13)">
                  <path d={LEAF_PATH} fill="url(#leafGrad)" />
                  <path d={LEAF_PATH} stroke={theme.leaf[1]} strokeWidth="6" fill="none" opacity="0.35" />
                  <path d="M56.74,195.94 L153.75,110.94" stroke="rgba(255,255,255,0.4)" strokeWidth="10" strokeLinecap="round" fill="none" />
                </g>
              </g>
            )}

            {stage === 3 && (
              <g>
                <path d="M60,56 Q58,42 60,30" stroke={theme.leaf[1]} strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <g transform="translate(60, 30) scale(0.17) translate(-128, -224)">
                  <path d={PLANT_PATH} fill="url(#leafGrad)" />
                  <path d={PLANT_PATH} stroke={theme.leaf[1]} strokeWidth="5" fill="none" opacity="0.3" />
                  <path d="M81,173 Q65,150 48,156" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M163,150 Q180,147 199,146" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M128,194 Q128,140 128,95" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round" fill="none" />
                </g>
              </g>
            )}

            {stage === 4 && (
              <g>
                <path d="M60,56 Q58,40 60,26" stroke={theme.leaf[1]} strokeWidth="3.5" strokeLinecap="round" fill="none" />
                <g transform="translate(60, 26) scale(0.19) translate(-128, -224)">
                  <path d={PLANT_PATH} fill="url(#leafGrad)" />
                  <path d={PLANT_PATH} stroke={theme.leaf[1]} strokeWidth="5" fill="none" opacity="0.3" />
                  <path d="M81,173 Q65,150 48,156" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M163,150 Q180,147 199,146" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M128,194 Q128,140 128,95" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round" fill="none" />

                  <g transform="translate(128, 95) scale(0.2) translate(-128, -219)">
                    <path d={FLOWER_PATH} fill="url(#flowerGrad)" />
                    <path d={FLOWER_PATH} stroke="rgba(255,255,255,0.25)" strokeWidth="8" fill="none" />
                  </g>
                  <g transform="translate(199, 146) scale(0.16) rotate(25) translate(-128, -219)">
                    <path d={FLOWER_PATH} fill="url(#flowerGrad)" />
                    <path d={FLOWER_PATH} stroke="rgba(255,255,255,0.25)" strokeWidth="8" fill="none" />
                  </g>
                </g>
              </g>
            )}

            {stage === 5 && (
              <g>
                <path d="M60,56 Q58,38 60,22" stroke={theme.leaf[1]} strokeWidth="4" strokeLinecap="round" fill="none" />
                <g transform="translate(60, 22) scale(0.21) translate(-128, -224)">
                  <path d={PLANT_PATH} fill="url(#leafGrad)" />
                  <path d={PLANT_PATH} stroke={theme.leaf[1]} strokeWidth="5" fill="none" opacity="0.3" />
                  <path d="M81,173 Q65,150 48,156" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M163,150 Q180,147 199,146" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round" fill="none" />
                  <path d="M128,194 Q128,140 128,95" stroke="rgba(255,255,255,0.3)" strokeWidth="8" strokeLinecap="round" fill="none" />

                  <g transform="translate(128, 95) scale(0.22) translate(-128, -219)">
                    <path d={FLOWER_PATH} fill="url(#flowerGrad)" />
                    <path d={FLOWER_PATH} stroke="rgba(255,255,255,0.25)" strokeWidth="8" fill="none" />
                  </g>
                  <g transform="translate(199, 146) scale(0.18) rotate(30) translate(-128, -219)">
                    <path d={FLOWER_PATH} fill="url(#flowerGrad)" />
                    <path d={FLOWER_PATH} stroke="rgba(255,255,255,0.25)" strokeWidth="8" fill="none" />
                  </g>
                  <g transform="translate(48, 156) scale(0.16) rotate(-30) translate(-128, -219)">
                    <path d={FLOWER_PATH} fill="url(#flowerGrad)" />
                    <path d={FLOWER_PATH} stroke="rgba(255,255,255,0.25)" strokeWidth="8" fill="none" />
                  </g>
                </g>

                <g transform="translate(40, 56) scale(0.07) rotate(-130) translate(-42.55, -210.13)">
                  <path d={LEAF_PATH} fill="url(#leafGrad)" />
                  <path d={LEAF_PATH} stroke={theme.leaf[1]} strokeWidth="6" fill="none" opacity="0.35" />
                </g>
                <g transform="translate(80, 56) scale(0.07) rotate(30) translate(-42.55, -210.13)">
                  <path d={LEAF_PATH} fill="url(#leafGrad)" />
                  <path d={LEAF_PATH} stroke={theme.leaf[1]} strokeWidth="6" fill="none" opacity="0.35" />
                </g>
              </g>
            )}
          </g>
          </g>
        </g>
      </svg>

      {/* ── Floating Energy Motes (stages 3+) ── */}
      {stage >= 3 && (
        <div className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden="true">
          {particlePositions.map((pos, i) => (
            <div
              key={i}
              ref={(el) => { particleRefs.current[i] = el }}
              className="absolute w-[5px] h-[5px] rounded-full"
              style={{
                left: pos.left,
                bottom: "30%",
                background: i % 2 === 0 ? "#10B981" : "#34D399",
                boxShadow: "0 0 6px rgba(16,185,129,0.5), 0 0 12px rgba(16,185,129,0.2)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}