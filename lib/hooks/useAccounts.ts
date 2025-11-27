import { useState, useEffect } from "react"
import { onSnapshot, query, where, orderBy } from "firebase/firestore"
import { accountsCollection } from "@/lib/firebase/collections"
import { useAuth } from "./useAuth"

export const useAccounts = () => {
  const { user } = useAuth()
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setAccounts([])
      setLoading(false)
      return
    }

    const q = query(
      accountsCollection(user.uid),
      where("deletedAt", "==", null),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const accountsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setAccounts(accountsData)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching accounts:", err)
        setError(err as Error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  return { accounts, loading, error }
}

