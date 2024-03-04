import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useCollectionOnce } from "react-firebase-hooks/firestore"
import { db } from "../firebase/firestore"
import { useAuth } from "./useAuth"
import { storage } from "../firebase/storage"
import { getDownloadURL, ref } from "firebase/storage"
import { useUploadFile } from "./useUploadFile"

export interface User {
  id: string,
  name: string,
  photoUrl: string,
  isValid: boolean
}

async function getPhotoUrl(photoUri: string): Promise<string> {
  if(photoUri.substring(0, 8) == "storage:") {
    const ppRef = ref(storage, photoUri.substring(8));
    return await getDownloadURL(ppRef).catch(() => "");
  }
  return photoUri
}


// [ user, loading ]
export type useUserHook = [ User | undefined, boolean ]

export function useUser(): useUserHook {

  const usersCollection = collection(db, 'users')
  const [user, setUsers] = useState<User>()
  const [isLoading, setIsLoading] = useState(true)
  const auth = useAuth()

  useEffect(() => {
    if(auth.user && auth.user.uid) {
      const userDoc = doc(usersCollection, auth.user.uid)
      getDoc(userDoc).then(async (userSpan) => {
        if(userSpan.exists()) {
          const { id, name, photoUri, isValid } = userSpan.data()
          const photoUrl = await getPhotoUrl(photoUri);
          setUsers({ id, name, photoUrl, isValid });
          setIsLoading(false);
        }
      })
    }
  }, [auth]);

  return [ user, isLoading ]

}


export type useEditUserHook = ({ name, photo }: { name?: string, photo?: File }) => Promise<void>

export function useEditUser(): useEditUserHook {
  
  const auth = useAuth();
  const uploadFile = useUploadFile();
  const usersCollection = collection(db, 'users');

  return async function({ name, photo }: { name?: string, photo?: File }) {
    if(!auth.user || !auth.user.uid) throw new Error("user not loged");

    const userData: { name?: string, photoUri?: string } = {};
    if(name) {
      userData.name = name;
    }
    if(photo) {
      const { uri } = await uploadFile(photo, 'pp', auth.user.uid);
      console.log(uri)
      userData.photoUri = "storage:" + uri
    }

    const userRef = doc(usersCollection, auth.user.uid);
    await setDoc(userRef, userData, { merge: true });
  }
  
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

      const _users: Promise<User>[] = usersSnap.docs.map(async (docSnap) => {
        const { isValid, name, id, photoUri } = docSnap.data()
        const photoUrl = await getPhotoUrl(photoUri);
        return { isValid, name, id, photoUrl }
      })

      Promise.all(_users).then(u => setUsers(u))
    }
  }, [usersSnap])

  return [ users, usersLoading ] as [ User[], boolean ]

}