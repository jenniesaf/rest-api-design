# Project Plan: REST API Design

This document records the initial project plan, milestones, and rationale for the REST API design project. It preserves the original vision and best practices for future reference and transparency.

---

## TL;DR
- Next.js 16 (App Router), Tailwind CSS, Shadcn/UI, Prisma
- Strict, fractal folder structure with clear dependency rules
- Jennie’s code style, commit, and testing philosophy enforced
- All milestones and best practices documented here and in README.md
- README.md is the main onboarding and rules document; PLAN.md preserves project origins and rationale

---

## Milestones

1. **Project Initialization** ✅
   - Set up Next.js 16, Tailwind CSS, Shadcn/UI, Prisma
   - Initialize git, .gitignore, .env.local
   - Add project description to README.md
   - Set up commitlint + husky for Conventional Commits enforcement (see [CONVENTIONAL_COMMITS_SETUP.md](./CONVENTIONAL_COMMITS_SETUP.md))

2. **Documentation** ✅
   - Create comprehensive README.md (onboarding, code style, workflow, folder structure, learning protocol)
   - Create PLAN.md for project vision and milestones
   - Create API-CALCULATOR-REQUIREMENTS.md for business requirements
   - Create API-DOCUMENTATION.md for endpoint specifications

3. **Folder Structure Setup** ✅
   - Implement fractal, layered folder structure:
     - /src/api, /src/database, /src/components, /src/utils, /src/assets, /src/hooks, /src/services (Shared Layer)
     - /src/features (Features Layer, with subfolders for each feature)
     - /src/app (App Layer)
   - Add placeholder README.md in each major folder

4. **API Implementation** ✅
   - Define calculator data constants (locations, service locations, day trips)
   - Implement GET endpoints:
     - GET /api/locations
     - GET /api/service-locations
     - GET /api/day-trips
   - Implement POST endpoints:
     - POST /api/transfer-price (with special request handling)
     - POST /api/daytrip-price
   - Add strict validation with discriminated union types
   - Implement business logic (seasonal minimums, standard routes)
   - Document rate limiting strategy (middleware pattern)

5. **Testing & SDD Workflow** ✅
   - Set up testing infrastructure (Jest/Vitest)
   - Write tests before feature logic (happy path + edge cases)
   - Test all API endpoints:
     - GET endpoints (locations, service-locations, day-trips)
     - POST endpoints (transfer-price, daytrip-price)
     - Validation logic
     - Business logic (route checking, seasonal minimums, price calculations)
   - Use SDD: tests → minimal implementation → refactor
   - Document process and examples in README.md

6. **Frontend UI Implementation** ✅
   - Create calculator feature module in /src/features/calculator
   - Build calculator form component:
     - Service type selector (Transfer/Day Trip)
     - Date picker with validation
     - Passenger input with seasonal minimums
     - Location dropdowns (integrated with GET /api/locations)
     - Days input (for day trips)
     - Trip selector (for day trips)
   - Integrate with API endpoints:
     - Fetch locations/trips on component mount
     - Submit to POST /api/transfer-price or /api/daytrip-price
     - Display price results
     - Handle special request flow (show contact form)
   - Error handling and user feedback
   - Responsive design with Tailwind CSS
   - Use Shadcn/UI components (Form, Select, Input, Button, etc.)
   - Follow Jennie's code style (RTL, logical properties)

7. **Commit & CI/CD Setup** ✅
   - Enforce Conventional Commits (commitlint/husky)
   - Add scripts for typecheck and tests pre-commit
   - Configure GitHub Actions for CI/CD
   - Document workflow in README.md

8. **Verification & Best Practices** (Ongoing)
   - Check folder structure, commit format, test-first development, no secrets in code, env usage
   - Code reviews and refactoring
   - Follow code review guidelines (see [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md))
   - Enforce TypeScript, React/Next.js, and functional programming standards
   
9. **Booking/Contact Form with Progressive Disclosure** (In Progress)
   - Add contact/booking form that appears after users see price result
   - Progressive disclosure pattern: Result → Button → Form → Submit → Thank You
   - Same flow for both special requests and regular prices
   
   **Phase 1: Types & State Management**
   - Create contact form types in `src/features/calculator/types/index.ts`:
     - `ContactFormData` (name, email, phone, message)
     - `ContactFormErrors` (field-specific errors with `?`)
     - `BookingStatus` ('idle' | 'form-visible' | 'submitting' | 'success' | 'error')
   - Add state to Calculator component: `bookingStatus`, `contactFormData`, `contactErrors`
   
   **Phase 2: UI Components**
   - Add "Book Now" / "Request Quote" button to result display
   - Create contact form section (Name, Email, Phone, Message optional)
   - Inline field errors matching calculator form pattern
   - Create thank you message with "Start New Calculation" button
   
   **Phase 3: Validation & API**
   - Implement contact form validation (email format, phone format)
   - Create `/api/booking` endpoint (POST)
   - Validate input, save booking data, send notifications
   - Handle success/error responses
   
   **Files to modify/create:**
   - `src/features/calculator/types/index.ts` — Add new types
   - `src/features/calculator/components/Calculator.tsx` — Add booking UI and logic
   - `src/app/api/booking/route.ts` — NEW endpoint
   - `src/app/api/booking/__tests__/route.test.ts` — NEW tests
---

## Rationale
- README.md is the main onboarding and rules doc for contributors
- PLAN.md preserves the project’s origin, vision, and milestone history
- Both files cross-reference for clarity and transparency

---

## Next Steps
- Follow milestones in order, committing and pushing after each
- Review and approve each step before proceeding

---

For details on code style, workflow, and learning protocol, see README.md.
