'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

interface ShortAnswerQuestionFormProps {
  answers: string[]
  setAnswers: (answers: string[]) => void
  isLoading: boolean
}

export default function ShortAnswerQuestionForm({
  answers,
  setAnswers,
  isLoading,
}: ShortAnswerQuestionFormProps) {
  const handleAnswerChange = (index: number, value: string) => {
    const updated = [...answers]
    updated[index] = value
    setAnswers(updated)
  }

  const handleAddAnswer = () => {
    setAnswers([...answers, ''])
  }

  const handleRemoveAnswer = (index: number) => {
    if (answers.length > 1) {
      setAnswers(answers.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="space-y-4">
      <Label>Correct Answers (accept any of these)</Label>
      <div className="space-y-2">
        {answers.map((answer, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder={`Answer ${index + 1}`}
              value={answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            {answers.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveAnswer(index)}
                disabled={isLoading}
                className="px-2"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddAnswer}
        disabled={isLoading}
        className="w-full"
      >
        Add Another Answer
      </Button>
    </div>
  )
}
