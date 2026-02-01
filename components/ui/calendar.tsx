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

export type CalendarProps = React.ComponentProps<typeof DayPicker> & {
  onDayClick?: (date: Date) => void
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  onDayClick,
  month: controlledMonth,
  onMonthChange,
  ...props
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = React.useState<Date>(controlledMonth || new Date())
  
  // Usar el mes controlado si existe, sino usar el interno
  const currentMonth = controlledMonth || internalMonth

  const handleDayClick = (date: Date | undefined) => {
    if (date && onDayClick) {
      onDayClick(date)
    }
  }

  const handleMonthChange = (newMonth: Date) => {
    if (onMonthChange) {
      onMonthChange(newMonth)
    } else {
      setInternalMonth(newMonth)
    }
  }

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={es}
      weekStartsOn={1}
      month={currentMonth}
      onMonthChange={handleMonthChange}
      className={cn("p-3", className)}
      classNames={classNames}
      onDayClick={handleDayClick}
      components={{
        Chevron: ({ orientation }) => {
          if (orientation === "left") {
            return <ChevronLeft className="h-4 w-4" />
          }
          return <ChevronRight className="h-4 w-4" />
        },
        CaptionLabel: () => {
          // Generar array de años (10 años atrás y 10 años adelante)
          const currentYear = new Date().getFullYear()
          const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i)
          
          // Array de meses
          const months = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
          ]

          const handleMonthSelect = (value: string) => {
            const newMonth = parseInt(value)
            const newDate = new Date(currentMonth.getFullYear(), newMonth, 1)
            handleMonthChange(newDate)
          }

          const handleYearSelect = (value: string) => {
            const newYear = parseInt(value)
            const newDate = new Date(newYear, currentMonth.getMonth(), 1)
            handleMonthChange(newDate)
          }

          return (
            <div className="flex items-center justify-center gap-2">
              <Select
                value={currentMonth.getMonth().toString()}
                onValueChange={handleMonthSelect}
              >
                <SelectTrigger className="h-8 w-[130px] border-0 shadow-none hover:bg-accent focus:ring-0 focus:ring-offset-0">
                  <SelectValue>{months[currentMonth.getMonth()]}</SelectValue>
                </SelectTrigger>
                <SelectContent className="z-[200]">
                  {months.map((month, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={currentMonth.getFullYear().toString()}
                onValueChange={handleYearSelect}
              >
                <SelectTrigger className="h-8 w-[80px] border-0 shadow-none hover:bg-accent focus:ring-0 focus:ring-offset-0">
                  <SelectValue>{currentMonth.getFullYear()}</SelectValue>
                </SelectTrigger>
                <SelectContent className="z-[200]">
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

