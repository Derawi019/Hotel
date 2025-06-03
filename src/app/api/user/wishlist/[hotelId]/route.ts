import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function DELETE(
    request: Request,
    { params }: { params: { hotelId: string } }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return new NextResponse('User not found', { status: 404 })
        }

        // Remove the hotel from the user's wishlist
        await prisma.user.update({
            where: { id: user.id },
            data: {
                wishlist: {
                    disconnect: {
                        id: params.hotelId
                    }
                }
            }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('Error removing from wishlist:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 