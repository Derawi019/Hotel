import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        // First, get all hotels
        const hotels = await prisma.hotel.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                image: true,
                location: true,
            },
            orderBy: {
                createdAt: 'desc' // Get the most recently created hotels first
            }
        })

        // Remove duplicates by keeping only the first occurrence of each hotel name
        const uniqueHotels = hotels.reduce((acc, current) => {
            const x = acc.find(item => item.name.toLowerCase() === current.name.toLowerCase())
            if (!x) {
                return acc.concat([current])
            } else {
                return acc
            }
        }, [] as typeof hotels)

        return NextResponse.json(uniqueHotels)
    } catch (error) {
        console.error('Error fetching hotels:', error)
        return NextResponse.json(
            { error: 'Error fetching hotels' },
            { status: 500 }
        )
    }
} 