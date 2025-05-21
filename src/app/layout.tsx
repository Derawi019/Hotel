import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { CurrencyProvider } from '@/components/CurrencyProvider'
import { AuthProvider } from '@/components/AuthProvider'
import Navbar from '../components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Hotel Booking App',
    description: 'Book your next stay with us',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <AuthProvider>
                    <ThemeProvider>
                        <CurrencyProvider>
                            <Navbar />
                            <main className="min-h-screen">
                                {children}
                            </main>
                        </CurrencyProvider>
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    )
} 