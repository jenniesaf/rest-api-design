import { describe, it, expect } from 'vitest';
import { GET } from '../route';

describe('GET /api/day-trips', () => {
  describe('Happy Path', () => {
    it('should return 200 status', async () => {
      const response = await GET();
      expect(response.status).toBe(200);
    });

    it('should return dayTrips array', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(data).toHaveProperty('dayTrips');
      expect(Array.isArray(data.dayTrips)).toBe(true);
    });

    it('should return 5 day trips', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(data.dayTrips).toHaveLength(5);
    });

    it('should have correct structure for each trip', async () => {
      const response = await GET();
      const data = await response.json();
      
      data.dayTrips.forEach((trip: any) => {
        expect(trip).toHaveProperty('id');
        expect(trip).toHaveProperty('name');
        expect(trip).toHaveProperty('description');
      });
    });

    it('should have unique IDs for each trip', async () => {
      const response = await GET();
      const data = await response.json();
      
      const ids = data.dayTrips.map((trip: any) => trip.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(5);
    });
  });
});
