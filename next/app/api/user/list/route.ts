import { connectMongoDB, disconnectMongoDB } from "@/lib/mongodb";
import { History } from "@/models/history";
import { User } from "@/models/user";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();

  try {
    // 최근 기록 3개를 가져옵니다.
    const latestHistory = await History.find().sort({ createdAt: -1 }).limit(3);

    if (latestHistory.length == 1) {
      // 한 건만 존재하면, 해당 유저의 가중치를 0.7로 설정합니다.
      const users = await User.find();
      users.forEach((user) => {
        if (user._id.toString() === latestHistory[0].user.toString()) {
          user.weight *= 0.7;
        }
      });
      users.sort(() => Math.random() - 0.5);
      return NextResponse.json({ success: true, users });
    }

    // latestHistory가 존재하지 않으면, 유저 목록을 랜덤으로 섞어 반환합니다.

    if (latestHistory.length < 2) {
      const users = await User.find();
      users.sort(() => Math.random() - 0.5);
      return NextResponse.json({ success: true, users });
    }

    // latestHistory 배열의 첫 번째와 두 번째 user_id가 같은지 확인합니다.
    const isSameUser =
      latestHistory[0].user.toString() === latestHistory[1].user.toString();
    const balanceWeight = isSameUser ? 0.5 : 0.7;

    // 유저 목록을 가져오고, 최근 기록에 따라 가중치를 적용합니다.
    let users = await User.find();
    users.forEach((user) => {
      if (user._id.toString() === latestHistory[0].user.toString()) {
        user.weight *= balanceWeight;
      }
    });

    // 유저를 랜덤으로 섞습니다.
    users.sort(() => Math.random() - 0.5);

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
