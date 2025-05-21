import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { searchParams } = new URL(request.url)
        const startDate = searchParams.get('startDate')
        const endDate = searchParams.get('endDate')

        if (!startDate || !endDate) {
            return NextResponse.json(
                { error: 'Start date and end date are required' },
                { status: 400 }
            )
        }

        // Get all rooms for the hotel
        const rooms = await prisma.room.findMany({
            where: {
                hotelId: params.id
            }
        })

        // Get all bookings that overlap with the requested dates
        const overlappingBookings = await prisma.booking.findMany({
            where: {
                roomId: {
                    in: rooms.map((room) => room.id)
                },
                OR: [
                    {
                        // Booking starts during the requested period
                        startDate: {
                            lte: new Date(endDate),
                            gte: new Date(startDate)
                        }
                    },
                    {
                        // Booking ends during the requested period
                        endDate: {
                            lte: new Date(endDate),
                            gte: new Date(startDate)
                        }
                    },
                    {
                        // Booking spans the entire requested period
                        AND: [
                            { startDate: { lte: new Date(startDate) } },
                            { endDate: { gte: new Date(endDate) } }
                        ]
                    }
                ]
            }
        })

        // Filter out rooms that have overlapping bookings
        const bookedRoomIds = new Set(overlappingBookings.map((booking) => booking.roomId))
        const availableRooms = rooms.filter((room) => !bookedRoomIds.has(room.id))

        return NextResponse.json({ rooms: availableRooms })
    } catch (error) {
        console.error('Error checking availability:', error)
        return NextResponse.json(
            { error: 'Failed to check room availability' },
            { status: 500 }
        )
    }
} 