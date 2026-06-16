import { NextRequest, NextResponse } from "next/server";
import { getImages } from "@/services/home/getImages";

export async function GET(request: NextRequest) {
  const rawPage = Number(
    request.nextUrl.searchParams.get("page") || 1
  );

  const page =
    Number.isFinite(rawPage) && rawPage > 0
      ? Math.floor(rawPage)
      : 1;

  const result = await getImages(page, 1);

  return NextResponse.json(result);
}