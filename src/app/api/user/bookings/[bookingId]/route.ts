export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// DELETE /api/user/bookings/[bookingId]
export async function DELETE(
    request: Request,
    { params }: { params: { bookingId: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: params.bookingId }
        });

        if (!booking) {
            return new NextResponse('Booking not found', { status: 404 });
        }

        if (booking.userId !== user.id) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        await prisma.booking.update({
            where: { id: params.bookingId },
            data: { status: 'cancelled' }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
} 