"use client"

import type React from "react"

import { useState } from "react"
import { Edit2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface IngresoMensualProps {
  onIngresoChange: (nuevoIngreso: number) => void
}

export function IngresoMensual({ onIngresoChange }: IngresoMensualProps) {
  const [ingreso, setIngreso] = useState(5000)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsEditing(false)
    onIngresoChange(ingreso)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Ingreso Mensual</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
          <Edit2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSave} className="flex items-center space-x-2">
            <Input
              type="number"
              value={ingreso}
              onChange={(e) => setIngreso(Number(e.target.value))}
              className="w-full"
            />
            <Button type="submit" size="sm">
              Guardar
            </Button>
          </form>
        ) : (
          <div className="text-2xl font-bold">${ingreso.toFixed(2)}</div>
        )}
      </CardContent>
    </Card>
  )
}

