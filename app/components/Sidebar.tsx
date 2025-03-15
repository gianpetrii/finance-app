"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, CreditCard, FileText, Bell, Settings, Menu, X, LogIn, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./ThemeToggle"

const navItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Transacciones", href: "/transactions", icon: FileText },
  { name: "Tarjetas", href: "/cards", icon: CreditCard },
  { name: "Servicios", href: "/services", icon: Settings },
  { name: "Notificaciones", href: "/notifications", icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-2 left-2 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-40`}
      >
        <div className="flex h-full w-64 flex-col bg-background text-foreground border-r border-border">
          <div className="p-4 mt-12 md:mt-0 border-b border-border flex justify-between items-center">
            <h1 className="text-2xl font-bold">FinanzApp</h1>
            <ThemeToggle />
          </div>
          <nav className="flex-1 overflow-y-auto">
            <ul className="py-2">
              {navItems.map((item) => (
                <li key={item.name} className="px-4 py-2">
                  <Link href={item.href} className="flex items-center text-sm group" onClick={() => setIsOpen(false)}>
                    <item.icon className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span
                      className={`transition-colors ${
                        pathname === item.href
                          ? "text-foreground font-medium"
                          : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="p-4 border-t border-border">
            <Button variant="outline" className="w-full mb-2" onClick={() => console.log("Login clicked")}>
              <LogIn className="mr-2 h-4 w-4" /> Login
            </Button>
            <Button variant="default" className="w-full" onClick={() => console.log("Sign up clicked")}>
              <UserPlus className="mr-2 h-4 w-4" /> Sign Up
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

