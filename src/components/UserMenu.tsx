'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export default function UserMenu() {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    if (!session?.user) {
        return (
            <Link
                href="/auth/signin"
                className="text-blue-600 hover:text-blue-800"
            >
                Sign In
            </Link>
        )
    }

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
                <span>{session.user.name || session.user.email}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    <Link
                        href="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                    >
                        Profile
                    </Link>
                    <Link
                        href="/profile/preferences"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                    >
                        Preferences
                    </Link>
                    <Link
                        href="/wishlist"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                    >
                        My Wishlist
                    </Link>
                    <Link
                        href="/bookings"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                    >
                        My Bookings
                    </Link>
                    <button
                        onClick={() => {
                            setIsOpen(false)
                            signOut()
                        }}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    )
} 