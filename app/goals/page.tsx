"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Target,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock,
  Sparkles
} from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"

// Tipos
interface SavingsGoal {
  id: string
  name: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: Date
  category: "vacation" | "emergency" | "purchase" | "education" | "other"
  color: string
}

// Datos de ejemplo
const initialGoals: SavingsGoal[] = [
  {
    id: "1",
    name: "Vacaciones en Europa",
    description: "Viaje de 15 días por España e Italia",
    targetAmount: 5000,
    currentAmount: 3200,
    deadline: new Date(2025, 6, 1), // Julio 2025
    category: "vacation",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "2",
    name: "Fondo de Emergencia",
    description: "6 meses de gastos básicos",
    targetAmount: 12000,
    currentAmount: 8500,
    deadline: new Date(2025, 11, 31), // Diciembre 2025
    category: "emergency",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "3",
    name: "Laptop Nueva",
    description: "MacBook Pro M3 para trabajo",
    targetAmount: 2500,
    currentAmount: 1800,
    deadline: new Date(2025, 3, 15), // Abril 2025
    category: "purchase",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "4",
    name: "Curso de Programación",
    description: "Bootcamp Full Stack Development",
    targetAmount: 1500,
    currentAmount: 1500,
    deadline: new Date(2025, 2, 1), // Marzo 2025
    category: "education",
    color: "from-orange-500 to-yellow-500"
  }
]

// Categorías con iconos
const categoryIcons = {
  vacation: "✈️",
  emergency: "🛡️",
  purchase: "🛍️",
  education: "📚",
  other: "🎯"
}

export default function GoalsPage() {
  const [goals] = useState<SavingsGoal[]>(initialGoals)

  // Calcular estadísticas generales
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0)
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
  const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount).length
  const activeGoals = goals.filter(g => g.currentAmount < g.targetAmount).length

  // Calcular porcentaje de progreso
  const getProgress = (goal: SavingsGoal) => {
    return Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
  }

  // Calcular días restantes
  const getDaysRemaining = (deadline: Date) => {
    const days = differenceInDays(deadline, new Date())
    return days > 0 ? days : 0
  }

  // Calcular cuánto falta ahorrar por día
  const getDailyRequired = (goal: SavingsGoal) => {
    const remaining = goal.targetAmount - goal.currentAmount
    const days = getDaysRemaining(goal.deadline)
    return days > 0 ? remaining / days : 0
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Target className="h-7 w-7 text-primary" />
            Metas de Ahorro
          </h1>
          <p className="text-muted-foreground mt-1">
            Alcanza tus objetivos financieros paso a paso
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nueva Meta</span>
        </Button>
      </div>

      {/* Resumen General */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ahorrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSaved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              de ${totalTarget.toLocaleString()} objetivo
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progreso Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((totalSaved / totalTarget) * 100).toFixed(1)}%
            </div>
            <Progress value={(totalSaved / totalTarget) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Metas Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {activeGoals}
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              en progreso
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Metas Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {completedGoals}
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              logradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Metas */}
      <div className="space-y-4">
        {goals.map((goal) => {
          const progress = getProgress(goal)
          const isCompleted = progress >= 100
          const daysRemaining = getDaysRemaining(goal.deadline)
          const dailyRequired = getDailyRequired(goal)

          return (
            <Card 
              key={goal.id} 
              className={`overflow-hidden border-2 transition-all hover:shadow-lg ${
                isCompleted ? "border-green-500/50" : ""
              }`}
            >
              {/* Header con gradiente */}
              <div className={`h-2 bg-gradient-to-r ${goal.color}`} />

              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-3xl">{categoryIcons[goal.category]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-xl">{goal.name}</CardTitle>
                        {isCompleted && (
                          <Badge variant="default" className="bg-green-500 gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Completada
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{goal.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progreso */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className="font-bold">{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">
                      ${goal.currentAmount.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">
                      de ${goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span className="text-xs">Falta ahorrar</span>
                    </div>
                    <p className="text-lg font-bold">
                      ${(goal.targetAmount - goal.currentAmount).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs">Fecha límite</span>
                    </div>
                    <p className="text-sm font-medium">
                      {format(goal.deadline, "d 'de' MMMM, yyyy", { locale: es })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {daysRemaining > 0 ? `${daysRemaining} días restantes` : "Fecha vencida"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs">Ahorro diario requerido</span>
                    </div>
                    <p className="text-lg font-bold">
                      ${dailyRequired.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      por día
                    </p>
                  </div>
                </div>

                {/* Botón de acción */}
                {!isCompleted && (
                  <Button className="w-full gap-2" variant="outline">
                    <Plus className="h-4 w-4" />
                    Agregar Ahorro
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Mensaje motivacional */}
      {activeGoals > 0 && (
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-primary/20 p-3">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">💪 ¡Sigue así!</h3>
                <p className="text-sm text-muted-foreground">
                  Tienes {activeGoals} meta{activeGoals > 1 ? "s" : ""} activa{activeGoals > 1 ? "s" : ""}. 
                  Cada pequeño ahorro te acerca más a tus objetivos. ¡No te rindas!
                </p>
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

