"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, getDay } from "date-fns"
import { es } from "date-fns/locale"
import type { TimeframeFilterValue } from "@/components/TimeframeFilter"

interface OverviewProps {
  filter?: TimeframeFilterValue
}

export function Overview({ filter }: OverviewProps) {
  const [data, setData] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!filter || !filter.startDate || !filter.endDate) {
      // Datos por defecto
      setData(generateDefaultData())
      return
    }

    // Generar datos basados en el filtro
    if (filter.mode === "dayOfWeek" && filter.dayOfWeek !== undefined) {
      setData(generateDayOfWeekData(filter))
    } else {
      setData(generateTimeframeData(filter))
    }
  }, [filter])

  const generateDefaultData = () => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    return months.map(name => ({
      name,
      gastos: Math.floor(Math.random() * 3000) + 1000,
      ingresos: Math.floor(Math.random() * 2000) + 3000,
    }))
  }

  const generateTimeframeData = (filter: TimeframeFilterValue) => {
    if (!filter.startDate || !filter.endDate) return []

    const daysDiff = Math.abs(filter.endDate.getTime() - filter.startDate.getTime()) / (1000 * 60 * 60 * 24)

    // Si es menos de 31 días, mostrar por día
    if (daysDiff <= 31) {
      const days = eachDayOfInterval({ start: filter.startDate, end: filter.endDate })
      return days.map(day => ({
        name: format(day, "dd/MM", { locale: es }),
        gastos: Math.floor(Math.random() * 200) + 50,
        ingresos: Math.floor(Math.random() * 300) + 100,
      }))
    }

    // Si es menos de 90 días, mostrar por semana
    if (daysDiff <= 90) {
      const weeks = eachWeekOfInterval(
        { start: filter.startDate, end: filter.endDate },
        { weekStartsOn: 1 }
      )
      return weeks.map((week, index) => ({
        name: `Sem ${index + 1}`,
        gastos: Math.floor(Math.random() * 1000) + 500,
        ingresos: Math.floor(Math.random() * 1500) + 1000,
      }))
    }

    // Si es más de 90 días, mostrar por mes
    const months = eachMonthOfInterval({ start: filter.startDate, end: filter.endDate })
    return months.map(month => ({
      name: format(month, "MMM yy", { locale: es }),
      gastos: Math.floor(Math.random() * 3000) + 1000,
      ingresos: Math.floor(Math.random() * 2000) + 3000,
    }))
  }

  const generateDayOfWeekData = (filter: TimeframeFilterValue) => {
    if (filter.dayOfWeek === undefined || !filter.lookbackMonths) return []

    const months = filter.lookbackMonths || 6
    const today = new Date()
    const startDate = new Date(today.getFullYear(), today.getMonth() - months, 1)
    
    // Obtener todos los días del período
    const allDays = eachDayOfInterval({ start: startDate, end: today })
    
    // Filtrar solo los días de la semana seleccionados
    const selectedDays = allDays.filter(day => getDay(day) === filter.dayOfWeek)
    
    // Mostrar cada ocurrencia individual del día seleccionado
    return selectedDays.map(day => ({
      name: format(day, "dd/MM", { locale: es }),
      gastos: Math.floor(Math.random() * 200) + 50,
      ingresos: Math.floor(Math.random() * 300) + 100,
    }))
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Cargando gráfico...</p>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">No hay datos para mostrar</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="name" 
            stroke="#888888" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            formatter={(value: any) => `$${value}`}
            labelStyle={{ color: "#888888" }}
          />
          <Legend />
          <Bar dataKey="gastos" fill="#ef4444" radius={[4, 4, 0, 0]} name="Gastos" />
          <Bar dataKey="ingresos" fill="#22c55e" radius={[4, 4, 0, 0]} name="Ingresos" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
