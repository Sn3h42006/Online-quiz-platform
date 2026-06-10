import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardHeader from '@/components/dashboard/header'
import UserStatsCard from '@/components/dashboard/user-stats-card'
import { getMyQuizzes, getUserStats } from '@/app/actions/quizzes'

export default async function DashboardPage() {
  // Demo user for now - auth configured in production
  const demoUser = {
    id: 'demo-user-1',
    email: 'demo@example.com',
    name: 'Demo User',
  }

  const myQuizzes = await getMyQuizzes()
  const userStats = await getUserStats()

  return (
    <main className="min-h-screen bg-background">
      <DashboardHeader user={demoUser} />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-balance text-4xl font-bold text-foreground">Welcome back, {demoUser.name}!</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Create engaging quizzes, track your progress, and compete with others
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link href="/quiz/new">
            <Button className="h-24 w-full text-lg" size="lg">
              Create New Quiz
            </Button>
          </Link>
          <Link href="/quizzes">
            <Button variant="outline" className="h-24 w-full text-lg" size="lg">
              Browse Quizzes
            </Button>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
          <UserStatsCard stats={userStats[0]} />
        </div>

        {/* My Quizzes Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">My Quizzes</h2>
            {myQuizzes.length > 0 && (
              <Link href="/dashboard/quizzes">
                <Button variant="ghost">View all</Button>
              </Link>
            )}
          </div>

          {myQuizzes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="mb-4 text-muted-foreground">You haven&apos;t created any quizzes yet</p>
                <Link href="/quiz/new">
                  <Button>Create your first quiz</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {myQuizzes.slice(0, 4).map((quiz) => (
                <Card key={quiz.id} className="flex flex-col transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="line-clamp-2 text-lg">{quiz.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex gap-2">
                    <Link href={`/quiz/${quiz.id}`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        View
                      </Button>
                    </Link>
                    <Link href={`/quiz/${quiz.id}/edit`} className="flex-1">
                      <Button variant="outline" className="w-full" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
