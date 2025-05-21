import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
} from '@react-email/components'
import * as React from 'react'

interface BookingConfirmationEmailProps {
    bookingId: string
    propertyName: string
    checkIn: string
    checkOut: string
    guestName: string
    totalAmount: number
    cancellationPolicy: string
}

export const BookingConfirmationEmail = ({
    bookingId,
    propertyName,
    checkIn,
    checkOut,
    guestName,
    totalAmount,
    cancellationPolicy,
}: BookingConfirmationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your booking at {propertyName} has been confirmed!</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Booking Confirmation</Heading>
                    <Text style={text}>Dear {guestName},</Text>
                    <Text style={text}>
                        Your booking at {propertyName} has been confirmed. Here are your booking details:
                    </Text>
                    <Section style={details}>
                        <Text style={text}>
                            <strong>Booking ID:</strong> {bookingId}
                        </Text>
                        <Text style={text}>
                            <strong>Check-in:</strong> {checkIn}
                        </Text>
                        <Text style={text}>
                            <strong>Check-out:</strong> {checkOut}
                        </Text>
                        <Text style={text}>
                            <strong>Total Amount:</strong> ${totalAmount}
                        </Text>
                    </Section>
                    <Section style={cancellation}>
                        <Heading style={h2}>Cancellation Policy</Heading>
                        <Text style={text}>{cancellationPolicy}</Text>
                    </Section>
                    <Text style={text}>
                        If you have any questions, please don't hesitate to contact us.
                    </Text>
                    <Text style={footer}>
                        Best regards,<br />
                        The Booking Team
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}

const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
    backgroundColor: '#ffffff',
    margin: '0 auto',
    padding: '20px 0 48px',
    marginBottom: '64px',
}

const h1 = {
    color: '#1a1a1a',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '40px 0',
    padding: '0',
    textAlign: 'center' as const,
}

const h2 = {
    color: '#1a1a1a',
    fontSize: '20px',
    fontWeight: 'bold',
    margin: '20px 0',
    padding: '0',
}

const text = {
    color: '#1a1a1a',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '16px 0',
}

const details = {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    margin: '20px 0',
}

const cancellation = {
    backgroundColor: '#fff8f8',
    padding: '20px',
    borderRadius: '8px',
    margin: '20px 0',
}

const footer = {
    color: '#666666',
    fontSize: '14px',
    lineHeight: '22px',
    margin: '32px 0 0',
}

export default BookingConfirmationEmail 