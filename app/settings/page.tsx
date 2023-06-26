import { Metadata } from "next";
import getSession from "../actions/getSession";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import UserNameForm from "../components/UserNameForm";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings",
};
export default async function Page() {
  const session = await getSession();
  if (!session?.user) {
    redirect(authOptions.pages?.signIn || "/sign-in");
  }
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid items-start gap-8 mb-4">
        <h1 className="font-bold text-3xl md:text-4xl">Settings</h1>
      </div>
      <div className="grid gap-10">
        <UserNameForm
          user={{
            id: session.user.id,
            username: session.user.username || null,
          }}
        />
      </div>
    </div>
  );
}
