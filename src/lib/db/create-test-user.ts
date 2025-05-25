import { db } from './index'
import { users } from './schema'
import { v4 as uuidv4 } from 'uuid'

async function createTestUser() {
    try {
        console.log('Creating test user...')

        const testUser = {
            id: uuidv4(),
            name: 'Test User',
            email: 'test@example.com',
            imageUrl: null
        }

        const result = await db.insert(users)
            .values(testUser)
            .returning()

        console.log('Test user created:', result)
    } catch (error) {
        console.error('Error creating test user:', error)
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            })
        }
    }
}

createTestUser() 