import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Calculator } from '../components/Calculator';

// Mock fetch for API calls
global.fetch = vi.fn();

describe('Calculator Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock initial data fetch for locations and trips
    (global.fetch as any).mockImplementation((url: string) => {
      if (url === '/api/locations') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            locations: ['Dubrovnik', 'Cavtat', 'Makarska', 'Split'],
          }),
        });
      }
      if (url === '/api/day-trips') {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            dayTrips: [
              { id: 'day-trip-1', name: 'Montenegro Tour', description: 'Tour of Montenegro' },
              { id: 'day-trip-2', name: 'Mostar Tour', description: 'Tour of Mostar' },
              { id: 'day-trip-3', name: 'Split City Tour', description: 'Tour of Split' },
            ],
          }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });
  });

  describe('Happy Path', () => {
    it('should render the calculator form with all fields', () => {
      render(<Calculator />);

      expect(screen.getByLabelText(/service type/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/passengers/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /calculate price/i })).toBeInTheDocument();
    });

    it('should show transfer fields when transfer is selected', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const serviceSelect = screen.getByLabelText(/service type/i);
      await user.selectOptions(serviceSelect, 'transfer');

      expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/days/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/trip/i)).not.toBeInTheDocument();
    });

    it('should show daytrip fields when daytrip is selected', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      const serviceSelect = screen.getByLabelText(/service type/i);
      await user.selectOptions(serviceSelect, 'daytrip');

      expect(screen.getByLabelText(/days/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/trip/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/from/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/to/i)).not.toBeInTheDocument();
    });

    it('should calculate transfer price successfully', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        price: 150,
        currency: 'EUR',
        season: 'peak',
      };

      // Override fetch mock for this test
      (global.fetch as any).mockImplementation((url: string, options?: any) => {
        if (url === '/api/locations') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ locations: ['Dubrovnik', 'Cavtat'] }),
          });
        }
        if (url === '/api/day-trips') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ dayTrips: [] }),
          });
        }
        if (url === '/api/transfer-price' && options?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: async () => mockResponse,
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<Calculator />);

      await user.selectOptions(screen.getByLabelText(/service type/i), 'transfer');
      await user.type(screen.getByLabelText(/date/i), '2024-07-15');
      await user.clear(screen.getByLabelText(/passengers/i));
      await user.type(screen.getByLabelText(/passengers/i), '4');
      
      // Wait for locations to load
      await waitFor(() => {
        expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
      });
      
      await user.selectOptions(screen.getByLabelText(/from/i), 'Dubrovnik');
      await user.selectOptions(screen.getByLabelText(/to/i), 'Cavtat');
      await user.click(screen.getByRole('button', { name: /calculate price/i }));

      await waitFor(() => {
        expect(screen.getByText(/150 EUR/i)).toBeInTheDocument();
        expect(screen.getByText(/peak season/i)).toBeInTheDocument();
      });
    });

    it('should calculate daytrip price successfully', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        price: 400,
        currency: 'EUR',
        season: 'off',
      };

      // Override fetch mock for this test
      (global.fetch as any).mockImplementation((url: string, options?: any) => {
        if (url === '/api/locations') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ locations: [] }),
          });
        }
        if (url === '/api/day-trips') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ 
              dayTrips: [
                { id: 'day-trip-1', name: 'Montenegro Tour', description: 'Tour of Montenegro' },
              ],
            }),
          });
        }
        if (url === '/api/daytrip-price' && options?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: async () => mockResponse,
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<Calculator />);

      await user.selectOptions(screen.getByLabelText(/service type/i), 'daytrip');
      await user.type(screen.getByLabelText(/date/i), '2024-03-15');
      await user.clear(screen.getByLabelText(/passengers/i));
      await user.type(screen.getByLabelText(/passengers/i), '2');
      
      // Wait for trips to load
      await waitFor(() => {
        expect(screen.getByLabelText(/days/i)).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText(/days/i), '3');
      await user.selectOptions(screen.getByLabelText(/trip/i), 'day-trip-1');
      await user.click(screen.getByRole('button', { name: /calculate price/i }));

      await waitFor(() => {
        expect(screen.getByText(/400 EUR/i)).toBeInTheDocument();
        expect(screen.getByText(/off season/i)).toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    it('should show error when date is missing', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      await user.selectOptions(screen.getByLabelText(/service type/i), 'transfer');
      await user.type(screen.getByLabelText(/passengers/i), '4');
      await user.click(screen.getByRole('button', { name: /calculate price/i }));

      await waitFor(() => {
        expect(screen.getByText(/date is required/i)).toBeInTheDocument();
      });
    });

    it('should show error when passengers field is cleared', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      await user.selectOptions(screen.getByLabelText(/service type/i), 'transfer');
      await user.type(screen.getByLabelText(/date/i), '2024-07-15');
      
      // Wait for locations to load
      await waitFor(() => {
        expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
      });
      
      await user.selectOptions(screen.getByLabelText(/from/i), 'Dubrovnik');
      await user.selectOptions(screen.getByLabelText(/to/i), 'Cavtat');
      
      // Clear passengers field (becomes 0)
      await user.clear(screen.getByLabelText(/passengers/i));
      await user.click(screen.getByRole('button', { name: /calculate price/i }));

      await waitFor(() => {
        expect(screen.getByText(/passengers must be at least 1/i)).toBeInTheDocument();
      });
    });

    it('should show error when passengers is 0', async () => {
      const user = userEvent.setup();
      render(<Calculator />);

      await user.selectOptions(screen.getByLabelText(/service type/i), 'transfer');
      await user.type(screen.getByLabelText(/date/i), '2024-07-15');
      
      // Wait for locations to load
      await waitFor(() => {
        expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
      });
      
      await user.selectOptions(screen.getByLabelText(/from/i), 'Dubrovnik');
      await user.selectOptions(screen.getByLabelText(/to/i), 'Cavtat');
      
      // Set passengers to 0
      const passengersInput = screen.getByLabelText(/passengers/i);
      await user.clear(passengersInput);
      await user.type(passengersInput, '0');
      await user.click(screen.getByRole('button', { name: /calculate price/i }));

      await waitFor(() => {
        expect(screen.getByText(/passengers must be at least 1/i)).toBeInTheDocument();
      });
    });
  });

  describe('Special Requests', () => {
    it('should display special request message when returned from API', async () => {
      const user = userEvent.setup();
      const mockResponse = {
        specialRequest: true,
        message: 'This route requires a special request. Please contact us.',
      };

      // Override fetch mock for this test
      (global.fetch as any).mockImplementation((url: string, options?: any) => {
        if (url === '/api/locations') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ locations: ['Dubrovnik', 'Makarska'] }),
          });
        }
        if (url === '/api/day-trips') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ dayTrips: [] }),
          });
        }
        if (url === '/api/transfer-price' && options?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: async () => mockResponse,
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<Calculator />);

      await user.selectOptions(screen.getByLabelText(/service type/i), 'transfer');
      await user.type(screen.getByLabelText(/date/i), '2024-07-15');
      const passengersInput = screen.getByLabelText(/passengers/i);
      await user.clear(passengersInput);
      await user.type(passengersInput, '4');
      
      // Wait for locations to load
      await waitFor(() => {
        expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
      });
      
      await user.selectOptions(screen.getByLabelText(/from/i), 'Dubrovnik');
      await user.selectOptions(screen.getByLabelText(/to/i), 'Makarska');
      await user.click(screen.getByRole('button', { name: /calculate price/i }));

      await waitFor(() => {
        // Check that the API message is displayed
        expect(screen.getByText(/this route requires a special request/i)).toBeInTheDocument();
        expect(screen.getByText(/please contact us for pricing/i)).toBeInTheDocument();
      });
    });
  });

  describe('API Error Handling', () => {
    it('should display error message when API returns 400', async () => {
      const user = userEvent.setup();
      const mockError = {
        error: 'Validation failed',
        details: ['Minimum 4 passengers required for the selected date (season)'],
      };

      // Override fetch mock for this test
      (global.fetch as any).mockImplementation((url: string, options?: any) => {
        if (url === '/api/locations') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ locations: ['Dubrovnik', 'Cavtat'] }),
          });
        }
        if (url === '/api/day-trips') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ dayTrips: [] }),
          });
        }
        if (url === '/api/transfer-price' && options?.method === 'POST') {
          return Promise.resolve({
            ok: false,
            status: 400,
            json: async () => mockError,
          });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<Calculator />);

      await user.selectOptions(screen.getByLabelText(/service type/i), 'transfer');
      await user.type(screen.getByLabelText(/date/i), '2024-07-15');
      const passengersInput = screen.getByLabelText(/passengers/i);
      await user.clear(passengersInput);
      await user.type(passengersInput, '2'); // Only 2 passengers in peak season (needs 4)
      
      // Wait for locations to load
      await waitFor(() => {
        expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
      });
      
      await user.selectOptions(screen.getByLabelText(/from/i), 'Dubrovnik');
      await user.selectOptions(screen.getByLabelText(/to/i), 'Cavtat');
      await user.click(screen.getByRole('button', { name: /calculate price/i }));

      await waitFor(() => {
        expect(screen.getByText(/minimum 4 passengers required/i)).toBeInTheDocument();
      });
    });

    it('should display generic error when API fails', async () => {
      const user = userEvent.setup();

      // Override fetch mock for this test
      (global.fetch as any).mockImplementation((url: string, options?: any) => {
        if (url === '/api/locations') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ locations: ['Dubrovnik', 'Cavtat'] }),
          });
        }
        if (url === '/api/day-trips') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ dayTrips: [] }),
          });
        }
        if (url === '/api/transfer-price' && options?.method === 'POST') {
          return Promise.reject(new Error('Network error'));
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<Calculator />);

      await user.selectOptions(screen.getByLabelText(/service type/i), 'transfer');
      await user.type(screen.getByLabelText(/date/i), '2024-07-15');
      await user.clear(screen.getByLabelText(/passengers/i));
      await user.type(screen.getByLabelText(/passengers/i), '4');
      
      // Wait for locations to load
      await waitFor(() => {
        expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
      });
      
      await user.selectOptions(screen.getByLabelText(/from/i), 'Dubrovnik');
      await user.selectOptions(screen.getByLabelText(/to/i), 'Cavtat');
      await user.click(screen.getByRole('button', { name: /calculate price/i }));

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading state during API call', async () => {
      const user = userEvent.setup();

      // Override fetch mock for this test
      (global.fetch as any).mockImplementation((url: string, options?: any) => {
        if (url === '/api/locations') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ locations: ['Dubrovnik', 'Cavtat'] }),
          });
        }
        if (url === '/api/day-trips') {
          return Promise.resolve({
            ok: true,
            json: async () => ({ dayTrips: [] }),
          });
        }
        if (url === '/api/transfer-price' && options?.method === 'POST') {
          return new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ price: 150, currency: 'EUR', season: 'peak' }),
                }),
              100
            )
          );
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      render(<Calculator />);

      await user.selectOptions(screen.getByLabelText(/service type/i), 'transfer');
      await user.type(screen.getByLabelText(/date/i), '2024-07-15');
      await user.clear(screen.getByLabelText(/passengers/i));
      await user.type(screen.getByLabelText(/passengers/i), '4');
      
      // Wait for locations to load
      await waitFor(() => {
        expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
      });
      
      await user.selectOptions(screen.getByLabelText(/from/i), 'Dubrovnik');
      await user.selectOptions(screen.getByLabelText(/to/i), 'Cavtat');
      await user.click(screen.getByRole('button', { name: /calculate price/i }));

      expect(screen.getByText(/calculating/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /calculating/i })).toBeDisabled();

      await waitFor(() => {
        expect(screen.queryByText(/calculating/i)).not.toBeInTheDocument();
      });
    });
  });
});

