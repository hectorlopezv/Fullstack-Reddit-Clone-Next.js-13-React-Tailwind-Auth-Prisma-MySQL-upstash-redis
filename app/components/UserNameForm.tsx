"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import {
  UserNameValidatorType,
  userNameValidator,
} from "../lib/validators/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Button } from "./Button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useToast } from "../hooks/use-toast";
import { useRouter } from "next/navigation";

type Props = {
  user?: Pick<User, "id" | "username">;
};

export default function UserNameForm({ user }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UserNameValidatorType>({
    defaultValues: {
      name: user?.username ?? "",
    },
    resolver: zodResolver(userNameValidator),
  });
  const { mutate: updateUser, isLoading } = useMutation({
    mutationFn: async ({ name }: UserNameValidatorType) => {
      const payload: UserNameValidatorType = {
        name,
      };
      const { data } = await axios.patch("/api/username", payload);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: "Username already taken",
            description: "Please choose another username",
            variant: "destructive",
          });
        }
      }
      return toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Username updated",
        description: "Your username has been updated",
      });
      router.refresh();
    },
  });
  const onSubmit: SubmitHandler<UserNameValidatorType> = (data) => {
    updateUser({ name: data.name });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Your Username</CardTitle>
          <CardDescription>Please change the usewrname name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>
          </div>
          <Label className="sr-only" htmlFor="name">
            Name
          </Label>
          <Input
            id="name"
            className="w-[400px] pl-6"
            size={32}
            {...register("name")}
          />
          {errors?.name ? (
            <p className="px-1 text-xs text-red-600">{errors.name.message}</p>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button isLoading={isLoading} type="submit">
            Change Name
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
