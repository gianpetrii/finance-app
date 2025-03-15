import { ReactNode } from "react"
import { ChartPieIcon } from "lucide-react"

interface FinancialSummaryProps {
  children: ReactNode
  title?: string
}

export function FinancialSummary({ children, title = "Resumen" }: FinancialSummaryProps) {
  return (
    <div className="rounded-xl bg-card p-6 shadow-md border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ChartPieIcon className="h-6 w-6 text-primary/70" />
          <h2 className="text-xl font-bold">{title}</h2>
          <div className="h-1 w-20 bg-primary/20 rounded-full"></div>
        </div>
        <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
          Actualizado hoy
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {children}
      </div>
    </div>
  )
} 