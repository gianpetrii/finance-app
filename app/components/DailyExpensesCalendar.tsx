"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

// Simulación de datos de gastos diarios
const dailyExpenses = {
  "2023-06-01": 50,
  "2023-06-02": 30,
  "2023-06-03": 75,
  // ... más datos
}

export function DailyExpensesCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border border-forest/20"
      components={{
        Day: ({ date, ...props }) => {
          const formattedDate = date?.toISOString().split("T")[0]
          const expense = formattedDate ? dailyExpenses[formattedDate] : undefined

          return (
            <div className={cn("relative", props.className, expense && "bg-sage")}>
              <div {...props} />
              {expense && (
                <div className="absolute bottom-0 left-0 right-0 text-[10px] text-center text-forest-dark">
                  ${expense}
                </div>
              )}
            </div>
          )
        },
      }}
    />
  )
}

