import { NextResponse } from "next/server";
import { SERVICE_LOCATIONS } from "@/utils/calculator-data";

export async function GET() {
  return NextResponse.json({
    serviceLocations: SERVICE_LOCATIONS,
  });
}
