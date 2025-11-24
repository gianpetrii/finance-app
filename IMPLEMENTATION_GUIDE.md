# 🛠️ Guía de Implementación - Migración a Firestore

Esta guía proporciona ejemplos prácticos para migrar la aplicación de datos mock a Firestore.

---

## 📦 Paso 1: Crear Funciones de Utilidad

### `lib/firebase/collections.ts`
```typescript
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  increment
} from 'firebase/firestore'
import { db } from './firebase'

// ==================== TRANSACCIONES ====================

export const transactionsCollection = (userId: string) => 
  collection(db, `users/${userId}/transactions`)

export const createTransaction = async (userId: string, transactionData: any) => {
  const transactionId = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  const docRef = doc(transactionsCollection(userId), transactionId)
  
  await setDoc(docRef, {
    ...transactionData,
    id: transactionId,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    deletedAt: null
  })
  
  return transactionId
}

export const getTransactions = async (
  userId: string, 
  filters?: {
    startDate?: Date
    endDate?: Date
    type?: 'expense' | 'income'
    category?: string
  }
) => {
  let q = query(
    transactionsCollection(userId),
    where('deletedAt', '==', null),
    orderBy('date', 'desc')
  )
  
  if (filters?.startDate) {
    q = query(q, where('date', '>=', Timestamp.fromDate(filters.startDate)))
  }
  
  if (filters?.endDate) {
    q = query(q, where('date', '<=', Timestamp.fromDate(filters.endDate)))
  }
  
  if (filters?.type) {
    q = query(q, where('type', '==', filters.type))
  }
  
  if (filters?.category) {
    q = query(q, where('category', '==', filters.category))
  }
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const updateTransaction = async (
  userId: string, 
  transactionId: string, 
  updates: any
) => {
  const docRef = doc(transactionsCollection(userId), transactionId)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  })
}

export const deleteTransaction = async (userId: string, transactionId: string) => {
  const docRef = doc(transactionsCollection(userId), transactionId)
  await updateDoc(docRef, {
    deletedAt: serverTimestamp()
  })
}

export const markSplitExpensePersonPaid = async (
  userId: string,
  transactionId: string,
  personId: string
) => {
  const docRef = doc(transactionsCollection(userId), transactionId)
  const transactionSnap = await getDoc(docRef)
  const transaction = transactionSnap.data()
  
  if (!transaction?.splitExpense) return
  
  const updatedPeople = transaction.splitExpense.people.map((person: any) => 
    person.id === personId 
      ? { ...person, paid: true, paidAt: serverTimestamp() }
      : person
  )
  
  const totalRecovered = updatedPeople
    .filter((p: any) => p.paid)
    .reduce((sum: number, p: any) => sum + p.amount, 0)
  
  await updateDoc(docRef, {
    'splitExpense.people': updatedPeople,
    'splitExpense.totalRecovered': totalRecovered,
    updatedAt: serverTimestamp()
  })
}

// ==================== CONFIGURACIÓN FINANCIERA ====================

export const financialSettingsCollection = (userId: string) =>
  collection(db, `users/${userId}/financialSettings`)

export const getCurrentFinancialSettings = async (userId: string) => {
  const q = query(
    financialSettingsCollection(userId),
    where('effectiveTo', '==', null),
    limit(1)
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs[0]?.data()
}

export const createFinancialSettings = async (userId: string, settings: any) => {
  // 1. Cerrar configuración actual
  const currentSettings = await getCurrentFinancialSettings(userId)
  if (currentSettings) {
    const currentDocRef = doc(financialSettingsCollection(userId), currentSettings.id)
    await updateDoc(currentDocRef, {
      effectiveTo: serverTimestamp()
    })
  }
  
  // 2. Crear nueva configuración
  const settingId = `setting_${Date.now()}`
  const docRef = doc(financialSettingsCollection(userId), settingId)
  
  // Calcular presupuesto diario
  const totalFixedExpenses = settings.fixedExpenses.reduce(
    (sum: number, exp: any) => sum + exp.amount, 
    0
  )
  const savingsValue = settings.savingsGoal.type === 'percentage'
    ? (settings.monthlyIncome * settings.savingsGoal.amount) / 100
    : settings.savingsGoal.amount
  
  const daysInMonth = new Date(
    new Date().getFullYear(), 
    new Date().getMonth() + 1, 
    0
  ).getDate()
  
  const dailyBudget = (settings.monthlyIncome - totalFixedExpenses - savingsValue) / daysInMonth
  
  await setDoc(docRef, {
    ...settings,
    id: settingId,
    userId,
    dailyBudget,
    savingsGoal: {
      ...settings.savingsGoal,
      value: savingsValue
    },
    effectiveFrom: serverTimestamp(),
    effectiveTo: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  
  return settingId
}

// ==================== METAS DE AHORRO ====================

export const savingsGoalsCollection = (userId: string) =>
  collection(db, `users/${userId}/savingsGoals`)

export const createSavingsGoal = async (userId: string, goalData: any) => {
  const goalId = `goal_${Date.now()}`
  const docRef = doc(savingsGoalsCollection(userId), goalId)
  
  await setDoc(docRef, {
    ...goalData,
    id: goalId,
    userId,
    currentAmount: 0,
    status: 'active',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  
  return goalId
}

export const getSavingsGoals = async (userId: string, status?: string) => {
  let q = query(
    savingsGoalsCollection(userId),
    orderBy('deadline', 'asc')
  )
  
  if (status) {
    q = query(q, where('status', '==', status))
  }
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const addGoalContribution = async (
  userId: string,
  goalId: string,
  amount: number,
  notes?: string
) => {
  // 1. Crear aporte
  const contribId = `contrib_${Date.now()}`
  const contribRef = doc(
    collection(db, `users/${userId}/savingsGoals/${goalId}/contributions`),
    contribId
  )
  
  await setDoc(contribRef, {
    id: contribId,
    goalId,
    userId,
    amount,
    notes,
    date: serverTimestamp(),
    createdAt: serverTimestamp()
  })
  
  // 2. Actualizar meta
  const goalRef = doc(savingsGoalsCollection(userId), goalId)
  await updateDoc(goalRef, {
    currentAmount: increment(amount),
    updatedAt: serverTimestamp()
  })
  
  // 3. Verificar si se completó
  const goalSnap = await getDoc(goalRef)
  const goal = goalSnap.data()
  
  if (goal && goal.currentAmount >= goal.targetAmount) {
    await updateDoc(goalRef, {
      status: 'completed',
      completedAt: serverTimestamp()
    })
  }
  
  return contribId
}

// ==================== CUENTAS ====================

export const accountsCollection = (userId: string) =>
  collection(db, `users/${userId}/accounts`)

export const createAccount = async (userId: string, accountData: any) => {
  const accountId = `acc_${Date.now()}`
  const docRef = doc(accountsCollection(userId), accountId)
  
  await setDoc(docRef, {
    ...accountData,
    id: accountId,
    userId,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  
  return accountId
}

export const getAccounts = async (userId: string) => {
  const q = query(
    accountsCollection(userId),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const updateAccountBalance = async (
  userId: string,
  accountId: string,
  amount: number
) => {
  const docRef = doc(accountsCollection(userId), accountId)
  await updateDoc(docRef, {
    balance: increment(amount),
    updatedAt: serverTimestamp()
  })
}

// ==================== TARJETAS DE CRÉDITO ====================

export const creditCardsCollection = (userId: string) =>
  collection(db, `users/${userId}/creditCards`)

export const createCreditCard = async (userId: string, cardData: any) => {
  const cardId = `card_${Date.now()}`
  const docRef = doc(creditCardsCollection(userId), cardId)
  
  const availableCredit = cardData.creditLimit - cardData.currentBalance
  
  await setDoc(docRef, {
    ...cardData,
    id: cardId,
    userId,
    availableCredit,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  
  return cardId
}

export const getCreditCards = async (userId: string) => {
  const q = query(
    creditCardsCollection(userId),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

// ==================== DEUDAS ====================

export const debtsCollection = (userId: string) =>
  collection(db, `users/${userId}/debts`)

export const createDebt = async (userId: string, debtData: any) => {
  const debtId = `debt_${Date.now()}`
  const docRef = doc(debtsCollection(userId), debtId)
  
  await setDoc(docRef, {
    ...debtData,
    id: debtId,
    userId,
    status: 'pending',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  
  return debtId
}

export const getDebts = async (
  userId: string,
  type?: 'owed_to_me' | 'i_owe',
  status?: 'pending' | 'paid'
) => {
  let q = query(
    debtsCollection(userId),
    orderBy('date', 'desc')
  )
  
  if (type) {
    q = query(q, where('type', '==', type))
  }
  
  if (status) {
    q = query(q, where('status', '==', status))
  }
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const markDebtAsPaid = async (userId: string, debtId: string) => {
  const docRef = doc(debtsCollection(userId), debtId)
  await updateDoc(docRef, {
    status: 'paid',
    paidAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

// ==================== NOTIFICACIONES ====================

export const notificationsCollection = (userId: string) =>
  collection(db, `users/${userId}/notifications`)

export const createNotification = async (userId: string, notificationData: any) => {
  const notifId = `notif_${Date.now()}`
  const docRef = doc(notificationsCollection(userId), notifId)
  
  await setDoc(docRef, {
    ...notificationData,
    id: notifId,
    userId,
    read: false,
    createdAt: serverTimestamp()
  })
  
  return notifId
}

export const getUnreadNotifications = async (userId: string) => {
  const q = query(
    notificationsCollection(userId),
    where('read', '==', false),
    orderBy('createdAt', 'desc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const markNotificationAsRead = async (userId: string, notifId: string) => {
  const docRef = doc(notificationsCollection(userId), notifId)
  await updateDoc(docRef, {
    read: true,
    readAt: serverTimestamp()
  })
}

// ==================== SERVICIOS ====================

export const servicesCollection = (userId: string) =>
  collection(db, `users/${userId}/services`)

export const createService = async (userId: string, serviceData: any) => {
  const serviceId = `service_${Date.now()}`
  const docRef = doc(servicesCollection(userId), serviceId)
  
  await setDoc(docRef, {
    ...serviceData,
    id: serviceId,
    userId,
    isActive: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  
  return serviceId
}

export const getActiveServices = async (userId: string) => {
  const q = query(
    servicesCollection(userId),
    where('isActive', '==', true),
    orderBy('dueDay', 'asc')
  )
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}
```

---

## 🎣 Paso 2: Crear Custom Hooks

### `lib/hooks/useTransactions.ts`
```typescript
"use client"

import { useState, useEffect } from 'react'
import { onSnapshot, query, where, orderBy, Timestamp } from 'firebase/firestore'
import { useAuth } from './useAuth'
import { transactionsCollection } from '../firebase/collections'

export function useTransactions(filters?: {
  startDate?: Date
  endDate?: Date
  type?: 'expense' | 'income'
}) {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setTransactions([])
      setLoading(false)
      return
    }

    let q = query(
      transactionsCollection(user.uid),
      where('deletedAt', '==', null),
      orderBy('date', 'desc')
    )

    if (filters?.startDate) {
      q = query(q, where('date', '>=', Timestamp.fromDate(filters.startDate)))
    }

    if (filters?.endDate) {
      q = query(q, where('date', '<=', Timestamp.fromDate(filters.endDate)))
    }

    if (filters?.type) {
      q = query(q, where('type', '==', filters.type))
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setTransactions(data)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching transactions:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user, filters?.startDate, filters?.endDate, filters?.type])

  return { transactions, loading, error }
}
```

### `lib/hooks/useFinancialSettings.ts`
```typescript
"use client"

import { useState, useEffect } from 'react'
import { onSnapshot, query, where, limit } from 'firebase/firestore'
import { useAuth } from './useAuth'
import { financialSettingsCollection } from '../firebase/collections'

export function useFinancialSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setSettings(null)
      setLoading(false)
      return
    }

    const q = query(
      financialSettingsCollection(user.uid),
      where('effectiveTo', '==', null),
      limit(1)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs[0]?.data()
        setSettings(data || null)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching financial settings:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  return { settings, loading, error }
}
```

### `lib/hooks/useSavingsGoals.ts`
```typescript
"use client"

import { useState, useEffect } from 'react'
import { onSnapshot, query, where, orderBy } from 'firebase/firestore'
import { useAuth } from './useAuth'
import { savingsGoalsCollection } from '../firebase/collections'

export function useSavingsGoals(status?: 'active' | 'completed' | 'cancelled') {
  const { user } = useAuth()
  const [goals, setGoals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setGoals([])
      setLoading(false)
      return
    }

    let q = query(
      savingsGoalsCollection(user.uid),
      orderBy('deadline', 'asc')
    )

    if (status) {
      q = query(q, where('status', '==', status))
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setGoals(data)
        setLoading(false)
      },
      (err) => {
        console.error('Error fetching savings goals:', err)
        setError(err.message)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user, status])

  return { goals, loading, error }
}
```

---

## 🔄 Paso 3: Actualizar Componentes

### Ejemplo: `app/dashboard/page.tsx`
```typescript
"use client"

import { useTransactions } from "@/lib/hooks/useTransactions"
import { useFinancialSettings } from "@/lib/hooks/useFinancialSettings"
import { useSavingsGoals } from "@/lib/hooks/useSavingsGoals"
import { Spinner } from "@/components/ui/spinner"
import { startOfMonth, endOfMonth } from "date-fns"

export default function DashboardPage() {
  const currentMonth = new Date()
  const { transactions, loading: transactionsLoading } = useTransactions({
    startDate: startOfMonth(currentMonth),
    endDate: endOfMonth(currentMonth)
  })
  
  const { settings, loading: settingsLoading } = useFinancialSettings()
  const { goals, loading: goalsLoading } = useSavingsGoals('active')

  if (transactionsLoading || settingsLoading || goalsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  // Calcular KPIs
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses
  const dailyBudget = settings?.dailyBudget || 0

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Balance del Mes"
          value={`$${balance.toLocaleString()}`}
          icon={DollarSign}
          trend={balance >= 0 ? "up" : "down"}
        />
        {/* ... más KPIs */}
      </div>

      {/* Resto del dashboard */}
    </div>
  )
}
```

### Ejemplo: `components/NewTransactionModal.tsx`
```typescript
"use client"

import { createTransaction } from "@/lib/firebase/collections"
import { useAuth } from "@/lib/hooks/useAuth"

export function NewTransactionModal({ ... }) {
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast.error("Debes iniciar sesión")
      return
    }

    setLoading(true)

    try {
      const transactionData = {
        type,
        amount: parseFloat(amount),
        category,
        paymentMethod,
        date: Timestamp.fromDate(date),
        notes: notes.trim(),
        isSplitExpense,
        splitExpense: isSplitExpense ? {
          splitType,
          people: splitPeople.map((p, index) => ({
            id: `p${index + 1}`,
            name: p.name.trim() || `Persona ${index + 1}`,
            amount: splitType === 'equal' 
              ? amountPerPerson 
              : parseFloat(p.amount) || 0,
            paid: false
          })),
          totalToRecover: totalAmount,
          totalRecovered: 0
        } : null
      }

      await createTransaction(user.uid, transactionData)

      toast.success("Transacción guardada exitosamente")
      resetForm()
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error('Error:', error)
      toast.error("Error al guardar la transacción")
    } finally {
      setLoading(false)
    }
  }

  // ... resto del componente
}
```

---

## 🚀 Paso 4: Plan de Migración

### **Fase 1: Configuración (Día 1)**
- [ ] Configurar índices en Firebase Console
- [ ] Implementar reglas de seguridad
- [ ] Crear funciones de utilidad (`collections.ts`)
- [ ] Probar conexión con Firestore

### **Fase 2: Datos Básicos (Día 2-3)**
- [ ] Migrar transacciones
- [ ] Migrar configuración financiera
- [ ] Actualizar `NewTransactionModal`
- [ ] Actualizar `Dashboard`

### **Fase 3: Funcionalidades Avanzadas (Día 4-5)**
- [ ] Migrar metas de ahorro
- [ ] Migrar cuentas y tarjetas
- [ ] Migrar deudas
- [ ] Actualizar páginas correspondientes

### **Fase 4: Tiempo Real (Día 6)**
- [ ] Implementar listeners en tiempo real
- [ ] Optimizar queries
- [ ] Implementar paginación

### **Fase 5: Testing y Deploy (Día 7)**
- [ ] Testing exhaustivo
- [ ] Optimización de performance
- [ ] Deploy a producción
- [ ] Monitoreo

---

## ✅ Checklist de Verificación

- [ ] Todas las páginas usan datos de Firestore
- [ ] No quedan datos mock en el código
- [ ] Listeners en tiempo real funcionan correctamente
- [ ] Reglas de seguridad implementadas
- [ ] Índices creados en Firebase Console
- [ ] Performance optimizada (< 3s carga inicial)
- [ ] Manejo de errores implementado
- [ ] Loading states en todas las páginas
- [ ] Soft delete implementado
- [ ] Backup configurado

---

## 📊 Monitoreo Post-Deploy

### Métricas a Monitorear:
- **Lecturas/Escrituras por día**: < 50,000 (Free tier)
- **Tiempo de respuesta**: < 500ms promedio
- **Errores**: < 1% de requests
- **Caché hit rate**: > 80%

### Herramientas:
- Firebase Console → Firestore → Usage
- Firebase Console → Performance Monitoring
- Vercel Analytics

---

## 🆘 Troubleshooting Común

### **Error: "Missing or insufficient permissions"**
```typescript
// Verificar que el usuario esté autenticado
if (!user) {
  toast.error("Debes iniciar sesión")
  return
}

// Verificar reglas de seguridad en Firebase Console
```

### **Error: "The query requires an index"**
```typescript
// Crear índice en Firebase Console
// O usar el link que proporciona el error
```

### **Datos no se actualizan en tiempo real**
```typescript
// Verificar que estés usando onSnapshot, no getDocs
const unsubscribe = onSnapshot(query, (snapshot) => {
  // ...
})

// No olvides limpiar el listener
return () => unsubscribe()
```

---

## 📚 Recursos Adicionales

- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Pricing Calculator](https://firebase.google.com/pricing)

