import { describe, it, expect } from 'vitest';
import {
  ALL_LOCATIONS,
  SERVICE_LOCATIONS,
  DAY_TRIPS,
  isStandardTransferRoute,
  getMinimumPassengers,
} from '../calculator-data';

describe('calculator-data', () => {
  describe('ALL_LOCATIONS', () => {
    it('should contain all 94 locations', () => {
      expect(ALL_LOCATIONS).toHaveLength(94);
    });

    it('should include Podgorica locations', () => {
      expect(ALL_LOCATIONS).toContain('Podgorica');
      expect(ALL_LOCATIONS).toContain('Podgorica Airport');
      expect(ALL_LOCATIONS).toContain('Podgorica Bus Station');
      expect(ALL_LOCATIONS).toContain('Podgorica Train Station');
    });

    it('should include international locations', () => {
      expect(ALL_LOCATIONS).toContain('Dubrovnik');
      expect(ALL_LOCATIONS).toContain('Tirana - Albania');
      expect(ALL_LOCATIONS).toContain('Sarajevo');
    });
  });

  describe('SERVICE_LOCATIONS', () => {
    it('should contain 17 service locations', () => {
      expect(SERVICE_LOCATIONS).toHaveLength(17);
    });

    it('should include all Podgorica locations', () => {
      expect(SERVICE_LOCATIONS).toContain('Podgorica');
      expect(SERVICE_LOCATIONS).toContain('Podgorica Airport');
      expect(SERVICE_LOCATIONS).toContain('Podgorica Bus Station');
      expect(SERVICE_LOCATIONS).toContain('Podgorica Train Station');
    });

    it('should include key service locations', () => {
      expect(SERVICE_LOCATIONS).toContain('Bar');
      expect(SERVICE_LOCATIONS).toContain('Tivat Airport');
      expect(SERVICE_LOCATIONS).toContain('Sveti Stefan');
    });
  });

  describe('DAY_TRIPS', () => {
    it('should contain 5 placeholder day trips', () => {
      expect(DAY_TRIPS).toHaveLength(5);
    });

    it('should have correct structure for each trip', () => {
      DAY_TRIPS.forEach((trip, index) => {
        expect(trip).toHaveProperty('id', `day-trip-${index + 1}`);
        expect(trip).toHaveProperty('name');
        expect(trip).toHaveProperty('description');
      });
    });
  });

  describe('isStandardTransferRoute', () => {
    describe('Happy Path - Standard Routes', () => {
      it('should return true for Podgorica to service location', () => {
        expect(isStandardTransferRoute('Podgorica', 'Bar')).toBe(true);
        expect(isStandardTransferRoute('Podgorica', 'Tivat Airport')).toBe(true);
        expect(isStandardTransferRoute('Podgorica', 'Sveti Stefan')).toBe(true);
      });

      it('should return true for service location to Podgorica', () => {
        expect(isStandardTransferRoute('Bar', 'Podgorica')).toBe(true);
        expect(isStandardTransferRoute('Tivat Airport', 'Podgorica')).toBe(true);
        expect(isStandardTransferRoute('Sveti Stefan', 'Podgorica')).toBe(true);
      });

      it('should return true for Podgorica Airport to service location', () => {
        expect(isStandardTransferRoute('Podgorica Airport', 'Bar')).toBe(true);
        expect(isStandardTransferRoute('Podgorica Airport', 'Danilovgrad')).toBe(true);
      });

      it('should return true for Podgorica Bus/Train Station to service location', () => {
        expect(isStandardTransferRoute('Podgorica Bus Station', 'Bar')).toBe(true);
        expect(isStandardTransferRoute('Podgorica Train Station', 'Petrovac')).toBe(true);
      });
    });

    describe('Edge Cases - Special Request Routes', () => {
      it('should return false for non-Podgorica to non-service location', () => {
        expect(isStandardTransferRoute('Kotor', 'Budva')).toBe(false);
        expect(isStandardTransferRoute('Herceg Novi', 'Tivat')).toBe(false);
      });

      it('should return false for international routes', () => {
        expect(isStandardTransferRoute('Podgorica', 'Dubrovnik')).toBe(false);
        expect(isStandardTransferRoute('Dubrovnik', 'Podgorica')).toBe(false);
      });

      it('should return false for service location to service location (no Podgorica)', () => {
        expect(isStandardTransferRoute('Bar', 'Tivat Airport')).toBe(false);
        expect(isStandardTransferRoute('Petrovac', 'Sveti Stefan')).toBe(false);
      });

      it('should return true for Podgorica to Podgorica (self-transfer)', () => {
        expect(isStandardTransferRoute('Podgorica', 'Podgorica')).toBe(true);
      });
    });
  });

  describe('getMinimumPassengers', () => {
    describe('Happy Path - Peak Season (April-October)', () => {
      it('should return 4 for April', () => {
        expect(getMinimumPassengers('2026-04-15')).toBe(4);
      });

      it('should return 4 for May', () => {
        expect(getMinimumPassengers('2026-05-20')).toBe(4);
      });

      it('should return 4 for October', () => {
        expect(getMinimumPassengers('2026-10-31')).toBe(4);
      });
    });

    describe('Happy Path - Off-Season (November-March)', () => {
      it('should return 2 for November', () => {
        expect(getMinimumPassengers('2026-11-01')).toBe(2);
      });

      it('should return 2 for December', () => {
        expect(getMinimumPassengers('2026-12-25')).toBe(2);
      });

      it('should return 2 for March', () => {
        expect(getMinimumPassengers('2026-03-31')).toBe(2);
      });
    });

    describe('Edge Cases - Boundary Dates', () => {
      it('should return 2 for March 31 (last day of off-season)', () => {
        expect(getMinimumPassengers('2026-03-31')).toBe(2);
      });

      it('should return 4 for April 1 (first day of peak season)', () => {
        expect(getMinimumPassengers('2026-04-01')).toBe(4);
      });

      it('should return 4 for October 31 (last day of peak season)', () => {
        expect(getMinimumPassengers('2026-10-31')).toBe(4);
      });

      it('should return 2 for November 1 (first day of off-season)', () => {
        expect(getMinimumPassengers('2026-11-01')).toBe(2);
      });
    });
  });
});
