"use client";
import dynamic from "next/dynamic";
import Image from "next/image";

type Props = {
  content: any;
};
const OutPut = dynamic(
  async () => {
    return (await import("editorjs-react-renderer")).default;
  },
  { ssr: false }
);
const style = {
  paragraph: {
    fontSize: "0/875rem",
    lineHeight: "1.25rem",
  },
};
const CustomImageRenderer = ({ data }: any) => {
  const src = data.file.url;
  return (
    <div className="relative w-full min-h-[15rem]">
      <Image alt="image" className="object-contain" fill src={src} />
    </div>
  );
};
const CustomCodeRenderer = ({ data }: any) => {
  return (
    <pre className="bg-gray-800 p-4 rounded-md">
      <code className="text-sm text-gray-100">{data.code}</code>
    </pre>
  );
};
const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};
export default function EditorOutput({ content }: Props) {
  return (
    <OutPut
      style={style}
      data={content}
      className="text-sm"
      renderers={renderers}
    />
  );
}
