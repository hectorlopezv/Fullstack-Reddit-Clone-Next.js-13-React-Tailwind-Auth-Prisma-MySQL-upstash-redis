"use client";

import { cn } from "@/app/lib/utils";
import { Button } from "./Button";
import { HTMLAttributes, useState } from "react";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";
import { useToast } from "@/app/hooks/use-toast";

interface Props extends HTMLAttributes<HTMLDivElement> {}

export default function UserAuthForm({ className, ...props }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const loginWithGoogleHandler = async () => {
    try {
      setIsLoading(true);
      await signIn("google");
    } catch (error) {
      //toast notification error
      toast({
        title: "Error",
        description: "Something went wrong, please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={cn(`flex justify-center`, className)} {...props}>
      <Button
        size="sm"
        className="w-full"
        onClick={loginWithGoogleHandler}
        isLoading={isLoading}
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
      </Button>
    </div>
  );
}
