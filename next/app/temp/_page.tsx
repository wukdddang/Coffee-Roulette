import UserTable from "@/components/UserTable/UserTable";
import React from "react";

const page = ({ searchParams }: { searchParams: URLSearchParams }) => {
  console.log(searchParams);

  return (
    <div>
      <UserTable />
    </div>
  );
};

export default page;
