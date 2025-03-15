"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2 } from "lucide-react"
import { calculateDailyBudget } from "@/lib/finance"

export function IncomeExpenseForm() {
  const [income, setIncome] = useState("5000")
  const [fixedExpenses, setFixedExpenses] = useState("2000")
  const [savings, setSavings] = useState("500")
  const [editing, setEditing] = useState<string | null>(null)

  const handleEdit = (field: string) => {
    setEditing(field)
  }

  const handleSave = async () => {
    setEditing(null)
    // Aquí podrías llamar a una función para actualizar los valores en el servidor
    await calculateDailyBudget(Number.parseFloat(income), Number.parseFloat(fixedExpenses), Number.parseFloat(savings))
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <div>
        <Label htmlFor="income" className="text-sm font-medium">
          Ingreso Mensual
        </Label>
        <div className="flex items-center mt-1">
          {editing === "income" ? (
            <Input
              id="income"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              type="number"
              onBlur={handleSave}
              autoFocus
              className="flex-grow"
            />
          ) : (
            <div className="flex-grow text-lg">${income}</div>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleEdit("income")} className="ml-2">
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="fixedExpenses" className="text-sm font-medium">
          Gastos Fijos
        </Label>
        <div className="flex items-center mt-1">
          {editing === "fixedExpenses" ? (
            <Input
              id="fixedExpenses"
              value={fixedExpenses}
              onChange={(e) => setFixedExpenses(e.target.value)}
              type="number"
              onBlur={handleSave}
              autoFocus
              className="flex-grow"
            />
          ) : (
            <div className="flex-grow text-lg">${fixedExpenses}</div>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleEdit("fixedExpenses")} className="ml-2">
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div>
        <Label htmlFor="savings" className="text-sm font-medium">
          Ahorros
        </Label>
        <div className="flex items-center mt-1">
          {editing === "savings" ? (
            <Input
              id="savings"
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              type="number"
              onBlur={handleSave}
              autoFocus
              className="flex-grow"
            />
          ) : (
            <div className="flex-grow text-lg">${savings}</div>
          )}
          <Button variant="ghost" size="sm" onClick={() => handleEdit("savings")} className="ml-2">
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

