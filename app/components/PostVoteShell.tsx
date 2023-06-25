import React from "react";
import { buttonVariants } from "./Button";
import {
  ArrowBigDown,
  ArrowBigUp,
  ArrowDown,
  ArrowDownUp,
  Loader2,
} from "lucide-react";

type Props = {};

export default function PostVoteShell({}: Props) {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigUp size={24} className="w-6 h-6 text-zinc-700" />
      </div>
      <div className="text-center py-2 fount-medium text-sm text-zinc-900">
        <Loader2 size={24} className="w-6 h-6 animate-spin" />
      </div>
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigDown size={24} className="w-6 h-6 text-zinc-700" />
      </div>
    </div>
  );
}
