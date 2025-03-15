"use client"

import type React from "react"

import { useState } from "react"
import { Edit2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface AhorroMensualProps {
  ingresoMensual: number
}

export function AhorroMensual({ ingresoMensual }: AhorroMensualProps) {
  const [tipoAhorro, setTipoAhorro] = useState<"monto" | "porcentaje">("monto")
  const [valorAhorro, setValorAhorro] = useState(1000)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsEditing(false)
  }

  const calcularAhorro = () => {
    if (tipoAhorro === "monto") {
      return valorAhorro
    } else {
      return (ingresoMensual * valorAhorro) / 100
    }
  }

  const ahorroCalculado = calcularAhorro()
  const porcentajeCalculado = (ahorroCalculado / ingresoMensual) * 100

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Ahorro Mensual</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
          <Edit2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-2">
            <Select value={tipoAhorro} onValueChange={(value: "monto" | "porcentaje") => setTipoAhorro(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de ahorro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monto">Monto fijo</SelectItem>
                <SelectItem value="porcentaje">Porcentaje</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              value={valorAhorro}
              onChange={(e) => setValorAhorro(Number(e.target.value))}
              className="w-full"
              placeholder={tipoAhorro === "monto" ? "Monto de ahorro" : "Porcentaje de ahorro"}
            />
            <Button type="submit" size="sm">
              Guardar
            </Button>
          </form>
        ) : (
          <>
            <div className="text-2xl font-bold">${ahorroCalculado.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {tipoAhorro === "monto"
                ? `${porcentajeCalculado.toFixed(2)}% del ingreso`
                : `${valorAhorro}% del ingreso`}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

