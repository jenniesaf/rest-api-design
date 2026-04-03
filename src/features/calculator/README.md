# Calculator Feature

This feature provides a trip price calculator for transfers and day trips.

## Structure
- `components/` - React components specific to this feature
- `types/` - TypeScript types for calculator forms and state
- `hooks/` - Custom hooks for calculator logic
- `__tests__/` - Tests for calculator components and logic

## Integration
This feature integrates with:
- `GET /api/locations` - Fetch available locations
- `GET /api/service-locations` - Fetch service-specific locations
- `GET /api/day-trips` - Fetch available day trips
- `POST /api/transfer-price` - Calculate transfer price
- `POST /api/daytrip-price` - Calculate day trip price
