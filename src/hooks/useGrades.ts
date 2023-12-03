import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { useAuth } from "./useAuth";
import { type Test, useTests } from "./useTests";
import { ref, uploadBytes } from "firebase/storage"
import { storage } from "../firebase/storage";
import { User, useUsers } from "./useUsers";
import { useEffect, useState } from "react";

export interface Grade {
  grade: number
  anonymous: boolean
  emoji: string
  photoUri: string
  userId: string
  testId: string
  subjectId: string
}

function createGrade(
  grade: number,
  photoUri: string,
  anonymous: boolean,
  emoji: string,
  testId: string,
  userId: string,
  tests: Test[]
): Grade {
  const test = tests.find(t => t.id === testId)
  
  // check values validity
  if(grade < 0 || grade > 20) throw new Error("Grade out of range")
  if(!test) throw new Error("Can't find test")
  if(emoji.length > 1) throw new Error("Emoji field not valid")

  return {
    grade,
    anonymous,
    emoji,
    photoUri,
    testId,
    userId,
    subjectId: test.subject
  }
}


// [ grades, loading ]
export type useGradesHook = [ Grade[], boolean ]

export function useGrades(): useGradesHook {
  
  const [users, usersLoading] = useUsers()
  const [grades, setGrades] = useState<Grade[]>([])
  const [gradesLoading, setGradesLoading] = useState<boolean>(true)

  async function fetchGrades() {

    try {
      setGradesLoading(true)

      const promises = users.map(async (user: User) => {
        const gradesSnapshot = await getDocs( collection(db, 'users', user.id, 'grades') )
        const userGrades: Grade[] = gradesSnapshot.docs.map((gradeDoc) => {
          const { grade, anonymous, emoji, photoUri, testId, userId, subjectId } = gradeDoc.data()
          return { grade, anonymous, emoji, photoUri, testId, userId, subjectId }
        })
        return userGrades
      })

      const gradesArrays = await Promise.all(promises)
      const allGrades = gradesArrays.flat()
      setGrades(allGrades)
    }
    catch (error) {
      console.error('Error fetching grades:', error);
    }
    finally {
      setGradesLoading(false);
    }
    
  }
  
  useEffect(() => {
    if(!usersLoading) {
      fetchGrades()
    }
  }, [users])

  return [ grades, gradesLoading ] as [ Grade[], boolean ]

}



// [ pushGrade, isReady ]
export type usePushGradeHook = [ (grade: number, testId: string, photo: File, anonymous?: boolean, emoji?: string) => void, boolean ]

export function usePushGrade(): usePushGradeHook {

  const [testsLib, testsLibLoading] = useTests()

  const { user } = useAuth()
  
  async function push(grade: number, testId: string, photo: File, anonymous=false, emoji='') {
    if(!user) throw Error("user not loged")
    
    const gradeDoc = doc(db, 'users', user.uid, 'grades', testId)

    // upload photo
    const photoUri = `grade-photo/${crypto.randomUUID()}`
    const photoRef = ref(storage, photoUri)
    await uploadBytes(photoRef, photo)

    const gradeData = createGrade(grade, photoUri, anonymous, emoji, testId, user.uid, testsLib)
    
    await setDoc(gradeDoc, gradeData)
  }

  return [ push, !testsLibLoading ]

}