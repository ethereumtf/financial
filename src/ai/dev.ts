import { startFlowsServer } from '@genkit-ai/core'
import './genkit'
import './flows/generate-theme'
import './flows/summarize-spending'
import './flows/personalized-investment-recommendations'

// Start the Genkit development server
startFlowsServer({
  port: 3400,
})