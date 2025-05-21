import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface BookingConfirmationEmailProps {
    to: string
    bookingId: string
    propertyName: string
    checkIn: string
    checkOut: string
    guestName: string
    totalAmount: number
    cancellationPolicy: string
}

export async function sendBookingConfirmationEmail({
    to,
    bookingId,
    propertyName,
    checkIn,
    checkOut,
    guestName,
    totalAmount,
    cancellationPolicy,
}: BookingConfirmationEmailProps) {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Booking Confirmation <bookings@yourdomain.com>',
            to,
            subject: `Booking Confirmation - ${propertyName}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #333;">Booking Confirmation</h1>
                    <p>Dear ${guestName},</p>
                    <p>Your booking has been confirmed. Here are your booking details:</p>
                    
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <h2 style="color: #444; margin-top: 0;">${propertyName}</h2>
                        <p><strong>Booking ID:</strong> ${bookingId}</p>
                        <p><strong>Check-in:</strong> ${checkIn}</p>
                        <p><strong>Check-out:</strong> ${checkOut}</p>
                        <p><strong>Total Amount:</strong> $${totalAmount}</p>
                    </div>

                    <div style="margin: 20px 0;">
                        <h3 style="color: #444;">Cancellation Policy</h3>
                        <p>${cancellationPolicy}</p>
                    </div>

                    <p>If you have any questions, please don't hesitate to contact us.</p>
                    
                    <p>Best regards,<br>Your Booking Team</p>
                </div>
            `,
        })

        if (error) {
            console.error('Error sending email:', error)
            return { success: false, error }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Error in sendBookingConfirmationEmail:', error)
        return { success: false, error }
    }
} 