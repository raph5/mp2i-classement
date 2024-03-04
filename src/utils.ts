import type { Selection } from "@nextui-org/react"

// return selected item from Select nexitui component
// https://nextui.org/docs/components/select#controlled
export function getSelectionItem<T=React.Key>(selection: Selection): T | null {
  if(typeof selection === 'string' || selection.size !== 1) {
    return null
  }
  const [item] = selection
  return item as T
}


// regular clamp function
export function clamp(x: number, xMin: number, xMax: number) {
  if(x < xMin) return xMin
  if(x > xMax) return xMax
  return x
}


// omit keys from object
export function omit(object: any, kesy: string[]) {
  return Object.keys(object)
    .filter(key => !kesy.includes(key))
    .reduce((obj: any, key: string) => {
      obj[key] = object[key];
      return obj
    }, {})
}


// rank to string : 1 => 'er'
export const rankSuffix = (rank: number) => rank === 1 ? 'er' : 'ème'


// round grade
export const formatGrade = (grade: number) => (Math.round(grade * 100) / 100).toString()


// image hashing function
export async function hashFile(file: File) {
  // get file buffer
  const fileBuffer = await file.arrayBuffer()
  
  // hash file buffer
  const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer)

  // convert ArrayBuffer to Array
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  // convert bytes to hex string                  
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}


export const MONTH = [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre' ]