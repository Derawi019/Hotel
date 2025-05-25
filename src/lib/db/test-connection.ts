import { db } from './index'
import { users } from './schema'
import { sql } from 'drizzle-orm'

async function testConnection() {
    try {
        console.log('Testing database connection...')

        // Test 1: Basic connection
        console.log('\nTest 1: Basic connection')
        const result = await db.execute(sql`SELECT 1 as test`)
        console.log('Basic connection test result:', result)

        // Test 2: Check users table
        console.log('\nTest 2: Check users table')
        const tableExists = await db.execute(sql`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'users'
            )
        `)
        console.log('Users table exists:', tableExists)

        // Test 3: Try to select from users
        console.log('\nTest 3: Select from users')
        const usersResult = await db.select().from(users).limit(1)
        console.log('Users query result:', usersResult)

        console.log('\nAll tests completed successfully!')
    } catch (error) {
        console.error('Database test failed:', error)
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            })
        }
    }
}

testConnection() 