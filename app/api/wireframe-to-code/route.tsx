import { db } from "@/configs/db";
import { wireframeToCodeTable } from "@/configs/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { description, imageUrl, model, uid, email } = await req.json();
  const result = await db
    .insert(wireframeToCodeTable)
    .values({
      uid: uid,
      description: description,
      imageUrl: imageUrl,
      model: model,
      createdBy: email,
    })
    .returning({ id: wireframeToCodeTable.id });

  return NextResponse.json(result);
}

export async function GET(req: NextResponse) {
  const reqUrl = req.url;
  const { searchParams } = new URL(reqUrl);
  const uid = searchParams.get("uid");

  if (uid) {
    const result = await db
      .select()
      .from(wireframeToCodeTable)
      .where(eq(wireframeToCodeTable.uid, uid));
    return NextResponse.json(result[0]);
  }
  return NextResponse.json({ result: "No Record Founnd" });
}
