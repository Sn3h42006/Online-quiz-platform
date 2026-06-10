'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Zap } from 'lucide-react'

interface UserStatsCardProps {
  stats?: {
    totalQuizzesTaken: number
    totalQuestionsAnswered: number
    totalCorrectAnswers: number
    averageScore: number
  }
}

export default function UserStatsCard({ stats }: UserStatsCardProps) {
  if (!stats) {
    return null
  }

  const statItems = [
    {
      label: 'Quizzes Taken',
      value: stats.totalQuizzesTaken,
      icon: BarChart3,
      color: 'text-blue-500',
    },
    {
      label: 'Questions Answered',
      value: stats.totalQuestionsAnswered,
      icon: Zap,
      color: 'text-orange-500',
    },
    {
      label: 'Correct Answers',
      value: stats.totalCorrectAnswers,
      icon: TrendingUp,
      color: 'text-green-500',
    },
    {
      label: 'Average Score',
      value: `${stats.averageScore.toFixed(1)}%`,
      icon: BarChart3,
      color: 'text-purple-500',
    },
  ]

  return (
    <>
      {statItems.map((item, index) => {
        const Icon = item.icon
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              <Icon className={`h-5 w-5 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}
