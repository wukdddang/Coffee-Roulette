import { User } from "@/context/GlobalProvider";
import FetchClass from "@/service/fetch";
// import { getHost } from "@/utils/getHost";
import { useEffect, useState } from "react";

export default function useFetchUser() {
  const [users, setUsers] = useState<User[]>([]); // 응답 데이터 상태
  const fetchInstance = FetchClass.getInstance();

  const handleFetchUser = async () => {
    try {
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      const url = `${baseUrl}/api/user/list`;
      const options = { method: "GET" }; // 요청 메서드와 필요한 옵션
      const responseData = await fetchInstance.runFetch(url, options);
      setUsers(responseData.users); // 응답 데이터 상태에 저장
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (users.length === 0) {
      handleFetchUser();
    }
  }, [users]);

  return { users };
}
