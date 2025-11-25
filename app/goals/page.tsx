"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { useSavingsGoals } from "@/lib/hooks/useSavingsGoals"
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
  Sparkles,
  ChevronRight
} from "lucide-react"
import { format, differenceInDays } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

// Categorías con iconos
const categoryIcons = {
  vacation: "✈️",
  emergency: "🛡️",
  purchase: "🛍️",
  education: "📚",
  other: "🎯"
}

export default function GoalsPage() {
  const { goals, loading } = useSavingsGoals()
  const [selectedGoal, setSelectedGoal] = useState<any>(null)

  useEffect(() => {
    if (goals.length > 0 && !selectedGoal) {
      setSelectedGoal(goals[0])
    }
  }, [goals, selectedGoal])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Spinner size="lg" />
      </div>
    )
  }

  // Calcular estadísticas generales
  const totalSaved = goals.reduce((sum, goal) => sum + (goal.currentAmount || 0), 0)
  const totalTarget = goals.reduce((sum, goal) => sum + (goal.targetAmount || 0), 0)
  const completedGoals = goals.filter(g => (g.currentAmount || 0) >= (g.targetAmount || 0)).length
  const activeGoals = goals.filter(g => (g.currentAmount || 0) < (g.targetAmount || 0)).length

  // Calcular porcentaje de progreso
  const getProgress = (goal: any) => {
    const current = goal.currentAmount || 0
    const target = goal.targetAmount || 1
    return Math.min((current / target) * 100, 100)
  }

  // Calcular días restantes
  const getDaysRemaining = (deadline: any) => {
    const deadlineDate = deadline?.toDate ? deadline.toDate() : new Date(deadline)
    const days = differenceInDays(deadlineDate, new Date())
    return days > 0 ? days : 0
  }

  // Calcular cuánto falta ahorrar por día
  const getDailyRequired = (goal: any) => {
    const remaining = (goal.targetAmount || 0) - (goal.currentAmount || 0)
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
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Ahorrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">${totalSaved.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              de ${totalTarget.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Progreso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {((totalSaved / totalTarget) * 100).toFixed(1)}%
            </div>
            <Progress value={(totalSaved / totalTarget) * 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              {activeGoals}
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              {completedGoals}
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Layout Principal: Lista Compacta + Detalle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista Compacta de Metas */}
        <div className="lg:col-span-1 space-y-3">
          <h2 className="text-lg font-semibold px-1">Mis Metas</h2>
          {goals.map((goal) => {
            const progress = getProgress(goal)
            const isCompleted = progress >= 100
            const isSelected = selectedGoal?.id === goal.id

            return (
              <Card
                key={goal.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "border-2 border-primary shadow-md" : "border-2"
                } ${isCompleted ? "border-green-500/50" : ""}`}
                onClick={() => setSelectedGoal(goal)}
              >
                <div className={`h-1 bg-gradient-to-r ${goal.color}`} />
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start gap-2">
                    <div className="text-2xl">{categoryIcons[goal.category]}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold truncate">{goal.name}</h3>
                        {isCompleted && (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{goal.description}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Progress value={progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium">
                        ${goal.currentAmount.toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">
                        {progress.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Detalle de la Meta Seleccionada */}
        {selectedGoal && (
          <div className="lg:col-span-2">
            <Card className="border-2 h-full">
              <div className={`h-2 bg-gradient-to-r ${selectedGoal.color}`} />
              
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-4xl">{categoryIcons[selectedGoal.category]}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-2xl">{selectedGoal.name}</CardTitle>
                        {getProgress(selectedGoal) >= 100 && (
                          <Badge variant="default" className="bg-green-500 gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Completada
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-base">{selectedGoal.description}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Progreso Grande */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Progreso</span>
                    <span className="text-2xl font-bold">{getProgress(selectedGoal).toFixed(1)}%</span>
                  </div>
                  <Progress value={getProgress(selectedGoal)} className="h-4" />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">
                        ${selectedGoal.currentAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Ahorrado</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-muted-foreground">
                        ${selectedGoal.targetAmount.toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground">Objetivo</p>
                    </div>
                  </div>
                </div>

                {/* Información Detallada */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-5 w-5" />
                      <span className="text-sm font-medium">Falta Ahorrar</span>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      ${(selectedGoal.targetAmount - selectedGoal.currentAmount).toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-5 w-5" />
                      <span className="text-sm font-medium">Fecha Límite</span>
                    </div>
                    <p className="text-base font-semibold">
                      {format(selectedGoal.deadline, "d 'de' MMMM", { locale: es })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {getDaysRemaining(selectedGoal.deadline) > 0 
                        ? `${getDaysRemaining(selectedGoal.deadline)} días restantes` 
                        : "Fecha vencida"}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-sm font-medium">Ahorro Diario</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      ${getDailyRequired(selectedGoal).toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      requerido por día
                    </p>
                  </div>
                </div>

                {/* Botón de Acción */}
                {getProgress(selectedGoal) < 100 && (
                  <Button className="w-full gap-2" size="lg">
                    <Plus className="h-5 w-5" />
                    Agregar Ahorro a esta Meta
                  </Button>
                )}

                {getProgress(selectedGoal) >= 100 && (
                  <Card className="border-2 border-green-500/20 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-green-500/20 p-3">
                          <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">🎉 ¡Meta Alcanzada!</h3>
                          <p className="text-sm text-muted-foreground">
                            Has cumplido tu objetivo. ¡Felicitaciones por tu disciplina financiera!
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden"></div>
    </div>
  )
}
