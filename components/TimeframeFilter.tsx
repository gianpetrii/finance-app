"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Filter } from "lucide-react"
import { format, subDays, subWeeks, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"

export interface TimeframeFilterValue {
  mode: "preset" | "custom" | "dayOfWeek"
  preset?: string
  startDate?: Date
  endDate?: Date
  dayOfWeek?: number // 0-6 (Domingo-Sábado)
  lookbackMonths?: number // Para filtro de día de semana
}

interface TimeframeFilterProps {
  value: TimeframeFilterValue
  onChange: (value: TimeframeFilterValue) => void
}

const presetOptions = [
  { value: "7days", label: "Últimos 7 días" },
  { value: "30days", label: "Últimos 30 días" },
  { value: "90days", label: "Últimos 90 días" },
  { value: "thisWeek", label: "Esta semana" },
  { value: "lastWeek", label: "Semana pasada" },
  { value: "thisMonth", label: "Este mes" },
  { value: "lastMonth", label: "Mes pasado" },
  { value: "thisYear", label: "Este año" },
  { value: "lastYear", label: "Año pasado" },
]

const daysOfWeek = [
  { value: 0, label: "Domingos" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábados" },
]

export function TimeframeFilter({ value, onChange }: TimeframeFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Component mounted
  }, [])

  // Calcular días seleccionados
  const getDaysCount = () => {
    if (value.startDate && value.endDate) {
      const diffTime = Math.abs(value.endDate.getTime() - value.startDate.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }
    return 0
  }

  const handlePresetChange = (preset: string) => {
    const today = new Date()
    let startDate: Date
    let endDate: Date = today

    switch (preset) {
      case "7days":
        startDate = subDays(today, 7)
        break
      case "30days":
        startDate = subDays(today, 30)
        break
      case "90days":
        startDate = subDays(today, 90)
        break
      case "thisWeek":
        startDate = startOfWeek(today, { weekStartsOn: 1 })
        endDate = endOfWeek(today, { weekStartsOn: 1 })
        break
      case "lastWeek":
        const lastWeek = subWeeks(today, 1)
        startDate = startOfWeek(lastWeek, { weekStartsOn: 1 })
        endDate = endOfWeek(lastWeek, { weekStartsOn: 1 })
        break
      case "thisMonth":
        startDate = startOfMonth(today)
        endDate = endOfMonth(today)
        break
      case "lastMonth":
        const lastMonth = subMonths(today, 1)
        startDate = startOfMonth(lastMonth)
        endDate = endOfMonth(lastMonth)
        break
      case "thisYear":
        startDate = new Date(today.getFullYear(), 0, 1)
        endDate = new Date(today.getFullYear(), 11, 31)
        break
      case "lastYear":
        startDate = new Date(today.getFullYear() - 1, 0, 1)
        endDate = new Date(today.getFullYear() - 1, 11, 31)
        break
      default:
        startDate = subDays(today, 30)
    }

    onChange({
      mode: "preset",
      preset,
      startDate,
      endDate,
    })
  }

  const getDisplayText = () => {
    if (value.mode === "preset" && value.preset) {
      const option = presetOptions.find(o => o.value === value.preset)
      return option?.label || "Seleccionar período"
    }
    
    if (value.mode === "custom" && value.startDate && value.endDate) {
      return `${format(value.startDate, "dd/MM/yy")} - ${format(value.endDate, "dd/MM/yy")}`
    }
    
    if (value.mode === "dayOfWeek" && value.dayOfWeek !== undefined) {
      const day = daysOfWeek.find(d => d.value === value.dayOfWeek)
      const months = value.lookbackMonths || 6
      return `${day?.label} (últimos ${months} meses)`
    }
    
    return "Seleccionar período"
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          {getDisplayText()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]" align="start">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipo de filtro</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={value.mode === "preset" ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ ...value, mode: "preset" })}
              >
                Presets
              </Button>
              <Button
                variant={value.mode === "custom" ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ ...value, mode: "custom" })}
              >
                Personalizado
              </Button>
              <Button
                variant={value.mode === "dayOfWeek" ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ ...value, mode: "dayOfWeek" })}
              >
                Día Semana
              </Button>
            </div>
          </div>

          {/* Modo Preset */}
          {value.mode === "preset" && (
            <div className="space-y-2">
              <Label>Período</Label>
              <Select value={value.preset} onValueChange={handlePresetChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un período" />
                </SelectTrigger>
                <SelectContent>
                  {presetOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Modo Custom */}
          {value.mode === "custom" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Seleccionar Rango de Fechas</Label>
                <Calendar
                  mode="range"
                  selected={{
                    from: value.startDate,
                    to: value.endDate
                  }}
                  onSelect={(range) => {
                    if (range?.from) {
                      onChange({
                        ...value,
                        startDate: range.from,
                        endDate: range.to
                      })
                    }
                  }}
                  numberOfMonths={1}
                  initialFocus
                />
              </div>
              
              {value.startDate && value.endDate && getDaysCount() > 0 && (
                <div className="text-sm font-medium text-center p-2 bg-primary/10 rounded-lg">
                  {getDaysCount()} {getDaysCount() === 1 ? 'día' : 'días'} seleccionados
                </div>
              )}
            </div>
          )}

          {/* Modo Día de la Semana */}
          {value.mode === "dayOfWeek" && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Día de la Semana</Label>
                <Select 
                  value={value.dayOfWeek?.toString()} 
                  onValueChange={(val) => onChange({ ...value, dayOfWeek: parseInt(val) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un día" />
                  </SelectTrigger>
                  <SelectContent>
                    {daysOfWeek.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Mirar atrás</Label>
                <Select 
                  value={value.lookbackMonths?.toString() || "6"} 
                  onValueChange={(val) => onChange({ ...value, lookbackMonths: parseInt(val) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 meses</SelectItem>
                    <SelectItem value="6">6 meses</SelectItem>
                    <SelectItem value="12">12 meses</SelectItem>
                    <SelectItem value="24">24 meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
                💡 Esto mostrará solo los datos de los{" "}
                <strong>{daysOfWeek.find(d => d.value === value.dayOfWeek)?.label || "días seleccionados"}</strong>
                {" "}en los últimos <strong>{value.lookbackMonths || 6} meses</strong>
              </div>
            </div>
          )}

          <Button 
            className="w-full" 
            onClick={() => setIsOpen(false)}
          >
            Aplicar Filtro
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

