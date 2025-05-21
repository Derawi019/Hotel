import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

// GET /api/wishlist - Get user's wishlist
export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                wishlist: {
                    include: {
                        hotel: true
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json(user.wishlist)
    } catch (error) {
        console.error('Error fetching wishlist:', error)
        return NextResponse.json(
            { error: 'Error fetching wishlist' },
            { status: 500 }
        )
    }
}

// POST /api/wishlist - Add hotel to wishlist
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { hotelId } = await req.json()

        if (!hotelId) {
            return NextResponse.json(
                { error: 'Hotel ID is required' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Check if hotel exists
        const hotel = await prisma.hotel.findUnique({
            where: { id: hotelId }
        })

        if (!hotel) {
            return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
        }

        // Add hotel to wishlist
        await prisma.user.update({
            where: { id: user.id },
            data: {
                wishlist: {
                    connect: { id: hotelId }
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error adding to wishlist:', error)
        return NextResponse.json(
            { error: 'Error adding to wishlist' },
            { status: 500 }
        )
    }
}

// DELETE /api/wishlist - Remove hotel from wishlist
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { hotelId } = await req.json()

        if (!hotelId) {
            return NextResponse.json(
                { error: 'Hotel ID is required' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Remove hotel from wishlist
        await prisma.user.update({
            where: { id: user.id },
            data: {
                wishlist: {
                    disconnect: { id: hotelId }
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error removing from wishlist:', error)
        return NextResponse.json(
            { error: 'Error removing from wishlist' },
            { status: 500 }
        )
    }
} 