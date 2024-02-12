import Link from "next/link";

const Header = () => {
  return (
    <nav
      className="tw-flex tw-justify-between tw-items-center
      tw-py-4 tw-px-8 tw-bg-gray-800 tw-text-white tw-shadow-lg"
    >
      <Link href="/" className="tw-text-[24px] tw-font-bold">
        Lumir Coffee Roullet
      </Link>
      <Link
        href="/good"
        className="tw-py-2 tw-px-6 tw-bg-yellow-400 active:tw-bg-yellow-500 hover:tw-bg-yellow-500 tw-rounded-lg"
      >
        명예의 전당
      </Link>
    </nav>
  );
};

export default Header;
