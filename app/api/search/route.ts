import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismadb";
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get("q");
    if (!q) {
      return new NextResponse("Missing query parameter", { status: 400 });
    }
    const results = await prisma.subreddit.findMany({
      where: {
        name: {
          startsWith: q,
        },
      },
      include: {
        _count: true,
      },
      take: 5,
    });
    return NextResponse.json(results);
  } catch (error) {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}
