"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"
import { format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, getDay, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns"
import { es } from "date-fns/locale"
import type { TimeframeFilterValue } from "@/components/TimeframeFilter"
import { useTransactions } from "@/lib/hooks/useTransactions"

interface OverviewProps {
  filter?: TimeframeFilterValue
}

export function Overview({ filter }: OverviewProps) {
  const [data, setData] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  
  // Obtener transacciones reales
  const { transactions } = useTransactions({
    startDate: filter?.startDate,
    endDate: filter?.endDate
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const generateData = () => {
      if (!filter || !filter.startDate || !filter.endDate) {
        // Datos por defecto (últimos 12 meses)
        if (transactions.length === 0) {
          return []
        }
        
        // Agrupar por mes (últimos 12 meses)
        const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        return months.map((name, index) => {
          const monthTransactions = transactions.filter(t => {
            const date = t.date?.toDate ? t.date.toDate() : new Date(t.date)
            return date.getMonth() === index
          })
          
          const gastos = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + (t.amount || 0), 0)
          
          const ingresos = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + (t.amount || 0), 0)
          
          return { name, gastos, ingresos }
        })
      }

      // Generar datos basados en el filtro y transacciones reales
      if (filter.mode === "dayOfWeek" && filter.dayOfWeek !== undefined) {
        return generateDayOfWeekData(filter, transactions)
      } else {
        return generateTimeframeData(filter, transactions)
      }
    }

    setData(generateData())
  }, [filter, transactions])

  const generateTimeframeData = (filter: TimeframeFilterValue, transactions: any[]) => {
    if (!filter.startDate || !filter.endDate) return []

    const daysDiff = Math.abs(filter.endDate.getTime() - filter.startDate.getTime()) / (1000 * 60 * 60 * 24)

    // Si es menos de 31 días, mostrar por día
    if (daysDiff <= 31) {
      const days = eachDayOfInterval({ start: filter.startDate, end: filter.endDate })
      return days.map(day => {
        const dayStart = startOfDay(day)
        const dayEnd = endOfDay(day)
        
        const dayTransactions = transactions.filter(t => {
          const date = t.date?.toDate ? t.date.toDate() : new Date(t.date)
          return date >= dayStart && date <= dayEnd
        })
        
        const gastos = dayTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + (t.amount || 0), 0)
        
        const ingresos = dayTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + (t.amount || 0), 0)
        
        return {
          name: format(day, "dd/MM", { locale: es }),
          gastos,
          ingresos
        }
      })
    }

    // Si es menos de 90 días, mostrar por semana
    if (daysDiff <= 90) {
      const weeks = eachWeekOfInterval(
        { start: filter.startDate, end: filter.endDate },
        { weekStartsOn: 1 }
      )
      return weeks.map((week, index) => {
        const weekStart = startOfWeek(week, { weekStartsOn: 1 })
        const weekEnd = endOfWeek(week, { weekStartsOn: 1 })
        
        const weekTransactions = transactions.filter(t => {
          const date = t.date?.toDate ? t.date.toDate() : new Date(t.date)
          return date >= weekStart && date <= weekEnd
        })
        
        const gastos = weekTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + (t.amount || 0), 0)
        
        const ingresos = weekTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + (t.amount || 0), 0)
        
        return {
          name: `Sem ${index + 1}`,
          gastos,
          ingresos
        }
      })
    }

    // Si es más de 90 días, mostrar por mes
    const months = eachMonthOfInterval({ start: filter.startDate, end: filter.endDate })
    return months.map(month => {
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)
      
      const monthTransactions = transactions.filter(t => {
        const date = t.date?.toDate ? t.date.toDate() : new Date(t.date)
        return date >= monthStart && date <= monthEnd
      })
      
      const gastos = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      
      const ingresos = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      
      return {
        name: format(month, "MMM yy", { locale: es }),
        gastos,
        ingresos
      }
    })
  }

  const generateDayOfWeekData = (filter: TimeframeFilterValue, transactions: any[]) => {
    if (filter.dayOfWeek === undefined || !filter.lookbackMonths) return []

    const months = filter.lookbackMonths || 6
    const today = new Date()
    const startDate = new Date(today.getFullYear(), today.getMonth() - months, 1)
    
    // Obtener todos los días del período
    const allDays = eachDayOfInterval({ start: startDate, end: today })
    
    // Filtrar solo los días de la semana seleccionados
    const selectedDays = allDays.filter(day => getDay(day) === filter.dayOfWeek)
    
    // Mostrar cada ocurrencia individual del día seleccionado con datos reales
    return selectedDays.map(day => {
      const dayStart = startOfDay(day)
      const dayEnd = endOfDay(day)
      
      const dayTransactions = transactions.filter(t => {
        const date = t.date?.toDate ? t.date.toDate() : new Date(t.date)
        return date >= dayStart && date <= dayEnd
      })
      
      const gastos = dayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      
      const ingresos = dayTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + (t.amount || 0), 0)
      
      return {
        name: format(day, "dd/MM", { locale: es }),
        gastos,
        ingresos
      }
    })
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
