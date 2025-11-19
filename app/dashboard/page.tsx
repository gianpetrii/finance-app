"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Overview } from "../components/Overview"
import { RecentTransactions } from "../components/RecentTransactions"
import { ExpensePieChart } from "../components/ExpensePieChart"
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Target,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CreditCard
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"

// Componente de KPI Card mejorado
function KPICard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  trend 
}: { 
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: any
  trend?: "up" | "down" | "stable"
}) {
  const changeColors = {
    positive: "text-green-600 dark:text-green-400",
    negative: "text-red-600 dark:text-red-400",
    neutral: "text-muted-foreground"
  }

  const TrendIcon = trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : null

  return (
    <Card className="border border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-bold">{value}</h3>
              {change && (
                <span className={`text-sm font-medium flex items-center gap-1 ${changeColors[changeType || "neutral"]}`}>
                  {TrendIcon && <TrendIcon className="h-4 w-4" />}
                  {change}
                </span>
              )}
            </div>
          </div>
          <div className="rounded-lg bg-primary/10 p-3">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [saldoActual, setSaldoActual] = useState(10000)
  const [creditoAPagar, setCreditoAPagar] = useState(2000)
  const [saldoReal, setSaldoReal] = useState(0)
  const [montoDiario, setMontoDiario] = useState(0)
  const [gastosHoy] = useState(150)
  const [ahorroMes] = useState(1200)

  useEffect(() => {
    // Calcular saldo real
    const nuevoSaldoReal = saldoActual - creditoAPagar
    setSaldoReal(nuevoSaldoReal)

    // Calcular monto diario (asumiendo un mes de 30 días)
    const nuevoMontoDiario = nuevoSaldoReal / 30
    setMontoDiario(nuevoMontoDiario)
  }, [saldoActual, creditoAPagar])

  // Obtener saludo según la hora
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }

  // Obtener mes actual
  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Header con saludo personalizado */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {getGreeting()}, {user?.displayName?.split(' ')[0] || 'Usuario'} 👋
        </h1>
        <p className="text-muted-foreground">
          Resumen de {getCurrentMonth()}
        </p>
      </div>

      {/* KPIs Principales - Lo más importante primero */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Saldo Real"
          value={`$${saldoReal.toLocaleString()}`}
          change="+12%"
          changeType="positive"
          trend="up"
          icon={Wallet}
        />
        <KPICard
          title="Gastos Hoy"
          value={`$${gastosHoy.toLocaleString()}`}
          change="$200 límite"
          changeType="neutral"
          icon={TrendingDown}
        />
        <KPICard
          title="Ahorro del Mes"
          value={`$${ahorroMes.toLocaleString()}`}
          change="+8%"
          changeType="positive"
          trend="up"
          icon={Target}
        />
        <KPICard
          title="Disponible/Día"
          value={`$${Math.round(montoDiario).toLocaleString()}`}
          change="20 días restantes"
          changeType="neutral"
          icon={Calendar}
        />
      </div>

      {/* Quick Actions */}
      <Card className="border-2 border-dashed border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Acciones Rápidas</h3>
              <p className="text-sm text-muted-foreground">
                Registra tus movimientos financieros en segundos
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Gasto
              </Button>
              <Button variant="outline" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Agregar Ingreso
              </Button>
              <Button variant="outline" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Ver Tarjetas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráficos - Análisis Visual */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              Gastos vs Ingresos
            </CardTitle>
            <CardDescription>
              Comparativa de los últimos 6 meses
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            <Overview />
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              Distribución por Categoría
            </CardTitle>
            <CardDescription>
              Dónde se va tu dinero este mes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            <ExpensePieChart />
          </CardContent>
        </Card>
      </div>

      {/* Transacciones Recientes */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary"></span>
                Transacciones Recientes
              </CardTitle>
              <CardDescription>
                Últimos movimientos de tu cuenta
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Ver todas →
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <RecentTransactions />
        </CardContent>
      </Card>

      {/* Insights y Recomendaciones */}
      <Card className="border border-border/50 shadow-sm bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary/20 p-3">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">💡 Insight del Día</h3>
              <p className="text-sm text-muted-foreground mb-3">
                ¡Excelente! Estás gastando 15% menos que el mes pasado en &quot;Comida&quot;. 
                Si mantienes este ritmo, podrías ahorrar $500 adicionales este mes.
              </p>
              <Button variant="link" className="p-0 h-auto">
                Ver más recomendaciones →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden"></div>
    </div>
  )
}
