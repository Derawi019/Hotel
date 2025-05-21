import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import WaitingList from '@/models/WaitingList'
import { connectToDatabase } from '@/lib/mongodb'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { propertyId, checkIn, checkOut } = await req.json()

        await connectToDatabase()

        // Check if user is already on the waiting list for these dates
        const existingEntry = await WaitingList.findOne({
            propertyId,
            userId: session.user.id,
            checkIn,
            checkOut,
            status: { $in: ['pending', 'notified'] },
        })

        if (existingEntry) {
            return NextResponse.json(
                { error: 'You are already on the waiting list for these dates' },
                { status: 400 }
            )
        }

        // Create new waiting list entry
        const waitingListEntry = await WaitingList.create({
            propertyId,
            userId: session.user.id,
            checkIn,
            checkOut,
            status: 'pending',
        })

        return NextResponse.json(waitingListEntry)
    } catch (error) {
        console.error('Error adding to waiting list:', error)
        return NextResponse.json(
            { error: 'Failed to add to waiting list' },
            { status: 500 }
        )
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const propertyId = searchParams.get('propertyId')

        await connectToDatabase()

        const query = { userId: session.user.id }
        if (propertyId) {
            query.propertyId = propertyId
        }

        const waitingListEntries = await WaitingList.find(query)
            .populate('propertyId', 'name images')
            .sort({ createdAt: -1 })

        return NextResponse.json(waitingListEntries)
    } catch (error) {
        console.error('Error fetching waiting list:', error)
        return NextResponse.json(
            { error: 'Failed to fetch waiting list' },
            { status: 500 }
        )
    }
} 