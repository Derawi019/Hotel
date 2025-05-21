import mongoose from 'mongoose'

export function isValidObjectId(id: string): boolean {
    return mongoose.Types.ObjectId.isValid(id)
}

export function validateObjectId(id: string, fieldName: string = 'ID'): { isValid: boolean; error?: string } {
    if (!id) {
        return {
            isValid: false,
            error: `${fieldName} is required`
        }
    }

    if (!isValidObjectId(id)) {
        return {
            isValid: false,
            error: `Invalid ${fieldName} format`
        }
    }

    return { isValid: true }
} 