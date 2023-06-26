"use client";

import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError, isAxiosError } from "axios";
import { CreateSubredditPayload } from "@/app/lib/validators/subreddit";
import { useToast } from "@/app/hooks/use-toast";

import useCustomToast from "@/app/hooks/use-custom-toast";
type Props = {};

export default function Page({}: Props) {
  const [input, setInput] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const { loginToast } = useCustomToast();
  const { isLoading, mutate: createCommunity } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };
      const { data } = await axios.post("/api/subreddit", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        setInput("");
        if (err.response?.status === 409) {
          return toast({
            title: "Community already exists",
            variant: "destructive",
            description: "Please choose another name",
          });
        }
        if (err.response?.status === 422) {
          return toast({
            title: "Invalid community name",
            variant: "destructive",
            description: "Please choose a name beetween 3 and 21 characters",
          });
        }
        if (err.response?.status === 401) {
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
      setInput("");
      toast({
        title: "Community created",
        description: `You can now visit your community at r/${data}`,
      });
      router.push(`/r/${data}`);
    },
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto">
      <div className="relative bg-white w-full h-fit p-4 rounded-lg space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create a Community</h1>
        </div>
        <hr className="bg-zinc-500 h-px" />
        <div>
          <p className="text-lg font-medium">Name</p>
          <p>Community names including capitalization cannot be changed</p>
          <div className="relative">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400">
              r/
            </p>
            <Input
              title="hommit name"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
              placeholder="Seach your community"
            />
          </div>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="subtle" onClick={() => router.back()}>
            Cancel
          </Button>

          <Button
            onClick={() => createCommunity()}
            isLoading={isLoading}
            disabled={input.length === 0}
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
}
