"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { useTransactions } from "@/lib/hooks/useTransactions"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  PieChart,
  BarChart3,
  ArrowUpCircle,
  ArrowDownCircle,
  Activity
} from "lucide-react"
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns"
import { es } from "date-fns/locale"

// Tipos
interface MonthlyData {
  month: string
  income: number
  expenses: number
  savings: number
}

const categoryColors: Record<string, string> = {
  "Alimentación": "bg-orange-500",
  "Transporte": "bg-blue-500",
  "Servicios": "bg-yellow-500",
  "Ocio": "bg-purple-500",
  "Salud": "bg-green-500",
  "Ropa": "bg-pink-500",
  "Educación": "bg-indigo-500",
  "Entretenimiento": "bg-red-500",
  "Otros": "bg-gray-500"
}

export default function ReportsPage() {
  const { transactions, loading } = useTransactions()
  const [selectedPeriod, setSelectedPeriod] = useState("6months")

  // Calcular datos mensuales desde transacciones reales
  const monthlyData = useMemo(() => {
    if (!transactions.length) return []
    
    const months = selectedPeriod === "6months" ? 6 : 12
    const data: MonthlyData[] = []
    
    for (let i = months - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i)
      const monthStart = startOfMonth(date)
      const monthEnd = endOfMonth(date)
      
      const monthTransactions = transactions.filter(t => {
        const transDate = t.date?.toDate ? t.date.toDate() : new Date(t.date)
        return transDate >= monthStart && transDate <= monthEnd
      })
      
      const income = monthTransactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      
      const expenses = monthTransactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      
      data.push({
        month: format(date, "MMMM", { locale: es }),
        income,
        expenses,
        savings: income - expenses
      })
    }
    
    return data
  }, [transactions, selectedPeriod])

  // Calcular gastos por categoría
  const categoryExpenses = useMemo(() => {
    if (!transactions.length) return []
    
    const expenseTransactions = transactions.filter(t => t.type === "expense")
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
    
    if (totalExpenses === 0) return []
    
    const categoryMap: Record<string, number> = {}
    
    expenseTransactions.forEach(t => {
      const category = t.category || "Otros"
      categoryMap[category] = (categoryMap[category] || 0) + (t.amount || 0)
    })
    
    return Object.entries(categoryMap)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: Math.round((amount / totalExpenses) * 100),
        color: categoryColors[category] || "bg-gray-500"
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [transactions])

  // Calcular estadísticas
  const totalIncome = monthlyData.reduce((sum, m) => sum + m.income, 0)
  const totalExpenses = monthlyData.reduce((sum, m) => sum + m.expenses, 0)
  const totalSavings = monthlyData.reduce((sum, m) => sum + m.savings, 0)
  const avgMonthlyIncome = monthlyData.length > 0 ? totalIncome / monthlyData.length : 0
  const avgMonthlyExpenses = monthlyData.length > 0 ? totalExpenses / monthlyData.length : 0
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0

  // Comparación con mes anterior
  const currentMonth = monthlyData[monthlyData.length - 1] || { income: 0, expenses: 0, savings: 0 }
  const previousMonth = monthlyData[monthlyData.length - 2] || { income: 0, expenses: 0, savings: 0 }
  const incomeChange = previousMonth.income > 0 ? ((currentMonth.income - previousMonth.income) / previousMonth.income) * 100 : 0
  const expensesChange = previousMonth.expenses > 0 ? ((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100 : 0

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-primary" />
            Reportes y Análisis
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualiza tus finanzas en detalle
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">1 Mes</SelectItem>
              <SelectItem value="3months">3 Meses</SelectItem>
              <SelectItem value="6months">6 Meses</SelectItem>
              <SelectItem value="1year">1 Año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Exportar</span>
          </Button>
        </div>
      </div>

      {/* KPIs Principales */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              {incomeChange >= 0 ? (
                <ArrowUpCircle className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownCircle className="h-4 w-4 text-red-500" />
              )}
              <span className={incomeChange >= 0 ? "text-green-600" : "text-red-600"}>
                {Math.abs(incomeChange).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Gastos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-2 text-sm">
              {expensesChange >= 0 ? (
                <ArrowUpCircle className="h-4 w-4 text-red-500" />
              ) : (
                <ArrowDownCircle className="h-4 w-4 text-green-500" />
              )}
              <span className={expensesChange >= 0 ? "text-red-600" : "text-green-600"}>
                {Math.abs(expensesChange).toFixed(1)}%
              </span>
              <span className="text-muted-foreground">vs mes anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              Ahorros Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${totalSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Promedio: ${(totalSavings / monthlyData.length).toFixed(0)}/mes
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              Tasa de Ahorro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {savingsRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              de tus ingresos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Tendencia Mensual */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Tendencia Mensual
          </CardTitle>
          <CardDescription>
            Comparación de ingresos, gastos y ahorros por mes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {monthlyData.map((month, index) => {
              const maxValue = Math.max(month.income, month.expenses, month.savings)
              const incomeWidth = (month.income / maxValue) * 100
              const expensesWidth = (month.expenses / maxValue) * 100
              const savingsWidth = (month.savings / maxValue) * 100

              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{month.month}</span>
                    <div className="flex gap-4 text-xs">
                      <span className="text-green-600">
                        +${month.income.toLocaleString()}
                      </span>
                      <span className="text-red-600">
                        -${month.expenses.toLocaleString()}
                      </span>
                      <span className="text-blue-600">
                        ${month.savings.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    {/* Ingresos */}
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-xs text-muted-foreground">Ingresos</div>
                      <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                        <div 
                          className="h-full bg-green-500 flex items-center justify-end pr-2"
                          style={{ width: `${incomeWidth}%` }}
                        >
                          {incomeWidth > 20 && (
                            <span className="text-xs text-white font-medium">
                              ${month.income.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Gastos */}
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-xs text-muted-foreground">Gastos</div>
                      <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                        <div 
                          className="h-full bg-red-500 flex items-center justify-end pr-2"
                          style={{ width: `${expensesWidth}%` }}
                        >
                          {expensesWidth > 20 && (
                            <span className="text-xs text-white font-medium">
                              ${month.expenses.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Ahorros */}
                    <div className="flex items-center gap-2">
                      <div className="w-20 text-xs text-muted-foreground">Ahorros</div>
                      <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 flex items-center justify-end pr-2"
                          style={{ width: `${savingsWidth}%` }}
                        >
                          {savingsWidth > 20 && (
                            <span className="text-xs text-white font-medium">
                              ${month.savings.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Comparación de Promedios */}
      <Card>
        <CardHeader>
          <CardTitle>Promedios del Período</CardTitle>
          <CardDescription>
            Análisis de tus promedios mensuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Ingreso Promedio</span>
              </div>
              <p className="text-3xl font-bold">${avgMonthlyIncome.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">por mes</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm">Gasto Promedio</span>
              </div>
              <p className="text-3xl font-bold">${avgMonthlyExpenses.toFixed(0)}</p>
              <p className="text-xs text-muted-foreground">por mes</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Ahorro Promedio</span>
              </div>
              <p className="text-3xl font-bold">
                ${((avgMonthlyIncome - avgMonthlyExpenses)).toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground">por mes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribución por Categorías */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Gastos por Categoría
            </CardTitle>
            <CardDescription>
              Distribución de tus gastos mensuales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryExpenses.map((cat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{cat.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        ${cat.amount.toLocaleString()}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {cat.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-full ${cat.color}`}
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Insights y Recomendaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💡 Insights y Recomendaciones
            </CardTitle>
            <CardDescription>
              Análisis inteligente de tus finanzas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Insight 1 */}
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-green-500/20 p-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">¡Excelente progreso!</h4>
                    <p className="text-xs text-muted-foreground">
                      Tus ahorros han aumentado un 15% en los últimos 3 meses. 
                      Mantén este ritmo para alcanzar tus metas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Insight 2 */}
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-yellow-500/20 p-2">
                    <Activity className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Oportunidad de ahorro</h4>
                    <p className="text-xs text-muted-foreground">
                      Gastas 35% de tu presupuesto en alimentación. 
                      Reducir un 10% te permitiría ahorrar $150 adicionales al mes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Insight 3 */}
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-blue-500/20 p-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Patrón detectado</h4>
                    <p className="text-xs text-muted-foreground">
                      Tus gastos aumentan un 20% los fines de semana. 
                      Planifica con anticipación para mantener el control.
                    </p>
                  </div>
                </div>
              </div>

              {/* Insight 4 */}
              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-purple-500/20 p-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">Meta alcanzable</h4>
                    <p className="text-xs text-muted-foreground">
                      Con tu tasa de ahorro actual, podrás completar tu fondo de emergencia 
                      en 4 meses.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden"></div>
    </div>
  )
}

