"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CardType = {
  id: number;
  name: string;
  number: string;
  expiry: string;
  type: string;
  balance: number;
  limit?: number;
}

type NewCardType = {
  name: string;
  number: string;
  expiry: string;
  type: string;
  balance: string;
  limit: string;
}

const initialCards: CardType[] = [
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
  const [cards, setCards] = useState<CardType[]>(initialCards)
  const [newCard, setNewCard] = useState<NewCardType>({ name: "", number: "", expiry: "", type: "", balance: "", limit: "" })

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault()
    const cardToAdd: CardType = {
      id: Date.now(),
      name: newCard.name,
      number: newCard.number,
      expiry: newCard.expiry,
      type: newCard.type,
      balance: parseFloat(newCard.balance) || 0,
    }
    
    if (newCard.type === "credit" && newCard.limit) {
      cardToAdd.limit = parseFloat(newCard.limit) || 0
    }
    
    setCards([...cards, cardToAdd])
    setNewCard({ name: "", number: "", expiry: "", type: "", balance: "", limit: "" })
  }

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Gestión de Tarjetas</h1>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.id} className="border border-border/50 shadow-sm">
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
      
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            Agregar Nueva Tarjeta
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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

