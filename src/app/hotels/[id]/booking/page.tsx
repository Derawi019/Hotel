import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

interface RoomOption {
    id: string
    type: string
    description: string
    price: number
    capacity: number
    amenities: string[]
}

const roomOptions: RoomOption[] = [
    {
        id: 'single',
        type: 'Single Room',
        description: 'Cozy room with a single bed, perfect for solo travelers',
        price: 100,
        capacity: 1,
        amenities: ['Single Bed', 'Private Bathroom', 'Free WiFi', 'TV']
    },
    {
        id: 'double',
        type: 'Double Room',
        description: 'Spacious room with a double bed, ideal for couples',
        price: 150,
        capacity: 2,
        amenities: ['Double Bed', 'Private Bathroom', 'Free WiFi', 'TV', 'Mini Bar']
    },
    {
        id: 'suite',
        type: 'Suite',
        description: 'Luxurious suite with separate living area',
        price: 250,
        capacity: 2,
        amenities: ['King Bed', 'Private Bathroom', 'Free WiFi', 'TV', 'Mini Bar', 'Living Room', 'Ocean View']
    }
]

interface BookingPageProps {
    params: {
        id: string
    }
}

async function getHotel(id: string) {
    try {
        const hotel = await prisma.hotel.findUnique({
            where: { id },
        })

        if (!hotel) {
            throw new Error('Hotel not found')
        }

        return hotel
    } catch (error) {
        console.error('Error fetching hotel:', error)
        throw error
    }
}

export default async function BookingPage({ params }: BookingPageProps) {
    const session = await getServerSession(authOptions)
    const hotel = await getHotel(params.id)

    if (!session?.user?.email) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Please Sign In</h1>
                    <p className="text-gray-600 mb-8">You need to be signed in to make a booking.</p>
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

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link
                    href={`/hotels/${hotel.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
                >
                    ← Back to Hotel Details
                </Link>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="relative h-[200px]">
                        <Image
                            src={hotel.image}
                            alt={hotel.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
                        <p className="text-gray-600">{hotel.location}</p>
                    </div>
                </div>

                <h2 className="text-2xl font-bold mb-6">Select Your Room</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {roomOptions.map((room) => (
                        <div key={room.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{room.type}</h3>
                                <p className="text-gray-600 mb-4">{room.description}</p>
                                <div className="mb-4">
                                    <h4 className="font-semibold mb-2">Amenities:</h4>
                                    <ul className="list-disc list-inside text-gray-600">
                                        {room.amenities.map((amenity, index) => (
                                            <li key={index}>{amenity}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-2xl font-bold text-blue-600">${room.price}</p>
                                        <p className="text-gray-500">per night</p>
                                    </div>
                                    <p className="text-gray-600">Capacity: {room.capacity} person{room.capacity > 1 ? 's' : ''}</p>
                                </div>
                                <Link
                                    href={`/hotels/${hotel.id}/booking/${room.id}`}
                                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-center"
                                >
                                    Check Availability
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
} 