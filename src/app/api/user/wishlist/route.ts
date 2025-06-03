import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        console.log('Session:', session)

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                wishlist: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        image: true,
                        location: true,
                        createdAt: true,
                        updatedAt: true
                    }
                }
            }
        })
        console.log('User with wishlist:', user)

        if (!user) {
            return new NextResponse('User not found', { status: 404 })
        }

        return NextResponse.json(user.wishlist)
    } catch (error) {
        console.error('Detailed error in wishlist GET:', {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        })
        return new NextResponse('Internal Server Error', { status: 500 })
    }
} 