import { authOption } from "@/app/lib/auth";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST() {
    const session = await getServerSession(authOption);
        console.log(session);
        
        const user = await prismaClient.user.findFirst({
            where: {
                id: session?.user?.id ?? ""
            }
        });

    if (!user) {
        return NextResponse.json({
            message: "Unauthenticated"
        }, {
            status: 403
        });
    }

    try {
        await prismaClient.stream.updateMany({
            where: {
                userId: user.id,
                played: false
            },
            data: {
                played: true,
                playedTs: new Date()
            }
        });

        return NextResponse.json({
            message: "Queue emptied successfully"
        });
    } catch (error) {
        console.error("Error emptying queue:", error);
        return NextResponse.json({
            message: "Error while emptying the queue"
        }, {
            status: 500
        });
    }
}