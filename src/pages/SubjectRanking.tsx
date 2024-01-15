import type React from "react"
import { useMemo, useState } from "react"
import { Spinner, Chip, Card, Skeleton, Image, useDisclosure } from "@nextui-org/react"
import { useDownloadURL } from "react-firebase-hooks/storage"
import { ref } from "firebase/storage"
import { Subject, useSubjects } from "../hooks/useSubjects"
import DragScroll from "../components/small/DragScroll"
import { Grade, useGrades } from "../hooks/useGrades"
import { useGeneralRanking, useSubjectRanking } from "../hooks/useRanking"
import { User, useUsers } from "../hooks/useUsers"
import RankingCard from "../components/small/RankingCard"
import RankingModal from "../components/small/RankingModal"
import { storage } from "../firebase/storage"

interface GradeImageProps {
  grade: number
  subjectId: string
  photoUri: string
  subjects: Subject[]
}

interface RankingProps {
  rank: number
  average: number
  userId: string
  users: User[]
  grades: Grade[]
  subjects: Subject[]
}

const GradeImage: React.FC<GradeImageProps> = ({ grade, subjectId, photoUri, subjects }) => {
  const subject = subjects.find(s => s.id == subjectId)
  const imageRef = ref(storage, photoUri)
  const [ imageUrl ] = useDownloadURL(imageRef)

  console.log(imageRef)
  
  return (
    <div className="flex flex-col items-center relative">
      <div className="flex w-full absolute z-20">
        <span className="drop-shadow-2xl backdrop-blur-sm font-medium bg-black bg-opacity-50 shadow-2xl rounded-tl-xl rounded-br-xl px-4 py-2">{subject?.name}</span>
        <span className="drop-shadow-2xl backdrop-blur-sm font-medium bg-black bg-opacity-50 shadow-2xl rounded-bl-xl rounded-tr-xl px-4 py-2 ml-auto">{grade}/20</span>
      </div>
      <Image src={imageUrl} alt="grade proof image" loading="lazy" />
    </div>
  )
}

const Ranking: React.FC<RankingProps> = ({ rank, average, userId, users, grades, subjects }) => {
  const user = users.find(u => u.id == userId)
  const userGrades = grades.filter(g => g.userId == userId)
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <RankingCard
        key={user?.id}
        name={user?.name ?? ''}
        profilePictureUrl={user?.photoUrl ?? ''}
        rank={rank}
        grade={average}
        verified={user?.isValid ?? false}
        isPressable
        onClick={onOpen} />
      <RankingModal header={user?.name ?? ''} isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
        <div className="flex flex-col gap-4 h-96">
          {userGrades.map(({ grade, subjectId, photoUri }) => (
            <GradeImage
              grade={grade}
              subjectId={subjectId}
              photoUri={photoUri}
              subjects={subjects}
              key={subjectId} />
          ))}
        </div>
      </RankingModal>
    </>
  )
}

const SubjectRankingPage: React.FC = () => {

  const [ subjects, subjectsLoading ] = useSubjects()
  const [ grades, gradesLoading ] = useGrades()
  const [ users, usersLoading ] = useUsers()

  const generalRanking = useGeneralRanking()
  const subjectRanking = useSubjectRanking()

  const [filterId, setFilterId] = useState<string>('general')
  
  // TODO: check for useMemo error
  const ranking = useMemo(() => {
    if(!grades) return []
    if(filterId == 'general') return generalRanking(grades)
    return subjectRanking(grades, filterId)
  }, [grades, filterId])

  return (
    <section>
      <h1 className="text-3xl font-medium mb-8">Classement par matière</h1>

      <div>
        <DragScroll className="flex gap-2 overflow-x-auto w-full no-scrollbar mb-4">
          {subjectsLoading ? (
            <Chip variant="flat" color="default" radius="sm"><Spinner color="default" size="sm" /></Chip>
          ) : (
            <>
              <Chip
                className="select-none"
                radius="sm"
                color={filterId === 'general' ? 'primary' : 'default'}
                onClick={() => setFilterId('general')}
              >Général</Chip>
              {subjects.map(sub => (
                <Chip
                  className="select-none"
                  radius="sm"
                  color={filterId === sub.id ? 'primary' : 'default'}
                  key={sub.id}
                  onClick={() => setFilterId(sub.id)}
                >{sub.name}</Chip>
              ))}
            </>
          )}
        </DragScroll>
      </div>

      <div className="flex flex-col gap-4 mt-8">
        {gradesLoading && usersLoading ? (
          <Card className="w-full h-20">
            <Skeleton />
          </Card>
        ) : (
          ranking?.map(({ rank, average, userId }) => (
            <Ranking
              rank={rank}
              average={average}
              userId={userId}
              users={users}
              grades={grades}
              subjects={subjects}
              key={userId} />
          ))
        )}
      </div>
    </section>
  )
}

export default SubjectRankingPage