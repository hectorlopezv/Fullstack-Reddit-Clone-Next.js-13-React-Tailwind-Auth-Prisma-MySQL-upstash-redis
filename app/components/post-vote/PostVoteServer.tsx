import getSession from "@/app/actions/getSession";
import { Post, Vote, VoteType } from "@prisma/client";
import { notFound } from "next/navigation";
import PostVoteClient from "./PostVoteClient";
type PostWithVotes = Post & { votes: Vote[] };
type Props = {
  postId: string;
  initialVotesAmt?: number;
  initialVote?: VoteType;
  getData?: () => Promise<PostWithVotes | null>;
};

export default async function PostVoteServer({
  getData,
  postId,
  initialVote,
  initialVotesAmt,
}: Props) {
  const session = await getSession();

  let _votesAmt: number = 0;
  let _currentVote: VoteType | null | undefined = null;

  if (getData) {
    const post = await getData();
    if (!post) {
      notFound();
    }
    _votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") {
        return acc + 1;
      }
      if (vote.type === "DOWN") {
        return acc - 1;
      }
      return acc;
    }, 0);
    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user.id
    )?.type;
  } else {
    _votesAmt = initialVotesAmt || 0;
    _currentVote = initialVote;
  }
  return (
    <PostVoteClient
      postId={postId}
      initialVoteCount={_votesAmt}
      initialVotte={_currentVote}
    />
  );
}
