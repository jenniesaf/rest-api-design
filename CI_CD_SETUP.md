# CI/CD Setup with GitHub Actions

This project uses GitHub Actions to automatically run checks on every push and pull request, ensuring code quality and preventing bugs from reaching the main branch.

## What Gets Checked
Every push and PR triggers automated checks for:
- **Type checking** (`npm run typecheck`): Ensures TypeScript code is type-safe
- **Linting** (`npm run lint`): Checks code style and potential errors
- **Tests** (`npm run test`): Runs all unit tests to verify functionality
- **Build** (`npm run build`): Ensures the project builds successfully

## Workflow File
The CI workflow is defined in `.github/workflows/ci.yml`.

## How It Works
1. Code is pushed to GitHub or a PR is created
2. GitHub Actions automatically triggers the CI workflow
3. The workflow runs on Ubuntu with Node.js 20.x
4. All checks must pass before code can be merged
5. If any check fails, the PR is marked as failing and cannot be merged

## Local Pre-Commit Checks
Before you even push, husky runs local checks on your machine:
- **Pre-commit hook** (`.husky/pre-commit`): Runs typecheck and tests before each commit
- **Commit-msg hook** (`.husky/commit-msg`): Validates commit message format

This two-layer approach (local + CI) ensures high code quality and fast feedback.

## Benefits
- Catches bugs early, before they reach production
- Ensures consistent code quality across all contributors
- Automates manual review tasks
- Prevents broken code from being merged
- Speeds up code review by validating basics automatically

## For New Projects
Copy `.github/workflows/ci.yml` to your new project and ensure you have the required scripts in `package.json`:
- `typecheck`
- `lint`
- `test`
- `build`
