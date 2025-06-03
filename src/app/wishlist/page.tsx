'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Hotel } from '@prisma/client'

export default function WishlistPage() {
    const { data: session } = useSession()
    const [wishlist, setWishlist] = useState<Hotel[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchWishlist = async () => {
            if (!session?.user?.email) {
                setLoading(false)
                return
            }

            try {
                const response = await fetch('/api/user/wishlist')
                if (!response.ok) {
                    const errorData = await response.text()
                    throw new Error(errorData || 'Failed to fetch wishlist')
                }
                const data = await response.json()
                console.log('Fetched wishlist data:', data)
                setWishlist(data)
            } catch (err) {
                console.error('Error fetching wishlist:', err)
                setError(err instanceof Error ? err.message : 'Failed to load wishlist')
            } finally {
                setLoading(false)
            }
        }

        fetchWishlist()
    }, [session])

    const removeFromWishlist = async (hotelId: string) => {
        try {
            const response = await fetch(`/api/user/wishlist/${hotelId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const errorData = await response.text()
                throw new Error(errorData || 'Failed to remove from wishlist')
            }

            // Update the wishlist state by removing the hotel
            setWishlist(wishlist.filter(hotel => hotel.id !== hotelId))
        } catch (err) {
            console.error('Error removing from wishlist:', err)
            setError(err instanceof Error ? err.message : 'Failed to remove from wishlist')
        }
    }

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Please Sign In</h1>
                    <p className="text-gray-600 mb-8">You need to be signed in to view your wishlist.</p>
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading your wishlist...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600 mb-8">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <Link
                        href="/hotels"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Hotels
                    </Link>
                </div>

                {wishlist.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow">
                        <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                        <Link
                            href="/hotels"
                            className="inline-block px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Browse Hotels
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((hotel) => (
                            <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="relative h-48">
                                    {hotel.image && (
                                        <Image
                                            src={hotel.image}
                                            alt={hotel.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-2">{hotel.name}</h2>
                                    <p className="text-gray-600 mb-4">{hotel.description}</p>
                                    <p className="text-gray-500 mb-4">{hotel.location}</p>
                                    <div className="flex justify-between items-center">
                                        <Link
                                            href={`/hotels/${hotel.id}`}
                                            className="text-blue-500 hover:text-blue-600"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => removeFromWishlist(hotel.id)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
} 