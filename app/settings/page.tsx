"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Save,
  Settings as SettingsIcon,
  ChevronDown,
  ChevronUp,
  History,
  Percent
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Tipos
interface HistoryEntry {
  id: number
  value: number
  date: Date
}

interface FixedExpense {
  id: number
  name: string
  amount: string
}

export default function SettingsPage() {
  const [salary, setSalary] = useState("3500")
  const [expectedSavings, setExpectedSavings] = useState("500")
  const [savingsType, setSavingsType] = useState<"fixed" | "percentage">("fixed")
  const [savingsPercentage, setSavingsPercentage] = useState("15")
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([
    { id: 1, name: "Alquiler", amount: "800" },
    { id: 2, name: "Servicios", amount: "200" },
    { id: 3, name: "Internet", amount: "50" },
  ])

  // Estados para secciones colapsables
  const [expandedSections, setExpandedSections] = useState({
    salary: false,
    expenses: false,
    savings: false
  })

  // Historial de cambios (simulado)
  const [salaryHistory] = useState<HistoryEntry[]>([
    { id: 1, value: 3500, date: new Date(2025, 0, 1) },
    { id: 2, value: 3200, date: new Date(2024, 8, 1) },
    { id: 3, value: 3000, date: new Date(2024, 5, 1) },
  ])

  const [expensesHistory] = useState<HistoryEntry[]>([
    { id: 1, value: 1050, date: new Date(2025, 0, 1) },
    { id: 2, value: 1000, date: new Date(2024, 10, 1) },
  ])

  const [savingsHistory] = useState<HistoryEntry[]>([
    { id: 1, value: 500, date: new Date(2025, 0, 1) },
    { id: 2, value: 450, date: new Date(2024, 9, 1) },
  ])

  const handleSave = () => {
    toast.success("Configuración guardada exitosamente")
  }

  const addFixedExpense = () => {
    const newExpense = {
      id: Date.now(),
      name: "",
      amount: ""
    }
    setFixedExpenses([...fixedExpenses, newExpense])
  }

  const updateFixedExpense = (id: number, field: "name" | "amount", value: string) => {
    setFixedExpenses(fixedExpenses.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ))
  }

  const removeFixedExpense = (id: number) => {
    setFixedExpenses(fixedExpenses.filter(exp => exp.id !== id))
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    })
  }

  const totalFixedExpenses = fixedExpenses.reduce((sum, exp) => 
    sum + (parseFloat(exp.amount) || 0), 0
  )

  // Calcular ahorro según el tipo
  const calculatedSavings = savingsType === "fixed" 
    ? parseFloat(expectedSavings) 
    : (parseFloat(salary) * parseFloat(savingsPercentage)) / 100

  const availableForDaily = parseFloat(salary) - totalFixedExpenses - calculatedSavings
  const dailyBudget = availableForDaily / 30

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
          <SettingsIcon className="h-7 w-7 text-primary" />
          Configuración Financiera
        </h1>
        <p className="text-muted-foreground mt-1">
          Define tu salario, gastos fijos y meta de ahorro
        </p>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Salario Mensual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${parseFloat(salary || "0").toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Gastos Fijos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              ${totalFixedExpenses.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-blue-500" />
              Meta de Ahorro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${calculatedSavings.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {savingsType === "percentage" && `${savingsPercentage}% del salario`}
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Presupuesto Diario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${dailyBudget.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Por día
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 1. Ingresos Mensuales */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("salary")}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Ingresos Mensuales
              </CardTitle>
              <CardDescription>
                Tu ingreso mensual fijo
              </CardDescription>
            </div>
            {expandedSections.salary ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="salary">Monto Mensual</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="salary"
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          {/* Historial */}
          {expandedSections.salary && (
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <History className="h-4 w-4" />
                Historial de Cambios
              </div>
              <div className="space-y-2">
                {salaryHistory.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">
                      {format(entry.date, "d 'de' MMMM, yyyy", { locale: es })}
                    </span>
                    <span className="font-medium">
                      ${entry.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Gastos Fijos Mensuales */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("expenses")}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                Gastos Fijos Mensuales
              </CardTitle>
              <CardDescription>
                Gastos que se repiten cada mes
              </CardDescription>
            </div>
            {expandedSections.expenses ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {fixedExpenses.map((expense) => (
              <div key={expense.id} className="flex gap-3 items-start">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Nombre del gasto"
                    value={expense.name}
                    onChange={(e) => updateFixedExpense(expense.id, "name", e.target.value)}
                  />
                </div>
                <div className="w-32 space-y-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={expense.amount}
                      onChange={(e) => updateFixedExpense(expense.id, "amount", e.target.value)}
                      className="pl-6"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFixedExpense(expense.id)}
                >
                  ✕
                </Button>
              </div>
            ))}
            
            {fixedExpenses.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No hay gastos fijos configurados
              </p>
            )}
            
            <Button onClick={addFixedExpense} variant="outline" className="w-full">
              Agregar Gasto Fijo
            </Button>
          </div>

          {/* Historial */}
          {expandedSections.expenses && (
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <History className="h-4 w-4" />
                Historial de Cambios
              </div>
              <div className="space-y-2">
                {expensesHistory.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">
                      {format(entry.date, "d 'de' MMMM, yyyy", { locale: es })}
                    </span>
                    <span className="font-medium">
                      ${entry.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Meta de Ahorro */}
      <Card>
        <CardHeader className="cursor-pointer" onClick={() => toggleSection("savings")}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-blue-500" />
                Meta de Ahorro Mensual
              </CardTitle>
              <CardDescription>
                Define tu objetivo de ahorro mensual
              </CardDescription>
            </div>
            {expandedSections.savings ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Toggle Tipo de Ahorro */}
          <div className="flex gap-2">
            <Button
              variant={savingsType === "fixed" ? "default" : "outline"}
              onClick={() => setSavingsType("fixed")}
              className="flex-1 gap-2"
            >
              <DollarSign className="h-4 w-4" />
              Monto Fijo
            </Button>
            <Button
              variant={savingsType === "percentage" ? "default" : "outline"}
              onClick={() => setSavingsType("percentage")}
              className="flex-1 gap-2"
            >
              <Percent className="h-4 w-4" />
              Porcentaje
            </Button>
          </div>

          {/* Input según tipo */}
          {savingsType === "fixed" ? (
            <div className="space-y-2">
              <Label htmlFor="savings">Monto Mensual</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="savings"
                  type="number"
                  value={expectedSavings}
                  onChange={(e) => setExpectedSavings(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="savingsPercentage">Porcentaje del Salario</Label>
              <div className="relative">
                <Input
                  id="savingsPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={savingsPercentage}
                  onChange={(e) => setSavingsPercentage(e.target.value)}
                  className="pr-7"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  %
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Equivale a ${calculatedSavings.toLocaleString()} al mes
              </p>
            </div>
          )}

          {/* Historial */}
          {expandedSections.savings && (
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <History className="h-4 w-4" />
                Historial de Cambios
              </div>
              <div className="space-y-2">
                {savingsHistory.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-muted/50">
                    <span className="text-muted-foreground">
                      {format(entry.date, "d 'de' MMMM, yyyy", { locale: es })}
                    </span>
                    <span className="font-medium">
                      ${entry.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fórmula del Presupuesto Diario */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <h3 className="font-semibold">📊 Cálculo del Presupuesto Diario</h3>
            <div className="p-4 rounded-lg bg-background/50 space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Salario:</span>
                <span className="font-medium">${parseFloat(salary).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">- Gastos Fijos:</span>
                <span className="font-medium text-red-600 dark:text-red-400">-${totalFixedExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">- Ahorro:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">-${calculatedSavings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-muted-foreground">= Disponible:</span>
                <span className="font-bold">${availableForDaily.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">÷ 30 días:</span>
                <span className="font-bold text-primary text-lg">${dailyBudget.toFixed(0)} / día</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón Guardar */}
      <div className="flex justify-end">
        <Button onClick={handleSave} size="lg" className="gap-2">
          <Save className="h-4 w-4" />
          Guardar Configuración
        </Button>
      </div>

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden"></div>
    </div>
  )
}

