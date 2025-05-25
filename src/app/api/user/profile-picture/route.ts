import { NextResponse } from 'next/server'
import { writeFile, mkdir, access } from 'fs/promises'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'
import { db } from '@/lib/db/index'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export const runtime = 'nodejs'

export async function POST(request: Request) {
    try {
        console.log('Starting profile picture upload process...')

        const session = await getServerSession(authOptions)
        console.log('Session:', session ? 'Found' : 'Not found')

        if (!session?.user?.email) {
            console.error('No authenticated user found')
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        console.log('Processing upload for user:', session.user.email)

        // Check if user exists in database
        try {
            console.log('Checking if user exists in database...')
            const existingUser = await db.select()
                .from(users)
                .where(eq(users.email, session.user.email))
                .limit(1)

            console.log('Existing user check result:', existingUser)

            if (!existingUser || existingUser.length === 0) {
                console.error('User not found in database:', session.user.email)
                return NextResponse.json({ error: 'User not found' }, { status: 404 })
            }
        } catch (dbError) {
            console.error('Database error checking user:', dbError)
            if (dbError instanceof Error) {
                console.error('Error details:', {
                    message: dbError.message,
                    stack: dbError.stack
                })
            }
            return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        const formData = await request.formData()
        console.log('FormData received:', formData.has('image') ? 'Has image' : 'No image')

        const file = formData.get('image') as File
        if (!file) {
            console.error('No file uploaded')
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        }

        console.log('File details:', {
            name: file.name,
            type: file.type,
            size: file.size
        })

        try {
            const buffer = Buffer.from(await file.arrayBuffer())
            console.log('File converted to buffer, size:', buffer.length)

            const ext = file.name.split('.').pop() || 'png'
            const filename = `${uuidv4()}.${ext}`
            const uploadDir = path.join(process.cwd(), 'public', 'uploads')
            const filePath = path.join(uploadDir, filename)

            console.log('Paths:', {
                uploadDir,
                filePath,
                filename
            })

            // Create uploads directory if it doesn't exist
            try {
                await mkdir(uploadDir, { recursive: true })
                console.log('Upload directory created/verified')
            } catch (mkdirError) {
                console.error('Error creating upload directory:', mkdirError)
                return NextResponse.json({ error: 'Failed to create upload directory' }, { status: 500 })
            }

            // Check if we can write to the directory
            try {
                await access(uploadDir, 2)
                console.log('Write permission verified')
            } catch (accessError) {
                console.error('No write permission to upload directory:', accessError)
                return NextResponse.json({ error: 'No write permission to upload directory' }, { status: 500 })
            }

            // Save the file
            try {
                await writeFile(filePath, buffer)
                console.log('File saved successfully:', filename)
            } catch (writeError) {
                console.error('Error saving file:', writeError)
                return NextResponse.json({ error: 'Failed to save file' }, { status: 500 })
            }

            const url = `/uploads/${filename}`
            console.log('Generated URL:', url)

            // Update user's profile picture URL in database
            try {
                console.log('Updating user profile picture URL in database...')
                const result = await db.update(users)
                    .set({
                        imageUrl: url,
                        updatedAt: new Date()
                    })
                    .where(eq(users.email, session.user.email))
                    .returning()

                console.log('Database update result:', result)

                if (!result || result.length === 0) {
                    console.error('Failed to update user:', session.user.email)
                    return NextResponse.json({ error: 'Failed to update profile picture' }, { status: 500 })
                }

                // Verify the update
                const verifyUser = await db.select()
                    .from(users)
                    .where(eq(users.email, session.user.email))
                    .limit(1)
                console.log('Verification - User data after update:', verifyUser)

                console.log('Database updated successfully for user:', session.user.email)
                return NextResponse.json({ url })
            } catch (dbError) {
                console.error('Database update error:', dbError)
                if (dbError instanceof Error) {
                    console.error('Error details:', {
                        message: dbError.message,
                        stack: dbError.stack
                    })
                }
                return NextResponse.json({ error: 'Failed to update profile picture URL' }, { status: 500 })
            }
        } catch (error) {
            console.error('Error processing file:', error)
            if (error instanceof Error) {
                console.error('Error details:', {
                    message: error.message,
                    stack: error.stack
                })
            }
            return NextResponse.json({ error: 'Error processing file' }, { status: 500 })
        }
    } catch (error) {
        console.error('Error in profile picture upload:', error)
        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            })
        }
        return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }
} 