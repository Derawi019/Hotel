'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import UserMenu from './UserMenu'

export default function Navbar() {
    const { data: session } = useSession()

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            HotelHub
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <Link
                            href="/"
                            className="text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            Hotels
                        </Link>
                        <Link
                            href="/about"
                            className="text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="/contact"
                            className="text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            Contact
                        </Link>
                        <UserMenu />
                    </div>
                </div>
            </div>
        </nav>
    )
} 