import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('query') || ''
        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const location = searchParams.get('location') || ''

        // Build the where clause for filtering
        const where: any = {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } }
            ]
        }

        // Add location filter if provided
        if (location) {
            where.location = { contains: location, mode: 'insensitive' }
        }

        // Add price range filters if provided
        if (minPrice) {
            where.price = { ...where.price, gte: parseFloat(minPrice) }
        }
        if (maxPrice) {
            where.price = { ...where.price, lte: parseFloat(maxPrice) }
        }

        const hotels = await prisma.hotel.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(hotels)
    } catch (error) {
        console.error('Error searching hotels:', error)
        return NextResponse.json(
            { error: 'Error searching hotels' },
            { status: 500 }
        )
    }
} 