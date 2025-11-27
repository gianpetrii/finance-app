import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  increment
} from 'firebase/firestore'
import { db } from '@/app/lib/firebase'

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
      ? { ...person, paid: true, paidAt: Timestamp.now() }
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
    const q = query(
      financialSettingsCollection(userId),
      where('effectiveTo', '==', null)
    )
    const snapshot = await getDocs(q)
    
    for (const docSnap of snapshot.docs) {
      await updateDoc(docSnap.ref, {
        effectiveTo: serverTimestamp()
      })
    }
  }
  
  // 2. Calcular valores
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
  
  // 3. Crear nueva configuración
  const settingId = `setting_${Date.now()}`
  const docRef = doc(financialSettingsCollection(userId), settingId)
  
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

export const updateSavingsGoal = async (
  userId: string,
  goalId: string,
  updates: any
) => {
  const docRef = doc(savingsGoalsCollection(userId), goalId)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  })
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
    deletedAt: null,
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

export const updateCreditCard = async (
  userId: string,
  cardId: string,
  updates: any
) => {
  const docRef = doc(creditCardsCollection(userId), cardId)
  
  // Recalcular crédito disponible si se actualiza el balance
  if (updates.currentBalance !== undefined) {
    const cardSnap = await getDoc(docRef)
    const card = cardSnap.data()
    if (card) {
      updates.availableCredit = card.creditLimit - updates.currentBalance
    }
  }
  
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  })
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

export const updateService = async (
  userId: string,
  serviceId: string,
  updates: any
) => {
  const docRef = doc(servicesCollection(userId), serviceId)
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp()
  })
}

