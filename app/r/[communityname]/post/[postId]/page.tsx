import { redis } from "@/app/lib/redis";
import { CachedPost } from "@/types/reddis";
import { Post, User, Vote } from "@prisma/client";
import prisma from "@/app/lib/prismadb";
import { notFound } from "next/navigation";
import PostVoteServer from "@/app/components/post-vote/PostVoteServer";
import { Suspense } from "react";
import PostVoteShell from "@/app/components/PostVoteShell";
import { formatTimeToNow } from "@/app/lib/utils";
import EditorOutput from "@/app/components/EditorOutput";
import { Loader2 } from "lucide-react";
import CommentSection from "@/app/components/CommentSection";
type PostWithVotesAndAuthor = Post & { votes: Vote[]; author: User };
type Props = {
  params: {
    postId: string;
  };
};
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
//handle optimization in here with redis
export default async function Page({ params: { postId } }: Props) {
  const cachedPost = (await redis.hgetall(`post:${postId}`)) as CachedPost;

  let post: PostWithVotesAndAuthor | null = null;
  if (!cachedPost) {
    post = await prisma.post.findFirst({
      where: {
        id: postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }
  if (!post && !cachedPost) {
    notFound();
  }
  return (
    <div>
      <div className="h-full flex flex-col sm:flex-row item-center sm:items-start justify-between">
        <Suspense fallback={<PostVoteShell />}>
          <PostVoteServer
            postId={postId ?? cachedPost.id}
            getData={async () => {
              return await prisma.post.findUnique({
                where: {
                  id: postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>
        <div className="sm:w-0 w-full flex-1 bg-white p-4 rounded-sm">
          <p className="max-h-40 mt-1 truncate text-xs text-gray-500">
            Post by u/{post?.author.username ?? cachedPost.authorUsername}{" "}
            {formatTimeToNow(new Date(post?.createdAt ?? cachedPost.createdAt))}
          </p>
          <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
            {post?.title ?? cachedPost.title}
          </h1>
          <EditorOutput content={post?.content ?? cachedPost.content} />

          <Suspense
            fallback={
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            }
          >
            <CommentSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
