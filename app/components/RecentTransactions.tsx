import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const transactions = [
  {
    id: 1,
    name: "Supermercado",
    amount: -85.5,
    date: "2023-04-01",
    avatar: "S",
  },
  {
    id: 2,
    name: "Depósito de Salario",
    amount: 3000.0,
    date: "2023-04-01",
    avatar: "DS",
  },
  {
    id: 3,
    name: "Factura de Luz",
    amount: -120.0,
    date: "2023-03-28",
    avatar: "FL",
  },
]

export function RecentTransactions() {
  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{transaction.avatar}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.name}</p>
            <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
          </div>
          <div className={`ml-auto font-medium ${transaction.amount < 0 ? "text-red-500" : "text-green-500"}`}>
            {transaction.amount.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}

