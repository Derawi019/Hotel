import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    // Create admin user
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'hashed_password_here', // In production, use proper password hashing
        },
    })

    console.log(`Created admin user: ${admin.email}`)

    const hotels = [
        {
            name: 'Nile Palace Hotel',
            description: 'Luxurious hotel overlooking the Nile River in Cairo. Experience the perfect blend of modern comfort and Egyptian hospitality.',
            location: 'Cairo, Egypt',
            image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
            rooms: [
                {
                    type: 'single',
                    price: 100.00,
                    description: 'Cozy single room with modern amenities and city view',
                    image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
                    wifi: true,
                    balcony: false,
                    oceanView: false,
                    cityView: true,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true,
                },
                {
                    type: 'double',
                    price: 150.00,
                    description: 'Spacious double room with two queen beds and Nile view',
                    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                    wifi: true,
                    balcony: true,
                    oceanView: false,
                    cityView: true,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true,
                },
                {
                    type: 'suite',
                    price: 250.00,
                    description: 'Luxurious suite with separate living area and private balcony',
                    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
                    wifi: true,
                    balcony: true,
                    oceanView: false,
                    cityView: true,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true,
                }
            ]
        },
        {
            name: 'Red Sea Resort',
            description: 'Beachfront resort in Sharm El Sheikh with stunning views of the Red Sea. Perfect for diving and water sports enthusiasts.',
            location: 'Sharm El Sheikh, Egypt',
            image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            rooms: [
                {
                    type: 'single',
                    price: 120.00,
                    description: 'Comfortable single room with sea view',
                    image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
                    wifi: true,
                    balcony: true,
                    oceanView: true,
                    cityView: false,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true,
                },
                {
                    type: 'double',
                    price: 180.00,
                    description: 'Spacious double room with direct beach access',
                    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                    wifi: true,
                    balcony: true,
                    oceanView: true,
                    cityView: false,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true,
                },
                {
                    type: 'suite',
                    price: 300.00,
                    description: 'Luxurious beachfront suite with private terrace',
                    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
                    wifi: true,
                    balcony: true,
                    oceanView: true,
                    cityView: false,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true,
                }
            ]
        },
        {
            name: 'Luxor Heritage Hotel',
            description: 'Boutique hotel near the Valley of the Kings, offering a unique blend of modern comfort and ancient Egyptian charm.',
            location: 'Luxor, Egypt',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
            rooms: [
                {
                    type: 'single',
                    price: 90.00,
                    description: 'Cozy single room with temple view',
                    image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
                    wifi: true,
                    balcony: true,
                    oceanView: false,
                    cityView: true,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true,
                },
                {
                    type: 'double',
                    price: 140.00,
                    description: 'Spacious double room with views of the Luxor Temple',
                    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                    wifi: true,
                    balcony: true,
                    oceanView: false,
                    cityView: true,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true,
                },
                {
                    type: 'suite',
                    price: 220.00,
                    description: 'Luxurious suite with Egyptian-inspired decor and private balcony',
                    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
                    wifi: true,
                    balcony: true,
                    oceanView: false,
                    cityView: true,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true,
                }
            ]
        },
        {
            name: 'Alexandria Marina Hotel',
            description: 'Elegant hotel on the Mediterranean coast, offering stunning sea views and easy access to Alexandria\'s historic sites.',
            location: 'Alexandria, Egypt',
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
            rooms: [
                {
                    type: 'single',
                    price: 110.00,
                    description: 'Comfortable single room with sea view',
                    image: 'https://images.unsplash.com/photo-1590490359683-658d3d23f972?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
                    wifi: true,
                    balcony: true,
                    oceanView: true,
                    cityView: false,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true,
                },
                {
                    type: 'double',
                    price: 160.00,
                    description: 'Spacious double room with Mediterranean view',
                    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
                    wifi: true,
                    balcony: true,
                    oceanView: true,
                    cityView: false,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true,
                },
                {
                    type: 'suite',
                    price: 280.00,
                    description: 'Luxurious suite with panoramic sea views and private terrace',
                    image: 'https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80',
                    wifi: true,
                    balcony: true,
                    oceanView: true,
                    cityView: false,
                    minibar: true,
                    airConditioning: true,
                    roomService: true,
                    tv: true,
                    safe: true,
                }
            ]
        }
    ]

    for (const hotelData of hotels) {
        const { rooms, ...hotelInfo } = hotelData
        const hotel = await prisma.hotel.create({
            data: {
                ...hotelInfo,
                rooms: {
                    create: rooms
                }
            }
        })
        console.log(`Created hotel: ${hotel.name}`)
    }

    console.log('Database seeded successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })