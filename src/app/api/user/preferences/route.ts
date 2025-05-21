import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

type UserPreferences = {
    emailNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
    darkMode: boolean
    language: string
    currency: string
}

const defaultPreferences: UserPreferences = {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    darkMode: false,
    language: 'en',
    currency: 'USD'
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Parse the JSON string if it exists, otherwise return default preferences
        const preferences = user.preferences ? (user.preferences as unknown as UserPreferences) : defaultPreferences

        return NextResponse.json(preferences)
    } catch (error) {
        console.error('Error fetching user preferences:', error)
        return NextResponse.json(
            { error: 'Failed to fetch preferences' },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const preferences = await request.json() as UserPreferences

        // Validate preferences object
        const requiredFields = ['emailNotifications', 'smsNotifications', 'marketingEmails', 'darkMode', 'language', 'currency'] as const
        for (const field of requiredFields) {
            if (preferences[field] === undefined) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                )
            }
        }

        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: {
                preferences: preferences as any
            }
        })

        return NextResponse.json(user.preferences as unknown as UserPreferences)
    } catch (error) {
        console.error('Error updating user preferences:', error)
        return NextResponse.json(
            { error: 'Failed to update preferences' },
            { status: 500 }
        )
    }
} 