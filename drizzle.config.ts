import type { Config } from 'drizzle-kit'

export default {
    schema: './prisma/schema.prisma',
    out: './drizzle',
    dialect: 'postgresql',
    driver: 'pglite',
    dbCredentials: {
        url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/booking'
    },
} satisfies Config 