import React from 'react'
import CancellationPolicy from '@/components/CancellationPolicy'

const policies = {
    flexible: {
        type: 'flexible' as const,
        description: 'Free cancellation up to 24 hours before check-in. Full refund for cancellations made at least 24 hours before check-in.',
        refundPercentage: 100,
        daysBeforeCheckIn: 1
    },
    moderate: {
        type: 'moderate' as const,
        description: 'Free cancellation up to 5 days before check-in. 50% refund for cancellations made between 5 days and 24 hours before check-in.',
        refundPercentage: 50,
        daysBeforeCheckIn: 5
    },
    strict: {
        type: 'strict' as const,
        description: 'Free cancellation up to 7 days before check-in. 30% refund for cancellations made between 7 days and 24 hours before check-in.',
        refundPercentage: 30,
        daysBeforeCheckIn: 7
    }
}

export default function CancellationPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
                Cancellation Policies
            </h1>

            <div className="space-y-8">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                        Understanding Our Cancellation Policies
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-6">
                        We offer three types of cancellation policies to provide flexibility for both hosts and guests.
                        Each policy has different refund conditions based on when you cancel your booking.
                    </p>
                </div>

                <div className="grid gap-6">
                    <CancellationPolicy policy={policies.flexible} />
                    <CancellationPolicy policy={policies.moderate} />
                    <CancellationPolicy policy={policies.strict} />
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Important Notes
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        <li>All cancellation policies require at least 24 hours notice before check-in</li>
                        <li>Refunds are processed within 5-7 business days</li>
                        <li>Service fees are non-refundable</li>
                        <li>Special circumstances may be considered on a case-by-case basis</li>
                    </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                        Need Help?
                    </h3>
                    <p className="text-blue-800 dark:text-blue-200 mb-4">
                        If you need to cancel your booking or have questions about our cancellation policies,
                        please contact our support team.
                    </p>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    )
} 