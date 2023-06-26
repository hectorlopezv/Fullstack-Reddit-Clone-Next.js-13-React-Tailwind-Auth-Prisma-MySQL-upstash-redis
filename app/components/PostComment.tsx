"use client";
import { useRef, useState } from "react";
import UserAvatar from "./UserAvatar";
import { Comment, CommentVote, User, VoteType } from "@prisma/client";
import { formatTimeToNow } from "../lib/utils";
import CommentVotes from "./CommentVotes";
import { Button } from "./Button";
import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/TextArea";
import { Input } from "./ui/Input";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "../lib/validators/comment";
import axios from "axios";
import { useToast } from "../hooks/use-toast";
type ExtendedComment = Comment & { votes: CommentVote[]; author: User };
type Props = {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote?: Pick<CommentVote, "type"> | null;
  postId: string;
};

export default function PostComment({
  comment,
  postId,
  votesAmt,
  currentVote,
}: Props) {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isReplying, setIsReplying] = useState(false);
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const { toast } = useToast();
  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };
      const { data } = await axios.patch(
        "/api/subreddit/post/comment",
        payload
      );
      return data;
    },
    onError(error, variables, context) {
      return toast({
        title: "Something went wrong",
        description: "Your comment was not posted. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      if (data) {
        setInput("");
        setIsReplying(false);
      }
      router.refresh();
    },
  });
  return (
    <div ref={commentRef} className="flex flex-col">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />
        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(comment.createdAt)}
          </p>
        </div>
      </div>
      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>
      <div className="flex gap-2 items-center flex-wrap">
        <CommentVotes
          commentId={comment.id}
          initialVoteCount={votesAmt}
          initialVotte={currentVote}
        />
        <Button
          aria-aria-label="reply"
          variant="ghost"
          size="xs"
          onClick={() => {
            if (!session) {
              return router.push("/sign-in");
            }
            setIsReplying(true);
          }}
        >
          <MessageSquare size={16} className="h-4 w-4 mr-1.5" />
          Reply
        </Button>
        {isReplying ? (
          <div className="grid w-full gap-1.5">
            <Label> Your Commnet</Label>
            <div className="mt-2">
              <Textarea
                id="comment"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
                placeholder="What are your thoughts?"
              />

              <div className="mt-2 flex justify-end gap-2">
                <Button
                  tabIndex={-1}
                  variant="subtle"
                  onClick={() => setIsReplying(false)}
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isLoading}
                  disabled={Input.length === 0}
                  onClick={() => {
                    if (!input) {
                      return;
                    }
                    postComment({
                      postId,
                      text: input,
                      replyToId: comment.replyToId ?? comment.id,
                    });
                  }}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
