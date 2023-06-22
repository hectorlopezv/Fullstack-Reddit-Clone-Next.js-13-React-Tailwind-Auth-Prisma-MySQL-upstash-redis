import "@/app/styles/globals.css";
import { Inter } from "next/font/google";
import { cn } from "./lib/utils";

import { Toaster } from "@/app/components/ui/Toaster";
import NavBar from "./components/NavBar";
export const metadata = {
  title: "Homit",
  description:
    "A Reddit clone built with Next.js and TypeScript, upstash, next-auth, and Tailwind CSS, mysql, editor.js and more",
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <NavBar />
        <div className="container max-w-7xl mx-auto h-full pt-12">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}
