import { connectMongoDB } from "@/lib/mongodb";
import { History } from "@/models/history";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  await connectMongoDB();

  const user = await User.findOne({ name: params.name });
  const history = new History({
    user: user._id,
  });

  user.times++;
  user.histories.push(history._id);

  await user.save();
  await history.save();

  return NextResponse.json({ success: true });
}
