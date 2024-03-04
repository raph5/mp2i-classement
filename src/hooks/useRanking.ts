import { Grade } from "./useGrades"

export interface Rank {
  rank: number
  average: number
  userId: string
  grades: Grade[]
}


function simpleAverage(grades: Grade[]): number {
  let sum = 0
  for(const g of grades) {
    sum += g.grade
  }
  return sum / grades.length
}

function subjectAverage(grades: Grade[]): number {
  const averageBySubject: Record<string, [number, number]> = {}
  for(const g of grades) {
    if(averageBySubject[g.subjectId]) {
      const [ average, coef ] = averageBySubject[g.subjectId]
      averageBySubject[g.subjectId] = [ (average*coef + g.grade) / (coef+1), coef+1 ]
    }
    else {
      averageBySubject[g.subjectId] = [ g.grade, 1 ]
    }
  }

  console.log(averageBySubject)

  let sum = 0
  for(const [average] of Object.values(averageBySubject)) {
    sum += average
  }
  return sum / Object.values(averageBySubject).length
}

function gradesToRanking(gradesLib: Grade[], filter: (g: Grade) => boolean, getAverage: (g: Grade[]) => number = simpleAverage) {
  
  const ranks: Rank[] = []
  const grades = gradesLib.filter(filter)

  const u = new Set()
  for(const { userId } of grades) {
    if(u.has(userId)) continue
    else u.add(userId)
    
    const userGrades = grades.filter(g => g.userId == userId)
    const average = getAverage(userGrades)

    ranks.push({ rank: 0, average, userId, grades: userGrades })
  }

  ranks.sort((r1, r2) => r2.average - r1.average)
  
  for(let i=0; i<ranks.length; i++) {
    ranks[i].rank = i + 1
  }

  return ranks

}


export type useGeneralRankingHook = (grades: Grade[]) => Rank[]

export function useGeneralRanking(): useGeneralRankingHook {
  return (grades: Grade[]) => gradesToRanking(grades, () => true, subjectAverage)
}


export type useSubjectRankingHook = (grades: Grade[], subjectId: string) => Rank[]

export function useSubjectRanking(): useSubjectRankingHook {
  return (grades: Grade[], subjectId: string) => gradesToRanking(grades, g => g.subjectId == subjectId)
}


export type useTestRankingHook = (grades: Grade[], testId: string) => Rank[]

export function useTestRanking(): useTestRankingHook {
  return (grades: Grade[], testId: string) => gradesToRanking(grades, g => g.testId == testId)
}