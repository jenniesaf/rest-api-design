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

### 4. POST /api/transfer-price

**Description:** Calculates the price for a transfer. Returns price for standard transfers or indicates special request needed for unsupported routes.

**Method:** `POST`

**Authentication:** None (will be added when lead collection is implemented)

**Request Body:**
```json
{
  "date": "2026-04-15",
  "passengers": 4,
  "start": "Podgorica Airport",
  "end": "Kotor"
}
```

**Request Type:**
```typescript
{
  date: string; // ISO 8601 format (YYYY-MM-DD)
  passengers: number;
  start: string;
  end: string;
}
```

**Validation Rules:**

| Field | Rule |
|-------|------|
| `date` | Required. Must be valid future date (ISO 8601) |
| `passengers` | Required. Must be >= seasonal minimum |
| `passengers` (season) | April-October: min 4, November-March: min 2 |
| `start` | Required. Must be in locations list |
| `end` | Required. Must be in locations list |

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

**Error Response 400 (Validation Error):**
```json
{
  "error": "Invalid request",
  "details": [
    "date must be in the future",
    "start location is not valid",
    "Minimum 4 passengers required for the selected date (season)"
  ]
}
```

**Note:** The `details` array contains ALL validation errors found in the request. The seasonal passenger minimum message changes based on the date:
- **April-October:** "Minimum 4 passengers required for the selected date (season)"
- **November-March:** "Minimum 2 passengers required for the selected date (season)"
```

**Error Response Type:**
```typescript
{
  error: string;
  details: string[];
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
- Add email notification for special requests
- Implement actual pricing algorithm based on distance/route data

---

### 5. POST /api/daytrip-price

**Description:** Calculates the price for a day trip package.

**Method:** `POST`

**Authentication:** None (will be added when lead collection is implemented)

**Request Body:**
```json
{
  "date": "2026-04-15",
  "days": 3,
  "passengers": 4,
  "tripId": "day-trip-1"
}
```

**Request Type:**
```typescript
{
  date: string; // ISO 8601 format (YYYY-MM-DD)
  days: number;
  passengers: number;
  tripId: string;
}
```

**Validation Rules:**

| Field | Rule |
|-------|------|
| `date` | Required. Must be valid future date (ISO 8601) |
| `days` | Required. Must be >= 1 |
| `passengers` | Required. Must be >= seasonal minimum |
| `passengers` (season) | April-October: min 4, November-March: min 2 |
| `tripId` | Required. Must match an available day trip |

**Response 200 OK:**
```json
{
  "price": 345.00,
  "currency": "EUR",
  "details": "Day trip for 3 day(s) with 4 passenger(s)",
  "tripId": "day-trip-1"
}
```

**Response Type:**
```typescript
{
  price: number;
  currency: "EUR";
  details: string;
  tripId: string;
}
```

**Error Response 400 (Validation Error):**
```json
{
  "error": "Invalid request",
  "details": [
    "date must be in the future",
    "days is required and must be at least 1",
    "Minimum 2 passengers required for the selected date (season)"
  ]
}
```

**Note:** The `details` array contains ALL validation errors found in the request. The seasonal passenger minimum message changes based on the date:
- **April-October:** "Minimum 4 passengers required for the selected date (season)"
- **November-March:** "Minimum 2 passengers required for the selected date (season)"
```

**Error Response Type:**
```typescript
{
  error: string;
  details: string[];
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
- `200` - Success (price calculated)
- `400` - Bad Request (validation failed)
- `500` - Internal Server Error

**Caching:** This endpoint should NOT be cached (personalized calculations)

**Rate Limiting:** Consider implementing rate limiting (e.g., 100 requests per IP per hour) to prevent abuse

**Future Enhancements:**
- Add authentication for storing user preferences
- Implement actual pricing algorithm based on trip complexity
- Add trip availability calendar

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
**Transfer Endpoint (/api/transfer-price):**
```
price = 50 (base) + (1.5 * 20) (distance factor) + (passengers * 10)
```

**Day Trip Endpoint (/api/daytrip-price):**
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
- [ ] Rate limiting (see recommended pattern below)
- [ ] Authentication (for lead storage)
- [ ] Request logging
- [ ] Response compression
- [ ] CORS configuration
- [ ] Pagination (for future inquiry history endpoints)
- [ ] OpenAPI/Swagger documentation generation

---

## Rate Limiting - Recommended Implementation Pattern

**Best Practice: Middleware + Edge-Compatible Store**

For this project, the recommended approach is:

```
Middleware (middleware.ts) + Upstash Redis or Vercel KV
```

### Why This Approach?

✅ **Benefits:**
1. **Protects ALL API routes** - Blocks abusive requests before they reach business logic
2. **Edge Runtime** - Runs fast on Vercel's edge network (globally distributed)
3. **Scalable** - Works in serverless/multi-instance deployments
4. **Centralized** - One place to configure rate limits for all endpoints
5. **Industry Standard** - Used by major APIs (Stripe, GitHub, Twitter API)

### Implementation Pattern

**File: `middleware.ts` (root level)**
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Configure rate limit (100 requests per hour per IP)
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '1 h'),
  analytics: true,
});

export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      {
        error: 'Rate limit exceeded',
        details: 'Too many requests. Please try again later.',
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        },
      }
    );
  }

  // Add rate limit headers to successful responses
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());
  response.headers.set('X-RateLimit-Reset', reset.toString());
  return response;
}

export const config = {
  // Only apply rate limiting to POST endpoints (computational/expensive)
  // GET endpoints serve static/cacheable data and don't need rate limiting
  matcher: [
    '/api/transfer-price',
    '/api/daytrip-price',
  ],
};
```

**Install dependencies:**
```bash
npm install @upstash/ratelimit @upstash/redis
```

**Environment variables (.env.local):**
```
UPSTASH_REDIS_REST_URL=your_upstash_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_token
```

### Why NOT Other Approaches?

❌ **In-memory Map** 
- Doesn't work in serverless (data lost between deployments/instances)
- Not shared across multiple servers

❌ **Database (Prisma/PostgreSQL)**
- Too slow for rate limiting checks
- Not edge-compatible
- Adds unnecessary load to your main database

❌ **Per-route logic**
- Code duplication across endpoints
- Requests still hit your API handlers before being rejected
- Harder to maintain consistent limits

### Rate Limit Headers (Standard)

When rate limiting is implemented, include these headers in ALL responses:

- `X-RateLimit-Limit`: Total allowed requests in the time window
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Unix timestamp when the limit resets

**Example Response Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1711900800
```

### Alternative: Different Limits Per Endpoint Type

If you want to protect GET endpoints with more permissive limits:

```typescript
export async function middleware(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  const path = request.nextUrl.pathname;
  
  // Strict limit for POST endpoints
  if (path.startsWith('/api/transfer-price') || path.startsWith('/api/daytrip-price')) {
    const { success, limit, remaining, reset } = await strictRatelimit.limit(ip);
    // ... handle rate limit
  }
  
  // Permissive limit for GET endpoints (optional)
  else if (path.startsWith('/api/')) {
    const { success, limit, remaining, reset } = await permissiveRatelimit.limit(ip);
    // ... handle rate limit
  }
}

// Configure separate rate limiters
const strictRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(50, '1 h'),
});

const permissiveRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(500, '1 h'),
});
```

### Recommended Limits for This Project

**Rate Limited Endpoints:**
- **POST /api/transfer-price** - 50-100 requests/hour (computational, special request handling)
- **POST /api/daytrip-price** - 50-100 requests/hour (computational)

**Excluded from Rate Limiting (Recommended):**
- **GET /api/locations** - Static data, should be cached by client/CDN
- **GET /api/service-locations** - Static data, should be cached by client/CDN
- **GET /api/day-trips** - Static data, should be cached by client/CDN

**Rationale:**
- GET endpoints return static, cacheable data that changes infrequently
- No computational cost or abuse risk
- Better user experience (no artificial limits on reference data)
- POST endpoints perform calculations and may eventually store data (abuse risk)

### Testing Rate Limits

```bash
# Test rate limiting manually
for i in {1..101}; do curl -X POST http://localhost:3000/api/transfer-price; done
```

### Production Alternatives

1. **Vercel Built-in Rate Limiting** - Available on Pro/Enterprise plans
2. **Cloudflare Rate Limiting** - If using Cloudflare as CDN/proxy
3. **API Gateway** - AWS API Gateway, Azure API Management, etc.

### References

- [Upstash Rate Limiting](https://upstash.com/docs/redis/features/ratelimiting)
- [Vercel Edge Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [RFC 6585 - HTTP 429 Status Code](https://tools.ietf.org/html/rfc6585#section-4)

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
