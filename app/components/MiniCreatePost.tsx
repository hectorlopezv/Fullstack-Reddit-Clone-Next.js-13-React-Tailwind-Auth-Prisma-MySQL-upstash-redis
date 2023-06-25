"use client";

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import UserAvatar from "./UserAvatar";
import { Input } from "./ui/Input";
import { Button } from "./Button";
import { ImageIcon, Link2 } from "lucide-react";

type Props = {
  session: Session | null;
};

export default function MiniCreatePost({ session }: Props) {
  const router = useRouter();
  const pathName = usePathname();
  return (
    <div className="overflow-hidden py-2 rounded-md bg-white shadow">
      <div className="h-full px-6 py-4 flex justify-between gap-6">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user.name || null,
              image: session?.user?.image || null,
            }}
          />
          <span className="absolute -top-1 right-0 rounded-full w-3 h-3 bg-green-500 outline outline-2 outline-white" />
        </div>
        <Input
          readOnly
          onClick={() => {
            router.push(pathName + "/submit");
          }}
          placeholder="Create Post"
        />
        <Button
          variant="ghost"
          onClick={() => {
            router.push(pathName + "/submit");
          }}
        >
          <ImageIcon className="text-zinc-600" />
        </Button>

        <Button
          variant="ghost"
          onClick={() => {
            router.push(pathName + "/submit");
          }}
        >
          <Link2 className="text-zinc-600" />
        </Button>
      </div>
    </div>
  );
}
