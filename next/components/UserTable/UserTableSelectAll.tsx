"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const UserTableSelectAll = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const toggleSelectAll = () => {
    // 'all' 파라미터의 현재 값을 가져옴
    const isAllSelected = searchParams.get("all") === "true";

    // 'all' 파라미터 값을 반대로 설정
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("all", !isAllSelected ? "true" : "false");

    // 변경된 쿼리 파라미터와 함께 현재 경로로 이동
    router.push(pathname + "?" + newSearchParams);
  };

  return (
    <input
      type="checkbox"
      checked={searchParams.get("all") === "true"}
      onChange={toggleSelectAll}
    />
  );
};

export default UserTableSelectAll;
