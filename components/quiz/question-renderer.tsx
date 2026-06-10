'use client'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'

interface QuestionRendererProps {
  question: any
  answer: string
  onAnswer: (answer: string) => void
}

export default function QuestionRenderer({
  question,
  answer,
  onAnswer,
}: QuestionRendererProps) {
  switch (question.type) {
    case 'mcq':
      return (
        <div className="space-y-4">
          <RadioGroup value={answer} onValueChange={onAnswer}>
            {question.options.map((option: any) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )

    case 'true_false':
      return (
        <div className="space-y-4">
          <RadioGroup value={answer} onValueChange={onAnswer}>
            {[
              { id: 'true', label: 'True' },
              { id: 'false', label: 'False' },
            ].map((option) => (
              <div
                key={option.id}
                className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
              >
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="flex-1 cursor-pointer text-lg font-medium">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      )

    case 'short_answer':
      return (
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Enter your answer..."
            value={answer}
            onChange={(e) => onAnswer(e.target.value)}
            className="p-3 text-base"
          />
          <p className="text-sm text-muted-foreground">
            Your answer is case-insensitive and will be compared against accepted answers.
          </p>
        </div>
      )

    case 'matching':
      return (
        <div className="space-y-4">
          {question.pairs.map((pair: any, index: number) => (
            <div key={pair.id} className="border rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4 items-center">
                <div className="font-medium">{pair.leftText}</div>
                <Input
                  type="text"
                  placeholder="Match with..."
                  value={answer ? (answer.split('|')[index] || '') : ''}
                  onChange={(e) => {
                    const parts = answer ? answer.split('|') : []
                    parts[index] = e.target.value
                    onAnswer(parts.join('|'))
                  }}
                  className="p-2 text-sm"
                />
              </div>
            </div>
          ))}
          <p className="text-sm text-muted-foreground">
            Match each item on the left with the correct item on the right.
          </p>
        </div>
      )

    default:
      return <div>Unknown question type</div>
  }
}
