"use client";
import { User } from "@prisma/client";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import UserAvatar from "./UserAvatar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/DropdownMenu";
import Link from "next/link";
import { signOut } from "next-auth/react";

type Props = {
  user: Pick<User, "name" | "image" | "email">;
};

export default function UserAccountNav({ user }: Props) {
  const onSelectHandler = (e: Event) => {
    e.preventDefault();
    signOut({ callbackUrl: `${window.location.origin}/sign-in` });
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          className="h-10 w-10"
          user={{
            name: user?.name || null,
            image: user?.image || null,
          }}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.name ? <p className="font-medium">{user.name}</p> : null}
            {user.email ? (
              <p className="w-[200px] truncate text-sm text-zinc-700">
                {user.email}
              </p>
            ) : null}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/">Feed</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/r/create">Create Community</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={onSelectHandler} className="cursor-pointer">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
