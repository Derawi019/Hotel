'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface WishlistButtonProps {
    hotelId: string
    initialIsWishlisted?: boolean
}

export default function WishlistButton({ hotelId, initialIsWishlisted = false }: WishlistButtonProps) {
    const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted)
    const [isLoading, setIsLoading] = useState(false)
    const { data: session } = useSession()
    const router = useRouter()

    useEffect(() => {
        if (session?.user) {
            checkWishlistStatus()
        }
    }, [session, hotelId])

    const checkWishlistStatus = async () => {
        try {
            const response = await fetch('/api/wishlist')
            if (!response.ok) throw new Error('Failed to fetch wishlist')
            const wishlist = await response.json()
            setIsWishlisted(wishlist.some((item: any) => item.hotelId === hotelId))
        } catch (error) {
            console.error('Error checking wishlist status:', error)
        }
    }

    const toggleWishlist = async () => {
        if (!session) {
            router.push('/auth/signin')
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/wishlist', {
                method: isWishlisted ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ hotelId }),
            })

            if (!response.ok) {
                throw new Error('Failed to update wishlist')
            }

            setIsWishlisted(!isWishlisted)
            router.refresh() // Refresh the page to update the UI
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