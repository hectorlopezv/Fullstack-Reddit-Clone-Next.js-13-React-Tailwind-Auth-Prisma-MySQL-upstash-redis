import { buttonVariants } from "../components/Button";
import { useToast } from "./use-toast";
import Link from "next/link";

export default function useCustomToast() {
  const { toast } = useToast();
  const loginToast = () => {
    const { dismiss } = toast({
      title: "You need to be logged in to do that",
      variant: "destructive",
      description: "Please login or create an account",
      action: (
        <Link
          href="/sign-in"
          onClick={() => dismiss()}
          className={buttonVariants({ variant: "outline" })}
        >
          Login
        </Link>
      ),
    });
  };

  return { loginToast };
}
