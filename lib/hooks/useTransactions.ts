"use client"

import { useState, useEffect } from 'react'
import { onSnapshot, query, where, orderBy, Timestamp, limit as firestoreLimit } from 'firebase/firestore'
import { useAuth } from './useAuth'
import { transactionsCollection } from '../firebase/collections'

interface UseTransactionsOptions {
  startDate?: Date
  endDate?: Date
  type?: 'expense' | 'income'
  category?: string
  limit?: number
}

export function useTransactions(options?: UseTransactionsOptions) {
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

    try {
      let q = query(
        transactionsCollection(user.uid),
        where('deletedAt', '==', null),
        orderBy('date', 'desc')
      )

      if (options?.startDate) {
        q = query(q, where('date', '>=', Timestamp.fromDate(options.startDate)))
      }

      if (options?.endDate) {
        q = query(q, where('date', '<=', Timestamp.fromDate(options.endDate)))
      }

      if (options?.type) {
        q = query(q, where('type', '==', options.type))
      }

      if (options?.category) {
        q = query(q, where('category', '==', options.category))
      }

      if (options?.limit) {
        q = query(q, firestoreLimit(options.limit))
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
    } catch (err: any) {
      console.error('Error setting up transactions listener:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [user, options?.startDate, options?.endDate, options?.type, options?.category, options?.limit])

  return { transactions, loading, error }
}

