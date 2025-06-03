import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
    return new PrismaClient({
        log: ['query', 'error', 'warn'],
        errorFormat: 'pretty',
    })
}

const prisma = global.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
    global.prisma = prisma
}

// Test the database connection
prisma.$connect()
    .then(() => {
        console.log('Successfully connected to the database')
    })
    .catch((error) => {
        console.error('Failed to connect to the database:', error)
        process.exit(1)
    })

export default prisma 