"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  Smartphone
} from "lucide-react"

// Tipos
interface Account {
  id: string
  name: string
  type: "checking" | "savings" | "credit" | "investment"
  balance: number
  currency: string
  bank: string
  accountNumber: string
  color: string
  icon: React.ElementType
}

// Datos de ejemplo
const initialAccounts: Account[] = [
  {
    id: "1",
    name: "Cuenta Corriente Principal",
    type: "checking",
    balance: 5420.50,
    currency: "USD",
    bank: "Banco Nacional",
    accountNumber: "****1234",
    color: "from-blue-500 to-cyan-500",
    icon: Wallet
  },
  {
    id: "2",
    name: "Cuenta de Ahorros",
    type: "savings",
    balance: 12350.00,
    currency: "USD",
    bank: "Banco Nacional",
    accountNumber: "****5678",
    color: "from-green-500 to-emerald-500",
    icon: DollarSign
  },
  {
    id: "3",
    name: "Tarjeta de Crédito Visa",
    type: "credit",
    balance: -2150.00,
    currency: "USD",
    bank: "Banco Internacional",
    accountNumber: "****9012",
    color: "from-purple-500 to-pink-500",
    icon: CreditCard
  },
  {
    id: "4",
    name: "Inversiones",
    type: "investment",
    balance: 25800.00,
    currency: "USD",
    bank: "Broker Online",
    accountNumber: "****3456",
    color: "from-orange-500 to-red-500",
    icon: TrendingUp
  }
]

// Tipos de cuenta con sus etiquetas
const accountTypeLabels = {
  checking: "Cuenta Corriente",
  savings: "Ahorro",
  credit: "Crédito",
  investment: "Inversión"
}

export default function AccountsPage() {
  const [accounts] = useState<Account[]>(initialAccounts)
  const [hideBalances, setHideBalances] = useState(false)

  // Calcular totales
  const totalAssets = accounts
    .filter(a => a.type !== "credit")
    .reduce((sum, a) => sum + a.balance, 0)

  const totalLiabilities = accounts
    .filter(a => a.type === "credit")
    .reduce((sum, a) => sum + Math.abs(a.balance), 0)

  const netWorth = totalAssets - totalLiabilities

  // Agrupar cuentas por tipo
  const groupedAccounts = accounts.reduce((groups, account) => {
    const type = account.type
    if (!groups[type]) {
      groups[type] = []
    }
    groups[type].push(account)
    return groups
  }, {} as Record<string, Account[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Wallet className="h-7 w-7 text-primary" />
            Mis Cuentas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona todas tus cuentas bancarias
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
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nueva Cuenta</span>
          </Button>
        </div>
      </div>

      {/* Resumen Financiero */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Activos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {hideBalances ? "••••••" : `$${totalAssets.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {accounts.filter(a => a.type !== "credit").length} cuentas
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Pasivos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {hideBalances ? "••••••" : `$${totalLiabilities.toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {accounts.filter(a => a.type === "credit").length} tarjetas de crédito
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
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
                <ArrowRightLeft className="h-4 w-4" />
                Transferir entre Cuentas
              </Button>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Fondos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Cuentas por Tipo */}
      <div className="space-y-6">
        {Object.entries(groupedAccounts).map(([type, typeAccounts]) => (
          <div key={type} className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">
                {accountTypeLabels[type as keyof typeof accountTypeLabels]}
              </h2>
              <Badge variant="secondary">
                {typeAccounts.length}
              </Badge>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {typeAccounts.map((account) => {
                const Icon = account.icon
                const isCredit = account.type === "credit"

                return (
                  <Card 
                    key={account.id}
                    className="overflow-hidden border-2 hover:shadow-lg transition-all"
                  >
                    {/* Header con gradiente */}
                    <div className={`h-2 bg-gradient-to-r ${account.color}`} />

                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${account.color}`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">
                              {account.name}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-2">
                              <Building2 className="h-3 w-3" />
                              {account.bank}
                            </CardDescription>
                            <p className="text-xs text-muted-foreground mt-1">
                              {account.accountNumber}
                            </p>
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
                      {/* Balance */}
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
                            {hideBalances ? "••••••" : (
                              <>
                                {isCredit && "-"}${Math.abs(account.balance).toLocaleString()}
                              </>
                            )}
                          </p>
                          <span className="text-sm text-muted-foreground">
                            {account.currency}
                          </span>
                        </div>
                      </div>

                      {/* Información adicional para tarjetas de crédito */}
                      {isCredit && (
                        <div className="pt-4 border-t space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Límite de Crédito</span>
                            <span className="font-medium">
                              {hideBalances ? "••••••" : "$5,000"}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Crédito Disponible</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {hideBalances ? "••••••" : "$2,850"}
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="flex justify-between text-xs mb-1">
                              <span>Uso del crédito</span>
                              <span>43%</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-yellow-500" style={{ width: "43%" }} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Botones de acción */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <ArrowRightLeft className="h-4 w-4" />
                          Transferir
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Eye className="h-4 w-4" />
                          Ver Detalles
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Consejos */}
      <Card className="border-2 border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-cyan-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-500/20 p-3">
              <Smartphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">💡 Consejo Financiero</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Mantén al menos 3-6 meses de gastos en tu cuenta de ahorros como fondo de emergencia. 
                Actualmente tienes ${(12350 / 3500).toFixed(1)} meses cubiertos. ¡Excelente trabajo!
              </p>
              <Button variant="outline" size="sm">
                Ver más consejos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden"></div>
    </div>
  )
}

