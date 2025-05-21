import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { name, email, currentPassword, newPassword, confirmPassword } = await request.json()

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        // Update basic information
        const updateData: any = {}
        if (name) updateData.name = name
        if (email && email !== user.email) {
            // Check if email is already taken
            const existingUser = await prisma.user.findUnique({
                where: { email }
            })
            if (existingUser) {
                return NextResponse.json(
                    { error: 'Email already in use' },
                    { status: 400 }
                )
            }
            updateData.email = email
        }

        // Handle password change if requested
        if (currentPassword && newPassword) {
            // Verify current password
            const isValid = await bcrypt.compare(currentPassword, user.password)
            if (!isValid) {
                return NextResponse.json(
                    { error: 'Current password is incorrect' },
                    { status: 400 }
                )
            }

            // Verify new password confirmation
            if (newPassword !== confirmPassword) {
                return NextResponse.json(
                    { error: 'New passwords do not match' },
                    { status: 400 }
                )
            }

            // Hash and update new password
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            updateData.password = hashedPassword
        }

        // Update user
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData
        })

        return NextResponse.json({
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedUser.image
        })
    } catch (error) {
        console.error('Error updating profile:', error)
        return NextResponse.json(
            { error: 'Error updating profile' },
            { status: 500 }
        )
    }
} 