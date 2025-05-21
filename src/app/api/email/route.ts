import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export async function POST(request: Request) {
    try {
        const { email, bookingDetails } = await request.json()

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Booking Confirmation',
            html: `
                <h1>Booking Confirmation</h1>
                <p>Thank you for your booking!</p>
                <h2>Booking Details:</h2>
                <ul>
                    <li>Check-in: ${bookingDetails.checkIn}</li>
                    <li>Check-out: ${bookingDetails.checkOut}</li>
                    <li>Room Type: ${bookingDetails.roomType}</li>
                    <li>Total Amount: $${bookingDetails.totalAmount}</li>
                </ul>
                <p>We look forward to welcoming you!</p>
            `
        }

        // Send email
        await transporter.sendMail(mailOptions)

        return NextResponse.json({ message: 'Email sent successfully' })
    } catch (error) {
        console.error('Error sending email:', error)
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        )
    }
} 