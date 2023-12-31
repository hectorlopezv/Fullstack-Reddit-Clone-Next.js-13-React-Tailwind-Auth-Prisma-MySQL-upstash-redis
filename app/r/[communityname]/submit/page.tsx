import { Button } from "@/app/components/Button";
import Editor from "@/app/components/Editor";
import prisma from "@/app/lib/prismadb";
import { notFound } from "next/navigation";
type Props = {
  params: {
    communityname: string;
  };
};

export default async function Page({ params: { communityname } }: Props) {
  const subreddit = await prisma.subreddit.findFirst({
    where: {
      name: communityname,
    },
  });
  if (!subreddit) return notFound();

  return (
    <div className="flex flex-col items-start gap-6">
      <div className="border-b border-gray-200 pb-5">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="ml-2 mt-2 text-base font-semibold leading-6 text-gray-900">
            Create Post
          </h3>
          <p className="ml-2 mt-1 truncate text-sm text-gray-500">
            in r/{subreddit.name}
          </p>
        </div>
      </div>
      {/*form */}

      <Editor subredditId={subreddit.id} />
      <div className="w-full flex justify-end">
        <Button type="submit" className="w-full" form="subreddit-post-form">
          Post
        </Button>
      </div>
    </div>
  );
}
