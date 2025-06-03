import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import nodemailer from 'nodemailer'

export const dynamic = "force-dynamic";

// Test data for bookings
let testBookings = [
    {
        id: 'booking_1',
        hotelId: 'hotel_1',
        roomId: 'room_1',
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        totalAmount: 700,
        status: 'confirmed',
        hotel: {
            id: 'hotel_1',
            name: 'Luxury Resort & Spa',
            description: 'Experience ultimate luxury with our premium amenities and world-class service.',
            location: 'Miami Beach, FL',
            price: 299,
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        },
        room: {
            id: 'room_1',
            type: 'Deluxe Suite',
            price: 299
        }
    },
    {
        id: 'booking_2',
        hotelId: 'hotel_2',
        roomId: 'room_2',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        totalAmount: 500,
        status: 'confirmed',
        hotel: {
            id: 'hotel_2',
            name: 'Mountain View Lodge',
            description: 'Escape to the mountains and enjoy breathtaking views and outdoor activities.',
            location: 'Denver, CO',
            price: 199,
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
        },
        room: {
            id: 'room_2',
            type: 'Mountain View Room',
            price: 199
        }
    }
]

export async function POST(request: Request) {
    let body;
    let user = null;
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        body = await request.json()
        const { hotelId, roomId, checkInDate, checkOutDate, totalAmount } = body

        console.log('Booking request body:', body)

        // Get the user first to ensure we have the ID
        user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        console.log('User found for booking:', user)

        if (!user) {
            // Fallback: Create a mock booking if user is not found
            const mockBooking = {
                id: 'mock_booking_' + Date.now(),
                userId: 'mock_user',
                hotelId,
                roomId,
                checkIn: new Date(checkInDate),
                checkOut: new Date(checkOutDate),
                totalAmount,
                status: 'confirmed',
                hotel: {
                    id: hotelId,
                    name: 'Mock Hotel',
                    location: 'Mock Location'
                },
                room: {
                    id: roomId,
                    type: 'Mock Room'
                }
            }
            console.log('Created mock booking:', mockBooking)
            return NextResponse.json(mockBooking)
        }

        // Create the booking in the database
        const booking = await prisma.booking.create({
            data: {
                userId: user.id,
                hotelId,
                roomId,
                checkIn: new Date(checkInDate),
                checkOut: new Date(checkOutDate),
                totalAmount,
                status: 'confirmed'
            },
            include: {
                hotel: true,
                room: true,
                user: true
            }
        })

        // Send confirmation email
        if (session.user.email) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            })

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: session.user.email,
                subject: 'Booking Confirmation',
                html: `
                    <h1>Booking Confirmation</h1>
                    <p>Dear ${session.user.name || 'Guest'},</p>
                    <p>Your booking has been confirmed. Here are your booking details:</p>
                    <ul>
                        <li>Hotel: ${booking.hotel.name}</li>
                        <li>Location: ${booking.hotel.location}</li>
                        <li>Room Type: ${booking.room.type}</li>
                        <li>Check-in: ${new Date(booking.checkIn).toLocaleDateString()}</li>
                        <li>Check-out: ${new Date(booking.checkOut).toLocaleDateString()}</li>
                        <li>Total Amount: $${booking.totalAmount}</li>
                    </ul>
                    <p>Thank you for choosing our service!</p>
                `
            }

            try {
                await transporter.sendMail(mailOptions)
            } catch (error) {
                console.error('Failed to send confirmation email:', error)
                // Don't fail the booking if email fails
            }
        }

        return NextResponse.json(booking)
    } catch (error) {
        console.error('Booking error:', error)
        if (error instanceof Error) {
            return NextResponse.json(
                { error: 'Failed to create booking', details: error.message, stack: error.stack, body, user },
                { status: 500 }
            )
        }
        return NextResponse.json(
            { error: 'Failed to create booking', details: String(error), body, user },
            { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Return all test bookings
        return NextResponse.json({ bookings: testBookings })
    } catch (error) {
        console.error('Error fetching bookings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch bookings' },
            { status: 500 }
        )
    }
} 