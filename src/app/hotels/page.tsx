'use client'

import { useEffect, useState } from 'react'
import HotelCard from '@/components/HotelCard'

interface Hotel {
    id: string
    name: string
    description: string
    price: number
    image: string
    location: string
}

export default function HotelsPage() {
    const [hotels, setHotels] = useState<Hotel[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await fetch('/api/hotels')
                if (response.ok) {
                    const data = await response.json()
                    setHotels(data)
                }
            } catch (error) {
                console.error('Error fetching hotels:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchHotels()
    }, [])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Available Hotels</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {hotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                ))}
            </div>
        </div>
    )
} 