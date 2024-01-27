"use client";
// import UserList from "@/components/user-list/UserList";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaArrowRightToBracket } from "react-icons/fa6";

import useFetchUser from "@/hooks/useFetchUser";
import { imgs, 기본값 } from "public/imgs";

export default function Page() {
  const router = useRouter();
  const { users } = useFetchUser();

  return (
    <>
      {users.length === 0 ? (
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
          className="tw-grid tw-grid-cols-12 tw-px-4 sm:tw-px-2"
        >
          <div className="sm:tw-col-span-2 tw-col-span-0"></div>
          <div className="sm:tw-mt-10 sm:tw-col-span-8 tw-col-span-12">
            <table className="table table-hover">
              <colgroup>
                <col className="tw-w-[1%]" />
                <col className="tw-w-[10%] sm:tw-w-[5%]" />
                <col className="tw-w-[8%] sm:tw-w-[5%]" />
                <col className="tw-w-[5%]" />
                <col className="tw-w-[15%] sm:tw-w-[5%]" />
                <col className="tw-w-[3%]" />
              </colgroup>

              <thead>
                <tr className="tw-text-[10px] sm:tw-text-[16px]">
                  <th>Rank</th>
                  <th>사진</th>
                  <th>이름</th>
                  <th>걸린 횟수</th>
                  <th>가중치</th>
                  <th>상세기록</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => {
                  const userImg = imgs.find((img) => img.name === user.name);

                  return (
                    <tr
                      key={user.name}
                      className="tw-text-[10px] sm:tw-text-[12px]"
                    >
                      <td>{index + 1}</td>
                      <td>
                        <Image
                          src={userImg?.src || 기본값}
                          alt={user.name}
                          className="sm:tw-w-10 sm:tw-h-10 tw-w-6 tw-h-6 tw-rounded-full tw-shadow-lg"
                        />
                      </td>
                      <td>{user.name}</td>
                      <td>{user.times} 회</td>
                      <td>
                        {user.weight.toFixed(1)}
                        <button
                          className="tw-px-2 tw-py-1 sm:tw-px-4 sm:tw-py-2 tw-ml-[1px] tw-bg-cyan-200 tw-rounded-lg sm:tw-ml-8 tw-shadow-lg"
                          onClick={async () => {
                            console.log("plus");
                            await fetch(
                              `/api/user/increase/weight/${user.name}`,
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
                            fetch(`/api/user/decrease/weight/${user.name}`, {
                              method: "GET",
                            }).then((res) => {
                              if (res.ok) {
                                window.location.reload();
                              }
                            });
                          }}
                        >
                          -
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="tw-text-[10px] sm:tw-text-[16px] tw-bg-blue-500 hover:tw-bg-blue-600 active:tw-bg-blue-600 tw-text-white sm:tw-py-2 sm:tw-px-3 tw-rounded-lg tw-shadow-lg tw-py-[2px] tw-px-[4px] tw-mx-auto"
                          onClick={() => {
                            router.push(`/users/${user._id}`);
                          }}
                        >
                          <FaArrowRightToBracket />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="col-sm-12">
              <form method="post" target="/user">
                <div className="tw-flex align-items-end justify-content-end tw-gap-2">
                  <input
                    type="text"
                    name="name"
                    className="tw-border tw-py-2"
                    id="input_user_name"
                    aria-describedby="emailHelp"
                  />
                  <button
                    type="submit"
                    className="tw-text-[12px] sm:tw-text-[16px] tw-bg-blue-500 hover:tw-bg-blue-600 active:tw-bg-blue-600 tw-text-white tw-py-2 tw-px-3 tw-rounded-lg"
                  >
                    추가
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      router.push("/");
                    }}
                    className="tw-text-[12px] sm:tw-text-[16px] tw-bg-yellow-300 hover:tw-bg-yellow-400 active:tw-bg-yellow-400 tw-text-white tw-py-2 tw-px-3 tw-rounded-lg tw-ml-2"
                  >
                    뒤로가기
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="sm:tw-col-span-2 tw-col-span-0" />
        </motion.div>
      )}
    </>
  );
}
