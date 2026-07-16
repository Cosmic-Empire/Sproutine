"use client"

import { useRef, useImperativeHandle, forwardRef } from "react"
import gsap from "gsap"

const LEAF_PATH = "M223.45,40.07a8,8,0,0,0-7.52-7.52C139.8,28.08,78.82,51,52.82,94a87.09,87.09,0,0,0-12.76,49A101.72,101.72,0,0,0,46.7,175.2a4,4,0,0,0,6.61,1.43l85-86.3a8,8,0,0,1,11.32,11.32L56.74,195.94,42.55,210.13a8.2,8.2,0,0,0-.6,11.1,8,8,0,0,0,11.71.43l16.79-16.79c14.14,6.84,28.41,10.57,42.56,11.07q1.67.06,3.33.06A86.93,86.93,0,0,0,162,203.18C205,177.18,227.93,116.21,223.45,40.07Z"

export type LeafBurstHandle = {
  fire: () => void
}

// Drop <LeafBurst ref={burstRef} /> inside the same relatively-positioned
// wrapper as your button, then call burstRef.current?.fire() from the
// button's onClick alongside whatever else already happens on tap.
const LeafBurst = forwardRef<LeafBurstHandle>((_props, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useImperativeHandle(ref, () => ({
    fire() {
      const container = containerRef.current
      if (!container) return

      const leafCount = 7
      const leaves: SVGSVGElement[] = []

      for (let i = 0; i < leafCount; i++) {
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
        svg.setAttribute("viewBox", "0 0 256 256")
        svg.setAttribute("width", "18")
        svg.setAttribute("height", "18")
        svg.style.position = "absolute"
        svg.style.left = "50%"
        svg.style.top = "50%"
        svg.style.pointerEvents = "none"
        svg.style.opacity = "0"

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
        path.setAttribute("d", LEAF_PATH)
        path.setAttribute("fill", i % 2 === 0 ? "#10B981" : "#34D399")
        svg.appendChild(path)

        container.appendChild(svg)
        leaves.push(svg)
      }

      const tl = gsap.timeline({
        onComplete: () => {
          leaves.forEach((leaf) => leaf.remove())
        },
      })

      leaves.forEach((leaf, i) => {
        const angle = (i / leafCount) * Math.PI * 2 + Math.random() * 0.4
        const distance = 46 + Math.random() * 22
        const x = Math.cos(angle) * distance
        const y = Math.sin(angle) * distance - 10

        tl.fromTo(
          leaf,
          { opacity: 0, scale: 0.3, x: 0, y: 0, rotate: 0 },
          {
            opacity: 1,
            scale: 1,
            x,
            y,
            rotate: (Math.random() - 0.5) * 200,
            duration: 0.55,
            ease: "power2.out",
          },
          0
        ).to(
          leaf,
          {
            opacity: 0,
            y: y - 18,
            duration: 0.4,
            ease: "power1.in",
          },
          0.35
        )
      })
    },
  }))

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-visible"
      aria-hidden="true"
    />
  )
})

LeafBurst.displayName = "LeafBurst"

export default LeafBurst