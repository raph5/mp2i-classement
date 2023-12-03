import { collection } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useCollectionOnce } from "react-firebase-hooks/firestore"
import { db } from "../firebase/firestore"

export interface User {
  id: string,
  name: string,
  photoUrl: string,
  isValid: boolean
}


// [ users, loading ]
export type useUsersHook = [ User[], boolean ]

export function useUsers(): useUsersHook {

  const [usersSnap, usersLoading, usersError] = useCollectionOnce( collection(db, 'users') )
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    if(usersError) {
      console.error(usersError)
    }
    else if(usersSnap) {

      const _users: User[] = usersSnap.docs.map(docSnap => {
        const { isValid, name, id, photoUrl } = docSnap.data()
        return { isValid, name, id, photoUrl }
      })

      setUsers(_users)
    }
  }, [usersSnap])

  return [ users, usersLoading ] as [ User[], boolean ]

}