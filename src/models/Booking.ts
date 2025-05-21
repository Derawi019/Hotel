import mongoose, { Schema, Document } from 'mongoose'

export interface IBooking extends Document {
    propertyId: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    checkIn: Date
    checkOut: Date
    totalAmount: number
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    createdAt: Date
    updatedAt: Date
}

const BookingSchema = new Schema<IBooking>(
    {
        propertyId: {
            type: Schema.Types.ObjectId,
            ref: 'Property',
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        checkIn: {
            type: Date,
            required: true,
        },
        checkOut: {
            type: Date,
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'cancelled', 'completed'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
)

// Index for efficient querying
BookingSchema.index({ propertyId: 1, checkIn: 1, checkOut: 1 })
BookingSchema.index({ userId: 1, status: 1 })

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema) 