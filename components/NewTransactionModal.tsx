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
import { CalendarIcon, Loader2 } from "lucide-react"
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
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [date, setDate] = useState<Date>(new Date())
  const [notes, setNotes] = useState("")

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
    setDescription("")
    setCategory("")
    setPaymentMethod("")
    setDate(new Date())
    setNotes("")
  }

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

    if (!description.trim()) {
      toast.error("Ingresa una descripción")
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

    setLoading(true)

    try {
      // Generar ID único para la transacción
      const transactionId = `${user.uid}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Crear documento en Firestore
      const transactionData = {
        userId: user.uid,
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        category,
        paymentMethod,
        date: date.toISOString(),
        notes: notes.trim()
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

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción *</Label>
            <Input
              id="description"
              placeholder="Ej: Compras en supermercado"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
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
              placeholder="Información adicional..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

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

