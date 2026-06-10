'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Quiz {
  id: string
  title: string
  description?: string
  category?: string
  isPublic: boolean
}

interface QuizBrowserProps {
  quizzes: Quiz[]
}

export default function QuizBrowser({ quizzes }: QuizBrowserProps) {
  if (quizzes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <p className="mb-4 text-muted-foreground">No quizzes available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <Card key={quiz.id} className="flex flex-col transition-shadow hover:shadow-lg">
          <CardHeader>
            <CardTitle className="line-clamp-2 text-lg">{quiz.title}</CardTitle>
            {quiz.description && <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>}
            {quiz.category && <p className="text-xs text-muted-foreground">Category: {quiz.category}</p>}
          </CardHeader>
          <CardContent className="mt-auto">
            <Link href={`/quiz/${quiz.id}`} className="w-full">
              <Button variant="default" className="w-full">
                Take Quiz
              </Button>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
