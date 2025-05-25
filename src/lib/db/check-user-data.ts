import { db } from './index'
import { users } from './schema'
import { sql } from 'drizzle-orm'

async function checkUserData() {
    try {
        console.log('Checking user data in database...')

        // Get all users with detailed info
        const allUsers = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            imageUrl: users.imageUrl,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
        }).from(users)
        console.log('\nAll users:', JSON.stringify(allUsers, null, 2))

        // Check specific user with detailed info
        const specificUser = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            imageUrl: users.imageUrl,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt
        })
            .from(users)
            .where(sql`email = 'drdr06801@gmail.com'`)
            .limit(1)
        console.log('\nSpecific user:', JSON.stringify(specificUser, null, 2))

        // Check if the uploads directory exists and list its contents
        const fs = require('fs')
        const path = require('path')
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

        if (fs.existsSync(uploadsDir)) {
            console.log('\nUploads directory exists')
            const files = fs.readdirSync(uploadsDir)
            console.log('Files in uploads directory:', files)
        } else {
            console.log('\nUploads directory does not exist')
        }

    } catch (error) {
        console.error('Error checking user data:', error)
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            })
        }
    }
}

checkUserData() 