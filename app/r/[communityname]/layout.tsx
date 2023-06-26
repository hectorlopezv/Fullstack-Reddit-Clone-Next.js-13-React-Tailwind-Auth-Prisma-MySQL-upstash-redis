import prisma from "@/app/lib/prismadb";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import getSession from "@/app/actions/getSession";
import SubscribeLeaveToogle from "@/app/components/SubscribeLeaveToogle";
import { buttonVariants } from "@/app/components/Button";
import Link from "next/link";

export default async function RLayout({
  children,
  params: { communityname },
}: {
  children: React.ReactNode;
  params: { communityname: string };
}) {
  const session = await getSession();

  const subreddit = await prisma.subreddit.findFirst({
    where: {
      name: communityname,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });

  const subscription = !session?.user
    ? undefined
    : await prisma.subscription.findFirst({
        where: {
          subreddit: {
            name: communityname,
          },
          user: {
            id: session.user.id,
          },
        },
      });
  const isSubscribed = subscription ? true : false;

  if (!subreddit) {
    notFound();
  }

  const memberCount = await prisma.subscription.count({
    where: {
      subreddit: {
        name: communityname,
      },
    },
  });

  return (
    <div className="sm:container mx-w-7xl mx-auto h-full pt-12">
      <div>
        {/*TODO: Button to take us back */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
          <div className="flex flex-col col-span-2 space-y-6">{children}</div>
          {/* info sidebar */}
          <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
            <div className="px-6 py-4">
              <p className="font-semibold py-3">About r/{subreddit.name}</p>
            </div>
            <dl className="divide-y divide-gray-100 px-6 py-4 text-sm leading-6 bg-white">
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Created</dt>
                <dd className="text-gray-700">
                  <time dateTime={subreddit.createdAt.toDateString()}>
                    {format(subreddit.createdAt, "MMM d, yyyy")}
                  </time>
                </dd>
              </div>
              <div className="flex justify-between gap-x-4 py-3">
                <dt className="text-gray-500">Members</dt>
                <dd className="text-gray-700">
                  <div className="text-gray-900">{memberCount}</div>
                </dd>
              </div>
              {subreddit.creatorId === session?.user?.id ? (
                <div className="flex justify-between gap-x-4 py-3">
                  <p className="text-gray-500">You Created this Community</p>
                </div>
              ) : null}
              {subreddit.creatorId !== session?.user?.id ? (
                <SubscribeLeaveToogle
                  subredditId={subreddit.id}
                  subredditName={subreddit.name}
                  isSubscribed={isSubscribed}
                />
              ) : null}
              <Link
                href={`/r/${communityname}/submit`}
                className={buttonVariants({
                  variant: "outline",
                  className: "w-full mb-6",
                })}
              >
                Create Post
              </Link>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
