import { Handler } from '@netlify/functions'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

// Mock user database - replace with your actual database
const mockUsers = [
  {
    id: '1',
    email: 'demo@usdfinancial.com',
    name: 'Demo User',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewRnKTPGmL/5TqT2', // 'demo123'
    image: null,
    createdAt: new Date(),
  }
]

const authHandler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Find user in mock database
        const user = mockUsers.find(u => u.email === credentials.email)
        
        if (!user) {
          return null
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(credentials.password, user.password)
        
        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        }
      }
    })
  ],
  
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
  
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  secret: process.env.NEXTAUTH_SECRET,
})

const handler: Handler = async (event, context) => {
  // Handle NextAuth requests
  const url = new URL(event.rawUrl)
  const pathname = url.pathname.replace('/.netlify/functions/auth', '')
  
  // Create a mock request for NextAuth
  const request = new Request(`${url.origin}/api/auth${pathname}${url.search}`, {
    method: event.httpMethod,
    headers: event.headers as any,
    body: event.body || undefined,
  })

  try {
    const response = await authHandler(request)
    
    const body = await response.text()
    
    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body
    }
  } catch (error) {
    console.error('Auth error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}

export { handler }