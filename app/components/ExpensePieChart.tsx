"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { TimeframeFilterValue } from "@/components/TimeframeFilter"
import { useTransactions } from "@/lib/hooks/useTransactions"

interface ExpensePieChartProps {
  filter?: TimeframeFilterValue
}

// Usar colores de variables CSS
const getColorValue = (cssVar: string): string => {
  if (typeof window !== 'undefined') {
    const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar)
    return value ? `hsl(${value})` : ''
  }
  return ''
}

export function ExpensePieChart({ filter }: ExpensePieChartProps) {
  const [data, setData] = useState<{ name: string; value: number }[]>([])
  const [mounted, setMounted] = useState(false)
  const [colors, setColors] = useState(['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'])

  // Obtener transacciones reales
  const { transactions } = useTransactions({
    startDate: filter?.startDate,
    endDate: filter?.endDate
  })

  useEffect(() => {
    setMounted(true)
    // Actualizar colores con variables CSS
    setColors([
      getColorValue('--chart-1') || '#0088FE',
      getColorValue('--chart-2') || '#00C49F',
      getColorValue('--chart-3') || '#FFBB28',
      getColorValue('--chart-4') || '#FF8042',
      getColorValue('--chart-5') || '#8884d8',
      '#82ca9d',
      '#ffc658',
      '#ff7c7c'
    ])
  }, [])

  useEffect(() => {
    // Filtrar solo gastos
    const expenses = transactions.filter(t => t.type === 'expense')
    
    if (expenses.length === 0) {
      setData([])
      return
    }

    // Agrupar por categoría
    const categoryTotals: Record<string, number> = {}
    expenses.forEach(t => {
      const category = t.category || 'Otros'
      categoryTotals[category] = (categoryTotals[category] || 0) + (t.amount || 0)
    })

    // Convertir a array y ordenar
    const chartData = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8) // Top 8 categorías

    setData(chartData)
  }, [transactions, filter])


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
        <PieChart>
          <Pie 
            data={data} 
            cx="50%" 
            cy="50%" 
            labelLine={false} 
            outerRadius={100} 
            fill="#8884d8" 
            dataKey="value"
            label={(entry) => `${entry.name}`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value) => [`$${value}`, "Gasto"]} 
          />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right"
            wrapperStyle={{ fontSize: '12px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
