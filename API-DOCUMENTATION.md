# API Documentation

## Overview
This document describes the REST API endpoints for the Montenegro Trip Calculator. All endpoints return JSON responses.

**Base URL:** `/api`

---

## Endpoints

### 1. GET /api/locations

**Description:** Returns all available locations for transfers and day trips.

**Method:** `GET`

**Authentication:** None

**Request:** No parameters required

**Response (200 OK):**
```json
{
  "locations": [
    "Dubrovnik",
    "Ada Bojana",
    "Andrijevica",
    // ... (96 locations total)
  ]
}
```

**Response Type:**
```typescript
{
  locations: readonly string[]
}
```

**Error Responses:** None (always returns 200)

**Caching:** This endpoint is ideal for caching (data changes infrequently)
- Client-side: Cache for 24 hours
- CDN: Cache for 1 hour with stale-while-revalidate

**Usage:** Populate location dropdowns in the calculator UI

---

### 2. GET /api/service-locations

**Description:** Returns locations where standard transfers are provided (from/to Podgorica).

**Method:** `GET`

**Authentication:** None

**Request:** No parameters required

**Response (200 OK):**
```json
{
  "serviceLocations": [
    "Ada Bojana",
    "Virpazar",
    "Tivat Airport",
    // ... (17 locations total)
  ]
}
```

**Response Type:**
```typescript
{
  serviceLocations: readonly string[]
}
```

**Error Responses:** None (always returns 200)

**Caching:** This endpoint is ideal for caching (data changes infrequently)
- Client-side: Cache for 24 hours
- CDN: Cache for 1 hour with stale-while-revalidate

**Usage:** Determine which locations support standard transfers (paired with Podgorica locations)

---

### 3. GET /api/day-trips

**Description:** Returns all available day trip packages.

**Method:** `GET`

**Authentication:** None

**Request:** No parameters required

**Response (200 OK):**
```json
{
  "dayTrips": [
    {
      "id": "day-trip-1",
      "name": "Day Trip 1",
      "description": "Placeholder for future trip"
    },
    // ... (5 day trips total)
  ]
}
```

**Response Type:**
```typescript
{
  dayTrips: readonly {
    id: string;
    name: string;
    description: string;
  }[]
}
```

**Error Responses:** None (always returns 200)

**Caching:** This endpoint is ideal for caching (data changes infrequently)
- Client-side: Cache for 24 hours
- CDN: Cache for 1 hour with stale-while-revalidate

**Usage:** Populate day trip options in the calculator UI

**Note:** Current entries are placeholders. Will be updated with real trip data.

---

### 4. POST /api/calculate-price

**Description:** Calculates the price for a transfer or day trip. Returns price for standard transfers or indicates special request needed for unsupported routes.

**Method:** `POST`

**Authentication:** None (will be added when lead collection is implemented)

**Request Body (Transfer):**
```json
{
  "serviceType": "transfer",
  "date": "2026-04-15",
  "passengers": 4,
  "start": "Podgorica Airport",
  "end": "Kotor"
}
```

**Request Body (Day Trip):**
```json
{
  "serviceType": "dayTrip",
  "date": "2026-04-15",
  "days": 3,
  "passengers": 4,
  "tripId": "day-trip-1"
}
```

**Request Type:**
```typescript
{
  serviceType: "transfer" | "dayTrip";
  date: string; // ISO 8601 format (YYYY-MM-DD)
  days?: number; // Required if serviceType is "dayTrip"
  passengers: number;
  start: string; // Required if serviceType is "transfer"
  end: string; // Required if serviceType is "transfer"
  tripId?: string; // Optional, for dayTrip selection
}
```

**Validation Rules:**

| Field | Rule |
|-------|------|
| `serviceType` | Required. Must be "transfer" or "dayTrip" |
| `date` | Required. Must be valid future date (ISO 8601) |
| `days` | Required if serviceType is "dayTrip". Must be >= 1 |
| `passengers` | Required. Must be >= seasonal minimum |
| `passengers` (season) | April-October: min 4, November-March: min 2 |
| `start` | Required for "transfer". Must be in locations list. Must NOT be provided for "dayTrip" |
| `end` | Required for "transfer". Must be in locations list. Must NOT be provided for "dayTrip" |
| `tripId` | Required for "dayTrip". Must NOT be provided for "transfer" |

**Response 200 OK (Standard Transfer):**
```json
{
  "price": 120.50,
  "currency": "EUR",
  "details": "Transfer from Podgorica Airport to Kotor for 4 passenger(s)"
}
```

**Response Type (Standard Transfer):**
```typescript
{
  price: number;
  currency: "EUR";
  details: string;
}
```

**Response 200 OK (Special Request):**
```json
{
  "specialRequest": true,
  "message": "This route requires a special request. Please provide your contact information and we will get back to you."
}
```

**Response Type (Special Request):**
```typescript
{
  specialRequest: true;
  message: string;
}
```

**Response 200 OK (Day Trip):**
```json
{
  "price": 345.00,
  "currency": "EUR",
  "details": "Day trip for 3 day(s) with 4 passenger(s)"
}
```

**Response Type (Day Trip):**
```typescript
{
  price: number;
  currency: "EUR";
  details: string;
}
```

**Error Response 400 (Validation Error):**
```json
{
  "error": "Invalid request",
  "details": [
    "serviceType is required and must be 'transfer' or 'dayTrip'",
    "date must be in the future",
    "Minimum 4 passengers required for the selected date (season)"
  ]
}
```

**Error Response Type:**
```typescript
{
  error: string;
  details: string | string[];
}
```

**Error Response 500 (Server Error):**
```json
{
  "error": "Internal server error",
  "details": "Error message"
}
```

**HTTP Status Codes:**
- `200` - Success (price calculated or special request indicated)
- `400` - Bad Request (validation failed)
- `500` - Internal Server Error

**Caching:** This endpoint should NOT be cached (personalized calculations)

**Rate Limiting:** Consider implementing rate limiting (e.g., 100 requests per IP per hour) to prevent abuse

**Future Enhancements:**
- Store special request inquiries in database with contact info
- Add authentication for storing user preferences
- Add email notification for special requests
- Implement actual pricing algorithm based on distance/route data

---

## Business Logic

### Standard Transfer Routes
Standard transfers are supported for routes where one endpoint is a Podgorica location and the other is a service location:

**Podgorica Locations:**
- Podgorica
- Podgorica Airport
- Podgorica Bus Station
- Podgorica Train Station

**Service Locations:**
- Ada Bojana, Virpazar, Tivat Airport, Verusa, Petrovac, Pluzine, Sveti Stefan, Rijeka Crnojevica, Podgorica, Podgorica Airport, Podgorica Bus Station, Podgorica Train Station, Ostrog Monastery, Danilovgrad, Bar, Bar Port, Bar Train Station

Any other route combination requires a special request.

### Seasonal Passenger Minimums
- **April to October:** Minimum 4 passengers
- **November to March:** Minimum 2 passengers

### Price Calculation (Current Implementation)
**Transfers:**
```
price = 50 (base) + (1.5 * 20) (distance factor) + (passengers * 10)
```

**Day Trips:**
```
price = (100 * days) + (passengers * 15)
```

**Note:** Current pricing is mock data. Will be replaced with real pricing algorithm.

---

## Error Handling Best Practices

1. **Always return JSON** - Even for errors
2. **Use appropriate HTTP status codes** - 400 for validation, 500 for server errors
3. **Provide detailed error messages** - Help clients understand what went wrong
4. **Return error arrays** - Multiple validation errors in one response
5. **Never expose sensitive data** - Don't leak stack traces or internal paths in production

---

## Best Practices Implemented

### ✅ Current Implementation
- [x] RESTful endpoint design
- [x] TypeScript types for request/response
- [x] Comprehensive validation
- [x] Clear error messages
- [x] Consistent JSON responses
- [x] Separation of concerns (data in utils, routes in app/api)

### 📋 Future Considerations
- [ ] API versioning (/api/v1/...)
- [ ] Rate limiting
- [ ] Authentication (for lead storage)
- [ ] Request logging
- [ ] Response compression
- [ ] CORS configuration
- [ ] Pagination (for future inquiry history endpoints)
- [ ] OpenAPI/Swagger documentation generation

---

## Testing

Each endpoint should have:
1. **Happy path tests** - Valid requests return expected responses
2. **Validation tests** - Invalid inputs return 400 with clear errors
3. **Edge case tests** - Boundary conditions (min passengers, date edge cases, etc.)

See test files in `__tests__/` directory for implementation.

---

## Related Files

- **API Routes:** `src/app/api/*/route.ts`
- **Data Constants:** `src/utils/calculator-data.ts`
- **Requirements:** `API-CALCULATOR-REQUIREMENTS.md`
- **Project Plan:** `PLAN.md`
- **Main Documentation:** `README.md`
