'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'

interface Booking {
    id: string
    hotelId: string
    startDate: string
    endDate: string
    status: string
    hotel: {
        name: string
        image: string
        location: string
    }
    room: {
        type: string
    }
}

export default function BookingsPage() {
    const { data: session } = useSession()
    const [bookings, setBookings] = useState<Booking[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('/api/user/bookings')
                if (!response.ok) throw new Error('Failed to fetch bookings')
                const data = await response.json()
                setBookings(data)
            } catch (error) {
                console.error('Error fetching bookings:', error)
            } finally {
                setLoading(false)
            }
        }

        if (session?.user) {
            fetchBookings()
        }
    }, [session])

    const handleCancelBooking = async (bookingId: string) => {
        try {
            const response = await fetch(`/api/user/bookings/${bookingId}`, {
                method: 'DELETE',
            })
            if (response.ok) {
                setBookings(bookings.filter(booking => booking.id !== bookingId))
            }
        } catch (error) {
            console.error('Error canceling booking:', error)
        }
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
                    <p className="text-gray-600 mb-8">You need to be signed in to view your bookings.</p>
                    <Link
                        href="/auth/signin"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your bookings...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
                {bookings.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">No bookings found</h2>
                        <p className="text-gray-600 mb-8">Start planning your next stay!</p>
                        <Link
                            href="/"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Browse Hotels
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden"
                            >
                                <div className="relative h-48">
                                    <Image
                                        src={booking.hotel.image}
                                        alt={booking.hotel.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-2">{booking.hotel.name}</h2>
                                    <p className="text-gray-600 mb-4">{booking.hotel.location}</p>
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
                                    <div className="flex justify-between items-center">
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
                                        <div className="flex space-x-4">
                                            <Link
                                                href={`/hotels/${booking.hotelId}`}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                View Hotel
                                            </Link>
                                            {booking.status === 'confirmed' && (
                                                <button
                                                    onClick={() => handleCancelBooking(booking.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Cancel
                                                </button>
                                            )}
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