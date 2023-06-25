import { z } from "zod";

const PostVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export { PostVoteValidator };
export type PostVoteRequest = z.infer<typeof PostVoteValidator>;

const CommnetVoteValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
});

export { CommnetVoteValidator };
export type CommentVoteRequest = z.infer<typeof CommnetVoteValidator>;
