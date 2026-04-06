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

    // Check if special request is needed for large groups
    if (body.passengers > 8) {
      return NextResponse.json({
        specialRequest: true,
        message:
          "Groups with more than 8 passengers require a special request. Please provide your contact information and we will get back to you with a customized offer.",
      });
    }

    // Mock price calculation for day trips
    let basePrice: number;
    if (body.passengers <= 3) {
      basePrice = 250;
    } else if (body.passengers === 4) {
      basePrice = 400;
    } else if (body.passengers >= 5 && body.passengers <= 6) {
      basePrice = 450;
    } else {
      // 7-8 passengers (we already returned for > 8)
      basePrice = 480;
    }
    const mockPrice = basePrice * body.days;

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
