import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'
import PaymentMethods from './PaymentMethods'
import Preferences from './Preferences'

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/auth/signin')
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            bookings: {
                include: {
                    hotel: true,
                    room: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            wishlist: true
        }
    })

    if (!user) {
        redirect('/auth/signin')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">My Profile</h1>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                                    <img
                                        src={user.image || '/default-avatar.png'}
                                        alt={user.name || 'User'}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">{user.name}</h2>
                                    <p className="text-gray-600">{user.email}</p>
                                </div>
                            </div>
                            <nav className="space-y-2">
                                <Link
                                    href="/profile"
                                    className="block px-4 py-2 text-blue-600 bg-blue-50 rounded-lg"
                                >
                                    Profile Information
                                </Link>
                                <Link
                                    href="/profile/payment"
                                    className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    Payment Methods
                                </Link>
                                <Link
                                    href="/profile/preferences"
                                    className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    Preferences
                                </Link>
                                <Link
                                    href="/bookings"
                                    className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    Booking History
                                </Link>
                                <Link
                                    href="/wishlist"
                                    className="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                                >
                                    Wishlist
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow">
                            <div className="p-6">
                                <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>
                                <ProfileForm user={user} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 