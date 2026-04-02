import { describe, it, expect } from 'vitest';
import { GET } from '../route';

describe('GET /api/service-locations', () => {
  describe('Happy Path', () => {
    it('should return 200 status', async () => {
      const response = await GET();
      expect(response.status).toBe(200);
    });

    it('should return serviceLocations array', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(data).toHaveProperty('serviceLocations');
      expect(Array.isArray(data.serviceLocations)).toBe(true);
    });

    it('should return 17 service locations', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(data.serviceLocations).toHaveLength(17);
    });

    it('should include Podgorica locations', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(data.serviceLocations).toContain('Podgorica');
      expect(data.serviceLocations).toContain('Podgorica Airport');
      expect(data.serviceLocations).toContain('Podgorica Bus Station');
      expect(data.serviceLocations).toContain('Podgorica Train Station');
    });

    it('should include key service locations', async () => {
      const response = await GET();
      const data = await response.json();
      
      expect(data.serviceLocations).toContain('Bar');
      expect(data.serviceLocations).toContain('Tivat Airport');
      expect(data.serviceLocations).toContain('Sveti Stefan');
    });
  });
});
