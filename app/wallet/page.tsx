"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Building2
} from "lucide-react"

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
  color: string
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

const accountTypeLabels = {
  checking: "Cuenta Corriente",
  savings: "Ahorro",
  investment: "Inversión"
}

export default function WalletPage() {
  const [accounts] = useState<BankAccount[]>(initialAccounts)
  const [cards] = useState<CreditCard[]>(initialCards)
  const [hideBalances, setHideBalances] = useState(false)

  // Calcular totales de cuentas
  const totalAccountsBalance = accounts.reduce((sum, a) => sum + a.balance, 0)

  // Calcular totales de tarjetas
  const creditCards = cards.filter(c => c.type === "credit")
  const debitCards = cards.filter(c => c.type === "debit")
  const totalCreditUsed = creditCards.reduce((sum, c) => sum + c.balance, 0)
  const totalCreditLimit = creditCards.reduce((sum, c) => sum + (c.limit || 0), 0)
  const totalCreditAvailable = totalCreditLimit - totalCreditUsed
  const totalDebitBalance = debitCards.reduce((sum, c) => sum + c.balance, 0)

  // Patrimonio neto
  const netWorth = totalAccountsBalance + totalDebitBalance - totalCreditUsed

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
            Gestiona todas tus cuentas y tarjetas
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

      {/* Resumen Financiero */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              Cuentas Bancarias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {hideBalances ? "••••••" : `$${totalAccountsBalance.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {accounts.length} cuentas
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Crédito Usado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {hideBalances ? "••••••" : `$${totalCreditUsed.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              de ${totalCreditLimit.toLocaleString()} límite
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              Crédito Disponible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {hideBalances ? "••••••" : `$${totalCreditAvailable.toLocaleString()}`}
            </div>
            <Progress value={(totalCreditUsed / totalCreditLimit) * 100} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4 text-primary" />
              Patrimonio Neto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {hideBalances ? "••••••" : `$${netWorth.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              activos - pasivos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card className="border-2 border-dashed border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h3 className="text-lg font-semibold">Acciones Rápidas</h3>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Cuenta
              </Button>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Tarjeta
              </Button>
              <Button variant="outline" className="gap-2">
                <ArrowRightLeft className="h-4 w-4" />
                Transferir
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cuentas Bancarias */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Cuentas Bancarias</h2>
          <Badge variant="secondary">{accounts.length}</Badge>
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
      </div>

      {/* Tarjetas */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">Tarjetas</h2>
          <Badge variant="secondary">{cards.length}</Badge>
        </div>

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
                        <span className="text-muted-foreground">Límite de Crédito</span>
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
      </div>

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden"></div>
    </div>
  )
}

