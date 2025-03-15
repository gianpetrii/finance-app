import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface ResultCardProps {
  title: string
  value: number
  valueColor?: string
  icon?: LucideIcon
  trend?: "up" | "down" | "neutral"
  subtitle?: string
}

export function ResultCard({ 
  title, 
  value, 
  valueColor, 
  icon: Icon,
  trend,
  subtitle
}: ResultCardProps) {
  return (
    <Card className="overflow-hidden border border-border/50 shadow-sm hover:shadow-md transition-all">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col gap-1">
          <div className={`text-2xl font-bold ${valueColor}`}>
            ${value.toFixed(2)}
            {trend && (
              <span className="ml-2 text-xs">
                {trend === "up" && <span className="text-green-500">↑</span>}
                {trend === "down" && <span className="text-red-500">↓</span>}
                {trend === "neutral" && <span className="text-yellow-500">→</span>}
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

