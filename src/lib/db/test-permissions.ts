import { db } from './index'
import { users } from './schema'
import { eq } from 'drizzle-orm'

async function testPermissions() {
    try {
        console.log('Testing database permissions...')

        // Test SELECT permission
        console.log('\nTesting SELECT permission...')
        const selectResult = await db.select().from(users).limit(1)
        console.log('SELECT test passed:', selectResult)

        // Test INSERT permission
        console.log('\nTesting INSERT permission...')
        const testUser = {
            id: 'test-' + Date.now(),
            name: 'Test User',
            email: 'test@example.com',
            imageUrl: null
        }
        const insertResult = await db.insert(users).values(testUser).returning()
        console.log('INSERT test passed:', insertResult)

        // Test UPDATE permission
        console.log('\nTesting UPDATE permission...')
        const updateResult = await db.update(users)
            .set({ name: 'Updated Test User' })
            .where(eq(users.id, testUser.id))
            .returning()
        console.log('UPDATE test passed:', updateResult)

        // Test DELETE permission
        console.log('\nTesting DELETE permission...')
        const deleteResult = await db.delete(users)
            .where(eq(users.id, testUser.id))
            .returning()
        console.log('DELETE test passed:', deleteResult)

        console.log('\nAll permission tests passed successfully!')
    } catch (error) {
        console.error('Permission test failed:', error)
        if (error instanceof Error) {
            console.error('Error message:', error.message)
            console.error('Error stack:', error.stack)
        }
    }
}

testPermissions() 