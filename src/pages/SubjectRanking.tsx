import type React from "react"
import { useMemo, useState } from "react"
import { Spinner, Chip, Card, Skeleton } from "@nextui-org/react"
import { useSubjects } from "../hooks/useSubjects"
import DragScroll from "../components/small/DragScroll"
import { useGrades } from "../hooks/useGrades"
import { useGeneralRanking, useSubjectRanking } from "../hooks/useRanking"
import { useUsers } from "../hooks/useUsers"
import { RankingCard } from "../components/small/RankingCard"

const SubjectRankingPage: React.FC = () => {

  const [subjects, subjectsLoading] = useSubjects()
  const [grades, gradesLoading] = useGrades()
  const [ users, usersLoading ] = useUsers()

  const generalRanking = useGeneralRanking()
  const subjectRanking = useSubjectRanking()

  const [filterId, setFilterId] = useState<string>('general')
  
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
          ranking?.map(({ rank, average, userId }) => {
            const user = users.find(u => u.id == userId)
            return (
              <RankingCard
                key={user?.id}
                name={user?.name ?? ''}
                photoUrl={user?.photoUrl ?? ''}
                rank={rank}
                grade={average}
                verified={user?.isValid ?? false} />
            )
          })
        )}
      </div>
    </section>
  )
}

export default SubjectRankingPage