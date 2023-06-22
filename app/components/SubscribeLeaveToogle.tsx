"use client";
import { Button } from "@/app/components/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubredditPayload } from "../lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import useCustomToast from "../hooks/use-custom-toast";
import { useToast } from "../hooks/use-toast";
import { startTransition, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
};

export default function SubscribeLeaveToogle({
  subredditId,
  subredditName,
  isSubscribed,
}: Props) {
  const { toast } = useToast();
  const { loginToast } = useCustomToast();
  const router = useRouter();
  const { mutate: subscribe, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId: subredditId,
      };
      const { data } = await axios.post(`/api/subreddit/subscribe`, payload);
      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: "Community already exists",
            variant: "destructive",
            description: "Please choose another name",
          });
        }
        if (error.response?.status === 422) {
          return toast({
            title: "Invalid community name",
            variant: "destructive",
            description: "Please choose a name beetween 3 and 21 characters",
          });
        }
        if (error.response?.status === 401) {
          return loginToast();
        }
      }
      toast({
        title: "Something went wrong",
        variant: "destructive",
        description: "Please try again later",
      });
    },
    onSuccess: (data) => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "Subscribed",
        description: `You can now visit your community at r/${subredditName}`,
      });
    },
  });
  const { mutate: subscribeCancel, isLoading: isLoadingSubscancel } =
    useMutation({
      mutationFn: async () => {
        const payload: SubscribeToSubredditPayload = {
          subredditId: subredditId,
        };
        const { data } = await axios.post(
          `/api/subreddit/unsubscribe`,
          payload
        );
        return data as string;
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 409) {
            return toast({
              title: "Community Does not already exists",
              variant: "destructive",
              description: "Please choose another name",
            });
          }
          if (error.response?.status === 422) {
            return toast({
              title: "Invalid community name",
              variant: "destructive",
              description: "Please choose a name beetween 3 and 21 characters",
            });
          }
          if (error.response?.status === 401) {
            return loginToast();
          }
        }
        toast({
          title: "Something went wrong",
          variant: "destructive",
          description: "Please try again later",
        });
      },
      onSuccess: (data) => {
        startTransition(() => {
          router.refresh();
        });
        return toast({
          title: "Unsubscribed",
          description: `You are not part anymore of community at r/${subredditName}`,
        });
      },
    });
  return isSubscribed ? (
    <Button
      isLoading={isLoadingSubscancel}
      onClick={() => subscribeCancel()}
      className="w-full mt-1 mb-4"
    >
      Leave Comunnity
    </Button>
  ) : (
    <Button
      isLoading={isLoading}
      onClick={() => subscribe()}
      className="w-full mt-1 mb-4"
    >
      Join to post
    </Button>
  );
}
