import { useGlobalState } from "@/context/GlobalProvider";
import FetchClass from "@/service/fetch";
// import { getHost } from "@/utils/getHost";
import { useEffect } from "react";

export default function useFetchUserList() {
  const { participants, setParticipants } = useGlobalState();
  const fetchInstance = FetchClass.getInstance();

  const handleFetchUserList = async () => {
    try {
      console.log(process.env.NEXT_PUBLIC_BASEPATH);
      // console.log(window.location.pathname);
      const baseUrl =
        typeof window !== "undefined" ? window.location.origin : "";
      // console.log(baseUrl);
      const url = `${baseUrl}/${process.env.NEXT_PUBLIC_BASEPATH}/api/user/list`;

      const options = { method: "GET" }; // 요청 메서드와 필요한 옵션
      const responseData = await fetchInstance.runFetch(url, options);
      setParticipants(responseData.users); // 응답 데이터 상태에 저장
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (!participants || participants.length === 0) {
      handleFetchUserList();
    }
  }, [participants]);

  return { participants, setParticipants };
}
