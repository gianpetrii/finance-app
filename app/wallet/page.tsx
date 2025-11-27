"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { NewTransactionModal } from "@/components/NewTransactionModal"
import { NewAccountModal } from "@/components/NewAccountModal"
import { useAccounts } from "@/lib/hooks/useAccounts"
import { useCreditCards } from "@/lib/hooks/useCreditCards"
import { useDebts } from "@/lib/hooks/useDebts"
import { useAuth } from "@/lib/hooks/useAuth"
import { useTransactions } from "@/lib/hooks/useTransactions"
import { 
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  DollarSign,
  CreditCard,
  Building2,
  Users,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

const accountTypeLabels = {
  checking: "Cuenta Corriente",
  savings: "Ahorro",
  investment: "Inversión"
}

export default function WalletPage() {
  const { user } = useAuth()
  const { accounts, loading: loadingAccounts } = useAccounts()
  const { cards, loading: loadingCards } = useCreditCards()
  const { debts, loading: loadingDebts } = useDebts()
  const { transactions } = useTransactions()
  
  const [hideBalances, setHideBalances] = useState(false)
  const [activeTab, setActiveTab] = useState("accounts")
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)

  const loading = loadingAccounts || loadingCards || loadingDebts

  // Calcular totales de cuentas
  const totalAccountsBalance = useMemo(() => 
    accounts.reduce((sum, a) => sum + (a.balance || 0), 0),
    [accounts]
  )

  // Calcular totales de tarjetas
  const creditCards = useMemo(() => cards.filter(c => c.type === "credit"), [cards])
  const debitCards = useMemo(() => cards.filter(c => c.type === "debit"), [cards])
  
  const totalCreditUsed = useMemo(() => 
    creditCards.reduce((sum, c) => sum + (c.balance || 0), 0),
    [creditCards]
  )
  
  const totalCreditLimit = useMemo(() => 
    creditCards.reduce((sum, c) => sum + (c.limit || 0), 0),
    [creditCards]
  )
  
  const totalCreditAvailable = totalCreditLimit - totalCreditUsed
  const totalDebitBalance = useMemo(() => 
    debitCards.reduce((sum, c) => sum + (c.balance || 0), 0),
    [debitCards]
  )

  // Calcular deudas desde transacciones con split y debts collection
  const splitExpenseDebts = useMemo(() => {
    return transactions
      .filter(t => t.isSplitExpense && t.splitDetails?.people)
      .flatMap(t => 
        t.splitDetails.people
          .filter((p: any) => !p.paid)
          .map((p: any) => ({
            id: `${t.id}_${p.name}`,
            type: "receivable" as const,
            personName: p.name,
            amount: p.amount,
            amountPaid: 0,
            concept: t.category || "Gasto dividido",
            date: t.date?.toDate ? t.date.toDate() : new Date(t.date),
            status: "pending" as const,
            groupId: t.id
          }))
      )
  }, [transactions])

  const allDebts = useMemo(() => [...debts, ...splitExpenseDebts], [debts, splitExpenseDebts])
  
  const receivables = useMemo(() => 
    allDebts.filter(d => d.type === "receivable"),
    [allDebts]
  )
  
  const payables = useMemo(() => 
    allDebts.filter(d => d.type === "payable"),
    [allDebts]
  )
  
  const totalReceivable = useMemo(() => 
    receivables.reduce((sum, d) => sum + ((d.amount || 0) - (d.amountPaid || 0)), 0),
    [receivables]
  )
  
  const totalPayable = useMemo(() => 
    payables.reduce((sum, d) => sum + ((d.amount || 0) - (d.amountPaid || 0)), 0),
    [payables]
  )

  // Saldos
  const realBalance = totalAccountsBalance + totalDebitBalance
  const availableBalance = realBalance - totalCreditUsed - totalPayable
  const projectedBalance = availableBalance + totalReceivable

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Spinner size="lg" />
      </div>
    )
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
            <Button className="gap-2" onClick={() => setIsAccountModalOpen(true)}>
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
                          {accountTypeLabels[account.type as "checking" | "savings" | "investment"] || account.type}
                        </Badge>
                      </div>
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

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Banco: {account.bank}</p>
                    <p>Cuenta: {account.accountNumber}</p>
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
                      <Badge variant={isCredit ? "destructive" : "secondary"}>
                        {isCredit ? "Crédito" : "Débito"}
                      </Badge>
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
          <Button 
            className="w-full gap-2" 
            size="lg"
            onClick={() => setIsTransactionModalOpen(true)}
          >
            <Users className="h-5 w-5" />
            Dividir Gasto entre Amigos
          </Button>

          {/* Gastos Divididos desde Transacciones */}
          {transactions.filter(t => t.isSplitExpense).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Gastos Divididos</h3>
              {transactions
                .filter(t => t.isSplitExpense && t.splitDetails?.people)
                .map((transaction) => {
                  const people = transaction.splitDetails?.people || []
                  const totalRecovered = people.reduce((sum: number, p: any) => 
                    sum + (p.paid ? p.amount : 0), 0
                  )
                  const transDate = transaction.date?.toDate ? transaction.date.toDate() : new Date(transaction.date)

                  return (
                    <Card key={transaction.id} className="border-2">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" />
                            {transaction.category}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Total: ${transaction.amount} • Pagaste tú • {format(transDate, "d 'de' MMM", { locale: es })}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Progress bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Recuperado</span>
                          <span className="font-medium">
                            ${totalRecovered} / ${transaction.amount}
                          </span>
                        </div>
                        <Progress value={(totalRecovered / (transaction.amount || 1)) * 100} className="h-2" />
                      </div>

                      {/* Lista de personas */}
                      <div className="space-y-2">
                        {people.map((person: any, idx: number) => (
                          <div 
                            key={`${transaction.id}_${idx}`}
                            className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className={`${person.paid ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                                {person.paid ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium">{person.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <p className={`text-lg font-bold ${
                                person.paid 
                                  ? "text-green-600 dark:text-green-400 line-through" 
                                  : "text-foreground"
                              }`}>
                                ${person.amount}
                              </p>
                              {!person.paid && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={async () => {
                                    if (!user) return
                                    try {
                                      const { markSplitExpensePersonPaid } = await import("@/lib/firebase/collections")
                                      await markSplitExpensePersonPaid(user.uid, transaction.id, person.name)
                                      toast.success(`${person.name} marcado como pagado`)
                                    } catch (error) {
                                      console.error("Error:", error)
                                      toast.error("Error al marcar como pagado")
                                    }
                                  }}
                                >
                                  Pagó
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {transaction.notes && (
                        <p className="text-sm text-muted-foreground">
                          Nota: {transaction.notes}
                        </p>
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
      
      {/* Modal de Nueva Transacción (Gasto Dividido) */}
      <NewTransactionModal
        open={isTransactionModalOpen}
        onOpenChange={setIsTransactionModalOpen}
        defaultType="expense"
      />
      
      {/* Modal de Nueva Cuenta */}
      <NewAccountModal
        open={isAccountModalOpen}
        onOpenChange={setIsAccountModalOpen}
      />
    </div>
  )
}
