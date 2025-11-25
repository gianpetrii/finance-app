"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useTransactions } from "@/lib/hooks/useTransactions"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function RecentTransactions() {
  const { transactions, loading } = useTransactions({ limit: 5 })

  if (loading) {
    return (
      <div className="space-y-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center animate-pulse">
            <div className="h-9 w-9 bg-muted rounded-full" />
            <div className="ml-4 space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
            <div className="h-4 bg-muted rounded w-16" />
          </div>
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">No hay transacciones recientes</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {transactions.slice(0, 5).map((transaction) => {
        const isExpense = transaction.type === 'expense'
        const amount = isExpense ? -transaction.amount : transaction.amount
        const date = transaction.date?.toDate ? transaction.date.toDate() : new Date(transaction.date)
        const initials = transaction.category?.substring(0, 2).toUpperCase() || 'TR'
        
        return (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
              <AvatarFallback className={isExpense ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200" : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200"}>
                {initials}
              </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{transaction.category}</p>
              <p className="text-sm text-muted-foreground">
                {format(date, "d 'de' MMMM", { locale: es })}
              </p>
            </div>
            <div className={`ml-auto font-medium ${isExpense ? "text-red-500" : "text-green-500"}`}>
              {amount > 0 ? '+' : ''}${Math.abs(amount).toFixed(2)}
          </div>
          </div>
        )
      })}
    </div>
  )
}

