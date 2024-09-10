import { authOption } from "@/app/lib/auth";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
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
        })
    }
    return NextResponse.json({
        user
    });
}

// dont static render
export const dynamic = 'force-dynamic'
