import Link from "next/link";
import React from "react";
import { Icons } from "./Icons";
import { buttonVariants } from "./Button";
import getSession from "../actions/getSession";
import UserAccountNav from "./UserAccountNav";
import SearchBar from "./SearchBar";

type Props = {};

export default async function NavBar({}: Props) {
  const session = await getSession();
  return (
    <div
      className="fixed top-0 inset-x-0 h-fit bg-zinc-100 border-b border-b-zinc-300
    z-[10] py-2"
    >
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        {/* Logo */}
        <Link href="/" className="flex gap-2 items-center">
          <Icons.logo className="w-8 h-8 text-zinc-700" />
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            Homit
          </p>
        </Link>
        <SearchBar />
        {session?.user ? (
          <UserAccountNav
            user={{
              name: session.user.name || "",
              email: session.user.email || "",
              image: session.user.image || "",
            }}
          />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
