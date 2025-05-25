import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
    request: Request,
    { params }: { params: { roomId: string } }
) {
    try {
        const { searchParams } = new URL(request.url)
        const hotelId = searchParams.get('hotelId')

        if (!hotelId) {
            return NextResponse.json(
                { error: 'Hotel ID is required' },
                { status: 400 }
            )
        }

        const room = await prisma.room.findFirst({
            where: {
                id: params.roomId,
                hotelId: hotelId
            },
            select: {
                id: true,
                type: true,
                price: true,
                description: true,
                image: true,
                wifi: true,
                balcony: true,
                oceanView: true,
                cityView: true,
                minibar: true,
                airConditioning: true,
                roomService: true,
                tv: true,
                safe: true,
                hotel: {
                    select: {
                        name: true,
                        image: true,
                        location: true
                    }
                }
            }
        })

        if (!room) {
            return NextResponse.json(
                { error: 'Room not found' },
                { status: 404 }
            )
        }

        return NextResponse.json(room)
    } catch (error) {
        console.error('Error fetching room:', error)
        return NextResponse.json(
            { error: 'Failed to fetch room' },
            { status: 500 }
        )
    }
} 