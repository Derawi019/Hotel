import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import nodemailer from 'nodemailer'

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
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { hotelId, roomId, checkInDate, checkOutDate } = body

        if (!hotelId || !roomId || !checkInDate || !checkOutDate) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Create a new test booking
        const startDate = new Date(checkInDate)
        const endDate = new Date(checkOutDate)
        const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

        // For testing, we'll use a fixed price of $100 per night
        const totalAmount = 100 * nights

        const newBooking = {
            id: `booking_${testBookings.length + 1}`,
            hotelId,
            roomId,
            startDate,
            endDate,
            totalAmount,
            status: 'confirmed',
            hotel: {
                id: hotelId,
                name: 'Test Hotel',
                description: 'A test hotel for demonstration purposes',
                location: 'Test Location',
                price: 100,
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            },
            room: {
                id: roomId,
                type: 'Test Room',
                price: 100
            }
        }

        // Add to test bookings array
        testBookings.push(newBooking)

        // Send confirmation email
        console.log('Attempting to send email to:', session.user.email)
        console.log('Using email user:', process.env.EMAIL_USER)

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: session.user.email!,
            subject: 'Booking Confirmation',
            html: `
                <h1>Booking Confirmation</h1>
                <p>Dear ${session.user.name},</p>
                <p>Your booking has been confirmed. Here are your booking details:</p>
                <ul>
                    <li>Hotel: ${newBooking.hotel.name}</li>
                    <li>Location: ${newBooking.hotel.location}</li>
                    <li>Room Type: ${newBooking.room.type}</li>
                    <li>Check-in: ${startDate.toLocaleDateString()}</li>
                    <li>Check-out: ${endDate.toLocaleDateString()}</li>
                    <li>Number of Nights: ${nights}</li>
                    <li>Total Amount: $${totalAmount}</li>
                </ul>
                <p>Thank you for choosing our service!</p>
            `
        }

        try {
            console.log('Sending email...')
            const info = await transporter.sendMail(mailOptions)
            console.log('Email sent successfully:', info)
        } catch (error: any) {
            console.error('Failed to send confirmation email. Error details:', {
                message: error.message,
                code: error.code,
                command: error.command,
                stack: error.stack
            })
            // Don't fail the booking if email fails
        }

        return NextResponse.json({
            ...newBooking,
            message: 'Booking confirmed and confirmation email sent'
        })
    } catch (error) {
        console.error('Error creating booking:', error)
        return NextResponse.json(
            { error: 'Failed to create booking' },
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