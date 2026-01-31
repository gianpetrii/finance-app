"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { es } from "date-fns/locale"

import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={es}
      weekStartsOn={1}
      className={cn("p-3", className)}
      classNames={classNames}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />
          }
          return <ChevronRight className="h-4 w-4" />
        },
        CaptionLabel: (captionProps: any) => {
          const { calendarMonth } = captionProps
          const displayMonth = calendarMonth?.date || new Date()
          
          // Generar array de años (10 años atrás y 10 años adelante)
          const currentYear = new Date().getFullYear()
          const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)
          
          // Array de meses
          const months = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
          ]

          const handleMonthChange = (value: string) => {
            const newMonth = parseInt(value)
            const newDate = new Date(displayMonth.getFullYear(), newMonth, 1)
            if (props.onMonthChange) {
              props.onMonthChange(newDate)
            }
          }

          const handleYearChange = (value: string) => {
            const newYear = parseInt(value)
            const newDate = new Date(newYear, displayMonth.getMonth(), 1)
            if (props.onMonthChange) {
              props.onMonthChange(newDate)
            }
          }

          return (
            <div className="flex items-center justify-center gap-2">
              <Select
                value={displayMonth.getMonth().toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="h-8 w-[110px]">
                  <SelectValue>{months[displayMonth.getMonth()]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={displayMonth.getFullYear().toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="h-8 w-[80px]">
                  <SelectValue>{displayMonth.getFullYear()}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        },
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

