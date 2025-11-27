import { useState, useEffect } from "react"
import { onSnapshot, query, where, orderBy } from "firebase/firestore"
import { creditCardsCollection } from "@/lib/firebase/collections"
import { useAuth } from "./useAuth"

export const useCreditCards = () => {
  const { user } = useAuth()
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      setCards([])
      setLoading(false)
      return
    }

    const q = query(
      creditCardsCollection(user.uid),
      where("deletedAt", "==", null),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const cardsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        setCards(cardsData)
        setLoading(false)
      },
      (err) => {
        console.error("Error fetching cards:", err)
        setError(err as Error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user])

  return { cards, loading, error }
}

