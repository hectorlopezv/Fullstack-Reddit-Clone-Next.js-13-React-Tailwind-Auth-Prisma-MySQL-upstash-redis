import prisma from "@/app/lib/prismadb";
import { INFINITE_SCROLLING_PAGINATION_RESULSTS } from "@/config";
import PostFeed from "./PostFeed";
import getSession from "../actions/getSession";
type Props = {};

export default async function GeneralFeed({}: Props) {
  const session = await getSession();
  const followedCommunities = await prisma.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
  });
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map((community) => community.subredditId),
        },
      },
    },
    include: {
      votes: true,
      subreddit: true,
      author: true,
      comments: true,
    },
  });
  return <PostFeed initialPosts={posts} />;
}
