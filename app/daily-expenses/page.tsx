"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format, getDaysInMonth, isToday, isSameDay, startOfMonth } from "date-fns"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChevronLeft, ChevronRight, ArrowUpCircle, ArrowDownCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

// Datos de ejemplo - En una aplicación real, estos vendrían de tu base de datos
const limiteGastoDiario = 200;
// Actualizado para incluir datos del mes actual
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();
const gastosMock = {
  [`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`]: 150,
  [`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-02`]: 220,
  [`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-05`]: 300,
  [`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-10`]: 90,
  [`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`]: 180,
  [`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-20`]: 210,
  [`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-25`]: 120,
};

export default function DailyExpensesPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  
  // Obtener gastos para el día seleccionado
  const getExpenseForDay = (date: Date): number => {
    const formattedDate = format(date, "yyyy-MM-dd");
    return gastosMock[formattedDate] || 0;
  };
  
  // Calcular estadísticas mensuales
  useEffect(() => {
    const daysInMonth = getDaysInMonth(currentDate);
    const today = new Date();
    const daysPassed = Math.min(today.getDate(), daysInMonth);
    
    let totalSpent = 0;
    
    // Calcular gasto total del mes
    Object.entries(gastosMock).forEach(([dateString, amount]) => {
      const expenseDate = new Date(dateString);
      if (expenseDate.getMonth() === currentDate.getMonth() &&
          expenseDate.getFullYear() === currentDate.getFullYear()) {
        totalSpent += amount;
      }
    });
    
    setMonthlySpent(totalSpent);
    
    // Presupuesto total hasta el día de hoy
    const budgetUntilToday = limiteGastoDiario * daysPassed;
    setRemainingBudget(budgetUntilToday - totalSpent);
    
  }, [currentDate]);
  
  // Navegar por meses
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Datos para día seleccionado
  const selectedDayExpense = selectedDate ? getExpenseForDay(selectedDate) : 0;
  const selectedDayPercentage = (selectedDayExpense / limiteGastoDiario) * 100;
  const isOverBudget = selectedDayExpense > limiteGastoDiario;
  const remainingDailyBudget = limiteGastoDiario - selectedDayExpense;

  // Función para seleccionar un día
  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Gastos Diarios</h1>
        <p className="text-muted-foreground">Monitorea tus gastos diarios y mantén control de tu presupuesto.</p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Calendario de gastos */}
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary"></span>
                Calendario de Gastos
              </CardTitle>
              <div className="flex gap-2 items-center">
                <Button variant="outline" size="icon" onClick={() => navigateMonth(-1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium">{format(currentDate, "MMMM yyyy")}</span>
                <Button variant="outline" size="icon" onClick={() => navigateMonth(1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="w-full">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleSelectDate}
                month={currentDate}
                onMonthChange={setCurrentDate}
                className="w-full rounded-md border-0"
                showOutsideDays={false}
                captionLayout="buttons"
                fromMonth={new Date(2020, 0)}
                toMonth={new Date(2030, 11)}
                classNames={{
                  months: "w-full flex flex-col space-y-4",
                  month: "w-full",
                  table: "w-full border-collapse",
                  head_row: "w-full flex justify-between",
                  head_cell: "text-muted-foreground flex-1 font-normal text-[0.8rem]",
                  row: "w-full flex justify-between mt-2",
                  cell: "flex-1 relative text-center text-sm p-0 m-1 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                  day: "h-9 w-full p-0 font-normal",
                  day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                  day_today: "bg-accent text-accent-foreground",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_hidden: "invisible"
                }}
                components={{
                  Day: ({ day, date, ...props }: any) => {
                    if (!date) return null;
                    
                    const expense = getExpenseForDay(date);
                    const overBudget = expense > limiteGastoDiario;
                    const hasExpense = expense > 0;

                    // Personalizar apariencia basada en gasto vs límite
                    return (
                      <div 
                        className={cn(
                          "relative flex flex-col items-center justify-center h-9 w-full rounded-md p-0 cursor-pointer", 
                          props.className,
                          isToday(date) && "border border-primary",
                          hasExpense && !overBudget && "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300",
                          overBudget && "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300",
                        )}
                      >
                        <span className="text-sm">{format(date, "d")}</span>
                        {hasExpense && (
                          <span className="text-[10px] mt-0.5 font-medium">
                            ${expense}
                          </span>
                        )}
                      </div>
                    );
                  },
                  Caption: () => null // No mostrar el caption ya que tenemos nuestros propios controles
                }}
              />
            </div>
            
            <div className="mt-4 flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>Dentro del límite</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>Excede el límite</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalles del día seleccionado */}
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              {selectedDate ? (
                <>Detalles del {format(selectedDate, "d 'de' MMMM")}</>
              ) : (
                <>Selecciona un día</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {selectedDate ? (
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Límite diario:</span>
                    <span className="font-medium">${limiteGastoDiario.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Gasto del día:</span>
                    <span className={cn(
                      "font-medium",
                      isOverBudget ? "text-red-500" : "text-green-500"
                    )}>
                      ${selectedDayExpense.toFixed(2)}
                    </span>
                  </div>
                  {isOverBudget ? (
                    <div className="flex justify-between text-sm text-red-500">
                      <span>Excedido:</span>
                      <span className="font-medium">${(selectedDayExpense - limiteGastoDiario).toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-sm text-green-500">
                      <span>Disponible:</span>
                      <span className="font-medium">${remainingDailyBudget.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span>Porcentaje usado:</span>
                    <span className={cn(
                      "font-medium",
                      isOverBudget ? "text-red-500" : "text-green-500"
                    )}>
                      {Math.min(selectedDayPercentage, 100).toFixed(0)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.min(selectedDayPercentage, 100)} 
                    className={cn(
                      "h-2",
                      isOverBudget ? "bg-red-200 dark:bg-red-950/30" : "bg-green-200 dark:bg-green-950/30"
                    )}
                    indicatorClassName={isOverBudget ? "bg-red-500" : "bg-green-500"}
                  />
                </div>

                {isOverBudget && (
                  <Alert variant="destructive" className="bg-red-50 dark:bg-red-950/20">
                    <ArrowUpCircle className="h-4 w-4" />
                    <AlertTitle>Excediste tu límite</AlertTitle>
                    <AlertDescription>
                      Has gastado ${(selectedDayExpense - limiteGastoDiario).toFixed(2)} más de lo planeado para este día.
                    </AlertDescription>
                  </Alert>
                )}

                {!isOverBudget && selectedDayExpense > 0 && (
                  <Alert className="bg-green-50 dark:bg-green-950/20">
                    <ArrowDownCircle className="h-4 w-4" />
                    <AlertTitle>¡Bien hecho!</AlertTitle>
                    <AlertDescription>
                      Mantuviste tus gastos por debajo del límite con ${remainingDailyBudget.toFixed(2)} disponibles.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[240px] text-muted-foreground">
                <Info className="h-8 w-8 mb-2" />
                <p>Selecciona un día en el calendario para ver los detalles</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Resumen mensual */}
      <Card className="border border-border/50 shadow-sm overflow-hidden">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary"></span>
            Resumen del Mes: {format(currentDate, "MMMM yyyy")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Presupuesto hasta hoy</h3>
              <p className="text-2xl font-bold">${(limiteGastoDiario * new Date().getDate()).toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">
                Basado en un límite diario de ${limiteGastoDiario.toFixed(2)}
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Gastado este mes</h3>
              <p className="text-2xl font-bold">${monthlySpent.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">
                {new Date().getDate()} días transcurridos de {getDaysInMonth(currentDate)}
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Balance actual</h3>
              <p className={cn(
                "text-2xl font-bold",
                remainingBudget >= 0 ? "text-green-500" : "text-red-500"
              )}>
                ${remainingBudget.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {remainingBudget >= 0 ? "Disponible para gastar" : "Excedido del presupuesto"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 