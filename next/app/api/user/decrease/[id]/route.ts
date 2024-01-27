import { NextResponse } from "next/server";
import { connectMongoDB, disconnectMongoDB } from "@/lib/mongodb";
import { User } from "@/models/user";

export async function GET() {
  try {
    await connectMongoDB();

    const users = await User.find();

    return NextResponse.json({ users });
  } catch (error) {
  } finally {
    await disconnectMongoDB();
  }
}

export async function POST() {
  try {
    await connectMongoDB();
  } catch (error) {
  } finally {
    await disconnectMongoDB();
  }
}
