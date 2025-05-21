import React from 'react'

interface BookingPriceProps {
    price: number
    nights: number
    cleaningFee?: number
    serviceFee?: number
    taxes?: number
}

export default function BookingPrice({
    price,
    nights,
    cleaningFee = 0,
    serviceFee = 0,
    taxes = 0,
}: BookingPriceProps) {
    const subtotal = price * nights
    const total = subtotal + cleaningFee + serviceFee + taxes

    return (
        <div className="space-y-4">
            <div className="flex justify-between text-gray-900 dark:text-white">
                <span>${price} x {nights} nights</span>
                <span>${subtotal}</span>
            </div>

            {cleaningFee > 0 && (
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Cleaning fee</span>
                    <span>${cleaningFee}</span>
                </div>
            )}

            {serviceFee > 0 && (
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Service fee</span>
                    <span>${serviceFee}</span>
                </div>
            )}

            {taxes > 0 && (
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                    <span>Taxes</span>
                    <span>${taxes}</span>
                </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between font-semibold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${total}</span>
                </div>
            </div>
        </div>
    )
} 