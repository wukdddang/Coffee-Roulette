import { useRouter } from "next/navigation";

type Props = {
  id?: string;
  icon: React.ReactNode;
  text: string;
  type: "button" | "submit" | "reset";
  className?: string;
  action?: "spin" | "choose" | "inGame";
  onClick?: () => void;
};

const IconButton = ({
  id,
  icon,
  text,
  type,
  className,
  action,
  onClick,
}: Props) => {
  const router = useRouter();

  const handleClick = () => {
    if ((action === "spin" || action === "inGame") && onClick) {
      return onClick();
    } else {
      router.push(`/${action}`);
    }
    // onClick && onClick();
  };

  return (
    <button
      id={id}
      type={type}
      className={`${className} tw-shadow-xl`}
      onClick={handleClick}
    >
      {icon}
      {text}
    </button>
  );
};

export default IconButton;
