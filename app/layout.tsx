import type { Metadata } from "next"
import "./globals.css"
import LayoutClient from "@/components/LayoutClient"

export const metadata: Metadata = {
  title: "Sproutine",
  description: "Daily Khan Academy prep tracker",
  manifest: "/manifest.json",
  other: {
    "theme-color": "#0A0A0A",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@1,2,3,4,5,6,7,8,9&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col relative bg-[#08090C] text-[#F3F4F6] antialiased selection:bg-[#10B981]/30">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  )
}

