import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'
import { eq } from 'drizzle-orm'

// Create PostgreSQL connection
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
    throw new Error('DATABASE_URL is not defined')
}

// Configure postgres client with connection pooling and retry options
const client = postgres(connectionString, {
    max: 10, // Maximum number of connections
    idle_timeout: 20, // Idle connection timeout in seconds
    connect_timeout: 10, // Connection timeout in seconds
    onnotice: () => { }, // Suppress notice messages
    onparameter: () => { }, // Suppress parameter messages
    debug: (connection, query, parameters) => {
        console.log('Database query:', { query, parameters })
    }
})

// Create drizzle instance
const db = drizzle(client, { schema })

console.log('PostgreSQL database connection initialized')

// Helper function to check if a user exists
async function userExists(email: string) {
    try {
        const result = await db.select()
            .from(schema.users)
            .where(eq(schema.users.email, email))
            .limit(1)
        return result.length > 0
    } catch (error) {
        console.error('Error checking user existence:', error)
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            })
        }
        return false
    }
}

// Export both db and userExists
export { db, userExists } 