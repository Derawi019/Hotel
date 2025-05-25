import { access, mkdir, writeFile, readdir } from 'fs/promises'
import path from 'path'

async function testDirectoryPermissions() {
    try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        console.log('Testing permissions for directory:', uploadDir)

        // Test 1: Check if directory exists
        try {
            await access(uploadDir)
            console.log('✅ Directory exists')
        } catch {
            console.log('❌ Directory does not exist, attempting to create...')
            try {
                await mkdir(uploadDir, { recursive: true })
                console.log('✅ Directory created successfully')
            } catch (mkdirError) {
                console.error('❌ Failed to create directory:', mkdirError)
                return
            }
        }

        // Test 2: Check read permission
        try {
            await access(uploadDir, 4) // 4 is the read permission flag
            console.log('✅ Read permission verified')
        } catch {
            console.error('❌ No read permission')
            return
        }

        // Test 3: Check write permission
        try {
            await access(uploadDir, 2) // 2 is the write permission flag
            console.log('✅ Write permission verified')
        } catch {
            console.error('❌ No write permission')
            return
        }

        // Test 4: Try to list directory contents
        try {
            const files = await readdir(uploadDir)
            console.log('✅ Can list directory contents:', files)
        } catch (readError) {
            console.error('❌ Cannot list directory contents:', readError)
            return
        }

        // Test 5: Try to create a test file
        const testFile = path.join(uploadDir, 'test-permissions.txt')
        try {
            await writeFile(testFile, 'Test file content')
            console.log('✅ Can create files')

            // Clean up test file
            await writeFile(testFile, '')
            console.log('✅ Can modify files')
        } catch (writeError) {
            console.error('❌ Cannot write to directory:', writeError)
            return
        }

        console.log('\n✅ All permission tests passed!')
    } catch (error) {
        console.error('Error testing permissions:', error)
    }
}

testDirectoryPermissions() 