import React from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { CurrencyProvider } from '@/components/CurrencyProvider'
import { AuthProvider } from '@/components/AuthProvider'
import Navbar from '../components/Navbar'

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
            <body style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif' }}>
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