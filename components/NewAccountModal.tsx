"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useAuth } from "@/lib/hooks/useAuth"
import { createAccount } from "@/lib/firebase/collections"

interface NewAccountModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewAccountModal({ open, onOpenChange }: NewAccountModalProps) {
  const { user } = useAuth()
  const [name, setName] = useState("")
  const [type, setType] = useState<"checking" | "savings" | "investment">("checking")
  const [bank, setBank] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [balance, setBalance] = useState("")
  const [saving, setSaving] = useState(false)

  const resetForm = () => {
    setName("")
    setType("checking")
    setBank("")
    setAccountNumber("")
    setBalance("")
  }

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Debes iniciar sesión")
      return
    }

    if (!name.trim()) {
      toast.error("Ingresa un nombre para la cuenta")
      return
    }

    if (!bank.trim()) {
      toast.error("Ingresa el nombre del banco")
      return
    }

    if (!balance || parseFloat(balance) < 0) {
      toast.error("Ingresa un saldo válido")
      return
    }

    setSaving(true)

    try {
      await createAccount(user.uid, {
        name: name.trim(),
        type,
        bank: bank.trim(),
        accountNumber: accountNumber.trim() || `****${Math.floor(1000 + Math.random() * 9000)}`,
        balance: parseFloat(balance),
        color: getColorForType(type)
      })

      toast.success("Cuenta creada exitosamente")
      resetForm()
      onOpenChange(false)
    } catch (error) {
      console.error("Error al crear cuenta:", error)
      toast.error("Error al crear la cuenta")
    } finally {
      setSaving(false)
    }
  }

  const getColorForType = (accountType: string) => {
    switch (accountType) {
      case "checking":
        return "from-blue-500 to-cyan-500"
      case "savings":
        return "from-green-500 to-emerald-500"
      case "investment":
        return "from-orange-500 to-red-500"
      default:
        return "from-gray-500 to-slate-500"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Cuenta Bancaria</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Cuenta</Label>
            <Input
              id="name"
              placeholder="Ej: Cuenta Corriente Principal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Tipo */}
          <div className="space-y-2">
            <Label htmlFor="type">Tipo de Cuenta</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Cuenta Corriente</SelectItem>
                <SelectItem value="savings">Cuenta de Ahorro</SelectItem>
                <SelectItem value="investment">Inversión</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Banco */}
          <div className="space-y-2">
            <Label htmlFor="bank">Banco</Label>
            <Input
              id="bank"
              placeholder="Ej: Banco Nacional"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
            />
          </div>

          {/* Número de Cuenta (opcional) */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Número de Cuenta (opcional)</Label>
            <Input
              id="accountNumber"
              placeholder="****1234"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Si no lo ingresas, se generará uno automáticamente
            </p>
          </div>

          {/* Saldo Inicial */}
          <div className="space-y-2">
            <Label htmlFor="balance">Saldo Actual</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="balance"
                type="number"
                placeholder="0"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1"
              disabled={saving}
            >
              {saving ? "Creando..." : "Crear Cuenta"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

