import { ResultCard } from "./ResultCard"
import { BarChart3 } from "lucide-react"

interface SaldoRealProps {
  saldoReal: number
}

export function SaldoReal({ saldoReal }: SaldoRealProps) {
  return (
    <ResultCard 
      title="Saldo Real" 
      value={saldoReal} 
      valueColor={saldoReal > 0 ? "text-green-600" : "text-red-600"} 
      icon={BarChart3}
      trend={saldoReal > 0 ? "up" : "down"}
      subtitle="Saldo después de pagos pendientes"
    />
  )
}

