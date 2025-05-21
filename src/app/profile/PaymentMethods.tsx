'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Plus } from 'lucide-react'

interface PaymentMethod {
    id: string
    type: string
    last4: string
    expiryMonth: number
    expiryYear: number
    isDefault: boolean
}

export default function PaymentMethods() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showAddForm, setShowAddForm] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Mock payment methods - replace with actual API call
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
        {
            id: '1',
            type: 'visa',
            last4: '4242',
            expiryMonth: 12,
            expiryYear: 2024,
            isDefault: true
        }
    ])

    const handleAddPaymentMethod = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setMessage(null)

        try {
            // Implement actual payment method addition logic here
            setMessage({ type: 'success', text: 'Payment method added successfully' })
            setShowAddForm(false)
            router.refresh()
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to add payment method'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemovePaymentMethod = async (id: string) => {
        setIsLoading(true)
        setMessage(null)

        try {
            // Implement actual payment method removal logic here
            setPaymentMethods(methods => methods.filter(method => method.id !== id))
            setMessage({ type: 'success', text: 'Payment method removed successfully' })
            router.refresh()
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to remove payment method'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleSetDefault = async (id: string) => {
        setIsLoading(true)
        setMessage(null)

        try {
            // Implement actual set default logic here
            setPaymentMethods(methods =>
                methods.map(method => ({
                    ...method,
                    isDefault: method.id === id
                }))
            )
            setMessage({ type: 'success', text: 'Default payment method updated' })
            router.refresh()
        } catch (error) {
            setMessage({
                type: 'error',
                text: error instanceof Error ? error.message : 'Failed to update default payment method'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            {message && (
                <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Payment Methods</h2>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    Add Payment Method
                </button>
            </div>

            {showAddForm && (
                <div className="p-6 border rounded-lg bg-white">
                    <h3 className="text-lg font-medium mb-4">Add New Payment Method</h3>
                    <form onSubmit={handleAddPaymentMethod} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Card Number
                            </label>
                            <input
                                type="text"
                                placeholder="1234 5678 9012 3456"
                                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expiry Date
                                </label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CVC
                                </label>
                                <input
                                    type="text"
                                    placeholder="123"
                                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                            >
                                {isLoading ? 'Adding...' : 'Add Card'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {paymentMethods.map((method) => (
                    <div
                        key={method.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-white"
                    >
                        <div className="flex items-center gap-4">
                            <CreditCard className="h-8 w-8 text-gray-400" />
                            <div>
                                <p className="font-medium">
                                    {method.type.toUpperCase()} ending in {method.last4}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Expires {method.expiryMonth}/{method.expiryYear}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {!method.isDefault && (
                                <button
                                    onClick={() => handleSetDefault(method.id)}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Set as Default
                                </button>
                            )}
                            {method.isDefault && (
                                <span className="text-sm text-gray-500">Default</span>
                            )}
                            <button
                                onClick={() => handleRemovePaymentMethod(method.id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 