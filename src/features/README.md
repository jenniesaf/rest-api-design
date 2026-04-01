# Features

This folder contains self-contained feature modules, each with its own domain-specific logic.

**Purpose:** Each subfolder represents a feature (e.g., calculator, user-management) and replicates the root structure internally for its own domain-specific needs (e.g., features/calculator/components, features/calculator/utils).

**Dependency Rules:** 
- Features CAN import from the Shared Layer (api, database, components, utils, etc.).
- Features CANNOT import from the App layer or other Features.
- Each feature should be self-contained and isolated.

For more details on folder structure and rules, see [README.md](../../README.md).
