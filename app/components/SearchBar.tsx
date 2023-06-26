"use client";
import { useQuery } from "@tanstack/react-query";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
  CommandItem,
} from "./ui/Command";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Prisma, Subreddit } from "@prisma/client";
import { Input } from "./ui/Input";
import { usePathname, useRouter } from "next/navigation";
import { Users } from "lucide-react";
import Link from "next/link";
import debounce from "lodash.debounce";
import { useOnClickOutside } from "../hooks/use-on-click-outside";

type Props = {};

export default function SearchBar({}: Props) {
  const [input, setinput] = useState("");
  const router = useRouter();
  const pahtName = usePathname();
  const request = debounce(async () => {
    refetch();
  }, 500);
  const debounceRequest = useCallback(() => {
    request();
  }, []);
  const {
    data: queryResulsts,
    isFetching,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      if (!input) {
        return [];
      }
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType;
      })[];
    },
    queryKey: ["search-query"],
    enabled: false,
  });
  const isDataNotEmpty = (queryResulsts?.length ?? 0) > 0;
  const commandRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(commandRef, () => {
    setinput("");
  });

  useEffect(() => {
    setinput("");
  }, [pahtName]);
  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg border max-w-lg z-50 overflow-visible"
    >
      <CommandInput
        value={input}
        onValueChange={(text) => {
          setinput(text);
          debounceRequest();
        }}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Search communities.."
      />
      {input.length > 0 ? (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched ? (
            <CommandEmpty>No results found for that query</CommandEmpty>
          ) : null}
          {isDataNotEmpty ? (
            <CommandGroup heading="Community">
              {queryResulsts?.map((subreddit) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/r/${e}`);
                    router.refresh();
                  }}
                  key={subreddit.id}
                  value={subreddit.name}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/r/${subreddit.name}`}>r/{subreddit.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      ) : null}
    </Command>
  );
}
