"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const initialData = [
  { name: "Comida", value: 400 },
  { name: "Transporte", value: 300 },
  { name: "Entretenimiento", value: 300 },
  { name: "Servicios", value: 200 },
]

// Usar colores de variables CSS
const getColorValue = (cssVar: string): string => {
  if (typeof window !== 'undefined') {
    const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar)
    return value ? `hsl(${value})` : ''
  }
  return ''
}

export function ExpensePieChart() {
  const [data, setData] = useState(initialData)
  const [mounted, setMounted] = useState(false)
  const [colors, setColors] = useState(['#0088FE', '#00C49F', '#FFBB28', '#FF8042'])

  useEffect(() => {
    setMounted(true)
    // Actualizar colores con variables CSS
    setColors([
      getColorValue('--chart-1'),
      getColorValue('--chart-2'),
      getColorValue('--chart-3'),
      getColorValue('--chart-4')
    ])
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Cargando gráfico...</p>
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

