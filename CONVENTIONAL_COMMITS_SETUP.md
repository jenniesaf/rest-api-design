# Conventional Commits + Commitlint + Husky Setup

This project enforces Conventional Commits from the very beginning using commitlint and husky. This ensures all commit messages are standardized, enabling reliable automation, changelogs, and collaboration.

## How It Works
- **commitlint** checks every commit message for Conventional Commits compliance.
- **husky** sets up a `commit-msg` git hook to run commitlint automatically before each commit.
- If a commit message does not follow the rules, the commit is blocked until fixed.

## Setup Steps (for new projects)
1. Install dependencies:
   ```sh
   npm install --save-dev husky @commitlint/config-conventional @commitlint/cli
   ```
2. Initialize husky:
   ```sh
   npx husky-init && npm install
   ```
3. Add the commit-msg hook:
   ```sh
   npx husky add .husky/commit-msg 'npx --no -- commitlint --edit $1'
   ```
   Note: Use single quotes and `$1` (shell variable) on all platforms, as husky hooks run in sh/bash even on Windows.
4. Add commitlint config (`commitlint.config.js`):
   ```js
   module.exports = { extends: ['@commitlint/config-conventional'] };
   ```
5. Update pre-commit hook (`.husky/pre-commit`) to run typecheck and tests:
   ```sh
   #!/usr/bin/env sh
   . "$(dirname -- "$0")/_/husky.sh"
   
   npm run typecheck
   npm run test
   ```
6. Add typecheck script to `package.json`:
   ```json
   "scripts": {
     "typecheck": "tsc --noEmit",
     ...
   }
   ```
7. The `prepare` script is automatically added by husky-init:
   ```json
   "prepare": "husky install"
   ```
8. Add a note to README.md and PLAN.md about commit enforcement.

## Commit Message Format
- `<type>(<scope>): <description>`
- Example: `feat(api): add price calculation endpoint`

## Types
- feat, fix, docs, style, refactor, test, chore

---

**This setup should be included at project initialization for all future projects.**
