'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { X } from 'lucide-react'

interface Option {
  text: string
  isCorrect: boolean
}

interface McqQuestionFormProps {
  options: Option[]
  setOptions: (options: Option[]) => void
  isLoading: boolean
}

export default function McqQuestionForm({ options, setOptions, isLoading }: McqQuestionFormProps) {
  const handleOptionChange = (index: number, text: string) => {
    const updated = [...options]
    updated[index].text = text
    setOptions(updated)
  }

  const handleSetCorrect = (index: number) => {
    const updated = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index,
    }))
    setOptions(updated)
  }

  const handleAddOption = () => {
    setOptions([...options, { text: '', isCorrect: false }])
  }

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="space-y-4">
      <Label>Options</Label>
      <RadioGroup value={String(options.findIndex((o) => o.isCorrect))}>
        <div className="space-y-3">
          {options.map((option, index) => (
            <div key={index} className="flex items-center gap-2">
              <RadioGroupItem
                value={String(index)}
                id={`option-${index}`}
                onClick={() => handleSetCorrect(index)}
                disabled={isLoading}
              />
              <Input
                id={`option-${index}`}
                placeholder={`Option ${index + 1}`}
                value={option.text}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                disabled={isLoading}
                className="flex-1"
              />
              {options.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveOption(index)}
                  disabled={isLoading}
                  className="px-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </RadioGroup>

      <Button
        type="button"
        variant="outline"
        onClick={handleAddOption}
        disabled={isLoading || options.length >= 6}
        className="w-full"
      >
        Add Option
      </Button>
    </div>
  )
}
