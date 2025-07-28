'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Palette } from 'lucide-react'

export function ThemeGenerator() {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateTheme = async () => {
    setIsGenerating(true)
    // This will be connected to the AI flow later
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGenerateTheme}
      disabled={isGenerating}
    >
      <Palette className="h-4 w-4 mr-2" />
      {isGenerating ? 'Generating...' : 'AI Theme'}
    </Button>
  )
}