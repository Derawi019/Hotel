import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'

export default function Navigation() {
    const { data: session } = useSession()

    return (
        <nav className="bg-white dark:bg-gray-800 shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex items-center text-gray-900 dark:text-white">
                            Booking App
                        </Link>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link href="/properties" className="text-gray-900 dark:text-white hover:text-gray-500 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                Properties
                            </Link>
                            <Link href="/cancellation-policy" className="text-gray-900 dark:text-white hover:text-gray-500 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                Cancellation Policy
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center">
                        {session ? (
                            <div className="flex items-center space-x-4">
                                <Link href="/bookings" className="text-gray-900 dark:text-white hover:text-gray-500 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                    My Bookings
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="text-gray-900 dark:text-white hover:text-gray-500 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/auth/signin" className="text-gray-900 dark:text-white hover:text-gray-500 dark:hover:text-gray-300 px-3 py-2 rounded-md text-sm font-medium">
                                    Sign In
                                </Link>
                                <Link href="/auth/signup" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
} 