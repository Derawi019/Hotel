import { NextResponse } from 'next/server'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Always return test rooms regardless of the ID
        const testRooms = [
            {
                id: 'room_1',
                type: 'Standard',
                price: 100
            },
            {
                id: 'room_2',
                type: 'Deluxe',
                price: 150
            },
            {
                id: 'room_3',
                type: 'Suite',
                price: 250
            }
        ]

        return NextResponse.json(testRooms)
    } catch (error) {
        console.error('Error getting rooms:', error)
        return NextResponse.json(
            { error: 'Failed to get rooms' },
            { status: 500 }
        )
    }
}

// Remove the GET method since we're not using it in the test app 