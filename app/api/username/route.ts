import getSession from "@/app/actions/getSession";
import prisma from "@/app/lib/prismadb";
import { userNameValidator } from "@/app/lib/validators/username";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getSession();

    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name } = userNameValidator.parse(body);

    // check if username is taken
    const username = await prisma.user.findFirst({
      where: {
        username: name,
      },
    });

    if (username) {
      return new NextResponse("Username is taken", { status: 409 });
    }

    // update username
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        username: name,
      },
    });

    return new NextResponse("OK");
  } catch (error) {
    error;

    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }

    return new NextResponse(
      "Could not update username at this time. Please try later",
      { status: 500 }
    );
  }
}
