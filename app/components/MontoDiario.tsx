import { ResultCard } from "./ResultCard"
import { Calendar } from "lucide-react"

interface MontoDiarioProps {
  monto: number
}

export function MontoDiario({ monto }: MontoDiarioProps) {
  return (
    <ResultCard 
      title="Monto Diario" 
      value={monto} 
      valueColor={monto > 0 ? "text-blue-600" : "text-red-600"}
      icon={Calendar}
      trend="neutral"
      subtitle="Disponible para gastar por día"
    />
  )
}

