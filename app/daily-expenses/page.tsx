"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { NewTransactionModal } from "@/components/NewTransactionModal"
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

// Tipos
interface Transaction {
  id: string
  date: Date
  type: "expense" | "income"
  amount: number
  description: string
  category: string
}

// Datos de ejemplo
const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()
const DAILY_LIMIT = 200

const initialTransactions: Transaction[] = [
  {
    id: "1",
    date: new Date(currentYear, currentMonth, new Date().getDate()),
    type: "expense",
    amount: 80,
    description: "Almuerzo",
    category: "Alimentación"
  },
  {
    id: "2",
    date: new Date(currentYear, currentMonth, new Date().getDate()),
    type: "expense",
    amount: 30,
    description: "Café",
    category: "Alimentación"
  },
  {
    id: "3",
    date: new Date(currentYear, currentMonth, new Date().getDate()),
    type: "expense",
    amount: 40,
    description: "Uber",
    category: "Transporte"
  },
]

export default function DailyExpensesPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [transactions] = useState<Transaction[]>(initialTransactions)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense")
  
  // Calcular gastos del día seleccionado
  const getDayExpenses = (date: Date) => {
    return transactions
      .filter(t => 
        t.type === "expense" && 
        isSameDay(t.date, date)
      )
      .reduce((sum, t) => sum + t.amount, 0)
  }

  // Calcular ingresos del día seleccionado
  const getDayIncome = (date: Date) => {
    return transactions
      .filter(t => 
        t.type === "income" && 
        isSameDay(t.date, date)
      )
      .reduce((sum, t) => sum + t.amount, 0)
  }

  // Obtener transacciones del día seleccionado
  const getDayTransactions = (date: Date) => {
    return transactions.filter(t => isSameDay(t.date, date))
  }

  const todayExpenses = getDayExpenses(selectedDate)
  const todayIncome = getDayIncome(selectedDate)
  const todayTransactions = getDayTransactions(selectedDate)
  const percentageUsed = (todayExpenses / DAILY_LIMIT) * 100
  const remaining = DAILY_LIMIT - todayExpenses

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

  // Obtener color del día en el calendario
  const getDayColor = (date: Date) => {
    const expenses = getDayExpenses(date)
    const percentage = (expenses / DAILY_LIMIT) * 100
    
    if (expenses === 0) return "bg-muted/20"
    if (percentage < 50) return "bg-green-500/20 hover:bg-green-500/30"
    if (percentage < 80) return "bg-yellow-500/20 hover:bg-yellow-500/30"
    return "bg-red-500/20 hover:bg-red-500/30"
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

      {/* Vista del Día Actual */}
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" />
                {isToday(selectedDate) ? "Hoy" : format(selectedDate, "d 'de' MMMM", { locale: es })}
              </CardTitle>
              <CardDescription>
                {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
              </CardDescription>
            </div>
            {isToday(selectedDate) && (
              <Badge variant="default">Hoy</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Presupuesto Diario */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Presupuesto Diario</p>
                <p className="text-3xl font-bold">${DAILY_LIMIT.toLocaleString()}</p>
              </div>
              <div className={`flex items-center gap-2 ${getStatusColor(percentageUsed)}`}>
                {getStatusIcon(percentageUsed)}
                <span className="text-sm font-medium">
                  {percentageUsed.toFixed(0)}% usado
                </span>
              </div>
            </div>

            {/* Barra de Progreso */}
            <div className="space-y-2">
              <Progress 
                value={percentageUsed} 
                className="h-3"
              />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Gastado: <span className="font-medium text-foreground">${todayExpenses.toLocaleString()}</span>
                </span>
                <span className={remaining >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}>
                  {remaining >= 0 ? "Disponible" : "Excedido"}: <span className="font-medium">${Math.abs(remaining).toLocaleString()}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Stats del Día */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">Gastos</span>
              </div>
              <p className="text-2xl font-bold">${todayExpenses.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {todayTransactions.filter(t => t.type === "expense").length} transacciones
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Ingresos</span>
              </div>
              <p className="text-2xl font-bold">${todayIncome.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">
                {todayTransactions.filter(t => t.type === "income").length} transacciones
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transacciones del Día */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transacciones de {isToday(selectedDate) ? "Hoy" : "este Día"}</CardTitle>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                className="gap-2"
                onClick={() => {
                  setTransactionType("income")
                  setIsModalOpen(true)
                }}
              >
                <Plus className="h-4 w-4" />
                Ingreso
              </Button>
              <Button 
                size="sm" 
                className="gap-2"
                onClick={() => {
                  setTransactionType("expense")
                  setIsModalOpen(true)
                }}
              >
                <Plus className="h-4 w-4" />
                Gasto
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {todayTransactions.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                No hay transacciones para este día
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4 gap-2"
                onClick={() => {
                  setTransactionType("expense")
                  setIsModalOpen(true)
                }}
              >
                <Plus className="h-4 w-4" />
                Agregar Primera Transacción
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === "expense" 
                        ? "bg-red-500/10 text-red-600 dark:text-red-400" 
                        : "bg-green-500/10 text-green-600 dark:text-green-400"
                    }`}>
                      {transaction.type === "expense" ? (
                        <TrendingDown className="h-4 w-4" />
                      ) : (
                        <TrendingUp className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className={`text-lg font-bold ${
                      transaction.type === "expense" 
                        ? "text-red-600 dark:text-red-400" 
                        : "text-green-600 dark:text-green-400"
                    }`}>
                      {transaction.type === "expense" ? "-" : "+"}${transaction.amount.toLocaleString()}
                    </p>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Calendario Mensual */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Calendario de {format(currentMonth, "MMMM yyyy", { locale: es })}</CardTitle>
              <CardDescription>
                Haz clic en un día para ver sus transacciones
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentMonth(new Date())}
              >
                Hoy
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Leyenda */}
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30" />
              <span className="text-muted-foreground">Bajo (&lt;50%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30" />
              <span className="text-muted-foreground">Medio (50-80%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-500/20 border border-red-500/30" />
              <span className="text-muted-foreground">Alto (&gt;80%)</span>
            </div>
          </div>

          {/* Grid del Calendario */}
          <div className="grid grid-cols-7 gap-2">
            {/* Headers de días */}
            {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}

            {/* Días del mes */}
            {/* Espacios vacíos al inicio */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
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
                    relative p-2 rounded-lg text-center transition-all
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
