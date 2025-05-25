import { db } from './index'
import { sql } from 'drizzle-orm'

async function verifySchema() {
    try {
        console.log('Verifying database schema...')

        // Check users table structure
        console.log('\nChecking users table structure:')
        const tableInfo = await db.execute(sql`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND table_name = 'users'
            ORDER BY ordinal_position;
        `)
        console.log('Users table columns:', tableInfo)

        // Check if image_url column exists
        console.log('\nChecking image_url column:')
        const imageUrlExists = await db.execute(sql`
            SELECT EXISTS (
                SELECT 1
                FROM information_schema.columns
                WHERE table_schema = 'public'
                AND table_name = 'users'
                AND column_name = 'image_url'
            );
        `)
        console.log('image_url column exists:', imageUrlExists)

        // Check current users data
        console.log('\nChecking current users data:')
        const users = await db.execute(sql`
            SELECT id, name, email, image_url, created_at, updated_at
            FROM users;
        `)
        console.log('Current users:', users)

    } catch (error) {
        console.error('Schema verification failed:', error)
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            })
        }
    }
}

verifySchema() 