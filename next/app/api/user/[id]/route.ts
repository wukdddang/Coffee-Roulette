import { connectMongoDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();
  console.log(params);

  try {
    const id = params.id;

    const user = await User.findOne({ _id: id }).populate("histories", {
      createdAt: -1,
    });

    const winRate = ((user.times / user.participationCount) * 100).toFixed(2);

    // console.log(winRate);
    // res.render("detail", { user, winRate });
    return NextResponse.json({
      user,
      winRate,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.redirect("/");
  }
}
