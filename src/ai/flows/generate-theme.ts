import { defineFlow, runFlow } from '@genkit-ai/core'
import { googleAI, gemini15Flash } from '@genkit-ai/googleai'
import { z } from 'zod'

export const GenerateThemeInputSchema = z.object({
  persona: z.string().describe('User persona or style preference for the theme')
})

export const GenerateThemeOutputSchema = z.object({
  primaryColor: z.string().describe('Primary color in HSL format'),
  backgroundColor: z.string().describe('Background color in HSL format'),
  accentColor: z.string().describe('Accent color in HSL format'),
  bodyFont: z.string().describe('Google Font name for body text')
})

export type GenerateThemeInput = z.infer<typeof GenerateThemeInputSchema>
export type GenerateThemeOutput = z.infer<typeof GenerateThemeOutputSchema>

export const generateThemeFlow = defineFlow(
  {
    name: 'generateTheme',
    inputSchema: GenerateThemeInputSchema,
    outputSchema: GenerateThemeOutputSchema,
  },
  async (input: GenerateThemeInput): Promise<GenerateThemeOutput> => {
    const prompt = `
You are an expert UI/UX designer specializing in financial applications. 
Generate a sophisticated, trustworthy theme for a premium banking application based on the user's persona: "${input.persona}".

Requirements:
- Return colors in HSL format (e.g., "220 25% 15%")
- Primary color should evoke trust and professionalism (prefer cool blues, deep navy)
- Background should be light and clean (light grays, off-whites)
- Accent color should be harmonious and calming (greens, teals)
- Font should be from Google Fonts and readable for financial data
- Theme should feel premium, trustworthy, and modern

Consider the persona and create colors that match their personality while maintaining the professional banking aesthetic.

Return only a valid JSON object with the four required fields.
`

    const response = await runFlow(gemini15Flash, {
      messages: [{ role: 'user', content: prompt }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    })

    try {
      const result = JSON.parse(response.text)
      return GenerateThemeOutputSchema.parse(result)
    } catch (error) {
      // Fallback theme if AI response is invalid
      return {
        primaryColor: '220 25% 15%',
        backgroundColor: '210 20% 98%',
        accentColor: '150 40% 45%',
        bodyFont: 'Inter'
      }
    }
  }
)

export async function generateTheme(input: GenerateThemeInput): Promise<GenerateThemeOutput> {
  return runFlow(generateThemeFlow, input)
}