import getSession from "@/app/actions/getSession";
import prisma from "@/app/lib/prismadb";
import { PostValidator } from "@/app/lib/validators/post";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, content, subredditId } = PostValidator.parse(body);

    const session = await getSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // verify user is subscribed to passed subreddit id
    const subscription = await prisma.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscription) {
      return new NextResponse("Subscribe to post", { status: 403 });
    }

    await prisma.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        subredditId,
      },
    });

    return new NextResponse("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }

    return new NextResponse(
      "Could not post to subreddit at this time. Please try later",
      { status: 500 }
    );
  }
}
