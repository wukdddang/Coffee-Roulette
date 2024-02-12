import React, { Suspense } from "react";

import { headers } from "next/headers";

import UserTableLoading from "@/components/UserTable/UserTableLoading";
const UserTable = React.lazy(() => import("@/components/UserTable/UserTable"));

export const revalidate = 0;

const page = () => {
  // const headersList = headers();
  const forwardedFor = headers().get("x-forwarded-for");
  const forwardedHost = headers().get("x-forwarded-host");
  const realIP = headers().get("x-real-ip");

  console.log(forwardedFor, forwardedHost, realIP);

  return (
    <Suspense fallback={<UserTableLoading />}>
      <UserTable />
    </Suspense>
  );
};

export default page;
