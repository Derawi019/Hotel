import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'
import { sql } from 'drizzle-orm'
import * as schema from './schema'

// Create PostgreSQL connection
const connectionString = process.env.DATABASE_URL
if (!connectionString) {
    throw new Error('DATABASE_URL is not defined')
}

const client = postgres(connectionString)
const db = drizzle(client, { schema })

async function main() {
    try {
        console.log('Starting database migration...')

        // Create users table if it doesn't exist
        await db.execute(sql`
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                name TEXT,
                email TEXT UNIQUE,
                image TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `)

        // Check if image_url column exists and rename it to image if it does
        await db.execute(sql`
            DO $$
            BEGIN
                IF EXISTS (
                    SELECT 1
                    FROM information_schema.columns
                    WHERE table_name = 'users'
                    AND column_name = 'image_url'
                ) THEN
                    ALTER TABLE users RENAME COLUMN image_url TO image;
                END IF;
            END $$;
        `);

        console.log('Migration completed successfully!')
    } catch (error) {
        console.error('Migration failed:', error)
    } finally {
        await client.end()
    }
}

main() 