import { z } from "zod";

export const commentValidator = z.object({
  postId: z.string(),
  text: z.string().min(1).max(255),
  replyToId: z.string().optional(),
});

export type CommentRequest = z.infer<typeof commentValidator>;
export const CommentVoteValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export type CommentVoteRequest = z.infer<typeof CommentVoteValidator>;
