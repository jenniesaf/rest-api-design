"use client";

import { useState, useEffect } from "react";
import type { ServiceType, CalculatorFormData, CalculatorResult } from "../types";

type DayTrip = {
  id: string;
  name: string;
  description: string;
};

export function Calculator() {
  const [formData, setFormData] = useState<CalculatorFormData>({
    serviceType: "transfer",
    date: "",
    passengers: 2,
  });
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<string[]>([]);
  const [trips, setTrips] = useState<DayTrip[]>([]);

  // Fetch locations and trips on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [locationsRes, tripsRes] = await Promise.all([
          fetch("/api/locations"),
          fetch("/api/day-trips"),
        ]);

        if (locationsRes && locationsRes.ok) {
          const locationsData = await locationsRes.json();
          setLocations(locationsData.locations || []);
        }

        if (tripsRes && tripsRes.ok) {
          const tripsData = await tripsRes.json();
          setTrips(tripsData.dayTrips || []);
        }
      } catch (err) {
        // Silent fail for initial data fetch
        console.error("Failed to fetch data:", err);
      }
    };

    fetchData();
  }, []);

  const validateForm = (): string[] => {
    const errors: string[] = [];

    if (!formData.date) {
      errors.push("Date is required");
    }

    if (formData.passengers === undefined || formData.passengers === null || isNaN(formData.passengers)) {
      errors.push("Passengers is required");
    } else if (formData.passengers < 1) {
      errors.push("Passengers must be at least 1");
    }

    if (formData.serviceType === "transfer") {
      if (!formData.from) errors.push("From location is required");
      if (!formData.to) errors.push("To location is required");
    }

    if (formData.serviceType === "daytrip") {
      if (!formData.days) errors.push("Days is required");
      if (!formData.trip) errors.push("Trip is required");
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }

    setIsLoading(true);

    try {
      const endpoint =
        formData.serviceType === "transfer" ? "/api/transfer-price" : "/api/daytrip-price";

      const requestBody =
        formData.serviceType === "transfer"
          ? {
              date: formData.date,
              passengers: formData.passengers,
              start: formData.from!,
              end: formData.to!,
            }
          : {
              serviceType: "daytrip",
              date: formData.date,
              passengers: formData.passengers,
              days: formData.days!,
              trip: formData.trip!,
            };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details && Array.isArray(data.details)) {
          setError(data.details.join(", "));
        } else {
          setError(data.error || "An error occurred");
        }
        return;
      }

      setResult(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceTypeChange = (newType: ServiceType) => {
    setFormData({
      serviceType: newType,
      date: formData.date,
      passengers: formData.passengers,
    });
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Trip Price Calculator</h1>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        {/* Service Type */}
        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium mb-2 text-gray-700">
            Service Type
          </label>
          <select
            id="serviceType"
            value={formData.serviceType}
            onChange={(e) => handleServiceTypeChange(e.target.value as ServiceType)}
            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="transfer">Transfer</option>
            <option value="daytrip">Day Trip</option>
          </select>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium mb-2 text-gray-700">
            Date
          </label>
          <input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Passengers */}
        <div>
          <label htmlFor="passengers" className="block text-sm font-medium mb-2 text-gray-700">
            Passengers
          </label>
          <input
            id="passengers"
            type="number"
            min="1"
            value={formData.passengers}
            onChange={(e) =>
              setFormData({ ...formData, passengers: parseInt(e.target.value) || 0 })
            }
            className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Transfer-specific fields */}
        {formData.serviceType === "transfer" && (
          <>
            <div>
              <label htmlFor="from" className="block text-sm font-medium mb-2 text-gray-700">
                From
              </label>
              <select
                id="from"
                value={formData.from || ""}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="to" className="block text-sm font-medium mb-2 text-gray-700">
                To
              </label>
              <select
                id="to"
                value={formData.to || ""}
                onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Day Trip-specific fields */}
        {formData.serviceType === "daytrip" && (
          <>
            <div>
              <label htmlFor="days" className="block text-sm font-medium mb-2 text-gray-700">
                Days
              </label>
              <input
                id="days"
                type="number"
                min="1"
                value={formData.days || ""}
                onChange={(e) =>
                  setFormData({ ...formData, days: parseInt(e.target.value) || undefined })
                }
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="trip" className="block text-sm font-medium mb-2 text-gray-700">
                Trip
              </label>
              <select
                id="trip"
                value={formData.trip || ""}
                onChange={(e) => setFormData({ ...formData, trip: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select trip</option>
                {trips.map((trip) => (
                  <option key={trip.id} value={trip.id}>
                    {trip.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Calculating..." : "Calculate Price"}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-300 rounded-lg">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="mt-6 p-6 bg-green-50 border border-green-300 rounded-lg">
          {"specialRequest" in result ? (
            <div>
              <p className="font-semibold text-lg mb-2 text-gray-900">Special Request</p>
              <p className="text-gray-700">{result.message}</p>
              <p className="mt-2 text-sm text-gray-600">Please contact us for pricing.</p>
            </div>
          ) : (
            <div>
              <p className="text-3xl font-bold mb-2 text-gray-900">
                {result.price} {result.currency}
              </p>
              {result.season && (
                <p className="text-sm text-gray-600">
                  {result.season === "peak" ? "Peak Season" : "Off Season"}
                </p>
              )}
              {result.details && (
                <p className="text-sm text-gray-500 mt-2">{result.details}</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
