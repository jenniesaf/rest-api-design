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

1. **Project Initialization**
   - Set up Next.js 16, Tailwind CSS, Shadcn/UI, Prisma
   - Initialize git, .gitignore, .env.local
   - Add project description to README.md

2. **Documentation**
   - Create comprehensive README.md (onboarding, code style, workflow, folder structure, learning protocol)
   - Reference PLAN.md in README.md and vice versa

3. **Folder Structure Setup**
   - Implement fractal, layered folder structure:
     - /src/api, /src/database, /src/components, /src/utils, /src/assets, /src/hooks, /src/services (Shared Layer)
     - /src/features (Features Layer, with subfolders for each feature)
     - /src/app (App Layer)
   - Add placeholder README.md in each major folder

4. **Mock API Integration**
   - Set up /src/api routes to proxy/mock data from jsonplaceholder.typicode.com
   - Document endpoints in README.md

5. **Testing & SDD Workflow**
   - Write tests before feature logic (happy path + edge cases)
   - Use SDD: tests → minimal implementation → refactor
   - Document process and examples in README.md

6. **Commit & CI/CD Setup**
   - Enforce Conventional Commits (commitlint/husky)
   - Add scripts for typecheck and tests pre-commit
   - Document workflow in README.md

7. **Verification & Best Practices**
   - Check folder structure, commit format, test-first development, no secrets in code, env usage

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
