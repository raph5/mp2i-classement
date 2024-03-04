import type React from "react"
import { useMemo, useState } from "react"
import { Card, Skeleton, Image, useDisclosure, Select, SelectSection, SelectItem, type Selection } from "@nextui-org/react"
import { useDownloadURL } from "react-firebase-hooks/storage"
import { ref } from "firebase/storage"
import { Subject, useSubjects } from "../hooks/useSubjects"
import { Grade, useGrades } from "../hooks/useGrades"
import { useGeneralRanking, useSubjectRanking, useTestRanking } from "../hooks/useRanking"
import { User, useUsers } from "../hooks/useUsers"
import RankingCard from "../components/small/RankingCard"
import RankingModal from "../components/small/RankingModal"
import { storage } from "../firebase/storage"
import { useTests, Test } from "../hooks/useTests"
import { MONTH, getSelectionItem } from "../utils"

interface GradeImageProps {
  grade: number
  subjectId: string
  photoUri: string
  subjects: Subject[]
}

interface RankingProps {
  rank: number
  userId: string
  users: User[]
  grade: Grade
  subjects: Subject[]
}


function getSortedTests(tests: Test[]): { month: string, monthTests: Test[] }[] {
  const sortedTests: { month: string, monthTests: Test[] }[] = []

  const _sort = tests.sort(t => -t.date.seconds)
  for(const t of _sort) {
    const date = t.date.toDate()
    const month = `${MONTH[date.getMonth()]} ${date.getFullYear()}`
    if(sortedTests.length == 0 || sortedTests.at(-1)?.month != month) {
      sortedTests.push({ month: month, monthTests: [] })
    }
    sortedTests.at(-1)?.monthTests.push(t)
  }

  return sortedTests
}


const GradeImage: React.FC<GradeImageProps> = ({ grade, subjectId, photoUri, subjects }) => {
  const subject = subjects.find(s => s.id == subjectId)
  const imageRef = ref(storage, photoUri)
  const [ imageUrl ] = useDownloadURL(imageRef)

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

const Ranking: React.FC<RankingProps> = ({ rank, userId, users, grade, subjects }) => {
  const user = users.find(u => u.id == userId)
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  return (
    <>
      <RankingCard
        key={`rankingCard:${userId}`}
        name={user?.name ?? ''}
        profilePictureUrl={user?.photoUrl ?? ''}
        rank={rank}
        grade={grade.grade}
        verified={user?.isValid ?? false}
        isPressable
        onClick={onOpen} />
      <RankingModal header={user?.name ?? ''} isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside">
        <div className="flex flex-col gap-4 h-96">
          <GradeImage
            grade={grade.grade}
            subjectId={grade.subjectId}
            photoUri={grade.photoUri}
            subjects={subjects}
            key={grade.subjectId} />
        </div>
      </RankingModal>
    </>
  )
}

const TestRankingPage: React.FC = () => {

  const [ subjects, subjectsLoading ] = useSubjects()
  const [ grades, gradesLoading ] = useGrades()
  const [ users, usersLoading ] = useUsers()
  const [ tests, testsLoading ] = useTests()

  const testRanking = useTestRanking()

  const [testId, setTestId] = useState<string>()
  const [testSelection, setTestSelection] = useState<Selection>(new Set([]))
  
  // TODO: check for useMemo error
  const ranking = useMemo(() => {
    if(!grades || !testId) return []
    return testRanking(grades, testId)
  }, [grades, testId])

  const sortedTests = useMemo(() => {
    if(!tests || tests.length == 0) return []
    const _tests = getSortedTests(tests)
    setTestId(_tests[0].monthTests[0].id)
    setTestSelection(new Set( [_tests[0].monthTests[0].id] ))
    return _tests
  }, [tests])

  function setTest(selection: Selection) {
    const id = getSelectionItem<string>(selection)
    if(id) {
      setTestId(id)
      setTestSelection(selection)
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-medium mb-8">Classement par devoir</h1>

      <Select
        isLoading={testsLoading} 
        label="Devoir"
        selectedKeys={testSelection}
        onSelectionChange={setTest}
      >
        {sortedTests.map(({ month, monthTests }) => (
          <SelectSection title={month} key={month}>
            {monthTests.map(test => (
              <SelectItem key={test.id}>
                {test.name}
              </SelectItem>
            ))}
          </SelectSection>
        ))}
      </Select>

      <div className="flex flex-col gap-4 mt-8">
        {gradesLoading && usersLoading ? (
          <Card className="w-full h-20">
            <Skeleton />
          </Card>
        ) : (
          ranking?.map(({ rank, userId, grades }) => (
            <Ranking
              rank={rank}
              userId={userId}
              users={users}
              grade={grades[0]}
              subjects={subjects}
              key={`ranking:${userId}`} />
          ))
        )}
      </div>
    </section>
  )
}

export default TestRankingPage