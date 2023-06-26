"use client";
import type EditorJS from "@editorjs/editorjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { useToast } from "../hooks/use-toast";
import { uploadFiles } from "../lib/imageUploader/uploadthing";
import { PostCreationRequest, PostValidator } from "../lib/validators/post";
type Props = {
  subredditId: string;
};

export default function Editor({ subredditId }: Props) {
  const ref = useRef<EditorJS>();
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const pathName = usePathname();
  const router = useRouter();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    defaultValues: {
      subredditId: subredditId,
      title: "",
      content: null,
    },
    resolver: zodResolver(PostValidator),
  });

  const { mutate: CreatePost } = useMutation({
    mutationFn: async ({
      subredditId,
      title,
      content,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = {
        subredditId,
        title,
        content,
      };
      const { data } = await axios.post("/api/subreddit/post/create", payload);
      return data;
    },
    onError() {
      return toast({
        title: "Something went wrong",
        description: "Your post was not created, please try again later",
        variant: "destructive",
      });
    },
    onSuccess() {
      const newPathName = pathName.split("/").slice(0, -1).join("/");
      router.push(newPathName);
      router.refresh();

      return toast({
        title: "Success",
        description: "Your post was created successfully",
        variant: "default",
      });
    },
  });
  const onSubmitData: SubmitHandler<PostCreationRequest> = async (
    data: PostCreationRequest
  ) => {
    const blocks = await ref.current?.save();
    const payload: PostCreationRequest = {
      subredditId: subredditId,
      title: data.title,
      content: blocks,
    };
    CreatePost(payload);
  };

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  // upload to uploadthing
                  const [res] = await uploadFiles({
                    files: [file],
                    endpoint: "imageUploader",
                  });

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef?.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();

      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);
  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went wrong",
          description: (value.message as string) || "Something went wrong",
          variant: "destructive",
        });
      }
    }
  }, [errors]);
  const { ref: titleRef, ...rest } = register("title");

  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form
        id="subreddit-post-form"
        className="w-fit"
        onSubmit={handleSubmit(onSubmitData)}
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              // @ts-ignore
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />

          <div id="editor" className="min-h=[500px]" />
        </div>
      </form>
    </div>
  );
}
