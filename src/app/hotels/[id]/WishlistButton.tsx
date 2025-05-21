'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface WishlistButtonProps {
    hotelId: string
}

export default function WishlistButton({ hotelId }: WishlistButtonProps) {
    const { data: session } = useSession()
    const [isInWishlist, setIsInWishlist] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        checkWishlistStatus()
    }, [hotelId])

    const checkWishlistStatus = async () => {
        try {
            const response = await fetch('/api/wishlist')
            const wishlist = await response.json()
            setIsInWishlist(wishlist.some((item: any) => item.hotelId === hotelId))
        } catch (error) {
            console.error('Error checking wishlist status:', error)
        }
    }

    const toggleWishlist = async () => {
        if (!session) {
            // Redirect to sign in or show sign in modal
            return
        }

        setIsLoading(true)
        try {
            if (isInWishlist) {
                await fetch('/api/wishlist', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ hotelId }),
                })
            } else {
                await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ hotelId }),
                })
            }
            setIsInWishlist(!isInWishlist)
        } catch (error) {
            console.error('Error toggling wishlist:', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <button
            onClick={toggleWishlist}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors ${isInWishlist
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-red-500'
                }`}
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill={isInWishlist ? 'currentColor' : 'none'}
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
            </svg>
        </button>
    )
} 