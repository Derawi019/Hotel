import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

interface WishlistItem {
    id: string
    name: string
    description: string
    price: number
    image: string
    location: string
}

export default async function WishlistPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
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

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: {
            wishlist: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    price: true,
                    image: true,
                    location: true
                }
            }
        }
    })

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">User Not Found</h1>
                    <p className="text-gray-600 mb-8">Please try signing in again.</p>
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
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">My Wishlist</h1>
                    <Link
                        href="/"
                        className="text-blue-600 hover:text-blue-800"
                    >
                        ← Back to Hotels
                    </Link>
                </div>

                {user.wishlist.length === 0 ? (
                    <div className="text-center py-12">
                        <h2 className="text-xl text-gray-600 mb-4">Your wishlist is empty</h2>
                        <Link
                            href="/"
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Browse Hotels
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {user.wishlist.map((hotel: WishlistItem) => (
                            <div key={hotel.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="relative h-48">
                                    <Image
                                        src={hotel.image}
                                        alt={hotel.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                                    <p className="text-gray-600 mb-2">{hotel.location}</p>
                                    <p className="text-gray-700 mb-4">{hotel.description}</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold">${hotel.price}</span>
                                        <span className="text-gray-500">per night</span>
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