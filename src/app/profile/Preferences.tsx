'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Globe, Moon } from 'lucide-react'
import { useTheme } from '@/components/ThemeProvider'
import { useCurrency } from '@/components/CurrencyProvider'

interface UserPreferences {
    emailNotifications: boolean
    smsNotifications: boolean
    marketingEmails: boolean
    darkMode: boolean
    language: string
    currency: string
}

export default function Preferences() {
    const router = useRouter()
    const { theme, toggleTheme } = useTheme()
    const { currency, setCurrency } = useCurrency()
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [preferences, setPreferences] = useState<UserPreferences>({
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        darkMode: false,
        language: 'en',
        currency: 'USD'
    })

    useEffect(() => {
        const fetchPreferences = async () => {
            try {
                const response = await fetch('/api/user/preferences')
                if (response.ok) {
                    const data = await response.json()
                    if (data && Object.keys(data).length > 0) {
                        setPreferences(data as UserPreferences)
                        // Update theme and currency based on preferences
                        if (data.darkMode) {
                            document.documentElement.classList.add('dark')
                        } else {
                            document.documentElement.classList.remove('dark')
                        }
                        setCurrency(data.currency as any)
                    }
                }
            } catch (error) {
                console.error('Error fetching preferences:', error)
            }
        }

        fetchPreferences()
    }, [setCurrency])

    const handleToggle = (key: keyof UserPreferences) => {
        const newValue = !preferences[key]
        setPreferences(prev => ({
            ...prev,
            [key]: newValue
        }))

        // Handle dark mode toggle
        if (key === 'darkMode') {
            if (newValue) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
            toggleTheme()
        }
    }

    const handleSelectChange = (key: keyof UserPreferences, value: string) => {
        setPreferences(prev => ({
            ...prev,
            [key]: value
        }))

        // Handle currency change
        if (key === 'currency') {
            setCurrency(value as any)
        }
    }

    const handleSave = async () => {
        setIsLoading(true)
        setMessage(null)

        try {
            const response = await fetch('/api/user/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(preferences),
            })

            if (!response.ok) {
                throw new Error('Failed to update preferences')
            }

            setMessage({ type: 'success', text: 'Preferences updated successfully' })
            router.refresh()
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to update preferences'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 text-gray-900 dark:text-gray-100">
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-600 dark:bg-green-900 dark:text-green-200' : 'bg-red-50 text-red-600 dark:bg-red-900 dark:text-red-200'}`}>
                    {message.text}
                </div>
            )}

            <div className="space-y-6">
                {/* Notification Preferences */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <Bell className="h-5 w-5" />
                        Notification Preferences
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">Email Notifications</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Receive booking updates via email</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.emailNotifications}
                                    onChange={() => handleToggle('emailNotifications')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">SMS Notifications</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Receive booking updates via SMS</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.smsNotifications}
                                    onChange={() => handleToggle('smsNotifications')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                            </label>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">Marketing Emails</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Receive promotional offers and updates</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.marketingEmails}
                                    onChange={() => handleToggle('marketingEmails')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Display Preferences */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <Moon className="h-5 w-5" />
                        Display Preferences
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">Dark Mode</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Use dark theme throughout the app</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={preferences.darkMode}
                                    onChange={() => handleToggle('darkMode')}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Language and Currency */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                        <Globe className="h-5 w-5" />
                        Language and Currency
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Language
                            </label>
                            <select
                                value={preferences.language}
                                onChange={(e) => handleSelectChange('language', e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            >
                                <option value="en">English</option>
                                <option value="es">Spanish</option>
                                <option value="fr">French</option>
                                <option value="de">German</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Currency
                            </label>
                            <select
                                value={preferences.currency}
                                onChange={(e) => handleSelectChange('currency', e.target.value)}
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                                <option value="GBP">GBP (£)</option>
                                <option value="JPY">JPY (¥)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    {isLoading ? 'Saving...' : 'Save Preferences'}
                </button>
            </div>
        </div>
    )
} 