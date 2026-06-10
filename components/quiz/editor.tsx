'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import QuestionForm from './question-form'
import QuestionList from './question-list'
import { useRouter } from 'next/navigation'

interface Question {
  id: string
  type: 'mcq' | 'true_false' | 'short_answer' | 'matching'
  text: string
  explanation?: string
  orderIndex: number
  typeData?: any[]
}

interface Quiz {
  id: string
  title: string
  description?: string
  category?: string
  isPublic: boolean
}

interface QuizEditorProps {
  quizId: string
  initialQuestions: Question[]
  quiz: Quiz
}

export default function QuizEditor({ quizId, initialQuestions, quiz }: QuizEditorProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions)
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleQuestionAdded = (newQuestion: Question) => {
    setQuestions([...questions, newQuestion])
    setShowAddQuestion(false)
    toast({
      title: 'Success',
      description: 'Question added!',
    })
  }

  const handleQuestionRemoved = () => {
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="questions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Questions</h2>
            <Button
              onClick={() => setShowAddQuestion(!showAddQuestion)}
              variant={showAddQuestion ? 'secondary' : 'default'}
            >
              {showAddQuestion ? 'Cancel' : 'Add Question'}
            </Button>
          </div>

          {showAddQuestion && <QuestionForm quizId={quizId} onSuccess={handleQuestionAdded} />}

          {questions.length === 0 && !showAddQuestion && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <p className="mb-4 text-muted-foreground">No questions yet</p>
                <Button onClick={() => setShowAddQuestion(true)}>Add your first question</Button>
              </CardContent>
            </Card>
          )}

          {questions.length > 0 && (
            <QuestionList questions={questions} quizId={quizId} onQuestionRemoved={handleQuestionRemoved} />
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <p className="mt-1 text-foreground">{quiz.title}</p>
              </div>
              {quiz.description && (
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <p className="mt-1 text-foreground">{quiz.description}</p>
                </div>
              )}
              {quiz.category && (
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <p className="mt-1 text-foreground">{quiz.category}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium">Visibility</label>
                <p className="mt-1 text-foreground">{quiz.isPublic ? 'Public' : 'Private'}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
