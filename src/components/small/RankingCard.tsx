import { Card, type CardProps } from "@nextui-org/react"
import type React from "react"
import { formatGrade, omit, rankSuffix } from "../../utils"
import VerifiedAvatar from "../small/VerifiedAvatar"

export interface RankingCardProps extends CardProps {
  name: string
  profilePictureUrl: string
  rank: number
  grade: number
  verified: boolean
}

const RankingCard: React.FC<RankingCardProps> = (props) => {
  const { name, profilePictureUrl, rank, grade, verified } = props;
  const cardProps = omit(props, ['name', 'profilePictureUrl', 'rank', 'grade', 'verified']);

  return (
    <Card className="w-full h-20 flex-row" {...cardProps}>
      <div className="flex h-full justify-center items-center w-20 bg-default-100">
        <span>
          <span className="text-2xl font-medium">{rank}</span>
          <span className="text-sm">{rankSuffix(rank)}</span>
        </span>
      </div>
      <div className="flex flex-row p-2 w-full">
        <VerifiedAvatar className="m-1" size="lg" src={profilePictureUrl} name={name} showFallback verified={verified} />
        <h1 className="ml-2 my-auto capitalize">{name}</h1>
        <span className="ml-auto mt-auto">
          <span className="text-2xl font-medium">{formatGrade(grade)}</span>
          <span className="text-sm text-gray-500">/20</span>
        </span>
      </div>
    </Card>
  )
}

export default RankingCard;