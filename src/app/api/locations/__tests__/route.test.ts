import { describe, it, expect } from 'vitest';
import { GET } from '../route';

describe('GET /api/locations', () => {
  describe('Happy Path', () => {
    it('should return 200 status', async () => {
      const response = await GET();
      expect(response.status).toBe(200);
    });

    it('should return locations array', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(data).toHaveProperty('locations');
      expect(Array.isArray(data.locations)).toBe(true);
    });

    it('should return all 94 locations', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(data.locations).toHaveLength(94);
    });

    it('should include key locations', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(data.locations).toContain('Podgorica');
      expect(data.locations).toContain('Kotor');
      expect(data.locations).toContain('Budva');
      expect(data.locations).toContain('Tivat Airport');
    });
  });
});
