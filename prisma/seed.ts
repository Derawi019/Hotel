import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // Create hotels first
    const hotels = await Promise.all([
        prisma.hotel.create({
            data: {
                name: 'Luxury Resort & Spa',
                description: 'Experience ultimate luxury with our premium amenities and world-class service.',
                location: 'Cairo, Egypt',
                image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            }
        }),
        prisma.hotel.create({
            data: {
                name: 'Mountain View Lodge',
                description: 'Escape to the mountains and enjoy breathtaking views and outdoor activities.',
                location: 'Luxor, Egypt',
                image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            }
        }),
        prisma.hotel.create({
            data: {
                name: 'Urban Boutique Hotel',
                description: 'Modern comfort in the heart of the city with easy access to attractions.',
                location: 'Alexandria, Egypt',
                image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
            }
        })
    ])

    // Create rooms for each hotel with properties and images
    for (const hotel of hotels) {
        await prisma.room.createMany({
            data: [
                {
                    hotelId: hotel.id,
                    type: 'single',
                    price: 100,
                    description: 'Cozy single room with modern amenities and comfortable furnishings.',
                    image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                    wifi: true,
                    balcony: false,
                    oceanView: false,
                    cityView: true,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true
                },
                {
                    hotelId: hotel.id,
                    type: 'double',
                    price: 150,
                    description: 'Spacious double room with premium amenities and elegant decor.',
                    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
                    wifi: true,
                    balcony: true,
                    oceanView: hotel.location === 'Alexandria, Egypt',
                    cityView: true,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true
                },
                {
                    hotelId: hotel.id,
                    type: 'suite',
                    price: 250,
                    description: 'Luxurious suite featuring separate living area and premium amenities.',
                    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                    wifi: true,
                    balcony: true,
                    oceanView: hotel.location === 'Alexandria, Egypt',
                    cityView: true,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true
                }
            ]
        })
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('test123', 10)
    const testUser = await prisma.user.upsert({
        where: { email: 'test@example.com' },
        update: {},
        create: {
            email: 'test@example.com',
            name: 'Test User',
            password: hashedPassword,
        },
    })

    console.log({ testUser })

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