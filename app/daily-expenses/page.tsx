"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format, getDaysInMonth, isToday, isSameDay, startOfMonth } from "date-fns"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ChevronLeft, ChevronRight, ArrowUpCircle, ArrowDownCircle, Info, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NewTransactionDialog, Transaction } from "../components/NewTransactionDialog"

// Datos de ejemplo - En una aplicación real, estos vendrían de tu base de datos
const limiteGastoDiario = 200;
// Actualizado para incluir datos del mes actual
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

// Simulación de datos iniciales
const initialTransactions: Transaction[] = [
  {
    id: "1",
    date: new Date(currentYear, currentMonth, 1),
    type: "expense",
    amount: 150,
    description: "Compras en supermercado",
    category: "Alimentación"
  },
  {
    id: "2",
    date: new Date(currentYear, currentMonth, 2),
    type: "expense",
    amount: 220,
    description: "Cena en restaurante",
    category: "Ocio"
  },
  {
    id: "3",
    date: new Date(currentYear, currentMonth, 5),
    type: "expense",
    amount: 300,
    description: "Reparación del coche",
    category: "Transporte"
  },
  {
    id: "4",
    date: new Date(currentYear, currentMonth, 10),
    type: "income",
    amount: 1000,
    description: "Pago parcial",
    category: "Salario"
  },
  {
    id: "5",
    date: new Date(currentYear, currentMonth, 15),
    type: "expense",
    amount: 180,
    description: "Compra ropa",
    category: "Ropa"
  },
  {
    id: "6",
    date: new Date(currentYear, currentMonth, 20),
    type: "expense",
    amount: 210,
    description: "Factura electricidad",
    category: "Servicios"
  },
  {
    id: "7",
    date: new Date(currentYear, currentMonth, 25),
    type: "expense",
    amount: 120,
    description: "Farmacia",
    category: "Salud"
  }
];

// Función para generar un ID único
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

export default function DailyExpensesPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [monthlySpent, setMonthlySpent] = useState(0);
  const [remainingBudget, setRemainingBudget] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDayTransactions, setSelectedDayTransactions] = useState<Transaction[]>([]);
  
  // Obtener gastos para el día seleccionado
  const getExpenseForDay = (date: Date): number => {
    if (!date) return 0;
    
    const dailyTransactions = transactions.filter(t => 
      t.date.getDate() === date.getDate() && 
      t.date.getMonth() === date.getMonth() && 
      t.date.getFullYear() === date.getFullYear()
    );
    
    const expenses = dailyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    return expenses;
  };

  // Función para seleccionar un día
  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date);
    
    if (date) {
      const dailyTransactions = transactions.filter(t => 
        t.date.getDate() === date.getDate() && 
        t.date.getMonth() === date.getMonth() && 
        t.date.getFullYear() === date.getFullYear()
      );
      setSelectedDayTransactions(dailyTransactions);
    } else {
      setSelectedDayTransactions([]);
    }
  };
  
  // Calcular estadísticas mensuales
  useEffect(() => {
    const daysInMonth = getDaysInMonth(currentDate);
    const today = new Date();
    const daysPassed = Math.min(today.getDate(), daysInMonth);
    
    // Filtrar transacciones del mes actual
    const monthTransactions = transactions.filter(t => 
      t.date.getMonth() === currentDate.getMonth() &&
      t.date.getFullYear() === currentDate.getFullYear()
    );
    
    // Calcular gastos
    const totalSpent = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    setMonthlySpent(totalSpent);
    
    // Presupuesto total hasta el día de hoy
    const budgetUntilToday = limiteGastoDiario * daysPassed;
    setRemainingBudget(budgetUntilToday - totalSpent);
    
    // Actualizar transacciones del día seleccionado si hay un día seleccionado
    if (selectedDate) {
      handleSelectDate(selectedDate);
    }
    
  }, [currentDate, transactions, selectedDate]);
  
  // Navegar por meses
  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  // Agregar una nueva transacción
  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTransaction,
      id: generateId()
    };
    
    setTransactions(prev => [...prev, transaction]);
  };

  // Datos para día seleccionado
  const selectedDayExpense = selectedDate ? getExpenseForDay(selectedDate) : 0;
  const selectedDayPercentage = (selectedDayExpense / limiteGastoDiario) * 100;
  const isOverBudget = selectedDayExpense > limiteGastoDiario;
  const remainingDailyBudget = limiteGastoDiario - selectedDayExpense;

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
                          "relative flex flex-col items-center justify-center h-9 w-full rounded-md cursor-pointer", 
                          props.className,
                          isToday(date) && "border border-primary bg-primary/5",
                          hasExpense && !overBudget && "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300",
                          overBudget && "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300",
                        )}
                      >
                        <div className="flex flex-col items-center justify-center h-full py-1">
                          <span className="text-sm leading-none">{format(date, "d")}</span>
                          {hasExpense && (
                            <span className="text-[10px] leading-none mt-1 font-medium">
                              ${expense}
                            </span>
                          )}
                        </div>
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
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary"></span>
                {selectedDate ? (
                  <>Detalles del {format(selectedDate, "d 'de' MMMM")}</>
                ) : (
                  <>Selecciona un día</>
                )}
              </CardTitle>
              {selectedDate && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>Nuevo</span>
                </Button>
              )}
            </div>
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

                {/* Lista de transacciones del día */}
                {selectedDayTransactions.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h3 className="text-sm font-medium">Movimientos del día</h3>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {selectedDayTransactions.map((transaction) => (
                        <div 
                          key={transaction.id} 
                          className={cn(
                            "p-2 rounded-md text-sm border",
                            transaction.type === 'expense' 
                              ? "border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-950/50" 
                              : "border-green-200 bg-green-50 dark:bg-green-950/10 dark:border-green-950/50"
                          )}
                        >
                          <div className="flex justify-between items-start">
                            <span className="font-medium">{transaction.description}</span>
                            <span className={transaction.type === 'expense' ? "text-red-500" : "text-green-500"}>
                              {transaction.type === 'expense' ? '-' : '+'} 
                              ${transaction.amount.toFixed(2)}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {transaction.category}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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

      {/* Diálogo para agregar nuevas transacciones */}
      <NewTransactionDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
        onSave={handleAddTransaction} 
        defaultDate={selectedDate}
      />
    </div>
  )
} 