import { defineFlow, runFlow } from '@genkit-ai/core'
import { googleAI, gemini15Flash } from '@genkit-ai/googleai'
import { z } from 'zod'

const InvestmentRecommendationSchema = z.object({
  asset: z.string().describe('Investment asset name'),
  strategy: z.string().describe('Investment strategy description'),
  percentage: z.number().min(0).max(100).describe('Recommended portfolio percentage'),
  rationale: z.string().describe('Explanation for this recommendation')
})

export const PersonalizedInvestmentRecommendationsInputSchema = z.object({
  riskProfile: z.enum(['conservative', 'moderate', 'aggressive']).describe('User risk tolerance'),
  financialGoals: z.array(z.string()).describe('User financial goals'),
  investmentAmount: z.number().positive().describe('Amount to invest in USD'),
  pastInvestments: z.array(z.string()).describe('Previous investment experience')
})

export const PersonalizedInvestmentRecommendationsOutputSchema = z.object({
  recommendations: z.array(InvestmentRecommendationSchema),
  summary: z.string().describe('Overall investment strategy summary')
})

export type PersonalizedInvestmentRecommendationsInput = z.infer<typeof PersonalizedInvestmentRecommendationsInputSchema>
export type PersonalizedInvestmentRecommendationsOutput = z.infer<typeof PersonalizedInvestmentRecommendationsOutputSchema>

export const getPersonalizedInvestmentRecommendationsFlow = defineFlow(
  {
    name: 'getPersonalizedInvestmentRecommendations',
    inputSchema: PersonalizedInvestmentRecommendationsInputSchema,
    outputSchema: PersonalizedInvestmentRecommendationsOutputSchema,
  },
  async (input: PersonalizedInvestmentRecommendationsInput): Promise<PersonalizedInvestmentRecommendationsOutput> => {
    const prompt = `
You are an expert financial advisor. Provide personalized investment recommendations based on the user's profile.

User Profile:
- Risk Profile: ${input.riskProfile}
- Financial Goals: ${input.financialGoals.join(', ')}
- Investment Amount: $${input.investmentAmount.toLocaleString()}
- Past Investments: ${input.pastInvestments.join(', ')}

Please provide 3-5 specific investment recommendations with:
- Asset/investment name
- Strategy description
- Recommended portfolio percentage (must total 100%)
- Clear rationale for the recommendation

Consider:
- Diversification across asset classes
- Risk tolerance alignment
- Time horizon based on goals
- Current market conditions
- Cost-effectiveness

Return a valid JSON object matching the schema with an array of recommendations and an overall summary.

The response must be valid JSON only, no additional text.
`

    const response = await runFlow(gemini15Flash, {
      messages: [{ role: 'user', content: prompt }],
      config: {
        temperature: 0.4,
        maxOutputTokens: 800,
      }
    })

    try {
      const result = JSON.parse(response.text)
      return PersonalizedInvestmentRecommendationsOutputSchema.parse(result)
    } catch (error) {
      // Fallback recommendations if AI response is invalid
      return {
        recommendations: [
          {
            asset: 'S&P 500 Index Fund',
            strategy: 'Core equity holding for long-term growth',
            percentage: 60,
            rationale: 'Provides broad market exposure with low fees and consistent returns'
          },
          {
            asset: 'Bond Index Fund',
            strategy: 'Stability and income generation',
            percentage: 30,
            rationale: 'Balances portfolio risk and provides steady income'
          },
          {
            asset: 'International Developed Markets ETF',
            strategy: 'Geographic diversification',
            percentage: 10,
            rationale: 'Reduces home country bias and captures global growth'
          }
        ],
        summary: 'A balanced portfolio approach focusing on diversification and long-term growth while managing risk through multiple asset classes.'
      }
    }
  }
)

export async function getPersonalizedInvestmentRecommendations(
  input: PersonalizedInvestmentRecommendationsInput
): Promise<PersonalizedInvestmentRecommendationsOutput> {
  return runFlow(getPersonalizedInvestmentRecommendationsFlow, input)
}