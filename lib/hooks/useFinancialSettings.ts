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

    try {
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
    } catch (err: any) {
      console.error('Error setting up financial settings listener:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [user])

  return { settings, loading, error }
}

