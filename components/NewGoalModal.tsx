"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"
import { useAuth } from "@/lib/hooks/useAuth"
import { createSavingsGoal } from "@/lib/firebase/collections"

interface NewGoalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewGoalModal({ open, onOpenChange }: NewGoalModalProps) {
  const { user } = useAuth()
  const [name, setName] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [category, setCategory] = useState("purchase")
  const [description, setDescription] = useState("")
  const [targetDate, setTargetDate] = useState<Date>()
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    setName("")
    setTargetAmount("")
    setCategory("purchase")
    setDescription("")
    setTargetDate(undefined)
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión")
      return
    }

    if (!name.trim()) {
      toast.error("Ingresa un nombre para la meta")
      return
    }

    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      toast.error("Ingresa un monto válido")
      return
    }

    if (!targetDate) {
      toast.error("Selecciona una fecha objetivo")
      return
    }

    setSaving(true)

    try {
      await createSavingsGoal(user.uid, {
        name: name.trim(),
        targetAmount: parseFloat(targetAmount),
        currentAmount: 0,
        category,
        description: description.trim() || null,
        targetDate,
        status: "active"
      })

      toast.success("Meta creada exitosamente")
      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error("Error al crear meta:", error)
      toast.error("Error al crear la meta")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Meta de Ahorro</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Meta</Label>
            <Input
              id="name"
              placeholder="Ej: Vacaciones 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <Label htmlFor="amount">Monto Objetivo</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="amount"
                type="number"
                placeholder="0"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">✈️ Vacaciones</SelectItem>
                <SelectItem value="emergency">🛡️ Emergencia</SelectItem>
                <SelectItem value="purchase">🛍️ Compra</SelectItem>
                <SelectItem value="education">📚 Educación</SelectItem>
                <SelectItem value="investment">💰 Inversión</SelectItem>
                <SelectItem value="other">📦 Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fecha Objetivo */}
          <div className="space-y-2">
            <Label>Fecha Objetivo</Label>
            <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {targetDate ? format(targetDate, "PPP", { locale: es }) : "Selecciona una fecha"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={targetDate}
                  onSelect={(newDate) => {
                    setTargetDate(newDate)
                    if (newDate) {
                      setDatePickerOpen(false)
                    }
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Agrega detalles sobre tu meta..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={saving}
            >
              {saving ? "Creando..." : "Crear Meta"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

