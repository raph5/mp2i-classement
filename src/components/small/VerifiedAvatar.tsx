import type React from "react"
import { Avatar, type AvatarProps } from "@nextui-org/react"

export interface VerifiedAvatarProps extends AvatarProps {
  verified: boolean
}

const VerifiedAvatar: React.FC<VerifiedAvatarProps> = (props) => {

  return (
    <div className="relative">
      {props.verified &&
        <span className="material-symbols-rounded absolute z-20 text-success text-lg leading-5 top-1 right-1">
          verified
        </span>
      }
      <Avatar {...props} />
    </div>
  )
}

export default VerifiedAvatar