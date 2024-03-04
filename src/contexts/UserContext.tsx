import type React from "react";
import { auth } from "../firebase/auth"
import { useAuthState } from 'react-firebase-hooks/auth';
import { createContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut as fireSignOut, type User } from "firebase/auth";
import { db } from "../firebase/firestore";
import { setDoc, doc, getDoc } from "firebase/firestore";

export interface UserContextValue {
  isValid: boolean
  user: User | null | undefined
  signIn: (email: string, pwd: string) => void
  signUp: (email: string, pwd: string) => void
  signInWithGoogle: () => void
  signOut: () => void
}

const googleProvider = new GoogleAuthProvider()


// firestore "users" collection store all user related data
// it need be sync with actual user base on each login

async function isUserValid(user: User) {
  const userDoc = doc(db, 'users', user.uid)
  const userSnap = await getDoc(userDoc)
  if(!userSnap.exists()) {
    await setDoc(
      userDoc,
      {
        isValid: false,
        name: user.displayName,
        id: user.uid,
        photoUri: user.photoURL
      },
      { merge: true }
    )
    return false
  }
  else {
    const userData = userSnap.data()
    return userData.isValid
  }
}


export const UserContext = createContext<UserContextValue>({
  isValid: false,
  user: null,
} as UserContextValue)

interface UserProps {
  children?: React.ReactNode
}

const UserProvider: React.FC<UserProps> = ({ children }) => {

  const [user] = useAuthState(auth)

  // each user need to be validated
  const [isValid, setIsValid] = useState(false)
  
  // fetch validity on user change
  useEffect(() => {
    if(user) {
      isUserValid(user).then(v => setIsValid(v))
    } else {
      setIsValid(false)
    }
  }, [user])


  async function signIn(email: string, pwd: string) {
    await signInWithEmailAndPassword(auth, email, pwd)
  }
  
  async function signUp(email: string, pwd: string) {
    await createUserWithEmailAndPassword(auth, email, pwd)
  }
  
  async function signInWithGoogle() {
    await signInWithPopup(auth, googleProvider)
  }
  
  async function signOut() {
    await fireSignOut(auth)
    setIsValid(false)
  }


  return (
    <UserContext.Provider value={{ user, isValid, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider