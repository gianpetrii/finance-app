"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  FileText,
  Search,
  Filter,
  TrendingDown,
  TrendingUp,
  Calendar,
  Download,
  Plus,
  Edit,
  Trash2,
  ArrowUpDown
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Tipos
interface Transaction {
  id: string
  date: Date
  type: "expense" | "income"
  amount: number
  description: string
  category: string
  paymentMethod: string
}

// Datos de ejemplo
const currentMonth = new Date().getMonth()
const currentYear = new Date().getFullYear()

const initialTransactions: Transaction[] = [
  {
    id: "1",
    date: new Date(currentYear, currentMonth, 18),
    type: "income",
    amount: 3500,
    description: "Salario mensual",
    category: "Salario",
    paymentMethod: "Transferencia"
  },
  {
    id: "2",
    date: new Date(currentYear, currentMonth, 17),
    type: "expense",
    amount: 150,
    description: "Compras en supermercado",
    category: "Alimentación",
    paymentMethod: "Tarjeta de débito"
  },
  {
    id: "3",
    date: new Date(currentYear, currentMonth, 16),
    type: "expense",
    amount: 80,
    description: "Cena en restaurante",
    category: "Ocio",
    paymentMethod: "Tarjeta de crédito"
  },
  {
    id: "4",
    date: new Date(currentYear, currentMonth, 15),
    type: "expense",
    amount: 45,
    description: "Uber al trabajo",
    category: "Transporte",
    paymentMethod: "Efectivo"
  },
  {
    id: "5",
    date: new Date(currentYear, currentMonth, 14),
    type: "income",
    amount: 500,
    description: "Freelance proyecto web",
    category: "Freelance",
    paymentMethod: "Transferencia"
  },
  {
    id: "6",
    date: new Date(currentYear, currentMonth, 13),
    type: "expense",
    amount: 120,
    description: "Factura de luz",
    category: "Servicios",
    paymentMethod: "Transferencia"
  },
  {
    id: "7",
    date: new Date(currentYear, currentMonth, 12),
    type: "expense",
    amount: 60,
    description: "Suscripción Netflix",
    category: "Entretenimiento",
    paymentMethod: "Tarjeta de crédito"
  },
  {
    id: "8",
    date: new Date(currentYear, currentMonth, 10),
    type: "expense",
    amount: 200,
    description: "Compra de ropa",
    category: "Ropa",
    paymentMethod: "Tarjeta de débito"
  },
]

// Categorías
const categories = [
  "Todas",
  "Alimentación",
  "Transporte",
  "Ocio",
  "Servicios",
  "Salario",
  "Freelance",
  "Entretenimiento",
  "Ropa",
  "Salud",
  "Educación"
]

export default function TransactionsPage() {
  const [transactions] = useState<Transaction[]>(initialTransactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [filterCategory, setFilterCategory] = useState("Todas")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  // Filtrar y ordenar transacciones
  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           t.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || t.type === filterType
      const matchesCategory = filterCategory === "Todas" || t.category === filterCategory
      return matchesSearch && matchesType && matchesCategory
    })
    .sort((a, b) => {
      if (sortOrder === "desc") {
        return b.date.getTime() - a.date.getTime()
      }
      return a.date.getTime() - b.date.getTime()
    })

  // Calcular totales
  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  // Agrupar transacciones por fecha
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const dateKey = format(transaction.date, "yyyy-MM-dd")
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(transaction)
    return groups
  }, {} as Record<string, Transaction[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FileText className="h-7 w-7 text-primary" />
            Transacciones
          </h1>
          <p className="text-muted-foreground mt-1">
            Historial completo de tus movimientos
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nueva</span>
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              +${totalIncome.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredTransactions.filter(t => t.type === "income").length} transacciones
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-red-500" />
              Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              -${totalExpenses.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredTransactions.filter(t => t.type === "expense").length} transacciones
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              balance >= 0 
                ? "text-green-600 dark:text-green-400" 
                : "text-red-600 dark:text-red-400"
            }`}>
              {balance >= 0 ? "+" : ""}${balance.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              del período filtrado
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Búsqueda */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por descripción o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="income">Ingresos</SelectItem>
                  <SelectItem value="expense">Gastos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Categoría</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ordenar</label>
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                <span>{sortOrder === "desc" ? "Más reciente" : "Más antiguo"}</span>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("")
                setFilterType("all")
                setFilterCategory("Todas")
              }}
            >
              Limpiar Filtros
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transacciones */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Resultados ({filteredTransactions.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground mb-4">
                No se encontraron transacciones
              </p>
              <Button variant="outline" size="sm">
                Limpiar Filtros
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedTransactions).map(([dateKey, dayTransactions]) => (
                <div key={dateKey} className="space-y-3">
                  {/* Fecha */}
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(dateKey), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                  </div>

                  {/* Transacciones del día */}
                  <div className="space-y-2">
                    {dayTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          {/* Icono */}
                          <div className={`p-2 rounded-lg ${
                            transaction.type === "expense" 
                              ? "bg-red-500/10 text-red-600 dark:text-red-400" 
                              : "bg-green-500/10 text-green-600 dark:text-green-400"
                          }`}>
                            {transaction.type === "expense" ? (
                              <TrendingDown className="h-5 w-5" />
                            ) : (
                              <TrendingUp className="h-5 w-5" />
                            )}
                          </div>

                          {/* Información */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{transaction.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {transaction.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {transaction.paymentMethod}
                              </span>
                            </div>
                          </div>

                          {/* Monto */}
                          <div className="text-right">
                            <p className={`text-lg font-bold ${
                              transaction.type === "expense" 
                                ? "text-red-600 dark:text-red-400" 
                                : "text-green-600 dark:text-green-400"
                            }`}>
                              {transaction.type === "expense" ? "-" : "+"}${transaction.amount.toLocaleString()}
                            </p>
                          </div>

                          {/* Acciones */}
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mobile bottom padding */}
      <div className="h-16 lg:hidden"></div>
    </div>
  )
}
