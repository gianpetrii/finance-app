"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { NewTransactionModal } from "@/components/NewTransactionModal";

export function QuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"expense" | "income">("expense");

  const handleOpenModal = (type: "expense" | "income") => {
    setTransactionType(type);
    setIsOpen(true);
  };

  return (
    <>
      {/* Botón Flotante */}
      <div className="fixed bottom-20 right-6 lg:bottom-8 lg:right-8 z-40">
        <Button
          size="lg"
          className="h-12 shadow-lg hover:shadow-xl transition-all rounded-lg
                     w-auto px-4 gap-2 whitespace-nowrap"
          onClick={() => handleOpenModal("expense")}
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

      {/* Modal de Nueva Transacción */}
      <NewTransactionModal
        open={isOpen}
        onOpenChange={setIsOpen}
        defaultType={transactionType}
        onSuccess={() => {
          console.log("Transacción guardada exitosamente")
        }}
      />
    </>
  );
}
