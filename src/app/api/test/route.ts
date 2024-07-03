import { NextRequest, NextResponse } from "next/server";
import { insertUserSchema } from "@/server/db/validate-schema";

export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams;
  const name = query.get("name");
  const email = query.get("email");

  const result = insertUserSchema.safeParse({ name, email });
  if (result.success) {
    return NextResponse.json(result.data);
  } else {
    return NextResponse.json(result.error, { status: 400 });
  }
}
