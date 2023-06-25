"use client";
import type { ExtendedPost } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import axios from "axios";
import { INFINITE_SCROLLING_PAGINATION_RESULSTS } from "@/config";
import { useSession } from "next-auth/react";
import Post from "./Post";
import { Loader2 } from "lucide-react";
type Props = {
  initialPosts: ExtendedPost[];
  subredditName?: string;
};

export default function PostFeed({ initialPosts, subredditName }: Props) {
  const lastPostRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });
  const { data: session, status } = useSession();
  const {
    data,
    fetchNextPage,
    fetchPreviousPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["infinite-query-key"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLLING_PAGINATION_RESULSTS}&page=${pageParam}` +
        (!!subredditName ? `&subreddit=${subredditName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_lastPage, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [initialPosts],
        pageParams: [1],
      },
    }
  );
  const posts = data?.pages.flatMap((page) => page) ?? [];
  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage(); // Load more posts when the last post comes into view
    }
  }, [entry, fetchNextPage]);
  return (
    <ul className=" flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        const votesQuantity = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") {
            return acc + 1;
          } else if (vote.type === "DOWN") {
            return acc - 1;
          }
          return acc;
        }, 0);
        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user?.id
        );
        // last post
        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                post={post}
                commentAmt={post.comments.length}
                subredditName={post.subreddit.name}
                votesAmt={votesQuantity}
                currentVote={currentVote}
              />
            </li>
          );
        }
        return (
          <Post
            key={post.id}
            post={post}
            commentAmt={post.comments.length}
            subredditName={post.subreddit.name}
            votesAmt={votesQuantity}
            currentVote={currentVote}
          />
        );
      })}
      {isFetchingNextPage && (
        <li className="flex justify-center">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </li>
      )}
    </ul>
  );
}
