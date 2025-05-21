import mongoose, { Schema, Document } from 'mongoose'

export interface IWaitingList extends Document {
    propertyId: mongoose.Types.ObjectId
    userId: mongoose.Types.ObjectId
    checkIn: Date
    checkOut: Date
    status: 'pending' | 'notified' | 'booked' | 'expired'
    createdAt: Date
    updatedAt: Date
}

const WaitingListSchema = new Schema<IWaitingList>(
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
        status: {
            type: String,
            enum: ['pending', 'notified', 'booked', 'expired'],
            default: 'pending',
        },
    },
    {
        timestamps: true,
    }
)

// Index for efficient querying
WaitingListSchema.index({ propertyId: 1, status: 1, checkIn: 1, checkOut: 1 })

export default mongoose.models.WaitingList || mongoose.model<IWaitingList>('WaitingList', WaitingListSchema) 