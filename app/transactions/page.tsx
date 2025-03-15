"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TransactionEntry() {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [exchangeRate, setExchangeRate] = useState("1")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí se enviarían los datos a tu backend
    console.log({ amount, description, category, currency, exchangeRate })
    // Resetear formulario
    setAmount("")
    setDescription("")
    setCategory("")
    setCurrency("USD")
    setExchangeRate("1")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Agregar Transacción</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Monto</Label>
          <Input
            id="amount"
            placeholder="Ingrese monto"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Moneda</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione moneda" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="GBP">GBP</SelectItem>
              {/* Agrega más monedas según sea necesario */}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="exchangeRate">Tasa de Cambio</Label>
          <Input
            id="exchangeRate"
            placeholder="Tasa de cambio"
            type="number"
            value={exchangeRate}
            onChange={(e) => setExchangeRate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Input
            id="description"
            placeholder="Ingrese descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Categoría</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Seleccione categoría" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="comida">Comida</SelectItem>
              <SelectItem value="transporte">Transporte</SelectItem>
              <SelectItem value="entretenimiento">Entretenimiento</SelectItem>
              <SelectItem value="servicios">Servicios</SelectItem>
              <SelectItem value="otros">Otros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Agregar Transacción</Button>
      </form>
    </div>
  )
}

