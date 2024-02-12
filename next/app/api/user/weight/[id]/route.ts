import { connectMongoDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await connectMongoDB();

  try {
    const body = await request.text();
    const { weight } = JSON.parse(body);
    console.log("body", JSON.parse(body));

    const user = await User.findOne({ _id: params.id });
    // console.log(user);
    user.weight = weight;

    await user.save();
    return NextResponse.json({ success: true });
  } catch (error) {
    // try {
    //   const id = params.id;

    //   const user = await User.findOne({ _id: id }).populate("histories", {
    //     createdAt: -1,
    //   });

    //   const winRate = ((user.times / user.participationCount) * 100).toFixed(2);

    //   // console.log(winRate);
    //   // res.render("detail", { user, winRate });
    //   return NextResponse.json({
    //     user,
    //     winRate,
    //   });
    // } catch (error) {
    //   console.error(error);
    //   return NextResponse.redirect("/");
    // }
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
