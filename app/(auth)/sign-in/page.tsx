import { buttonVariants } from "@/app/components/Button";
import SignIn from "@/app/components/SignIn";
import { cn } from "@/app/lib/utils";
import Link from "next/link";

type Props = {};

export default function SignInPage({}: Props) {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl mx-auto flex flex-col items-center justify-center gap-20">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "self-start -mt-20"
          )}
        >
          Home
        </Link>
        <SignIn />
      </div>
    </div>
  );
}
