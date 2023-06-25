import prisma from "@/app/lib/prismadb";
import { INFINITE_SCROLLING_PAGINATION_RESULSTS } from "@/config";
import PostFeed from "./PostFeed";
type Props = {};

export default async function CustomFeed({}: Props) {
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      subreddit: true,
      author: true,
      comments: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULSTS,
  });
  return <PostFeed initialPosts={posts} />;
}
