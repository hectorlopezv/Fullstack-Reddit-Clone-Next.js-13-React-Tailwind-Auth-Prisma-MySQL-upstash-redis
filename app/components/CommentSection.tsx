import getSession from "../actions/getSession";
import prisma from "@/app/lib/prismadb";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";
import { Button } from "./Button";
type Props = { postId: string };

export default async function CommentSection({ postId }: Props) {
  const session = await getSession();
  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
      replyToId: null,
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });
  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />
      <CreateComment postId={postId} />
      <div className="flex flex-col gap-y-6 mt-4">
        {comments
          .filter((comment) => comment.replyToId === null)
          .map((topLevelComment) => {
            const topLevelCommentReplies = topLevelComment.votes.reduce(
              (acc, vote) => {
                if (vote.type === "UP") {
                  return acc + 1;
                } else if (vote.type === "DOWN") {
                  return acc - 1;
                }
                return acc;
              },
              0
            );
            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id
            );

            return (
              <div key={topLevelComment.id} className="flex flex-col">
                <div className="mb-2">
                  <PostComment
                    comment={topLevelComment}
                    postId={postId}
                    votesAmt={topLevelCommentReplies}
                    currentVote={topLevelCommentVote}
                  />
                </div>
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                      if (vote.type === "UP") {
                        return acc + 1;
                      } else if (vote.type === "DOWN") {
                        return acc - 1;
                      }
                      return acc;
                    }, 0);
                    const replyVote = reply.votes.find(
                      (vote) => vote.userId === session?.user.id
                    );
                    return (
                      <div
                        key={reply.id}
                        className="ml-2 py-2 pl-4 border-l-2 border-zinc-200"
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                          postId={postId}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
}
