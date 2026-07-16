"use client"

import { ReactNode } from "react"
import PageTransition from "./PageTransition"
import NavDock from "./NavDock"

export default function LayoutClient({ children }: { children: ReactNode }) {
  return (
    <>
      <NavDock />
      <PageTransition>
        {children}
      </PageTransition>
    </>
  )
}
