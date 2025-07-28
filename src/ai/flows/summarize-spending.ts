import { defineFlow, runFlow } from '@genkit-ai/core'
import { googleAI, gemini15Flash } from '@genkit-ai/googleai'
import { z } from 'zod'

export const SummarizeSpendingInputSchema = z.object({
  spendingData: z.string().describe('JSON string of user spending data')
})

export const SummarizeSpendingOutputSchema = z.object({
  summary: z.string().describe('Concise, actionable spending summary')
})

export type SummarizeSpendingInput = z.infer<typeof SummarizeSpendingInputSchema>
export type SummarizeSpendingOutput = z.infer<typeof SummarizeSpendingOutputSchema>

export const summarizeSpendingFlow = defineFlow(
  {
    name: 'summarizeSpending',
    inputSchema: SummarizeSpendingInputSchema,
    outputSchema: SummarizeSpendingOutputSchema,
  },
  async (input: SummarizeSpendingInput): Promise<SummarizeSpendingOutput> => {
    const prompt = `
You are a personal finance expert and advisor. Analyze the following spending data and provide a concise, actionable summary in 2-3 sentences.

Spending Data:
${input.spendingData}

Your summary should:
- Highlight the largest spending categories
- Identify any concerning patterns or positive trends
- Provide 1-2 specific, actionable recommendations
- Be encouraging but realistic
- Use exact dollar amounts from the data
- Keep the tone professional but friendly

Focus on insights that would help the user make better financial decisions.
`

    const response = await runFlow(gemini15Flash, {
      messages: [{ role: 'user', content: prompt }],
      config: {
        temperature: 0.3,
        maxOutputTokens: 300,
      }
    })

    return {
      summary: response.text.trim()
    }
  }
)

export async function summarizeSpending(input: SummarizeSpendingInput): Promise<SummarizeSpendingOutput> {
  return runFlow(summarizeSpendingFlow, input)
}