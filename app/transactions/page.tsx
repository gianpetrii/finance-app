"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { NewTransactionModal } from "@/components/NewTransactionModal"
import { useTransactions } from "@/lib/hooks/useTransactions"
import { useAuth } from "@/lib/hooks/useAuth"
import { deleteTransaction } from "@/lib/firebase/collections"
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
  TrendingDown,
  TrendingUp,
  Plus,
  Trash2,
  Filter,
  ArrowUpDown,
  Download,
  Calendar
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { toast } from "sonner"

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
  const { user } = useAuth()
  const { transactions, loading } = useTransactions()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")
  const [filterCategory, setFilterCategory] = useState("Todas")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const handleDelete = async (transactionId: string) => {
    if (!user) return
    
    try {
      await deleteTransaction(user.uid, transactionId)
      toast.success("Transacción eliminada")
    } catch (error) {
      console.error("Error:", error)
      toast.error("Error al eliminar")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Spinner size="lg" />
      </div>
    )
  }

  // Filtrar y ordenar transacciones
  const filteredTransactions = transactions
    .filter(t => {
      const matchesSearch = (t.category?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
                           (t.notes?.toLowerCase() || "").includes(searchTerm.toLowerCase())
      const matchesType = filterType === "all" || t.type === filterType
      const matchesCategory = filterCategory === "Todas" || t.category === filterCategory
      return matchesSearch && matchesType && matchesCategory
    })
    .sort((a, b) => {
      const dateA = a.date?.toDate ? a.date.toDate() : new Date(a.date)
      const dateB = b.date?.toDate ? b.date.toDate() : new Date(b.date)
      
      if (sortOrder === "desc") {
        return dateB.getTime() - dateA.getTime()
      }
      return dateA.getTime() - dateB.getTime()
    })

  // Calcular totales
  const totalIncome = filteredTransactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const totalExpenses = filteredTransactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + (t.amount || 0), 0)

  const balance = totalIncome - totalExpenses

  // Agrupar transacciones por fecha
  const groupedTransactions: Record<string, any[]> = filteredTransactions.reduce((groups: Record<string, any[]>, transaction) => {
    const transDate = transaction.date?.toDate ? transaction.date.toDate() : new Date(transaction.date)
    const dateKey = format(transDate, "yyyy-MM-dd")
    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(transaction)
    return groups
  }, {})

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
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
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
                            <p className="font-medium truncate">{transaction.category}</p>
                            {transaction.notes && (
                              <p className="text-sm text-muted-foreground truncate">{transaction.notes}</p>
                            )}
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
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleDelete(transaction.id)}
                            >
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
      
      {/* Modal de Nueva Transacción */}
      <NewTransactionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        defaultType="expense"
      />
    </div>
  )
}
