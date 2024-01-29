"use client";
// import UserList from "@/components/user-list/UserList";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
// import useFetchUsers from "@/hooks/useFetchUserList";
import { useEffect, useState } from "react";
import useFetchUser from "@/hooks/useFetchUser";
import useFetchUserList from "@/hooks/useFetchUserList";
import { User } from "@/context/GlobalProvider";

export default function Page() {
  const router = useRouter();
  const { users } = useFetchUser();
  const { participants, setParticipants } = useFetchUserList();
  const [selectedPeople, setSelectedPeople] = useState<User[]>(participants);
  const [selectAll, setSelectAll] = useState(true);

  const toggleSelection = (user: User) => {
    setSelectedPeople((prevSelected) => {
      if (prevSelected.includes(user)) {
        return prevSelected.filter((name) => name !== user);
      } else {
        return [...prevSelected, user];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPeople(participants);
    } else {
      setSelectedPeople([]);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    setParticipants(selectedPeople);
    console.log(selectedPeople);
    console.log(users);
  }, [selectedPeople, setParticipants, users]);

  // users 데이터가 로드되면 selectedPeople 상태를 업데이트
  useEffect(() => {
    setSelectedPeople(participants);
  }, [participants]);

  useEffect(() => {
    setSelectedPeople(users);
    console.log(selectedPeople);
  }, []);

  return (
    <>
      {!users || !selectedPeople || selectedPeople.length === 0 ? (
        <div className="tw-flex tw-justify-center tw-items-center tw-relative tw-h-[400px] tw-text-[24px] tw-font-bold">
          유저를 불러오는 중입니다...
        </div>
      ) : (
        <motion.div
          key="users"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="tw-grid sm:tw-grid-cols-10 tw-px-4 sm:tw-px-2"
        >
          <div className="tw-col-span-2"></div>
          <div className="tw-mt-10 tw-col-span-6">
            <table className="table table-hover">
              <colgroup>
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "20%" }} />
              </colgroup>

              <thead>
                <tr className="tw-text-[12px] sm:tw-text-[16px] tw-text-center">
                  <th>참여</th>
                  <th>이름</th>
                  <th>가중치</th>
                  <th>비율 조절</th>
                </tr>
              </thead>
              <tbody>
                {selectedPeople.map((user, index) => {
                  return (
                    <tr
                      key={index}
                      className="tw-text-[12px] sm:tw-text-[16px]"
                    >
                      <td className="tw-text-center">
                        <input
                          type="checkbox"
                          name="user"
                          value={user.name}
                          checked={
                            users.findIndex(
                              (selected) => selected.name === user.name
                            ) !== -1
                          }
                          className="tw-mx-auto tw-w-4 tw-h-4 tw-rounded-sm tw-border tw-border-gray-300 tw-text-green-500 focus:tw-ring-green-500"
                          onChange={() => {
                            toggleSelection(user);
                          }}
                        />
                      </td>
                      <td>{user.name}</td>
                      <td className="tw-text-center">
                        {user.weight.toFixed(1)}
                      </td>
                      <td>
                        <div className="tw-flex tw-items-center tw-justify-center">
                          <span className="tw-flex tw-ml-2 tw-text-[12px] sm:tw-text-[16px]">
                            <button
                              className="tw-px-2 tw-py-1 sm:tw-px-4 sm:tw-py-2 tw-ml-[1px] tw-bg-cyan-200 tw-rounded-lg sm:tw-ml-8 tw-shadow-lg"
                              onClick={() => {
                                console.log("plus");
                                fetch(
                                  `${process.env.NEXT_PUBLIC_BASEPATH}/api/user/increase/weight/${user.name}`,
                                  {
                                    method: "GET",
                                  }
                                ).then((res) => {
                                  if (res.ok) {
                                    window.location.reload();
                                  }
                                });
                              }}
                            >
                              +
                            </button>
                            <button
                              className="tw-px-2 tw-py-1 sm:tw-px-4 sm:tw-py-2 tw-bg-orange-200 tw-rounded-lg sm:tw-ml-2 tw-shadow-lg"
                              onClick={() => {
                                console.log("minus");
                                fetch(
                                  `${process.env.NEXT_PUBLIC_BASEPATH}/api/user/decrease/weight/${user.name}`,
                                  {
                                    method: "GET",
                                  }
                                ).then((res) => {
                                  if (res.ok) {
                                    window.location.reload();
                                  }
                                });
                              }}
                            >
                              -
                            </button>
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="col-sm-12">
              <form method="post" target="/user">
                <div className="tw-flex justify-content-end tw-gap-2">
                  <input
                    type="text"
                    name="name"
                    className="tw-border tw-py-2 tw-w-[160px]"
                    id="input_user_name"
                    aria-describedby="emailHelp"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleSelectAll();
                    }}
                    className="tw-text-[12px] sm:tw-text-[16px] tw-bg-green-500 hover:tw-bg-green-600 active:tw-bg-green-600 tw-text-white tw-py-2 tw-px-3 tw-rounded-lg tw-ml-2"
                  >
                    전체 선택
                  </button>
                  <button
                    type="button"
                    className="tw-text-[12px] sm:tw-text-[16px] tw-bg-blue-500 hover:tw-bg-blue-600 active:tw-bg-blue-600 tw-text-white tw-py-2 tw-px-3 tw-rounded-lg"
                    onClick={() => {
                      router.push("/");
                    }}
                  >
                    확인
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="tw-col-span-2"></div>
        </motion.div>
      )}
    </>
  );
}
