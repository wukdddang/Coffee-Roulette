import { connectMongoDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      name: string;
    };
  }
) {
  await connectMongoDB();
  console.log(params);

  try {
    const user = await User.findOne({ name: params.name });
    console.log(user);
    user.weight += 0.1;

    await user.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
