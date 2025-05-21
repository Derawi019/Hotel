'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface WishlistButtonProps {
    hotelId: string
    initialIsWishlisted?: boolean
}

export default function WishlistButton({ hotelId, initialIsWishlisted = false }: WishlistButtonProps) {
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted)
    const [isLoading, setIsLoading] = useState(false)
    const { data: session } = useSession()

    const toggleWishlist = async () => {
        if (!session) {
            // Redirect to sign in or show a modal
            return
        }

        setIsLoading(true)
        try {
            if (isWishlisted) {
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
            setIsWishlisted(!isWishlisted)
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
            className={`p-2 rounded-full transition-colors ${isWishlisted
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-red-500'
                }`}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            <Heart
                className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`}
            />
        </button>
    )
} 