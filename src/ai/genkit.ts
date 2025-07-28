import { configureGenkit } from '@genkit-ai/core'
import { googleAI } from '@genkit-ai/googleai'

export const ai = configureGenkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
})

export * from '@genkit-ai/core'