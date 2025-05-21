import { NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/auth'

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json()

        if (!email || !password || !name) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Check if user already exists
        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 400 }
            )
        }

        // Create new user
        const user = await createUser(email, password, name)

        return NextResponse.json(
            { message: 'User created successfully', user: { id: user.id, email: user.email, name: user.name } },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { error: 'Error creating user' },
            { status: 500 }
        )
    }
} 