import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from 'react-hot-toast'

interface WaitingListButtonProps {
    propertyId: string
    checkIn: string
    checkOut: string
    isAvailable: boolean
}

export default function WaitingListButton({
    propertyId,
    checkIn,
    checkOut,
    isAvailable,
}: WaitingListButtonProps) {
    const { data: session } = useSession()
    const [isLoading, setIsLoading] = useState(false)
    const [isOnWaitingList, setIsOnWaitingList] = useState(false)

    const handleJoinWaitingList = async () => {
        if (!session) {
            toast.error('Please sign in to join the waiting list')
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/waiting-list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyId,
                    checkIn,
                    checkOut,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Failed to join waiting list')
            }

            setIsOnWaitingList(true)
            toast.success('Successfully joined the waiting list!')
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Failed to join waiting list')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isAvailable) {
        return (
            <button
                onClick={handleJoinWaitingList}
                disabled={isLoading || isOnWaitingList}
                className={`w-full px-4 py-2 text-sm font-medium text-white rounded-md ${isOnWaitingList
                        ? 'bg-green-600 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
            >
                {isLoading
                    ? 'Joining...'
                    : isOnWaitingList
                        ? 'On Waiting List'
                        : 'Join Waiting List'}
            </button>
        )
    }

    return null
} 