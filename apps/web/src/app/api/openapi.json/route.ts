import { NextResponse } from "next/server";
import { openApiDocument } from "@/server/openapi";

// Public — no auth needed for API documentation.
export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(openApiDocument);
}
