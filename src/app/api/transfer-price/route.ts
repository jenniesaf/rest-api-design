import { NextRequest, NextResponse } from "next/server";
import {
  ALL_LOCATIONS,
  isStandardTransferRoute,
  getMinimumPassengers,
} from "@/utils/calculator-data";

interface TransferPriceRequest {
  date: string;
  passengers: number;
  start: string;
  end: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: TransferPriceRequest = await request.json();

    // Validation
    const errors: string[] = [];

    if (!body.date) {
      errors.push("date is required");
    } else {
      const dateObj = new Date(body.date);
      if (isNaN(dateObj.getTime())) {
        errors.push("date must be a valid date");
      } else if (dateObj < new Date()) {
        errors.push("date must be in the future");
      }
    }

    if (!body.passengers || body.passengers < 1) {
      errors.push("passengers is required and must be at least 1");
    } else if (body.date) {
      const minPassengers = getMinimumPassengers(body.date);
      if (body.passengers < minPassengers) {
        errors.push(
          `Minimum ${minPassengers} passengers required for the selected date (season)`
        );
      }
    }

    if (!body.start) {
      errors.push("start location is required");
    } else if (!ALL_LOCATIONS.includes(body.start as any)) {
      errors.push("start location is not valid");
    }

    if (!body.end) {
      errors.push("end location is required");
    } else if (!ALL_LOCATIONS.includes(body.end as any)) {
      errors.push("end location is not valid");
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: errors,
        },
        { status: 400 }
      );
    }

    // Business logic
    const isStandard = isStandardTransferRoute(body.start, body.end);

    if (!isStandard) {
      return NextResponse.json({
        specialRequest: true,
        message:
          "This route requires a special request. Please provide your contact information and we will get back to you.",
      });
    }

    // Mock price calculation for standard transfers
    const basePrice = 50;
    const distanceFactor = 1.5;
    const passengerFactor = body.passengers * 10;
    const mockPrice = basePrice + distanceFactor * 20 + passengerFactor;

    // Determine season
    const dateObj = new Date(body.date);
    const month = dateObj.getMonth() + 1; // 1-based
    const day = dateObj.getDate();
    const isPeakSeason = 
      (month === 4 && day >= 1) ||
      (month > 4 && month < 10) ||
      (month === 10 && day <= 31);

    return NextResponse.json({
      price: mockPrice,
      currency: "EUR",
      season: isPeakSeason ? "peak" : "off",
      details: `Transfer from ${body.start} to ${body.end} for ${body.passengers} passenger(s)`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
