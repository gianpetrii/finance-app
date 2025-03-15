"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "./components/Overview"
import { RecentTransactions } from "./components/RecentTransactions"
import { ExpensePieChart } from "./components/ExpensePieChart"
import { DailyExpensesCalendar } from "./components/DailyExpensesCalendar"
import { IngresoMensual } from "./components/IngresoMensual"
import { AhorroMensual } from "./components/AhorroMensual"
import { GastosFijos } from "./components/GastosFijos"
import { SaldoActual } from "./components/SaldoActual"
import { CreditoAPagar } from "./components/CreditoAPagar"
import { SaldoReal } from "./components/SaldoReal"
import { MontoDiario } from "./components/MontoDiario"
import { FinancialSummary } from "./components/FinancialSummary"

export default function Dashboard() {
  const [ingresoMensual, setIngresoMensual] = useState(5000)
  const [saldoActual, setSaldoActual] = useState(10000)
  const [creditoAPagar, setCreditoAPagar] = useState(2000)
  const [saldoReal, setSaldoReal] = useState(0)
  const [montoDiario, setMontoDiario] = useState(0)

  useEffect(() => {
    // Calcular saldo real
    const nuevoSaldoReal = saldoActual - creditoAPagar
    setSaldoReal(nuevoSaldoReal)

    // Calcular monto diario (asumiendo un mes de 30 días)
    const nuevoMontoDiario = nuevoSaldoReal / 30
    setMontoDiario(nuevoMontoDiario)
  }, [saldoActual, creditoAPagar])

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <div className="h-1 w-24 bg-primary/20 rounded-full"></div>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <IngresoMensual onIngresoChange={setIngresoMensual} />
        <AhorroMensual ingresoMensual={ingresoMensual} />
        <GastosFijos />
      </div>

      <FinancialSummary>
        <SaldoActual saldo={saldoActual} />
        <CreditoAPagar credito={creditoAPagar} />
        <SaldoReal saldoReal={saldoReal} />
        <MontoDiario monto={montoDiario} />
      </FinancialSummary>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              Gastos Mensuales
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Overview />
          </CardContent>
        </Card>
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              Distribución de Gastos
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ExpensePieChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              Gastos Diarios
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <DailyExpensesCalendar />
          </CardContent>
        </Card>
        <Card className="border border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary"></span>
              Transacciones Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

