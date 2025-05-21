import React from 'react'
import Link from 'next/link'

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">About HotelHub</h1>
                    <p className="text-xl text-gray-600">
                        Your trusted partner in finding the perfect accommodation
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                    <p className="text-gray-700 mb-6">
                        HotelHub was founded with a simple mission: to make hotel booking easy, transparent, and enjoyable.
                        We understand that finding the right accommodation is crucial for a memorable travel experience,
                        and we're here to help you make the best choice.
                    </p>
                    <p className="text-gray-700">
                        Our platform connects travelers with carefully selected hotels worldwide,
                        offering a seamless booking experience and exceptional customer service.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <div className="text-blue-600 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Verified Hotels</h3>
                        <p className="text-gray-600">
                            All our listed hotels are verified and regularly inspected to ensure quality.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <div className="text-blue-600 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Best Price Guarantee</h3>
                        <p className="text-gray-600">
                            We offer competitive prices and price matching to ensure you get the best deal.
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                        <div className="text-blue-600 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">24/7 Support</h3>
                        <p className="text-gray-600">
                            Our customer support team is available around the clock to assist you.
                        </p>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        href="/"
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
                    >
                        Start Booking
                    </Link>
                </div>
            </div>
        </div>
    )
} 