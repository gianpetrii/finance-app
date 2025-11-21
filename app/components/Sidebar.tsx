"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Home, 
  FileText, 
  Calendar,
  Target,
  TrendingUp,
  Wallet,
  ChevronLeft,
  ChevronRight,
  Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Gastos Diarios", href: "/daily-expenses", icon: Calendar },
  { name: "Metas", href: "/goals", icon: Target },
  { name: "Billetera", href: "/wallet", icon: Wallet },
  { name: "Reportes", href: "/reports", icon: TrendingUp },
  { name: "Transacciones", href: "/transactions", icon: FileText },
  { name: "Configuración", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <aside 
      className={cn(
        "h-full bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-full lg:w-64"
      )}
    >
      {/* Desktop Sidebar */}
      <nav className="hidden lg:flex h-full flex-col py-6">
        {/* Toggle Button */}
        <div className={cn(
          "px-3 mb-4 flex",
          isCollapsed ? "justify-center" : "justify-end"
        )}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="px-3 space-y-1 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          ))}
        </div>

        {/* Footer Info (when expanded) */}
        {!isCollapsed && (
          <div className="px-6 py-4 border-t">
            <p className="text-xs text-muted-foreground">
              FinanzApp v1.0
            </p>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden">
        <div className="flex justify-around items-center h-16 px-2 border-t">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-2 text-xs font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
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
