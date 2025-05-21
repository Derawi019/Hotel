import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        const hotels = await prisma.hotel.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                price: true,
                image: true,
                location: true,
            },
        })

        return NextResponse.json(hotels)
    } catch (error) {
        console.error('Error fetching hotels:', error)
        return NextResponse.json(
            { error: 'Error fetching hotels' },
            { status: 500 }
        )
    }
} 