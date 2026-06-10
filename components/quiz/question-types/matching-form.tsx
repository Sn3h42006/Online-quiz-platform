'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

interface Pair {
  left: string
  right: string
}

interface MatchingQuestionFormProps {
  pairs: Pair[]
  setPairs: (pairs: Pair[]) => void
  isLoading: boolean
}

export default function MatchingQuestionForm({ pairs, setPairs, isLoading }: MatchingQuestionFormProps) {
  const handlePairChange = (index: number, side: 'left' | 'right', value: string) => {
    const updated = [...pairs]
    updated[index][side] = value
    setPairs(updated)
  }

  const handleAddPair = () => {
    setPairs([...pairs, { left: '', right: '' }])
  }

  const handleRemovePair = (index: number) => {
    if (pairs.length > 1) {
      setPairs(pairs.filter((_, i) => i !== index))
    }
  }

  return (
    <div className="space-y-4">
      <Label>Matching Pairs</Label>
      <div className="space-y-3">
        {pairs.map((pair, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder="Left item"
              value={pair.left}
              onChange={(e) => handlePairChange(index, 'left', e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            <span className="text-muted-foreground">↔</span>
            <Input
              placeholder="Right item"
              value={pair.right}
              onChange={(e) => handlePairChange(index, 'right', e.target.value)}
              disabled={isLoading}
              className="flex-1"
            />
            {pairs.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleRemovePair(index)}
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
        onClick={handleAddPair}
        disabled={isLoading || pairs.length >= 10}
        className="w-full"
      >
        Add Pair
      </Button>
    </div>
  )
}
