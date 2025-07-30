// Database connection utilities for USD Financial
// Handles Netlify DB (Neon) connections with proper pooling and error handling

import { Pool, PoolConfig, QueryResult } from 'pg'

interface DatabaseConfig {
  connectionString: string
  directUrl?: string
  maxConnections?: number
  connectionTimeout?: number
  idleTimeout?: number
  ssl?: boolean
}

interface QueryOptions {
  timeout?: number
  retries?: number
  retryDelay?: number
}

class DatabaseConnection {
  private pool: Pool | null = null
  private directPool: Pool | null = null
  private config: DatabaseConfig

  constructor(config: DatabaseConfig) {
    this.config = {
      maxConnections: 20,
      connectionTimeout: 30000,
      idleTimeout: 10000,
      ssl: true,
      ...config
    }
  }

  /**
   * Initialize database connection pool
   */
  public async initialize(): Promise<void> {
    if (this.pool) {
      return // Already initialized
    }

    const poolConfig: PoolConfig = {
      connectionString: this.config.connectionString,
      max: this.config.maxConnections,
      connectionTimeoutMillis: this.config.connectionTimeout,
      idleTimeoutMillis: this.config.idleTimeout,
      ssl: this.config.ssl ? { rejectUnauthorized: false } : false,
      application_name: 'USD_Financial_App'
    }

    this.pool = new Pool(poolConfig)

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Database pool error:', err)
    })

    // Initialize direct connection pool if URL provided (for migrations)
    if (this.config.directUrl) {
      this.directPool = new Pool({
        ...poolConfig,
        connectionString: this.config.directUrl,
        max: 5, // Fewer connections for direct pool
        application_name: 'USD_Financial_Direct'
      })

      this.directPool.on('error', (err) => {
        console.error('Direct database pool error:', err)
      })
    }

    // Test connection
    await this.testConnection()
  }

  /**
   * Test database connection
   */
  private async testConnection(): Promise<void> {
    if (!this.pool) {
      throw new Error('Database pool not initialized')
    }

    try {
      const client = await this.pool.connect()
      await client.query('SELECT 1')
      client.release()
      console.log('✅ Database connection established')
    } catch (error) {
      console.error('❌ Database connection failed:', error)
      throw error
    }
  }

  /**
   * Execute a query with automatic retry and connection management
   */
  public async query<T = any>(
    text: string, 
    params?: any[], 
    options: QueryOptions = {}
  ): Promise<QueryResult<T>> {
    if (!this.pool) {
      await this.initialize()
    }

    const { timeout = 30000, retries = 3, retryDelay = 1000 } = options
    let lastError: Error

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const client = await this.pool!.connect()
        
        try {
          // Set query timeout
          if (timeout) {
            await client.query(`SET statement_timeout = ${timeout}`)
          }

          const result = await client.query<T>(text, params)
          return result
        } finally {
          client.release()
        }
      } catch (error) {
        lastError = error as Error
        
        if (attempt === retries) {
          console.error(`Query failed after ${retries} attempts:`, {
            query: text.substring(0, 100) + '...',
            error: error.message,
            attempt
          })
          break
        }

        // Wait before retry
        if (retryDelay && attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt))
        }
      }
    }

    throw lastError!
  }

  /**
   * Execute a query using direct connection (for migrations)
   */
  public async directQuery<T = any>(
    text: string, 
    params?: any[]
  ): Promise<QueryResult<T>> {
    if (!this.directPool) {
      throw new Error('Direct database connection not configured')
    }

    const client = await this.directPool.connect()
    try {
      return await client.query<T>(text, params)
    } finally {
      client.release()
    }
  }

  /**
   * Execute multiple queries in a transaction
   */
  public async transaction<T>(
    queries: Array<{ text: string; params?: any[] }>,
    options: QueryOptions = {}
  ): Promise<T[]> {
    if (!this.pool) {
      await this.initialize()
    }

    const client = await this.pool.connect()
    const results: T[] = []

    try {
      await client.query('BEGIN')

      for (const query of queries) {
        const result = await client.query<T>(query.text, query.params)
        results.push(result.rows as T)
      }

      await client.query('COMMIT')
      return results
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  }

  /**
   * Get a client for manual transaction management
   */
  public async getClient() {
    if (!this.pool) {
      await this.initialize()
    }
    return await this.pool.connect()
  }

  /**
   * Get connection pool stats
   */
  public getPoolStats() {
    if (!this.pool) {
      return null
    }

    return {
      totalCount: this.pool.totalCount,
      idleCount: this.pool.idleCount,
      waitingCount: this.pool.waitingCount
    }
  }

  /**
   * Close all connections
   */
  public async close(): Promise<void> {
    const promises = []
    
    if (this.pool) {
      promises.push(this.pool.end())
      this.pool = null
    }

    if (this.directPool) {
      promises.push(this.directPool.end())
      this.directPool = null
    }

    await Promise.all(promises)
    console.log('📪 Database connections closed')
  }

  /**
   * Health check for monitoring
   */
  public async healthCheck(): Promise<{
    status: 'healthy' | 'unhealthy'
    timestamp: string
    poolStats?: any
    latency?: number
  }> {
    try {
      const start = Date.now()
      await this.query('SELECT 1')
      const latency = Date.now() - start

      return {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        poolStats: this.getPoolStats(),
        latency
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString()
      }
    }
  }
}

// Create singleton instance
let dbInstance: DatabaseConnection | null = null

/**
 * Get database instance with configuration from environment
 */
export function getDatabase(): DatabaseConnection {
  if (!dbInstance) {
    const config: DatabaseConfig = {
      connectionString: process.env.DATABASE_URL!,
      directUrl: process.env.DIRECT_URL,
      maxConnections: parseInt(process.env.DATABASE_MAX_CONNECTIONS || '20'),
      connectionTimeout: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '30000'),
      ssl: process.env.NODE_ENV === 'production'
    }

    if (!config.connectionString) {
      throw new Error('DATABASE_URL environment variable is required')
    }

    dbInstance = new DatabaseConnection(config)
  }

  return dbInstance
}

/**
 * Convenience function for simple queries
 */
export async function query<T = any>(
  text: string, 
  params?: any[],
  options?: QueryOptions
): Promise<QueryResult<T>> {
  const db = getDatabase()
  return await db.query<T>(text, params, options)
}

/**
 * Convenience function for transactions
 */
export async function transaction<T>(
  queries: Array<{ text: string; params?: any[] }>
): Promise<T[]> {
  const db = getDatabase()
  return await db.transaction<T>(queries)
}

/**
 * Database health check endpoint
 */
export async function healthCheck() {
  const db = getDatabase()
  return await db.healthCheck()
}

// Export the connection class for advanced usage
export { DatabaseConnection }
export type { DatabaseConfig, QueryOptions }