"use client";

import useCustomToast from "@/app/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "../Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { PostVoteRequest } from "@/app/lib/validators/vote";
import axios, { AxiosError } from "axios";
import { toast } from "@/app/hooks/use-toast";

type Props = {
  postId: string;
  initialVoteCount: number;
  initialVotte?: VoteType | null;
};

export default function PostVoteClient({
  initialVoteCount,
  postId,
  initialVotte,
}: Props) {
  const { loginToast } = useCustomToast();
  const [votesAmt, setVotesAmt] = useState<number>(initialVoteCount);
  const [currentVote, setcurrentVote] = useState(initialVotte);
  const prevVote = usePrevious(currentVote);
  const { mutate: vote } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType: type,
      };
      await axios.patch("/api/subreddit/post/vote", payload);
    },
    onSuccess: () => {},
    onError: (err, voteType) => {
      if (voteType === "UP") setVotesAmt((prev) => prev - 1);
      else setVotesAmt((prev) => prev + 1);

      // reset current vote
      setcurrentVote(prevVote);

      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong.",
        description: "Your vote was not registered. Please try again.",
        variant: "destructive",
      });
    },
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        // User is voting the same way again, so remove their vote
        setcurrentVote(undefined);
        if (type === "UP") setVotesAmt((prev) => prev - 1);
        else if (type === "DOWN") setVotesAmt((prev) => prev + 1);
      } else {
        // User is voting in the opposite direction, so subtract 2
        setcurrentVote(type);
        if (type === "UP") setVotesAmt((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setVotesAmt((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });
  useEffect(() => {
    setcurrentVote(initialVotte);
  }, [initialVotte]);
  return (
    <div className="flex sm:flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      <Button
        size="sm"
        variant="ghost"
        aria-label="upvote"
        onClick={() => vote("UP")}
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500": currentVote === "UP",
          })}
        />
      </Button>
      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {votesAmt}
      </p>
      <Button
        size="sm"
        variant="ghost"
        aria-label="downvote"
        onClick={() => vote("DOWN")}
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500": currentVote === "DOWN",
          })}
        />
      </Button>
    </div>
  );
}
