export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/user/bookings
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                bookings: {
                    include: {
                        hotel: true,
                        room: true
                    }
                }
            }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        return NextResponse.json(user.bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// POST /api/user/bookings
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { hotelId, roomId, checkInDate, checkOutDate, totalAmount } = body;

        console.log('User ID:', session.user.id);
        console.log('Booking Data:', { hotelId, roomId, checkInDate, checkOutDate, totalAmount });

        const booking = await prisma.booking.create({
            data: {
                userId: session.user.id,
                hotelId: hotelId,
                roomId: roomId,
                checkIn: new Date(checkInDate),
                checkOut: new Date(checkOutDate),
                totalAmount: totalAmount,
                status: 'confirmed'
            },
            include: {
                hotel: true,
                room: true,
            },
        });

        console.log('Created Booking:', booking);

        return NextResponse.json(booking);
    } catch (error) {
        const errMsg = error instanceof Error ? error.message : String(error)
        console.error('Error creating booking:', error);
        return NextResponse.json({ error: 'Failed to create booking', details: errMsg }, { status: 500 });
    }
} 