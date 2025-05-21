import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import SearchBar from '@/components/SearchBar'

interface HomePageProps {
    searchParams: {
        query?: string
        minPrice?: string
        maxPrice?: string
        location?: string
    }
}

export default async function HomePage({ searchParams }: HomePageProps) {
    // Build the where clause for filtering
    const where: any = {
        OR: [
            { name: { contains: searchParams.query || '', mode: 'insensitive' } },
            { description: { contains: searchParams.query || '', mode: 'insensitive' } }
        ]
    }

    // Add location filter if provided
    if (searchParams.location) {
        where.location = { contains: searchParams.location, mode: 'insensitive' }
    }

    // Add price range filters if provided
    if (searchParams.minPrice) {
        where.price = { ...where.price, gte: parseFloat(searchParams.minPrice) }
    }
    if (searchParams.maxPrice) {
        where.price = { ...where.price, lte: parseFloat(searchParams.maxPrice) }
    }

    const hotels = await prisma.hotel.findMany({
        where,
        orderBy: {
            createdAt: 'desc'
        }
    })

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Find Your Perfect Stay</h1>
                    <SearchBar />
                </div>

                {hotels.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-4">No hotels found</h2>
                        <p className="text-gray-500 dark:text-gray-400">Try adjusting your search criteria</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hotels.map((hotel) => (
                            <div key={hotel.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                                <div className="relative h-48">
                                    <Image
                                        src={hotel.image}
                                        alt={hotel.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{hotel.name}</h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-2">{hotel.location}</p>
                                    <p className="text-gray-700 dark:text-gray-300 mb-4">{hotel.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">${hotel.price}</span>
                                        <span className="text-gray-500 dark:text-gray-400">per night</span>
                                    </div>
                                    <Link
                                        href={`/hotels/${hotel.id}`}
                                        className="block w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors text-center"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
} 