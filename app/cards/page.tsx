"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const initialCards = [
  {
    id: 1,
    name: "Tarjeta de Crédito Principal",
    number: "**** **** **** 1234",
    expiry: "12/24",
    type: "credit",
    balance: 1500,
    limit: 5000,
  },
  { id: 2, name: "Tarjeta de Débito", number: "**** **** **** 5678", expiry: "06/25", type: "debit", balance: 2500 },
]

export default function CardManagement() {
  const [cards, setCards] = useState(initialCards)
  const [newCard, setNewCard] = useState({ name: "", number: "", expiry: "", type: "", balance: "", limit: "" })

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    setCards([...cards, { ...newCard, id: Date.now() }])
    setNewCard({ name: "", number: "", expiry: "", type: "", balance: "", limit: "" })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestión de Tarjetas</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.id}>
            <CardHeader>
              <CardTitle>{card.name}</CardTitle>
              <CardDescription>{card.number}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Vencimiento: {card.expiry}</p>
              <p>Tipo: {card.type === "credit" ? "Crédito" : "Débito"}</p>
              <p>Saldo: ${card.balance}</p>
              {card.type === "credit" && <p>Límite: ${card.limit}</p>}
            </CardContent>
            <CardFooter>
              <Button variant="outline">Editar</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Agregar Nueva Tarjeta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCard} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardName">Nombre de la Tarjeta</Label>
              <Input
                id="cardName"
                value={newCard.name}
                onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Número de Tarjeta</Label>
              <Input
                id="cardNumber"
                value={newCard.number}
                onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardExpiry">Fecha de Vencimiento</Label>
              <Input
                id="cardExpiry"
                value={newCard.expiry}
                onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardType">Tipo de Tarjeta</Label>
              <Select value={newCard.type} onValueChange={(value) => setNewCard({ ...newCard, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="debit">Débito</SelectItem>
                  <SelectItem value="credit">Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardBalance">Saldo</Label>
              <Input
                id="cardBalance"
                type="number"
                value={newCard.balance}
                onChange={(e) => setNewCard({ ...newCard, balance: e.target.value })}
                required
              />
            </div>
            {newCard.type === "credit" && (
              <div className="space-y-2">
                <Label htmlFor="cardLimit">Límite de Crédito</Label>
                <Input
                  id="cardLimit"
                  type="number"
                  value={newCard.limit}
                  onChange={(e) => setNewCard({ ...newCard, limit: e.target.value })}
                  required
                />
              </div>
            )}
            <Button type="submit">Agregar Tarjeta</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

