"use client";
import { useState } from "react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/TextArea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "../lib/validators/comment";
import axios, { AxiosError } from "axios";
import { Button } from "./Button";
import { useToast } from "../hooks/use-toast";
import useCustomToast from "../hooks/use-custom-toast";
import { useRouter } from "next/navigation";

type Props = { postId: string; replyToId?: string };

export default function CreateComment({ postId, replyToId }: Props) {
  const [input, setinput] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const { loginToast } = useCustomToast();
  const { mutate: createComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };
      const { data } = await axios.patch(
        `/api/subreddit/post/comment`,
        payload
      );
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error?.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "Something went wrong",
        variant: "destructive",
        description: "Please try again later",
      });
    },
    onSuccess: () => {
      router.refresh();
      setinput("");
    },
  });
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your Commnet</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          onChange={(e) => setinput(e.target.value)}
          value={input}
          rows={1}
          placeholder="What are your thoughts?"
        />
        <div className="mt-2 flex justify-end">
          <Button
            disabled={input.length === 0}
            onClick={() => createComment({ postId, text: input, replyToId })}
            isLoading={isLoading}
          >
            Post
          </Button>
        </div>
      </div>
    </div>
  );
}
