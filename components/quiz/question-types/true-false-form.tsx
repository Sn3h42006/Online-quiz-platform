'use client'

import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface TrueFalseQuestionFormProps {
  answer: boolean
  setAnswer: (answer: boolean) => void
}

export default function TrueFalseQuestionForm({ answer, setAnswer }: TrueFalseQuestionFormProps) {
  return (
    <div className="space-y-4">
      <Label>Correct Answer</Label>
      <RadioGroup value={String(answer)} onValueChange={(v) => setAnswer(v === 'true')}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="true" id="true" />
          <Label htmlFor="true" className="font-normal cursor-pointer">
            True
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="false" id="false" />
          <Label htmlFor="false" className="font-normal cursor-pointer">
            False
          </Label>
        </div>
      </RadioGroup>
    </div>
  )
}
