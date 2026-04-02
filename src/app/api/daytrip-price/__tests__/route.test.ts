import { describe, it, expect } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

// Helper function to create mock request
function createRequest(body: any): NextRequest {
  return new NextRequest('http://localhost:3000/api/daytrip-price', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

describe('POST /api/daytrip-price', () => {
  describe('Happy Path', () => {
    it('should return 200 with price for valid day trip request', async () => {
      const request = createRequest({
        date: '2026-06-15',
        days: 3,
        passengers: 4,
        tripId: 'day-trip-1',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('price');
      expect(data).toHaveProperty('currency', 'EUR');
      expect(data).toHaveProperty('details');
      expect(data).toHaveProperty('tripId', 'day-trip-1');
      expect(data.details).toContain('Day trip for 3 day(s)');
    });

    it('should calculate higher price for more days', async () => {
      const request1 = createRequest({
        date: '2026-06-15',
        days: 2,
        passengers: 4,
        tripId: 'day-trip-1',
      });

      const request2 = createRequest({
        date: '2026-06-15',
        days: 5,
        passengers: 4,
        tripId: 'day-trip-1',
      });

      const response1 = await POST(request1);
      const data1 = await response1.json();

      const response2 = await POST(request2);
      const data2 = await response2.json();

      expect(data2.price).toBeGreaterThan(data1.price);
    });

    it('should calculate higher price for more passengers', async () => {
      const request1 = createRequest({
        date: '2026-06-15',
        days: 3,
        passengers: 4,
        tripId: 'day-trip-1',
      });

      const request2 = createRequest({
        date: '2026-06-15',
        days: 3,
        passengers: 8,
        tripId: 'day-trip-1',
      });

      const response1 = await POST(request1);
      const data1 = await response1.json();

      const response2 = await POST(request2);
      const data2 = await response2.json();

      expect(data2.price).toBeGreaterThan(data1.price);
    });

    it('should accept all placeholder trip IDs', async () => {
      const tripIds = ['day-trip-1', 'day-trip-2', 'day-trip-3', 'day-trip-4', 'day-trip-5'];

      for (const tripId of tripIds) {
        const request = createRequest({
          date: '2026-06-15',
          days: 2,
          passengers: 4,
          tripId,
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.tripId).toBe(tripId);
      }
    });
  });

  describe('Validation Errors', () => {
    it('should return 400 when date is missing', async () => {
      const request = createRequest({
        days: 3,
        passengers: 4,
        tripId: 'day-trip-1',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('details');
      expect(data.details).toContain('date is required');
    });

    it('should return 400 when date is invalid', async () => {
      const request = createRequest({
        date: 'invalid-date',
        days: 3,
        passengers: 4,
        tripId: 'day-trip-1',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details).toContain('date must be a valid date');
    });

    it('should return 400 when date is in the past', async () => {
      const request = createRequest({
        date: '2020-01-01',
        days: 3,
        passengers: 4,
        tripId: 'day-trip-1',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details).toContain('date must be in the future');
    });

    it('should return 400 when days is missing', async () => {
      const request = createRequest({
        date: '2026-06-15',
        passengers: 4,
        tripId: 'day-trip-1',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details).toContain('days is required and must be at least 1');
    });

    it('should return 400 when days is less than 1', async () => {
      const request = createRequest({
        date: '2026-06-15',
        days: 0,
        passengers: 4,
        tripId: 'day-trip-1',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details).toContain('days is required and must be at least 1');
    });

    it('should return 400 when passengers are missing', async () => {
      const request = createRequest({
        date: '2026-06-15',
        days: 3,
        tripId: 'day-trip-1',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details).toContain('passengers is required and must be at least 1');
    });

    it('should return 400 when passengers < seasonal minimum (peak season)', async () => {
      const request = createRequest({
        date: '2026-06-15', // June = peak season, min 4
        days: 3,
        passengers: 2,
        tripId: 'day-trip-1',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details.some((msg: string) => msg.includes('Minimum 4 passengers required'))).toBe(true);
    });

    it('should return 400 when passengers < seasonal minimum (off-season)', async () => {
      const request = createRequest({
        date: '2026-12-15', // December = off-season, min 2
        days: 3,
        passengers: 1,
        tripId: 'day-trip-1',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details.some((msg: string) => msg.includes('Minimum 2 passengers required'))).toBe(true);
    });

    it('should return 400 when tripId is missing', async () => {
      const request = createRequest({
        date: '2026-06-15',
        days: 3,
        passengers: 4,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details).toContain('tripId is required');
    });

    it('should return multiple validation errors', async () => {
      const request = createRequest({
        // Missing all required fields
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(Array.isArray(data.details)).toBe(true);
      expect(data.details.length).toBeGreaterThan(1);
    });
  });

  describe('Edge Cases', () => {
    it('should accept exactly 1 day', async () => {
      const request = createRequest({
        date: '2026-06-15',
        days: 1,
        passengers: 4,
        tripId: 'day-trip-1',
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should accept exactly minimum passengers for peak season', async () => {
      const request = createRequest({
        date: '2026-06-15',
        days: 3,
        passengers: 4, // Exactly minimum for peak season
        tripId: 'day-trip-1',
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should accept exactly minimum passengers for off-season', async () => {
      const request = createRequest({
        date: '2026-12-15',
        days: 3,
        passengers: 2, // Exactly minimum for off-season
        tripId: 'day-trip-1',
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle boundary date (April 10 - peak season)', async () => {
      const request = createRequest({
        date: '2026-04-10',
        days: 3,
        passengers: 4,
        tripId: 'day-trip-1',
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle boundary date (October 31 - last day of peak season)', async () => {
      const request = createRequest({
        date: '2026-10-31',
        days: 3,
        passengers: 4,
        tripId: 'day-trip-1',
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should return 500 for malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/daytrip-price', {
        method: 'POST',
        body: 'invalid json{',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty('error', 'Internal server error');
    });
  });
});
