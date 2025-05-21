import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectToDatabase } from '@/lib/mongodb'
import Property from '@/models/Property'
import Booking from '@/models/Booking'
import { sendBookingConfirmationEmail } from '@/lib/email'
import { validateObjectId } from '@/lib/validators'

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { propertyId, checkIn, checkOut, totalAmount } = await req.json()

        // Validate propertyId
        const propertyIdValidation = validateObjectId(propertyId, 'Property ID')
        if (!propertyIdValidation.isValid) {
            return NextResponse.json(
                { error: propertyIdValidation.error },
                { status: 400 }
            )
        }

        // Validate other required fields
        if (!checkIn || !checkOut || !totalAmount) {
            return NextResponse.json(
                { error: 'Missing required fields: checkIn, checkOut, and totalAmount are required' },
                { status: 400 }
            )
        }

        // Validate dates
        const checkInDate = new Date(checkIn)
        const checkOutDate = new Date(checkOut)

        if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
            return NextResponse.json(
                { error: 'Invalid date format. Please use YYYY-MM-DD format' },
                { status: 400 }
            )
        }

        if (checkInDate >= checkOutDate) {
            return NextResponse.json(
                { error: 'Check-out date must be after check-in date' },
                { status: 400 }
            )
        }

        // Validate totalAmount
        if (typeof totalAmount !== 'number' || totalAmount <= 0) {
            return NextResponse.json(
                { error: 'Total amount must be a positive number' },
                { status: 400 }
            )
        }

        await connectToDatabase()

        // Get property details
        const property = await Property.findById(propertyId)
        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 })
        }

        // Check if dates are available
        const existingBooking = await Booking.findOne({
            propertyId,
            status: { $in: ['confirmed', 'pending'] },
            $or: [
                {
                    checkIn: { $lte: checkOutDate },
                    checkOut: { $gte: checkInDate }
                }
            ]
        })

        if (existingBooking) {
            return NextResponse.json(
                { error: 'These dates are not available' },
                { status: 400 }
            )
        }

        // Create booking
        const booking = await Booking.create({
            propertyId,
            userId: session.user.id,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalAmount,
            status: 'confirmed',
        })

        // Send confirmation email
        try {
            const emailResult = await sendBookingConfirmationEmail({
                to: session.user.email!,
                bookingId: booking._id.toString(),
                propertyName: property.name,
                checkIn: checkInDate.toLocaleDateString(),
                checkOut: checkOutDate.toLocaleDateString(),
                guestName: session.user.name || 'Guest',
                totalAmount,
                cancellationPolicy: property.cancellationPolicy.description,
            })

            if (!emailResult.success) {
                console.error('Failed to send confirmation email:', emailResult.error)
            }
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError)
            // Continue with the booking even if email fails
        }

        return NextResponse.json(booking)
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
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectToDatabase()

        const bookings = await Booking.find({ userId: session.user.id })
            .populate('propertyId')
            .sort({ createdAt: -1 })

        return NextResponse.json(bookings)
    } catch (error) {
        console.error('Error fetching bookings:', error)
        return NextResponse.json(
            { error: 'Error fetching bookings' },
            { status: 500 }
        )
    }
} 