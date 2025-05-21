import mongoose, { Schema, Document } from 'mongoose'

export interface IProperty extends Document {
    name: string
    description: string
    price: number
    location: string
    images: string[]
    amenities: string[]
    cancellationPolicy: {
        type: 'flexible' | 'moderate' | 'strict'
        description: string
    }
    ownerId: mongoose.Types.ObjectId
    createdAt: Date
    updatedAt: Date
}

const PropertySchema = new Schema<IProperty>(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        location: {
            type: String,
            required: true,
        },
        images: [{
            type: String,
            required: true,
        }],
        amenities: [{
            type: String,
        }],
        cancellationPolicy: {
            type: {
                type: String,
                enum: ['flexible', 'moderate', 'strict'],
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

// Index for efficient querying
PropertySchema.index({ location: 'text', name: 'text' })
PropertySchema.index({ ownerId: 1 })

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema) 