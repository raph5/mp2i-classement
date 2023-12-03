import { useEffect, useState } from "react"
import { useCollectionOnce } from "react-firebase-hooks/firestore"
import { db } from "../firebase/firestore"
import { type Timestamp, collection } from "firebase/firestore"

export interface Test {
  id: string
  name: string
  description: string
  subject: string
  date: Timestamp
}

// [ testLib, loading ]
export type useTestsHook = [ Test[], boolean ]

export function useTests(): useTestsHook {
  
  const [testsSnap, testsLoading, testsError] = useCollectionOnce( collection(db, 'tests') )
  const [test, setTests] = useState<Test[]>([])

  useEffect(() => {
    if(testsError) {
      console.error(testsError)
    }
    else if(testsSnap) {

      const _tests: Test[] = testsSnap.docs.map(docSnap => {
        const { name, description, subject, date } = docSnap.data()
        return { name, description, subject, date, id: docSnap.id }
      })

      setTests(_tests)
    }
  }, [testsSnap])

  return [ test, testsLoading ]

}