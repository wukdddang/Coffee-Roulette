import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB, disconnectMongoDB } from "@/lib/mongodb";
import { User } from "@/models/user";
import console from "console";

export async function GET() {
  await connectMongoDB();
  try {
    const users = await User.find();

    return NextResponse.json({ users });
  } catch (error) {
  } finally {
    await disconnectMongoDB();
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    const requestBody = await request.text();
    const { name } = JSON.parse(requestBody);
    const user = new User({ name });

    await user.save();

    return NextResponse.redirect("/user");
  } catch (error) {
    console.error(error);
    return NextResponse.redirect("/");
  } finally {
    await disconnectMongoDB();
  }
}
