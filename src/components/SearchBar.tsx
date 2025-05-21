'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal } from 'lucide-react'

interface SearchFilters {
    query: string
    minPrice: string
    maxPrice: string
    location: string
}

export default function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<SearchFilters>({
        query: searchParams.get('query') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        location: searchParams.get('location') || ''
    })

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams()

        if (filters.query) params.set('query', filters.query)
        if (filters.minPrice) params.set('minPrice', filters.minPrice)
        if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
        if (filters.location) params.set('location', filters.location)

        router.push(`/?${params.toString()}`)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFilters(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            name="query"
                            value={filters.query}
                            onChange={handleInputChange}
                            placeholder="Search hotels..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <SlidersHorizontal className="h-5 w-5" />
                        Filters
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Search
                    </button>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-white">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={filters.location}
                                onChange={handleInputChange}
                                placeholder="Enter location"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Min Price
                            </label>
                            <input
                                type="number"
                                name="minPrice"
                                value={filters.minPrice}
                                onChange={handleInputChange}
                                placeholder="Min price"
                                min="0"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Max Price
                            </label>
                            <input
                                type="number"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleInputChange}
                                placeholder="Max price"
                                min="0"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
} 