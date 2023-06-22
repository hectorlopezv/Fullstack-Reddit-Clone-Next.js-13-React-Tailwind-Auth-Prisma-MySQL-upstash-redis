"use client";
import { X } from "lucide-react";
import { Button } from "./Button";
import { useRouter } from "next/navigation";

type Props = {};

export default function CloseModal({}: Props) {
  const router = useRouter();
  return (
    <Button
      onClick={() => router.back()}
      aria-label="close modal"
      variant="subtle"
      className="h-6 w-6 p-0 rounded-md"
    >
      <X className="h-4 w-4" />
    </Button>
  );
}
