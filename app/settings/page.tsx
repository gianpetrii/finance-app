"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Save,
  Settings as SettingsIcon,
  Percent,
  Plus,
  X
} from "lucide-react"
import { toast } from "sonner"

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

      {/* Configuración - 3 Columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna 1: Ingresos Mensuales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Ingresos Mensuales
            </CardTitle>
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
          </CardContent>
        </Card>

        {/* Columna 2: Gastos Fijos Mensuales */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingDown className="h-5 w-5 text-red-500" />
                Gastos Fijos
              </CardTitle>
              <Button 
                onClick={addFixedExpense} 
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
            {fixedExpenses.map((expense) => (
              <div key={expense.id} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Input
                    placeholder="Nombre"
                    value={expense.name}
                    onChange={(e) => updateFixedExpense(expense.id, "name", e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="w-24 space-y-2">
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                      $
                    </span>
                    <Input
                      type="number"
                      placeholder="0"
                      value={expense.amount}
                      onChange={(e) => updateFixedExpense(expense.id, "amount", e.target.value)}
                      className="pl-5 h-9 text-sm"
                    />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFixedExpense(expense.id)}
                  className="h-9 w-9"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {fixedExpenses.length === 0 && (
              <p className="text-center text-muted-foreground text-sm py-4">
                No hay gastos fijos
              </p>
            )}
          </CardContent>
        </Card>

        {/* Columna 3: Meta de Ahorro */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-blue-500" />
              Meta de Ahorro
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Toggle Tipo de Ahorro */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={savingsType === "fixed" ? "default" : "outline"}
                onClick={() => setSavingsType("fixed")}
                className="gap-2 h-9"
                size="sm"
              >
                <DollarSign className="h-3 w-3" />
                Fijo
              </Button>
              <Button
                variant={savingsType === "percentage" ? "default" : "outline"}
                onClick={() => setSavingsType("percentage")}
                className="gap-2 h-9"
                size="sm"
              >
                <Percent className="h-3 w-3" />
                %
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
                <Label htmlFor="savingsPercentage">Porcentaje</Label>
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
                <p className="text-xs text-muted-foreground">
                  = ${calculatedSavings.toLocaleString()} al mes
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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
