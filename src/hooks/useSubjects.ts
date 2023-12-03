import { useEffect, useState } from "react"
import { useCollectionOnce } from "react-firebase-hooks/firestore"
import { db } from "../firebase/firestore"
import { collection } from "firebase/firestore"

const SUBJECT_ORDER = [
  'math',
  'physique',
  'info',
  'si',
  'français',
  'anglais',
  'espagnol',
  'allemend',
]

export interface Subject {
  name: string
  id: string
}

// [ subjetsList, loading ]
export type useSubjectsHook = [ Subject[], boolean ]

export function useSubjects(): useSubjectsHook {

  const [subjectsSnap, subjectsLoading, subjectsError] = useCollectionOnce( collection(db, 'subjects') )
  const [subjects, setSubjects] = useState<Subject[]>([])
  
  useEffect(() => {
    
    if(subjectsError) {
      console.error(subjectsError)
    }
    else if(subjectsSnap) {

      const sbj: { [id: string]: Subject} = {}

      for(const doc of subjectsSnap.docs) {
        const { id, name } = doc.data()
        sbj[id] = { id, name }
      }

      let sbjList = []
      for(const sbjId of SUBJECT_ORDER) {
        if(sbj[sbjId]) {
          sbjList.push(sbj[sbjId])
          delete sbj[sbjId]
        }
      }
      sbjList = sbjList.concat(Object.values(sbj))


      setSubjects(sbjList)
    }
  }, [subjectsSnap])

  return [ subjects, subjectsLoading ]

}