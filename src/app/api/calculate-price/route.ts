import { NextRequest, NextResponse } from "next/server";
import {
  ALL_LOCATIONS,
  isStandardTransferRoute,
  getMinimumPassengers,
} from "@/utils/calculator-data";

interface CalculatePriceRequest {
  serviceType: "transfer" | "dayTrip";
  date: string;
  days?: number;
  passengers: number;
  start: string;
  end: string;
  tripId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CalculatePriceRequest = await request.json();

    // Validation
    const errors: string[] = [];

    if (!body.serviceType || !["transfer", "dayTrip"].includes(body.serviceType)) {
      errors.push("serviceType is required and must be 'transfer' or 'dayTrip'");
    }

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

    if (body.serviceType === "dayTrip" && (!body.days || body.days < 1)) {
      errors.push("days is required for dayTrip and must be at least 1");
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

    if (body.serviceType === "transfer") {
      if (!body.start) {
        errors.push("start location is required for transfer");
      } else if (!ALL_LOCATIONS.includes(body.start as any)) {
        errors.push("start location is not valid");
      }

      if (!body.end) {
        errors.push("end location is required for transfer");
      } else if (!ALL_LOCATIONS.includes(body.end as any)) {
        errors.push("end location is not valid");
      }
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
    if (body.serviceType === "transfer") {
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

      return NextResponse.json({
        price: mockPrice,
        currency: "EUR",
        details: `Transfer from ${body.start} to ${body.end} for ${body.passengers} passenger(s)`,
      });
    }

    if (body.serviceType === "dayTrip") {
      // Mock price calculation for day trips
      const basePricePerDay = 100;
      const passengerFactor = body.passengers * 15;
      const mockPrice = basePricePerDay * (body.days || 1) + passengerFactor;

      return NextResponse.json({
        price: mockPrice,
        currency: "EUR",
        details: `Day trip for ${body.days || 1} day(s) with ${body.passengers} passenger(s)`,
      });
    }

    return NextResponse.json(
      {
        error: "Invalid service type",
      },
      { status: 400 }
    );
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
