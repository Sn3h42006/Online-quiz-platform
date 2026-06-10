'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getQuizLeaderboard } from '@/app/actions/quizzes'
import { useToast } from '@/hooks/use-toast'

interface LeaderboardPageProps {
  params: Promise<{ quizId: string }>
}

export default function LeaderboardPage({ params }: LeaderboardPageProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [quizId, setQuizId] = useState<string>('')
  const [leaderboard, setLeaderboard] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const resolvedParams = await params
      setQuizId(resolvedParams.quizId)
    })()
  }, [params])

  useEffect(() => {
    if (!quizId) return

    const loadLeaderboard = async () => {
      try {
        const data = await getQuizLeaderboard(quizId)
        setLeaderboard(data)
      } catch (error) {
        console.error('[v0] Error loading leaderboard:', error)
        toast({
          title: 'Error',
          description: 'Failed to load leaderboard',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    loadLeaderboard()
  }, [quizId, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-4xl">
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            className="mb-4"
          >
            ← Back
          </Button>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {leaderboard?.quiz.title} - Leaderboard
          </h1>
          <p className="text-muted-foreground">
            {leaderboard?.total || 0} participants • Average score:{' '}
            {leaderboard?.averageScore?.toFixed(1) || 0}%
          </p>
        </div>

        {/* Leaderboard Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Rank</th>
                    <th className="text-left py-3 px-4 font-semibold">User</th>
                    <th className="text-right py-3 px-4 font-semibold">Score</th>
                    <th className="text-right py-3 px-4 font-semibold">Percentage</th>
                    <th className="text-right py-3 px-4 font-semibold">Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard?.entries?.map((entry: any, index: number) => (
                    <tr
                      key={entry.userId}
                      className={`border-b hover:bg-muted/50 transition-colors ${
                        index < 3 ? 'bg-muted/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg w-8">{index + 1}</span>
                          {index === 0 && <span className="text-2xl">🥇</span>}
                          {index === 1 && <span className="text-2xl">🥈</span>}
                          {index === 2 && <span className="text-2xl">🥉</span>}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium">{entry.user?.name || 'Anonymous'}</p>
                        <p className="text-sm text-muted-foreground">{entry.user?.email}</p>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        {entry.bestScore || 0}
                      </td>
                      <td className="py-3 px-4 text-right font-mono">
                        <Badge variant="outline">
                          {(
                            ((entry.bestScore || 0) / leaderboard?.quiz?.maxScore || 100) *
                            100
                          ).toFixed(1)}
                          %
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        {entry.totalAttempts || 1}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {!leaderboard?.entries || leaderboard.entries.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No attempts yet. Be the first to take this quiz!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
