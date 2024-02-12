import React from "react";
// import UserWeightButton from "./UserWeightButton";
import User from "@/app/types";
import UserRow from "@/components/UserRow/UserRow";
// import UserTableSelectAll from "./UserTableSelectAll";

export const revalidate = 0;

const UserTable = async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // await new Promise((resolve) => setTimeout(resolve, 2500));
  const { users } = (await fetch(`${apiUrl}/api/user`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json())) as { users: User[] };

  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-p-4">
      <h2 className="tw-text-2xl tw-font-semibold tw-mb-4">User List</h2>
      <div className="tw-w-full tw-max-w-4xl">
        <div className="tw-grid tw-grid-cols-8 tw-gap-4 tw-bg-gray-200 tw-rounded-lg">
          {/* <div className="tw-col-span-1 tw-py-2 tw-px-4 tw-font-bold tw-text-center flex gap-2">
            <UserTableSelectAll />
          </div> */}
          <div className="tw-col-span-2 tw-py-2 tw-px-4 tw-font-bold tw-text-center">
            Name
          </div>
          <div className="tw-col-span-2 tw-py-2 tw-px-4 tw-font-bold tw-text-center">
            Histories
          </div>
          <div className="tw-col-span-2 tw-py-2 tw-px-4 tw-font-bold tw-text-center">
            Weight
          </div>
          <div className="tw-col-span-2 tw-py-2 tw-px-4 tw-font-bold tw-text-center">
            Change Weight
          </div>
        </div>
        {users.map((user) => (
          <UserRow key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UserTable;
