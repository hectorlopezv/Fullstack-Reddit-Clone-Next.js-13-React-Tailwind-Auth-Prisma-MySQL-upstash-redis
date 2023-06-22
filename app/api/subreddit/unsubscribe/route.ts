import getSession from "@/app/actions/getSession";
import { SubredditSubscriptionValidator } from "@/app/lib/validators/subreddit";
import { z } from "zod";
import prisma from "@/app/lib/prismadb";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    // check if user has already subscribed or not
    const subscriptionExists = await prisma.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user.id,
      },
    });

    if (!subscriptionExists) {
      return new NextResponse(
        "You've not been subscribed to this subreddit, yet.",
        {
          status: 400,
        }
      );
    }

    // create subreddit and associate it with the user
    await prisma.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json(subredditId);
  } catch (error) {
    error;
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }

    return new NextResponse(
      "Could not unsubscribe from subreddit at this time. Please try later",
      { status: 500 }
    );
  }
}
