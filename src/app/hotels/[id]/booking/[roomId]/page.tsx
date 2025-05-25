'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Room {
    id: string
    type: string
    price: number
    description: string
    image: string
    wifi: boolean
    balcony: boolean
    oceanView: boolean
    cityView: boolean
    minibar: boolean
    airConditioning: boolean
    roomService: boolean
    tv: boolean
    safe: boolean
    hotel: {
        name: string
        image: string
        location: string
    }
}

interface BookingConfirmationPageProps {
    params: {
        id: string
        roomId: string
    }
}

export default function BookingConfirmationPage({ params }: BookingConfirmationPageProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { data: session } = useSession()
    const [room, setRoom] = useState<Room | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [checkInDate, setCheckInDate] = useState(searchParams.get('checkIn') || '')
    const [checkOutDate, setCheckOutDate] = useState(searchParams.get('checkOut') || '')
    const [bookingSuccess, setBookingSuccess] = useState(false)
    const [isBooking, setIsBooking] = useState(false)

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const response = await fetch(`/api/rooms/${params.roomId}?hotelId=${params.id}`)
                if (!response.ok) {
                    throw new Error('Failed to fetch room')
                }
                const data = await response.json()
                setRoom(data)
            } catch (err) {
                setError('Failed to load room details')
            } finally {
                setLoading(false)
            }
        }

        fetchRoom()
    }, [params.id, params.roomId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!session) {
            router.push('/auth/signin')
            return
        }

        setIsBooking(true)
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    hotelId: params.id,
                    roomId: params.roomId,
                    checkInDate,
                    checkOutDate,
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to create booking')
            }

            setBookingSuccess(true)
        } catch (err) {
            console.error('Error creating booking:', err)
            alert('Failed to create booking. Please try again.')
        } finally {
            setIsBooking(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading room details...</p>
                </div>
            </div>
        )
    }

    if (error || !room) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Room</h1>
                    <p className="text-gray-600 mb-4">{error || 'The room you are looking for could not be found.'}</p>
                    <Link
                        href={`/hotels/${params.id}`}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Return to Hotel
                    </Link>
                </div>
            </div>
        )
    }

    if (bookingSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
                    <div className="text-green-500 mb-4">
                        <svg
                            className="w-16 h-16 mx-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold mb-4">Booking Confirmed!</h1>
                    <p className="text-gray-600 mb-6">
                        Your room has been successfully booked. We've sent a confirmation email with all the details.
                    </p>
                    <div className="space-y-4">
                        <Link
                            href="/bookings"
                            className="block w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            View My Bookings
                        </Link>
                        <Link
                            href="/"
                            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                        >
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Link
                    href={`/hotels/${params.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
                >
                    ← Back to Hotel
                </Link>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-6">Book {room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Room Details</h2>
                                <p className="text-gray-600 mb-4">{room.description}</p>
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-2">Amenities:</h3>
                                    <ul className="list-disc list-inside text-gray-600">
                                        {room.wifi && <li>Free WiFi</li>}
                                        {room.balcony && <li>Private Balcony</li>}
                                        {room.oceanView && <li>Ocean View</li>}
                                        {room.cityView && <li>City View</li>}
                                        {room.minibar && <li>Minibar</li>}
                                        {room.airConditioning && <li>Air Conditioning</li>}
                                        {room.roomService && <li>24/7 Room Service</li>}
                                        {room.tv && <li>Flat-screen TV</li>}
                                        {room.safe && <li>In-room Safe</li>}
                                    </ul>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">${room.price}</p>
                                        <p className="text-gray-500">per night</p>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Hotel Information</h2>
                                <div className="relative h-48 mb-4">
                                    <Image
                                        src={room.hotel.image}
                                        alt={room.hotel.name}
                                        fill
                                        className="object-cover rounded-lg"
                                    />
                                </div>
                                <h3 className="font-semibold mb-2">{room.hotel.name}</h3>
                                <p className="text-gray-600 mb-4">{room.hotel.location}</p>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h2 className="text-xl font-semibold mb-4">Confirm Your Booking</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-1">
                                            Check-in Date
                                        </label>
                                        <input
                                            type="date"
                                            id="checkIn"
                                            value={checkInDate}
                                            onChange={(e) => setCheckInDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-1">
                                            Check-out Date
                                        </label>
                                        <input
                                            type="date"
                                            id="checkOut"
                                            value={checkOutDate}
                                            onChange={(e) => setCheckOutDate(e.target.value)}
                                            min={checkInDate || new Date().toISOString().split('T')[0]}
                                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isBooking}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:bg-blue-400"
                                >
                                    {isBooking ? 'Processing...' : 'Confirm Booking'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 