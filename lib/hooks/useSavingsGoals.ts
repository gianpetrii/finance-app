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

    try {
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
    } catch (err: any) {
      console.error('Error setting up savings goals listener:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [user, status])

  return { goals, loading, error }
}

