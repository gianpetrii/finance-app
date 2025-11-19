"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  CreditCard, 
  FileText, 
  Calendar,
  PieChart,
  Target,
  TrendingUp,
  Wallet
} from "lucide-react"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Transacciones", href: "/transactions", icon: FileText },
  { name: "Gastos Diarios", href: "/daily-expenses", icon: Calendar },
  { name: "Presupuesto", href: "/budget", icon: PieChart },
  { name: "Metas", href: "/goals", icon: Target },
  { name: "Reportes", href: "/reports", icon: TrendingUp },
  { name: "Cuentas", href: "/accounts", icon: Wallet },
  { name: "Tarjetas", href: "/cards", icon: CreditCard },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="h-full w-full lg:w-64 bg-background">
      {/* Desktop Sidebar */}
      <nav className="hidden lg:block h-full py-6">
        <div className="px-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px]">{item.name.split(" ")[0]}</span>
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  )
}

