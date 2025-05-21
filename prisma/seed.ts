import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create hotels first
    const hotels = await Promise.all([
        prisma.hotel.create({
            data: {
                name: 'Luxury Resort & Spa',
                description: 'Experience ultimate luxury with our premium amenities and world-class service.',
                location: 'Miami Beach, FL',
                price: 299,
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            }
        }),
        prisma.hotel.create({
            data: {
                name: 'Mountain View Lodge',
                description: 'Escape to the mountains and enjoy breathtaking views and outdoor activities.',
                location: 'Denver, CO',
                price: 199,
                image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            }
        }),
        prisma.hotel.create({
            data: {
                name: 'Urban Boutique Hotel',
                description: 'Modern comfort in the heart of the city with easy access to attractions.',
                location: 'New York, NY',
                price: 249,
                image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            }
        })
    ])

    // Create rooms for each hotel
    for (const hotel of hotels) {
        await prisma.room.createMany({
            data: [
                {
                    hotelId: hotel.id,
                    type: 'single',
                    price: hotel.price * 0.8
                },
                {
                    hotelId: hotel.id,
                    type: 'double',
                    price: hotel.price
                },
                {
                    hotelId: hotel.id,
                    type: 'suite',
                    price: hotel.price * 1.5
                }
            ]
        })
    }

    console.log('Database has been seeded. 🌱')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })