import getSession from "@/app/actions/getSession";
import MiniCreatePost from "@/app/components/MiniCreatePost";
import PostFeed from "@/app/components/PostFeed";
import prisma from "@/app/lib/prismadb";
import { INFINITE_SCROLLING_PAGINATION_RESULSTS } from "@/config";
import { notFound } from "next/navigation";
type Props = { params: { communityname: string } };

export default async function Page({ params: { communityname } }: Props) {
  const session = await getSession();

  const subreddit = await prisma.subreddit.findFirst({
    where: {
      name: communityname,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULSTS,
      },
    },
  });
  if (!subreddit) {
    notFound();
  }
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
}
