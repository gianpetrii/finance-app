"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Overview } from "../components/Overview"
import { RecentTransactions } from "../components/RecentTransactions"
import { ExpensePieChart } from "../components/ExpensePieChart"
import { NewTransactionModal } from "@/components/NewTransactionModal"
import { TimeframeFilter, type TimeframeFilterValue } from "@/components/TimeframeFilter"
import { Spinner } from "@/components/ui/spinner"
import { subDays, startOfMonth, endOfMonth } from "date-fns"
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Settings
} from "lucide-react"
import { useAuth } from "@/lib/hooks/useAuth"
import { useTransactions } from "@/lib/hooks/useTransactions"
import { useFinancialSettings } from "@/lib/hooks/useFinancialSettings"

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
            <h3 className="text-2xl sm:text-3xl font-bold">{value}</h3>
            {change && (
              <span className={`text-xs font-medium flex items-center gap-1 ${changeColors[changeType || "neutral"]}`}>
                {TrendIcon && <TrendIcon className="h-3 w-3" />}
                {change}
              </span>
            )}
          </div>
          <div className="rounded-lg bg-primary/10 p-3 shrink-0">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  
  // Hooks de datos reales
  const currentMonth = new Date()
  const { transactions, loading: transactionsLoading } = useTransactions({
    startDate: startOfMonth(currentMonth),
    endDate: endOfMonth(currentMonth)
  })
  const { settings, loading: settingsLoading } = useFinancialSettings()
  
  // Estados para el modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense")
  
  // Estado para el filtro de timeframe
  const [timeframeFilter, setTimeframeFilter] = useState<TimeframeFilterValue>({
    mode: "preset",
    preset: "30days",
    startDate: subDays(new Date(), 30),
    endDate: new Date(),
  })

  // Calcular KPIs desde datos reales
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const balance = totalIncome - totalExpenses
  const dailyBudget = settings?.dailyBudget || 0
  const monthlyIncome = settings?.monthlyIncome || 0

  // Gastos de hoy
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const gastosHoy = transactions
    .filter(t => {
      if (t.type !== 'expense') return false
      const transDate = t.date?.toDate ? t.date.toDate() : new Date(t.date)
      transDate.setHours(0, 0, 0, 0)
      return transDate.getTime() === today.getTime()
    })
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  // Loading state
  if (transactionsLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Spinner size="lg" />
      </div>
    )
  }

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
          title="Balance del Mes"
          value={`$${balance.toLocaleString()}`}
          change={balance >= 0 ? "Positivo" : "Negativo"}
          changeType={balance >= 0 ? "positive" : "negative"}
          trend={balance >= 0 ? "up" : "down"}
          icon={Wallet}
        />
        <KPICard
          title="Gastos Hoy"
          value={`$${gastosHoy.toLocaleString()}`}
          change={`$${dailyBudget.toLocaleString('es-ES', { maximumFractionDigits: 0 })} límite`}
          changeType={gastosHoy > dailyBudget ? "negative" : "positive"}
          icon={TrendingDown}
        />
        <KPICard
          title="Ingresos del Mes"
          value={`$${totalIncome.toLocaleString()}`}
          change={`$${monthlyIncome.toLocaleString()} esperado`}
          changeType={totalIncome >= monthlyIncome ? "positive" : "neutral"}
          trend={totalIncome >= monthlyIncome ? "up" : "stable"}
          icon={TrendingUp}
        />
        <KPICard
          title="Presupuesto Diario"
          value={`$${dailyBudget.toLocaleString('es-ES', { maximumFractionDigits: 0 })}`}
          change={`${new Date().getDate()} días transcurridos`}
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
              <Button 
                className="gap-2"
                onClick={() => {
                  setTransactionType("expense")
                  setIsModalOpen(true)
                }}
              >
                <Plus className="h-4 w-4" />
                Agregar Gasto
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => {
                  setTransactionType("income")
                  setIsModalOpen(true)
                }}
              >
                <TrendingUp className="h-4 w-4" />
                Agregar Ingreso
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => window.location.href = "/settings"}
              >
                <Settings className="h-4 w-4" />
                Configurar Finanzas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtro de Timeframe */}
      <Card className="border-2 border-primary/10">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-sm mb-1">Filtros de Análisis</h3>
              <p className="text-xs text-muted-foreground">
                Personaliza el período de tiempo para los gráficos
              </p>
            </div>
            <TimeframeFilter 
              value={timeframeFilter} 
              onChange={setTimeframeFilter}
            />
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
              {timeframeFilter.mode === "dayOfWeek" && timeframeFilter.dayOfWeek !== undefined
                ? `Solo ${["Domingos", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábados"][timeframeFilter.dayOfWeek]}`
                : "Comparativa del período seleccionado"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            <Overview filter={timeframeFilter} />
          </CardContent>
        </Card>

        <Card className="border border-border/50 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              Distribución por Categoría
            </CardTitle>
            <CardDescription>
              {timeframeFilter.mode === "dayOfWeek" && timeframeFilter.dayOfWeek !== undefined
                ? `Gastos en ${["Domingos", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábados"][timeframeFilter.dayOfWeek]}`
                : "Dónde se va tu dinero"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 h-[350px]">
            <ExpensePieChart filter={timeframeFilter} />
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
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = "/transactions"}
            >
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

      {/* Modal de Nueva Transacción */}
      <NewTransactionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultType={transactionType}
        onSuccess={() => {
          // Aquí podrías recargar los datos del dashboard
          console.log("Transacción guardada exitosamente")
        }}
      />
    </div>
  )
}
