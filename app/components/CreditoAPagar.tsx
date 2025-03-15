import { ResultCard } from "./ResultCard"
import { CreditCard } from "lucide-react"

interface CreditoAPagarProps {
  credito: number
}

export function CreditoAPagar({ credito }: CreditoAPagarProps) {
  return (
    <ResultCard 
      title="Crédito a Pagar" 
      value={credito} 
      valueColor="text-red-600" 
      icon={CreditCard}
      trend="down"
      subtitle="Monto pendiente de pago"
    />
  )
}

