'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY'

interface CurrencyContextType {
    currency: Currency
    setCurrency: (currency: Currency) => void
    convertPrice: (price: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

// Exchange rates (you should fetch these from an API in production)
const exchangeRates: Record<Currency, number> = {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79,
    JPY: 151.62
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<Currency>('USD')

    useEffect(() => {
        // Check if user has preferences in localStorage
        const savedCurrency = localStorage.getItem('currency') as Currency
        if (savedCurrency) {
            setCurrency(savedCurrency)
        }
    }, [])

    const convertPrice = (price: number) => {
        const convertedPrice = price * exchangeRates[currency]
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(convertedPrice)
    }

    const handleSetCurrency = (newCurrency: Currency) => {
        setCurrency(newCurrency)
        localStorage.setItem('currency', newCurrency)
    }

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, convertPrice }}>
            {children}
        </CurrencyContext.Provider>
    )
}

export function useCurrency() {
    const context = useContext(CurrencyContext)
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider')
    }
    return context
} 