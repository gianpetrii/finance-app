import { ResultCard } from "./ResultCard"
import { Wallet } from "lucide-react"

interface SaldoActualProps {
  saldo: number
}

export function SaldoActual({ saldo }: SaldoActualProps) {
  return (
    <ResultCard 
      title="Saldo Actual" 
      value={saldo} 
      valueColor={saldo > 0 ? "text-green-600" : "text-red-600"} 
      icon={Wallet}
      trend={saldo > 0 ? "up" : "down"}
      subtitle="Balance disponible en cuenta"
    />
  )
}

