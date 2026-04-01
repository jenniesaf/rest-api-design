import { NextResponse } from "next/server";
import { DAY_TRIPS } from "@/utils/calculator-data";

export async function GET() {
  return NextResponse.json({
    dayTrips: DAY_TRIPS,
  });
}
