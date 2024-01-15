import { Grade } from "./useGrades"

export interface Rank {
  rank: number
  average: number
  userId: string
}


function gradesToRanking(gradesLib: Grade[], filter: (g: Grade) => boolean) {
  
  const ranks: Rank[] = []
  const grades = gradesLib.filter(filter)

  const u = new Set()
  for(const { userId } of grades) {
    if(u.has(userId)) continue
    else u.add(userId)
    
    const userGrades = grades.filter(g => g.userId == userId)
    const average = userGrades.reduce((sum, g) => sum + g.grade, 0) / userGrades.length

    ranks.push({ rank: 0, average, userId })
  }

  ranks.sort((r1, r2) => r2.average - r1.average)
  
  for(let i=0; i<ranks.length; i++) {
    ranks[i].rank = i + 1
  }

  return ranks

}


export type useGeneralRankingHook = (grades: Grade[]) => Rank[]

export function useGeneralRanking(): useGeneralRankingHook {
  return (grades: Grade[]) => gradesToRanking(grades, () => true)
}


export type useSubjectRankingHook = (grades: Grade[], subjectId: string) => Rank[]

export function useSubjectRanking(): useSubjectRankingHook {
  return (grades: Grade[], subjectId: string) => gradesToRanking(grades, g => g.subjectId == subjectId)
}