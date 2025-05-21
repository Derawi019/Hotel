import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import WishlistButton from './WishlistButton'
import BookingForm from './BookingForm'

interface HotelPageProps {
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

                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl">
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

                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <div className="flex justify-between items-center mb-8">
                                    <div>
                                        <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">${hotel.price}</p>
                                        <p className="text-gray-500 dark:text-gray-400">per night</p>
                                    </div>
                                    {session?.user ? (
                                        <BookingForm hotelId={hotel.id} />
                                    ) : (
                                        <Link
                                            href="/api/auth/signin"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                                        >
                                            Sign in to Book
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Hotel Not Found</h1>
                    <p className="text-gray-600 mb-8">The hotel you're looking for doesn't exist or has been removed.</p>
                    <Link
                        href="/"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Hotels
                    </Link>
                </div>
            </div>
        )
    }
} 