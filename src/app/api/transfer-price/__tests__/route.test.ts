import { describe, it, expect, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

// Helper function to create mock request
function createRequest(body: any): NextRequest {
  return new NextRequest('http://localhost:3000/api/transfer-price', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

describe('POST /api/transfer-price', () => {
  describe('Happy Path - Standard Transfer', () => {
    it('should return 200 with price for Podgorica to Bar', async () => {
      const request = createRequest({
        date: '2026-06-15',
        passengers: 4,
        start: 'Podgorica',
        end: 'Bar',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('price');
      expect(data).toHaveProperty('currency', 'EUR');
      expect(data).toHaveProperty('details');
      expect(data.details).toContain('Transfer from Podgorica to Bar');
    });

    it('should return 200 with price for Podgorica Airport to Sveti Stefan', async () => {
      const request = createRequest({
        date: '2026-05-20',
        passengers: 6,
        start: 'Podgorica Airport',
        end: 'Sveti Stefan',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('price');
      expect(data.price).toBeGreaterThan(0);
    });

    it('should calculate higher price for more passengers', async () => {
      const request1 = createRequest({
        date: '2026-06-15',
        passengers: 4,
        start: 'Podgorica',
        end: 'Bar',
      });

      const request2 = createRequest({
        date: '2026-06-15',
        passengers: 8,
        start: 'Podgorica',
        end: 'Bar',
      });

      const response1 = await POST(request1);
      const data1 = await response1.json();

      const response2 = await POST(request2);
      const data2 = await response2.json();

      expect(data2.price).toBeGreaterThan(data1.price);
    });
  });

  describe('Happy Path - Special Request', () => {
    it('should return special request for unsupported route (Kotor to Budva)', async () => {
      const request = createRequest({
        date: '2026-06-15',
        passengers: 4,
        start: 'Kotor',
        end: 'Budva',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('specialRequest', true);
      expect(data).toHaveProperty('message');
      expect(data.message).toContain('special request');
    });

    it('should return special request for international route', async () => {
      const request = createRequest({
        date: '2026-06-15',
        passengers: 4,
        start: 'Podgorica',
        end: 'Dubrovnik',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty('specialRequest', true);
    });
  });

  describe('Validation Errors', () => {
    it('should return 400 when date is missing', async () => {
      const request = createRequest({
        passengers: 4,
        start: 'Podgorica',
        end: 'Bar',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty('error');
      expect(data).toHaveProperty('details');
      expect(data.details).toContain('date is required');
    });

    it('should return 400 when date is in the past', async () => {
      const request = createRequest({
        date: '2020-01-01',
        passengers: 4,
        start: 'Podgorica',
        end: 'Bar',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details).toContain('date must be in the future');
    });

    it('should return 400 when passengers are missing', async () => {
      const request = createRequest({
        date: '2026-06-15',
        start: 'Podgorica',
        end: 'Bar',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details).toContain('passengers is required and must be at least 1');
    });

    it('should return 400 when passengers < seasonal minimum (peak season)', async () => {
      const request = createRequest({
        date: '2026-06-15', // June = peak season, min 4
        passengers: 2,
        start: 'Podgorica',
        end: 'Bar',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details.some((msg: string) => msg.includes('Minimum 4 passengers required'))).toBe(true);
    });

    it('should return 400 when passengers < seasonal minimum (off-season)', async () => {
      const request = createRequest({
        date: '2026-12-15', // December = off-season, min 2
        passengers: 1,
        start: 'Podgorica',
        end: 'Bar',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details.some((msg: string) => msg.includes('Minimum 2 passengers required'))).toBe(true);
    });

    it('should return 400 when start location is missing', async () => {
      const request = createRequest({
        date: '2026-06-15',
        passengers: 4,
        end: 'Bar',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details).toContain('start location is required');
    });

    it('should return 400 when start location is invalid', async () => {
      const request = createRequest({
        date: '2026-06-15',
        passengers: 4,
        start: 'Invalid Location',
        end: 'Bar',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details).toContain('start location is not valid');
    });

    it('should return 400 when end location is missing', async () => {
      const request = createRequest({
        date: '2026-06-15',
        passengers: 4,
        start: 'Podgorica',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details).toContain('end location is required');
    });

    it('should return 400 when end location is invalid', async () => {
      const request = createRequest({
        date: '2026-06-15',
        passengers: 4,
        start: 'Podgorica',
        end: 'Invalid Location',
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.details).toContain('end location is not valid');
    });

    it('should return multiple validation errors', async () => {
      const request = createRequest({
        // Missing date, passengers, start, end
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(Array.isArray(data.details)).toBe(true);
      expect(data.details.length).toBeGreaterThan(1);
    });
  });

  describe('Edge Cases', () => {
    it('should accept exactly minimum passengers for peak season', async () => {
      const request = createRequest({
        date: '2026-06-15',
        passengers: 4, // Exactly minimum for peak season
        start: 'Podgorica',
        end: 'Bar',
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should accept exactly minimum passengers for off-season', async () => {
      const request = createRequest({
        date: '2026-12-15',
        passengers: 2, // Exactly minimum for off-season
        start: 'Podgorica',
        end: 'Bar',
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle boundary date (April 10 - peak season)', async () => {
      const request = createRequest({
        date: '2026-04-10',
        passengers: 4,
        start: 'Podgorica',
        end: 'Bar',
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });

    it('should handle boundary date (October 31 - last day of peak season)', async () => {
      const request = createRequest({
        date: '2026-10-31',
        passengers: 4,
        start: 'Podgorica',
        end: 'Bar',
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
    });
  });

  describe('Error Handling', () => {
    it('should return 500 for malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/transfer-price', {
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
