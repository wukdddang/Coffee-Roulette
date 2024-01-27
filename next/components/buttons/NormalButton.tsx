"use client";

import { useRouter } from "next/navigation";

type Props = {
  text: string;
  type: "button" | "submit" | "reset";
  className?: string;
  action?: "practice" | "choose";
};

const NormalButton = ({ text, type, className, action }: Props) => {
  const router = useRouter();

  return (
    <button
      type={type}
      className={`${className} tw-shadow-xl`}
      onClick={() => {
        router.push(`/${action}`);
      }}
    >
      {text}
    </button>
  );
};

export default NormalButton;
