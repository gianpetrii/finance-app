# 🗄️ Estructura de Datos - Firestore

Este documento detalla la estructura completa de datos que debe persistirse en Firebase Firestore para la aplicación Finance App.

---

## 📊 Colecciones Principales

### 1. **`users`** - Datos de Usuario
**Ruta:** `/users/{userId}`

```typescript
interface User {
  uid: string                    // ID de Firebase Auth
  email: string
  displayName: string
  photoURL?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  
  // Configuración
  preferences: {
    currency: string             // "USD", "EUR", etc.
    language: string             // "es", "en"
    theme: "light" | "dark" | "system"
    notifications: {
      email: boolean
      push: boolean
      reminders: boolean
    }
  }
}
```

**Ejemplo:**
```json
{
  "uid": "abc123",
  "email": "usuario@example.com",
  "displayName": "Juan Pérez",
  "photoURL": "https://...",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-11-24T15:45:00Z",
  "preferences": {
    "currency": "USD",
    "language": "es",
    "theme": "system",
    "notifications": {
      "email": true,
      "push": true,
      "reminders": true
    }
  }
}
```

---

### 2. **`financialSettings`** - Configuración Financiera
**Ruta:** `/users/{userId}/financialSettings/{settingId}`

```typescript
interface FinancialSetting {
  id: string
  userId: string
  
  // Ingreso Mensual
  monthlyIncome: number
  
  // Gastos Fijos Mensuales
  fixedExpenses: Array<{
    id: string
    name: string
    amount: number
    category: string
    dueDay?: number              // Día del mes (1-31)
  }>
  
  // Meta de Ahorro
  savingsGoal: {
    type: "fixed" | "percentage"
    amount: number               // Monto fijo o porcentaje
    value: number                // Valor calculado final
  }
  
  // Presupuesto Diario Calculado
  dailyBudget: number
  
  // Fechas
  effectiveFrom: Timestamp       // Desde cuándo aplica
  effectiveTo?: Timestamp        // Hasta cuándo (null = actual)
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Ejemplo:**
```json
{
  "id": "setting_2024_11",
  "userId": "abc123",
  "monthlyIncome": 3500,
  "fixedExpenses": [
    {
      "id": "exp1",
      "name": "Alquiler",
      "amount": 800,
      "category": "Vivienda",
      "dueDay": 5
    },
    {
      "id": "exp2",
      "name": "Internet",
      "amount": 50,
      "category": "Servicios",
      "dueDay": 10
    }
  ],
  "savingsGoal": {
    "type": "percentage",
    "amount": 15,
    "value": 525
  },
  "dailyBudget": 72.5,
  "effectiveFrom": "2024-11-01T00:00:00Z",
  "effectiveTo": null,
  "createdAt": "2024-11-01T10:00:00Z",
  "updatedAt": "2024-11-15T14:30:00Z"
}
```

**Estrategia de Versionado:**
- Cada cambio crea un nuevo documento con `effectiveFrom`
- El documento anterior se marca con `effectiveTo`
- Query: `where('effectiveTo', '==', null)` para obtener la configuración actual

---

### 3. **`transactions`** - Transacciones
**Ruta:** `/users/{userId}/transactions/{transactionId}`

```typescript
interface Transaction {
  id: string
  userId: string
  
  // Datos básicos
  type: "expense" | "income"
  amount: number
  category: string
  paymentMethod: string
  date: Timestamp
  notes?: string
  
  // Gasto Dividido (solo si aplica)
  isSplitExpense: boolean
  splitExpense?: {
    splitType: "equal" | "custom"
    people: Array<{
      id: string
      name: string
      amount: number
      paid: boolean
      paidAt?: Timestamp
    }>
    totalToRecover: number
    totalRecovered: number       // Calculado
  }
  
  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
  deletedAt?: Timestamp          // Soft delete
}
```

**Ejemplo - Gasto Normal:**
```json
{
  "id": "trans_001",
  "userId": "abc123",
  "type": "expense",
  "amount": 45.50,
  "category": "Alimentación",
  "paymentMethod": "Tarjeta de débito",
  "date": "2024-11-24T12:30:00Z",
  "notes": "Almuerzo con el equipo",
  "isSplitExpense": false,
  "createdAt": "2024-11-24T12:35:00Z",
  "updatedAt": "2024-11-24T12:35:00Z"
}
```

**Ejemplo - Gasto Dividido:**
```json
{
  "id": "trans_002",
  "userId": "abc123",
  "type": "expense",
  "amount": 120,
  "category": "Alimentación",
  "paymentMethod": "Efectivo",
  "date": "2024-11-23T20:00:00Z",
  "notes": "Cena de cumpleaños",
  "isSplitExpense": true,
  "splitExpense": {
    "splitType": "equal",
    "people": [
      {
        "id": "p1",
        "name": "María",
        "amount": 30,
        "paid": true,
        "paidAt": "2024-11-24T10:00:00Z"
      },
      {
        "id": "p2",
        "name": "Carlos",
        "amount": 30,
        "paid": false
      },
      {
        "id": "p3",
        "name": "Ana",
        "amount": 30,
        "paid": false
      }
    ],
    "totalToRecover": 90,
    "totalRecovered": 30
  },
  "createdAt": "2024-11-23T20:05:00Z",
  "updatedAt": "2024-11-24T10:00:00Z"
}
```

**Índices Recomendados:**
- `userId` + `date` (desc)
- `userId` + `type` + `date` (desc)
- `userId` + `category` + `date` (desc)
- `userId` + `isSplitExpense` + `date` (desc)

---

### 4. **`savingsGoals`** - Metas de Ahorro
**Ruta:** `/users/{userId}/savingsGoals/{goalId}`

```typescript
interface SavingsGoal {
  id: string
  userId: string
  
  // Datos básicos
  name: string
  description: string
  category: "vacation" | "emergency" | "purchase" | "education" | "other"
  
  // Montos
  targetAmount: number
  currentAmount: number
  
  // Fechas
  deadline: Timestamp
  startDate: Timestamp
  
  // Estado
  status: "active" | "completed" | "cancelled"
  completedAt?: Timestamp
  
  // Metadata
  color: string                  // Para UI
  icon?: string                  // Emoji o nombre de ícono
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Ejemplo:**
```json
{
  "id": "goal_001",
  "userId": "abc123",
  "name": "Vacaciones en Europa",
  "description": "Viaje de 15 días por España e Italia",
  "category": "vacation",
  "targetAmount": 5000,
  "currentAmount": 3200,
  "deadline": "2025-07-01T00:00:00Z",
  "startDate": "2024-01-01T00:00:00Z",
  "status": "active",
  "color": "from-blue-500 to-cyan-500",
  "icon": "✈️",
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-11-24T15:00:00Z"
}
```

**Índices Recomendados:**
- `userId` + `status` + `deadline` (asc)

---

### 5. **`goalContributions`** - Aportes a Metas
**Ruta:** `/users/{userId}/savingsGoals/{goalId}/contributions/{contributionId}`

```typescript
interface GoalContribution {
  id: string
  goalId: string
  userId: string
  
  amount: number
  date: Timestamp
  notes?: string
  
  // Relación con transacción (opcional)
  transactionId?: string
  
  createdAt: Timestamp
}
```

**Ejemplo:**
```json
{
  "id": "contrib_001",
  "goalId": "goal_001",
  "userId": "abc123",
  "amount": 200,
  "date": "2024-11-24T10:00:00Z",
  "notes": "Aporte mensual de noviembre",
  "createdAt": "2024-11-24T10:00:00Z"
}
```

---

### 6. **`accounts`** - Cuentas Bancarias
**Ruta:** `/users/{userId}/accounts/{accountId}`

```typescript
interface Account {
  id: string
  userId: string
  
  // Datos básicos
  name: string
  type: "checking" | "savings" | "investment"
  bank: string
  accountNumber: string          // Últimos 4 dígitos o enmascarado
  
  // Balance
  balance: number
  currency: string
  
  // UI
  color: string
  icon: string
  
  // Estado
  isActive: boolean
  
  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Ejemplo:**
```json
{
  "id": "acc_001",
  "userId": "abc123",
  "name": "Cuenta Corriente Principal",
  "type": "checking",
  "bank": "Banco Nacional",
  "accountNumber": "****1234",
  "balance": 5420.50,
  "currency": "USD",
  "color": "from-blue-500 to-cyan-500",
  "icon": "wallet",
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-11-24T15:00:00Z"
}
```

---

### 7. **`creditCards`** - Tarjetas de Crédito
**Ruta:** `/users/{userId}/creditCards/{cardId}`

```typescript
interface CreditCard {
  id: string
  userId: string
  
  // Datos básicos
  name: string
  bank: string
  cardNumber: string             // Últimos 4 dígitos
  
  // Crédito
  creditLimit: number
  currentBalance: number         // Deuda actual (positivo)
  availableCredit: number        // Calculado
  
  // Fechas
  closingDay: number             // Día del mes (1-31)
  dueDay: number                 // Día del mes (1-31)
  
  // UI
  color: string
  icon: string
  
  // Estado
  isActive: boolean
  
  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Ejemplo:**
```json
{
  "id": "card_001",
  "userId": "abc123",
  "name": "Visa Platinum",
  "bank": "Banco Internacional",
  "cardNumber": "****9012",
  "creditLimit": 5000,
  "currentBalance": 2150,
  "availableCredit": 2850,
  "closingDay": 20,
  "dueDay": 25,
  "color": "from-purple-500 to-pink-500",
  "icon": "credit-card",
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-11-24T15:00:00Z"
}
```

---

### 8. **`debts`** - Deudas Individuales
**Ruta:** `/users/{userId}/debts/{debtId}`

```typescript
interface Debt {
  id: string
  userId: string
  
  // Tipo de deuda
  type: "owed_to_me" | "i_owe"   // Me deben / Yo debo
  
  // Datos básicos
  person: string
  amount: number
  concept: string
  date: Timestamp
  
  // Estado
  status: "pending" | "paid"
  paidAt?: Timestamp
  
  // Relación con transacción (opcional)
  transactionId?: string
  
  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Ejemplo:**
```json
{
  "id": "debt_001",
  "userId": "abc123",
  "type": "owed_to_me",
  "person": "Carlos",
  "amount": 50,
  "concept": "Préstamo para almuerzo",
  "date": "2024-11-20T12:00:00Z",
  "status": "pending",
  "createdAt": "2024-11-20T12:05:00Z",
  "updatedAt": "2024-11-20T12:05:00Z"
}
```

**Índices Recomendados:**
- `userId` + `type` + `status`
- `userId` + `status` + `date` (desc)

---

### 9. **`notifications`** - Notificaciones
**Ruta:** `/users/{userId}/notifications/{notificationId}`

```typescript
interface Notification {
  id: string
  userId: string
  
  // Tipo
  type: "debt_reminder" | "bill_due" | "budget_alert" | "goal_milestone" | "custom"
  
  // Contenido
  title: string
  message: string
  
  // Datos relacionados
  relatedId?: string             // ID de transacción, meta, deuda, etc.
  relatedType?: string           // "transaction", "goal", "debt", etc.
  
  // Estado
  read: boolean
  readAt?: Timestamp
  
  // Programación
  scheduledFor?: Timestamp       // Para notificaciones futuras
  sentAt?: Timestamp
  
  // Metadata
  createdAt: Timestamp
}
```

**Ejemplo:**
```json
{
  "id": "notif_001",
  "userId": "abc123",
  "type": "debt_reminder",
  "title": "Recordatorio de deuda",
  "message": "Carlos te debe $50 desde hace 4 días",
  "relatedId": "debt_001",
  "relatedType": "debt",
  "read": false,
  "scheduledFor": "2024-11-24T09:00:00Z",
  "sentAt": "2024-11-24T09:00:05Z",
  "createdAt": "2024-11-20T12:05:00Z"
}
```

**Índices Recomendados:**
- `userId` + `read` + `createdAt` (desc)
- `userId` + `scheduledFor` (asc)

---

### 10. **`services`** - Servicios Recurrentes
**Ruta:** `/users/{userId}/services/{serviceId}`

```typescript
interface Service {
  id: string
  userId: string
  
  // Datos básicos
  name: string
  provider: string
  category: string               // "utilities", "subscriptions", "insurance", etc.
  
  // Pago
  amount: number
  dueDay: number                 // Día del mes (1-31)
  
  // Recordatorios
  reminderDaysBefore: number     // Días antes para recordar
  
  // Estado
  isActive: boolean
  
  // Metadata
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

**Ejemplo:**
```json
{
  "id": "service_001",
  "userId": "abc123",
  "name": "Netflix",
  "provider": "Netflix Inc.",
  "category": "subscriptions",
  "amount": 15.99,
  "dueDay": 15,
  "reminderDaysBefore": 3,
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-11-24T15:00:00Z"
}
```

---

## 🔄 Estrategias de Persistencia

### **1. Transacciones en Tiempo Real**
```typescript
// Crear transacción
const createTransaction = async (transactionData: Transaction) => {
  const docRef = doc(db, `users/${userId}/transactions`, transactionId)
  await setDoc(docRef, {
    ...transactionData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

// Actualizar gasto dividido (marcar como pagado)
const markSplitExpensePaid = async (transactionId: string, personId: string) => {
  const docRef = doc(db, `users/${userId}/transactions`, transactionId)
  await updateDoc(docRef, {
    [`splitExpense.people.${personIndex}.paid`]: true,
    [`splitExpense.people.${personIndex}.paidAt`]: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
  
  // Recalcular totalRecovered
  // ...
}
```

### **2. Configuración Financiera Versionada**
```typescript
// Crear nueva configuración
const updateFinancialSettings = async (newSettings: FinancialSetting) => {
  // 1. Cerrar configuración actual
  const currentQuery = query(
    collection(db, `users/${userId}/financialSettings`),
    where('effectiveTo', '==', null)
  )
  const currentDocs = await getDocs(currentQuery)
  
  for (const doc of currentDocs.docs) {
    await updateDoc(doc.ref, {
      effectiveTo: serverTimestamp()
    })
  }
  
  // 2. Crear nueva configuración
  const newDocRef = doc(collection(db, `users/${userId}/financialSettings`))
  await setDoc(newDocRef, {
    ...newSettings,
    effectiveFrom: serverTimestamp(),
    effectiveTo: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  })
}

// Obtener configuración actual
const getCurrentSettings = async () => {
  const q = query(
    collection(db, `users/${userId}/financialSettings`),
    where('effectiveTo', '==', null),
    limit(1)
  )
  const snapshot = await getDocs(q)
  return snapshot.docs[0]?.data()
}
```

### **3. Metas de Ahorro con Aportes**
```typescript
// Agregar aporte a meta
const addGoalContribution = async (goalId: string, amount: number) => {
  // 1. Crear documento de aporte
  const contribRef = doc(
    collection(db, `users/${userId}/savingsGoals/${goalId}/contributions`)
  )
  await setDoc(contribRef, {
    goalId,
    userId,
    amount,
    date: serverTimestamp(),
    createdAt: serverTimestamp()
  })
  
  // 2. Actualizar currentAmount de la meta
  const goalRef = doc(db, `users/${userId}/savingsGoals`, goalId)
  await updateDoc(goalRef, {
    currentAmount: increment(amount),
    updatedAt: serverTimestamp()
  })
  
  // 3. Verificar si se completó la meta
  const goalSnap = await getDoc(goalRef)
  const goal = goalSnap.data()
  if (goal.currentAmount >= goal.targetAmount) {
    await updateDoc(goalRef, {
      status: 'completed',
      completedAt: serverTimestamp()
    })
  }
}
```

### **4. Queries Optimizadas**
```typescript
// Obtener transacciones del mes actual
const getMonthTransactions = async (year: number, month: number) => {
  const startDate = new Date(year, month, 1)
  const endDate = new Date(year, month + 1, 0, 23, 59, 59)
  
  const q = query(
    collection(db, `users/${userId}/transactions`),
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate)),
    where('deletedAt', '==', null),
    orderBy('date', 'desc')
  )
  
  return await getDocs(q)
}

// Obtener gastos divididos pendientes
const getPendingSplitExpenses = async () => {
  const q = query(
    collection(db, `users/${userId}/transactions`),
    where('isSplitExpense', '==', true),
    where('splitExpense.totalRecovered', '<', 'splitExpense.totalToRecover'),
    orderBy('date', 'desc')
  )
  
  return await getDocs(q)
}
```

### **5. Listeners en Tiempo Real**
```typescript
// Escuchar cambios en transacciones
const subscribeToTransactions = (callback: (transactions: Transaction[]) => void) => {
  const q = query(
    collection(db, `users/${userId}/transactions`),
    where('deletedAt', '==', null),
    orderBy('date', 'desc'),
    limit(50)
  )
  
  return onSnapshot(q, (snapshot) => {
    const transactions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Transaction[]
    
    callback(transactions)
  })
}

// Escuchar notificaciones no leídas
const subscribeToUnreadNotifications = (callback: (count: number) => void) => {
  const q = query(
    collection(db, `users/${userId}/notifications`),
    where('read', '==', false)
  )
  
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.size)
  })
}
```

---

## 🔐 Reglas de Seguridad de Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función auxiliar para verificar autenticación
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Función auxiliar para verificar propiedad
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Usuarios
    match /users/{userId} {
      allow read, write: if isOwner(userId);
      
      // Configuración financiera
      match /financialSettings/{settingId} {
        allow read, write: if isOwner(userId);
      }
      
      // Transacciones
      match /transactions/{transactionId} {
        allow read, write: if isOwner(userId);
      }
      
      // Metas de ahorro
      match /savingsGoals/{goalId} {
        allow read, write: if isOwner(userId);
        
        // Aportes a metas
        match /contributions/{contributionId} {
          allow read, write: if isOwner(userId);
        }
      }
      
      // Cuentas
      match /accounts/{accountId} {
        allow read, write: if isOwner(userId);
      }
      
      // Tarjetas de crédito
      match /creditCards/{cardId} {
        allow read, write: if isOwner(userId);
      }
      
      // Deudas
      match /debts/{debtId} {
        allow read, write: if isOwner(userId);
      }
      
      // Notificaciones
      match /notifications/{notificationId} {
        allow read, write: if isOwner(userId);
      }
      
      // Servicios
      match /services/{serviceId} {
        allow read, write: if isOwner(userId);
      }
    }
  }
}
```

---

## 📈 Consideraciones de Performance

### **1. Índices Compuestos Necesarios**
```
users/{userId}/transactions
  - userId + date (desc)
  - userId + type + date (desc)
  - userId + category + date (desc)
  - userId + isSplitExpense + date (desc)

users/{userId}/savingsGoals
  - userId + status + deadline (asc)

users/{userId}/debts
  - userId + type + status
  - userId + status + date (desc)

users/{userId}/notifications
  - userId + read + createdAt (desc)
```

### **2. Paginación**
```typescript
// Implementar paginación para transacciones
const getTransactionsPage = async (pageSize: number, lastDoc?: DocumentSnapshot) => {
  let q = query(
    collection(db, `users/${userId}/transactions`),
    orderBy('date', 'desc'),
    limit(pageSize)
  )
  
  if (lastDoc) {
    q = query(q, startAfter(lastDoc))
  }
  
  return await getDocs(q)
}
```

### **3. Caché Local**
- Usar `enableIndexedDbPersistence()` para caché offline
- Implementar estrategia de "cache-first" para datos históricos
- "Server-first" para datos en tiempo real

---

## 🚀 Próximos Pasos

1. **Crear funciones de utilidad** en `lib/firebase/firestore.ts`
2. **Implementar hooks personalizados** para cada colección
3. **Migrar datos mock** a Firestore
4. **Configurar índices** en Firebase Console
5. **Implementar reglas de seguridad**
6. **Agregar listeners en tiempo real** donde sea necesario
7. **Implementar sistema de notificaciones** con Cloud Functions

---

## 📝 Notas Importantes

- **Soft Delete**: Usar `deletedAt` en lugar de eliminar documentos
- **Timestamps**: Siempre usar `serverTimestamp()` para consistencia
- **Validación**: Implementar validación tanto en cliente como en servidor
- **Transacciones Atómicas**: Usar batch writes para operaciones relacionadas
- **Backup**: Configurar backups automáticos en Firebase Console

