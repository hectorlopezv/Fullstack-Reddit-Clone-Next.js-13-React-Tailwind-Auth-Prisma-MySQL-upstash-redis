import getSession from "@/app/actions/getSession";
import { SubredditValidator } from "@/app/lib/validators/subreddit";
import { NextResponse } from "next/server";
import prisma from "@/app/lib/prismadb";
import { z } from "zod";
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return new NextResponse("UNAUTHORIZED", { status: 401 });
    }
    const body = await req.json();
    const { name } = SubredditValidator.parse({ name: body.name });
    const subRedditExists = await prisma.subreddit.findFirst({
      where: {
        name: name,
      },
    });
    if (subRedditExists) {
      return new NextResponse("SUBREDDIT_EXISTS", { status: 409 });
    }
    const subreddit = await prisma.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });
    await prisma.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });
    return NextResponse.json(subreddit.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("BAD_REQUEST", { status: 422 });
    }
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 400 });
  }
}
