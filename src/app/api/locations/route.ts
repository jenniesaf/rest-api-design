import { NextResponse } from "next/server";
import { ALL_LOCATIONS } from "@/utils/calculator-data";

export async function GET() {
  return NextResponse.json({
    locations: ALL_LOCATIONS,
  });
}
