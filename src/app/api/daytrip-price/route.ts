import { NextRequest, NextResponse } from "next/server";
import { getMinimumPassengers } from "@/utils/calculator-data";

interface DayTripPriceRequest {
  date: string;
  days: number;
  passengers: number;
  tripId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: DayTripPriceRequest = await request.json();

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

    if (!body.days || body.days < 1) {
      errors.push("days is required and must be at least 1");
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

    if (!body.tripId) {
      errors.push("tripId is required");
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

    // Mock price calculation for day trips
    const basePricePerDay = 100;
    const passengerFactor = body.passengers * 15;
    const mockPrice = basePricePerDay * body.days + passengerFactor;

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
      details: `Day trip for ${body.days} day(s) with ${body.passengers} passenger(s)`,
      tripId: body.tripId,
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
