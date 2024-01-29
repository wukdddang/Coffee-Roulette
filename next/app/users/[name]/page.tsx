"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const page = ({ params }: any) => {
  const router = useRouter();
  const [winRate, setWinRate] = useState(0);
  const [histories, setHistories] = useState([]);

  const getUserInfo = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASEPATH}/api/user/${params.name}`
    ).then((res) => res.json());

    setWinRate(res.winRate);
    setHistories(res.user.histories);

    console.log(res.user.histories);
    console.log(res);
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <>
      {!histories || histories.length === 0 ? (
        <div className="tw-flex tw-justify-center tw-items-center tw-relative tw-h-[400px] tw-text-[24px] tw-font-bold">
          유저의 정보를 모으는 중입니다...
        </div>
      ) : (
        <motion.div
          key="user"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, type: "spring" }}
          className="row"
        >
          <div className="col-sm-4"></div>
          <div className="col-sm-4 mt-5">
            <div className="row">
              <div className="col-sm-12">
                <table className="table table-hover">
                  <colgroup>
                    <col style={{ width: "20%" }} />
                    <col style={{ width: "80%" }} />
                  </colgroup>

                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* <% user.histories.forEach((history, index) => { %>
              <tr>
                <th scope="row"><%= index + 1 %></th>
                <td>
                  <% const options = { weekday: 'long', year: 'numeric',
                  month: 'long', day: 'numeric' }; const formattedDate = new
                  Intl.DateTimeFormat('ko-KR', options).format(new
                  Date(history.createdAt)); %> <%= formattedDate %>
                </td>
              </tr>
              <% }) %> */}
                    {histories &&
                      histories.map((history: any, index: number) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{index + 1}</th>
                            <td>{history.createdAt}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
              <div className="col-12">
                <form method="post" target="/user">
                  <div className="form-group d-flex align-items-end justify-content-end">
                    <span className="mb-3 me-2"> winRate: {winRate}%</span>
                    <button
                      type="button"
                      className="btn btn-danger mb-3 me-2"
                      // onclick="location.href='/admin/user/delete/<%= user._id %>'"
                    >
                      삭제하기
                    </button>
                    <button
                      type="button"
                      // onclick="window.location.href='/user';"
                      className="btn btn-warning mb-3"
                      onClick={() => {
                        router.back();
                      }}
                    >
                      뒤로가기
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-sm-4"></div>
        </motion.div>
      )}
    </>
  );
};

export default page;
