import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import bcrypt from 'bcryptjs'
import prisma from './prisma'

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            email?: string | null;
            name?: string | null;
            image?: string | null;
        }
    }
}

export async function getUserByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email }
    })
}

export async function createUser(data: {
    name: string
    email: string
    password: string
    image?: string | null
}) {
    const hashedPassword = await bcrypt.hash(data.password, 10)
    return prisma.user.create({
        data: {
            ...data,
            password: hashedPassword
        }
    })
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
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

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user || !user?.password) {
                    throw new Error('Invalid credentials')
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!isCorrectPassword) {
                    throw new Error('Invalid credentials')
                }

                return user
            }
        })
    ],
    session: {
        strategy: 'jwt' as const
    },
    pages: {
        signIn: '/auth/signin',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                if (!user.email) {
                    console.error('No email provided')
                    return false
                }

                console.log('Sign in attempt for:', user.email)

                // Check if user exists
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email }
                })

                console.log('Existing user check:', existingUser)

                // If user doesn't exist, create them
                if (!existingUser) {
                    console.log('Creating new user:', user.email)
                    const newUser = await prisma.user.create({
                        data: {
                            name: user.name || '',
                            email: user.email,
                            image: user.image || null,
                            password: '', // Empty password for OAuth users
                        }
                    })
                    console.log('User created successfully:', newUser)
                } else {
                    // Update existing user's data
                    console.log('Updating existing user:', user.email)
                    const updatedUser = await prisma.user.update({
                        where: { email: user.email },
                        data: {
                            name: user.name || existingUser.name,
                            image: user.image || existingUser.image,
                        }
                    })
                    console.log('User updated successfully:', updatedUser)
                }

                return true
            } catch (error) {
                console.error('Error in signIn callback:', error)
                if (error instanceof Error) {
                    console.error('Error details:', {
                        message: error.message,
                        stack: error.stack
                    })
                }
                return false
            }
        },
        async jwt({ token, user, account, profile }) {
            if (user) {
                try {
                    // Get the latest user data from the database
                    const userData = await prisma.user.findUnique({
                        where: { email: user.email! }
                    })

                    if (userData) {
                        token.id = userData.id
                        token.name = userData.name
                        token.picture = userData.image
                    }
                } catch (error) {
                    console.error('Error fetching user data for JWT:', error)
                }
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                try {
                    // Get the latest user data from the database
                    const userData = await prisma.user.findUnique({
                        where: { email: session.user.email! }
                    })

                    if (userData) {
                        // Update session with database data
                        session.user.id = userData.id
                        session.user.name = userData.name
                        session.user.image = userData.image
                    }
                } catch (error) {
                    console.error('Error fetching user data for session:', error)
                }
            }
            return session
        }
    }
} 