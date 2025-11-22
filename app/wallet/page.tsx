"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Wallet,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  ArrowRightLeft,
  DollarSign,
  CreditCard,
  Building2,
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Bell
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Tipos
interface BankAccount {
  id: string
  name: string
  type: "checking" | "savings" | "investment"
  balance: number
  bank: string
  accountNumber: string
  color: string
}

interface CreditCard {
  id: string
  name: string
  type: "credit" | "debit"
  balance: number
  limit?: number
  bank: string
  cardNumber: string
  expiry: string
  dueDate?: Date
  color: string
}

interface Debt {
  id: string
  type: "receivable" | "payable" // Me deben o Debo
  personName: string
  amount: number
  amountPaid: number
  concept: string
  date: Date
  status: "pending" | "partial" | "paid"
  groupId?: string // Para agrupar gastos divididos
}

interface GroupExpense {
  id: string
  concept: string
  totalAmount: number
  paidBy: string
  date: Date
  debts: Debt[]
}

// Datos de ejemplo - Cuentas Bancarias
const initialAccounts: BankAccount[] = [
  {
    id: "1",
    name: "Cuenta Corriente Principal",
    type: "checking",
    balance: 5420.50,
    bank: "Banco Nacional",
    accountNumber: "****1234",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "2",
    name: "Cuenta de Ahorros",
    type: "savings",
    balance: 12350.00,
    bank: "Banco Nacional",
    accountNumber: "****5678",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "3",
    name: "Inversiones",
    type: "investment",
    balance: 25800.00,
    bank: "Broker Online",
    accountNumber: "****3456",
    color: "from-orange-500 to-red-500"
  }
]

// Datos de ejemplo - Tarjetas
const initialCards: CreditCard[] = [
  {
    id: "1",
    name: "Visa Platinum",
    type: "credit",
    balance: 2150,
    limit: 5000,
    bank: "Banco Internacional",
    cardNumber: "**** **** **** 9012",
    expiry: "12/26",
    dueDate: new Date(2025, 11, 10),
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "2",
    name: "Mastercard Gold",
    type: "credit",
    balance: 850,
    limit: 3000,
    bank: "Banco Nacional",
    cardNumber: "**** **** **** 3456",
    expiry: "08/27",
    dueDate: new Date(2025, 11, 15),
    color: "from-yellow-500 to-orange-500"
  },
  {
    id: "3",
    name: "Tarjeta de Débito",
    type: "debit",
    balance: 2500,
    bank: "Banco Nacional",
    cardNumber: "**** **** **** 7890",
    expiry: "06/25",
    color: "from-indigo-500 to-blue-500"
  }
]

// Datos de ejemplo - Gastos Grupales
const initialGroupExpenses: GroupExpense[] = [
  {
    id: "1",
    concept: "Asado del Sábado",
    totalAmount: 500,
    paidBy: "Tú",
    date: new Date(2025, 10, 16),
    debts: [
      { id: "d1", type: "receivable", personName: "Juan", amount: 100, amountPaid: 100, concept: "Asado del Sábado", date: new Date(2025, 10, 16), status: "paid", groupId: "1" },
      { id: "d2", type: "receivable", personName: "María", amount: 100, amountPaid: 0, concept: "Asado del Sábado", date: new Date(2025, 10, 16), status: "pending", groupId: "1" },
      { id: "d3", type: "receivable", personName: "Pedro", amount: 100, amountPaid: 100, concept: "Asado del Sábado", date: new Date(2025, 10, 16), status: "paid", groupId: "1" },
      { id: "d4", type: "receivable", personName: "Ana", amount: 100, amountPaid: 50, concept: "Asado del Sábado", date: new Date(2025, 10, 16), status: "partial", groupId: "1" },
    ]
  }
]

// Deudas individuales adicionales
const initialIndividualDebts: Debt[] = [
  {
    id: "i1",
    type: "receivable",
    personName: "Carlos",
    amount: 250,
    amountPaid: 0,
    concept: "Préstamo personal",
    date: new Date(2025, 10, 10),
    status: "pending"
  },
  {
    id: "i2",
    type: "payable",
    personName: "Laura",
    amount: 150,
    amountPaid: 0,
    concept: "Cena del viernes",
    date: new Date(2025, 10, 18),
    status: "pending"
  }
]

const accountTypeLabels = {
  checking: "Cuenta Corriente",
  savings: "Ahorro",
  investment: "Inversión"
}

export default function WalletPage() {
  const [accounts] = useState<BankAccount[]>(initialAccounts)
  const [cards] = useState<CreditCard[]>(initialCards)
  const [groupExpenses] = useState<GroupExpense[]>(initialGroupExpenses)
  const [individualDebts] = useState<Debt[]>(initialIndividualDebts)
  const [hideBalances, setHideBalances] = useState(false)
  const [activeTab, setActiveTab] = useState("accounts")

  // Calcular totales de cuentas
  const totalAccountsBalance = accounts.reduce((sum, a) => sum + a.balance, 0)

  // Calcular totales de tarjetas
  const creditCards = cards.filter(c => c.type === "credit")
  const debitCards = cards.filter(c => c.type === "debit")
  const totalCreditUsed = creditCards.reduce((sum, c) => sum + c.balance, 0)
  const totalCreditLimit = creditCards.reduce((sum, c) => sum + (c.limit || 0), 0)
  const totalCreditAvailable = totalCreditLimit - totalCreditUsed
  const totalDebitBalance = debitCards.reduce((sum, c) => sum + c.balance, 0)

  // Calcular deudas
  const allDebts = [
    ...groupExpenses.flatMap(g => g.debts),
    ...individualDebts
  ]
  const receivables = allDebts.filter(d => d.type === "receivable")
  const payables = allDebts.filter(d => d.type === "payable")
  
  const totalReceivable = receivables.reduce((sum, d) => sum + (d.amount - d.amountPaid), 0)
  const totalPayable = payables.reduce((sum, d) => sum + (d.amount - d.amountPaid), 0)

  // Saldos
  const realBalance = totalAccountsBalance + totalDebitBalance // Lo que realmente tienes
  const availableBalance = realBalance - totalCreditUsed - totalPayable // Descontando lo que debes
  const projectedBalance = availableBalance + totalReceivable // Si te pagaran todo

  const getDebtStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "text-green-600 dark:text-green-400"
      case "partial": return "text-yellow-600 dark:text-yellow-400"
      default: return "text-red-600 dark:text-red-400"
    }
  }

  const getDebtStatusIcon = (status: string) => {
    switch (status) {
      case "paid": return <CheckCircle className="h-4 w-4" />
      case "partial": return <Clock className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Wallet className="h-7 w-7 text-primary" />
            Billetera
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona tus cuentas, tarjetas y deudas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setHideBalances(!hideBalances)}
          >
            {hideBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Resumen Financiero Global */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Saldo Real
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {hideBalances ? "••••••" : `$${realBalance.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              En cuentas y efectivo
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              A Pagar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {hideBalances ? "••••••" : `$${(totalCreditUsed + totalPayable).toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Tarjetas + Deudas
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              A Cobrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {hideBalances ? "••••••" : `$${totalReceivable.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Te deben
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4 text-blue-500" />
              Saldo Disponible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {hideBalances ? "••••••" : `$${availableBalance.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Proyectado: ${projectedBalance.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="accounts">Cuentas</TabsTrigger>
          <TabsTrigger value="cards">Tarjetas</TabsTrigger>
          <TabsTrigger value="debts" className="relative">
            Deudas
            {(totalReceivable > 0 || totalPayable > 0) && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs flex items-center justify-center">
                {receivables.filter(d => d.status !== "paid").length + payables.filter(d => d.status !== "paid").length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Tab: Cuentas */}
        <TabsContent value="accounts" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Cuentas Bancarias</h2>
              <Badge variant="secondary">{accounts.length}</Badge>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Cuenta
            </Button>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {accounts.map((account) => (
              <Card 
                key={account.id}
                className="overflow-hidden border-2 hover:shadow-lg transition-all"
              >
                <div className={`h-2 bg-gradient-to-r ${account.color}`} />

                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${account.color}`}>
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-1">{account.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Building2 className="h-3 w-3" />
                          {account.bank}
                        </CardDescription>
                        <p className="text-xs text-muted-foreground mt-1">
                          {account.accountNumber}
                        </p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {accountTypeLabels[account.type]}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Saldo Disponible</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {hideBalances ? "••••••" : `$${account.balance.toLocaleString()}`}
                      </p>
                      <span className="text-sm text-muted-foreground">USD</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <ArrowRightLeft className="h-4 w-4" />
                      Transferir
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-2">
                      <Eye className="h-4 w-4" />
                      Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab: Tarjetas */}
        <TabsContent value="cards" className="space-y-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Tarjetas</h2>
              <Badge variant="secondary">{cards.length}</Badge>
            </div>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Tarjeta
            </Button>
          </div>

          {/* Resumen de Tarjetas de Crédito */}
          {creditCards.length > 0 && (
            <Card className="border-2 border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-orange-500/5">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Adeudado</p>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                      ${totalCreditUsed.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Límite Total</p>
                    <p className="text-2xl font-bold">
                      ${totalCreditLimit.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Disponible</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                      ${totalCreditAvailable.toLocaleString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {cards.map((card) => {
              const isCredit = card.type === "credit"
              const creditUsagePercent = isCredit && card.limit ? (card.balance / card.limit) * 100 : 0

              return (
                <Card 
                  key={card.id}
                  className="overflow-hidden border-2 hover:shadow-lg transition-all"
                >
                  <div className={`h-2 bg-gradient-to-r ${card.color}`} />

                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-3 rounded-lg bg-gradient-to-r ${card.color}`}>
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{card.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <Building2 className="h-3 w-3" />
                            {card.bank}
                          </CardDescription>
                          <p className="text-xs text-muted-foreground mt-1">
                            {card.cardNumber}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={isCredit ? "destructive" : "secondary"} className="text-xs">
                              {isCredit ? "Crédito" : "Débito"}
                            </Badge>
                            <span className="text-xs text-muted-foreground">Vence: {card.expiry}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        {isCredit ? "Saldo Adeudado" : "Saldo Disponible"}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className={`text-3xl font-bold ${
                          isCredit 
                            ? "text-red-600 dark:text-red-400" 
                            : "text-green-600 dark:text-green-400"
                        }`}>
                          {hideBalances ? "••••••" : `$${card.balance.toLocaleString()}`}
                        </p>
                        <span className="text-sm text-muted-foreground">USD</span>
                      </div>
                    </div>

                    {isCredit && card.limit && (
                      <div className="pt-2 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Límite</span>
                          <span className="font-medium">
                            {hideBalances ? "••••••" : `$${card.limit.toLocaleString()}`}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Disponible</span>
                          <span className="font-medium text-green-600 dark:text-green-400">
                            {hideBalances ? "••••••" : `$${(card.limit - card.balance).toLocaleString()}`}
                          </span>
                        </div>
                        {card.dueDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Vencimiento</span>
                            <span className="font-medium">
                              {format(card.dueDate, "d 'de' MMM", { locale: es })}
                            </span>
                          </div>
                        )}
                        <div className="mt-2">
                          <div className="flex justify-between text-xs mb-1">
                            <span>Uso del crédito</span>
                            <span>{creditUsagePercent.toFixed(0)}%</span>
                          </div>
                          <Progress value={creditUsagePercent} className="h-2" />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        {isCredit ? "Pagar" : "Usar"}
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-2">
                        <Eye className="h-4 w-4" />
                        Detalles
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        {/* Tab: Deudas */}
        <TabsContent value="debts" className="space-y-6 mt-6">
          {/* Resumen de Deudas */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Card className="border-2 border-green-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Me Deben
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  ${totalReceivable.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {receivables.filter(d => d.status !== "paid").length} pendientes
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-500/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  Debo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  ${totalPayable.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {payables.filter(d => d.status !== "paid").length} pendientes
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Botón Dividir Gasto */}
          <Button className="w-full gap-2" size="lg">
            <Users className="h-5 w-5" />
            Dividir Gasto entre Amigos
          </Button>

          {/* Gastos Grupales */}
          {groupExpenses.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Gastos Divididos</h3>
              {groupExpenses.map((expense) => {
                const totalRecovered = expense.debts.reduce((sum, d) => sum + d.amountPaid, 0)
                const pendingCount = expense.debts.filter(d => d.status !== "paid").length

                return (
                  <Card key={expense.id} className="border-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            {expense.concept}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Total: ${expense.totalAmount} • Pagaste tú • {format(expense.date, "d 'de' MMM", { locale: es })}
                          </CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Bell className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Recuperado</span>
                          <span className="font-medium">
                            ${totalRecovered} / ${expense.totalAmount}
                          </span>
                        </div>
                        <Progress value={(totalRecovered / expense.totalAmount) * 100} className="h-2" />
                      </div>

                      {/* Lista de personas */}
                      <div className="space-y-2">
                        {expense.debts.map((debt) => (
                          <div 
                            key={debt.id}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`${getDebtStatusColor(debt.status)}`}>
                                {getDebtStatusIcon(debt.status)}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{debt.personName}</p>
                                {debt.status === "partial" && (
                                  <p className="text-xs text-muted-foreground">
                                    Pagó ${debt.amountPaid} de ${debt.amount}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className={`text-lg font-bold ${
                                debt.status === "paid" 
                                  ? "text-green-600 dark:text-green-400 line-through" 
                                  : "text-foreground"
                              }`}>
                                ${debt.amount}
                              </p>
                              {debt.status !== "paid" && (
                                <Button variant="outline" size="sm">
                                  Pagó
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {pendingCount > 0 && (
                        <Button variant="outline" className="w-full gap-2">
                          <Bell className="h-4 w-4" />
                          Recordar a {pendingCount} persona{pendingCount > 1 ? "s" : ""}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Deudas Individuales - Me Deben */}
          {receivables.filter(d => !d.groupId).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Me Deben (Individual)
              </h3>
              <div className="space-y-3">
                {receivables.filter(d => !d.groupId).map((debt) => (
                  <Card key={debt.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`${getDebtStatusColor(debt.status)}`}>
                            {getDebtStatusIcon(debt.status)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{debt.personName}</p>
                            <p className="text-sm text-muted-foreground">{debt.concept}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(debt.date, "d 'de' MMMM, yyyy", { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                              ${(debt.amount - debt.amountPaid).toLocaleString()}
                            </p>
                            {debt.status === "partial" && (
                              <p className="text-xs text-muted-foreground">
                                de ${debt.amount}
                              </p>
                            )}
                          </div>
                          {debt.status !== "paid" && (
                            <Button variant="outline" size="sm">
                              Pagó
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Deudas Individuales - Debo */}
          {payables.filter(d => !d.groupId).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-red-500" />
                Debo (Individual)
              </h3>
              <div className="space-y-3">
                {payables.filter(d => !d.groupId).map((debt) => (
                  <Card key={debt.id} className="border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`${getDebtStatusColor(debt.status)}`}>
                            {getDebtStatusIcon(debt.status)}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold">{debt.personName}</p>
                            <p className="text-sm text-muted-foreground">{debt.concept}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {format(debt.date, "d 'de' MMMM, yyyy", { locale: es })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                              ${(debt.amount - debt.amountPaid).toLocaleString()}
                            </p>
                            {debt.status === "partial" && (
                              <p className="text-xs text-muted-foreground">
                                de ${debt.amount}
                              </p>
                            )}
                          </div>
                          {debt.status !== "paid" && (
                            <Button size="sm">
                              Pagar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden"></div>
    </div>
  )
}
