import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export const dynamic = "force-dynamic";

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

        // Get all bookings for these rooms in the date range
        const bookings = await prisma.booking.findMany({
            where: {
                OR: [
                    {
                        // Booking starts during the requested period
                        checkIn: {
                            lte: new Date(endDate),
                            gte: new Date(startDate)
                        }
                    },
                    {
                        // Booking ends during the requested period
                        checkOut: {
                            lte: new Date(endDate),
                            gte: new Date(startDate)
                        }
                    },
                    {
                        // Booking spans the entire requested period
                        checkIn: {
                            lte: new Date(startDate)
                        },
                        checkOut: {
                            gte: new Date(endDate)
                        }
                    }
                ],
                status: 'confirmed'
            }
        })

        // Create a map of room IDs to their bookings
        const roomBookings = new Map<string, Prisma.BookingGetPayload<{}>[]>()
        bookings.forEach((booking: Prisma.BookingGetPayload<{}>) => {
            const bookings = roomBookings.get(booking.roomId) || []
            bookings.push(booking)
            roomBookings.set(booking.roomId, bookings)
        })

        // Filter out rooms that are fully booked
        const availableRooms = rooms.filter((room: Prisma.RoomGetPayload<{}>) => {
            const roomBookingList = roomBookings.get(room.id) || []
            return roomBookingList.length === 0
        })

        return NextResponse.json({ availableRooms })
    } catch (error) {
        console.error('Error checking availability:', error)
        return NextResponse.json(
            { error: 'Failed to check availability' },
            { status: 500 }
        )
    }
} 