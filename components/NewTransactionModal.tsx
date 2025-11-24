"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, Loader2, Users, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useAuth } from "@/lib/hooks/useAuth"
import { createDocument } from "@/lib/firebase/firestore"

interface NewTransactionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultType?: "expense" | "income"
  onSuccess?: () => void
}

// Categorías predefinidas
const expenseCategories = [
  "Alimentación",
  "Transporte",
  "Ocio",
  "Servicios",
  "Salud",
  "Educación",
  "Ropa",
  "Hogar",
  "Otros"
]

const incomeCategories = [
  "Salario",
  "Freelance",
  "Inversiones",
  "Ventas",
  "Otros"
]

const paymentMethods = [
  "Efectivo",
  "Tarjeta de débito",
  "Tarjeta de crédito",
  "Transferencia",
  "Otro"
]

export function NewTransactionModal({ 
  open, 
  onOpenChange, 
  defaultType = "expense",
  onSuccess 
}: NewTransactionModalProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  
  // Estados del formulario
  const [type, setType] = useState<"expense" | "income">(defaultType)
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [notes, setNotes] = useState("")
  const [isSplitExpense, setIsSplitExpense] = useState(false)
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal")
  const [numberOfPeople, setNumberOfPeople] = useState("2")
  const [splitPeople, setSplitPeople] = useState<Array<{ id: number; name: string; amount: string }>>([
    { id: 1, name: "", amount: "" },
    { id: 2, name: "", amount: "" }
  ])

  // Actualizar tipo cuando cambia defaultType o se abre el modal
  useEffect(() => {
    if (open) {
      setType(defaultType)
      setCategory("") // Resetear categoría al cambiar tipo
    }
  }, [open, defaultType])

  // Resetear formulario
  const resetForm = () => {
    setType(defaultType)
    setAmount("")
    setCategory("")
    setPaymentMethod("")
    setDate(new Date())
    setNotes("")
    setIsSplitExpense(false)
    setSplitType("equal")
    setNumberOfPeople("2")
    setSplitPeople([
      { id: 1, name: "", amount: "" },
      { id: 2, name: "", amount: "" }
    ])
  }

  // Manejar cambio en número de personas (partes iguales)
  const handleNumberOfPeopleChange = (value: string) => {
    const num = parseInt(value) || 2
    setNumberOfPeople(value)
    
    if (splitType === "equal") {
      const newPeople = Array.from({ length: num }, (_, i) => ({
        id: i + 1,
        name: splitPeople[i]?.name || "",
        amount: ""
      }))
      setSplitPeople(newPeople)
    }
  }

  // Agregar persona
  const addPerson = () => {
    const newId = Math.max(...splitPeople.map(p => p.id), 0) + 1
    setSplitPeople([...splitPeople, { id: newId, name: "", amount: "" }])
    setNumberOfPeople(String(splitPeople.length + 1))
  }

  // Remover persona
  const removePerson = (id: number) => {
    if (splitPeople.length > 1) {
      setSplitPeople(splitPeople.filter(p => p.id !== id))
      setNumberOfPeople(String(splitPeople.length - 1))
    }
  }

  // Actualizar persona
  const updatePerson = (id: number, field: "name" | "amount", value: string) => {
    setSplitPeople(splitPeople.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  // Calcular totales de división
  const totalAmount = parseFloat(amount) || 0
  const amountPerPerson = splitType === "equal" && parseInt(numberOfPeople) > 0
    ? totalAmount / parseInt(numberOfPeople)
    : 0
  const assignedAmount = splitType === "custom"
    ? splitPeople.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0)
    : 0
  const remainingAmount = splitType === "custom" ? totalAmount - assignedAmount : 0

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      toast.error("Debes iniciar sesión para agregar transacciones")
      return
    }

    // Validaciones
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Ingresa un monto válido")
      return
    }

    if (!category) {
      toast.error("Selecciona una categoría")
      return
    }

    if (!paymentMethod) {
      toast.error("Selecciona un método de pago")
      return
    }

    // Validar gasto dividido
    if (type === "expense" && isSplitExpense) {
      if (splitType === "custom") {
        if (Math.abs(remainingAmount) > 0.01) {
          toast.error(`Los montos no coinciden. Faltan ${remainingAmount > 0 ? 'asignar' : 'sobran'} $${Math.abs(remainingAmount).toFixed(2)}`)
          return
        }
      }
    }

    setLoading(true)

    try {
      // Generar ID único para la transacción
      const transactionId = `${user.uid}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Preparar datos de división si aplica
      const splitData = type === "expense" && isSplitExpense ? {
        splitType,
        people: splitPeople.map((p, index) => ({
          name: p.name.trim() || `Persona ${index + 1}`, // Si no hay nombre, usar "Persona X"
          amount: splitType === "equal" 
            ? amountPerPerson 
            : parseFloat(p.amount) || 0,
          paid: false
        })),
        totalToRecover: totalAmount
      } : null

      // Crear documento en Firestore
      const transactionData = {
        userId: user.uid,
        type,
        amount: parseFloat(amount),
        description: notes.trim() || category, // Usar notas como descripción, o categoría si está vacío
        category,
        paymentMethod,
        date: date.toISOString(),
        notes: notes.trim(),
        isSplitExpense: type === "expense" ? isSplitExpense : false,
        ...(splitData && { splitExpense: splitData })
      }

      const result = await createDocument("transactions", transactionId, transactionData)
      
      if (result.error) {
        throw new Error(result.error)
      }

      toast.success(
        type === "expense" 
          ? "Gasto agregado exitosamente" 
          : "Ingreso agregado exitosamente"
      )

      resetForm()
      onOpenChange(false)
      
      // Llamar callback de éxito si existe
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error al guardar transacción:", error)
      toast.error("Error al guardar la transacción. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const categories = type === "expense" ? expenseCategories : incomeCategories

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {type === "expense" ? "Agregar Gasto" : "Agregar Ingreso"}
          </DialogTitle>
          <DialogDescription>
            Completa los detalles de la transacción
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de transacción */}
          <div className="space-y-2">
            <Label>Tipo de Transacción</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={type === "expense" ? "default" : "outline"}
                onClick={() => {
                  setType("expense")
                  setCategory("")
                }}
                className="w-full"
              >
                Gasto
              </Button>
              <Button
                type="button"
                variant={type === "income" ? "default" : "outline"}
                onClick={() => {
                  setType("income")
                  setCategory("")
                }}
                className="w-full"
              >
                Ingreso
              </Button>
            </div>
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <Label htmlFor="amount">Monto *</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7"
                required
              />
            </div>
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Método de pago */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Método de Pago *</Label>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un método" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Fecha */}
          <div className="space-y-2">
            <Label>Fecha *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Notas opcionales */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas (opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Ej: Almuerzo con cliente, Compras en supermercado..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Gasto Dividido - Solo para gastos */}
          {type === "expense" && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 p-3 rounded-lg border bg-muted/30">
                <Checkbox
                  id="splitExpense"
                  checked={isSplitExpense}
                  onCheckedChange={(checked) => setIsSplitExpense(checked as boolean)}
                />
                <Label
                  htmlFor="splitExpense"
                  className="text-sm font-normal cursor-pointer flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Este es un gasto dividido con otras personas
                </Label>
              </div>

              {/* Formulario expandible de división */}
              {isSplitExpense && (
                <div className="space-y-4 p-4 rounded-lg border-2 border-primary/20">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Users className="h-4 w-4" />
                    <span>Dividir gasto (yo pagué ${totalAmount.toLocaleString()})</span>
                  </div>

                  {/* Tipo de división */}
                  <RadioGroup value={splitType} onValueChange={(value: "equal" | "custom") => setSplitType(value)}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="equal" id="equal" />
                      <Label htmlFor="equal" className="font-normal cursor-pointer">
                        Partes iguales
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="custom" />
                      <Label htmlFor="custom" className="font-normal cursor-pointer">
                        Montos personalizados
                      </Label>
                    </div>
                  </RadioGroup>

                  {/* Partes iguales */}
                  {splitType === "equal" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm">Número de personas:</Label>
                        <Input
                          type="number"
                          min="2"
                          value={numberOfPeople}
                          onChange={(e) => handleNumberOfPeopleChange(e.target.value)}
                          className="w-20 h-9"
                        />
                        <span className="text-sm text-muted-foreground">
                          = ${amountPerPerson.toFixed(2)} c/u
                        </span>
                      </div>

                      {/* Lista de personas */}
                      <div className="space-y-2">
                        {splitPeople.map((person, index) => (
                          <div key={person.id} className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground w-8">{index + 1}.</span>
                            <Input
                              placeholder={`Persona ${index + 1}`}
                              value={person.name}
                              onChange={(e) => updatePerson(person.id, "name", e.target.value)}
                              className="flex-1"
                            />
                            <span className="text-sm font-medium w-20 text-right">
                              ${amountPerPerson.toFixed(2)}
                            </span>
                            {splitPeople.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => removePerson(person.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Montos personalizados */}
                  {splitType === "custom" && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        {splitPeople.map((person, index) => (
                          <div key={person.id} className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground w-8">{index + 1}.</span>
                            <Input
                              placeholder={`Persona ${index + 1}`}
                              value={person.name}
                              onChange={(e) => updatePerson(person.id, "name", e.target.value)}
                              className="flex-1"
                            />
                            <div className="relative w-24">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                                $
                              </span>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0"
                                value={person.amount}
                                onChange={(e) => updatePerson(person.id, "amount", e.target.value)}
                                className="pl-5"
                              />
                            </div>
                            {splitPeople.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9"
                                onClick={() => removePerson(person.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addPerson}
                        className="w-full gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Agregar persona
                      </Button>

                      {/* Resumen */}
                      <div className="p-3 rounded-lg border bg-muted/30 space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total a recuperar:</span>
                          <span className="font-medium">${totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Asignado:</span>
                          <span className="font-medium">${assignedAmount.toFixed(2)}</span>
                        </div>
                        <div className={`flex justify-between ${Math.abs(remainingAmount) < 0.01 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          <span className="font-medium">
                            {remainingAmount > 0.01 ? 'Falta asignar:' : remainingAmount < -0.01 ? 'Sobran:' : 'Completo ✓'}
                          </span>
                          <span className="font-bold">
                            {Math.abs(remainingAmount) < 0.01 ? '✓' : `$${Math.abs(remainingAmount).toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}


