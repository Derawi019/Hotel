import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import Link from 'next/link'

export default async function BookingsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            Please sign in to view your bookings
                        </h1>
                        <Link
                            href="/api/auth/signin"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">
                            User not found
                        </h1>
                        <Link
                            href="/api/auth/signin"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Sign In Again
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const bookings = await prisma.booking.findMany({
        where: {
            userId: user.id
        },
        include: {
            hotel: true
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

                {bookings.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl text-gray-600 mb-4">No bookings found</h2>
                        <Link
                            href="/"
                            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse Hotels
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-lg shadow-lg overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-start space-x-6">
                                        <div className="relative w-32 h-32 flex-shrink-0">
                                            <Image
                                                src={booking.hotel.image}
                                                alt={booking.hotel.name}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold mb-2">
                                                {booking.hotel.name}
                                            </h3>
                                            <p className="text-gray-600 mb-2">
                                                {booking.hotel.location}
                                            </p>
                                            <div className="grid grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Check-in</p>
                                                    <p className="font-medium">
                                                        {new Date(booking.startDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Check-out</p>
                                                    <p className="font-medium">
                                                        {new Date(booking.endDate).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'confirmed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : booking.status === 'cancelled'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                >
                                                    {booking.status.charAt(0).toUpperCase() +
                                                        booking.status.slice(1)}
                                                </span>
                                                <Link
                                                    href={`/hotels/${booking.hotelId}`}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    View Hotel
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
} 