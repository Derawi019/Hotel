'use client'

import { useSession } from 'next-auth/react'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import ProfileForm from './ProfileForm'
import PaymentMethods from './PaymentMethods'
import Preferences from './Preferences'

export default function ProfilePage() {
    const { data: session, update } = useSession()
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()

    const handleImageClick = () => {
        fileInputRef.current?.click()
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        setError(null)

        try {
            const formData = new FormData()
            formData.append('image', file)

            const response = await fetch('/api/user/profile-picture', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to upload image')
            }

            const data = await response.json()
            console.log('Upload response:', data)

            // Update the session to reflect the new image
            await update({
                ...session,
                user: {
                    ...session?.user,
                    image: data.url
                }
            })

            // Force a router refresh to update the UI
            router.refresh()
        } catch (err) {
            console.error('Error uploading image:', err)
            setError('Failed to upload image. Please try again.')
        } finally {
            setIsUploading(false)
        }
    }

    if (!session) {
        return <div>Please sign in to view your profile.</div>
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <div
                                className="w-32 h-32 rounded-full overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={handleImageClick}
                            >
                                {session.user?.image ? (
                                    <Image
                                        src={session.user.image}
                                        alt="Profile"
                                        width={128}
                                        height={128}
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-400">No image</span>
                                    </div>
                                )}
                            </div>
                            {isUploading && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                    <div className="text-white">Uploading...</div>
                                </div>
                            )}
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            onClick={handleImageClick}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            disabled={isUploading}
                        >
                            {isUploading ? 'Uploading...' : 'Change Profile Picture'}
                        </button>
                        {error && (
                            <div className="text-red-500 text-sm">{error}</div>
                        )}
                        <div className="mt-4 text-center">
                            <h2 className="text-2xl font-bold">{session.user?.name}</h2>
                            <p className="text-gray-600">{session.user?.email}</p>
                        </div>

                        {/* Navigation Links */}
                        <div className="mt-6 space-y-2">
                            <Link
                                href="/profile/preferences"
                                className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                            >
                                Manage Preferences
                            </Link>
                            <Link
                                href="/bookings"
                                className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                            >
                                View Bookings
                            </Link>
                            <Link
                                href="/wishlist"
                                className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
                            >
                                My Wishlist
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 