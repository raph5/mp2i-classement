import type React from "react"
import { Button, type ButtonProps } from "@nextui-org/react"
import { type ChangeEvent, useRef } from "react"
import { omit } from "../../utils"

export interface ImageButtonProps extends ButtonProps {
  onImageChange?: (image: File) => void
}

const ImageButton: React.FC<ImageButtonProps> = (props) => {

  const inputRef = useRef(null)

  function onClick() {
    // @ts-ignore
    inputRef.current?.click()
  }
  
  function onChange(event: ChangeEvent<HTMLInputElement>) {
    if(!props.onImageChange) return

    if(!event?.target?.files) throw new Error()
    const [ file ] = event.target.files

    props.onImageChange(file)
  }

  const childProps = omit(props, ['onFileInput'])

  return (
    <>
      <input ref={inputRef} onChange={onChange} type="file" accept="image/jpeg, image/png, image/jpg, image/webp" style={{display: 'none'}} />
      <Button { ...childProps } onClick={onClick} />
    </>
  )
}

export default ImageButton