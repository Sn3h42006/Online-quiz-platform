'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import {
  addQuestion,
  addMcqOption,
  setTrueFalseAnswer,
  setShortAnswerAnswers,
  addMatchingPair,
} from '@/app/actions/quizzes'
import McqQuestionForm from './question-types/mcq-form'
import TrueFalseQuestionForm from './question-types/true-false-form'
import ShortAnswerQuestionForm from './question-types/short-answer-form'
import MatchingQuestionForm from './question-types/matching-form'

interface QuestionFormProps {
  quizId: string
  onSuccess: (question: any) => void
}

export default function QuestionForm({ quizId, onSuccess }: QuestionFormProps) {
  const [type, setType] = useState<'mcq' | 'true_false' | 'short_answer' | 'matching'>('mcq')
  const [text, setText] = useState('')
  const [explanation, setExplanation] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Type-specific state
  const [mcqOptions, setMcqOptions] = useState<Array<{ text: string; isCorrect: boolean }>>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ])
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean>(true)
  const [shortAnswers, setShortAnswers] = useState<string[]>([''])
  const [matchingPairs, setMatchingPairs] = useState<Array<{ left: string; right: string }>>([
    { left: '', right: '' },
  ])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!text.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter the question text',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)

    try {
      // Create the main question
      const questionId = await addQuestion(quizId, {
        type,
        text,
        explanation: explanation || undefined,
      })

      // Add type-specific data
      if (type === 'mcq') {
        const hasCorrect = mcqOptions.some((o) => o.isCorrect)
        if (!hasCorrect) {
          toast({
            title: 'Error',
            description: 'At least one option must be marked as correct',
            variant: 'destructive',
          })
          setIsLoading(false)
          return
        }

        for (const option of mcqOptions) {
          if (option.text.trim()) {
            await addMcqOption(questionId, option)
          }
        }
      } else if (type === 'true_false') {
        await setTrueFalseAnswer(questionId, trueFalseAnswer)
      } else if (type === 'short_answer') {
        const answers = shortAnswers.filter((a) => a.trim())
        if (answers.length === 0) {
          toast({
            title: 'Error',
            description: 'Please add at least one correct answer',
            variant: 'destructive',
          })
          setIsLoading(false)
          return
        }
        await setShortAnswerAnswers(questionId, answers)
      } else if (type === 'matching') {
        for (const pair of matchingPairs) {
          if (pair.left.trim() && pair.right.trim()) {
            await addMatchingPair(questionId, {
              leftText: pair.left,
              rightText: pair.right,
            })
          }
        }
      }

      toast({
        title: 'Success',
        description: 'Question created!',
      })

      // Reset form
      setText('')
      setExplanation('')
      setMcqOptions([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ])
      setTrueFalseAnswer(true)
      setShortAnswers([''])
      setMatchingPairs([{ left: '', right: '' }])

      onSuccess({
        id: questionId,
        type,
        text,
        explanation,
        orderIndex: 0,
      })
    } catch (error) {
      console.error(error)
      toast({
        title: 'Error',
        description: 'Failed to create question',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a New Question</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="type">Question Type</Label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mcq">Multiple Choice</SelectItem>
                <SelectItem value="true_false">True/False</SelectItem>
                <SelectItem value="short_answer">Short Answer</SelectItem>
                <SelectItem value="matching">Matching</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label htmlFor="text">Question Text *</Label>
            <Textarea
              id="text"
              placeholder="Enter your question..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* Explanation */}
          <div className="space-y-2">
            <Label htmlFor="explanation">Explanation (Optional)</Label>
            <Textarea
              id="explanation"
              placeholder="Explain the correct answer..."
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              disabled={isLoading}
              rows={2}
            />
          </div>

          {/* Type-Specific Forms */}
          {type === 'mcq' && (
            <McqQuestionForm options={mcqOptions} setOptions={setMcqOptions} isLoading={isLoading} />
          )}

          {type === 'true_false' && (
            <TrueFalseQuestionForm answer={trueFalseAnswer} setAnswer={setTrueFalseAnswer} />
          )}

          {type === 'short_answer' && (
            <ShortAnswerQuestionForm answers={shortAnswers} setAnswers={setShortAnswers} isLoading={isLoading} />
          )}

          {type === 'matching' && (
            <MatchingQuestionForm pairs={matchingPairs} setPairs={setMatchingPairs} isLoading={isLoading} />
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating...' : 'Add Question'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
