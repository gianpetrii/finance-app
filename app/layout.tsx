import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import type React from "react"
import { ClientWrapper } from "./components/ClientWrapper"
import { Toaster } from "sonner"
import { ConditionalLayout } from "./components/ConditionalLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "FinanzApp - Gestiona tus Finanzas de Manera Inteligente",
    template: "%s | FinanzApp",
  },
  description: "Controla tus ingresos, gastos y ahorros de forma simple y efectiva. FinanzApp te ayuda a gestionar tu dinero con herramientas inteligentes y visualizaciones claras.",
  keywords: ["finanzas personales", "control de gastos", "presupuesto", "ahorro", "gestión financiera", "app de finanzas"],
  authors: [{ name: "FinanzApp Team" }],
  creator: "FinanzApp",
  publisher: "FinanzApp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://finance-app-three-steel.vercel.app'),
  openGraph: {
    title: "FinanzApp - Gestiona tus Finanzas de Manera Inteligente",
    description: "Controla tus ingresos, gastos y ahorros de forma simple y efectiva.",
    url: 'https://finance-app-three-steel.vercel.app',
    siteName: 'FinanzApp',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "FinanzApp - Gestiona tus Finanzas",
    description: "Controla tus ingresos, gastos y ahorros de forma simple y efectiva.",
    creator: '@finanzapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
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
          <ClientWrapper />
          <Toaster position="top-center" richColors />
          <div className="flex min-h-screen flex-col">
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

