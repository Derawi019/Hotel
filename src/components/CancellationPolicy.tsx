import React from 'react'

interface CancellationPolicyProps {
    policy: {
        type: 'flexible' | 'moderate' | 'strict'
        description: string
        refundPercentage: number
        daysBeforeCheckIn: number
    }
}

export default function CancellationPolicy({ policy }: CancellationPolicyProps) {
    const getPolicyColor = (type: string) => {
        switch (type) {
            case 'flexible':
                return 'bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-200'
            case 'moderate':
                return 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200'
            case 'strict':
                return 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-200'
            default:
                return 'bg-gray-50 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
        }
    }

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Cancellation Policy
                </h3>
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getPolicyColor(
                        policy.type
                    )}`}
                >
                    {policy.type.charAt(0).toUpperCase() + policy.type.slice(1)}
                </span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 mb-4">{policy.description}</p>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Refund</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                        {policy.refundPercentage}%
                    </p>
                </div>
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Days before check-in
                    </p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                        {policy.daysBeforeCheckIn} days
                    </p>
                </div>
            </div>
        </div>
    )
} 