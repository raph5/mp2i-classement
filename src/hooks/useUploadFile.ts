import { ref, uploadBytes } from "firebase/storage"
import { hashFile } from "../utils"
import { storage } from "../firebase/storage"

export interface UploadReport {
  uri: string
  id: string
  status: 'success' | 'error'
}


const uploadsRecord: Record<string, Promise<UploadReport>> = {}


export type useUploadFileHook = (file: File, path: string, id?: string) => Promise<UploadReport>

export function useUploadFile(): useUploadFileHook {

  return async function(file: File, path: string, _id?: string) {
    
    let id = _id ?? await hashFile(file)

    // upload in record
    if(uploadsRecord[id] !== undefined) {
      const report = await uploadsRecord[id]
      
      if(report.status == 'success') {
        return report
      }
    }

    // upload process
    uploadsRecord[id] = new Promise((res, rej) => {

      const fileUri = `${path}/${id}`
      const fileRef = ref(storage, fileUri)

      uploadBytes(fileRef, file)
        .then(() => {
          res({ id, uri: fileUri, status: 'success' })
        })
        .catch(e => {
          console.error(`🔭 error while uploading file ${file.name} :\n${e}`)
          rej({ id, uri: fileUri, status: 'error' })
        })

    })
    
    return await uploadsRecord[id]

  }
}