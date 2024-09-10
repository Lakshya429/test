
import GoogleProvider from "next-auth/providers/google";
import NextAuth, {type DefaultSession } from "next-auth"
import { prismaClient } from "@/app/lib/db";
import Github from "next-auth/providers/github";

export const authOption =  {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    secret: process.env.NEXTAUTH_SECRET ?? "secret",
    callbacks: {
        async signIn(params : any) {
            console.log(params);
            
            if (!params.user.email) {
                return false;
            }

            try {
                console.log(params);
                
                const existingUser = await prismaClient.user.findUnique({
                    where: {
                        email: params.user.email
                    }
                })
                console.log(existingUser);
                
                if (existingUser) {
                    return true
                }

                await prismaClient.user.create({
                    data: {
                        email: params.user.email,
                        provider: "Google"
                    } 
                })
                return true;
             } catch(e) {
                console.log(e);
                return false;
             }
        },
        async session({session} : any) {
            const dbUser = await prismaClient.user.findUnique({
                where: {
                    email: session.user.email as string
                }
            })
            if (!dbUser) {
                return session;
            }
            return {
                ...session, 
                user: {
                    id: dbUser.id
                }
            }
        }
    }
}