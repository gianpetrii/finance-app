"use client"

import { useState } from "react"
import { Edit2, ChevronDown, ChevronUp, Plus, Trash } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type GastoFijo = {
  id: number
  nombre: string
  monto: number
}

export function GastosFijos() {
  const [gastos, setGastos] = useState<GastoFijo[]>([
    { id: 1, nombre: "Alquiler", monto: 1000 },
    { id: 2, nombre: "Servicios", monto: 200 },
  ])
  const [isExpanded, setIsExpanded] = useState(false)
  const [newGasto, setNewGasto] = useState<GastoFijo>({ id: 0, nombre: "", monto: 0 })

  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.monto, 0)

  const handleAddGasto = () => {
    if (newGasto.nombre && newGasto.monto > 0) {
      setGastos([...gastos, { ...newGasto, id: Date.now() }])
      setNewGasto({ id: 0, nombre: "", monto: 0 })
    }
  }

  const handleRemoveGasto = (id: number) => {
    setGastos(gastos.filter((gasto) => gasto.id !== id))
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className="text-sm font-medium cursor-pointer flex items-center"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          Gastos Fijos
          {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
        </CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm">
              <Edit2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Gastos Fijos</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {gastos.map((gasto) => (
                <div key={gasto.id} className="flex items-center space-x-2">
                  <Input
                    value={gasto.nombre}
                    onChange={(e) =>
                      setGastos(gastos.map((g) => (g.id === gasto.id ? { ...g, nombre: e.target.value } : g)))
                    }
                    placeholder="Nombre del gasto"
                  />
                  <Input
                    type="number"
                    value={gasto.monto}
                    onChange={(e) =>
                      setGastos(gastos.map((g) => (g.id === gasto.id ? { ...g, monto: Number(e.target.value) } : g)))
                    }
                    placeholder="Monto"
                  />
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveGasto(gasto.id)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="flex items-center space-x-2">
                <Input
                  value={newGasto.nombre}
                  onChange={(e) => setNewGasto({ ...newGasto, nombre: e.target.value })}
                  placeholder="Nuevo gasto"
                />
                <Input
                  type="number"
                  value={newGasto.monto || ""}
                  onChange={(e) => setNewGasto({ ...newGasto, monto: Number(e.target.value) })}
                  placeholder="Monto"
                />
                <Button variant="ghost" size="sm" onClick={handleAddGasto}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">${totalGastos.toFixed(2)}</div>
        {isExpanded && (
          <div className="mt-2 space-y-1">
            {gastos.map((gasto) => (
              <div key={gasto.id} className="flex justify-between text-sm">
                <span>{gasto.nombre}</span>
                <span>${gasto.monto.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

