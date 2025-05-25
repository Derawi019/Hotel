import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { validateUser } from '@/lib/auth'
import { JWT } from 'next-auth/jwt'
import { Session } from 'next-auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db/index'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

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

export const authOptions: AuthOptions = {
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
                    console.error('No email provided by Google')
                    return false
                }

                console.log('Sign in attempt for:', user.email)

                // Check if user exists
                const existingUser = await db.select()
                    .from(users)
                    .where(eq(users.email, user.email))
                    .limit(1)

                console.log('Existing user check:', existingUser)

                // If user doesn't exist, create them
                if (!existingUser || existingUser.length === 0) {
                    console.log('Creating new user:', user.email)
                    const newUser = await db.insert(users)
                        .values({
                            id: uuidv4(),
                            name: user.name || '',
                            email: user.email,
                            imageUrl: user.image || null,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        })
                        .returning()
                    console.log('User created successfully:', newUser)
                } else {
                    // Update existing user's data
                    console.log('Updating existing user:', user.email)
                    const updatedUser = await db.update(users)
                        .set({
                            name: user.name || existingUser[0].name,
                            imageUrl: user.image || existingUser[0].imageUrl,
                            updatedAt: new Date()
                        })
                        .where(eq(users.email, user.email))
                        .returning()
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
                    const userData = await db.select()
                        .from(users)
                        .where(eq(users.email, user.email!))
                        .limit(1)

                    if (userData && userData.length > 0) {
                        token.id = userData[0].id
                        token.name = userData[0].name
                        token.picture = userData[0].imageUrl
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
                    const userData = await db.select()
                        .from(users)
                        .where(eq(users.email, session.user.email!))
                        .limit(1)

                    if (userData && userData.length > 0) {
                        // Update session with database data
                        session.user.id = userData[0].id
                        session.user.name = userData[0].name
                        session.user.image = userData[0].imageUrl
                    }
                } catch (error) {
                    console.error('Error fetching user data for session:', error)
                }
            }
            return session
        }
    }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 