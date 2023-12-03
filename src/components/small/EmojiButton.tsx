import type React from "react"
import { Button, type ButtonProps } from "@nextui-org/react"
import { omit } from "../../utils"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useState } from "react"
import { BottomSheet } from 'react-spring-bottom-sheet'
import { SpringEvent } from "react-spring-bottom-sheet/dist/types"

export interface EmojiButtonProps extends ButtonProps {
  onEmojiChange?: (emoji: string) => void
}

const EmojiButton: React.FC<EmojiButtonProps> = (props) => {

  const [isOpen, setOpen] = useState(false)
  const [isPickerDisplayed, setPickerDisplayed] = useState(false)

  function onDismiss() {
    setPickerDisplayed(false)
    setOpen(false)
  }
  function onSpringEnd(event: SpringEvent) {
    if(event.type === 'OPEN' || event.type === 'SNAP') {
      setPickerDisplayed(true)
    }
  }

  const childProps = omit(props, ['onEmojiChange'])

  return (
    <>
      {/* <BottomSheet
        open={isOpen}
        onDismiss={onDismiss}
        onSpringEnd={onSpringEnd}
      >
        <div className="h-70 w-full">
          <div className={isPickerDisplayed ? "w-max mx-auto" : "hidden"}>
            <Picker
              data={data}
              onEmojiSelect={console.log}
              searchPosition="none"
              previewPosition="none" />
          </div>
        </div>
      </BottomSheet> */}

      <div className={isOpen ? "fixed bg-content2 rounded-t-lg z-50 inset-x-0 bottom-0 h-64" : "hidden"}>
        test
      </div>

      <div
        onClick={() => setOpen(false)}
        className={isOpen ? "bg-black bg-opacity-30 fixed inset-0 z-50" : "hidden"}></div>

      <Button { ...childProps } onClick={() => setOpen(true)} />
    </>
  )
}

export default EmojiButton