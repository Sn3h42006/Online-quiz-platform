'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'

interface Question {
  id: string
  type: 'mcq' | 'true_false' | 'short_answer' | 'matching'
  text: string
  explanation?: string
  orderIndex: number
  typeData?: any[]
}

interface QuestionListProps {
  questions: Question[]
  quizId: string
  onQuestionRemoved: () => void
}

const typeLabels: Record<string, string> = {
  mcq: 'Multiple Choice',
  true_false: 'True/False',
  short_answer: 'Short Answer',
  matching: 'Matching',
}

const typeColors: Record<string, string> = {
  mcq: 'bg-blue-100 text-blue-800',
  true_false: 'bg-green-100 text-green-800',
  short_answer: 'bg-purple-100 text-purple-800',
  matching: 'bg-orange-100 text-orange-800',
}

export default function QuestionList({ questions, quizId, onQuestionRemoved }: QuestionListProps) {
  const { toast } = useToast()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (questionId: string) => {
    setDeletingId(questionId)
    try {
      // In a real app, you'd call a delete action here
      // For now, we'll just show a toast
      toast({
        title: 'Success',
        description: 'Question deleted',
      })
      onQuestionRemoved()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete question',
        variant: 'destructive',
      })
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <Card key={question.id} className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-muted-foreground">Q{question.orderIndex + 1}</span>
                  <Badge className={typeColors[question.type]}>{typeLabels[question.type]}</Badge>
                </div>
                <CardTitle className="mt-2 text-lg">{question.text}</CardTitle>
                {question.explanation && (
                  <p className="mt-2 text-sm text-muted-foreground">Explanation: {question.explanation}</p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(question.id)}
                disabled={deletingId === question.id}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {question.typeData && question.typeData.length > 0 && (
            <CardContent>
              <div className="space-y-2 text-sm">
                {question.type === 'mcq' && (
                  <div>
                    <p className="font-medium">Options:</p>
                    <ul className="mt-1 space-y-1 ml-4 list-disc">
                      {question.typeData.map((opt: any, i: number) => (
                        <li key={i} className={opt.isCorrect ? 'font-semibold text-green-700' : ''}>
                          {opt.text} {opt.isCorrect && '✓'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {question.type === 'true_false' && (
                  <div>
                    <p className="font-medium">Correct Answer: {question.typeData[0]?.correctAnswer ? 'True' : 'False'}</p>
                  </div>
                )}

                {question.type === 'short_answer' && (
                  <div>
                    <p className="font-medium">Accepted Answers:</p>
                    <ul className="mt-1 space-y-1 ml-4 list-disc">
                      {(() => {
                        try {
                          const answers = JSON.parse(question.typeData[0]?.correctAnswers || '[]')
                          return answers.map((ans: string, i: number) => <li key={i}>{ans}</li>)
                        } catch {
                          return <li>{question.typeData[0]?.correctAnswers}</li>
                        }
                      })()}
                    </ul>
                  </div>
                )}

                {question.type === 'matching' && (
                  <div>
                    <p className="font-medium">Pairs:</p>
                    <ul className="mt-1 space-y-1 ml-4">
                      {question.typeData.map((pair: any, i: number) => (
                        <li key={i}>
                          {pair.leftText} ↔ {pair.rightText}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
