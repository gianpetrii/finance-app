"use client"

import type React from "react"

import { useState } from "react"
import { Edit2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function AhorrosAcumulados() {
  const [ahorros, setAhorros] = useState(2000)
  const [objetivo, setObjetivo] = useState(10000)
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsEditing(false)
  }

  const progress = (ahorros / objetivo) * 100

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Ahorros Acumulados</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
          <Edit2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={ahorros}
                onChange={(e) => setAhorros(Number(e.target.value))}
                className="w-full"
                placeholder="Ahorros actuales"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                value={objetivo}
                onChange={(e) => setObjetivo(Number(e.target.value))}
                className="w-full"
                placeholder="Objetivo de ahorro"
              />
            </div>
            <Button type="submit" size="sm">
              Guardar
            </Button>
          </form>
        ) : (
          <>
            <div className="text-2xl font-bold">${ahorros.toFixed(2)}</div>
            <Progress value={progress} className="mt-2" />
            <div className="text-sm text-muted-foreground mt-1">Objetivo: ${objetivo.toFixed(2)}</div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

