'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface RoomOption {
    id: string
    type: string
    description: string
    price: number
    capacity: number
    amenities: string[]
}

const roomOptions: Record<string, RoomOption> = {
    single: {
        id: 'single',
        type: 'Single Room',
        description: 'Cozy room with a single bed, perfect for solo travelers',
        price: 100,
        capacity: 1,
        amenities: ['Single Bed', 'Private Bathroom', 'Free WiFi', 'TV']
    },
    double: {
        id: 'double',
        type: 'Double Room',
        description: 'Spacious room with a double bed, ideal for couples',
        price: 150,
        capacity: 2,
        amenities: ['Double Bed', 'Private Bathroom', 'Free WiFi', 'TV', 'Mini Bar']
    },
    suite: {
        id: 'suite',
        type: 'Suite',
        description: 'Luxurious suite with separate living area',
        price: 250,
        capacity: 2,
        amenities: ['King Bed', 'Private Bathroom', 'Free WiFi', 'TV', 'Mini Bar', 'Living Room', 'Ocean View']
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
    const { data: session } = useSession()
    const [checkInDate, setCheckInDate] = useState('')
    const [checkOutDate, setCheckOutDate] = useState('')
    const [isChecking, setIsChecking] = useState(false)
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
    const [isBooking, setIsBooking] = useState(false)
    const [bookingSuccess, setBookingSuccess] = useState(false)

    const room = roomOptions[params.roomId]

    const checkAvailability = async () => {
        if (!checkInDate || !checkOutDate) {
            alert('Please select both check-in and check-out dates')
            return
        }

        setIsChecking(true)
        setIsAvailable(null)

        // Simulate API call to check availability
        await new Promise(resolve => setTimeout(resolve, 1000))
        const isRoomAvailable = Math.random() > 0.3 // 70% chance of availability for demo
        setIsAvailable(isRoomAvailable)
        setIsChecking(false)
    }

    const handleBooking = async () => {
        if (!session) {
            router.push('/auth/signin')
            return
        }

        setIsBooking(true)

        try {
            // Simulate API call to create booking
            await new Promise(resolve => setTimeout(resolve, 1500))
            setBookingSuccess(true)
        } catch (error) {
            console.error('Error creating booking:', error)
            alert('Failed to create booking. Please try again.')
        } finally {
            setIsBooking(false)
        }
    }

    if (bookingSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
                    <Link
                        href="/"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <Link
                    href={`/hotels/${params.id}/booking`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
                >
                    ← Back to Room Selection
                </Link>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-6">Book {room.type}</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h2 className="text-xl font-semibold mb-4">Room Details</h2>
                                <p className="text-gray-600 mb-4">{room.description}</p>
                                <div className="mb-4">
                                    <h3 className="font-semibold mb-2">Amenities:</h3>
                                    <ul className="list-disc list-inside text-gray-600">
                                        {room.amenities.map((amenity, index) => (
                                            <li key={index}>{amenity}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">${room.price}</p>
                                        <p className="text-gray-500">per night</p>
                                    </div>
                                    <p className="text-gray-600">Capacity: {room.capacity} person{room.capacity > 1 ? 's' : ''}</p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-4">Select Dates</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-gray-700 mb-2">Check-in Date</label>
                                        <input
                                            type="date"
                                            value={checkInDate}
                                            onChange={(e) => setCheckInDate(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 mb-2">Check-out Date</label>
                                        <input
                                            type="date"
                                            value={checkOutDate}
                                            onChange={(e) => setCheckOutDate(e.target.value)}
                                            min={checkInDate || new Date().toISOString().split('T')[0]}
                                            className="w-full p-2 border rounded-lg"
                                        />
                                    </div>
                                    <button
                                        onClick={checkAvailability}
                                        disabled={isChecking}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors disabled:bg-blue-400"
                                    >
                                        {isChecking ? 'Checking...' : 'Check Availability'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {isAvailable !== null && (
                            <div className={`p-4 rounded-lg mb-6 ${isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                {isAvailable ? (
                                    <p>Great! This room is available for your selected dates.</p>
                                ) : (
                                    <p>Sorry, this room is not available for your selected dates. Please try different dates.</p>
                                )}
                            </div>
                        )}

                        {isAvailable && (
                            <button
                                onClick={handleBooking}
                                disabled={isBooking}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors disabled:bg-green-400"
                            >
                                {isBooking ? 'Processing...' : 'Confirm Booking'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
} 