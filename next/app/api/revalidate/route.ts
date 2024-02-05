"use server";

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  revalidatePath(`${process.env.NEXT_PUBLIC_BASEPATH}/choose`);

  return NextResponse.json({ success: true });
}
