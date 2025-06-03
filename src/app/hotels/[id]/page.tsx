import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import WishlistButton from '@/components/WishlistButton'
import RoomCard from '@/components/RoomCard'

interface HotelPageProps {
    params: {
        id: string
    }
}

async function getHotel(id: string) {
    const hotel = await prisma.hotel.findUnique({
        where: { id },
        include: {
            rooms: {
                select: {
                    id: true,
                    type: true,
                    price: true,
                    description: true,
                    image: true,
                    wifi: true,
                    balcony: true,
                    oceanView: true,
                    cityView: true,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true
                }
            }
        }
    })

    if (!hotel) {
        throw new Error('Hotel not found')
    }

    return hotel
}

export default async function HotelPage({ params }: HotelPageProps) {
    try {
        const hotel = await getHotel(params.id)
        const session = await getServerSession(authOptions)

        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-8 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Hotels
                    </Link>

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-8">
                        <div className="relative h-[400px] group">
                            <Image
                                src={hotel.image}
                                alt={hotel.name}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                        </div>

                        <div className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">{hotel.name}</h1>
                                    <p className="text-gray-600 dark:text-gray-400 text-lg flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {hotel.location}
                                    </p>
                                </div>
                                {session?.user && (
                                    <WishlistButton hotelId={hotel.id} />
                                )}
                            </div>

                            <div className="prose max-w-none mb-8">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{hotel.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Available Rooms</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hotel.rooms.map((room) => (
                                <RoomCard key={room.id} room={room} hotelId={hotel.id} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        console.error('Error loading hotel:', error)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Error Loading Hotel</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">The hotel you're looking for could not be found.</p>
                    <Link
                        href="/"
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                        Return to Home
                    </Link>
                </div>
            </div>
        )
    }
} 