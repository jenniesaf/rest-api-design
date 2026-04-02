---

# Project Overview
A well-structured REST API design project using Next.js 16, Tailwind CSS, Shadcn/UI, and Prisma, following strict code style, testing, and workflow best practices with mock data integration.

For the full project plan and milestones, see [PLAN.md](./PLAN.md).

---

# Milestones
See [PLAN.md](./PLAN.md) for the full milestone breakdown and rationale.

---

# Folder Structure & Dependency Rules

- **Shared Layer** (`src/` root):
  - `/api`, `/database`, `/components`, `/utils`, `/assets`, `/hooks`, `/services`
  - Domain-agnostic, reusable by any feature or app layer
- **Features Layer** (`src/features`):
  - Each subfolder is a self-contained module (e.g., `features/todo-list`)
  - Each feature replicates the root structure for its own logic
- **App Layer** (`src/app`):
  - Next.js routing and layouts, composes pages from Features and Shared

**Dependency Rules:**
- Shared is the base: CANNOT import from Features or App
- Features CAN import from Shared, but NOT from App or other Features
- App CAN import from both Features and Shared
- Direction: Shared → Features → App (never reverse)

---

# Jennie's Custom Code Style (Non-Negotiable)

## Style
- **RTL & Logical Properties:** NEVER use 'left'/'right'. ALWAYS use CSS Logical Properties: 'start', 'end', 'inline', 'block'.

## Git Workflow & Commits
- **Conventional Commits:** All commit messages must follow the Conventional Commits specification.
- **Format:** `<type>(<scope>): <description>`
- **Types:**
  - `feat`: A new feature.
  - `fix`: A bug fix.
  - `docs`: Documentation only changes.
  - `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc).
  - `refactor`: A code change that neither fixes a bug nor adds a feature.
  - `test`: Adding missing tests or correcting existing tests.
  - `chore`: Changes to the build process or auxiliary tools and libraries.
- **Example:** `feat(logic): implement happy-path return for todo validation`
- **Commit Enforcement:** This project uses commitlint + husky to enforce Conventional Commits from the start. See [CONVENTIONAL_COMMITS_SETUP.md](./CONVENTIONAL_COMMITS_SETUP.md) for setup and usage details.
- **CI/CD:** GitHub Actions automatically runs type checks, linting, tests, and builds on every push and PR. See [CI_CD_SETUP.md](./CI_CD_SETUP.md) for details.

## Testing Philosophy

### Spec-Driven Development (SDD)
- Define the Spec: Before writing any feature logic, you MUST create a comprehensive test suite (Happy Path + at least two Edge Cases).
- Prevent Confirmatory Bias: Write tests first, then code.
- Workflow: Create test file → implement minimal logic to pass tests (Green State) → refactor while maintaining Green state.

---

# Learning Protocol
1. Before implementing any feature, explain which Next.js pattern you are using and why.
2. If a Skill provides a specific Best Practice, quote the reasoning briefly so I can learn it.
3. When using find-skills, prioritize vercel-labs, if not found you may use the communities skills.

---

# Tech Stack Reference
- Framework: Next.js 16 (App Router)
- Styling: Tailwind CSS
- Components: Shadcn/UI
- Database: Prisma

---

# Code Review & Quality Standards
For detailed code review guidelines, TypeScript best practices, and quality standards, see [CODE_REVIEW_GUIDELINES.md](./CODE_REVIEW_GUIDELINES.md).

---

# Do Not
- Store secrets in code (use environment variables)
- Commit without running typecheck and tests

---

# Mock API Data
- Mock data is sourced from https://jsonplaceholder.typicode.com/
- API routes will proxy/mock this data for local development and testing

---

# For full project plan and rationale, see [PLAN.md](./PLAN.md)
