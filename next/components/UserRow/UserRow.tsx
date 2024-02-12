"use client";

import User from "@/app/types";
import UserWeightButton from "@/components/UserTable/UserWeightButton";
import { useEffect, useState } from "react";

interface UserRowProps {
  user: User;
}

const UserRow = ({ user }: UserRowProps) => {
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";
  const apiUrl = isLocalhost
    ? process.env.NEXT_PUBLIC_API_BASE_URL // 로컬 개발 환경
    : process.env.NEXT_PUBLIC_API_OUTSIDE_BASE_URL; // 외부 IP 환경
  // const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // console.log(apiUrl);
  // console.log(hostname, isLocalhost, apiUrl);

  const [weight, setWeight] = useState(user.weight);

  // 사용자의 무게 변경을 서버에 전송하는 함수
  const updateWeightOnServer = async (newWeight: number) => {
    try {
      const response = await fetch(`${apiUrl}/api/user/weight/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ weight: newWeight }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user weight");
      }

      // 성공적으로 업데이트되었다면 추가적인 처리를 할 수 있습니다.
      console.log("Weight updated successfully");
      alert("업데이트 완료");
    } catch (error) {
      console.error("Error updating weight:", error);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (user.weight !== weight) {
        // debouncedWeight 대신 weight를 직접 비교
        updateWeightOnServer(weight); // debouncedWeight 대신 weight를 사용
      }
    }, 300); // 디바운싱 시간 0.3초 설정

    return () => {
      clearTimeout(handler);
    };
  }, [weight, user.weight]); // debouncedWeight 대신 weight에 의존

  const handleWeightChange = (delta: number) => {
    setWeight((prevWeight) => prevWeight + delta);
  };

  return (
    <div
      key={user._id}
      className="tw-grid tw-grid-cols-8 tw-gap-4 tw-border-b tw-last:border-0 tw-items-center"
    >
      {/* <input
        className="tw-col-span-1 tw-py-2 tw-px-4 tw-text-center"
        type="checkbox"
        checked
        onChange={() => {
          console.log("good");
        }}
      /> */}
      <div className="tw-col-span-2 tw-py-2 tw-px-4 tw-text-center">
        {user.name}
      </div>
      <div className="tw-col-span-2 tw-py-2 tw-px-4 tw-text-center">
        {user.histories.length} 회
      </div>
      <div className="tw-col-span-2 tw-py-2 tw-px-4 tw-text-center">
        {weight.toFixed(1)}
      </div>
      <div className="tw-col-span-2 tw-py-2 tw-px-4 tw-text-center tw-gap-2 tw-flex tw-items-center tw-justify-center">
        <UserWeightButton
          name={user.name}
          weight={weight}
          onWeightChange={handleWeightChange}
        />
      </div>
    </div>
  );
};

export default UserRow;
