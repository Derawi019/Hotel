'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface RoomCardProps {
    room: {
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
    }
    hotelId: string
}

export default function RoomCard({ room, hotelId }: RoomCardProps) {
    const [checkInDate, setCheckInDate] = useState('')
    const [checkOutDate, setCheckOutDate] = useState('')

    const amenities = [
        { name: 'WiFi', value: room.wifi },
        { name: 'Balcony', value: room.balcony },
        { name: 'Ocean View', value: room.oceanView },
        { name: 'City View', value: room.cityView },
        { name: 'Minibar', value: room.minibar },
        { name: 'Air Conditioning', value: room.airConditioning },
        { name: 'Room Service', value: room.roomService },
        { name: 'TV', value: room.tv },
        { name: 'Safe', value: room.safe }
    ]

    const handleBooking = () => {
        if (!checkInDate || !checkOutDate) {
            alert('Please select both check-in and check-out dates')
            return
        }
        // Navigate to booking page with dates
        window.location.href = `/hotels/${hotelId}/booking/${room.id}?checkIn=${checkInDate}&checkOut=${checkOutDate}`
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl">
            <div className="relative h-48">
                <Image
                    src={room.image}
                    alt={`${room.type} room`}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {room.description}
                </p>
                <div className="mb-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Amenities:</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {amenities.map((amenity) => (
                            <div key={amenity.name} className="flex items-center text-sm">
                                <span className={`w-2 h-2 rounded-full mr-2 ${amenity.value ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <span className={amenity.value ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}>
                                    {amenity.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor={`checkIn-${room.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Check-in
                            </label>
                            <input
                                type="date"
                                id={`checkIn-${room.id}`}
                                value={checkInDate}
                                onChange={(e) => setCheckInDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label htmlFor={`checkOut-${room.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Check-out
                            </label>
                            <input
                                type="date"
                                id={`checkOut-${room.id}`}
                                value={checkOutDate}
                                onChange={(e) => setCheckOutDate(e.target.value)}
                                min={checkInDate || new Date().toISOString().split('T')[0]}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">${room.price}</p>
                            <p className="text-gray-500 dark:text-gray-400">per night</p>
                        </div>
                        <button
                            onClick={handleBooking}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Book Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 