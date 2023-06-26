import getSession from "@/app/actions/getSession";
import { CommentVoteValidator } from "@/app/lib/validators/comment";
import { z } from "zod";
import prisma from "@/app/lib/prismadb";
import { NextResponse } from "next/server";
export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { commentId, voteType } = CommentVoteValidator.parse(body);

    const session = await getSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // check if user has already voted on this post
    const existingVote = await prisma.commentVote.findFirst({
      where: {
        userId: session.user.id,
        commentId,
      },
    });

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await prisma.commentVote.delete({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
        });
        return new NextResponse("OK");
      } else {
        // if vote type is different, update the vote
        await prisma.commentVote.update({
          where: {
            userId_commentId: {
              commentId,
              userId: session.user.id,
            },
          },
          data: {
            type: voteType,
          },
        });
        return new NextResponse("OK");
      }
    }

    // if no existing vote, create a new vote
    await prisma.commentVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        commentId,
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
