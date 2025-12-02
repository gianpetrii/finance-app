"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { NewTransactionModal } from "@/components/NewTransactionModal"
import { useTransactions } from "@/lib/hooks/useTransactions"
import { useFinancialSettings } from "@/lib/hooks/useFinancialSettings"
import { deleteTransaction } from "@/lib/firebase/collections"
import { useAuth } from "@/lib/hooks/useAuth"
import { 
  Calendar as CalendarIcon,
  TrendingDown,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { format, isToday, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

export default function DailyExpensesPage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense")
  
  // Obtener datos reales
  const { transactions, loading: transactionsLoading } = useTransactions({
    startDate: startOfMonth(currentMonth),
    endDate: endOfMonth(currentMonth)
  })
  const { settings, loading: settingsLoading } = useFinancialSettings()
  
  const DAILY_LIMIT = settings?.dailyBudget || 200
  
  // Calcular gastos del día seleccionado
  const getDayExpenses = (date: Date) => {
    return transactions
      .filter(t => {
        const transDate = t.date?.toDate ? t.date.toDate() : new Date(t.date)
        return t.type === "expense" && isSameDay(transDate, date)
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0)
  }

  // Calcular ingresos del día seleccionado
  const getDayIncome = (date: Date) => {
    return transactions
      .filter(t => {
        const transDate = t.date?.toDate ? t.date.toDate() : new Date(t.date)
        return t.type === "income" && isSameDay(transDate, date)
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0)
  }

  // Obtener transacciones del día seleccionado
  const getDayTransactions = (date: Date) => {
    return transactions.filter(t => {
      const transDate = t.date?.toDate ? t.date.toDate() : new Date(t.date)
      return isSameDay(transDate, date)
    })
  }
  
  // Eliminar transacción
  const handleDeleteTransaction = async (transactionId: string) => {
    if (!user) return
    
    try {
      await deleteTransaction(user.uid, transactionId)
      toast.success("Transacción eliminada")
    } catch (error) {
      console.error("Error al eliminar:", error)
      toast.error("Error al eliminar la transacción")
    }
  }

  // Calcular balance acumulado del mes (solo días pasados)
  const getMonthBalance = () => {
    const today = new Date()
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
    
    let balance = 0
    daysInMonth.forEach(date => {
      // Solo considerar días que ya pasaron (incluyendo hoy)
      if (date <= today) {
        const dayExpenses = getDayExpenses(date)
        const dayBalance = DAILY_LIMIT - dayExpenses
        balance += dayBalance
      }
    })
    
    return balance
  }

  // Calcular días restantes del mes
  const getDaysRemainingInMonth = () => {
    const today = new Date()
    const monthEnd = endOfMonth(currentMonth)
    const daysInMonth = eachDayOfInterval({ start: today, end: monthEnd })
    return daysInMonth.length
  }

  const todayExpenses = getDayExpenses(selectedDate)
  const todayIncome = getDayIncome(selectedDate)
  const todayTransactions = getDayTransactions(selectedDate)
  const percentageUsed = (todayExpenses / DAILY_LIMIT) * 100
  const remaining = DAILY_LIMIT - todayExpenses
  const monthBalance = getMonthBalance()
  const daysRemaining = getDaysRemainingInMonth()

  // Obtener color según el porcentaje gastado
  const getStatusColor = (percentage: number) => {
    if (percentage < 50) return "text-green-600 dark:text-green-400"
    if (percentage < 80) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  const getStatusIcon = (percentage: number) => {
    if (percentage < 80) return <CheckCircle className="h-5 w-5" />
    return <AlertCircle className="h-5 w-5" />
  }

  // Generar días del mes para el calendario
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Obtener color del día en el calendario basado en el balance
  const getDayColor = (date: Date) => {
    const expenses = getDayExpenses(date)
    const dayBalance = DAILY_LIMIT - expenses
    
    if (expenses === 0) return "bg-muted/20"
    if (dayBalance > 0) return "bg-green-500/20 hover:bg-green-500/30" // Sobró dinero
    if (dayBalance === 0) return "bg-muted/40 hover:bg-muted/50" // Gastó exactamente el presupuesto
    return "bg-red-500/20 hover:bg-red-500/30" // Se pasó del presupuesto
  }

  // Loading state
  if (transactionsLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Gastos Diarios</h1>
        <p className="text-muted-foreground mt-1">
          Controla tus gastos día a día
        </p>
      </div>

      {/* Layout Principal: Calendario + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendario - Ocupa 2 columnas en desktop */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Calendario de {format(currentMonth, "MMMM yyyy", { locale: es })}</CardTitle>
                  <CardDescription>
                    Haz clic en un día para ver sus transacciones
                  </CardDescription>
                </div>
              <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                  <Button
                    variant="outline"
                    className="h-9 px-3 text-sm"
                    onClick={() => {
                      const today = new Date()
                      setCurrentMonth(today)
                      setSelectedDate(today)
                    }}
                  >
                    Volver a hoy
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
            <CardContent>
              {/* Balance Acumulado del Mes */}
              <div className="mb-6 p-4 rounded-lg border-2 bg-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Balance del Mes</p>
                    <p className={`text-2xl font-bold ${
                      monthBalance > 0 
                        ? "text-green-600 dark:text-green-400" 
                        : monthBalance < 0 
                        ? "text-red-600 dark:text-red-400" 
                        : "text-muted-foreground"
                    }`}>
                      {monthBalance > 0 ? "+" : ""}${monthBalance.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {monthBalance > 0 
                        ? "Tienes colchón para gastar" 
                        : monthBalance < 0 
                        ? "Deberías ahorrar los próximos días" 
                        : "Estás gastando exactamente tu presupuesto"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Días restantes</p>
                    <p className="text-3xl font-bold">{daysRemaining}</p>
                        </div>
                      </div>
            </div>
            
              {/* Leyenda */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30" />
                  <span className="text-muted-foreground">Sobró dinero</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted/40 border border-muted" />
                  <span className="text-muted-foreground">Presupuesto exacto</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30" />
                  <span className="text-muted-foreground">Se pasó</span>
                </div>
              </div>

              {/* Grid del Calendario */}
              <div className="grid grid-cols-7 gap-2">
                {/* Headers de días */}
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}

                {/* Días del mes */}
                {/* Espacios vacíos al inicio */}
                {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {/* Días */}
                {daysInMonth.map((date) => {
                  const dayExpenses = getDayExpenses(date)
                  const isSelected = isSameDay(date, selectedDate)
                  const isCurrentDay = isToday(date)

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        relative p-3 rounded-lg text-center transition-all
                        ${getDayColor(date)}
                        ${isSelected ? "ring-2 ring-primary" : ""}
                        ${isCurrentDay ? "font-bold" : ""}
                        hover:scale-105
                      `}
                    >
                      <div className="text-sm">{format(date, "d")}</div>
                      {dayExpenses > 0 && (
                        <div className="text-xs font-medium mt-1">
                          ${dayExpenses}
                        </div>
                      )}
                    </button>
                  )
                })}
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Sidebar Derecho - Ocupa 1 columna en desktop */}
        <div className="lg:col-span-1 space-y-6">
          {/* Resumen del Día Seleccionado */}
          <Card className="border-2 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    {format(selectedDate, "d 'de' MMMM", { locale: es })}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {format(selectedDate, "EEEE, yyyy", { locale: es })}
                  </CardDescription>
                </div>
                {isToday(selectedDate) && (
                  <Badge variant="default" className="text-xs">Hoy</Badge>
              )}
            </div>
          </CardHeader>
            <CardContent className="space-y-4">
              {/* Presupuesto Diario */}
                <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Presupuesto Diario</p>
                    <p className="text-2xl font-bold">${DAILY_LIMIT.toLocaleString()}</p>
                  </div>
                  <div className={`flex items-center gap-1 ${getStatusColor(percentageUsed)}`}>
                    {getStatusIcon(percentageUsed)}
                    <span className="text-xs font-medium">
                      {percentageUsed.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Barra de Progreso */}
                <div className="space-y-1">
                  <Progress 
                    value={percentageUsed} 
                    className="h-2"
                  />
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      ${todayExpenses.toLocaleString()}
                    </span>
                    <span className={remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                      {remaining >= 0 ? "+" : ""}${Math.abs(remaining).toLocaleString()}
                    </span>
                  </div>
                </div>
                </div>

              {/* Stats del Día */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                    <TrendingDown className="h-3 w-3" />
                    <span className="text-xs font-medium">Gastos</span>
                  </div>
                  <p className="text-xl font-bold">${todayExpenses.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {todayTransactions.filter(t => t.type === "expense").length} transacciones
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs font-medium">Ingresos</span>
                  </div>
                  <p className="text-xl font-bold">${todayIncome.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">
                    {todayTransactions.filter(t => t.type === "income").length} transacciones
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transacciones del Día */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Transacciones</CardTitle>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="gap-1 h-8 px-2 text-xs"
                    onClick={() => {
                      setTransactionType("income")
                      setIsModalOpen(true)
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    Ingreso
                  </Button>
                  <Button 
                    size="sm" 
                    className="gap-1 h-8 px-2 text-xs"
                    onClick={() => {
                      setTransactionType("expense")
                      setIsModalOpen(true)
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    Gasto
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto max-h-[400px]">
              {todayTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <DollarSign className="h-10 w-10 mx-auto text-muted-foreground/50 mb-2" />
                  <p className="text-sm text-muted-foreground mb-3">
                    Sin transacciones
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 text-xs"
                    onClick={() => {
                      setTransactionType("expense")
                      setIsModalOpen(true)
                    }}
                  >
                    <Plus className="h-3 w-3" />
                    Agregar
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {todayTransactions.map((transaction) => (
                        <div 
                          key={transaction.id} 
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`p-1.5 rounded-lg flex-shrink-0 ${
                          transaction.type === "expense" 
                            ? "bg-red-500/10 text-red-600 dark:text-red-400" 
                            : "bg-green-500/10 text-green-600 dark:text-green-400"
                        }`}>
                          {transaction.type === "expense" ? (
                            <TrendingDown className="h-3 w-3" />
                          ) : (
                            <TrendingUp className="h-3 w-3" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{transaction.category}</p>
                          {transaction.notes && (
                            <p className="text-xs text-muted-foreground truncate">{transaction.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <p className={`text-sm font-bold ${
                          transaction.type === "expense" 
                            ? "text-red-600 dark:text-red-400" 
                            : "text-green-600 dark:text-green-400"
                        }`}>
                          {transaction.type === "expense" ? "-" : "+"}${transaction.amount.toLocaleString()}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                          </div>
                        </div>
                      ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
            </div>
            
      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden"></div>

      {/* Modal de Nueva Transacción */}
      <NewTransactionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultType={transactionType}
        onSuccess={() => {
          console.log("Transacción guardada exitosamente")
        }}
      />
    </div>
  )
} 
