import { User } from "@/models/user";
import React from "react";

const UserTable = async () => {
  const users = await User.find();
  console.log(users);
  return <div>UserTable</div>;
};

export default UserTable;