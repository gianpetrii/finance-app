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
  Settings as SettingsIcon
} from "lucide-react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [salary, setSalary] = useState("3500")
  const [expectedSavings, setExpectedSavings] = useState("500")
  const [fixedExpenses, setFixedExpenses] = useState([
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

  const availableForDaily = parseFloat(salary) - totalFixedExpenses - parseFloat(expectedSavings)

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
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
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

        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Disponible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${availableForDaily.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Para gastos diarios
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Salario */}
      <Card>
        <CardHeader>
          <CardTitle>Salario Mensual</CardTitle>
          <CardDescription>
            Tu ingreso mensual fijo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="salary">Monto</Label>
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

      {/* Gastos Fijos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Gastos Fijos Mensuales</CardTitle>
              <CardDescription>
                Gastos que se repiten cada mes
              </CardDescription>
            </div>
            <Button onClick={addFixedExpense} size="sm">
              Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
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
          </div>
        </CardContent>
      </Card>

      {/* Meta de Ahorro */}
      <Card>
        <CardHeader>
          <CardTitle>Meta de Ahorro Mensual</CardTitle>
          <CardDescription>
            Cuánto quieres ahorrar cada mes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="savings">Monto</Label>
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

