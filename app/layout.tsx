import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Sidebar } from "./components/Sidebar"
import { ThemeProvider } from "@/components/ThemeProvider"
import type React from "react"
import dynamic from 'next/dynamic'

const inter = Inter({ subsets: ["latin"] })

// Cargar Firebase dinámicamente solo en el cliente
const FirebaseInitializer = dynamic(
  () => import('./components/FirebaseInitializer').then(mod => mod.FirebaseInitializer),
  { ssr: false }
)

export const metadata: Metadata = {
  title: "Finance App",
  description: "Manage your finances with ease",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <FirebaseInitializer />
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 md:ml-64 transition-all duration-200">
              <div className="container px-4 md:px-6 py-6 md:py-8 mx-auto">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

