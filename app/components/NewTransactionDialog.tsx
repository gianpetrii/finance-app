"use client"

import React, { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

export type Transaction = {
  id: string;
  date: Date;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
}

interface NewTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (transaction: Omit<Transaction, 'id'>) => void;
  defaultDate?: Date;
}

const expenseCategories = [
  'Alimentación',
  'Transporte',
  'Ocio',
  'Servicios',
  'Salud',
  'Educación',
  'Ropa',
  'Hogar',
  'Otros'
]

const incomeCategories = [
  'Salario',
  'Freelance',
  'Inversiones',
  'Regalo',
  'Reembolso',
  'Otros'
]

export function NewTransactionDialog({ open, onOpenChange, onSave, defaultDate = new Date() }: NewTransactionDialogProps) {
  const [formData, setFormData] = useState({
    date: format(defaultDate, 'yyyy-MM-dd'),
    type: 'expense',
    amount: '',
    description: '',
    category: ''
  })

  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Actualizar la fecha cuando cambia defaultDate o cuando el diálogo se abre
  React.useEffect(() => {
    if (open) {
      setFormData(prev => ({
        ...prev,
        date: format(defaultDate, 'yyyy-MM-dd')
      }));
    }
  }, [defaultDate, open]);

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories

  // Manejar cambios en los campos del formulario
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    // Limpiar error si el usuario está corrigiendo
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Validar formulario
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!formData.date) errors.date = 'La fecha es requerida'
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      errors.amount = 'Ingresa un monto válido'
    }
    if (!formData.description.trim()) errors.description = 'La descripción es requerida'
    if (!formData.category) errors.category = 'Selecciona una categoría'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = () => {
    if (validateForm()) {
      onSave({
        date: new Date(formData.date),
        type: formData.type as 'income' | 'expense',
        amount: Number(formData.amount),
        description: formData.description,
        category: formData.category
      })
      onOpenChange(false)
      // Resetear el formulario
      setFormData({
        date: format(new Date(), 'yyyy-MM-dd'),
        type: 'expense',
        amount: '',
        description: '',
        category: ''
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nuevo movimiento</DialogTitle>
          <DialogDescription>
            Registra un nuevo ingreso o gasto para tu seguimiento financiero.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Fecha
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="col-span-3"
            />
            {formErrors.date && (
              <p className="text-red-500 text-xs col-span-3 col-start-2">{formErrors.date}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Tipo
            </Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Gasto</SelectItem>
                <SelectItem value="income">Ingreso</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Monto
            </Label>
            <div className="col-span-3 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className="pl-8"
              />
            </div>
            {formErrors.amount && (
              <p className="text-red-500 text-xs col-span-3 col-start-2">{formErrors.amount}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Categoría
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => handleChange('category', value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formErrors.category && (
              <p className="text-red-500 text-xs col-span-3 col-start-2">{formErrors.category}</p>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descripción
            </Label>
            <Input
              id="description"
              placeholder="Describe el movimiento"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="col-span-3"
            />
            {formErrors.description && (
              <p className="text-red-500 text-xs col-span-3 col-start-2">{formErrors.description}</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 