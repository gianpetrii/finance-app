import { useState, useEffect } from "react"
import { onSnapshot, query, where, orderBy } from "firebase/firestore"
import { debtsCollection } from "@/lib/firebase/collections"
import { useAuth } from "./useAuth"

interface UseDebtsOptions {
  type?: "receivable" | "payable"
  status?: "pending" | "partial" | "paid"
}

export const useDebts = (options: UseDebtsOptions = {}) => {
  const { user } = useAuth()
  const [debts, setDebts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setDebts([])
      setLoading(false)
      return
    }

    let q = query(
      debtsCollection(user.uid),
      where("deletedAt", "==", null),
      orderBy("createdAt", "desc")
    )

    if (options.type) {
      q = query(q, where("type", "==", options.type))
    }

    if (options.status) {
      q = query(q, where("status", "==", options.status))
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const debtsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setDebts(debtsData)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching debts:", err)
        setError(err as Error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user, options.type, options.status])

  return { debts, loading, error }
}

