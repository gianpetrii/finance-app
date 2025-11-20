"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import type { TimeframeFilterValue } from "@/components/TimeframeFilter"

interface ExpensePieChartProps {
  filter?: TimeframeFilterValue
}

const categories = [
  "Alimentación",
  "Transporte",
  "Ocio",
  "Servicios",
  "Salud",
  "Educación",
  "Ropa",
  "Hogar"
]

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
    const generateDayOfWeekData = () => {
      // Simular datos diferentes según el día de la semana
      const dayPatterns: Record<number, Record<string, number>> = {
        0: { "Ocio": 0.4, "Alimentación": 0.3, "Transporte": 0.1 }, // Domingo
        1: { "Transporte": 0.3, "Alimentación": 0.3, "Servicios": 0.2 }, // Lunes
        2: { "Transporte": 0.3, "Alimentación": 0.3, "Servicios": 0.2 }, // Martes
        3: { "Transporte": 0.3, "Alimentación": 0.3, "Servicios": 0.2 }, // Miércoles
        4: { "Transporte": 0.3, "Alimentación": 0.3, "Servicios": 0.2 }, // Jueves
        5: { "Ocio": 0.35, "Alimentación": 0.3, "Transporte": 0.2 }, // Viernes
        6: { "Ocio": 0.4, "Alimentación": 0.3, "Transporte": 0.1 }, // Sábado
      }

      const dayOfWeek = filter?.dayOfWeek ?? 0
      const pattern = dayPatterns[dayOfWeek] || {}

      return categories.map(name => {
        const weight = pattern[name] || 0.1
        return {
          name,
          value: Math.floor((Math.random() * 500 + 300) * weight)
        }
      }).filter(item => item.value > 0).sort((a, b) => b.value - a.value).slice(0, 6)
    }

    const generateGeneralData = () => {
      return categories.map(name => ({
        name,
        value: Math.floor(Math.random() * 800) + 200
      })).sort((a, b) => b.value - a.value).slice(0, 6)
    }

    // Generar datos basados en el filtro
    if (filter?.mode === "dayOfWeek" && filter.dayOfWeek !== undefined) {
      setData(generateDayOfWeekData())
    } else {
      setData(generateGeneralData())
    }
  }, [filter])


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
