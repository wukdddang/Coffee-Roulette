import { NextApiRequest } from "next";

// utils/getHost.js
export const getHost = (req?: NextApiRequest) => {
  if (req) {
    // 서버 사이드
    return `http://${req.headers.host}`;
  }
  if (typeof window !== "undefined") {
    // 클라이언트 사이드
    console.log(window.location.origin);
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_IP || "http://localhost:3000";
};
