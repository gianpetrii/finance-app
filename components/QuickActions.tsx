"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";

type TransactionType = "expense" | "income";

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const expenseCategories = [
    "Alimentación",
    "Transporte",
    "Entretenimiento",
    "Salud",
    "Educación",
    "Servicios",
    "Compras",
    "Otros",
  ];

  const incomeCategories = [
    "Salario",
    "Freelance",
    "Inversiones",
    "Ventas",
    "Otros",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !category) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    // Aquí se guardaría en Firebase/Firestore
    toast.success(
      type === "expense" 
        ? `Gasto de $${amount} registrado` 
        : `Ingreso de $${amount} registrado`
    );

    // Reset form
    setAmount("");
    setDescription("");
    setCategory("");
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón Flotante */}
      <div className="fixed bottom-20 right-6 lg:bottom-8 lg:right-8 z-40">
        <Button
          size="lg"
          className="h-12 shadow-lg hover:shadow-xl transition-all rounded-lg
                     w-auto px-4 gap-2 whitespace-nowrap"
          onClick={() => setIsOpen(true)}
        >
          <Plus className="h-5 w-5 flex-shrink-0" />
          {/* Mobile: "+ Agregar" */}
          <span className="sm:hidden">
            Agregar
          </span>
          {/* Tablet: "+ Agregar" */}
          <span className="hidden sm:inline lg:hidden">
            Agregar
          </span>
          {/* Desktop: "+ Agregar Transacción" */}
          <span className="hidden lg:inline">
            Agregar Transacción
          </span>
        </Button>
      </div>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agregar Transacción</DialogTitle>
            <DialogDescription>
              Registra un gasto o ingreso rápidamente
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Tipo de Transacción */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === "expense" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setType("expense")}
              >
                <TrendingDown className="mr-2 h-4 w-4" />
                Gasto
              </Button>
              <Button
                type="button"
                variant={type === "income" ? "default" : "outline"}
                className="flex-1"
                onClick={() => setType("income")}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Ingreso
              </Button>
            </div>

            {/* Monto */}
            <div className="space-y-2">
              <Label htmlFor="amount">Monto</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-7"
                  required
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Categoría */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {(type === "expense" ? expenseCategories : incomeCategories).map((cat) => (
                    <SelectItem key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input
                id="description"
                placeholder="Ej: Almuerzo con cliente"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Botones */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="flex-1">
                Guardar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

