import React from 'react'
import prisma from '@/lib/prisma'
import HotelCard from '@/components/HotelCard'
import SearchBar from '@/components/SearchBar'

export default async function HomePage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    try {
        // Build the where clause for filtering
        const where: any = {}

        // Add search query filter if provided
        if (searchParams.query) {
            where.OR = [
                { name: { contains: searchParams.query as string, mode: 'insensitive' } },
                { description: { contains: searchParams.query as string, mode: 'insensitive' } }
            ]
        }

        // Add location filter if provided
        if (searchParams.location) {
            where.location = { contains: searchParams.location as string, mode: 'insensitive' }
        }

        // Get hotels with filters
        const hotels = await prisma.hotel.findMany({
            where,
            select: {
                id: true,
                name: true,
                description: true,
                image: true,
                location: true,
                rooms: {
                    select: {
                        type: true,
                        price: true
                    }
                }
            },
            take: 10 // Limit to 10 hotels for testing
        })

        // Filter hotels based on standard room prices if min/max price is provided
        const filteredHotels = hotels.filter(hotel => {
            if (!searchParams.minPrice && !searchParams.maxPrice) return true

            const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice as string) : 0
            const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice as string) : Infinity

            // Get standard room prices (single and double rooms)
            const standardRoomPrices = hotel.rooms
                .filter(room => room.type === 'single' || room.type === 'double')
                .map(room => room.price)

            // Check if any standard room's price falls within the range
            return standardRoomPrices.some(price => price >= minPrice && price <= maxPrice)
        })

        // Remove rooms from the response since we don't need them in the UI
        const hotelsForDisplay = filteredHotels.map(({ rooms, ...hotel }) => hotel)

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-center mb-8">Hotels</h1>
                    <div className="mb-8">
                        <SearchBar />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hotelsForDisplay.map((hotel) => (
                            <HotelCard key={hotel.id} hotel={hotel} />
                        ))}
                    </div>
                </div>
            </div>
        )
    } catch (error) {
        console.error('Database error:', error)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Database Error</h1>
                    <pre className="text-left bg-gray-100 p-4 rounded-lg overflow-auto max-w-lg">
                        {error instanceof Error ? error.message : 'Unknown error occurred'}
                    </pre>
                </div>
            </div>
        )
    }
} 