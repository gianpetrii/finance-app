"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  PieChart as PieChartIcon,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Plus,
  Edit,
  DollarSign,
  Calendar
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Tipos
interface BudgetCategory {
  id: string
  name: string
  icon: string
  allocated: number
  spent: number
  color: string
}

// Datos de ejemplo
const initialBudgets: BudgetCategory[] = [
  {
    id: "1",
    name: "Alimentación",
    icon: "🍔",
    allocated: 1500,
    spent: 1200,
    color: "from-orange-500 to-red-500"
  },
  {
    id: "2",
    name: "Transporte",
    icon: "🚗",
    allocated: 500,
    spent: 450,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "3",
    name: "Ocio",
    icon: "🎮",
    allocated: 400,
    spent: 480,
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "4",
    name: "Servicios",
    icon: "💡",
    allocated: 800,
    spent: 750,
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "5",
    name: "Salud",
    icon: "🏥",
    allocated: 300,
    spent: 120,
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "6",
    name: "Educación",
    icon: "📚",
    allocated: 600,
    spent: 400,
    color: "from-indigo-500 to-blue-500"
  },
  {
    id: "7",
    name: "Ropa",
    icon: "👕",
    allocated: 300,
    spent: 250,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "8",
    name: "Otros",
    icon: "📦",
    allocated: 200,
    spent: 100,
    color: "from-gray-500 to-slate-500"
  }
]

export default function BudgetPage() {
  const [budgets] = useState<BudgetCategory[]>(initialBudgets)

  // Calcular totales
  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const totalRemaining = totalAllocated - totalSpent
  const overallProgress = (totalSpent / totalAllocated) * 100

  // Calcular categorías en riesgo
  const categoriesAtRisk = budgets.filter(b => (b.spent / b.allocated) >= 0.8).length
  const categoriesOverBudget = budgets.filter(b => b.spent > b.allocated).length

  // Función para obtener el porcentaje gastado
  const getProgress = (budget: BudgetCategory) => {
    return Math.min((budget.spent / budget.allocated) * 100, 100)
  }

  // Función para obtener el estado
  const getStatus = (budget: BudgetCategory) => {
    const percentage = (budget.spent / budget.allocated) * 100
    if (budget.spent > budget.allocated) return "over"
    if (percentage >= 80) return "warning"
    if (percentage >= 50) return "moderate"
    return "good"
  }

  // Función para obtener el color del estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "over":
        return "text-red-600 dark:text-red-400"
      case "warning":
        return "text-yellow-600 dark:text-yellow-400"
      case "moderate":
        return "text-blue-600 dark:text-blue-400"
      default:
        return "text-green-600 dark:text-green-400"
    }
  }

  // Función para obtener el icono del estado
  const getStatusIcon = (status: string) => {
    if (status === "over" || status === "warning") {
      return <AlertCircle className="h-4 w-4" />
    }
    return <CheckCircle className="h-4 w-4" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <PieChartIcon className="h-7 w-7 text-primary" />
            Presupuesto Mensual
          </h1>
          <p className="text-muted-foreground mt-1">
            {format(new Date(), "MMMM yyyy", { locale: es })}
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nueva Categoría</span>
        </Button>
      </div>

      {/* Resumen General */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Presupuesto Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAllocated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              asignado este mes
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Gastado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${totalSpent.toLocaleString()}
            </div>
            <Progress value={overallProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {overallProgress.toFixed(1)}% del presupuesto
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disponible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              totalRemaining >= 0 
                ? "text-green-600 dark:text-green-400" 
                : "text-red-600 dark:text-red-400"
            }`}>
              ${Math.abs(totalRemaining).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalRemaining >= 0 ? "restante" : "excedido"}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {categoriesAtRisk}
              </div>
              {categoriesOverBudget > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {categoriesOverBudget} excedidas
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              categorías en riesgo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Vista General del Presupuesto */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle>Resumen Visual</CardTitle>
          <CardDescription>
            Progreso general de tu presupuesto mensual
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Progreso Total</span>
              <span className={`font-bold ${getStatusColor(
                overallProgress > 100 ? "over" : 
                overallProgress >= 80 ? "warning" : "good"
              )}`}>
                {overallProgress.toFixed(1)}%
              </span>
            </div>
            <Progress value={overallProgress} className="h-4" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Gastado: ${totalSpent.toLocaleString()}</span>
              <span>Presupuesto: ${totalAllocated.toLocaleString()}</span>
            </div>
          </div>

          {/* Días restantes del mes */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">Días restantes del mes</p>
                <p className="text-xs text-muted-foreground">
                  Promedio diario disponible: ${(totalRemaining / 15).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="text-2xl font-bold">15</div>
          </div>
        </CardContent>
      </Card>

      {/* Categorías de Presupuesto */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Categorías</h2>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Editar Todo
          </Button>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {budgets.map((budget) => {
            const progress = getProgress(budget)
            const status = getStatus(budget)
            const remaining = budget.allocated - budget.spent

            return (
              <Card 
                key={budget.id}
                className={`overflow-hidden border-2 transition-all hover:shadow-lg ${
                  status === "over" ? "border-red-500/50" : 
                  status === "warning" ? "border-yellow-500/50" : ""
                }`}
              >
                {/* Header con gradiente */}
                <div className={`h-2 bg-gradient-to-r ${budget.color}`} />

                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{budget.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{budget.name}</CardTitle>
                        <CardDescription>
                          ${budget.allocated.toLocaleString()} mensuales
                        </CardDescription>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                      <span className="text-sm font-medium">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Barra de progreso */}
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        Gastado: <span className="font-medium text-foreground">
                          ${budget.spent.toLocaleString()}
                        </span>
                      </span>
                      <span className={remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                        {remaining >= 0 ? "Disponible" : "Excedido"}: 
                        <span className="font-medium ml-1">
                          ${Math.abs(remaining).toLocaleString()}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Información adicional */}
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        <span className="text-xs">Promedio diario</span>
                      </div>
                      <p className="text-sm font-bold">
                        ${(budget.spent / 15).toFixed(2)}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-xs">Proyección</span>
                      </div>
                      <p className="text-sm font-bold">
                        ${((budget.spent / 15) * 30).toFixed(0)}
                      </p>
                    </div>
                  </div>

                  {/* Alerta si está cerca del límite */}
                  {status === "over" && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
                      <AlertCircle className="h-4 w-4 mt-0.5" />
                      <p className="text-xs">
                        Has excedido el presupuesto en ${Math.abs(remaining).toLocaleString()}
                      </p>
                    </div>
                  )}
                  {status === "warning" && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
                      <AlertCircle className="h-4 w-4 mt-0.5" />
                      <p className="text-xs">
                        Estás cerca del límite. Quedan ${remaining.toLocaleString()}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Consejos */}
      {categoriesOverBudget > 0 && (
        <Card className="border-2 border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-yellow-500/20 p-3">
                <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">⚠️ Atención Requerida</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Tienes {categoriesOverBudget} categoría{categoriesOverBudget > 1 ? "s" : ""} que ha{categoriesOverBudget > 1 ? "n" : ""} excedido el presupuesto. 
                  Considera ajustar tus gastos o reasignar fondos de otras categorías.
                </p>
                <Button variant="outline" size="sm">
                  Ver Recomendaciones
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden"></div>
    </div>
  )
}

