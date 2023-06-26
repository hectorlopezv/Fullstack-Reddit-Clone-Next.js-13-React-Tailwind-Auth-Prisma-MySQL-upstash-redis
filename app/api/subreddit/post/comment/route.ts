import getSession from "@/app/actions/getSession";
import { commentValidator } from "@/app/lib/validators/comment";
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/app/lib/prismadb";
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { postId, text, replyToId } = commentValidator.parse(body);
    const session = await getSession();
    if (!session?.user) {
      return new NextResponse("UNAUTHORIZED", { status: 401 });
    }
    await prisma.comment.create({
      data: {
        text,
        postId,
        replyToId,
        authorId: session.user.id,
      },
    });
    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error), { status: 400 });
    }
    return new NextResponse("INTERNAL SERVER ERROR", { status: 500 });
  }
}
