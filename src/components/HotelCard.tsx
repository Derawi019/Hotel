'use client'

import Link from 'next/link'
import Image from 'next/image'
import WishlistButton from './WishlistButton'

interface HotelCardProps {
    hotel: {
        id: string
        name: string
        description: string
        price: number
        image: string
        location: string
    }
}

export default function HotelCard({ hotel }: HotelCardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="relative group">
                <Image
                    src={hotel.image}
                    alt={hotel.name}
                    width={400}
                    height={300}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2">
                    <WishlistButton hotelId={hotel.id} />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
            </div>
            <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100 line-clamp-1">{hotel.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {hotel.location}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{hotel.description}</p>
                <div className="flex justify-between items-center">
                    <div>
                        <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${hotel.price}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">/night</span>
                    </div>
                    <Link
                        href={`/hotels/${hotel.id}`}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors transform hover:scale-105 duration-200"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
} 