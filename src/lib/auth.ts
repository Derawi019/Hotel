import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

export async function validateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (!user || !user.password) {
        return null
    }

    const isCorrectPassword = await bcrypt.compare(
        password,
        user.password
    )

    if (!isCorrectPassword) {
        return null
    }

    return user
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials')
                }

                const user = await validateUser(credentials.email, credentials.password)

                if (!user) {
                    throw new Error('Invalid credentials')
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.name = token.name
                session.user.email = token.email
                session.user.image = token.picture
            }
            return session
        },
        async jwt({ token, user }) {
            const dbUser = await prisma.user.findFirst({
                where: {
                    email: token.email as string
                }
            })

            if (!dbUser) {
                if (user) {
                    token.id = user?.id
                }
                return token
            }

            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image
            }
        }
    }
} 