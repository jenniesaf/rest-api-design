# Code Review Guidelines

This document defines the code review standards for this project. Use these guidelines when reviewing code or requesting AI-assisted code analysis.

---

## Review Objectives

When reviewing code, focus on:

- **Problem Solving**: Identify better patterns, simplify logic, and recommend more effective approaches.
- **Efficiency**: Suggest performance optimizations and reduced re-renders (React/Next).
- **Consistency**: Enforce naming conventions, structure, and style consistency across the file.
- **Refactoring**: Recommend clear refactor steps that improve readability, maintainability, and testability.
- **Error Detection**: Flag potential bugs, edge cases, missing null checks, or TypeScript issues.
- **Comments**: Suggest concise inline comments where needed.

---

## Coding Standards

Apply the following rules to all code reviews and implementations:

### Functional Programming
- Prefer pure functions, immutability, `map/filter/reduce`.
- Avoid mutation and avoid `let` where possible.
- Use early returns; keep happy path at bottom.

### React/Next.js
- Components should be small, composable, and single-purpose.
- Keep state local; avoid unnecessary context.
- Use clear prop names: `isX`, `hasX`, `shouldX`, `onX`, `handleX`.
- Use TailwindCSS only — no inline styles.
- Ensure accessibility: aria tags, keyboard nav, focus handling.
- Use Next.js `<Image>` instead of `<img>`.

### TypeScript
- Prefer `type` over `interface` unless necessary.
- Avoid `any` and `!` non-null assertions.
- Always type function returns.
- Use discriminated unions for complex state.
- No implicit type widening or unsafe casting.

### Error Handling & API
- API logic must be isolated.
- Never pass raw backend DTOs to UI.
- Map API responses to internal types.
- Throw typed errors.
- Avoid silent failures.

### CSS & Styling
- Use CSS Logical Properties only (see [README.md](./README.md#style))
- NEVER use 'left'/'right' - use 'start', 'end', 'inline', 'block'
- TailwindCSS only, no inline styles

---

## Review Deliverables

Every code review should provide:

1. **Summary of Issues**: High-level overview of problems found
2. **Specific Corrections**: Code-level fixes with line references
3. **Suggested Refactors**: Examples of improved patterns
4. **Naming Improvements**: Better variable/function names where applicable
5. **Code Snippets**: Updated code examples
6. **Bugs & Risks**: Potential issues or edge cases
7. **Performance Suggestions**: React/Next.js optimizations (memoization, lazy loading, etc.)
8. **Test Cases** (optional): Propose test scenarios if relevant

---

## AI-Assisted Code Review Prompt

Use this prompt when requesting AI code reviews:

```
You are assisting with a senior-level code review. Analyze the provided code and give explicit, actionable recommendations.

[Review Objectives and Coding Standards from above]

Focus on clarity and actionable improvements.
```

---

For project-specific style rules (RTL, logical properties), see [README.md](./README.md).  
For commit standards, see [CONVENTIONAL_COMMITS_SETUP.md](./CONVENTIONAL_COMMITS_SETUP.md).  
For testing philosophy, see [README.md](./README.md#testing-philosophy).
