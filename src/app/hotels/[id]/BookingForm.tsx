'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Room {
    id: string
    type: string
    price: number
}

interface BookingFormProps {
    hotelId: string
}

export default function BookingForm({ hotelId }: BookingFormProps) {
    const router = useRouter()
    const { data: session } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [selectedRoom, setSelectedRoom] = useState('')
    const [error, setError] = useState('')
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)
    const [availableRooms, setAvailableRooms] = useState<Room[]>([])
    const [hasCheckedAvailability, setHasCheckedAvailability] = useState(false)
    const [bookingSuccess, setBookingSuccess] = useState(false)

    useEffect(() => {
        // Reset states when dates change
        setSelectedRoom('')
        setAvailableRooms([])
        setHasCheckedAvailability(false)
        setError('')
        setBookingSuccess(false)

        // Check room availability when dates are selected
        if (startDate && endDate) {
            setIsCheckingAvailability(true)

            const checkAvailability = async () => {
                try {
                    const response = await fetch(`/api/hotels/${hotelId}/rooms`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Failed to check room availability');
                    }

                    const rooms = await response.json();
                    setAvailableRooms(rooms);
                    setHasCheckedAvailability(true);
                } catch (error) {
                    console.error('Error checking availability:', error);
                    setError('Failed to check room availability');
                } finally {
                    setIsCheckingAvailability(false);
                }
            };

            checkAvailability();
        }
    }, [startDate, endDate, hotelId])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        if (!session?.user?.email) {
            setError('Please sign in to make a booking')
            setIsLoading(false)
            return
        }

        if (!selectedRoom) {
            setError('Please select a room type')
            setIsLoading(false)
            return
        }

        try {
            // Calculate total amount based on selected room and dates
            const startDateObj = new Date(startDate)
            const endDateObj = new Date(endDate)
            const nights = Math.ceil((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24))
            const selectedRoomData = availableRooms.find(room => room.id === selectedRoom)
            const totalAmount = selectedRoomData ? selectedRoomData.price * nights : 0

            // Send confirmation email
            const emailResponse = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: session.user.email,
                    bookingDetails: {
                        checkIn: startDate,
                        checkOut: endDate,
                        roomType: selectedRoomData?.type,
                        totalAmount
                    }
                })
            })

            if (!emailResponse.ok) {
                throw new Error('Failed to send confirmation email')
            }

            setBookingSuccess(true)
            // Show success message for 2 seconds before redirecting
            setTimeout(() => {
                router.push('/bookings')
                router.refresh()
            }, 2000)
        } catch (err) {
            console.error('Booking error:', err)
            setError(err instanceof Error ? err.message : 'Failed to create booking')
        } finally {
            setIsLoading(false)
        }
    }

    if (!session) {
        return (
            <div className="p-4 bg-yellow-50 text-yellow-700 rounded-lg">
                Please sign in to make a booking
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="startDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Check-in
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="endDate"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Check-out
                    </label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || new Date().toISOString().split('T')[0]}
                        required
                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {isCheckingAvailability && (
                <div className="text-center py-4">
                    <p className="text-gray-600">Checking room availability...</p>
                </div>
            )}

            {hasCheckedAvailability && availableRooms.length > 0 && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Room Type
                    </label>
                    <div className="grid gap-2">
                        {availableRooms.map((room) => (
                            <label
                                key={room.id}
                                className={`flex items-center p-3 border rounded-lg cursor-pointer ${selectedRoom === room.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300'
                                    }`}
                            >
                                <input
                                    type="radio"
                                    name="room"
                                    value={room.id}
                                    checked={selectedRoom === room.id}
                                    onChange={(e) => setSelectedRoom(e.target.value)}
                                    className="mr-2"
                                />
                                <div>
                                    <p className="font-medium">{room.type} Room</p>
                                    <p className="text-sm text-gray-600">${room.price} per night</p>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            {bookingSuccess && (
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                    Booking successful! A confirmation email has been sent to {session.user.email}. Redirecting to bookings page...
                </div>
            )}

            <button
                type="submit"
                disabled={isLoading || !selectedRoom || isCheckingAvailability}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors disabled:bg-blue-400"
            >
                {isLoading ? 'Booking...' : 'Book Now'}
            </button>
        </form>
    )
} 